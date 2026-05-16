/**
 * Waterfall Orchestrator Service
 *
 * Executes enrichment across multiple providers in priority order.
 * Stops when data is found or max providers reached.
 */

import { PrismaClient } from '@prisma/client';
import { createAdapter } from './providerFactory';
import { retrieveFromStorage } from '../encryption/credentialService';
import {
  IProviderAdapter,
  EnrichmentInput,
  EnrichmentResult,
  UsageLogEntry,
  hashEnrichmentInput,
} from './types';

const prisma = new PrismaClient();

// ==========================================
// Types
// ==========================================

export interface WaterfallConfig {
  waterfallId?: string;
  waterfallSlug?: string;
  enrichmentType: 'email' | 'phone' | 'company' | 'linkedin';
  stopOnFirstMatch?: boolean;
  maxProviders?: number;
}

export interface WaterfallResult {
  success: boolean;
  found: boolean;
  result?: EnrichmentResult;
  providersTried: string[];
  providersSucceeded: string[];
  providersFailed: string[];
  totalCreditsUsed: number;
  totalTimeMs: number;
  logs: WaterfallLogEntry[];
}

export interface WaterfallLogEntry {
  provider: string;
  status: 'success' | 'not_found' | 'error' | 'skipped';
  found: boolean;
  creditsUsed: number;
  responseTimeMs: number;
  error?: string;
}

// ==========================================
// Main Orchestrator
// ==========================================

/**
 * Run waterfall enrichment
 *
 * Executes enrichment across providers in priority order until data is found.
 *
 * @param input - The enrichment input data (name, email, company, etc.)
 * @param config - Waterfall configuration
 * @returns Combined enrichment result
 */
export async function runWaterfall(
  input: EnrichmentInput,
  config: WaterfallConfig
): Promise<WaterfallResult> {
  const startTime = Date.now();
  const logs: WaterfallLogEntry[] = [];
  const providersTried: string[] = [];
  const providersSucceeded: string[] = [];
  const providersFailed: string[] = [];
  let totalCreditsUsed = 0;
  let finalResult: EnrichmentResult | undefined;

  try {
    // Get waterfall configuration
    const waterfall = await getWaterfallConfig(config);

    if (!waterfall) {
      return {
        success: false,
        found: false,
        providersTried: [],
        providersSucceeded: [],
        providersFailed: [],
        totalCreditsUsed: 0,
        totalTimeMs: Date.now() - startTime,
        logs: [],
      };
    }

    const { steps, stopOnFirstMatch, maxProviders } = waterfall;
    const inputHash = hashEnrichmentInput(input);

    // Execute each step in priority order
    for (let i = 0; i < steps.length && i < maxProviders; i++) {
      const step = steps[i];

      if (!step.isEnabled) {
        logs.push({
          provider: step.providerSlug,
          status: 'skipped',
          found: false,
          creditsUsed: 0,
          responseTimeMs: 0,
        });
        continue;
      }

      providersTried.push(step.providerSlug);

      try {
        // Get provider adapter
        const adapter = await getProviderAdapter(step.providerId);

        if (!adapter) {
          logs.push({
            provider: step.providerSlug,
            status: 'error',
            found: false,
            creditsUsed: 0,
            responseTimeMs: 0,
            error: 'Provider not configured or missing API key',
          });
          providersFailed.push(step.providerSlug);
          continue;
        }

        // Execute enrichment based on type
        const result = await executeEnrichment(adapter, input, config.enrichmentType);

        // Log the result
        await logProviderUsage({
          providerId: step.providerId,
          requestType: `${config.enrichmentType}_enrich`,
          status: result.found ? 'success' : 'not_found',
          creditsUsed: result.creditsUsed,
          responseTimeMs: result.responseTimeMs,
          resultFound: result.found,
          inputHash,
          waterfallId: waterfall.id,
        });

        logs.push({
          provider: step.providerSlug,
          status: result.found ? 'success' : 'not_found',
          found: result.found,
          creditsUsed: result.creditsUsed,
          responseTimeMs: result.responseTimeMs,
        });

        totalCreditsUsed += result.creditsUsed;

        if (result.found) {
          providersSucceeded.push(step.providerSlug);
          finalResult = mergeResults(finalResult, result);

          if (stopOnFirstMatch && hasRequiredData(finalResult, config.enrichmentType)) {
            break;
          }
        }
      } catch (error) {
        const errorMessage = (error as Error).message;

        logs.push({
          provider: step.providerSlug,
          status: 'error',
          found: false,
          creditsUsed: 0,
          responseTimeMs: 0,
          error: errorMessage,
        });

        providersFailed.push(step.providerSlug);

        // Log the error
        await logProviderUsage({
          providerId: step.providerId,
          requestType: `${config.enrichmentType}_enrich`,
          status: 'error',
          creditsUsed: 0,
          responseTimeMs: 0,
          resultFound: false,
          errorMessage,
          inputHash,
          waterfallId: waterfall.id,
        });
      }
    }

    return {
      success: true,
      found: !!finalResult?.found,
      result: finalResult,
      providersTried,
      providersSucceeded,
      providersFailed,
      totalCreditsUsed,
      totalTimeMs: Date.now() - startTime,
      logs,
    };
  } catch (error) {
    return {
      success: false,
      found: false,
      providersTried,
      providersSucceeded,
      providersFailed,
      totalCreditsUsed,
      totalTimeMs: Date.now() - startTime,
      logs,
    };
  }
}

/**
 * Run batch waterfall enrichment
 *
 * Enriches multiple inputs with rate limiting.
 */
export async function runBatchWaterfall(
  inputs: EnrichmentInput[],
  config: WaterfallConfig,
  options: {
    delayMs?: number;
    onProgress?: (current: number, total: number, result: WaterfallResult) => void;
  } = {}
): Promise<{
  results: WaterfallResult[];
  summary: {
    total: number;
    found: number;
    notFound: number;
    errors: number;
    totalCreditsUsed: number;
    totalTimeMs: number;
  };
}> {
  const startTime = Date.now();
  const results: WaterfallResult[] = [];
  let found = 0;
  let notFound = 0;
  let errors = 0;
  let totalCreditsUsed = 0;

  for (let i = 0; i < inputs.length; i++) {
    const result = await runWaterfall(inputs[i], config);
    results.push(result);

    if (result.found) found++;
    else if (result.success) notFound++;
    else errors++;

    totalCreditsUsed += result.totalCreditsUsed;

    if (options.onProgress) {
      options.onProgress(i + 1, inputs.length, result);
    }

    // Rate limiting delay
    if (i < inputs.length - 1 && options.delayMs) {
      await delay(options.delayMs);
    }
  }

  return {
    results,
    summary: {
      total: inputs.length,
      found,
      notFound,
      errors,
      totalCreditsUsed,
      totalTimeMs: Date.now() - startTime,
    },
  };
}

// ==========================================
// Helper Functions
// ==========================================

interface WaterfallStepConfig {
  providerId: string;
  providerSlug: string;
  priority: number;
  isEnabled: boolean;
  config?: Record<string, any>;
}

interface WaterfallConfigResult {
  id: string;
  steps: WaterfallStepConfig[];
  stopOnFirstMatch: boolean;
  maxProviders: number;
}

async function getWaterfallConfig(config: WaterfallConfig): Promise<WaterfallConfigResult | null> {
  try {
    let waterfall;

    if (config.waterfallId) {
      waterfall = await prisma.enrichmentWaterfall.findUnique({
        where: { id: config.waterfallId },
        include: {
          steps: {
            where: { isEnabled: true },
            orderBy: { priority: 'asc' },
            include: { provider: true },
          },
        },
      });
    } else if (config.waterfallSlug) {
      waterfall = await prisma.enrichmentWaterfall.findUnique({
        where: { slug: config.waterfallSlug },
        include: {
          steps: {
            where: { isEnabled: true },
            orderBy: { priority: 'asc' },
            include: { provider: true },
          },
        },
      });
    } else {
      // Find default waterfall for enrichment type
      waterfall = await prisma.enrichmentWaterfall.findFirst({
        where: {
          enrichmentType: config.enrichmentType,
          isActive: true,
        },
        include: {
          steps: {
            where: { isEnabled: true },
            orderBy: { priority: 'asc' },
            include: { provider: true },
          },
        },
      });
    }

    if (!waterfall) {
      return null;
    }

    return {
      id: waterfall.id,
      steps: waterfall.steps.map((step) => ({
        providerId: step.providerId,
        providerSlug: step.provider.slug,
        priority: step.priority,
        isEnabled: step.isEnabled,
        config: step.config as Record<string, any> | undefined,
      })),
      stopOnFirstMatch: config.stopOnFirstMatch ?? waterfall.stopOnFirstMatch,
      maxProviders: config.maxProviders ?? waterfall.maxProviders,
    };
  } catch (error) {
    console.error('Failed to get waterfall config:', error);
    return null;
  }
}

async function getProviderAdapter(providerId: string): Promise<IProviderAdapter | null> {
  try {
    const provider = await prisma.integrationProvider.findUnique({
      where: { id: providerId },
    });

    if (!provider || provider.status !== 'active') {
      return null;
    }

    if (!provider.encryptedApiKey || !provider.encryptedApiKeyIv) {
      return null;
    }

    // Decrypt the API key
    const apiKey = retrieveFromStorage(provider.encryptedApiKey, provider.encryptedApiKeyIv);

    // Create adapter instance
    return createAdapter(provider.slug, apiKey);
  } catch (error) {
    console.error('Failed to get provider adapter:', error);
    return null;
  }
}

async function executeEnrichment(
  adapter: IProviderAdapter,
  input: EnrichmentInput,
  enrichmentType: 'email' | 'phone' | 'company' | 'linkedin'
): Promise<EnrichmentResult> {
  switch (enrichmentType) {
    case 'email':
      return adapter.enrichEmail(input);
    case 'phone':
      return adapter.enrichPhone(input);
    case 'company':
      return adapter.enrichCompany?.(input) ?? adapter.enrichEmail(input);
    case 'linkedin':
      return adapter.enrichLinkedIn?.(input) ?? adapter.enrichEmail(input);
    default:
      return adapter.enrichEmail(input);
  }
}

function mergeResults(
  existing: EnrichmentResult | undefined,
  incoming: EnrichmentResult
): EnrichmentResult {
  if (!existing) {
    return incoming;
  }

  // Merge person data - prefer verified/existing data
  const mergedPerson = {
    ...existing.person,
    ...Object.fromEntries(
      Object.entries(incoming.person || {}).filter(([_, v]) => v !== undefined)
    ),
  };

  // Prefer verified email
  if (incoming.person?.emailVerified && !existing.person?.emailVerified) {
    mergedPerson.email = incoming.person.email;
    mergedPerson.emailVerified = true;
  }

  // Prefer verified phone
  if (incoming.person?.phoneVerified && !existing.person?.phoneVerified) {
    mergedPerson.phone = incoming.person.phone;
    mergedPerson.phoneVerified = true;
  }

  // Merge company data
  const mergedCompany = {
    ...existing.company,
    ...Object.fromEntries(
      Object.entries(incoming.company || {}).filter(([_, v]) => v !== undefined)
    ),
  };

  return {
    success: true,
    found: true,
    person: Object.keys(mergedPerson).length > 0 ? mergedPerson : undefined,
    company: Object.keys(mergedCompany).length > 0 ? mergedCompany : undefined,
    provider: `${existing.provider}+${incoming.provider}`,
    creditsUsed: existing.creditsUsed + incoming.creditsUsed,
    responseTimeMs: existing.responseTimeMs + incoming.responseTimeMs,
    confidence: Math.max(existing.confidence || 0, incoming.confidence || 0),
  };
}

function hasRequiredData(
  result: EnrichmentResult | undefined,
  enrichmentType: 'email' | 'phone' | 'company' | 'linkedin'
): boolean {
  if (!result?.found) return false;

  switch (enrichmentType) {
    case 'email':
      return !!result.person?.email;
    case 'phone':
      return !!result.person?.phone;
    case 'company':
      return !!result.company?.name || !!result.company?.domain;
    case 'linkedin':
      return !!result.person?.linkedinUrl;
    default:
      return true;
  }
}

async function logProviderUsage(entry: {
  providerId: string;
  requestType: string;
  status: string;
  creditsUsed: number;
  responseTimeMs: number;
  resultFound: boolean;
  errorMessage?: string;
  inputHash?: string;
  waterfallId?: string;
}): Promise<void> {
  try {
    await prisma.providerUsageLog.create({
      data: {
        providerId: entry.providerId,
        requestType: entry.requestType,
        status: entry.status,
        creditsUsed: entry.creditsUsed,
        responseTimeMs: entry.responseTimeMs,
        resultFound: entry.resultFound,
        errorMessage: entry.errorMessage,
        inputHash: entry.inputHash,
        waterfallId: entry.waterfallId,
      },
    });

    // Update provider's credit usage
    await prisma.integrationProvider.update({
      where: { id: entry.providerId },
      data: {
        totalCreditsUsed: { increment: entry.creditsUsed },
        monthlyCreditsUsed: { increment: entry.creditsUsed },
      },
    });
  } catch (error) {
    console.error('Failed to log provider usage:', error);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==========================================
// Quick Enrichment Functions
// ==========================================

/**
 * Quick email enrichment using default waterfall
 */
export async function enrichEmail(input: EnrichmentInput): Promise<WaterfallResult> {
  return runWaterfall(input, {
    enrichmentType: 'email',
    stopOnFirstMatch: true,
  });
}

/**
 * Quick phone enrichment using default waterfall
 */
export async function enrichPhone(input: EnrichmentInput): Promise<WaterfallResult> {
  return runWaterfall(input, {
    enrichmentType: 'phone',
    stopOnFirstMatch: true,
  });
}

/**
 * Quick company enrichment using default waterfall
 */
export async function enrichCompany(input: EnrichmentInput): Promise<WaterfallResult> {
  return runWaterfall(input, {
    enrichmentType: 'company',
    stopOnFirstMatch: true,
  });
}

/**
 * Full enrichment - tries all data types
 */
export async function enrichFull(input: EnrichmentInput): Promise<{
  email: WaterfallResult;
  phone: WaterfallResult;
  company: WaterfallResult;
}> {
  const [email, phone, company] = await Promise.all([
    enrichEmail(input),
    enrichPhone(input),
    enrichCompany(input),
  ]);

  return { email, phone, company };
}
