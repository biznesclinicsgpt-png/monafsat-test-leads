/**
 * Person Enrichment Agent
 *
 * Enriches person data: title, seniority, department, location, linkedin
 * Only runs if missing required fields for ICP verification
 *
 * Providers: Apollo (free search) → Prospeo (paid)
 */

import {
  AgentConfig,
  AgentInput,
  AgentOutput,
  PersonEnrichmentInput,
  PersonEnrichmentOutput,
  ProviderConfig,
} from './types';
import { BaseAgent, registerAgent } from './baseAgent';
import { NormalizedLeadObject } from '../types';

// ==========================================
// PERSON ENRICHMENT AGENT
// ==========================================

export class PersonEnrichmentAgent extends BaseAgent {
  constructor(config?: Partial<AgentConfig>) {
    super({
      id: 'person_enrichment_agent',
      type: 'person_enrichment',
      name: 'Person Enrichment Agent',
      name_ar: 'وكيل إثراء بيانات الشخص',
      description: 'Enriches person data including title, seniority, and LinkedIn',

      providers: ['apollo', 'prospeo'],
      fallback_enabled: true,

      max_cost_per_record: 5,
      max_total_cost: 1000,

      // Run if missing title OR seniority (needed for ICP)
      run_conditions: [
        { field: 'title_normalized', operator: 'not_exists' },
      ],

      // Skip if already has LinkedIn and title
      skip_conditions: [
        // If we have both linkedin AND title, skip
      ],

      rate_limit_per_minute: 60,
      delay_between_calls_ms: 500,

      ...config,
    });
  }

  /**
   * Check if should run - override for more complex logic
   */
  shouldRun(record: NormalizedLeadObject): { should_run: boolean; reason: string } {
    // Need at least one identifier
    const hasIdentifier =
      record.email ||
      record.linkedin_url ||
      (record.first_name && record.company_domain) ||
      (record.full_name && record.company_name);

    if (!hasIdentifier) {
      return {
        should_run: false,
        reason: 'No identifier available (need email, linkedin, or name+company)',
      };
    }

    // Check if missing ICP-required fields
    const missingTitle = !record.title_normalized;
    const missingSeniority = !record.seniority || record.seniority === 'Unknown';
    const missingLinkedIn = !record.linkedin_url;

    if (!missingTitle && !missingSeniority && !missingLinkedIn) {
      return {
        should_run: false,
        reason: 'All required person fields present',
      };
    }

    return {
      should_run: true,
      reason: `Missing fields: ${[
        missingTitle && 'title',
        missingSeniority && 'seniority',
        missingLinkedIn && 'linkedin',
      ].filter(Boolean).join(', ')}`,
    };
  }

  /**
   * Run person enrichment
   */
  protected async runEnrichment(
    input: AgentInput,
    output: AgentOutput
  ): Promise<Partial<AgentOutput>> {
    const record = input.record;
    const enrichedFields: Record<string, any> = {};
    const confidence: Record<string, number> = {};

    // Try each provider in order
    for (const provider of this.providers) {
      output.providers_tried.push(provider.id);

      const apiKey = this.getApiKey(provider);
      if (!apiKey) {
        this.log(`Skipping ${provider.id}: no API key`);
        continue;
      }

      try {
        let result: PersonEnrichmentOutput | null = null;

        switch (provider.id) {
          case 'apollo':
            result = await this.enrichWithApollo(record, apiKey);
            break;
          case 'prospeo':
            result = await this.enrichWithProspeo(record, apiKey);
            break;
          default:
            this.log(`Unknown provider: ${provider.id}`);
            continue;
        }

        if (result) {
          output.provider_used = provider.id;
          output.credits_used += this.calculateCost(provider, result);
          output.api_calls_made++;

          // Map result to enriched fields
          this.mapResultToFields(result, enrichedFields, confidence);

          // If we got the critical fields, stop
          if (enrichedFields.title_normalized && enrichedFields.linkedin_url) {
            this.log(`Got all critical fields from ${provider.id}`);
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
   * Enrich with Apollo (free people search)
   */
  private async enrichWithApollo(
    record: NormalizedLeadObject,
    apiKey: string
  ): Promise<PersonEnrichmentOutput | null> {
    this.log('Enriching with Apollo...');

    // Build search parameters
    const searchParams: any = {};

    if (record.first_name) searchParams.first_name = record.first_name;
    if (record.last_name) searchParams.last_name = record.last_name;
    if (record.company_name) searchParams.organization_name = record.company_name;
    if (record.company_domain) searchParams.domain = record.company_domain;
    if (record.title_raw) searchParams.title = record.title_raw;

    try {
      // Apollo People Search API (free - no credits)
      const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': apiKey,
        },
        body: JSON.stringify({
          ...searchParams,
          page: 1,
          per_page: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Apollo API error: ${response.status}`);
      }

      const data = await response.json();
      const person = data.people?.[0];

      if (!person) {
        this.log('No match found in Apollo');
        return null;
      }

      // Map Apollo response to output
      const result: PersonEnrichmentOutput = {
        first_name: person.first_name,
        last_name: person.last_name,
        full_name: person.name,
        email: person.email && !person.email.includes('*') ? person.email : undefined,
        linkedin_url: person.linkedin_url,
        title: person.title,
        seniority: person.seniority,
        department: person.departments?.[0],
        city: person.city,
        state: person.state,
        country: person.country,
        current_company: person.organization?.name,
        current_company_linkedin: person.organization?.linkedin_url,
        photo_url: person.photo_url,
      };

      this.log('Apollo enrichment successful', { linkedin: result.linkedin_url, title: result.title });
      return result;

    } catch (error: any) {
      this.log('Apollo error:', error.message);
      throw error;
    }
  }

  /**
   * Enrich with Prospeo
   */
  private async enrichWithProspeo(
    record: NormalizedLeadObject,
    apiKey: string
  ): Promise<PersonEnrichmentOutput | null> {
    this.log('Enriching with Prospeo...');

    // Prospeo needs LinkedIn URL for best results
    if (!record.linkedin_url && !record.email) {
      this.log('Prospeo requires linkedin_url or email');
      return null;
    }

    try {
      const response = await fetch('https://api.prospeo.io/person-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-KEY': apiKey,
        },
        body: JSON.stringify({
          url: record.linkedin_url,
          email: record.email,
          first_name: record.first_name,
          last_name: record.last_name,
          company: record.company_name,
          company_domain: record.company_domain,
        }),
      });

      if (!response.ok) {
        throw new Error(`Prospeo API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.person) {
        this.log('No match found in Prospeo');
        return null;
      }

      const person = data.person;
      const result: PersonEnrichmentOutput = {
        first_name: person.first_name,
        last_name: person.last_name,
        full_name: person.full_name,
        email: person.email?.email,
        email_status: person.email?.status?.toLowerCase() as any,
        linkedin_url: person.linkedin,
        title: person.job_title,
        city: person.location?.city,
        country: person.location?.country,
        current_company: person.company_name,
      };

      this.log('Prospeo enrichment successful', { title: result.title });
      return result;

    } catch (error: any) {
      this.log('Prospeo error:', error.message);
      throw error;
    }
  }

  /**
   * Map enrichment result to normalized fields
   */
  private mapResultToFields(
    result: PersonEnrichmentOutput,
    enrichedFields: Record<string, any>,
    confidence: Record<string, number>
  ): void {
    // LinkedIn
    if (result.linkedin_url) {
      enrichedFields.linkedin_url = result.linkedin_url;
      confidence.linkedin_url = 95;
    }

    // Title & Seniority
    if (result.title) {
      enrichedFields.title_raw = result.title;
      enrichedFields.title_normalized = result.title;
      confidence.title_normalized = 90;

      // Detect seniority from title
      const seniorityResult = this.detectSeniority(result.title, result.seniority);
      enrichedFields.seniority = seniorityResult.seniority;
      confidence.seniority = seniorityResult.confidence;
    }

    // Department
    if (result.department) {
      enrichedFields.department = result.department;
      confidence.department = 85;
    }

    // Location
    if (result.country) {
      enrichedFields.company_country = result.country;
      confidence.company_country = 90;
    }
    if (result.city) {
      enrichedFields.company_city = result.city;
      confidence.company_city = 85;
    }

    // Names (only if missing)
    if (result.first_name && !enrichedFields.first_name) {
      enrichedFields.first_name = result.first_name;
      confidence.first_name = 95;
    }
    if (result.last_name && !enrichedFields.last_name) {
      enrichedFields.last_name = result.last_name;
      confidence.last_name = 95;
    }
    if (result.full_name && !enrichedFields.full_name) {
      enrichedFields.full_name = result.full_name;
      confidence.full_name = 95;
    }

    // Company info
    if (result.current_company) {
      enrichedFields.company_name = result.current_company;
      confidence.company_name = 90;
    }
    if (result.current_company_linkedin) {
      enrichedFields.company_linkedin = result.current_company_linkedin;
      confidence.company_linkedin = 95;
    }
  }

  /**
   * Detect seniority from title
   */
  private detectSeniority(title: string, providerSeniority?: string): { seniority: string; confidence: number } {
    // Use provider's seniority if available
    if (providerSeniority) {
      const mapped = this.mapSeniority(providerSeniority);
      if (mapped !== 'Unknown') {
        return { seniority: mapped, confidence: 90 };
      }
    }

    // Detect from title
    const titleLower = title.toLowerCase();

    if (/\b(ceo|cto|cfo|coo|cmo|cio|cpo|chief|president|رئيس|مدير عام)\b/i.test(titleLower)) {
      return { seniority: 'C-Level', confidence: 95 };
    }
    if (/\b(vp|vice president|svp|evp|نائب)\b/i.test(titleLower)) {
      return { seniority: 'VP', confidence: 90 };
    }
    if (/\b(director|head of|مدير|رئيس قسم)\b/i.test(titleLower)) {
      return { seniority: 'Director', confidence: 85 };
    }
    if (/\b(manager|lead|supervisor|مشرف|قائد)\b/i.test(titleLower)) {
      return { seniority: 'Manager', confidence: 80 };
    }
    if (/\b(senior|sr\.|أول|خبير)\b/i.test(titleLower)) {
      return { seniority: 'Senior', confidence: 75 };
    }
    if (/\b(junior|jr\.|intern|trainee|متدرب)\b/i.test(titleLower)) {
      return { seniority: 'Junior', confidence: 80 };
    }

    return { seniority: 'Mid', confidence: 60 };
  }

  /**
   * Map provider seniority to our standard
   */
  private mapSeniority(providerSeniority: string): string {
    const mapping: Record<string, string> = {
      'c_suite': 'C-Level',
      'owner': 'C-Level',
      'founder': 'C-Level',
      'partner': 'C-Level',
      'vp': 'VP',
      'vice_president': 'VP',
      'director': 'Director',
      'manager': 'Manager',
      'senior': 'Senior',
      'entry': 'Junior',
      'intern': 'Junior',
    };

    const normalized = providerSeniority.toLowerCase().replace(/\s+/g, '_');
    return mapping[normalized] || 'Unknown';
  }

  /**
   * Calculate cost for this enrichment
   */
  private calculateCost(provider: ProviderConfig, result: PersonEnrichmentOutput): number {
    // Apollo search is free
    if (provider.id === 'apollo') {
      return 0;
    }

    // Prospeo costs 1 credit per search
    if (provider.id === 'prospeo') {
      return 1;
    }

    return provider.cost_per_person_search;
  }
}

// Register the agent
registerAgent('person_enrichment', PersonEnrichmentAgent);

export default PersonEnrichmentAgent;
