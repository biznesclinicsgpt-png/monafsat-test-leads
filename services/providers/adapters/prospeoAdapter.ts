/**
 * Prospeo Provider Adapter
 *
 * Person enrichment with mobile phone specialization.
 * Strong LinkedIn profile enrichment capabilities.
 */

import { BaseAdapter } from './baseAdapter';
import {
  ProviderCapabilities,
  EnrichmentInput,
  EnrichmentResult,
  ConnectionTestResult,
  ProviderCredits,
} from '../types';

const PROSPEO_API_URL = 'https://api.prospeo.io';

export class ProspeoAdapter extends BaseAdapter {
  slug = 'prospeo';
  name = 'Prospeo';
  capabilities: ProviderCapabilities = {
    email: true,
    phone: true,
    company: true,
    linkedin: true,
    verify: true,
    bulk: true,
  };

  async enrichEmail(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichPerson(input, false);
  }

  async enrichPhone(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichPerson(input, true);
  }

  async enrichCompany(input: EnrichmentInput): Promise<EnrichmentResult> {
    // Prospeo returns company data as part of person enrichment
    return this.enrichPerson(input, false);
  }

  async enrichLinkedIn(input: EnrichmentInput): Promise<EnrichmentResult> {
    if (!input.linkedinUrl) {
      return this.createNotFound(0);
    }
    return this.enrichPerson(input, true);
  }

  async verifyEmail(email: string): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        const response = await fetch(`${PROSPEO_API_URL}/email-verifier`, {
          method: 'POST',
          headers: {
            'X-KEY': this.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          return this.createError(`Verification failed: ${response.status}`, 'API_ERROR');
        }

        const data = await response.json();

        return {
          success: true,
          found: true,
          person: {
            email,
            emailVerified: data.email_status === 'VERIFIED',
          },
          provider: this.slug,
          creditsUsed: 1,
          responseTimeMs: 0,
          confidence: data.email_status === 'VERIFIED' ? 95 : 50,
          rawResponse: data,
        };
      } catch (error) {
        return this.createError((error as Error).message, 'REQUEST_FAILED');
      }
    });

    return { ...result, responseTimeMs: timeMs };
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const start = Date.now();
    try {
      // Test with a minimal API call
      const response = await fetch(`${PROSPEO_API_URL}/credits`, {
        method: 'GET',
        headers: { 'X-KEY': this.apiKey },
      });

      const timeMs = Date.now() - start;

      if (!response.ok) {
        return {
          success: false,
          message: `Authentication failed: ${response.status}`,
          responseTimeMs: timeMs,
          error: await response.text(),
        };
      }

      const data = await response.json();

      return {
        success: true,
        message: 'Connected to Prospeo',
        responseTimeMs: timeMs,
        creditsRemaining: data.credits_remaining || data.credits || 0,
        planType: data.plan_name,
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
      const response = await fetch(`${PROSPEO_API_URL}/credits`, {
        method: 'GET',
        headers: { 'X-KEY': this.apiKey },
      });

      if (!response.ok) {
        return { available: 0, used: 0, total: 0 };
      }

      const data = await response.json();

      return {
        available: data.credits_remaining || data.credits || 0,
        used: data.credits_used || 0,
        total: (data.credits_remaining || 0) + (data.credits_used || 0),
        planName: data.plan_name,
        resetDate: data.reset_date,
      };
    } catch {
      return { available: 0, used: 0, total: 0 };
    }
  }

  private async enrichPerson(input: EnrichmentInput, enrichMobile: boolean): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        // Validate minimum requirements
        const hasLinkedIn = !!input.linkedinUrl;
        const hasEmail = !!input.email;
        const hasName = !!(input.fullName || (input.firstName && input.lastName));
        const hasCompany = !!(input.companyName || input.companyDomain);

        if (!hasLinkedIn && !hasEmail && !(hasName && hasCompany)) {
          return this.createNotFound(0);
        }

        const requestBody = {
          data: {
            first_name: input.firstName,
            last_name: input.lastName,
            full_name: input.fullName,
            linkedin_url: input.linkedinUrl,
            email: input.email,
            company_name: input.companyName,
            company_website: input.companyDomain,
          },
          enrich_mobile: enrichMobile,
          only_verified_email: false,
          only_verified_mobile: false,
        };

        const response = await fetch(`${PROSPEO_API_URL}/enrich-person`, {
          method: 'POST',
          headers: {
            'X-KEY': this.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
          if (data.error_code === 'NO_MATCH') {
            return this.createNotFound(0);
          }
          return this.createError(data.error_code || 'API Error', data.error_code);
        }

        const person = data.person;
        const company = data.company;

        if (!person) {
          return this.createNotFound(0);
        }

        // Calculate credits used
        let creditsUsed = 0;
        if (person) creditsUsed += 1; // Base enrichment
        if (person.mobile?.revealed && person.mobile?.mobile) creditsUsed += 10; // Mobile

        return {
          success: true,
          found: true,
          person: {
            firstName: person.first_name,
            lastName: person.last_name,
            fullName: person.full_name,
            email: person.email?.revealed ? person.email.email : undefined,
            emailVerified: person.email?.status === 'VERIFIED',
            phone: person.mobile?.revealed ? person.mobile.mobile : undefined,
            phoneVerified: person.mobile?.status === 'VERIFIED',
            mobilePhone: person.mobile?.mobile_international,
            linkedinUrl: person.linkedin_url,
            title: person.current_job_title,
            location: person.location
              ? [person.location.city, person.location.country].filter(Boolean).join(', ')
              : undefined,
          },
          company: company
            ? {
                name: company.name,
                domain: company.domain,
                website: company.website,
                linkedinUrl: company.linkedin_url,
                industry: company.industry,
                employeeCount: company.employee_count,
                employeeRange: company.employee_range,
                location: company.location
                  ? [company.location.city, company.location.country].filter(Boolean).join(', ')
                  : undefined,
                description: company.description_ai || company.description,
                foundedYear: company.founded,
                revenue: company.revenue_range_printed,
                techStack: company.technology?.technology_names,
              }
            : undefined,
          provider: this.slug,
          creditsUsed,
          responseTimeMs: 0,
          confidence: person.email?.status === 'VERIFIED' ? 95 : 75,
          rawResponse: data,
        };
      } catch (error) {
        return this.createError((error as Error).message, 'REQUEST_FAILED');
      }
    });

    return { ...result, responseTimeMs: timeMs };
  }
}
