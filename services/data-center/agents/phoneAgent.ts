/**
 * Phone Finder Agent
 *
 * Stage 5: Conditional Contactability Layer
 * Finds mobile/direct phone numbers for VIP leads
 *
 * GATED: Only runs if:
 * - ICP Verify = Yes
 * - Score >= 85 (VIP tier)
 * - OR WhatsApp/Call campaign is active
 *
 * Provider: Prospeo (10 credits per phone)
 */

import {
  AgentConfig,
  AgentInput,
  AgentOutput,
  PhoneFinderInput,
  PhoneFinderOutput,
  ProviderConfig,
} from './types';
import { BaseAgent, registerAgent } from './baseAgent';
import { NormalizedLeadObject } from '../types';

// ==========================================
// PHONE FINDER AGENT
// ==========================================

export class PhoneFinderAgent extends BaseAgent {
  constructor(config?: Partial<AgentConfig>) {
    super({
      id: 'phone_finder_agent',
      type: 'phone_finder',
      name: 'Phone Finder Agent',
      name_ar: 'وكيل البحث عن رقم الهاتف',
      description: 'Finds mobile/direct phone numbers for VIP leads only',

      providers: ['prospeo'],
      fallback_enabled: false,

      max_cost_per_record: 15,  // Phone costs 10 credits
      max_total_cost: 500,

      // GATED: VIP only (score >= 85)
      run_conditions: [
        { field: 'icp_status', operator: 'equals', value: 'Yes' },
        { field: 'icp_fit_score', operator: 'gt', value: 84 }, // Score >= 85
      ],

      // Skip if already has phone
      skip_conditions: [
        { field: 'phone_status', operator: 'equals', value: 'valid' },
      ],

      rate_limit_per_minute: 20,
      delay_between_calls_ms: 1500,

      ...config,
    });
  }

  /**
   * Check if should run - VIP gating
   */
  shouldRun(record: NormalizedLeadObject): { should_run: boolean; reason: string } {
    // Must have ICP verified as Yes
    if (record.icp_status !== 'Yes') {
      return {
        should_run: false,
        reason: `ICP Gate: status is "${record.icp_status}" (requires "Yes")`,
      };
    }

    // VIP threshold (85+)
    const vipThreshold = 85;
    if (!record.icp_fit_score || record.icp_fit_score < vipThreshold) {
      return {
        should_run: false,
        reason: `VIP Gate: Score ${record.icp_fit_score || 0} < ${vipThreshold} (phone only for VIP)`,
      };
    }

    // Skip if already has valid phone
    if (record.phone && record.phone_status === 'valid') {
      return {
        should_run: false,
        reason: 'Already has valid phone',
      };
    }

    // Need identifiers
    const hasIdentifiers =
      record.linkedin_url ||
      record.email ||
      (record.first_name && record.company_domain);

    if (!hasIdentifiers) {
      return {
        should_run: false,
        reason: 'Missing identifiers for phone lookup',
      };
    }

    return {
      should_run: true,
      reason: `VIP Lead: Score=${record.icp_fit_score}, needs phone`,
    };
  }

  /**
   * Run phone finder
   */
  protected async runEnrichment(
    input: AgentInput,
    output: AgentOutput
  ): Promise<Partial<AgentOutput>> {
    const record = input.record;
    const enrichedFields: Record<string, any> = {};
    const confidence: Record<string, number> = {};

    // Build input
    const phoneInput: PhoneFinderInput = {
      first_name: record.first_name || undefined,
      last_name: record.last_name || undefined,
      full_name: record.full_name || undefined,
      email: record.email || undefined,
      linkedin_url: record.linkedin_url || undefined,
      company_name: record.company_name || undefined,
      company_domain: record.company_domain || undefined,
    };

    // Try providers
    for (const provider of this.providers) {
      output.providers_tried.push(provider.id);

      const apiKey = this.getApiKey(provider);
      if (!apiKey) {
        this.log(`Skipping ${provider.id}: no API key`);
        continue;
      }

      try {
        let result: PhoneFinderOutput | null = null;

        switch (provider.id) {
          case 'prospeo':
            result = await this.findWithProspeo(phoneInput, apiKey);
            break;
          default:
            continue;
        }

        if (result && result.phone) {
          output.provider_used = provider.id;
          output.credits_used += 10; // Prospeo phone costs 10 credits
          output.api_calls_made++;

          // Map result
          enrichedFields.phone = result.phone_e164 || result.phone;
          enrichedFields.phone_status = result.phone_status;
          enrichedFields.phone_type = result.phone_type;
          confidence.phone = result.phone_confidence;

          this.log(`✓ Phone found via ${provider.id}: ${result.phone} (${result.phone_type})`);
          break;
        }

        await this.delay();

      } catch (error: any) {
        this.log(`Error with ${provider.id}:`, error.message);
        continue;
      }
    }

    return {
      enriched_fields: enrichedFields,
      confidence,
    };
  }

  /**
   * Find phone with Prospeo
   */
  private async findWithProspeo(
    input: PhoneFinderInput,
    apiKey: string
  ): Promise<PhoneFinderOutput | null> {
    this.log('Finding phone with Prospeo...');

    // Prospeo needs LinkedIn URL or email for best results
    if (!input.linkedin_url && !input.email) {
      this.log('Prospeo phone finder works best with LinkedIn URL or email');
    }

    try {
      const response = await fetch('https://api.prospeo.io/mobile-finder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-KEY': apiKey,
        },
        body: JSON.stringify({
          url: input.linkedin_url,
          email: input.email,
          first_name: input.first_name,
          last_name: input.last_name,
          full_name: input.full_name,
          company: input.company_name,
          company_domain: input.company_domain,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Prospeo API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      // Check for mobile in response
      if (!data.mobile?.mobile && !data.phone) {
        this.log('No phone found in Prospeo');
        return null;
      }

      const phone = data.mobile?.mobile || data.phone;
      const status = data.mobile?.status || 'unknown';

      // Format to E.164 if possible
      const phoneE164 = this.formatE164(phone);

      return {
        phone: phone,
        phone_type: data.mobile ? 'mobile' : 'direct',
        phone_status: this.mapProspeoStatus(status),
        phone_confidence: status === 'VERIFIED' ? 95 : 75,
        phone_e164: phoneE164,
        country_code: this.extractCountryCode(phoneE164),
      };

    } catch (error: any) {
      this.log('Prospeo phone error:', error.message);
      throw error;
    }
  }

  /**
   * Map Prospeo status
   */
  private mapProspeoStatus(status?: string): PhoneFinderOutput['phone_status'] {
    switch (status?.toUpperCase()) {
      case 'VERIFIED':
      case 'VALID': return 'valid';
      case 'INVALID': return 'invalid';
      default: return 'unknown';
    }
  }

  /**
   * Format phone to E.164
   */
  private formatE164(phone: string): string | undefined {
    if (!phone) return undefined;

    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');

    // If starts with 00, replace with +
    if (cleaned.startsWith('00')) {
      cleaned = '+' + cleaned.slice(2);
    }

    // If doesn't start with +, assume it needs country code
    if (!cleaned.startsWith('+')) {
      // Try to detect Saudi numbers
      if (cleaned.startsWith('05') || cleaned.startsWith('5')) {
        cleaned = '+966' + cleaned.replace(/^0?/, '');
      } else if (cleaned.length > 10) {
        cleaned = '+' + cleaned;
      }
    }

    // Validate E.164 format
    if (/^\+[1-9]\d{6,14}$/.test(cleaned)) {
      return cleaned;
    }

    return undefined;
  }

  /**
   * Extract country code from E.164 number
   */
  private extractCountryCode(phone?: string): string | undefined {
    if (!phone || !phone.startsWith('+')) return undefined;

    // Common country codes
    const countryCodes: Record<string, string> = {
      '+966': 'SA',
      '+971': 'AE',
      '+974': 'QA',
      '+965': 'KW',
      '+973': 'BH',
      '+968': 'OM',
      '+1': 'US',
      '+44': 'UK',
    };

    for (const [code, country] of Object.entries(countryCodes)) {
      if (phone.startsWith(code)) {
        return country;
      }
    }

    return undefined;
  }
}

// Register the agent
registerAgent('phone_finder', PhoneFinderAgent);

export default PhoneFinderAgent;
