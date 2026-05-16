/**
 * Integrations Service
 *
 * Client-side service for managing integrations.
 * Works in development without backend API.
 */

import { PROVIDER_CONFIGS } from './providers/types';

// ==========================================
// Types
// ==========================================

export interface Provider {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  description?: string;
  capabilities: {
    email: boolean;
    phone: boolean;
    company: boolean;
    linkedin: boolean;
    verify: boolean;
    bulk: boolean;
  };
  website?: string;
  status: string;
  hasCredentials: boolean;
  lastTestAt?: string;
  lastTestStatus?: string;
  totalCreditsUsed: number;
  monthlyCreditsUsed: number;
}

export interface Waterfall {
  id: string;
  name: string;
  slug: string;
  enrichmentType: string;
  description?: string;
  stopOnFirstMatch: boolean;
  maxProviders: number;
  isActive: boolean;
  steps: WaterfallStep[];
}

export interface WaterfallStep {
  id: string;
  providerId: string;
  provider: {
    id: string;
    slug: string;
    name: string;
    logoUrl?: string;
    status: string;
  };
  priority: number;
  isEnabled: boolean;
}

// ==========================================
// Local Storage Keys
// ==========================================

const STORAGE_KEYS = {
  PROVIDERS: 'integrations_providers',
  WATERFALLS: 'integrations_waterfalls',
  CREDENTIALS: 'integrations_credentials',
};

// ==========================================
// Provider Functions
// ==========================================

export const getAvailableProviders = (): Provider[] => {
  return Object.values(PROVIDER_CONFIGS).map((config) => {
    // Check if provider is configured in localStorage
    const stored = getStoredProviders();
    const storedProvider = stored.find((p) => p.slug === config.slug);

    return {
      id: storedProvider?.id || `provider-${config.slug}`,
      slug: config.slug,
      name: config.name,
      logoUrl: config.logoUrl,
      description: config.description,
      capabilities: config.capabilities,
      website: config.website,
      status: storedProvider?.status || 'inactive',
      hasCredentials: storedProvider?.hasCredentials || false,
      lastTestAt: storedProvider?.lastTestAt,
      lastTestStatus: storedProvider?.lastTestStatus,
      totalCreditsUsed: storedProvider?.totalCreditsUsed || 0,
      monthlyCreditsUsed: storedProvider?.monthlyCreditsUsed || 0,
    };
  });
};

export const getStoredProviders = (): Provider[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROVIDERS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveProvider = (provider: Partial<Provider> & { slug: string }): Provider => {
  const providers = getStoredProviders();
  const existingIndex = providers.findIndex((p) => p.slug === provider.slug);

  const config = PROVIDER_CONFIGS[provider.slug];
  const newProvider: Provider = {
    id: provider.id || `provider-${provider.slug}-${Date.now()}`,
    slug: provider.slug,
    name: config?.name || provider.slug,
    logoUrl: config?.logoUrl,
    description: config?.description,
    capabilities: config?.capabilities || {
      email: false,
      phone: false,
      company: false,
      linkedin: false,
      verify: false,
      bulk: false,
    },
    website: config?.website,
    status: provider.status || 'active',
    hasCredentials: provider.hasCredentials ?? true,
    lastTestAt: provider.lastTestAt,
    lastTestStatus: provider.lastTestStatus,
    totalCreditsUsed: provider.totalCreditsUsed || 0,
    monthlyCreditsUsed: provider.monthlyCreditsUsed || 0,
  };

  if (existingIndex >= 0) {
    providers[existingIndex] = { ...providers[existingIndex], ...newProvider };
  } else {
    providers.push(newProvider);
  }

  localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
  return newProvider;
};

export const disconnectProvider = (slug: string): void => {
  const providers = getStoredProviders();
  const index = providers.findIndex((p) => p.slug === slug);

  if (index >= 0) {
    providers[index] = {
      ...providers[index],
      status: 'inactive',
      hasCredentials: false,
    };
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
    // Also remove credentials
    removeProviderCredentials(slug);
  }
};

export const testProviderConnection = async (
  slug: string,
  apiKey: string
): Promise<{ success: boolean; message: string; creditsRemaining?: number }> => {
  // Simulate API test - in production this would call the actual API
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Basic validation
  if (!apiKey || apiKey.length < 10) {
    return {
      success: false,
      message: 'مفتاح API غير صالح - يجب أن يكون أطول من 10 أحرف',
    };
  }

  // Store the API key for later use
  saveProviderCredentials(slug, apiKey);

  // Simulate success for demo
  return {
    success: true,
    message: `تم الاتصال بـ ${PROVIDER_CONFIGS[slug]?.name || slug} بنجاح`,
    creditsRemaining: Math.floor(Math.random() * 10000) + 1000,
  };
};

// ==========================================
// Credentials Functions
// ==========================================

export const saveProviderCredentials = (slug: string, apiKey: string): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
    const credentials: Record<string, string> = stored ? JSON.parse(stored) : {};
    credentials[slug] = apiKey;
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
  } catch (error) {
    console.error('Failed to save credentials:', error);
  }
};

export const getProviderCredentials = (slug: string): string | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
    if (!stored) return null;
    const credentials: Record<string, string> = JSON.parse(stored);
    return credentials[slug] || null;
  } catch {
    return null;
  }
};

export const removeProviderCredentials = (slug: string): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
    if (!stored) return;
    const credentials: Record<string, string> = JSON.parse(stored);
    delete credentials[slug];
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
  } catch {
    // Ignore
  }
};

// ==========================================
// Waterfall Functions
// ==========================================

export const getWaterfalls = (): Waterfall[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WATERFALLS);
    return stored ? JSON.parse(stored) : getDefaultWaterfalls();
  } catch {
    return getDefaultWaterfalls();
  }
};

export const getDefaultWaterfalls = (): Waterfall[] => {
  const providers = getAvailableProviders();
  const activeProviders = providers.filter((p) => p.status === 'active');

  // Create default waterfalls if none exist
  return [
    {
      id: 'waterfall-email-default',
      name: 'تسلسل البريد الافتراضي',
      slug: 'email_default',
      enrichmentType: 'email',
      description: 'تسلسل البحث عن البريد الإلكتروني',
      stopOnFirstMatch: true,
      maxProviders: 3,
      isActive: true,
      steps: activeProviders
        .filter((p) => p.capabilities.email)
        .slice(0, 5)
        .map((p, i) => ({
          id: `step-email-${p.slug}`,
          providerId: p.id,
          provider: {
            id: p.id,
            slug: p.slug,
            name: p.name,
            logoUrl: p.logoUrl,
            status: p.status,
          },
          priority: i,
          isEnabled: true,
        })),
    },
    {
      id: 'waterfall-phone-default',
      name: 'تسلسل الهاتف الافتراضي',
      slug: 'phone_default',
      enrichmentType: 'phone',
      description: 'تسلسل البحث عن رقم الهاتف',
      stopOnFirstMatch: true,
      maxProviders: 3,
      isActive: true,
      steps: activeProviders
        .filter((p) => p.capabilities.phone)
        .slice(0, 5)
        .map((p, i) => ({
          id: `step-phone-${p.slug}`,
          providerId: p.id,
          provider: {
            id: p.id,
            slug: p.slug,
            name: p.name,
            logoUrl: p.logoUrl,
            status: p.status,
          },
          priority: i,
          isEnabled: true,
        })),
    },
  ];
};

export const saveWaterfall = (waterfall: Waterfall): Waterfall => {
  const waterfalls = getWaterfalls();
  const existingIndex = waterfalls.findIndex((w) => w.id === waterfall.id);

  if (existingIndex >= 0) {
    waterfalls[existingIndex] = waterfall;
  } else {
    waterfalls.push(waterfall);
  }

  localStorage.setItem(STORAGE_KEYS.WATERFALLS, JSON.stringify(waterfalls));
  return waterfall;
};

export const deleteWaterfall = (id: string): void => {
  const waterfalls = getWaterfalls().filter((w) => w.id !== id);
  localStorage.setItem(STORAGE_KEYS.WATERFALLS, JSON.stringify(waterfalls));
};

export const createWaterfall = (data: {
  name: string;
  slug: string;
  enrichmentType: string;
  description?: string;
}): Waterfall => {
  const newWaterfall: Waterfall = {
    id: `waterfall-${data.slug}-${Date.now()}`,
    name: data.name,
    slug: data.slug,
    enrichmentType: data.enrichmentType,
    description: data.description,
    stopOnFirstMatch: true,
    maxProviders: 3,
    isActive: true,
    steps: [],
  };

  return saveWaterfall(newWaterfall);
};

// ==========================================
// Usage Stats (Mock)
// ==========================================

export const getUsageStats = (period: 'day' | 'week' | 'month' = 'week') => {
  const providers = getStoredProviders().filter((p) => p.status === 'active');

  const byProvider = providers.map((p) => ({
    slug: p.slug,
    name: p.name,
    totalRequests: Math.floor(Math.random() * 500) + 50,
    successCount: Math.floor(Math.random() * 400) + 40,
    notFoundCount: Math.floor(Math.random() * 50) + 5,
    errorCount: Math.floor(Math.random() * 10),
    totalCredits: p.totalCreditsUsed || Math.floor(Math.random() * 1000),
    avgResponseTime: Math.floor(Math.random() * 500) + 100,
    successRate: 70 + Math.floor(Math.random() * 25),
  }));

  const overall = {
    totalRequests: byProvider.reduce((sum, p) => sum + p.totalRequests, 0),
    totalSuccess: byProvider.reduce((sum, p) => sum + p.successCount, 0),
    totalCredits: byProvider.reduce((sum, p) => sum + p.totalCredits, 0),
    activeProviders: providers.length,
  };

  return {
    period,
    from: new Date(Date.now() - (period === 'day' ? 1 : period === 'week' ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString(),
    to: new Date().toISOString(),
    overall,
    byProvider,
  };
};

export const getRecentLogs = () => {
  const providers = getStoredProviders().filter((p) => p.status === 'active');

  if (providers.length === 0) return [];

  const statuses = ['success', 'not_found', 'error'];
  const requestTypes = ['email_enrich', 'phone_enrich', 'company_enrich'];

  return Array.from({ length: 10 }, (_, i) => {
    const provider = providers[Math.floor(Math.random() * providers.length)];
    return {
      id: `log-${Date.now()}-${i}`,
      requestType: requestTypes[Math.floor(Math.random() * requestTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      creditsUsed: Math.floor(Math.random() * 5) + 1,
      responseTimeMs: Math.floor(Math.random() * 500) + 100,
      resultFound: Math.random() > 0.3,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString(),
      provider: {
        slug: provider.slug,
        name: provider.name,
      },
    };
  });
};
