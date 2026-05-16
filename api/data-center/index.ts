/**
 * Data Center API - Index/Router
 *
 * Routes:
 * POST /api/data-center/ingest    - Unified data ingest
 * POST /api/data-center/normalize - AI-assisted normalization
 * POST /api/data-center/icp       - ICP verification & scoring
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // API documentation
  return res.status(200).json({
    name: 'Data Center API',
    version: '1.0.0',
    description: 'GTM Engineering Platform - Data Center Module',
    endpoints: {
      '/api/data-center/ingest': {
        method: 'POST',
        description: 'Unified data ingest endpoint',
        body: {
          source_type: 'csv_upload | external_pull | api | master_db',
          records: 'Array of raw records',
          field_mapping: 'Optional field mapping',
          options: {
            skip_ai_normalization: 'boolean',
            skip_dedup: 'boolean',
            auto_enrich_missing: 'boolean',
          },
        },
      },
      '/api/data-center/normalize': {
        method: 'POST',
        description: 'AI-assisted normalization',
        actions: {
          default: 'Single record normalization',
          'detect-mapping': 'Detect field mapping from columns',
          batch: 'Batch normalization',
          preview: 'Preview normalization without saving',
        },
      },
      '/api/data-center/enrich': {
        method: 'POST',
        description: 'AI Agents enrichment (Stage 2)',
        actions: {
          plan: 'Plan enrichment without execution',
          single: 'Enrich single record',
          batch: 'Batch enrichment (max 500)',
          status: 'Check enrichment status and costs',
        },
        agents: {
          person_enrichment: 'Title, seniority, department, LinkedIn',
          company_enrichment: 'Industry, size, country',
        },
      },
      '/api/data-center/icp': {
        method: 'POST',
        description: 'ICP verification and scoring',
        actions: {
          verify: 'Verify ICP status (Yes/No/Unknown)',
          score: 'Calculate fit score (0-100)',
          rules: 'Get/Set ICP rules',
          analyze: 'Full ICP analysis',
          'from-provider': 'Build rules from provider profile',
        },
      },
    },
    pipeline: {
      'Stage 0': 'Sources (CSV, Apollo, Master DB)',
      'Stage 1': 'Ingest → Normalize (AI-assisted + Validators)',
      'Stage 2': 'Optional Pre-ICP Enrichment',
      'Stage 3': 'ICP Verify Gate (Yes/No/Unknown)',
      'Stage 4': 'ICP Fit Scoring (0-100)',
      'Stage 5': 'Conditional Contactability (Email/Phone)',
      'Stage 6': 'Campaign Prep & Export',
    },
  });
}
