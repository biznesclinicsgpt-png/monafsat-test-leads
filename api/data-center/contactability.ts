/**
 * Data Center Contactability API
 *
 * POST /api/data-center/contactability
 *
 * Stage 5: Conditional Contactability Layer
 * - Email enrichment + verification (ICP Yes + Score >= 60)
 * - Phone enrichment (VIP only, Score >= 85)
 *
 * Endpoints:
 * - /api/data-center/contactability?action=plan      - Plan contactability (no execution)
 * - /api/data-center/contactability?action=single    - Enrich single record
 * - /api/data-center/contactability?action=batch     - Batch enrichment
 * - /api/data-center/contactability?action=status    - Check status and costs
 * - /api/data-center/contactability?action=channels  - Get available channels for records
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  ContactabilityOrchestrator,
  getContactabilityOrchestrator,
  ContactabilityConfig,
} from '../../services/data-center/agents/contactabilityOrchestrator';
import { NormalizedLeadObject } from '../../services/data-center/types';

// ==========================================
// MAIN HANDLER
// ==========================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query;

  try {
    switch (action) {
      case 'plan':
        return await handlePlan(req, res);
      case 'single':
        return await handleSingleEnrich(req, res);
      case 'batch':
        return await handleBatchEnrich(req, res);
      case 'status':
        return await handleStatus(req, res);
      case 'channels':
        return await handleChannels(req, res);
      default:
        if (req.method === 'POST') {
          return await handleSingleEnrich(req, res);
        }
        return res.status(400).json({
          error: 'Invalid action. Use: plan, single, batch, status, channels',
        });
    }
  } catch (error: any) {
    console.error('Contactability API Error:', error);
    return res.status(500).json({
      error: 'Contactability enrichment failed',
      message: error.message,
    });
  }
}

// ==========================================
// PLAN CONTACTABILITY
// ==========================================

async function handlePlan(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { records, config } = req.body;

  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'records array is required' });
  }

  const orchestrator = getContactabilityOrchestrator(config);

  const plans = records.map((record: NormalizedLeadObject) => {
    const plan = orchestrator.planContactability(record);
    return {
      record_id: record.id,
      icp_status: record.icp_status,
      icp_score: record.icp_fit_score,
      ...plan,
    };
  });

  // Summary
  const summary = {
    total_records: plans.length,
    email_eligible: plans.filter(p => p.email_eligible).length,
    phone_eligible: plans.filter(p => p.phone_eligible).length,
    will_find_email: plans.filter(p => p.will_find_email).length,
    will_verify_email: plans.filter(p => p.will_verify_email).length,
    will_find_phone: plans.filter(p => p.will_find_phone).length,
    already_has_email: plans.filter(p => p.has_email).length,
    already_verified: plans.filter(p => p.email_verified).length,
    already_has_phone: plans.filter(p => p.has_phone).length,
    total_estimated_cost: plans.reduce((sum, p) => sum + p.estimated_cost, 0),
  };

  return res.status(200).json({
    plans,
    summary,
    gating_rules: {
      email: {
        condition: 'ICP = Yes AND Score >= threshold',
        threshold: config?.email_threshold || 60,
      },
      phone: {
        condition: 'ICP = Yes AND Score >= threshold (VIP only)',
        threshold: config?.phone_threshold || 85,
      },
    },
  });
}

// ==========================================
// SINGLE RECORD ENRICHMENT
// ==========================================

async function handleSingleEnrich(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { record, config } = req.body;

  if (!record) {
    return res.status(400).json({ error: 'record is required' });
  }

  // Validate ICP status
  if (record.icp_status !== 'Yes') {
    return res.status(200).json({
      status: 'skipped',
      reason: `ICP Gate: status is "${record.icp_status}" (requires "Yes")`,
      record_id: record.id,
      ready_for_campaign: false,
      campaign_channels: record.linkedin_url ? ['linkedin'] : [],
    });
  }

  const orchestrator = getContactabilityOrchestrator(config);

  // Plan
  const plan = orchestrator.planContactability(record as NormalizedLeadObject);

  // Execute
  const result = await orchestrator.enrichContactability(record as NormalizedLeadObject, plan);

  return res.status(200).json({
    plan,
    result: {
      status: result.status,
      record_id: result.record_id,

      // What was done
      email_found: result.email_found,
      email_verified: result.email_verified,
      phone_found: result.phone_found,

      // Results
      email: result.email_result,
      phone: result.phone_result,

      // Enriched record (key fields)
      enriched_record: {
        id: result.enriched_record.id,
        email: result.enriched_record.email,
        email_status: result.enriched_record.email_status,
        email_confidence: result.enriched_record.email_confidence,
        phone: result.enriched_record.phone,
        phone_status: result.enriched_record.phone_status,
        linkedin_url: result.enriched_record.linkedin_url,
        icp_status: result.enriched_record.icp_status,
        icp_fit_score: result.enriched_record.icp_fit_score,
      },

      // Campaign readiness
      ready_for_campaign: result.ready_for_campaign,
      campaign_channels: result.campaign_channels,

      // Costs
      credits_used: result.total_credits_used,
      duration_ms: result.duration_ms,
    },
  });
}

// ==========================================
// BATCH ENRICHMENT
// ==========================================

async function handleBatchEnrich(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { records, config, limit = 100 } = req.body;

  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'records array is required' });
  }

  if (records.length > 500) {
    return res.status(400).json({ error: 'Maximum 500 records per batch' });
  }

  const orchestrator = getContactabilityOrchestrator(config);

  // Reset cost tracking for this batch
  orchestrator.resetCostTracking();

  // Filter to ICP-passed records only
  const eligibleRecords = records.filter((r: NormalizedLeadObject) => r.icp_status === 'Yes');
  const skippedRecords = records.filter((r: NormalizedLeadObject) => r.icp_status !== 'Yes');

  // Limit records
  const recordsToProcess = eligibleRecords.slice(0, limit);

  // Process batch
  const batchResult = await orchestrator.enrichBatch(recordsToProcess as NormalizedLeadObject[]);

  return res.status(200).json({
    summary: {
      ...batchResult.summary,
      skipped_non_icp: skippedRecords.length,
    },
    results: batchResult.results.map(r => ({
      record_id: r.record_id,
      status: r.status,
      email_found: r.email_found,
      email_verified: r.email_verified,
      phone_found: r.phone_found,
      email: r.email_result?.email,
      email_status: r.email_result?.status,
      phone: r.phone_result?.phone,
      credits_used: r.total_credits_used,
      ready_for_campaign: r.ready_for_campaign,
      campaign_channels: r.campaign_channels,
    })),
    skipped_records: skippedRecords.map((r: NormalizedLeadObject) => ({
      record_id: r.id,
      reason: `ICP status is "${r.icp_status}"`,
    })),
  });
}

// ==========================================
// STATUS
// ==========================================

async function handleStatus(req: VercelRequest, res: VercelResponse) {
  const orchestrator = getContactabilityOrchestrator();
  const costUsage = orchestrator.getCostUsage();

  return res.status(200).json({
    cost_tracking: costUsage,
    stage: {
      number: 5,
      name: 'Contactability Layer',
      name_ar: 'طبقة التواصل',
      description: 'Email and phone enrichment for campaign-ready leads',
    },
    agents: {
      email_finder: {
        name: 'Email Finder',
        name_ar: 'البحث عن البريد الإلكتروني',
        providers: ['hunter', 'prospeo', 'apollo'],
        gate: 'ICP = Yes AND Score >= 60',
        cost_per_find: '1-2 credits',
      },
      email_verifier: {
        name: 'Email Verifier',
        name_ar: 'التحقق من البريد',
        providers: ['hunter', 'prospeo'],
        gate: 'Has email + ICP = Yes',
        cost_per_verify: '1 credit',
      },
      phone_finder: {
        name: 'Phone Finder',
        name_ar: 'البحث عن رقم الهاتف',
        providers: ['prospeo'],
        gate: 'ICP = Yes AND Score >= 85 (VIP)',
        cost_per_find: '10 credits',
      },
    },
    gating_rules: {
      email: {
        description: 'Email enrichment for ICP-verified leads',
        description_ar: 'إثراء البريد للعملاء المحققين',
        condition: 'ICP = Yes AND Score >= 60',
      },
      phone: {
        description: 'Phone enrichment for VIP leads only',
        description_ar: 'إثراء الهاتف للعملاء VIP فقط',
        condition: 'ICP = Yes AND Score >= 85',
      },
    },
  });
}

// ==========================================
// GET CHANNELS
// ==========================================

async function handleChannels(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { records } = req.body;

  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'records array is required' });
  }

  const results = records.map((record: NormalizedLeadObject) => {
    const channels: string[] = [];

    if (record.email && ['valid', 'risky'].includes(record.email_status || '')) {
      channels.push('email');
    }
    if (record.phone && record.phone_status !== 'invalid') {
      channels.push('phone');
      channels.push('whatsapp');
    }
    if (record.linkedin_url) {
      channels.push('linkedin');
    }

    return {
      record_id: record.id,
      channels,
      ready_for_campaign: channels.length > 0,
      contact_info: {
        email: record.email,
        email_status: record.email_status,
        phone: record.phone,
        phone_status: record.phone_status,
        linkedin: record.linkedin_url,
      },
    };
  });

  // Summary
  const summary = {
    total: results.length,
    ready_for_campaign: results.filter(r => r.ready_for_campaign).length,
    channels_breakdown: {
      email: results.filter(r => r.channels.includes('email')).length,
      phone: results.filter(r => r.channels.includes('phone')).length,
      linkedin: results.filter(r => r.channels.includes('linkedin')).length,
      whatsapp: results.filter(r => r.channels.includes('whatsapp')).length,
    },
  };

  return res.status(200).json({
    results,
    summary,
  });
}
