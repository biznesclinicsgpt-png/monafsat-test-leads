/**
 * Provider Usage Analytics API
 *
 * Endpoints for viewing usage statistics and credits.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import { createAdapter } from '../../services/providers/providerFactory';
import { retrieveFromStorage } from '../../services/encryption/credentialService';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { action } = req.query;

  try {
    switch (action) {
      case 'credits':
        return await handleCredits(req, res);
      case 'logs':
        return await handleLogs(req, res);
      case 'stats':
        return await handleStats(req, res);
      default:
        return await handleOverview(req, res);
    }
  } catch (error: any) {
    console.error('Usage API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

// GET /api/integrations/usage?action=credits - Get live credits from all providers
async function handleCredits(req: VercelRequest, res: VercelResponse) {
  const providers = await prisma.integrationProvider.findMany({
    where: { status: 'active' },
  });

  const credits = await Promise.all(
    providers.map(async (provider) => {
      try {
        if (!provider.encryptedApiKey || !provider.encryptedApiKeyIv) {
          return {
            slug: provider.slug,
            name: provider.name,
            credits: null,
            error: 'No API key configured',
          };
        }

        const apiKey = retrieveFromStorage(provider.encryptedApiKey, provider.encryptedApiKeyIv);
        const adapter = createAdapter(provider.slug, apiKey);
        const creditsInfo = await adapter.getCredits();

        return {
          slug: provider.slug,
          name: provider.name,
          credits: creditsInfo,
          error: null,
        };
      } catch (error: any) {
        return {
          slug: provider.slug,
          name: provider.name,
          credits: null,
          error: error.message,
        };
      }
    })
  );

  return res.status(200).json({ credits });
}

// GET /api/integrations/usage?action=logs - Get usage logs
async function handleLogs(req: VercelRequest, res: VercelResponse) {
  const { providerId, limit, offset, status, requestType, from, to } = req.query;

  const where: any = {};

  if (providerId) where.providerId = String(providerId);
  if (status) where.status = String(status);
  if (requestType) where.requestType = String(requestType);

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(String(from));
    if (to) where.createdAt.lte = new Date(String(to));
  }

  const [logs, total] = await Promise.all([
    prisma.providerUsageLog.findMany({
      where,
      take: Math.min(Number(limit) || 50, 100),
      skip: Number(offset) || 0,
      orderBy: { createdAt: 'desc' },
      include: {
        provider: {
          select: { slug: true, name: true },
        },
      },
    }),
    prisma.providerUsageLog.count({ where }),
  ]);

  return res.status(200).json({ logs, total });
}

// GET /api/integrations/usage?action=stats - Get aggregated statistics
async function handleStats(req: VercelRequest, res: VercelResponse) {
  const { period } = req.query; // 'day', 'week', 'month'

  // Calculate date range
  const now = new Date();
  let from: Date;

  switch (period) {
    case 'day':
      from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
    default:
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Get stats per provider
  const providerStats = await prisma.providerUsageLog.groupBy({
    by: ['providerId', 'status'],
    where: { createdAt: { gte: from } },
    _count: { id: true },
    _sum: { creditsUsed: true, responseTimeMs: true },
  });

  // Get providers
  const providers = await prisma.integrationProvider.findMany({
    select: { id: true, slug: true, name: true },
  });

  const providerMap = new Map(providers.map((p) => [p.id, p]));

  // Aggregate by provider
  const byProvider: Record<
    string,
    {
      slug: string;
      name: string;
      totalRequests: number;
      successCount: number;
      notFoundCount: number;
      errorCount: number;
      totalCredits: number;
      avgResponseTime: number;
      successRate: number;
    }
  > = {};

  for (const stat of providerStats) {
    const provider = providerMap.get(stat.providerId);
    if (!provider) continue;

    if (!byProvider[provider.slug]) {
      byProvider[provider.slug] = {
        slug: provider.slug,
        name: provider.name,
        totalRequests: 0,
        successCount: 0,
        notFoundCount: 0,
        errorCount: 0,
        totalCredits: 0,
        avgResponseTime: 0,
        successRate: 0,
      };
    }

    const entry = byProvider[provider.slug];
    entry.totalRequests += stat._count.id;
    entry.totalCredits += stat._sum.creditsUsed || 0;

    if (stat.status === 'success') {
      entry.successCount += stat._count.id;
    } else if (stat.status === 'not_found') {
      entry.notFoundCount += stat._count.id;
    } else {
      entry.errorCount += stat._count.id;
    }

    entry.avgResponseTime =
      (entry.avgResponseTime * (entry.totalRequests - stat._count.id) +
        (stat._sum.responseTimeMs || 0)) /
      entry.totalRequests;
  }

  // Calculate success rates
  for (const entry of Object.values(byProvider)) {
    entry.successRate =
      entry.totalRequests > 0 ? (entry.successCount / entry.totalRequests) * 100 : 0;
  }

  // Overall stats
  const overall = {
    totalRequests: Object.values(byProvider).reduce((sum, p) => sum + p.totalRequests, 0),
    totalSuccess: Object.values(byProvider).reduce((sum, p) => sum + p.successCount, 0),
    totalCredits: Object.values(byProvider).reduce((sum, p) => sum + p.totalCredits, 0),
    activeProviders: Object.keys(byProvider).length,
  };

  return res.status(200).json({
    period: period || 'month',
    from: from.toISOString(),
    to: now.toISOString(),
    overall,
    byProvider: Object.values(byProvider),
  });
}

// GET /api/integrations/usage - Overview
async function handleOverview(req: VercelRequest, res: VercelResponse) {
  // Get provider summaries
  const providers = await prisma.integrationProvider.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      status: true,
      totalCreditsUsed: true,
      monthlyCreditsUsed: true,
      monthlyResetAt: true,
      lastTestAt: true,
      lastTestStatus: true,
      _count: {
        select: { usageLogs: true, waterfallSteps: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  // Get recent activity
  const recentLogs = await prisma.providerUsageLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      provider: {
        select: { slug: true, name: true },
      },
    },
  });

  // Get waterfall count
  const waterfallCount = await prisma.enrichmentWaterfall.count();

  return res.status(200).json({
    providers: providers.map((p) => ({
      ...p,
      usageCount: p._count.usageLogs,
      waterfallCount: p._count.waterfallSteps,
      _count: undefined,
    })),
    recentActivity: recentLogs,
    waterfallCount,
  });
}
