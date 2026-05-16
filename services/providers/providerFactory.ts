/**
 * Provider Factory
 *
 * Creates provider adapter instances based on slug.
 * Centralizes adapter instantiation and registration.
 */

import {
  IProviderAdapter,
  ProviderConfig,
  PROVIDER_CONFIGS,
  getAvailableProviderSlugs,
} from './types';

// Import adapters
import {
  ApolloAdapter,
  LemlistAdapter,
  ProspeoAdapter,
  IcypeasAdapter,
  FindymailAdapter,
  DropcontactAdapter,
  FullenrichAdapter,
  BettercontactAdapter,
  ContactoutAdapter,
  HunterAdapter,
  ClearbitAdapter,
} from './adapters';

// ==========================================
// Adapter Registry
// ==========================================

type AdapterConstructor = new (apiKey: string, config?: Record<string, any>) => IProviderAdapter;

const ADAPTER_REGISTRY: Record<string, AdapterConstructor> = {
  apollo: ApolloAdapter,
  lemlist: LemlistAdapter,
  prospeo: ProspeoAdapter,
  icypeas: IcypeasAdapter,
  findymail: FindymailAdapter,
  dropcontact: DropcontactAdapter,
  fullenrich: FullenrichAdapter,
  bettercontact: BettercontactAdapter,
  contactout: ContactoutAdapter,
  hunter: HunterAdapter,
  clearbit: ClearbitAdapter,
};

// ==========================================
// Factory Functions
// ==========================================

/**
 * Create a provider adapter instance
 *
 * @param slug - Provider identifier (e.g., "apollo", "prospeo")
 * @param apiKey - Decrypted API key for the provider
 * @param config - Optional provider-specific configuration
 * @returns Initialized adapter instance
 * @throws Error if provider not found
 */
export const createAdapter = (
  slug: string,
  apiKey: string,
  config?: Record<string, any>
): IProviderAdapter => {
  const AdapterClass = ADAPTER_REGISTRY[slug];

  if (!AdapterClass) {
    throw new Error(`Unknown provider: ${slug}. Available: ${getAvailableProviders().join(', ')}`);
  }

  if (!apiKey) {
    throw new Error(`API key required for provider: ${slug}`);
  }

  return new AdapterClass(apiKey, config);
};

/**
 * Check if a provider adapter exists
 */
export const hasAdapter = (slug: string): boolean => {
  return slug in ADAPTER_REGISTRY;
};

/**
 * Get list of registered provider slugs
 */
export const getAvailableProviders = (): string[] => {
  return Object.keys(ADAPTER_REGISTRY);
};

/**
 * Get provider configuration by slug
 */
export const getProviderConfig = (slug: string): ProviderConfig | undefined => {
  return PROVIDER_CONFIGS[slug];
};

/**
 * Get all provider configurations
 */
export const getAllProviderConfigs = (): ProviderConfig[] => {
  return Object.values(PROVIDER_CONFIGS);
};

/**
 * Get providers filtered by capability
 */
export const getProvidersByCapability = (
  capability: 'email' | 'phone' | 'company' | 'linkedin' | 'verify' | 'bulk'
): ProviderConfig[] => {
  return Object.values(PROVIDER_CONFIGS).filter(
    (config) => config.capabilities[capability]
  );
};

/**
 * Validate that all registered adapters have corresponding configs
 */
export const validateProviderRegistry = (): {
  valid: boolean;
  missingConfigs: string[];
  missingAdapters: string[];
} => {
  const adapterSlugs = new Set(Object.keys(ADAPTER_REGISTRY));
  const configSlugs = new Set(Object.keys(PROVIDER_CONFIGS));

  const missingConfigs = [...adapterSlugs].filter((s) => !configSlugs.has(s));
  const missingAdapters = [...configSlugs].filter((s) => !adapterSlugs.has(s));

  return {
    valid: missingConfigs.length === 0 && missingAdapters.length === 0,
    missingConfigs,
    missingAdapters,
  };
};
