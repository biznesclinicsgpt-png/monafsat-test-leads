/**
 * Clearbit Provider Adapter
 *
 * Premium B2B data enrichment platform.
 * Strong company and person data enrichment.
 */

import { BaseAdapter } from './baseAdapter';
import {
  ProviderCapabilities,
  EnrichmentInput,
  EnrichmentResult,
  ConnectionTestResult,
  ProviderCredits,
} from '../types';

const CLEARBIT_API_BASE = 'https://person.clearbit.com/v2';
const CLEARBIT_COMPANY_API = 'https://company.clearbit.com/v2';

export class ClearbitAdapter extends BaseAdapter {
  slug = 'clearbit';
  name = 'Clearbit';
  capabilities: ProviderCapabilities = {
    email: true,
    phone: false,
    company: true,
    linkedin: true,
    verify: false,
    bulk: true,
  };

  private getAuthHeader(): string {
    return `Bearer ${this.apiKey}`;
  }

  async enrichEmail(input: EnrichmentInput): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        if (!input.email) {
          return this.createNotFound(0);
        }

        const response = await fetch(`${CLEARBIT_API_BASE}/people/find?email=${encodeURIComponent(input.email)}`, {
          method: 'GET',
          headers: { Authorization: this.getAuthHeader() },
        });

        if (response.status === 404) {
          return this.createNotFound(0);
        }

        if (!response.ok) {
          return this.createError(`API Error: ${response.status}`, 'API_ERROR');
        }

        const data = await response.json();

        return {
          success: true,
          found: true,
          person: {
            firstName: data.name?.givenName,
            lastName: data.name?.familyName,
            fullName: data.name?.fullName,
            email: data.email,
            linkedinUrl: data.linkedin?.handle ? `https://linkedin.com/in/${data.linkedin.handle}` : undefined,
            title: data.employment?.title,
            seniority: data.employment?.seniority,
            location: data.location,
            photoUrl: data.avatar,
          },
          company: data.employment
            ? {
                name: data.employment.name,
                domain: data.employment.domain,
              }
            : undefined,
          provider: this.slug,
          creditsUsed: 1,
          responseTimeMs: 0,
          confidence: 90,
          rawResponse: data,
        };
      } catch (error) {
        return this.createError((error as Error).message, 'REQUEST_FAILED');
      }
    });

    return { ...result, responseTimeMs: timeMs };
  }

  async enrichPhone(input: EnrichmentInput): Promise<EnrichmentResult> {
    // Clearbit doesn't provide phone enrichment
    return this.createNotFound(0);
  }

  async enrichCompany(input: EnrichmentInput): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        if (!input.companyDomain) {
          return this.createNotFound(0);
        }

        const response = await fetch(`${CLEARBIT_COMPANY_API}/companies/find?domain=${encodeURIComponent(input.companyDomain)}`, {
          method: 'GET',
          headers: { Authorization: this.getAuthHeader() },
        });

        if (response.status === 404) {
          return this.createNotFound(0);
        }

        if (!response.ok) {
          return this.createError(`API Error: ${response.status}`, 'API_ERROR');
        }

        const data = await response.json();

        return {
          success: true,
          found: true,
          company: {
            name: data.name,
            domain: data.domain,
            website: data.url,
            linkedinUrl: data.linkedin?.handle ? `https://linkedin.com/company/${data.linkedin.handle}` : undefined,
            industry: data.category?.industry,
            employeeCount: data.metrics?.employees,
            employeeRange: data.metrics?.employeesRange,
            location: [data.geo?.city, data.geo?.country].filter(Boolean).join(', '),
            description: data.description,
            logoUrl: data.logo,
            foundedYear: data.foundedYear,
            revenue: data.metrics?.estimatedAnnualRevenue,
            techStack: data.tech,
          },
          provider: this.slug,
          creditsUsed: 1,
          responseTimeMs: 0,
          confidence: 95,
          rawResponse: data,
        };
      } catch (error) {
        return this.createError((error as Error).message, 'REQUEST_FAILED');
      }
    });

    return { ...result, responseTimeMs: timeMs };
  }

  async enrichLinkedIn(input: EnrichmentInput): Promise<EnrichmentResult> {
    // Clearbit enriches by email, which includes LinkedIn data
    return this.enrichEmail(input);
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const start = Date.now();
    try {
      // Test with a known domain
      const response = await fetch(`${CLEARBIT_COMPANY_API}/companies/find?domain=clearbit.com`, {
        method: 'GET',
        headers: { Authorization: this.getAuthHeader() },
      });

      const timeMs = Date.now() - start;

      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          message: 'Authentication failed',
          responseTimeMs: timeMs,
          error: 'Invalid API key',
        };
      }

      return {
        success: true,
        message: 'Connected to Clearbit',
        responseTimeMs: timeMs,
        planType: 'Clearbit API',
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
    // Clearbit doesn't have a standard credits endpoint
    return {
      available: 0,
      used: 0,
      total: 0,
      unlimited: true,
      planName: 'Clearbit',
    };
  }
}
