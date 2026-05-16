/**
 * Data Center Normalize API
 *
 * POST /api/data-center/normalize
 *
 * AI-assisted normalization endpoint
 * - AI Prompt Module acts as "Normalizer + Mapper + Cleaner"
 * - Output must pass through Rules/Validators (Regex/Enums/Hard checks)
 * - AI prepares/infers → System validates/rejects/marks Unknown
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Normalizer } from '../../services/data-center/normalizer';
import {
  NormalizeRequest,
  NormalizeResponse,
} from '../../services/data-center/types';

// ==========================================
// MAIN HANDLER
// ==========================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { action } = req.query;

  try {
    switch (action) {
      case 'detect-mapping':
        return await handleDetectMapping(req, res);
      case 'batch':
        return await handleBatchNormalize(req, res);
      case 'preview':
        return await handlePreview(req, res);
      default:
        return await handleSingleNormalize(req, res);
    }
  } catch (error: any) {
    console.error('Normalize API Error:', error);
    return res.status(500).json({
      error: 'Normalization failed',
      message: error.message,
    });
  }
}

// ==========================================
// SINGLE RECORD NORMALIZATION
// ==========================================

async function handleSingleNormalize(req: VercelRequest, res: VercelResponse) {
  const { raw_data, field_mapping, options } = req.body;

  if (!raw_data || typeof raw_data !== 'object') {
    return res.status(400).json({ error: 'raw_data object is required' });
  }

  const normalizer = new Normalizer({
    useAI: options?.use_ai !== false,
    aiApiKey: process.env.GEMINI_API_KEY,
    strictValidation: options?.strict_validation ?? false,
    autoAcceptHighConfidence: true,
    confidenceThreshold: 85,
  });

  const result = await normalizer.normalizeRecord(raw_data, field_mapping);

  return res.status(200).json({
    status: result.status,
    normalized: result.normalized,
    errors: result.errors,
    warnings: result.warnings,
    ai_suggestions: result.ai_suggestions,
    dedup_key: result.dedup_key,
  });
}

// ==========================================
// BATCH NORMALIZATION
// ==========================================

async function handleBatchNormalize(req: VercelRequest, res: VercelResponse) {
  const body = req.body as NormalizeRequest;

  if (!body.records || !Array.isArray(body.records)) {
    return res.status(400).json({ error: 'records array is required' });
  }

  if (body.records.length > 1000) {
    return res.status(400).json({ error: 'Maximum 1000 records per batch' });
  }

  const normalizer = new Normalizer({
    useAI: body.options?.use_ai !== false,
    aiApiKey: process.env.GEMINI_API_KEY,
    strictValidation: body.options?.strict_validation ?? false,
    autoAcceptHighConfidence: true,
    confidenceThreshold: 85,
  });

  const result = await normalizer.normalizeBatch(
    body.records.map(r => ({
      id: r.id,
      raw_data: r.raw_data,
    })),
    body.field_mapping
  );

  const response: NormalizeResponse = {
    status: result.summary.failed === 0 ? 'success' :
            result.summary.success === 0 ? 'failed' : 'partial',
    results: result.results.map(r => ({
      id: r.id,
      status: r.status === 'success' ? 'normalized' : 'failed',
      normalized: r.status !== 'failed' ? r.normalized : undefined,
      errors: r.errors.length > 0 ? r.errors : undefined,
      ai_suggestions: r.ai_suggestions.length > 0 ? r.ai_suggestions : undefined,
    })),
    summary: {
      total: result.summary.total,
      normalized: result.summary.success + result.summary.partial,
      failed: result.summary.failed,
      ai_applied: result.results.filter(r => r.ai_suggestions.some(s => s.accepted)).length,
    },
  };

  return res.status(200).json(response);
}

// ==========================================
// FIELD MAPPING DETECTION
// ==========================================

async function handleDetectMapping(req: VercelRequest, res: VercelResponse) {
  const { columns, sample_data } = req.body;

  if (!columns || !Array.isArray(columns)) {
    return res.status(400).json({ error: 'columns array is required' });
  }

  const normalizer = new Normalizer({
    useAI: true,
    aiApiKey: process.env.GEMINI_API_KEY,
  });

  const result = await normalizer.detectFieldMapping(columns);

  // If sample data provided, generate preview
  let preview: any[] = [];
  if (sample_data && Array.isArray(sample_data) && sample_data.length > 0) {
    const sampleRecords = sample_data.slice(0, 3);
    for (const raw of sampleRecords) {
      const normalized = await normalizer.normalizeRecord(raw, result.mapping);
      preview.push({
        raw: raw,
        normalized: {
          first_name: normalized.normalized.first_name,
          last_name: normalized.normalized.last_name,
          email: normalized.normalized.email,
          phone: normalized.normalized.phone,
          company_name: normalized.normalized.company_name,
          title: normalized.normalized.title_normalized,
          seniority: normalized.normalized.seniority,
          industry: normalized.normalized.industry_normalized,
        },
        ai_suggestions: normalized.ai_suggestions,
      });
    }
  }

  return res.status(200).json({
    mapping: result.mapping,
    confidence: result.confidence,
    unmapped: result.unmapped,
    preview,
  });
}

// ==========================================
// PREVIEW NORMALIZATION (without saving)
// ==========================================

async function handlePreview(req: VercelRequest, res: VercelResponse) {
  const { records, field_mapping, limit = 5 } = req.body;

  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'records array is required' });
  }

  const normalizer = new Normalizer({
    useAI: true,
    aiApiKey: process.env.GEMINI_API_KEY,
    autoAcceptHighConfidence: true,
  });

  // Only process limited number for preview
  const previewRecords = records.slice(0, Math.min(limit, 10));

  const results = await normalizer.normalizeBatch(
    previewRecords.map((raw, i) => ({
      id: `preview_${i}`,
      raw_data: raw,
    })),
    field_mapping
  );

  // Build preview response with before/after comparison
  const preview = results.results.map((r, i) => ({
    row_number: i + 1,
    status: r.status,
    before: previewRecords[i],
    after: {
      first_name: r.normalized.first_name,
      last_name: r.normalized.last_name,
      full_name: r.normalized.full_name,
      email: r.normalized.email,
      phone: r.normalized.phone,
      linkedin_url: r.normalized.linkedin_url,
      title: r.normalized.title_normalized,
      seniority: r.normalized.seniority,
      department: r.normalized.department,
      company_name: r.normalized.company_name_normalized,
      company_domain: r.normalized.company_domain,
      industry: r.normalized.industry_normalized,
      company_size: r.normalized.company_size,
      country: r.normalized.company_country,
    },
    ai_suggestions: r.ai_suggestions,
    errors: r.errors,
    warnings: r.warnings,
    identity_hash: r.normalized.identity_hash,
  }));

  return res.status(200).json({
    preview,
    summary: results.summary,
  });
}
