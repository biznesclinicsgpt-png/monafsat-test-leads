/**
 * Apollo.io Provider Adapter
 *
 * B2B sales intelligence platform with extensive contact database.
 * Uses credit-free /mixed_people/api_search for basic enrichment.
 */

import { BaseAdapter } from './baseAdapter';
import {
  ProviderCapabilities,
  EnrichmentInput,
  EnrichmentResult,
  ConnectionTestResult,
  ProviderCredits,
} from '../types';

const APOLLO_API_BASE = 'https://api.apollo.io/v1';

export class ApolloAdapter extends BaseAdapter {
  slug = 'apollo';
  name = 'Apollo.io';
  capabilities: ProviderCapabilities = {
    email: true,
    phone: true,
    company: true,
    linkedin: true,
    verify: false,
    bulk: true,
  };

  async enrichEmail(input: EnrichmentInput): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      return this.enrichPerson(input);
    });
    return { ...result, responseTimeMs: timeMs };
  }

  async enrichPhone(input: EnrichmentInput): Promise<EnrichmentResult> {
    // Apollo phone enrichment costs 8 credits via /people/match
    // For now, use the same enrichPerson which returns phone if available
    const { result, timeMs } = await this.measureTime(async () => {
      return this.enrichPerson(input);
    });
    return { ...result, responseTimeMs: timeMs };
  }

  async enrichCompany(input: EnrichmentInput): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      return this.enrichOrganization(input);
    });
    return { ...result, responseTimeMs: timeMs };
  }

  async enrichLinkedIn(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichEmail(input);
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const start = Date.now();
    try {
      const response = await fetch(`${APOLLO_API_BASE}/auth/health`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'X-Api-Key': this.apiKey,
        },
      });

      const timeMs = Date.now() - start;

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          message: `Authentication failed: ${response.status}`,
          responseTimeMs: timeMs,
          error,
        };
      }

      // Get account info
      const creditsInfo = await this.getCredits();

      return {
        success: true,
        message: 'Connected to Apollo.io',
        responseTimeMs: timeMs,
        creditsRemaining: creditsInfo.available,
        planType: creditsInfo.planName,
      };
    } catch (error) {
      return {
        success: false,
        message: `Connection failed: ${(error as Error).message}`,
        responseTimeMs: Date.now() - start,
        error: (error as Error).message,
      };
    }
  }

  async getCredits(): Promise<ProviderCredits> {
    try {
      const response = await fetch(`${APOLLO_API_BASE}/users/me`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'X-Api-Key': this.apiKey,
        },
      });

      if (!response.ok) {
        return { available: 0, used: 0, total: 0 };
      }

      const data = await response.json();
      const credits = data.credits || {};

      return {
        available: credits.credits_remaining || 0,
        used: credits.credits_used || 0,
        total: (credits.credits_remaining || 0) + (credits.credits_used || 0),
        planName: data.plan_name || 'Unknown',
        resetDate: credits.next_reset_date,
      };
    } catch {
      return { available: 0, used: 0, total: 0 };
    }
  }

  private async enrichPerson(input: EnrichmentInput): Promise<EnrichmentResult> {
    try {
      // Use credit-free /mixed_people/api_search
      const searchBody: Record<string, any> = {
        per_page: 5,
        page: 1,
      };

      // Build search params
      if (input.firstName && input.lastName) {
        searchBody.q_keywords = `${input.firstName} ${input.lastName}`;
      } else if (input.fullName) {
        searchBody.q_keywords = input.fullName;
      }

      if (input.companyDomain) {
        searchBody.q_organization_domains = [input.companyDomain];
      } else if (input.companyName) {
        searchBody.q_organization_name = input.companyName;
      }

      if (input.title) {
        searchBody.person_titles = [input.title];
      }

      if (!searchBody.q_keywords && !searchBody.q_organization_domains && !searchBody.q_organization_name) {
        return this.createNotFound(0);
      }

      const response = await fetch(`${APOLLO_API_BASE}/mixed_people/api_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': this.apiKey,
        },
        body: JSON.stringify(searchBody),
      });

      if (!response.ok) {
        const error = await response.text();
        return this.createError(`Apollo API Error: ${response.status}`, 'API_ERROR');
      }

      const data = await response.json();
      const people = data.people || [];

      if (people.length === 0) {
        return this.createNotFound(0);
      }

      const person = people[0];
      const org = person.organization || {};

      return {
        success: true,
        found: true,
        person: {
          firstName: person.first_name,
          lastName: person.last_name,
          fullName: person.name,
          email: person.email,
          emailVerified: person.email_status === 'verified',
          phone: person.phone_numbers?.[0]?.sanitized_number,
          linkedinUrl: person.linkedin_url,
          title: person.title,
          seniority: person.seniority,
          department: person.departments?.[0],
          location: [person.city, person.state, person.country].filter(Boolean).join(', '),
          photoUrl: person.photo_url,
        },
        company: {
          name: org.name,
          domain: org.primary_domain,
          website: org.website_url,
          linkedinUrl: org.linkedin_url,
          industry: org.industry,
          employeeCount: org.estimated_num_employees,
          employeeRange: org.employee_count_range,
          location: [org.city, org.country].filter(Boolean).join(', '),
          foundedYear: org.founded_year,
          revenue: org.annual_revenue_printed,
          techStack: org.technology_names,
        },
        provider: this.slug,
        creditsUsed: 0, // Credit-free endpoint
        responseTimeMs: 0,
        confidence: 85,
        rawResponse: person,
      };
    } catch (error) {
      return this.createError((error as Error).message, 'REQUEST_FAILED');
    }
  }

  private async enrichOrganization(input: EnrichmentInput): Promise<EnrichmentResult> {
    try {
      if (!input.companyDomain && !input.companyName) {
        return this.createNotFound(0);
      }

      // Search for a person at the company to get org data (credit-free)
      const searchBody: Record<string, any> = {
        per_page: 1,
        page: 1,
        person_seniorities: ['c_suite', 'owner', 'founder', 'vp', 'director'],
      };

      if (input.companyDomain) {
        searchBody.q_organization_domains = [input.companyDomain];
      } else if (input.companyName) {
        searchBody.q_organization_name = input.companyName;
      }

      const response = await fetch(`${APOLLO_API_BASE}/mixed_people/api_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': this.apiKey,
        },
        body: JSON.stringify(searchBody),
      });

      if (!response.ok) {
        return this.createError(`Apollo API Error: ${response.status}`, 'API_ERROR');
      }

      const data = await response.json();
      const people = data.people || [];

      if (people.length === 0 || !people[0].organization) {
        return this.createNotFound(0);
      }

      const org = people[0].organization;

      return {
        success: true,
        found: true,
        company: {
          name: org.name,
          domain: org.primary_domain,
          website: org.website_url,
          linkedinUrl: org.linkedin_url,
          industry: org.industry,
          employeeCount: org.estimated_num_employees,
          employeeRange: org.employee_count_range,
          location: [org.city, org.country].filter(Boolean).join(', '),
          description: org.short_description,
          logoUrl: org.logo_url,
          foundedYear: org.founded_year,
          revenue: org.annual_revenue_printed,
          techStack: org.technology_names,
        },
        provider: this.slug,
        creditsUsed: 0,
        responseTimeMs: 0,
        confidence: 90,
        rawResponse: org,
      };
    } catch (error) {
      return this.createError((error as Error).message, 'REQUEST_FAILED');
    }
  }
}
