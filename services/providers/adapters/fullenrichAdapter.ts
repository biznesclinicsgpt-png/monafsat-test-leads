/**
 * FullEnrich Provider Adapter
 *
 * Multi-source enrichment aggregator.
 * Combines data from multiple providers for higher accuracy.
 */

import { BaseAdapter } from './baseAdapter';
import {
  ProviderCapabilities,
  EnrichmentInput,
  EnrichmentResult,
  ConnectionTestResult,
  ProviderCredits,
} from '../types';

const FULLENRICH_API_BASE = 'https://api.fullenrich.com/v1';

export class FullenrichAdapter extends BaseAdapter {
  slug = 'fullenrich';
  name = 'FullEnrich';
  capabilities: ProviderCapabilities = {
    email: true,
    phone: true,
    company: true,
    linkedin: true,
    verify: true,
    bulk: true,
  };

  async enrichEmail(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichPerson(input);
  }

  async enrichPhone(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichPerson(input);
  }

  async enrichCompany(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichPerson(input);
  }

  async enrichLinkedIn(input: EnrichmentInput): Promise<EnrichmentResult> {
    if (!input.linkedinUrl) {
      return this.createNotFound(0);
    }
    return this.enrichPerson(input);
  }

  private async enrichPerson(input: EnrichmentInput): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        const requestBody: Record<string, any> = {};

        if (input.linkedinUrl) requestBody.linkedin_url = input.linkedinUrl;
        if (input.email) requestBody.email = input.email;
        if (input.firstName) requestBody.first_name = input.firstName;
        if (input.lastName) requestBody.last_name = input.lastName;
        if (input.fullName) requestBody.name = input.fullName;
        if (input.companyName) requestBody.company = input.companyName;
        if (input.companyDomain) requestBody.domain = input.companyDomain;

        if (Object.keys(requestBody).length === 0) {
          return this.createNotFound(0);
        }

        const response = await fetch(`${FULLENRICH_API_BASE}/enrich`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          if (response.status === 404) {
            return this.createNotFound(0);
          }
          return this.createError(`API Error: ${response.status}`, 'API_ERROR');
        }

        const data = await response.json();
        const person = data.person || data;
        const company = data.company || person.company || {};

        if (!person.email && !person.phone) {
          return this.createNotFound(0);
        }

        return {
          success: true,
          found: true,
          person: {
            firstName: person.first_name,
            lastName: person.last_name,
            fullName: person.name || person.full_name,
            email: person.email,
            emailVerified: person.email_verified,
            phone: person.phone,
            phoneVerified: person.phone_verified,
            mobilePhone: person.mobile_phone,
            linkedinUrl: person.linkedin_url,
            title: person.title || person.job_title,
            seniority: person.seniority,
            department: person.department,
            location: person.location,
            photoUrl: person.photo_url,
          },
          company: {
            name: company.name,
            domain: company.domain,
            website: company.website,
            linkedinUrl: company.linkedin_url,
            industry: company.industry,
            employeeCount: company.employee_count,
            employeeRange: company.employee_range,
            location: company.location,
            description: company.description,
            logoUrl: company.logo_url,
            foundedYear: company.founded_year,
            revenue: company.revenue,
            techStack: company.tech_stack,
          },
          provider: this.slug,
          creditsUsed: data.credits_used || 2,
          responseTimeMs: 0,
          confidence: data.confidence || 85,
          rawResponse: data,
        };
      } catch (error) {
        return this.createError((error as Error).message, 'REQUEST_FAILED');
      }
    });

    return { ...result, responseTimeMs: timeMs };
  }

  async verifyEmail(email: string): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        const response = await fetch(`${FULLENRICH_API_BASE}/verify/email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
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
            emailVerified: data.valid === true || data.status === 'valid',
          },
          provider: this.slug,
          creditsUsed: 1,
          responseTimeMs: 0,
          confidence: data.valid ? 95 : 50,
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
      const response = await fetch(`${FULLENRICH_API_BASE}/account`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
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
        message: 'Connected to FullEnrich',
        responseTimeMs: timeMs,
        creditsRemaining: data.credits || data.credits_remaining || 0,
        planType: data.plan,
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
      const response = await fetch(`${FULLENRICH_API_BASE}/account`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
      });

      if (!response.ok) {
        return { available: 0, used: 0, total: 0 };
      }

      const data = await response.json();

      return {
        available: data.credits || data.credits_remaining || 0,
        used: data.credits_used || 0,
        total: (data.credits || data.credits_remaining || 0) + (data.credits_used || 0),
        planName: data.plan,
      };
    } catch {
      return { available: 0, used: 0, total: 0 };
    }
  }
}
