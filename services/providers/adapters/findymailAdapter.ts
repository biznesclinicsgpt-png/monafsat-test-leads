/**
 * Findymail Provider Adapter
 *
 * Email finder with high deliverability focus.
 * Uses LinkedIn URL and name/company combinations.
 */

import { BaseAdapter } from './baseAdapter';
import {
  ProviderCapabilities,
  EnrichmentInput,
  EnrichmentResult,
  ConnectionTestResult,
  ProviderCredits,
} from '../types';

const FINDYMAIL_API_BASE = 'https://app.findymail.com/api';

export class FindymailAdapter extends BaseAdapter {
  slug = 'findymail';
  name = 'Findymail';
  capabilities: ProviderCapabilities = {
    email: true,
    phone: false,
    company: false,
    linkedin: false,
    verify: true,
    bulk: true,
  };

  async enrichEmail(input: EnrichmentInput): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        // Try LinkedIn URL first if available
        if (input.linkedinUrl) {
          return this.findByLinkedIn(input.linkedinUrl);
        }

        // Otherwise use name + domain
        if (!input.firstName || !input.lastName || !input.companyDomain) {
          return this.createNotFound(0);
        }

        const response = await fetch(`${FINDYMAIL_API_BASE}/search/name`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: input.firstName,
            last_name: input.lastName,
            domain: input.companyDomain,
            company_name: input.companyName,
          }),
        });

        if (!response.ok) {
          if (response.status === 404) {
            return this.createNotFound(0);
          }
          return this.createError(`API Error: ${response.status}`, 'API_ERROR');
        }

        const data = await response.json();

        if (!data.email && !data.contact?.email) {
          return this.createNotFound(0);
        }

        const email = data.email || data.contact?.email;
        const contact = data.contact || {};

        return {
          success: true,
          found: true,
          person: {
            firstName: contact.first_name || input.firstName,
            lastName: contact.last_name || input.lastName,
            fullName: contact.name || `${input.firstName} ${input.lastName}`,
            email,
            emailVerified: data.verified || data.verification_status === 'valid',
            title: contact.title,
          },
          company: {
            name: contact.company || input.companyName,
            domain: input.companyDomain,
          },
          provider: this.slug,
          creditsUsed: 2,
          responseTimeMs: 0,
          confidence: data.confidence || 80,
          rawResponse: data,
        };
      } catch (error) {
        return this.createError((error as Error).message, 'REQUEST_FAILED');
      }
    });

    return { ...result, responseTimeMs: timeMs };
  }

  async enrichPhone(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.createNotFound(0);
  }

  async verifyEmail(email: string): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        const response = await fetch(`${FINDYMAIL_API_BASE}/verify`, {
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

  private async findByLinkedIn(linkedinUrl: string): Promise<EnrichmentResult> {
    try {
      const response = await fetch(`${FINDYMAIL_API_BASE}/search/linkedin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkedin_url: linkedinUrl }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return this.createNotFound(0);
        }
        return this.createError(`API Error: ${response.status}`, 'API_ERROR');
      }

      const data = await response.json();
      const contact = data.contact || data;

      if (!contact.email) {
        return this.createNotFound(0);
      }

      return {
        success: true,
        found: true,
        person: {
          firstName: contact.first_name,
          lastName: contact.last_name,
          fullName: contact.name,
          email: contact.email,
          emailVerified: data.verified,
          linkedinUrl,
          title: contact.title,
        },
        company: contact.company
          ? {
              name: contact.company,
              domain: contact.domain,
            }
          : undefined,
        provider: this.slug,
        creditsUsed: 2,
        responseTimeMs: 0,
        confidence: data.confidence || 85,
        rawResponse: data,
      };
    } catch (error) {
      return this.createError((error as Error).message, 'REQUEST_FAILED');
    }
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const start = Date.now();
    try {
      const response = await fetch(`${FINDYMAIL_API_BASE}/credits`, {
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
        message: 'Connected to Findymail',
        responseTimeMs: timeMs,
        creditsRemaining: data.credits || data.remaining || 0,
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
      const response = await fetch(`${FINDYMAIL_API_BASE}/credits`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
      });

      if (!response.ok) {
        return { available: 0, used: 0, total: 0 };
      }

      const data = await response.json();

      return {
        available: data.credits || data.remaining || 0,
        used: data.used || 0,
        total: (data.credits || data.remaining || 0) + (data.used || 0),
        planName: data.plan,
      };
    } catch {
      return { available: 0, used: 0, total: 0 };
    }
  }
}
