/**
 * BetterContact Provider Adapter
 *
 * Waterfall enrichment across multiple providers.
 * Good for finding hard-to-reach contacts.
 */

import { BaseAdapter } from './baseAdapter';
import {
  ProviderCapabilities,
  EnrichmentInput,
  EnrichmentResult,
  ConnectionTestResult,
  ProviderCredits,
} from '../types';

const BETTERCONTACT_API_BASE = 'https://app.bettercontact.rocks/api/v1';

export class BettercontactAdapter extends BaseAdapter {
  slug = 'bettercontact';
  name = 'BetterContact';
  capabilities: ProviderCapabilities = {
    email: true,
    phone: true,
    company: false,
    linkedin: false,
    verify: true,
    bulk: true,
  };

  async enrichEmail(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichPerson(input, 'email');
  }

  async enrichPhone(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichPerson(input, 'phone');
  }

  private async enrichPerson(
    input: EnrichmentInput,
    enrichType: 'email' | 'phone' | 'both' = 'both'
  ): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        const requestBody: Record<string, any> = {
          enrich_email: enrichType === 'email' || enrichType === 'both',
          enrich_phone: enrichType === 'phone' || enrichType === 'both',
        };

        if (input.linkedinUrl) requestBody.linkedin_url = input.linkedinUrl;
        if (input.email) requestBody.email = input.email;
        if (input.firstName) requestBody.first_name = input.firstName;
        if (input.lastName) requestBody.last_name = input.lastName;
        if (input.fullName) {
          const parts = input.fullName.split(' ');
          requestBody.first_name = parts[0];
          requestBody.last_name = parts.slice(1).join(' ');
        }
        if (input.companyName) requestBody.company_name = input.companyName;
        if (input.companyDomain) requestBody.company_domain = input.companyDomain;

        const hasMinimumData =
          input.linkedinUrl ||
          input.email ||
          ((input.firstName || input.fullName) && (input.companyName || input.companyDomain));

        if (!hasMinimumData) {
          return this.createNotFound(0);
        }

        const response = await fetch(`${BETTERCONTACT_API_BASE}/enrich`, {
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

        // BetterContact may return async result
        if (data.request_id) {
          const enrichedData = await this.pollForResult(data.request_id);
          if (!enrichedData) {
            return this.createNotFound(0);
          }
          return this.parseResult(enrichedData, input);
        }

        return this.parseResult(data, input);
      } catch (error) {
        return this.createError((error as Error).message, 'REQUEST_FAILED');
      }
    });

    return { ...result, responseTimeMs: timeMs };
  }

  private parseResult(data: any, input: EnrichmentInput): EnrichmentResult {
    const person = data.person || data.contact || data;

    if (!person.email && !person.phone) {
      return this.createNotFound(0);
    }

    return {
      success: true,
      found: true,
      person: {
        firstName: person.first_name || input.firstName,
        lastName: person.last_name || input.lastName,
        fullName: person.full_name || `${person.first_name || ''} ${person.last_name || ''}`.trim(),
        email: person.email,
        emailVerified: person.email_verified || person.email_status === 'valid',
        phone: person.phone,
        phoneVerified: person.phone_verified,
        linkedinUrl: person.linkedin_url || input.linkedinUrl,
        title: person.title || person.job_title,
      },
      company: {
        name: person.company_name || input.companyName,
        domain: person.company_domain || input.companyDomain,
      },
      provider: this.slug,
      creditsUsed: data.credits_used || (person.email && person.phone ? 13 : person.email ? 3 : 10),
      responseTimeMs: 0,
      confidence: person.email_verified ? 90 : 75,
      rawResponse: data,
    };
  }

  private async pollForResult(requestId: string, maxAttempts = 15): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      await this.delay(2000);

      try {
        const response = await fetch(`${BETTERCONTACT_API_BASE}/enrich/${requestId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${this.apiKey}` },
        });

        if (!response.ok) continue;

        const data = await response.json();

        if (data.status === 'completed' || data.status === 'done') {
          return data;
        }

        if (data.status === 'failed' || data.status === 'error') {
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

  async verifyEmail(email: string): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        const response = await fetch(`${BETTERCONTACT_API_BASE}/verify`, {
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
      const response = await fetch(`${BETTERCONTACT_API_BASE}/account`, {
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
        message: 'Connected to BetterContact',
        responseTimeMs: timeMs,
        creditsRemaining: data.credits || 0,
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
      const response = await fetch(`${BETTERCONTACT_API_BASE}/account`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
      });

      if (!response.ok) {
        return { available: 0, used: 0, total: 0 };
      }

      const data = await response.json();

      return {
        available: data.credits || 0,
        used: data.credits_used || 0,
        total: (data.credits || 0) + (data.credits_used || 0),
        planName: data.plan,
      };
    } catch {
      return { available: 0, used: 0, total: 0 };
    }
  }
}
