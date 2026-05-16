/**
 * Admin API: Providers Management
 *
 * Endpoints for managing integration providers (admin-only).
 * All endpoints are protected by requireAdmin middleware.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin, type AdminApiRequest } from '@/middleware/adminAuth';
import { encryptCredentials, decryptCredentials } from '@/services/encryption/credentialEncryption';

// Types
interface Provider {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  capabilities: {
    email: boolean;
    phone: boolean;
    company: boolean;
    linkedin: boolean;
    verify: boolean;
    bulk: boolean;
  };
  status: 'active' | 'inactive' | 'error';
  hasCredentials: boolean;
  lastTestAt?: string;
  lastTestStatus?: 'success' | 'failed' | 'rate_limited';
  lastTestMessage?: string;
  totalCreditsUsed: number;
  monthlyCreditsUsed: number;
  monthlyResetAt?: string;
}

interface ProviderUpdateRequest {
  apiKey?: string;
  status?: 'active' | 'inactive';
  config?: Record<string, any>;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * GET /api/admin/integrations/providers
 * List all providers with their status
 */
async function listProviders(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse<Provider[]>>
) {
  try {
    // In production: fetch from database using Prisma
    // const providers = await prisma.integrationProvider.findMany({
    //   select: {
    //     id: true,
    //     slug: true,
    //     name: true,
    //     logoUrl: true,
    //     capabilities: true,
    //     status: true,
    //     lastTestAt: true,
    //     lastTestStatus: true,
    //     totalCreditsUsed: true,
    //     monthlyCreditsUsed: true,
    //   },
    // });

    // Mock data for development
    const providers: Provider[] = [
      {
        id: 'prov-1',
        slug: 'apollo',
        name: 'Apollo',
        logoUrl: 'https://logo.clearbit.com/apollo.io',
        capabilities: { email: true, phone: true, company: true, linkedin: true, verify: true, bulk: true },
        status: 'active',
        hasCredentials: true,
        lastTestAt: new Date().toISOString(),
        lastTestStatus: 'success',
        totalCreditsUsed: 5420,
        monthlyCreditsUsed: 1230,
      },
      {
        id: 'prov-2',
        slug: 'prospeo',
        name: 'Prospeo',
        logoUrl: 'https://logo.clearbit.com/prospeo.io',
        capabilities: { email: true, phone: true, company: false, linkedin: true, verify: true, bulk: false },
        status: 'active',
        hasCredentials: true,
        lastTestAt: new Date().toISOString(),
        lastTestStatus: 'success',
        totalCreditsUsed: 2150,
        monthlyCreditsUsed: 450,
      },
      {
        id: 'prov-3',
        slug: 'lemlist',
        name: 'Lemlist',
        capabilities: { email: true, phone: false, company: false, linkedin: true, verify: false, bulk: false },
        status: 'inactive',
        hasCredentials: false,
        totalCreditsUsed: 0,
        monthlyCreditsUsed: 0,
      },
    ];

    return res.status(200).json({
      success: true,
      data: providers,
    });
  } catch (error) {
    console.error('Error listing providers:', error);
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to list providers',
    });
  }
}

/**
 * GET /api/admin/integrations/providers/[slug]
 * Get single provider details
 */
async function getProvider(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse<Provider>>,
  slug: string
) {
  try {
    // In production: fetch from database
    // const provider = await prisma.integrationProvider.findUnique({
    //   where: { slug },
    // });

    // Mock response
    const provider: Provider = {
      id: 'prov-1',
      slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      capabilities: { email: true, phone: true, company: true, linkedin: true, verify: true, bulk: true },
      status: 'active',
      hasCredentials: true,
      totalCreditsUsed: 5420,
      monthlyCreditsUsed: 1230,
    };

    return res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to get provider',
    });
  }
}

/**
 * PUT /api/admin/integrations/providers/[slug]
 * Update provider configuration (including API key)
 */
async function updateProvider(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse>,
  slug: string
) {
  try {
    const body = req.body as ProviderUpdateRequest;

    // Validate request
    if (!body.apiKey && !body.status && !body.config) {
      return res.status(400).json({
        success: false,
        error: 'bad_request',
        message: 'No update data provided',
      });
    }

    // In production: update in database with encryption
    // if (body.apiKey) {
    //   const { encrypted, iv } = encryptCredentials(body.apiKey);
    //   await prisma.integrationProvider.update({
    //     where: { slug },
    //     data: {
    //       encryptedApiKey: encrypted,
    //       encryptedApiKeyIv: iv,
    //       status: 'active',
    //       updatedAt: new Date(),
    //     },
    //   });
    // }

    // Log admin action
    console.log(`[Admin] Provider ${slug} updated by ${req.adminUser?.email}`);

    return res.status(200).json({
      success: true,
      message: `Provider ${slug} updated successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to update provider',
    });
  }
}

/**
 * POST /api/admin/integrations/providers/[slug]/test
 * Test provider connection
 */
async function testProvider(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse<{ creditsRemaining?: number }>>,
  slug: string
) {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'bad_request',
        message: 'API key is required',
      });
    }

    // In production: actually test the provider API
    // const result = await testProviderConnection(slug, apiKey);

    // Mock successful test
    return res.status(200).json({
      success: true,
      message: `Connection to ${slug} successful`,
      data: {
        creditsRemaining: Math.floor(Math.random() * 10000) + 1000,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'connection_failed',
      message: 'Failed to connect to provider',
    });
  }
}

/**
 * DELETE /api/admin/integrations/providers/[slug]
 * Disconnect provider (remove credentials)
 */
async function disconnectProvider(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse>,
  slug: string
) {
  try {
    // In production: remove credentials from database
    // await prisma.integrationProvider.update({
    //   where: { slug },
    //   data: {
    //     encryptedApiKey: null,
    //     encryptedApiKeyIv: null,
    //     status: 'inactive',
    //   },
    // });

    console.log(`[Admin] Provider ${slug} disconnected by ${req.adminUser?.email}`);

    return res.status(200).json({
      success: true,
      message: `Provider ${slug} disconnected`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to disconnect provider',
    });
  }
}

/**
 * Main handler - routes to specific method
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminReq = req as AdminApiRequest;
  const { slug } = req.query;

  switch (req.method) {
    case 'GET':
      if (slug && typeof slug === 'string') {
        return getProvider(adminReq, res, slug);
      }
      return listProviders(adminReq, res);

    case 'PUT':
      if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ success: false, error: 'Provider slug required' });
      }
      return updateProvider(adminReq, res, slug);

    case 'POST':
      // Handle test endpoint
      if (req.url?.includes('/test')) {
        const providerSlug = slug || req.body?.slug;
        if (!providerSlug) {
          return res.status(400).json({ success: false, error: 'Provider slug required' });
        }
        return testProvider(adminReq, res, providerSlug as string);
      }
      return res.status(405).json({ success: false, error: 'Method not allowed' });

    case 'DELETE':
      if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ success: false, error: 'Provider slug required' });
      }
      return disconnectProvider(adminReq, res, slug);

    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

// Export with admin protection
export default requireAdmin(handler);
