/**
 * Waterfall Configuration API
 *
 * Endpoints for managing enrichment waterfalls.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

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
    console.error('Waterfalls API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

// GET /api/integrations/waterfalls - List all waterfalls
// GET /api/integrations/waterfalls?id=xxx - Get single waterfall with steps
async function handleGet(req: VercelRequest, res: VercelResponse) {
  const { id, type } = req.query;

  // Get single waterfall
  if (id) {
    const waterfall = await prisma.enrichmentWaterfall.findUnique({
      where: { id: String(id) },
      include: {
        steps: {
          orderBy: { priority: 'asc' },
          include: {
            provider: {
              select: {
                id: true,
                slug: true,
                name: true,
                logoUrl: true,
                capabilities: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!waterfall) {
      return res.status(404).json({ error: 'Waterfall not found' });
    }

    return res.status(200).json(waterfall);
  }

  // Filter by enrichment type
  const where = type ? { enrichmentType: String(type) } : {};

  // List all waterfalls
  const waterfalls = await prisma.enrichmentWaterfall.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      steps: {
        orderBy: { priority: 'asc' },
        include: {
          provider: {
            select: {
              id: true,
              slug: true,
              name: true,
              logoUrl: true,
              status: true,
            },
          },
        },
      },
    },
  });

  return res.status(200).json({ waterfalls });
}

// POST /api/integrations/waterfalls - Create new waterfall
async function handlePost(req: VercelRequest, res: VercelResponse) {
  const { name, slug, enrichmentType, description, stopOnFirstMatch, maxProviders, steps } = req.body;

  if (!name || !slug || !enrichmentType) {
    return res.status(400).json({ error: 'name, slug, and enrichmentType are required' });
  }

  // Validate enrichment type
  const validTypes = ['email', 'phone', 'company', 'linkedin'];
  if (!validTypes.includes(enrichmentType)) {
    return res.status(400).json({ error: `enrichmentType must be one of: ${validTypes.join(', ')}` });
  }

  // Check for duplicate slug
  const existing = await prisma.enrichmentWaterfall.findUnique({
    where: { slug },
  });

  if (existing) {
    return res.status(400).json({ error: 'Waterfall with this slug already exists' });
  }

  // Create waterfall with steps
  const waterfall = await prisma.enrichmentWaterfall.create({
    data: {
      name,
      slug,
      enrichmentType,
      description,
      stopOnFirstMatch: stopOnFirstMatch ?? true,
      maxProviders: maxProviders ?? 3,
      steps: steps?.length
        ? {
            create: steps.map((step: any, index: number) => ({
              providerId: step.providerId,
              priority: step.priority ?? index,
              isEnabled: step.isEnabled ?? true,
              config: step.config,
            })),
          }
        : undefined,
    },
    include: {
      steps: {
        orderBy: { priority: 'asc' },
        include: { provider: true },
      },
    },
  });

  return res.status(201).json(waterfall);
}

// PUT /api/integrations/waterfalls - Update waterfall
async function handlePut(req: VercelRequest, res: VercelResponse) {
  const { id, name, description, stopOnFirstMatch, maxProviders, isActive, steps } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  // Build update data
  const updateData: any = { updatedAt: new Date() };

  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (stopOnFirstMatch !== undefined) updateData.stopOnFirstMatch = stopOnFirstMatch;
  if (maxProviders !== undefined) updateData.maxProviders = maxProviders;
  if (isActive !== undefined) updateData.isActive = isActive;

  // Update waterfall
  const waterfall = await prisma.enrichmentWaterfall.update({
    where: { id },
    data: updateData,
  });

  // Update steps if provided
  if (steps) {
    // Delete existing steps
    await prisma.waterfallStep.deleteMany({
      where: { waterfallId: id },
    });

    // Create new steps
    await prisma.waterfallStep.createMany({
      data: steps.map((step: any, index: number) => ({
        waterfallId: id,
        providerId: step.providerId,
        priority: step.priority ?? index,
        isEnabled: step.isEnabled ?? true,
        config: step.config,
      })),
    });
  }

  // Fetch updated waterfall with steps
  const updated = await prisma.enrichmentWaterfall.findUnique({
    where: { id },
    include: {
      steps: {
        orderBy: { priority: 'asc' },
        include: { provider: true },
      },
    },
  });

  return res.status(200).json(updated);
}

// DELETE /api/integrations/waterfalls?id=xxx - Delete waterfall
async function handleDelete(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  // Delete waterfall (cascade deletes steps)
  await prisma.enrichmentWaterfall.delete({
    where: { id: String(id) },
  });

  return res.status(200).json({ success: true });
}
