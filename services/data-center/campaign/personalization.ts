/**
 * Personalization Engine
 *
 * Stage 6: Campaign Prep
 *
 * Handles:
 * - Token detection and replacement
 * - Fallback values
 * - Text transformations
 * - Multi-language support (Arabic/English)
 */

import { NormalizedLeadObject } from '../types';
import {
  PersonalizationToken,
  PERSONALIZATION_TOKENS,
  CampaignTemplate,
} from './types';

// ==========================================
// PERSONALIZATION ENGINE
// ==========================================

export class PersonalizationEngine {
  private tokens: PersonalizationToken[];

  constructor(customTokens?: PersonalizationToken[]) {
    this.tokens = customTokens || PERSONALIZATION_TOKENS;
  }

  /**
   * Personalize a template for a specific lead
   */
  personalize(
    template: string,
    lead: NormalizedLeadObject,
    options?: {
      fallback_empty?: boolean;  // Use fallback for empty values
      preserve_unknown?: boolean; // Keep unknown tokens as-is
    }
  ): string {
    let result = template;
    const opts = {
      fallback_empty: true,
      preserve_unknown: false,
      ...options,
    };

    // Find all tokens in template
    const tokenPattern = /\{\{([^}]+)\}\}/g;
    const matches = result.matchAll(tokenPattern);

    for (const match of matches) {
      const fullToken = match[0];  // e.g., {{first_name}}
      const tokenName = match[1];  // e.g., first_name

      // Find token definition
      const tokenDef = this.tokens.find(
        t => t.token === fullToken || t.field === tokenName
      );

      let value: string | null = null;

      if (tokenDef) {
        // Get value from lead
        value = this.getFieldValue(lead, tokenDef.field);

        // Apply transform
        if (value && tokenDef.transform) {
          value = this.applyTransform(value, tokenDef.transform);
        }

        // Use fallback if empty
        if (!value && opts.fallback_empty && tokenDef.fallback) {
          value = tokenDef.fallback;
        }
      } else {
        // Try direct field access for unknown tokens
        value = this.getFieldValue(lead, tokenName);
      }

      // Replace token
      if (value !== null) {
        result = result.replace(fullToken, value);
      } else if (!opts.preserve_unknown) {
        result = result.replace(fullToken, '');
      }
    }

    // Clean up extra spaces
    result = result.replace(/\s+/g, ' ').trim();

    return result;
  }

  /**
   * Personalize email subject and body
   */
  personalizeEmail(
    lead: NormalizedLeadObject,
    template: CampaignTemplate
  ): { subject: string; body: string } {
    return {
      subject: template.subject
        ? this.personalize(template.subject, lead)
        : '',
      body: this.personalize(template.body, lead),
    };
  }

  /**
   * Get field value from lead
   */
  private getFieldValue(
    lead: NormalizedLeadObject,
    field: string
  ): string | null {
    // Handle nested fields (e.g., company.name)
    const parts = field.split('.');
    let value: any = lead;

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part as keyof typeof value];
      } else {
        return null;
      }
    }

    if (value === null || value === undefined) {
      return null;
    }

    return String(value);
  }

  /**
   * Apply text transformation
   */
  private applyTransform(
    value: string,
    transform: PersonalizationToken['transform']
  ): string {
    switch (transform) {
      case 'uppercase':
        return value.toUpperCase();
      case 'lowercase':
        return value.toLowerCase();
      case 'capitalize':
        return this.capitalize(value);
      default:
        return value;
    }
  }

  /**
   * Capitalize first letter of each word
   */
  private capitalize(str: string): string {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Extract tokens used in a template
   */
  extractTokens(template: string): string[] {
    const tokenPattern = /\{\{([^}]+)\}\}/g;
    const matches = template.matchAll(tokenPattern);
    const tokens: string[] = [];

    for (const match of matches) {
      const token = `{{${match[1]}}}`;
      if (!tokens.includes(token)) {
        tokens.push(token);
      }
    }

    return tokens;
  }

  /**
   * Validate template - check all tokens have values for a lead
   */
  validateTemplate(
    template: string,
    lead: NormalizedLeadObject
  ): {
    valid: boolean;
    missing_tokens: string[];
    warnings: string[];
  } {
    const tokens = this.extractTokens(template);
    const missing: string[] = [];
    const warnings: string[] = [];

    for (const token of tokens) {
      const tokenDef = this.tokens.find(t => t.token === token);
      const fieldName = token.replace(/[{}]/g, '');

      if (tokenDef) {
        const value = this.getFieldValue(lead, tokenDef.field);
        if (!value && !tokenDef.fallback) {
          missing.push(token);
        } else if (!value && tokenDef.fallback) {
          warnings.push(`${token} will use fallback: "${tokenDef.fallback}"`);
        }
      } else {
        const value = this.getFieldValue(lead, fieldName);
        if (!value) {
          missing.push(token);
        }
      }
    }

    return {
      valid: missing.length === 0,
      missing_tokens: missing,
      warnings,
    };
  }

  /**
   * Get available tokens with descriptions
   */
  getAvailableTokens(): PersonalizationToken[] {
    return this.tokens;
  }

  /**
   * Preview personalization for a lead
   */
  preview(
    template: string,
    lead: NormalizedLeadObject
  ): {
    original: string;
    personalized: string;
    tokens_replaced: { token: string; value: string }[];
    validation: ReturnType<typeof this.validateTemplate>;
  } {
    const tokens = this.extractTokens(template);
    const tokensReplaced: { token: string; value: string }[] = [];

    for (const token of tokens) {
      const tokenDef = this.tokens.find(t => t.token === token);
      const fieldName = token.replace(/[{}]/g, '');

      let value: string | null = null;

      if (tokenDef) {
        value = this.getFieldValue(lead, tokenDef.field);
        if (value && tokenDef.transform) {
          value = this.applyTransform(value, tokenDef.transform);
        }
        if (!value && tokenDef.fallback) {
          value = tokenDef.fallback;
        }
      } else {
        value = this.getFieldValue(lead, fieldName);
      }

      tokensReplaced.push({
        token,
        value: value || '[MISSING]',
      });
    }

    return {
      original: template,
      personalized: this.personalize(template, lead),
      tokens_replaced: tokensReplaced,
      validation: this.validateTemplate(template, lead),
    };
  }

  /**
   * Batch personalize for multiple leads
   */
  batchPersonalize(
    template: string,
    leads: NormalizedLeadObject[]
  ): {
    lead_id: string;
    personalized: string;
    valid: boolean;
  }[] {
    return leads.map(lead => ({
      lead_id: lead.id,
      personalized: this.personalize(template, lead),
      valid: this.validateTemplate(template, lead).valid,
    }));
  }

  /**
   * Generate icebreaker for LinkedIn/Email
   */
  generateIcebreaker(
    lead: NormalizedLeadObject,
    style: 'professional' | 'casual' | 'arabic' = 'professional'
  ): string {
    const name = lead.first_name || 'there';
    const company = lead.company_name || 'your company';
    const title = lead.title_normalized || 'professional';
    const industry = lead.industry || '';

    if (style === 'arabic') {
      return `مرحباً ${name}، لاحظت دورك كـ ${title} في ${company}. `;
    }

    if (style === 'casual') {
      return `Hey ${name}! Saw your work at ${company} - impressive stuff. `;
    }

    // Professional
    if (industry) {
      return `Hi ${name}, I noticed your role as ${title} at ${company} in the ${industry} space. `;
    }
    return `Hi ${name}, I came across your profile and was impressed by your experience as ${title} at ${company}. `;
  }
}

// ==========================================
// SINGLETON
// ==========================================

let personalizationInstance: PersonalizationEngine | null = null;

export const getPersonalizationEngine = (
  customTokens?: PersonalizationToken[]
): PersonalizationEngine => {
  if (!personalizationInstance || customTokens) {
    personalizationInstance = new PersonalizationEngine(customTokens);
  }
  return personalizationInstance;
};

export default PersonalizationEngine;
