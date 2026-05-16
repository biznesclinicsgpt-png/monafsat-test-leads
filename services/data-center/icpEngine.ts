/**
 * ICP Engine - Verification and Scoring
 *
 * Stage 3: ICP Verify (Yes/No/Unknown) - Gate
 * Stage 4: ICP Fit Scoring (0-100)
 *
 * Rules derived from Provider Profile's icp_structured
 */

import { ProviderProfile } from '@/types';
import { ICPProfile } from '@/types/data-center';
import {
  NormalizedLeadObject,
  ICPRule,
  ICPVerifyRequest,
  ICPVerifyResponse,
  INDUSTRY_TAXONOMY,
  COMPANY_SIZE_RANGES,
  GCC_REGIONS,
} from './types';

// ==========================================
// ICP RULE BUILDER FROM PROVIDER PROFILE
// ==========================================

export const buildICPRulesFromProvider = (provider: ProviderProfile): ICPRule[] => {
  const rules: ICPRule[] = [];
  const icp = provider.icp_structured;

  if (!icp) {
    // Build from basic provider info
    return buildBasicICPRules(provider);
  }

  // Industry rules (weight: 40)
  if (icp.industries && icp.industries.length > 0) {
    rules.push({
      id: 'industry_match',
      name: 'مطابقة الصناعة',
      field: 'industry_normalized',
      operator: 'in',
      value: icp.industries.map(i => i.toLowerCase()),
      weight: 40,
      required: true, // ICP = Unknown if missing
    });
  }

  // Decision makers / Title rules (weight: 30)
  if (icp.decision_makers && icp.decision_makers.length > 0) {
    rules.push({
      id: 'title_match',
      name: 'مطابقة المسمى الوظيفي',
      field: 'title_normalized',
      operator: 'contains',
      value: icp.decision_makers,
      weight: 25,
      required: false,
    });

    // Seniority rule
    rules.push({
      id: 'seniority_match',
      name: 'مطابقة المستوى الوظيفي',
      field: 'seniority',
      operator: 'in',
      value: ['C-Level', 'VP', 'Director', 'Manager'],
      weight: 15,
      required: false,
    });
  }

  // Company size rules (weight: 15)
  if (icp.company_size_ideal && icp.company_size_ideal.length > 0) {
    rules.push({
      id: 'company_size_match',
      name: 'مطابقة حجم الشركة',
      field: 'company_size',
      operator: 'in',
      value: icp.company_size_ideal,
      weight: 15,
      required: false,
    });
  }

  // Geo rule (weight: 10) - GCC focus
  rules.push({
    id: 'geo_match',
    name: 'مطابقة المنطقة',
    field: 'company_region',
    operator: 'equals',
    value: 'GCC',
    weight: 10,
    required: false,
  });

  // Negative signals / Exclusions
  if (icp.negative_signals && icp.negative_signals.length > 0) {
    rules.push({
      id: 'negative_signals',
      name: 'إشارات سلبية',
      field: 'title_normalized',
      operator: 'not_in',
      value: icp.negative_signals,
      weight: -20, // Negative weight
      required: false,
    });
  }

  return rules;
};

// Build basic ICP rules from provider without structured ICP
const buildBasicICPRules = (provider: ProviderProfile): ICPRule[] => {
  const rules: ICPRule[] = [];

  // Industries from provider profile
  if (provider.industries && provider.industries.length > 0) {
    rules.push({
      id: 'industry_match',
      name: 'مطابقة الصناعة',
      field: 'industry_normalized',
      operator: 'in',
      value: provider.industries.map(i => i.name.toLowerCase()),
      weight: 40,
      required: true,
    });
  }

  // Default decision maker titles based on service lines
  const defaultTitles = ['CEO', 'CTO', 'CFO', 'Director', 'Manager', 'VP', 'Head'];
  rules.push({
    id: 'seniority_match',
    name: 'مطابقة المستوى الوظيفي',
    field: 'seniority',
    operator: 'in',
    value: ['C-Level', 'VP', 'Director', 'Manager'],
    weight: 30,
    required: false,
  });

  // Service locations as geo rule
  if (provider.service_locations && provider.service_locations.length > 0) {
    rules.push({
      id: 'geo_match',
      name: 'مطابقة المنطقة',
      field: 'company_country',
      operator: 'in',
      value: provider.service_locations,
      weight: 10,
      required: false,
    });
  }

  // Company size based on project size
  let sizeRange: string[] = ['51-200', '201-500', '501-1000']; // Default: Mid-Market
  if (provider.min_project_size && provider.min_project_size >= 100000) {
    sizeRange = ['201-500', '501-1000', '1000+']; // Enterprise
  } else if (provider.max_project_size && provider.max_project_size <= 50000) {
    sizeRange = ['11-50', '51-200']; // SMB
  }

  rules.push({
    id: 'company_size_match',
    name: 'مطابقة حجم الشركة',
    field: 'company_size',
    operator: 'in',
    value: sizeRange,
    weight: 15,
    required: false,
  });

  // Default exclusions
  rules.push({
    id: 'exclude_roles',
    name: 'استبعاد الأدوار',
    field: 'seniority',
    operator: 'not_in',
    value: ['Junior', 'Intern'],
    weight: -10,
    required: false,
  });

  return rules;
};

// ==========================================
// ICP VERIFIER
// ==========================================

export interface ICPVerifyResult {
  icp_status: 'Yes' | 'No' | 'Unknown';
  fit_score: number;
  reasons: string[];
  confidence: number;
  missing_fields: string[];
  matched_rules: string[];
  failed_rules: string[];
}

export const verifyICP = (
  lead: NormalizedLeadObject,
  rules: ICPRule[],
  threshold: number = 60
): ICPVerifyResult => {
  const reasons: string[] = [];
  const missing_fields: string[] = [];
  const matched_rules: string[] = [];
  const failed_rules: string[] = [];

  let totalWeight = 0;
  let earnedWeight = 0;
  let requiredFieldsMissing = false;

  // Check each rule
  for (const rule of rules) {
    const fieldValue = (lead as any)[rule.field];

    // Check if required field is missing
    if (rule.required && (fieldValue === null || fieldValue === undefined || fieldValue === '')) {
      requiredFieldsMissing = true;
      missing_fields.push(rule.field);
      reasons.push(`${rule.name}: حقل مطلوب مفقود`);
      continue;
    }

    // Skip if field is missing (non-required)
    if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
      continue;
    }

    // Calculate positive weights only for total
    if (rule.weight > 0) {
      totalWeight += rule.weight;
    }

    // Evaluate rule
    const matches = evaluateRule(fieldValue, rule);

    if (matches) {
      if (rule.weight > 0) {
        earnedWeight += rule.weight;
        matched_rules.push(rule.id);
        reasons.push(`✓ ${rule.name}`);
      } else {
        // Negative rule matched = bad
        earnedWeight += rule.weight; // Subtract
        failed_rules.push(rule.id);
        reasons.push(`✗ ${rule.name}: إشارة سلبية`);
      }
    } else {
      if (rule.weight > 0) {
        failed_rules.push(rule.id);
        reasons.push(`✗ ${rule.name}: لا يطابق`);
      }
    }
  }

  // Calculate score
  const fit_score = totalWeight > 0 ? Math.max(0, Math.min(100, Math.round((earnedWeight / totalWeight) * 100))) : 0;

  // Calculate confidence based on data completeness
  const keyFields = ['industry_normalized', 'seniority', 'company_size', 'company_country'];
  const filledFields = keyFields.filter(f => (lead as any)[f] !== null && (lead as any)[f] !== undefined);
  const confidence = filledFields.length / keyFields.length;

  // Determine ICP status
  let icp_status: 'Yes' | 'No' | 'Unknown';

  if (requiredFieldsMissing) {
    icp_status = 'Unknown';
    reasons.unshift('⚠️ حقول مطلوبة مفقودة - لا يمكن التحقق');
  } else if (fit_score >= threshold) {
    icp_status = 'Yes';
    reasons.unshift(`✓ ICP مطابق (${fit_score}%)`);
  } else {
    icp_status = 'No';
    reasons.unshift(`✗ ICP غير مطابق (${fit_score}%)`);
  }

  return {
    icp_status,
    fit_score,
    reasons,
    confidence,
    missing_fields,
    matched_rules,
    failed_rules,
  };
};

// Evaluate a single rule
const evaluateRule = (value: any, rule: ICPRule): boolean => {
  const normalizedValue = typeof value === 'string' ? value.toLowerCase() : value;
  const ruleValues = Array.isArray(rule.value)
    ? rule.value.map(v => typeof v === 'string' ? v.toLowerCase() : v)
    : typeof rule.value === 'string' ? rule.value.toLowerCase() : rule.value;

  switch (rule.operator) {
    case 'equals':
      return normalizedValue === ruleValues;

    case 'contains':
      if (Array.isArray(ruleValues)) {
        return ruleValues.some(rv =>
          typeof normalizedValue === 'string' && normalizedValue.includes(rv)
        );
      }
      return typeof normalizedValue === 'string' && normalizedValue.includes(ruleValues);

    case 'in':
      if (Array.isArray(ruleValues)) {
        return ruleValues.includes(normalizedValue);
      }
      return normalizedValue === ruleValues;

    case 'not_in':
      if (Array.isArray(ruleValues)) {
        return !ruleValues.includes(normalizedValue);
      }
      return normalizedValue !== ruleValues;

    case 'regex':
      try {
        const regex = new RegExp(rule.value, 'i');
        return regex.test(String(value));
      } catch {
        return false;
      }

    case 'range':
      if (typeof value === 'number' && Array.isArray(rule.value) && rule.value.length === 2) {
        return value >= rule.value[0] && value <= rule.value[1];
      }
      return false;

    case 'exists':
      return value !== null && value !== undefined && value !== '';

    default:
      return false;
  }
};

// ==========================================
// BATCH ICP VERIFICATION
// ==========================================

export const verifyICPBatch = (
  leads: NormalizedLeadObject[],
  rules: ICPRule[],
  threshold: number = 60
): ICPVerifyResponse => {
  const results = leads.map(lead => {
    const result = verifyICP(lead, rules, threshold);
    return {
      id: lead.id,
      ...result,
    };
  });

  // Calculate summary
  const summary = {
    total: results.length,
    icp_yes: results.filter(r => r.icp_status === 'Yes').length,
    icp_no: results.filter(r => r.icp_status === 'No').length,
    icp_unknown: results.filter(r => r.icp_status === 'Unknown').length,
    avg_fit_score: results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.fit_score, 0) / results.length)
      : 0,
  };

  return { results, summary };
};

// ==========================================
// ICP SCORING ENGINE
// ==========================================

export interface ScoringWeights {
  industry: number;      // Default: 40
  title: number;         // Default: 25
  seniority: number;     // Default: 15
  company_size: number;  // Default: 10
  geo: number;           // Default: 10
}

export interface ScoringResult {
  total_score: number;
  breakdown: {
    field: string;
    score: number;
    max_score: number;
    reason: string;
  }[];
  confidence: number;
  tier: 'VIP' | 'Priority' | 'Standard' | 'Low';
}

export const calculateICPScore = (
  lead: NormalizedLeadObject,
  rules: ICPRule[],
  weights?: Partial<ScoringWeights>
): ScoringResult => {
  const defaultWeights: ScoringWeights = {
    industry: 40,
    title: 25,
    seniority: 15,
    company_size: 10,
    geo: 10,
    ...weights,
  };

  const breakdown: ScoringResult['breakdown'] = [];
  let totalScore = 0;

  // Industry scoring
  const industryRule = rules.find(r => r.id === 'industry_match');
  if (industryRule && lead.industry_normalized) {
    const matches = evaluateRule(lead.industry_normalized, industryRule);
    const score = matches ? defaultWeights.industry : 0;
    totalScore += score;
    breakdown.push({
      field: 'industry',
      score,
      max_score: defaultWeights.industry,
      reason: matches ? 'الصناعة مطابقة' : 'الصناعة غير مطابقة',
    });
  } else if (!lead.industry_normalized) {
    breakdown.push({
      field: 'industry',
      score: 0,
      max_score: defaultWeights.industry,
      reason: 'الصناعة غير محددة',
    });
  }

  // Seniority scoring
  const seniorityScore = getSeniorityScore(lead.seniority, defaultWeights.seniority);
  totalScore += seniorityScore.score;
  breakdown.push({
    field: 'seniority',
    score: seniorityScore.score,
    max_score: defaultWeights.seniority,
    reason: seniorityScore.reason,
  });

  // Title scoring
  const titleRule = rules.find(r => r.id === 'title_match');
  if (titleRule && lead.title_normalized) {
    const matches = evaluateRule(lead.title_normalized, titleRule);
    const score = matches ? defaultWeights.title : Math.round(defaultWeights.title * 0.3);
    totalScore += score;
    breakdown.push({
      field: 'title',
      score,
      max_score: defaultWeights.title,
      reason: matches ? 'المسمى الوظيفي مطابق' : 'المسمى غير مطابق تماماً',
    });
  } else {
    breakdown.push({
      field: 'title',
      score: 0,
      max_score: defaultWeights.title,
      reason: 'المسمى الوظيفي غير محدد',
    });
  }

  // Company size scoring
  const sizeRule = rules.find(r => r.id === 'company_size_match');
  if (sizeRule && lead.company_size) {
    const matches = evaluateRule(lead.company_size, sizeRule);
    const score = matches ? defaultWeights.company_size : 0;
    totalScore += score;
    breakdown.push({
      field: 'company_size',
      score,
      max_score: defaultWeights.company_size,
      reason: matches ? 'حجم الشركة مناسب' : 'حجم الشركة غير مناسب',
    });
  }

  // Geo scoring (GCC bonus)
  if (lead.company_region === 'GCC' || isGCCCountry(lead.company_country)) {
    totalScore += defaultWeights.geo;
    breakdown.push({
      field: 'geo',
      score: defaultWeights.geo,
      max_score: defaultWeights.geo,
      reason: 'منطقة الخليج العربي',
    });
  } else if (lead.company_country) {
    const score = Math.round(defaultWeights.geo * 0.5);
    totalScore += score;
    breakdown.push({
      field: 'geo',
      score,
      max_score: defaultWeights.geo,
      reason: 'منطقة أخرى',
    });
  }

  // Calculate confidence
  const filledFields = breakdown.filter(b => b.score > 0).length;
  const confidence = filledFields / breakdown.length;

  // Apply confidence modifier
  const adjustedScore = Math.round(totalScore * (0.7 + (confidence * 0.3)));

  // Determine tier
  let tier: ScoringResult['tier'];
  if (adjustedScore >= 85) tier = 'VIP';
  else if (adjustedScore >= 70) tier = 'Priority';
  else if (adjustedScore >= 50) tier = 'Standard';
  else tier = 'Low';

  return {
    total_score: adjustedScore,
    breakdown,
    confidence,
    tier,
  };
};

// Helper: Get seniority score
const getSeniorityScore = (seniority: NormalizedLeadObject['seniority'], maxScore: number): { score: number; reason: string } => {
  const seniorityScores: Record<string, number> = {
    'C-Level': 1.0,
    'VP': 0.9,
    'Director': 0.8,
    'Manager': 0.6,
    'Senior': 0.4,
    'Mid': 0.2,
    'Junior': 0.1,
    'Unknown': 0.15,
  };

  const multiplier = seniorityScores[seniority || 'Unknown'] || 0.15;
  const score = Math.round(maxScore * multiplier);

  return {
    score,
    reason: seniority ? `مستوى ${seniority}` : 'المستوى غير محدد',
  };
};

// Helper: Check if country is GCC
const isGCCCountry = (country: string | null): boolean => {
  if (!country) return false;
  const gccNames = ['Saudi Arabia', 'UAE', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
    'السعودية', 'الإمارات', 'قطر', 'الكويت', 'البحرين', 'عمان'];
  return gccNames.some(n => country.toLowerCase().includes(n.toLowerCase()));
};

// ==========================================
// MAIN ICP ENGINE CLASS
// ==========================================

export class ICPEngine {
  private rules: ICPRule[] = [];
  private threshold: number = 60;

  constructor(rules?: ICPRule[], threshold?: number) {
    if (rules) this.rules = rules;
    if (threshold) this.threshold = threshold;
  }

  /**
   * Initialize from Provider Profile
   */
  initFromProvider(provider: ProviderProfile): void {
    this.rules = buildICPRulesFromProvider(provider);
  }

  /**
   * Initialize from ICP Profile
   */
  initFromICPProfile(profile: ICPProfile): void {
    const rules: ICPRule[] = [];

    // Industry rules
    if (profile.targetIndustries && profile.targetIndustries.length > 0) {
      rules.push({
        id: 'industry_match',
        name: 'مطابقة الصناعة',
        field: 'industry_normalized',
        operator: 'in',
        value: profile.targetIndustries.map(String),
        weight: 40,
        required: true,
      });
    }

    // Persona rules
    if (profile.personas) {
      if (profile.personas.titles && profile.personas.titles.length > 0) {
        rules.push({
          id: 'title_match',
          name: 'مطابقة المسمى الوظيفي',
          field: 'title_normalized',
          operator: 'contains',
          value: profile.personas.titles,
          weight: 25,
          required: false,
        });
      }

      if (profile.personas.seniority && profile.personas.seniority.length > 0) {
        rules.push({
          id: 'seniority_match',
          name: 'مطابقة المستوى الوظيفي',
          field: 'seniority',
          operator: 'in',
          value: profile.personas.seniority,
          weight: 15,
          required: false,
        });
      }
    }

    // Company size rules
    if (profile.companySizeMin !== undefined || profile.companySizeMax !== undefined) {
      const sizes: string[] = [];
      for (const [range, data] of Object.entries(COMPANY_SIZE_RANGES)) {
        const min = profile.companySizeMin || 0;
        const max = profile.companySizeMax || Infinity;
        if (data.min >= min && data.max <= max) {
          sizes.push(range);
        }
      }
      if (sizes.length > 0) {
        rules.push({
          id: 'company_size_match',
          name: 'مطابقة حجم الشركة',
          field: 'company_size',
          operator: 'in',
          value: sizes,
          weight: 15,
          required: false,
        });
      }
    }

    // Geo rules
    if (profile.geos && profile.geos.length > 0) {
      rules.push({
        id: 'geo_match',
        name: 'مطابقة المنطقة',
        field: 'company_country',
        operator: 'in',
        value: profile.geos,
        weight: 10,
        required: false,
      });
    }

    // Exclusions
    if (profile.exclusions) {
      if (profile.exclusions.titles && profile.exclusions.titles.length > 0) {
        rules.push({
          id: 'exclude_titles',
          name: 'استبعاد المسميات',
          field: 'title_normalized',
          operator: 'not_in',
          value: profile.exclusions.titles,
          weight: -10,
          required: false,
        });
      }

      if (profile.exclusions.domains && profile.exclusions.domains.length > 0) {
        rules.push({
          id: 'exclude_domains',
          name: 'استبعاد النطاقات',
          field: 'company_domain',
          operator: 'not_in',
          value: profile.exclusions.domains,
          weight: -10,
          required: false,
        });
      }
    }

    this.rules = rules;
  }

  /**
   * Set custom rules
   */
  setRules(rules: ICPRule[]): void {
    this.rules = rules;
  }

  /**
   * Set threshold
   */
  setThreshold(threshold: number): void {
    this.threshold = threshold;
  }

  /**
   * Verify single lead
   */
  verify(lead: NormalizedLeadObject): ICPVerifyResult {
    return verifyICP(lead, this.rules, this.threshold);
  }

  /**
   * Verify batch of leads
   */
  verifyBatch(leads: NormalizedLeadObject[]): ICPVerifyResponse {
    return verifyICPBatch(leads, this.rules, this.threshold);
  }

  /**
   * Score single lead
   */
  score(lead: NormalizedLeadObject, weights?: Partial<ScoringWeights>): ScoringResult {
    return calculateICPScore(lead, this.rules, weights);
  }

  /**
   * Get current rules
   */
  getRules(): ICPRule[] {
    return this.rules;
  }
}

// ==========================================
// EXPORT SINGLETON
// ==========================================

let icpEngineInstance: ICPEngine | null = null;

export const getICPEngine = (rules?: ICPRule[], threshold?: number): ICPEngine => {
  if (!icpEngineInstance || rules || threshold) {
    icpEngineInstance = new ICPEngine(rules, threshold);
  }
  return icpEngineInstance;
};

export default ICPEngine;
