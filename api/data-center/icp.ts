/**
 * Data Center ICP API
 *
 * POST /api/data-center/icp
 *
 * Stage 3: ICP Verify (Yes/No/Unknown) - Gate
 * Stage 4: ICP Fit Scoring (0-100)
 *
 * Endpoints:
 * - /api/data-center/icp?action=verify - Verify ICP status
 * - /api/data-center/icp?action=score - Calculate fit score
 * - /api/data-center/icp?action=rules - Get/Set ICP rules
 * - /api/data-center/icp?action=analyze - Full ICP analysis
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  ICPEngine,
  verifyICP,
  verifyICPBatch,
  calculateICPScore,
  buildICPRulesFromProvider,
} from '../../services/data-center/icpEngine';
import {
  NormalizedLeadObject,
  ICPRule,
  ICPVerifyRequest,
  ICPVerifyResponse,
} from '../../services/data-center/types';
import { ProviderProfile } from '../../types';
import { ICPProfile } from '../../types/data-center';

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
      case 'verify':
        return await handleVerify(req, res);
      case 'score':
        return await handleScore(req, res);
      case 'rules':
        return await handleRules(req, res);
      case 'analyze':
        return await handleAnalyze(req, res);
      case 'from-provider':
        return await handleFromProvider(req, res);
      default:
        // Default: verify single record
        if (req.method === 'POST') {
          return await handleVerify(req, res);
        }
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error('ICP API Error:', error);
    return res.status(500).json({
      error: 'ICP operation failed',
      message: error.message,
    });
  }
}

// ==========================================
// VERIFY ICP STATUS
// ==========================================

async function handleVerify(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { records, rules, threshold = 60, icp_profile_id } = req.body as ICPVerifyRequest & { icp_profile_id?: string };

  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'records array is required' });
  }

  if (records.length > 1000) {
    return res.status(400).json({ error: 'Maximum 1000 records per request' });
  }

  // Get rules from various sources
  let icpRules: ICPRule[] = rules || [];

  // If no rules provided, try to load from profile
  if (icpRules.length === 0 && icp_profile_id) {
    // TODO: Load from database
    // icpRules = await loadICPRulesFromProfile(icp_profile_id);
  }

  // If still no rules, use default rules
  if (icpRules.length === 0) {
    icpRules = getDefaultICPRules();
  }

  // Run verification
  const response = verifyICPBatch(records as NormalizedLeadObject[], icpRules, threshold);

  return res.status(200).json(response);
}

// ==========================================
// CALCULATE FIT SCORE
// ==========================================

async function handleScore(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { records, rules, weights } = req.body;

  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'records array is required' });
  }

  // Get rules
  let icpRules: ICPRule[] = rules || getDefaultICPRules();

  // Calculate scores
  const results = records.map((record: NormalizedLeadObject) => {
    const scoreResult = calculateICPScore(record, icpRules, weights);
    return {
      id: record.id,
      ...scoreResult,
    };
  });

  // Summary
  const summary = {
    total: results.length,
    avg_score: Math.round(results.reduce((sum, r) => sum + r.total_score, 0) / results.length),
    by_tier: {
      VIP: results.filter(r => r.tier === 'VIP').length,
      Priority: results.filter(r => r.tier === 'Priority').length,
      Standard: results.filter(r => r.tier === 'Standard').length,
      Low: results.filter(r => r.tier === 'Low').length,
    },
  };

  return res.status(200).json({ results, summary });
}

// ==========================================
// MANAGE ICP RULES
// ==========================================

async function handleRules(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Return default rules as template
    const defaultRules = getDefaultICPRules();
    return res.status(200).json({
      rules: defaultRules,
      description: 'قواعد ICP الافتراضية - يمكن تخصيصها',
    });
  }

  if (req.method === 'POST') {
    const { rules, provider_id, icp_profile_id } = req.body;

    // Validate rules
    if (rules && Array.isArray(rules)) {
      const validation = validateICPRules(rules);
      if (!validation.valid) {
        return res.status(400).json({
          error: 'Invalid rules',
          details: validation.errors,
        });
      }
    }

    // TODO: Save rules to database

    return res.status(200).json({
      success: true,
      message: 'Rules saved successfully',
      rules,
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

// ==========================================
// FULL ICP ANALYSIS
// ==========================================

async function handleAnalyze(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { records, rules, threshold = 60, weights } = req.body;

  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'records array is required' });
  }

  const icpRules: ICPRule[] = rules || getDefaultICPRules();

  // Full analysis: verify + score
  const results = records.map((record: NormalizedLeadObject) => {
    const verifyResult = verifyICP(record, icpRules, threshold);
    const scoreResult = calculateICPScore(record, icpRules, weights);

    return {
      id: record.id,
      // Verification
      icp_status: verifyResult.icp_status,
      fit_score: scoreResult.total_score,
      tier: scoreResult.tier,
      confidence: verifyResult.confidence,
      // Details
      reasons: verifyResult.reasons,
      score_breakdown: scoreResult.breakdown,
      missing_fields: verifyResult.missing_fields,
      matched_rules: verifyResult.matched_rules,
      failed_rules: verifyResult.failed_rules,
      // Actionable insights
      recommendations: generateRecommendations(verifyResult, scoreResult),
    };
  });

  // Summary
  const summary = {
    total: results.length,
    icp_yes: results.filter(r => r.icp_status === 'Yes').length,
    icp_no: results.filter(r => r.icp_status === 'No').length,
    icp_unknown: results.filter(r => r.icp_status === 'Unknown').length,
    avg_fit_score: Math.round(results.reduce((sum, r) => sum + r.fit_score, 0) / results.length),
    by_tier: {
      VIP: results.filter(r => r.tier === 'VIP').length,
      Priority: results.filter(r => r.tier === 'Priority').length,
      Standard: results.filter(r => r.tier === 'Standard').length,
      Low: results.filter(r => r.tier === 'Low').length,
    },
    // Top missing fields across all records
    top_missing_fields: getTopMissingFields(results),
  };

  return res.status(200).json({ results, summary });
}

// ==========================================
// BUILD RULES FROM PROVIDER PROFILE
// ==========================================

async function handleFromProvider(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { provider } = req.body;

  if (!provider) {
    return res.status(400).json({ error: 'provider object is required' });
  }

  // Build rules from provider profile
  const rules = buildICPRulesFromProvider(provider as ProviderProfile);

  return res.status(200).json({
    rules,
    provider_id: provider.id,
    provider_name: provider.company_name,
    rules_count: rules.length,
  });
}

// ==========================================
// HELPERS
// ==========================================

function getDefaultICPRules(): ICPRule[] {
  return [
    {
      id: 'industry_match',
      name: 'مطابقة الصناعة',
      field: 'industry_normalized',
      operator: 'in',
      value: ['technology', 'construction', 'healthcare', 'finance', 'retail', 'manufacturing', 'energy', 'real_estate', 'consulting'],
      weight: 40,
      required: true,
    },
    {
      id: 'seniority_match',
      name: 'مطابقة المستوى الوظيفي',
      field: 'seniority',
      operator: 'in',
      value: ['C-Level', 'VP', 'Director', 'Manager'],
      weight: 30,
      required: false,
    },
    {
      id: 'company_size_match',
      name: 'مطابقة حجم الشركة',
      field: 'company_size',
      operator: 'in',
      value: ['51-200', '201-500', '501-1000', '1000+'],
      weight: 15,
      required: false,
    },
    {
      id: 'geo_match',
      name: 'مطابقة المنطقة',
      field: 'company_region',
      operator: 'equals',
      value: 'GCC',
      weight: 10,
      required: false,
    },
    {
      id: 'has_email',
      name: 'وجود البريد الإلكتروني',
      field: 'email',
      operator: 'exists',
      value: true,
      weight: 5,
      required: false,
    },
  ];
}

function validateICPRules(rules: ICPRule[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];

    if (!rule.id) errors.push(`Rule ${i}: id is required`);
    if (!rule.field) errors.push(`Rule ${i}: field is required`);
    if (!rule.operator) errors.push(`Rule ${i}: operator is required`);
    if (rule.value === undefined) errors.push(`Rule ${i}: value is required`);
    if (typeof rule.weight !== 'number') errors.push(`Rule ${i}: weight must be a number`);

    const validOperators = ['equals', 'contains', 'in', 'not_in', 'regex', 'range', 'exists'];
    if (rule.operator && !validOperators.includes(rule.operator)) {
      errors.push(`Rule ${i}: invalid operator "${rule.operator}"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function generateRecommendations(
  verifyResult: ReturnType<typeof verifyICP>,
  scoreResult: ReturnType<typeof calculateICPScore>
): string[] {
  const recommendations: string[] = [];

  // Missing fields recommendations
  if (verifyResult.missing_fields.length > 0) {
    if (verifyResult.missing_fields.includes('industry_normalized')) {
      recommendations.push('إثراء بيانات الصناعة مطلوب لتحسين التصنيف');
    }
    if (verifyResult.missing_fields.includes('company_size')) {
      recommendations.push('إثراء حجم الشركة سيساعد في تحديد الأولوية');
    }
  }

  // Score-based recommendations
  if (scoreResult.total_score >= 85) {
    recommendations.push('عميل VIP - أولوية قصوى للتواصل');
  } else if (scoreResult.total_score >= 70) {
    recommendations.push('عميل مناسب - يستحق المتابعة');
  } else if (verifyResult.icp_status === 'Unknown') {
    recommendations.push('بيانات غير كافية - يُنصح بالإثراء قبل التقييم');
  }

  // Confidence-based recommendations
  if (verifyResult.confidence < 0.5) {
    recommendations.push('ثقة منخفضة - البيانات ناقصة');
  }

  return recommendations;
}

function getTopMissingFields(results: any[]): { field: string; count: number; percentage: string }[] {
  const fieldCounts = new Map<string, number>();

  for (const result of results) {
    for (const field of result.missing_fields) {
      fieldCounts.set(field, (fieldCounts.get(field) || 0) + 1);
    }
  }

  return Array.from(fieldCounts.entries())
    .map(([field, count]) => ({
      field,
      count,
      percentage: `${Math.round((count / results.length) * 100)}%`,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
