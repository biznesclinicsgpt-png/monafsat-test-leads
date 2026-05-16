/**
 * Data Center Services - Index
 *
 * Complete GTM Pipeline (Stages 0-6)
 *
 * Stage 0: Sources (CSV, Apollo, Master DB)
 * Stage 1: Ingest → Normalize (AI-assisted with hard validation)
 * Stage 2: Optional Pre-ICP Enrichment (AI Agents)
 * Stage 3: ICP Verify Gate (Yes/No/Unknown)
 * Stage 4: ICP Fit Scoring (0-100)
 * Stage 5: Conditional Contactability (Email/Phone)
 * Stage 6: Campaign Prep & Export
 */

// Types
export * from './types';

// Validators (Stage 1)
export * from './validators';

// Normalizer (Stage 1)
export { Normalizer, getNormalizer } from './normalizer';
export type { NormalizerOptions, NormalizationResult } from './normalizer';

// ICP Engine (Stages 3-4)
export { ICPEngine, getICPEngine, verifyICP, verifyICPBatch, calculateICPScore, buildICPRulesFromProvider } from './icpEngine';
export type { ICPVerifyResult, ScoringWeights, ScoringResult } from './icpEngine';

// AI Agents (Stage 2 + Stage 5)
export * from './agents';

// Campaign Prep (Stage 6)
export * from './campaign';
