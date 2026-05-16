/**
 * Lemlist Provider Adapter
 *
 * Email outreach platform with built-in email finder.
 * Supports async enrichment with polling.
 */

import { BaseAdapter } from './baseAdapter';
import {
  ProviderCapabilities,
  EnrichmentInput,
  EnrichmentResult,
  ConnectionTestResult,
  ProviderCredits,
} from '../types';

const LEMLIST_API_BASE = 'https://api.lemlist.com/api';
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 30000;

export class LemlistAdapter extends BaseAdapter {
  slug = 'lemlist';
  name = 'Lemlist';
  capabilities: ProviderCapabilities = {
    email: true,
    phone: true,
    company: false,
    linkedin: true,
    verify: true,
    bulk: true,
  };

  private getAuthHeader(): string {
    // Lemlist uses Basic auth with API key as password
    const credentials = Buffer.from(`:${this.apiKey}`).toString('base64');
    return `Basic ${credentials}`;
  }

  async enrichEmail(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichPerson(input, { findEmail: true, findPhone: false });
  }

  async enrichPhone(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichPerson(input, { findEmail: false, findPhone: true });
  }

  async enrichLinkedIn(input: EnrichmentInput): Promise<EnrichmentResult> {
    if (!input.linkedinUrl) {
      return this.createNotFound(0);
    }
    return this.enrichPerson(input, { findEmail: true, findPhone: true, linkedinEnrichment: true });
  }

  async verifyEmail(email: string): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        const params = new URLSearchParams({
          email,
          verifyEmail: 'true',
        });

        const response = await fetch(`${LEMLIST_API_BASE}/enrich?${params}`, {
          method: 'POST',
          headers: { Authorization: this.getAuthHeader() },
        });

        if (!response.ok) {
          return this.createError(`Verification failed: ${response.status}`, 'API_ERROR');
        }

        const data = await response.json();
        const result = await this.pollForResult(data.id);

        return {
          success: true,
          found: true,
          person: {
            email,
            emailVerified: result?.emailStatus === 'valid',
          },
          provider: this.slug,
          creditsUsed: 1,
          responseTimeMs: 0,
          confidence: result?.emailStatus === 'valid' ? 95 : 50,
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
      const response = await fetch(`${LEMLIST_API_BASE}/team/credits`, {
        method: 'GET',
        headers: { Authorization: this.getAuthHeader() },
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
      const credits = data.details?.remaining || { total: data.credits || 0 };

      return {
        success: true,
        message: 'Connected to Lemlist',
        responseTimeMs: timeMs,
        creditsRemaining: credits.total || 0,
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
      const response = await fetch(`${LEMLIST_API_BASE}/team/credits`, {
        method: 'GET',
        headers: { Authorization: this.getAuthHeader() },
      });

      if (!response.ok) {
        return { available: 0, used: 0, total: 0 };
      }

      const data = await response.json();
      const details = data.details?.remaining || {};

      return {
        available: details.total || data.credits || 0,
        used: 0,
        total: details.total || data.credits || 0,
        planName: 'Lemlist',
      };
    } catch {
      return { available: 0, used: 0, total: 0 };
    }
  }

  private async enrichPerson(
    input: EnrichmentInput,
    options: { findEmail?: boolean; findPhone?: boolean; linkedinEnrichment?: boolean }
  ): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        const params = new URLSearchParams();

        if (options.findEmail) params.append('findEmail', 'true');
        if (options.findPhone) params.append('findPhone', 'true');
        if (options.linkedinEnrichment) params.append('linkedinEnrichment', 'true');
        if (input.email) params.append('email', input.email);
        if (input.linkedinUrl) params.append('linkedinUrl', input.linkedinUrl);
        if (input.firstName) params.append('firstName', input.firstName);
        if (input.lastName) params.append('lastName', input.lastName);
        if (input.companyDomain) params.append('companyDomain', input.companyDomain);
        if (input.companyName) params.append('companyName', input.companyName);

        const response = await fetch(`${LEMLIST_API_BASE}/enrich?${params}`, {
          method: 'POST',
          headers: { Authorization: this.getAuthHeader() },
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          return this.createError(error.message || `API Error: ${response.status}`, 'API_ERROR');
        }

        const data = await response.json();
        const enrichmentResult = await this.pollForResult(data.id);

        if (!enrichmentResult) {
          return this.createNotFound(0);
        }

        // Parse the Lemlist response structure
        // Response format: { data: { email: {...}, phone: {...}, linkedin: {...} } }
        const resultData = enrichmentResult.data || enrichmentResult;
        const emailData = resultData.email || {};
        const phoneData = resultData.phone || {};
        const linkedinData = resultData.linkedin || {};

        // Check if anything was found
        const emailFound = emailData.email && !emailData.notFound;
        const phoneFound = phoneData.phone && !phoneData.notFound;
        const linkedinFound = linkedinData.firstName || linkedinData.lastName;

        if (!emailFound && !phoneFound && !linkedinFound) {
          return this.createNotFound((options.findEmail ? 1 : 0) + (options.findPhone ? 5 : 0));
        }

        return {
          success: true,
          found: true,
          person: {
            firstName: linkedinData.firstName || input.firstName,
            lastName: linkedinData.lastName || input.lastName,
            fullName: linkedinData.firstName && linkedinData.lastName
              ? `${linkedinData.firstName} ${linkedinData.lastName}`
              : undefined,
            email: emailFound ? emailData.email : undefined,
            emailVerified: emailData.status === 'valid',
            phone: phoneFound ? phoneData.phone : undefined,
            linkedinUrl: linkedinData.linkedinUrl || input.linkedinUrl,
            title: linkedinData.occupation || linkedinData.positionGroups?.[0]?.profilePositions?.[0]?.title,
            location: linkedinData.locationName,
            photoUrl: linkedinData.picture,
          },
          company: linkedinData.companyName || linkedinData.positionGroups?.[0]?.company
            ? {
                name: linkedinData.companyName || linkedinData.positionGroups?.[0]?.company?.name,
                domain: linkedinData.positionGroups?.[0]?.company?.domain,
                website: linkedinData.positionGroups?.[0]?.company?.website,
                linkedinUrl: linkedinData.positionGroups?.[0]?.company?.linkedinUrl,
                industry: linkedinData.positionGroups?.[0]?.company?.industry,
                employeeCount: linkedinData.positionGroups?.[0]?.company?.employeesOnLinkedin,
              }
            : undefined,
          provider: this.slug,
          creditsUsed: (options.findEmail ? 1 : 0) + (options.findPhone ? 5 : 0),
          responseTimeMs: 0,
          confidence: phoneFound || emailFound ? 90 : 70,
          rawResponse: enrichmentResult,
        };
      } catch (error) {
        return this.createError((error as Error).message, 'REQUEST_FAILED');
      }
    });

    return { ...result, responseTimeMs: timeMs };
  }

  private async pollForResult(enrichmentId: string): Promise<any> {
    const startTime = Date.now();
    const EXTENDED_TIMEOUT = 120000; // 2 minutes for LinkedIn enrichment

    while (Date.now() - startTime < EXTENDED_TIMEOUT) {
      await this.delay(POLL_INTERVAL_MS);

      try {
        const response = await fetch(`${LEMLIST_API_BASE}/enrich/${enrichmentId}`, {
          method: 'GET',
          headers: { Authorization: this.getAuthHeader() },
        });

        if (!response.ok) continue;

        const result = await response.json();

        // Lemlist uses enrichmentStatus field
        if (result.enrichmentStatus === 'done' || result.enrichmentStatus === 'completed') {
          return result;
        }

        if (result.enrichmentStatus === 'failed' || result.enrichmentStatus === 'error') {
          return null;
        }

        // Also check legacy format
        if (result.type === 'enrichmentDone' || result.status === 'completed') {
          return result;
        }

        if (result.type === 'enrichmentFailed' || result.status === 'failed') {
          return null;
        }
      } catch {
        // Continue polling on errors
      }
    }

    return null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
