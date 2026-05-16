/**
 * Icypeas Provider Adapter
 *
 * Email finder and verifier with strong verification focus.
 */

import { BaseAdapter } from './baseAdapter';
import {
  ProviderCapabilities,
  EnrichmentInput,
  EnrichmentResult,
  ConnectionTestResult,
  ProviderCredits,
} from '../types';

const ICYPEAS_API_BASE = 'https://app.icypeas.com/api';

export class IcypeasAdapter extends BaseAdapter {
  slug = 'icypeas';
  name = 'Icypeas';
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
        if (!input.firstName || !input.lastName || !input.companyDomain) {
          return this.createNotFound(0);
        }

        const response = await fetch(`${ICYPEAS_API_BASE}/email-search`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: input.firstName,
            last_name: input.lastName,
            domain: input.companyDomain,
          }),
        });

        if (!response.ok) {
          if (response.status === 404) {
            return this.createNotFound(0);
          }
          return this.createError(`API Error: ${response.status}`, 'API_ERROR');
        }

        const data = await response.json();

        if (!data.email) {
          return this.createNotFound(0);
        }

        return {
          success: true,
          found: true,
          person: {
            firstName: input.firstName,
            lastName: input.lastName,
            fullName: `${input.firstName} ${input.lastName}`,
            email: data.email,
            emailVerified: data.verification_status === 'valid',
          },
          company: {
            domain: input.companyDomain,
          },
          provider: this.slug,
          creditsUsed: 1,
          responseTimeMs: 0,
          confidence: data.confidence || 75,
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
        const response = await fetch(`${ICYPEAS_API_BASE}/email-verification`, {
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
            emailVerified: data.status === 'valid',
          },
          provider: this.slug,
          creditsUsed: 1,
          responseTimeMs: 0,
          confidence: data.status === 'valid' ? 95 : 50,
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
      const response = await fetch(`${ICYPEAS_API_BASE}/credits`, {
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
        message: 'Connected to Icypeas',
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
      const response = await fetch(`${ICYPEAS_API_BASE}/credits`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
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
