/**
 * Integration Providers API
 *
 * Endpoints for managing enrichment providers.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import { createAdapter, getProviderConfig, getAllProviderConfigs } from '../../services/providers/providerFactory';
import { prepareForStorage, retrieveFromStorage, maskApiKey, hasValidCredentials } from '../../services/encryption/credentialService';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error: any) {
    console.error('Providers API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

// GET /api/integrations/providers - List all providers
// GET /api/integrations/providers?id=xxx - Get single provider
// GET /api/integrations/providers?action=available - Get available provider types
async function handleGet(req: VercelRequest, res: VercelResponse) {
  const { id, action } = req.query;

  // Get available provider configurations
  if (action === 'available') {
    const configs = getAllProviderConfigs();
    return res.status(200).json({ providers: configs });
  }

  // Get single provider
  if (id) {
    const provider = await prisma.integrationProvider.findUnique({
      where: { id: String(id) },
      include: {
        waterfallSteps: {
          include: { waterfall: true },
        },
        _count: {
          select: { usageLogs: true },
        },
      },
    });

    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    // Mask sensitive data
    return res.status(200).json({
      ...provider,
      encryptedApiKey: provider.encryptedApiKey ? '***configured***' : null,
      encryptedApiKeyIv: undefined,
      hasCredentials: hasValidCredentials(provider.encryptedApiKey, provider.encryptedApiKeyIv),
    });
  }

  // List all providers
  const providers = await prisma.integrationProvider.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { usageLogs: true, waterfallSteps: true },
      },
    },
  });

  return res.status(200).json({
    providers: providers.map((p) => ({
      ...p,
      encryptedApiKey: undefined,
      encryptedApiKeyIv: undefined,
      hasCredentials: hasValidCredentials(p.encryptedApiKey, p.encryptedApiKeyIv),
    })),
  });
}

// POST /api/integrations/providers - Create or update provider
// POST /api/integrations/providers?action=test - Test connection
async function handlePost(req: VercelRequest, res: VercelResponse) {
  const { action } = req.query;
  const { slug, apiKey, id } = req.body;

  // Test connection
  if (action === 'test') {
    if (!slug || !apiKey) {
      return res.status(400).json({ error: 'slug and apiKey are required' });
    }

    try {
      const adapter = createAdapter(slug, apiKey);
      const result = await adapter.testConnection();

      // If testing an existing provider, update status
      if (id) {
        await prisma.integrationProvider.update({
          where: { id },
          data: {
            lastTestAt: new Date(),
            lastTestStatus: result.success ? 'success' : 'failed',
            lastTestMessage: result.message,
          },
        });
      }

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
        error: error.message,
      });
    }
  }

  // Create or update provider
  if (!slug) {
    return res.status(400).json({ error: 'slug is required' });
  }

  const config = getProviderConfig(slug);
  if (!config) {
    return res.status(400).json({ error: `Unknown provider: ${slug}` });
  }

  // Prepare encrypted credentials if API key provided
  let credentialData = {};
  if (apiKey) {
    const encrypted = prepareForStorage(apiKey);
    credentialData = {
      encryptedApiKey: encrypted.encryptedApiKey,
      encryptedApiKeyIv: encrypted.encryptedApiKeyIv,
    };
  }

  // Check if provider already exists
  const existing = await prisma.integrationProvider.findUnique({
    where: { slug },
  });

  let provider;
  if (existing) {
    // Update existing
    provider = await prisma.integrationProvider.update({
      where: { slug },
      data: {
        ...credentialData,
        status: apiKey ? 'active' : existing.status,
        updatedAt: new Date(),
      },
    });
  } else {
    // Create new
    provider = await prisma.integrationProvider.create({
      data: {
        slug: config.slug,
        name: config.name,
        logoUrl: config.logoUrl,
        capabilities: config.capabilities,
        ...credentialData,
        status: apiKey ? 'active' : 'inactive',
      },
    });
  }

  return res.status(200).json({
    ...provider,
    encryptedApiKey: undefined,
    encryptedApiKeyIv: undefined,
    hasCredentials: hasValidCredentials(provider.encryptedApiKey, provider.encryptedApiKeyIv),
  });
}

// PUT /api/integrations/providers - Update provider settings
async function handlePut(req: VercelRequest, res: VercelResponse) {
  const { id, status, apiKey, configSchema } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  const updateData: any = { updatedAt: new Date() };

  if (status !== undefined) {
    updateData.status = status;
  }

  if (apiKey) {
    const encrypted = prepareForStorage(apiKey);
    updateData.encryptedApiKey = encrypted.encryptedApiKey;
    updateData.encryptedApiKeyIv = encrypted.encryptedApiKeyIv;
  }

  if (configSchema !== undefined) {
    updateData.configSchema = configSchema;
  }

  const provider = await prisma.integrationProvider.update({
    where: { id },
    data: updateData,
  });

  return res.status(200).json({
    ...provider,
    encryptedApiKey: undefined,
    encryptedApiKeyIv: undefined,
    hasCredentials: hasValidCredentials(provider.encryptedApiKey, provider.encryptedApiKeyIv),
  });
}

// DELETE /api/integrations/providers?id=xxx - Remove provider credentials
async function handleDelete(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  // Just remove credentials, don't delete the provider record
  await prisma.integrationProvider.update({
    where: { id: String(id) },
    data: {
      encryptedApiKey: null,
      encryptedApiKeyIv: null,
      status: 'inactive',
      updatedAt: new Date(),
    },
  });

  return res.status(200).json({ success: true });
}
