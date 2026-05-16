/**
 * Data Center Enrichment API
 *
 * POST /api/data-center/enrich
 *
 * Stage 2: AI Agents Enrichment (Orchestrated)
 * - Targeted enrichment only + gated
 * - Each Agent has: defined inputs + fixed output schema + confidence + source
 *
 * Endpoints:
 * - /api/data-center/enrich?action=plan     - Plan enrichment (no execution)
 * - /api/data-center/enrich?action=single   - Enrich single record
 * - /api/data-center/enrich?action=batch    - Batch enrichment
 * - /api/data-center/enrich?action=status   - Check enrichment status/costs
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AgentOrchestrator, getOrchestrator } from '../../services/data-center/agents/orchestrator';
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
      default:
        // Default: single enrichment
        if (req.method === 'POST') {
          return await handleSingleEnrich(req, res);
        }
        return res.status(400).json({ error: 'Invalid action. Use: plan, single, batch, status' });
    }
  } catch (error: any) {
    console.error('Enrichment API Error:', error);
    return res.status(500).json({
      error: 'Enrichment failed',
      message: error.message,
    });
  }
}

// ==========================================
// PLAN ENRICHMENT (No Execution)
// ==========================================

async function handlePlan(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { records, config } = req.body;

  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'records array is required' });
  }

  const orchestrator = getOrchestrator(config);

  const plans = records.map((record: NormalizedLeadObject) => {
    const plan = orchestrator.planEnrichment(record);
    return {
      record_id: record.id,
      ...plan,
    };
  });

  // Summary
  const summary = {
    total_records: plans.length,
    needs_enrichment: plans.filter(p => p.agents_to_run.length > 0).length,
    already_complete: plans.filter(p => p.passes_icp_gate_after && p.agents_to_run.length === 0).length,
    total_estimated_cost: plans.reduce((sum, p) => sum + p.total_estimated_cost, 0),
    agents_breakdown: getAgentsBreakdown(plans),
  };

  return res.status(200).json({
    plans,
    summary,
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

  const orchestrator = getOrchestrator(config);

  // Plan first
  const plan = orchestrator.planEnrichment(record as NormalizedLeadObject);

  // Execute enrichment
  const result = await orchestrator.enrichRecord(record as NormalizedLeadObject, plan);

  return res.status(200).json({
    plan,
    result: {
      status: result.status,
      original_record: result.original_record,
      enriched_record: result.enriched_record,
      fields_enriched: result.fields_enriched,
      fields_failed: result.fields_failed,
      ready_for_icp: result.ready_for_icp,
      credits_used: result.total_credits_used,
      api_calls: result.total_api_calls,
      duration_ms: result.total_duration_ms,
      agent_results: result.agent_results.map(ar => ({
        agent_type: ar.agent_type,
        status: ar.status,
        provider_used: ar.provider_used,
        fields_enriched: Object.keys(ar.enriched_fields),
        confidence: ar.confidence,
        credits_used: ar.credits_used,
        error: ar.error,
      })),
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

  const orchestrator = getOrchestrator(config);

  // Reset cost tracking for this batch
  orchestrator.resetCostTracking();

  // Limit records if needed
  const recordsToProcess = records.slice(0, limit);

  // Process batch
  const batchResult = await orchestrator.enrichBatch(recordsToProcess as NormalizedLeadObject[]);

  // Build response
  const response = {
    summary: batchResult.summary,
    results: batchResult.results.map(r => ({
      record_id: r.record_id,
      status: r.status,
      ready_for_icp: r.ready_for_icp,
      fields_enriched: r.fields_enriched,
      fields_failed: r.fields_failed,
      credits_used: r.total_credits_used,
      // Include enriched record
      enriched_record: {
        id: r.enriched_record.id,
        first_name: r.enriched_record.first_name,
        last_name: r.enriched_record.last_name,
        email: r.enriched_record.email,
        phone: r.enriched_record.phone,
        linkedin_url: r.enriched_record.linkedin_url,
        title_normalized: r.enriched_record.title_normalized,
        seniority: r.enriched_record.seniority,
        department: r.enriched_record.department,
        company_name: r.enriched_record.company_name,
        company_domain: r.enriched_record.company_domain,
        industry_normalized: r.enriched_record.industry_normalized,
        company_size: r.enriched_record.company_size,
        company_country: r.enriched_record.company_country,
        company_region: r.enriched_record.company_region,
        enrichment_sources: r.enriched_record.enrichment_sources,
        enrichment_cost: r.enriched_record.enrichment_cost,
      },
    })),
  };

  return res.status(200).json(response);
}

// ==========================================
// STATUS / COST TRACKING
// ==========================================

async function handleStatus(req: VercelRequest, res: VercelResponse) {
  const orchestrator = getOrchestrator();
  const costUsage = orchestrator.getCostUsage();

  return res.status(200).json({
    cost_tracking: costUsage,
    agents: {
      person_enrichment: {
        name: 'Person Enrichment Agent',
        name_ar: 'وكيل إثراء بيانات الشخص',
        providers: ['apollo', 'prospeo'],
        fields: ['title', 'seniority', 'department', 'linkedin_url'],
        estimated_cost: 0,
      },
      company_enrichment: {
        name: 'Company Enrichment Agent',
        name_ar: 'وكيل إثراء بيانات الشركة',
        providers: ['apollo'],
        fields: ['industry', 'company_size', 'company_country'],
        estimated_cost: 0,
      },
    },
    pipeline_info: {
      stage: 2,
      stage_name: 'Pre-ICP Enrichment',
      stage_name_ar: 'الإثراء المبدئي',
      description: 'Targeted enrichment for missing ICP-required fields',
      description_ar: 'إثراء موجه للحقول المطلوبة للتحقق من ICP',
    },
  });
}

// ==========================================
// HELPERS
// ==========================================

function getAgentsBreakdown(plans: any[]): Record<string, number> {
  const breakdown: Record<string, number> = {};

  for (const plan of plans) {
    for (const agent of plan.agents_to_run) {
      breakdown[agent.agent_type] = (breakdown[agent.agent_type] || 0) + 1;
    }
  }

  return breakdown;
}
