/**
 * DropContact Provider Adapter
 *
 * GDPR-compliant email and phone enrichment.
 * Strong European data coverage.
 */

import { BaseAdapter } from './baseAdapter';
import {
  ProviderCapabilities,
  EnrichmentInput,
  EnrichmentResult,
  ConnectionTestResult,
  ProviderCredits,
} from '../types';

const DROPCONTACT_API_BASE = 'https://api.dropcontact.io';

export class DropcontactAdapter extends BaseAdapter {
  slug = 'dropcontact';
  name = 'DropContact';
  capabilities: ProviderCapabilities = {
    email: true,
    phone: true,
    company: true,
    linkedin: true,
    verify: true,
    bulk: true,
  };

  async enrichEmail(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichPerson(input, { email: true, phone: false });
  }

  async enrichPhone(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichPerson(input, { email: false, phone: true });
  }

  async enrichCompany(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichPerson(input, { email: true, phone: false });
  }

  async enrichLinkedIn(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichPerson(input, { email: true, phone: true });
  }

  async verifyEmail(email: string): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        const response = await fetch(`${DROPCONTACT_API_BASE}/batch`, {
          method: 'POST',
          headers: {
            'X-Access-Token': this.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: [{ email }],
            siren: false,
            language: 'en',
          }),
        });

        if (!response.ok) {
          return this.createError(`Verification failed: ${response.status}`, 'API_ERROR');
        }

        const data = await response.json();
        const result = data.data?.[0] || {};

        return {
          success: true,
          found: true,
          person: {
            email,
            emailVerified: result.email?.qualification === 'valid',
          },
          provider: this.slug,
          creditsUsed: 1,
          responseTimeMs: 0,
          confidence: result.email?.qualification === 'valid' ? 95 : 50,
          rawResponse: result,
        };
      } catch (error) {
        return this.createError((error as Error).message, 'REQUEST_FAILED');
      }
    });

    return { ...result, responseTimeMs: timeMs };
  }

  private async enrichPerson(
    input: EnrichmentInput,
    options: { email: boolean; phone: boolean }
  ): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        const dataItem: Record<string, any> = {};

        if (input.email) dataItem.email = input.email;
        if (input.firstName) dataItem.first_name = input.firstName;
        if (input.lastName) dataItem.last_name = input.lastName;
        if (input.fullName) dataItem.full_name = input.fullName;
        if (input.companyName) dataItem.company = input.companyName;
        if (input.companyDomain) dataItem.website = input.companyDomain;
        if (input.linkedinUrl) dataItem.linkedin = input.linkedinUrl;

        if (Object.keys(dataItem).length === 0) {
          return this.createNotFound(0);
        }

        const response = await fetch(`${DROPCONTACT_API_BASE}/batch`, {
          method: 'POST',
          headers: {
            'X-Access-Token': this.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: [dataItem],
            siren: false,
            language: 'en',
          }),
        });

        if (!response.ok) {
          return this.createError(`API Error: ${response.status}`, 'API_ERROR');
        }

        const data = await response.json();
        const requestId = data.request_id;

        // Poll for results
        const enrichedData = await this.pollForResult(requestId);

        if (!enrichedData || enrichedData.length === 0) {
          return this.createNotFound(0);
        }

        const person = enrichedData[0];

        return {
          success: true,
          found: true,
          person: {
            firstName: person.first_name,
            lastName: person.last_name,
            fullName: person.full_name,
            email: person.email?.[0] || person.email,
            emailVerified: person.email_qualification === 'valid',
            phone: person.phone,
            mobilePhone: person.mobile_phone,
            linkedinUrl: person.linkedin,
            title: person.job,
            seniority: person.seniority,
            department: person.department,
            location: person.country,
          },
          company: {
            name: person.company,
            domain: person.website,
            website: person.website ? `https://${person.website}` : undefined,
            linkedinUrl: person.company_linkedin,
            industry: person.company_industry,
            employeeCount: person.company_size,
            location: person.company_country,
          },
          provider: this.slug,
          creditsUsed: 2,
          responseTimeMs: 0,
          confidence: person.email_qualification === 'valid' ? 90 : 70,
          rawResponse: person,
        };
      } catch (error) {
        return this.createError((error as Error).message, 'REQUEST_FAILED');
      }
    });

    return { ...result, responseTimeMs: timeMs };
  }

  private async pollForResult(requestId: string, maxAttempts = 10): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      await this.delay(2000);

      try {
        const response = await fetch(`${DROPCONTACT_API_BASE}/batch/${requestId}`, {
          method: 'GET',
          headers: { 'X-Access-Token': this.apiKey },
        });

        if (!response.ok) continue;

        const data = await response.json();

        if (data.success && data.data) {
          return data.data;
        }

        if (data.error) {
          return null;
        }
      } catch {
        // Continue polling
      }
    }

    return null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const start = Date.now();
    try {
      const response = await fetch(`${DROPCONTACT_API_BASE}/credits`, {
        method: 'GET',
        headers: { 'X-Access-Token': this.apiKey },
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
        message: 'Connected to DropContact',
        responseTimeMs: timeMs,
        creditsRemaining: data.credits || 0,
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
      const response = await fetch(`${DROPCONTACT_API_BASE}/credits`, {
        method: 'GET',
        headers: { 'X-Access-Token': this.apiKey },
      });

      if (!response.ok) {
        return { available: 0, used: 0, total: 0 };
      }

      const data = await response.json();

      return {
        available: data.credits || 0,
        used: data.used || 0,
        total: (data.credits || 0) + (data.used || 0),
        planName: data.plan,
      };
    } catch {
      return { available: 0, used: 0, total: 0 };
    }
  }
}
