/**
 * Base Provider Adapter
 *
 * Abstract base class for all enrichment provider adapters.
 * Provides common functionality and enforces interface compliance.
 */

import {
  IProviderAdapter,
  ProviderCapabilities,
  EnrichmentInput,
  EnrichmentResult,
  ConnectionTestResult,
  ProviderCredits,
  createNotFoundResult,
  createErrorResult,
} from '../types';

export abstract class BaseAdapter implements IProviderAdapter {
  abstract slug: string;
  abstract name: string;
  abstract capabilities: ProviderCapabilities;

  protected apiKey: string;
  protected config: Record<string, any>;

  constructor(apiKey: string, config: Record<string, any> = {}) {
    this.apiKey = apiKey;
    this.config = config;
  }

  // Core methods - must be implemented by subclasses
  abstract enrichEmail(input: EnrichmentInput): Promise<EnrichmentResult>;
  abstract enrichPhone(input: EnrichmentInput): Promise<EnrichmentResult>;
  abstract testConnection(): Promise<ConnectionTestResult>;
  abstract getCredits(): Promise<ProviderCredits>;

  // Optional methods - can be overridden
  async enrichCompany(input: EnrichmentInput): Promise<EnrichmentResult> {
    return createNotFoundResult(this.slug, 0);
  }

  async enrichLinkedIn(input: EnrichmentInput): Promise<EnrichmentResult> {
    return createNotFoundResult(this.slug, 0);
  }

  async verifyEmail(email: string): Promise<EnrichmentResult> {
    return createNotFoundResult(this.slug, 0);
  }

  async verifyPhone(phone: string): Promise<EnrichmentResult> {
    return createNotFoundResult(this.slug, 0);
  }

  // Helper methods for subclasses
  protected createNotFound(responseTimeMs: number): EnrichmentResult {
    return createNotFoundResult(this.slug, responseTimeMs);
  }

  protected createError(error: string, errorCode?: string, responseTimeMs = 0): EnrichmentResult {
    return createErrorResult(this.slug, error, errorCode, responseTimeMs);
  }

  protected async measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; timeMs: number }> {
    const start = Date.now();
    const result = await fn();
    return { result, timeMs: Date.now() - start };
  }

  protected log(message: string, data?: any): void {
    console.log(`[${this.slug.toUpperCase()}] ${message}`, data || '');
  }

  protected logError(message: string, error?: any): void {
    console.error(`[${this.slug.toUpperCase()}] ${message}`, error || '');
  }
}
