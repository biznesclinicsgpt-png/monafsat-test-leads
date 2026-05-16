/**
 * Waterfall Enrichment API
 *
 * Endpoints for running enrichment through waterfalls.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  runWaterfall,
  runBatchWaterfall,
  enrichEmail,
  enrichPhone,
  enrichCompany,
  enrichFull,
  WaterfallConfig,
} from '../../services/providers/waterfallOrchestrator';
import { EnrichmentInput } from '../../services/providers/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { action } = req.query;

  try {
    switch (action) {
      case 'email':
        return await handleEmailEnrich(req, res);
      case 'phone':
        return await handlePhoneEnrich(req, res);
      case 'company':
        return await handleCompanyEnrich(req, res);
      case 'full':
        return await handleFullEnrich(req, res);
      case 'batch':
        return await handleBatchEnrich(req, res);
      case 'custom':
        return await handleCustomEnrich(req, res);
      default:
        return await handleDefaultEnrich(req, res);
    }
  } catch (error: any) {
    console.error('Enrichment API Error:', error);
    return res.status(500).json({ error: 'Enrichment failed', details: error.message });
  }
}

// POST /api/integrations/enrich?action=email - Quick email enrichment
async function handleEmailEnrich(req: VercelRequest, res: VercelResponse) {
  const input = parseInput(req.body);
  const result = await enrichEmail(input);
  return res.status(200).json(result);
}

// POST /api/integrations/enrich?action=phone - Quick phone enrichment
async function handlePhoneEnrich(req: VercelRequest, res: VercelResponse) {
  const input = parseInput(req.body);
  const result = await enrichPhone(input);
  return res.status(200).json(result);
}

// POST /api/integrations/enrich?action=company - Quick company enrichment
async function handleCompanyEnrich(req: VercelRequest, res: VercelResponse) {
  const input = parseInput(req.body);
  const result = await enrichCompany(input);
  return res.status(200).json(result);
}

// POST /api/integrations/enrich?action=full - Full enrichment (all types)
async function handleFullEnrich(req: VercelRequest, res: VercelResponse) {
  const input = parseInput(req.body);
  const result = await enrichFull(input);
  return res.status(200).json(result);
}

// POST /api/integrations/enrich?action=batch - Batch enrichment
async function handleBatchEnrich(req: VercelRequest, res: VercelResponse) {
  const { inputs, enrichmentType, waterfallId, waterfallSlug, stopOnFirstMatch, maxProviders, delayMs } = req.body;

  if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
    return res.status(400).json({ error: 'inputs array is required' });
  }

  if (inputs.length > 100) {
    return res.status(400).json({ error: 'Maximum 100 inputs per batch' });
  }

  const config: WaterfallConfig = {
    enrichmentType: enrichmentType || 'email',
    waterfallId,
    waterfallSlug,
    stopOnFirstMatch: stopOnFirstMatch ?? true,
    maxProviders: maxProviders ?? 3,
  };

  const parsedInputs = inputs.map(parseInput);

  const result = await runBatchWaterfall(parsedInputs, config, {
    delayMs: delayMs || 500,
  });

  return res.status(200).json(result);
}

// POST /api/integrations/enrich?action=custom - Custom waterfall enrichment
async function handleCustomEnrich(req: VercelRequest, res: VercelResponse) {
  const { input, waterfallId, waterfallSlug, enrichmentType, stopOnFirstMatch, maxProviders } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'input is required' });
  }

  const config: WaterfallConfig = {
    enrichmentType: enrichmentType || 'email',
    waterfallId,
    waterfallSlug,
    stopOnFirstMatch: stopOnFirstMatch ?? true,
    maxProviders,
  };

  const result = await runWaterfall(parseInput(input), config);
  return res.status(200).json(result);
}

// POST /api/integrations/enrich - Default enrichment (auto-detect type)
async function handleDefaultEnrich(req: VercelRequest, res: VercelResponse) {
  const { input, ...rest } = req.body;
  const parsedInput = parseInput(input || req.body);

  // Auto-detect enrichment type based on available data
  let enrichmentType: 'email' | 'phone' | 'company' | 'linkedin' = 'email';

  if (parsedInput.linkedinUrl) {
    enrichmentType = 'linkedin';
  } else if (parsedInput.companyDomain && !parsedInput.firstName) {
    enrichmentType = 'company';
  }

  const config: WaterfallConfig = {
    enrichmentType,
    waterfallId: rest.waterfallId,
    waterfallSlug: rest.waterfallSlug,
    stopOnFirstMatch: rest.stopOnFirstMatch ?? true,
    maxProviders: rest.maxProviders,
  };

  const result = await runWaterfall(parsedInput, config);
  return res.status(200).json(result);
}

// Parse input to standardized format
function parseInput(data: any): EnrichmentInput {
  if (!data) return {};

  return {
    firstName: data.firstName || data.first_name || data.First_Name,
    lastName: data.lastName || data.last_name || data.Last_Name,
    fullName: data.fullName || data.full_name || data.name || data.Name,
    email: data.email || data.Email,
    phone: data.phone || data.Phone,
    linkedinUrl: data.linkedinUrl || data.linkedin_url || data.linkedin || data.LinkedIn_URL,
    companyName: data.companyName || data.company_name || data.company || data.Company,
    companyDomain: data.companyDomain || data.company_domain || data.domain || data.website || data.Website,
    companyLinkedinUrl: data.companyLinkedinUrl || data.company_linkedin_url,
    title: data.title || data.job_title || data.Title || data.Job_Title,
    location: data.location || data.Location,
    country: data.country || data.Country,
  };
}
