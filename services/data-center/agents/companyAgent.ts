/**
 * Company Enrichment Agent
 *
 * Enriches company data: industry, size, location
 * Only runs if missing required fields for ICP verification
 *
 * Providers: Apollo (free org search) → external APIs
 */

import {
  AgentConfig,
  AgentInput,
  AgentOutput,
  CompanyEnrichmentInput,
  CompanyEnrichmentOutput,
  ProviderConfig,
} from './types';
import { BaseAgent, registerAgent } from './baseAgent';
import { NormalizedLeadObject, INDUSTRY_TAXONOMY, COMPANY_SIZE_RANGES } from '../types';

// ==========================================
// COMPANY ENRICHMENT AGENT
// ==========================================

export class CompanyEnrichmentAgent extends BaseAgent {
  constructor(config?: Partial<AgentConfig>) {
    super({
      id: 'company_enrichment_agent',
      type: 'company_enrichment',
      name: 'Company Enrichment Agent',
      name_ar: 'وكيل إثراء بيانات الشركة',
      description: 'Enriches company data including industry, size, and location',

      providers: ['apollo'],
      fallback_enabled: true,

      max_cost_per_record: 3,
      max_total_cost: 500,

      // Run if missing industry OR company_size (needed for ICP)
      run_conditions: [],

      skip_conditions: [],

      rate_limit_per_minute: 60,
      delay_between_calls_ms: 500,

      ...config,
    });
  }

  /**
   * Check if should run
   */
  shouldRun(record: NormalizedLeadObject): { should_run: boolean; reason: string } {
    // Need at least one company identifier
    const hasIdentifier =
      record.company_domain ||
      record.company_linkedin ||
      record.company_name;

    if (!hasIdentifier) {
      return {
        should_run: false,
        reason: 'No company identifier (need domain, linkedin, or name)',
      };
    }

    // Check if missing ICP-required fields
    const missingIndustry = !record.industry_normalized;
    const missingSize = !record.company_size;
    const missingCountry = !record.company_country;

    if (!missingIndustry && !missingSize && !missingCountry) {
      return {
        should_run: false,
        reason: 'All required company fields present',
      };
    }

    return {
      should_run: true,
      reason: `Missing fields: ${[
        missingIndustry && 'industry',
        missingSize && 'company_size',
        missingCountry && 'country',
      ].filter(Boolean).join(', ')}`,
    };
  }

  /**
   * Run company enrichment
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
        let result: CompanyEnrichmentOutput | null = null;

        switch (provider.id) {
          case 'apollo':
            result = await this.enrichWithApollo(record, apiKey);
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
          if (enrichedFields.industry_normalized && enrichedFields.company_size) {
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
   * Enrich with Apollo Organization Search
   */
  private async enrichWithApollo(
    record: NormalizedLeadObject,
    apiKey: string
  ): Promise<CompanyEnrichmentOutput | null> {
    this.log('Enriching company with Apollo...');

    try {
      // Method 1: Search by domain (most accurate)
      if (record.company_domain) {
        const response = await fetch('https://api.apollo.io/v1/organizations/enrich', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'X-Api-Key': apiKey,
          },
          body: JSON.stringify({
            domain: record.company_domain,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.organization) {
            return this.mapApolloOrganization(data.organization);
          }
        }
      }

      // Method 2: Search by name
      if (record.company_name) {
        const response = await fetch('https://api.apollo.io/v1/organizations/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'X-Api-Key': apiKey,
          },
          body: JSON.stringify({
            q_organization_name: record.company_name,
            page: 1,
            per_page: 1,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const org = data.organizations?.[0];
          if (org) {
            return this.mapApolloOrganization(org);
          }
        }
      }

      this.log('No company match found in Apollo');
      return null;

    } catch (error: any) {
      this.log('Apollo company error:', error.message);
      throw error;
    }
  }

  /**
   * Map Apollo organization to output format
   */
  private mapApolloOrganization(org: any): CompanyEnrichmentOutput {
    return {
      company_name: org.name,
      company_name_legal: org.legal_name,
      company_domain: org.primary_domain || org.website_url?.replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
      company_linkedin: org.linkedin_url,

      industry: org.industry,
      sub_industry: org.subindustries?.[0],
      sic_codes: org.sic_codes,
      naics_codes: org.naics_codes,

      employee_count: org.estimated_num_employees,
      employee_range: org.employee_count_range,
      annual_revenue: org.annual_revenue_printed,

      headquarters_city: org.city,
      headquarters_country: org.country,
      address: org.raw_address,

      founded_year: org.founded_year,
      company_type: org.publicly_traded_symbol ? 'public' : 'private',
      description: org.short_description || org.description,

      total_funding: org.total_funding_printed,
      latest_funding_round: org.latest_funding_round_type,
      latest_funding_date: org.latest_funding_date,

      technologies: org.current_technologies?.map((t: any) => t.name),

      twitter_url: org.twitter_url,
      facebook_url: org.facebook_url,

      logo_url: org.logo_url,
      website_url: org.website_url,
      phone: org.sanitized_phone || org.phone,
    };
  }

  /**
   * Map enrichment result to normalized fields
   */
  private mapResultToFields(
    result: CompanyEnrichmentOutput,
    enrichedFields: Record<string, any>,
    confidence: Record<string, number>
  ): void {
    // Company name
    if (result.company_name) {
      enrichedFields.company_name = result.company_name;
      enrichedFields.company_name_normalized = result.company_name;
      confidence.company_name = 95;
    }

    // Domain
    if (result.company_domain) {
      enrichedFields.company_domain = result.company_domain;
      confidence.company_domain = 95;
    }

    // LinkedIn
    if (result.company_linkedin) {
      enrichedFields.company_linkedin = result.company_linkedin;
      confidence.company_linkedin = 95;
    }

    // Industry - normalize to our taxonomy
    if (result.industry) {
      const normalizedIndustry = this.normalizeIndustry(result.industry);
      enrichedFields.industry = result.industry;
      enrichedFields.industry_normalized = normalizedIndustry.normalized;
      confidence.industry_normalized = normalizedIndustry.confidence;
    }

    // Company size
    if (result.employee_count || result.employee_range) {
      const sizeResult = this.normalizeCompanySize(
        result.employee_count,
        result.employee_range
      );
      enrichedFields.company_size = sizeResult.range;
      enrichedFields.company_size_raw = sizeResult.count;
      confidence.company_size = sizeResult.confidence;
    }

    // Location
    if (result.headquarters_country) {
      enrichedFields.company_country = result.headquarters_country;
      confidence.company_country = 90;

      // Check if GCC
      const isGCC = this.isGCCCountry(result.headquarters_country);
      enrichedFields.company_region = isGCC ? 'GCC' : null;
    }

    // Additional fields
    if (result.founded_year) {
      enrichedFields.company_founded_year = result.founded_year;
      confidence.company_founded_year = 95;
    }

    if (result.description) {
      enrichedFields.company_description = result.description;
      confidence.company_description = 90;
    }

    if (result.technologies?.length) {
      enrichedFields.company_tech_stack = result.technologies;
      confidence.company_tech_stack = 85;
    }
  }

  /**
   * Normalize industry to our taxonomy
   */
  private normalizeIndustry(industry: string): { normalized: string; confidence: number } {
    const industryLower = industry.toLowerCase();

    for (const [key, data] of Object.entries(INDUSTRY_TAXONOMY)) {
      if (
        key === industryLower ||
        data.ar.toLowerCase() === industryLower ||
        data.aliases.some(a => industryLower.includes(a.toLowerCase()))
      ) {
        return { normalized: key, confidence: 90 };
      }
    }

    // Try partial matching
    for (const [key, data] of Object.entries(INDUSTRY_TAXONOMY)) {
      if (data.aliases.some(a => industryLower.includes(a.toLowerCase()) || a.toLowerCase().includes(industryLower))) {
        return { normalized: key, confidence: 70 };
      }
    }

    // Return original if no match
    return { normalized: industryLower, confidence: 50 };
  }

  /**
   * Normalize company size to our ranges
   */
  private normalizeCompanySize(
    count?: number,
    range?: string
  ): { range: string | null; count: number | null; confidence: number } {
    // Use exact count if available
    if (count && count > 0) {
      for (const [rangeName, data] of Object.entries(COMPANY_SIZE_RANGES)) {
        if (count >= data.min && count <= data.max) {
          return { range: rangeName, count, confidence: 95 };
        }
      }
    }

    // Parse range string
    if (range) {
      // Common patterns: "1-10", "11-50", "51-200", "1,001-5,000"
      const match = range.replace(/,/g, '').match(/(\d+)\s*[-–]\s*(\d+)/);
      if (match) {
        const min = parseInt(match[1]);
        const max = parseInt(match[2]);
        const mid = Math.round((min + max) / 2);

        for (const [rangeName, data] of Object.entries(COMPANY_SIZE_RANGES)) {
          if (mid >= data.min && mid <= data.max) {
            return { range: rangeName, count: mid, confidence: 85 };
          }
        }
      }
    }

    return { range: null, count: null, confidence: 0 };
  }

  /**
   * Check if country is in GCC
   */
  private isGCCCountry(country: string): boolean {
    const gccNames = [
      'Saudi Arabia', 'KSA', 'SA',
      'UAE', 'United Arab Emirates', 'AE',
      'Qatar', 'QA',
      'Kuwait', 'KW',
      'Bahrain', 'BH',
      'Oman', 'OM',
      'السعودية', 'الإمارات', 'قطر', 'الكويت', 'البحرين', 'عمان',
    ];
    return gccNames.some(n => country.toLowerCase().includes(n.toLowerCase()));
  }

  /**
   * Calculate cost for this enrichment
   */
  private calculateCost(provider: ProviderConfig, result: CompanyEnrichmentOutput): number {
    // Apollo org enrich is typically free for basic data
    if (provider.id === 'apollo') {
      return 0;
    }

    return provider.cost_per_company_search;
  }
}

// Register the agent
registerAgent('company_enrichment', CompanyEnrichmentAgent);

export default CompanyEnrichmentAgent;
