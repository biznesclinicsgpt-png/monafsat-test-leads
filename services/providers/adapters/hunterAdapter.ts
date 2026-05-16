/**
 * Hunter.io Provider Adapter
 *
 * Domain-based email finder and verifier.
 * Strong at finding emails by company domain.
 */

import { BaseAdapter } from './baseAdapter';
import {
  ProviderCapabilities,
  EnrichmentInput,
  EnrichmentResult,
  ConnectionTestResult,
  ProviderCredits,
} from '../types';

const HUNTER_API_BASE = 'https://api.hunter.io/v2';

export class HunterAdapter extends BaseAdapter {
  slug = 'hunter';
  name = 'Hunter.io';
  capabilities: ProviderCapabilities = {
    email: true,
    phone: false,
    company: true,
    linkedin: false,
    verify: true,
    bulk: true,
  };

  async enrichEmail(input: EnrichmentInput): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        if (!input.companyDomain && !input.companyName) {
          return this.createNotFound(0);
        }

        const params = new URLSearchParams({
          api_key: this.apiKey,
        });

        if (input.companyDomain) {
          params.append('domain', input.companyDomain);
        } else if (input.companyName) {
          params.append('company', input.companyName);
        }

        if (input.firstName) params.append('first_name', input.firstName);
        if (input.lastName) params.append('last_name', input.lastName);
        if (input.fullName) {
          const [first, ...rest] = input.fullName.split(' ');
          params.append('first_name', first);
          params.append('last_name', rest.join(' '));
        }

        const response = await fetch(`${HUNTER_API_BASE}/email-finder?${params}`, {
          method: 'GET',
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          if (response.status === 404 || error.errors?.[0]?.code === 'not_found') {
            return this.createNotFound(0);
          }
          return this.createError(error.errors?.[0]?.details || 'API Error', 'API_ERROR');
        }

        const data = await response.json();
        const result = data.data;

        if (!result || !result.email) {
          return this.createNotFound(0);
        }

        return {
          success: true,
          found: true,
          person: {
            firstName: result.first_name,
            lastName: result.last_name,
            fullName: `${result.first_name || ''} ${result.last_name || ''}`.trim(),
            email: result.email,
            emailVerified: result.verification?.status === 'valid',
            linkedinUrl: result.linkedin,
            title: result.position,
            department: result.department,
            photoUrl: result.twitter ? `https://unavatar.io/twitter/${result.twitter}` : undefined,
          },
          company: {
            name: result.company,
            domain: result.domain,
          },
          provider: this.slug,
          creditsUsed: 1,
          responseTimeMs: 0,
          confidence: result.score || 80,
          rawResponse: result,
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

  async enrichCompany(input: EnrichmentInput): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        if (!input.companyDomain) {
          return this.createNotFound(0);
        }

        const params = new URLSearchParams({
          api_key: this.apiKey,
          domain: input.companyDomain,
        });

        const response = await fetch(`${HUNTER_API_BASE}/domain-search?${params}`, {
          method: 'GET',
        });

        if (!response.ok) {
          return this.createError(`API Error: ${response.status}`, 'API_ERROR');
        }

        const data = await response.json();
        const result = data.data;

        if (!result) {
          return this.createNotFound(0);
        }

        return {
          success: true,
          found: true,
          company: {
            name: result.organization,
            domain: result.domain,
            website: `https://${result.domain}`,
            linkedinUrl: result.linkedin,
            industry: result.industry,
            employeeRange: result.headcount,
            location: result.country,
            description: result.description,
          },
          provider: this.slug,
          creditsUsed: 1,
          responseTimeMs: 0,
          confidence: 90,
          rawResponse: result,
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
        const params = new URLSearchParams({
          api_key: this.apiKey,
          email,
        });

        const response = await fetch(`${HUNTER_API_BASE}/email-verifier?${params}`, {
          method: 'GET',
        });

        if (!response.ok) {
          return this.createError(`Verification failed: ${response.status}`, 'API_ERROR');
        }

        const data = await response.json();
        const result = data.data;

        return {
          success: true,
          found: true,
          person: {
            email,
            emailVerified: result.status === 'valid',
          },
          provider: this.slug,
          creditsUsed: 1,
          responseTimeMs: 0,
          confidence: result.score || 50,
          rawResponse: result,
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
      const params = new URLSearchParams({ api_key: this.apiKey });
      const response = await fetch(`${HUNTER_API_BASE}/account?${params}`, {
        method: 'GET',
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
      const account = data.data;

      return {
        success: true,
        message: 'Connected to Hunter.io',
        responseTimeMs: timeMs,
        accountName: account.email,
        creditsRemaining: account.requests?.searches?.available || 0,
        planType: account.plan_name,
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
      const params = new URLSearchParams({ api_key: this.apiKey });
      const response = await fetch(`${HUNTER_API_BASE}/account?${params}`, {
        method: 'GET',
      });

      if (!response.ok) {
        return { available: 0, used: 0, total: 0 };
      }

      const data = await response.json();
      const requests = data.data.requests?.searches || {};

      return {
        available: requests.available || 0,
        used: requests.used || 0,
        total: (requests.available || 0) + (requests.used || 0),
        planName: data.data.plan_name,
        resetDate: data.data.reset_date,
      };
    } catch {
      return { available: 0, used: 0, total: 0 };
    }
  }
}
