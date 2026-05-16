/**
 * Provider Adapter Types
 *
 * Common interfaces for all enrichment provider integrations.
 * Each provider implements IProviderAdapter for consistent behavior.
 */

// ==========================================
// Provider Capabilities
// ==========================================

export interface ProviderCapabilities {
  email: boolean;      // Can enrich email addresses
  phone: boolean;      // Can enrich phone numbers
  company: boolean;    // Can enrich company data
  linkedin: boolean;   // Can enrich LinkedIn profiles
  verify: boolean;     // Can verify data (email/phone)
  bulk: boolean;       // Supports bulk operations
}

// ==========================================
// Enrichment Input/Output
// ==========================================

export interface EnrichmentInput {
  // Person identifiers
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;

  // Company identifiers
  companyName?: string;
  companyDomain?: string;
  companyLinkedinUrl?: string;

  // Additional context
  title?: string;
  location?: string;
  country?: string;
}

export interface EnrichmentResult {
  success: boolean;
  found: boolean;

  // Person data
  person?: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    emailVerified?: boolean;
    phone?: string;
    phoneVerified?: boolean;
    mobilePhone?: string;
    linkedinUrl?: string;
    title?: string;
    seniority?: string;
    department?: string;
    location?: string;
    photoUrl?: string;
  };

  // Company data
  company?: {
    name?: string;
    domain?: string;
    website?: string;
    linkedinUrl?: string;
    industry?: string;
    employeeCount?: number;
    employeeRange?: string;
    location?: string;
    description?: string;
    logoUrl?: string;
    foundedYear?: number;
    revenue?: string;
    techStack?: string[];
  };

  // Metadata
  provider: string;
  creditsUsed: number;
  responseTimeMs: number;
  confidence?: number; // 0-100
  rawResponse?: Record<string, any>;

  // Error info
  error?: string;
  errorCode?: string;
}

// ==========================================
// Connection Test
// ==========================================

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  responseTimeMs: number;

  // Provider info
  accountName?: string;
  creditsRemaining?: number;
  planType?: string;
  rateLimit?: {
    remaining: number;
    resetAt?: string;
  };

  error?: string;
  errorCode?: string;
}

// ==========================================
// Credits/Balance
// ==========================================

export interface ProviderCredits {
  available: number;
  used: number;
  total: number;
  planName?: string;
  resetDate?: string;
  unlimited?: boolean;
}

// ==========================================
// Provider Adapter Interface
// ==========================================

export interface IProviderAdapter {
  // Identity
  slug: string;
  name: string;
  capabilities: ProviderCapabilities;

  // Core enrichment methods
  enrichEmail(input: EnrichmentInput): Promise<EnrichmentResult>;
  enrichPhone(input: EnrichmentInput): Promise<EnrichmentResult>;
  enrichCompany?(input: EnrichmentInput): Promise<EnrichmentResult>;
  enrichLinkedIn?(input: EnrichmentInput): Promise<EnrichmentResult>;

  // Verification (optional)
  verifyEmail?(email: string): Promise<EnrichmentResult>;
  verifyPhone?(phone: string): Promise<EnrichmentResult>;

  // Admin functions
  testConnection(): Promise<ConnectionTestResult>;
  getCredits(): Promise<ProviderCredits>;
}

// ==========================================
// Provider Configuration
// ==========================================

export interface ProviderConfig {
  slug: string;
  name: string;
  logoUrl: string;
  description: string;
  capabilities: ProviderCapabilities;
  website: string;
  docsUrl?: string;

  // Cost info
  costPerEmail?: number;
  costPerPhone?: number;
  costPerCompany?: number;
  costPerLinkedIn?: number;

  // Rate limits
  rateLimit?: {
    requestsPerSecond?: number;
    requestsPerMinute?: number;
    requestsPerDay?: number;
  };

  // Config schema for additional settings
  configSchema?: Record<string, any>;
}

// ==========================================
// Usage Tracking
// ==========================================

export interface UsageLogEntry {
  providerId: string;
  requestType: 'email_enrich' | 'phone_enrich' | 'company_enrich' | 'linkedin_enrich' | 'test_connection';
  status: 'success' | 'not_found' | 'error' | 'rate_limited';
  creditsUsed: number;
  responseTimeMs: number;
  resultFound: boolean;
  errorMessage?: string;
  inputHash?: string;
  waterfallId?: string;
  entityType?: string;
  entityId?: string;
}

// ==========================================
// Provider Registry
// ==========================================

export const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  apollo: {
    slug: 'apollo',
    name: 'Apollo.io',
    logoUrl: '/images/providers/apollo.svg',
    description: 'B2B sales intelligence platform with extensive contact database',
    capabilities: { email: true, phone: true, company: true, linkedin: true, verify: false, bulk: true },
    website: 'https://apollo.io',
    docsUrl: 'https://apolloio.github.io/apollo-api-docs/',
    costPerEmail: 1,
    costPerPhone: 8,
    costPerCompany: 0,
    rateLimit: { requestsPerMinute: 100 },
  },
  lemlist: {
    slug: 'lemlist',
    name: 'Lemlist',
    logoUrl: '/images/providers/lemlist.svg',
    description: 'Email outreach platform with built-in email finder',
    capabilities: { email: true, phone: true, company: false, linkedin: true, verify: true, bulk: true },
    website: 'https://lemlist.com',
    costPerEmail: 1,
    costPerPhone: 5,
    rateLimit: { requestsPerMinute: 60 },
  },
  prospeo: {
    slug: 'prospeo',
    name: 'Prospeo',
    logoUrl: '/images/providers/prospeo.svg',
    description: 'Person enrichment with mobile phone specialization',
    capabilities: { email: true, phone: true, company: true, linkedin: true, verify: true, bulk: true },
    website: 'https://prospeo.io',
    docsUrl: 'https://prospeo.io/api',
    costPerEmail: 1,
    costPerPhone: 10,
    costPerCompany: 0,
    rateLimit: { requestsPerMinute: 60 },
  },
  icypeas: {
    slug: 'icypeas',
    name: 'Icypeas',
    logoUrl: '/images/providers/icypeas.svg',
    description: 'Email finder and verifier',
    capabilities: { email: true, phone: false, company: false, linkedin: false, verify: true, bulk: true },
    website: 'https://icypeas.com',
    costPerEmail: 1,
    rateLimit: { requestsPerMinute: 30 },
  },
  findymail: {
    slug: 'findymail',
    name: 'Findymail',
    logoUrl: '/images/providers/findymail.svg',
    description: 'Email finder with high deliverability focus',
    capabilities: { email: true, phone: false, company: false, linkedin: false, verify: true, bulk: true },
    website: 'https://findymail.com',
    costPerEmail: 2,
    rateLimit: { requestsPerMinute: 60 },
  },
  dropcontact: {
    slug: 'dropcontact',
    name: 'DropContact',
    logoUrl: '/images/providers/dropcontact.svg',
    description: 'GDPR-compliant email and phone enrichment',
    capabilities: { email: true, phone: true, company: true, linkedin: true, verify: true, bulk: true },
    website: 'https://dropcontact.com',
    costPerEmail: 2,
    costPerPhone: 5,
    rateLimit: { requestsPerMinute: 100 },
  },
  fullenrich: {
    slug: 'fullenrich',
    name: 'FullEnrich',
    logoUrl: '/images/providers/fullenrich.svg',
    description: 'Multi-source enrichment aggregator',
    capabilities: { email: true, phone: true, company: true, linkedin: true, verify: true, bulk: true },
    website: 'https://fullenrich.com',
    costPerEmail: 2,
    costPerPhone: 8,
    rateLimit: { requestsPerMinute: 50 },
  },
  bettercontact: {
    slug: 'bettercontact',
    name: 'BetterContact',
    logoUrl: '/images/providers/bettercontact.svg',
    description: 'Waterfall enrichment across multiple providers',
    capabilities: { email: true, phone: true, company: false, linkedin: false, verify: true, bulk: true },
    website: 'https://bettercontact.rocks',
    costPerEmail: 3,
    costPerPhone: 10,
    rateLimit: { requestsPerMinute: 30 },
  },
  contactout: {
    slug: 'contactout',
    name: 'ContactOut',
    logoUrl: '/images/providers/contactout.svg',
    description: 'LinkedIn email and phone finder',
    capabilities: { email: true, phone: true, company: false, linkedin: true, verify: false, bulk: true },
    website: 'https://contactout.com',
    costPerEmail: 12,
    costPerPhone: 12,
    rateLimit: { requestsPerMinute: 60 },
  },
  hunter: {
    slug: 'hunter',
    name: 'Hunter.io',
    logoUrl: '/images/providers/hunter.svg',
    description: 'Domain-based email finder and verifier',
    capabilities: { email: true, phone: false, company: true, linkedin: false, verify: true, bulk: true },
    website: 'https://hunter.io',
    docsUrl: 'https://hunter.io/api-documentation',
    costPerEmail: 1,
    rateLimit: { requestsPerSecond: 10 },
  },
  clearbit: {
    slug: 'clearbit',
    name: 'Clearbit',
    logoUrl: '/images/providers/clearbit.svg',
    description: 'Premium B2B data enrichment platform',
    capabilities: { email: true, phone: false, company: true, linkedin: true, verify: false, bulk: true },
    website: 'https://clearbit.com',
    docsUrl: 'https://clearbit.com/docs',
    costPerEmail: 5,
    costPerCompany: 5,
    rateLimit: { requestsPerMinute: 600 },
  },
};

// ==========================================
// Helper Functions
// ==========================================

/**
 * Get list of providers supporting a specific capability
 */
export const getProvidersByCap = (
  capability: keyof ProviderCapabilities
): ProviderConfig[] => {
  return Object.values(PROVIDER_CONFIGS).filter(
    (config) => config.capabilities[capability]
  );
};

/**
 * Get all available provider slugs
 */
export const getAvailableProviderSlugs = (): string[] => {
  return Object.keys(PROVIDER_CONFIGS);
};

/**
 * Create a minimal "not found" result
 */
export const createNotFoundResult = (
  provider: string,
  responseTimeMs: number
): EnrichmentResult => ({
  success: true,
  found: false,
  provider,
  creditsUsed: 0,
  responseTimeMs,
});

/**
 * Create an error result
 */
export const createErrorResult = (
  provider: string,
  error: string,
  errorCode?: string,
  responseTimeMs = 0
): EnrichmentResult => ({
  success: false,
  found: false,
  provider,
  creditsUsed: 0,
  responseTimeMs,
  error,
  errorCode,
});

/**
 * Calculate input hash for deduplication
 */
export const hashEnrichmentInput = (input: EnrichmentInput): string => {
  const key = [
    input.email?.toLowerCase(),
    input.linkedinUrl?.toLowerCase(),
    input.firstName?.toLowerCase(),
    input.lastName?.toLowerCase(),
    input.companyDomain?.toLowerCase(),
  ]
    .filter(Boolean)
    .join('|');

  // Simple hash for deduplication
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};
