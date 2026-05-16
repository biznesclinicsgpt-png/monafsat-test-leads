/**
 * ContactOut Provider Adapter
 *
 * LinkedIn email and phone finder.
 * Specializes in LinkedIn profile enrichment.
 */

import { BaseAdapter } from './baseAdapter';
import {
  ProviderCapabilities,
  EnrichmentInput,
  EnrichmentResult,
  ConnectionTestResult,
  ProviderCredits,
} from '../types';

const CONTACTOUT_API_BASE = 'https://api.contactout.com/v1';

export class ContactoutAdapter extends BaseAdapter {
  slug = 'contactout';
  name = 'ContactOut';
  capabilities: ProviderCapabilities = {
    email: true,
    phone: true,
    company: false,
    linkedin: true,
    verify: false,
    bulk: true,
  };

  async enrichEmail(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichFromLinkedIn(input);
  }

  async enrichPhone(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichFromLinkedIn(input);
  }

  async enrichLinkedIn(input: EnrichmentInput): Promise<EnrichmentResult> {
    return this.enrichFromLinkedIn(input);
  }

  private async enrichFromLinkedIn(input: EnrichmentInput): Promise<EnrichmentResult> {
    const { result, timeMs } = await this.measureTime(async () => {
      try {
        // ContactOut primarily works with LinkedIn URLs
        if (!input.linkedinUrl) {
          // Try to find by email if no LinkedIn URL
          if (input.email) {
            return this.enrichByEmail(input.email);
          }
          return this.createNotFound(0);
        }

        const response = await fetch(`${CONTACTOUT_API_BASE}/people/linkedin`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            linkedin_url: input.linkedinUrl,
            include_phone: true,
          }),
        });

        if (!response.ok) {
          if (response.status === 404) {
            return this.createNotFound(0);
          }
          return this.createError(`API Error: ${response.status}`, 'API_ERROR');
        }

        const data = await response.json();
        const person = data.person || data;

        if (!person.emails?.length && !person.phones?.length) {
          return this.createNotFound(0);
        }

        return {
          success: true,
          found: true,
          person: {
            firstName: person.first_name,
            lastName: person.last_name,
            fullName: person.name || `${person.first_name || ''} ${person.last_name || ''}`.trim(),
            email: person.emails?.[0]?.email || person.email,
            emailVerified: person.emails?.[0]?.verified,
            phone: person.phones?.[0]?.number || person.phone,
            mobilePhone: person.phones?.find((p: any) => p.type === 'mobile')?.number,
            linkedinUrl: input.linkedinUrl,
            title: person.title || person.headline,
            location: person.location,
            photoUrl: person.photo_url || person.picture,
          },
          company: person.company
            ? {
                name: person.company.name,
                domain: person.company.domain,
                linkedinUrl: person.company.linkedin_url,
                industry: person.company.industry,
              }
            : undefined,
          provider: this.slug,
          creditsUsed: 12,
          responseTimeMs: 0,
          confidence: person.emails?.[0]?.verified ? 90 : 75,
          rawResponse: data,
        };
      } catch (error) {
        return this.createError((error as Error).message, 'REQUEST_FAILED');
      }
    });

    return { ...result, responseTimeMs: timeMs };
  }

  private async enrichByEmail(email: string): Promise<EnrichmentResult> {
    try {
      const response = await fetch(`${CONTACTOUT_API_BASE}/people/email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return this.createNotFound(0);
        }
        return this.createError(`API Error: ${response.status}`, 'API_ERROR');
      }

      const data = await response.json();
      const person = data.person || data;

      return {
        success: true,
        found: true,
        person: {
          firstName: person.first_name,
          lastName: person.last_name,
          fullName: person.name,
          email,
          phone: person.phones?.[0]?.number,
          linkedinUrl: person.linkedin_url,
          title: person.title,
          location: person.location,
        },
        provider: this.slug,
        creditsUsed: 12,
        responseTimeMs: 0,
        confidence: 80,
        rawResponse: data,
      };
    } catch (error) {
      return this.createError((error as Error).message, 'REQUEST_FAILED');
    }
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const start = Date.now();
    try {
      const response = await fetch(`${CONTACTOUT_API_BASE}/account`, {
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
        message: 'Connected to ContactOut',
        responseTimeMs: timeMs,
        creditsRemaining: data.credits || data.credits_remaining || 0,
        planType: data.plan || data.subscription,
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
      const response = await fetch(`${CONTACTOUT_API_BASE}/account`, {
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
        planName: data.plan || data.subscription,
      };
    } catch {
      return { available: 0, used: 0, total: 0 };
    }
  }
}
