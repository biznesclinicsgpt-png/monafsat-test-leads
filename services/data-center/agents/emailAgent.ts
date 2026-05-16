/**
 * Email Finder Agent
 *
 * Stage 5: Conditional Contactability Layer
 * Finds and verifies email addresses using waterfall logic
 *
 * GATED: Only runs if:
 * - ICP Verify = Yes
 * - Score ≥ threshold (default 60)
 *
 * Waterfall: Hunter → Prospeo → Apollo (Email Reveal)
 */

import {
  AgentConfig,
  AgentInput,
  AgentOutput,
  EmailFinderInput,
  EmailFinderOutput,
  ProviderConfig,
} from './types';
import { BaseAgent, registerAgent } from './baseAgent';
import { NormalizedLeadObject } from '../types';

// ==========================================
// EMAIL FINDER AGENT
// ==========================================

export class EmailFinderAgent extends BaseAgent {
  constructor(config?: Partial<AgentConfig>) {
    super({
      id: 'email_finder_agent',
      type: 'email_finder',
      name: 'Email Finder Agent',
      name_ar: 'وكيل البحث عن البريد الإلكتروني',
      description: 'Finds and verifies email addresses using waterfall providers',

      providers: ['hunter', 'prospeo', 'apollo'],
      fallback_enabled: true,

      max_cost_per_record: 5,
      max_total_cost: 500,

      // GATED: Only run if ICP verified and score meets threshold
      run_conditions: [
        { field: 'icp_status', operator: 'equals', value: 'Yes' },
        { field: 'icp_fit_score', operator: 'gt', value: 59 }, // Score >= 60
      ],

      // Skip if already has verified email
      skip_conditions: [
        { field: 'email_status', operator: 'equals', value: 'valid' },
      ],

      rate_limit_per_minute: 30,
      delay_between_calls_ms: 1000,

      ...config,
    });
  }

  /**
   * Check if should run - with ICP gating
   */
  shouldRun(record: NormalizedLeadObject): { should_run: boolean; reason: string } {
    // Must have ICP verified as Yes
    if (record.icp_status !== 'Yes') {
      return {
        should_run: false,
        reason: `ICP Gate: status is "${record.icp_status}" (requires "Yes")`,
      };
    }

    // Must meet score threshold
    const threshold = 60;
    if (!record.icp_fit_score || record.icp_fit_score < threshold) {
      return {
        should_run: false,
        reason: `Score Gate: ${record.icp_fit_score || 0} < ${threshold}`,
      };
    }

    // Skip if already has verified email
    if (record.email && record.email_status === 'valid') {
      return {
        should_run: false,
        reason: 'Already has verified email',
      };
    }

    // Need identifiers to find email
    const hasIdentifiers =
      (record.first_name && record.company_domain) ||
      record.linkedin_url;

    if (!hasIdentifiers) {
      return {
        should_run: false,
        reason: 'Missing identifiers (need name+domain or linkedin)',
      };
    }

    return {
      should_run: true,
      reason: `ICP=${record.icp_status}, Score=${record.icp_fit_score}, needs email`,
    };
  }

  /**
   * Run email finder with waterfall
   */
  protected async runEnrichment(
    input: AgentInput,
    output: AgentOutput
  ): Promise<Partial<AgentOutput>> {
    const record = input.record;
    const enrichedFields: Record<string, any> = {};
    const confidence: Record<string, number> = {};

    // Build input for email finding
    const emailInput: EmailFinderInput = {
      first_name: record.first_name || '',
      last_name: record.last_name || '',
      company_domain: record.company_domain || '',
      linkedin_url: record.linkedin_url || undefined,
      title: record.title_normalized || undefined,
    };

    // Try each provider in waterfall order (stop on first success)
    for (const provider of this.providers) {
      output.providers_tried.push(provider.id);

      const apiKey = this.getApiKey(provider);
      if (!apiKey) {
        this.log(`Skipping ${provider.id}: no API key`);
        continue;
      }

      try {
        let result: EmailFinderOutput | null = null;

        switch (provider.id) {
          case 'hunter':
            result = await this.findWithHunter(emailInput, apiKey);
            break;
          case 'prospeo':
            result = await this.findWithProspeo(emailInput, apiKey);
            break;
          case 'apollo':
            result = await this.findWithApollo(emailInput, apiKey);
            break;
          default:
            continue;
        }

        if (result && result.email) {
          output.provider_used = provider.id;
          output.credits_used += this.getProviderCost(provider.id);
          output.api_calls_made++;

          // Map result
          enrichedFields.email = result.email;
          enrichedFields.email_status = result.email_status;
          enrichedFields.email_confidence = result.email_confidence;
          confidence.email = result.email_confidence;

          this.log(`✓ Email found via ${provider.id}: ${result.email} (${result.email_status})`);

          // Stop waterfall on success
          if (result.email_status === 'valid' || result.email_confidence >= 80) {
            break;
          }
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
   * Find email with Hunter.io
   */
  private async findWithHunter(
    input: EmailFinderInput,
    apiKey: string
  ): Promise<EmailFinderOutput | null> {
    this.log('Finding email with Hunter...');

    if (!input.company_domain || !input.first_name) {
      this.log('Hunter requires domain and first_name');
      return null;
    }

    try {
      const params = new URLSearchParams({
        domain: input.company_domain,
        first_name: input.first_name,
        last_name: input.last_name || '',
        api_key: apiKey,
      });

      const response = await fetch(
        `https://api.hunter.io/v2/email-finder?${params}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error(`Hunter API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.data?.email) {
        this.log('No email found in Hunter');
        return null;
      }

      const email = data.data.email;
      const score = data.data.score || 50;

      return {
        email,
        email_status: this.mapHunterStatus(data.data.verification?.status),
        email_confidence: score,
        email_type: data.data.type || 'professional',
        mx_found: data.data.verification?.mx_records,
        smtp_valid: data.data.verification?.smtp_server,
      };

    } catch (error: any) {
      this.log('Hunter error:', error.message);
      throw error;
    }
  }

  /**
   * Find email with Prospeo
   */
  private async findWithProspeo(
    input: EmailFinderInput,
    apiKey: string
  ): Promise<EmailFinderOutput | null> {
    this.log('Finding email with Prospeo...');

    try {
      // Prospeo Email Finder API
      const response = await fetch('https://api.prospeo.io/email-finder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-KEY': apiKey,
        },
        body: JSON.stringify({
          first_name: input.first_name,
          last_name: input.last_name,
          company: input.company_domain,
          domain: input.company_domain,
          linkedin_url: input.linkedin_url,
        }),
      });

      if (!response.ok) {
        throw new Error(`Prospeo API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.email?.email) {
        this.log('No email found in Prospeo');
        return null;
      }

      return {
        email: data.email.email,
        email_status: this.mapProspeoStatus(data.email.status),
        email_confidence: data.email.confidence || 80,
        email_type: 'professional',
      };

    } catch (error: any) {
      this.log('Prospeo error:', error.message);
      throw error;
    }
  }

  /**
   * Find email with Apollo (costs credits)
   */
  private async findWithApollo(
    input: EmailFinderInput,
    apiKey: string
  ): Promise<EmailFinderOutput | null> {
    this.log('Finding email with Apollo...');

    try {
      // First, search for the person
      const searchResponse = await fetch('https://api.apollo.io/v1/mixed_people/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey,
        },
        body: JSON.stringify({
          first_name: input.first_name,
          last_name: input.last_name,
          domain: input.company_domain,
          page: 1,
          per_page: 1,
        }),
      });

      if (!searchResponse.ok) {
        throw new Error(`Apollo search error: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      const person = searchData.people?.[0];

      if (!person) {
        this.log('No person found in Apollo');
        return null;
      }

      // Check if email is already revealed
      if (person.email && !person.email.includes('*')) {
        return {
          email: person.email,
          email_status: this.mapApolloStatus(person.email_status),
          email_confidence: 85,
          email_type: 'professional',
        };
      }

      // Need to reveal email (costs 1 credit)
      if (person.id) {
        const revealResponse = await fetch('https://api.apollo.io/v1/people/match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey,
          },
          body: JSON.stringify({
            id: person.id,
            reveal_personal_emails: false,
          }),
        });

        if (revealResponse.ok) {
          const revealData = await revealResponse.json();
          if (revealData.person?.email) {
            return {
              email: revealData.person.email,
              email_status: this.mapApolloStatus(revealData.person.email_status),
              email_confidence: 90,
              email_type: 'professional',
            };
          }
        }
      }

      return null;

    } catch (error: any) {
      this.log('Apollo error:', error.message);
      throw error;
    }
  }

  /**
   * Map Hunter status to our standard
   */
  private mapHunterStatus(status?: string): EmailFinderOutput['email_status'] {
    switch (status) {
      case 'valid': return 'valid';
      case 'invalid': return 'invalid';
      case 'accept_all': return 'catch_all';
      case 'webmail': return 'risky';
      default: return 'unknown';
    }
  }

  /**
   * Map Prospeo status to our standard
   */
  private mapProspeoStatus(status?: string): EmailFinderOutput['email_status'] {
    switch (status?.toUpperCase()) {
      case 'VALID':
      case 'VERIFIED': return 'valid';
      case 'INVALID': return 'invalid';
      case 'CATCH_ALL':
      case 'ACCEPT_ALL': return 'catch_all';
      case 'RISKY': return 'risky';
      default: return 'unknown';
    }
  }

  /**
   * Map Apollo status to our standard
   */
  private mapApolloStatus(status?: string): EmailFinderOutput['email_status'] {
    switch (status) {
      case 'verified': return 'valid';
      case 'guessed': return 'risky';
      case 'invalid': return 'invalid';
      default: return 'unknown';
    }
  }

  /**
   * Get cost for provider
   */
  private getProviderCost(providerId: string): number {
    const costs: Record<string, number> = {
      'hunter': 1,
      'prospeo': 1,
      'apollo': 1,
    };
    return costs[providerId] || 1;
  }
}

// Register the agent
registerAgent('email_finder', EmailFinderAgent);

export default EmailFinderAgent;
