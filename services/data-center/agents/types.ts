/**
 * AI Agents Types
 *
 * Stage 2: AI Agents Enrichment (Orchestrated)
 * - Agents do targeted enrichment only + gated
 * - Each Agent has: defined inputs + fixed output schema + confidence + source
 */

import { NormalizedLeadObject } from '../types';

// ==========================================
// AGENT BASE TYPES
// ==========================================

export type AgentType =
  | 'person_enrichment'
  | 'company_enrichment'
  | 'email_finder'
  | 'phone_finder'
  | 'linkedin_resolver'
  | 'title_normalizer'
  | 'industry_classifier';

export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed' | 'skipped';

export interface AgentConfig {
  id: string;
  type: AgentType;
  name: string;
  name_ar: string;
  description: string;

  // Provider settings
  providers: string[];  // e.g., ['apollo', 'hunter', 'prospeo']
  fallback_enabled: boolean;

  // Cost control
  max_cost_per_record: number;  // in credits
  max_total_cost: number;

  // Gating conditions
  run_conditions: AgentCondition[];
  skip_conditions: AgentCondition[];

  // Rate limiting
  rate_limit_per_minute: number;
  delay_between_calls_ms: number;
}

export interface AgentCondition {
  field: string;
  operator: 'exists' | 'not_exists' | 'equals' | 'not_equals' | 'in' | 'not_in' | 'gt' | 'lt';
  value?: any;
}

// ==========================================
// AGENT INPUT/OUTPUT
// ==========================================

export interface AgentInput {
  record: NormalizedLeadObject;
  priority: 'high' | 'normal' | 'low';
  max_cost?: number;
  providers?: string[];  // Override default providers
}

export interface AgentOutput {
  agent_id: string;
  agent_type: AgentType;
  status: AgentStatus;

  // Results
  enriched_fields: Record<string, any>;
  confidence: Record<string, number>;  // field -> confidence (0-100)

  // Source tracking
  provider_used: string | null;
  providers_tried: string[];

  // Cost tracking
  credits_used: number;
  api_calls_made: number;

  // Timing
  started_at: string;
  completed_at: string;
  duration_ms: number;

  // Errors
  error?: string;
  error_code?: string;
}

// ==========================================
// PERSON ENRICHMENT AGENT
// ==========================================

export interface PersonEnrichmentInput {
  // Required: at least one identifier
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  linkedin_url?: string;

  // Company context (helps matching)
  company_name?: string;
  company_domain?: string;
}

export interface PersonEnrichmentOutput {
  // Identity
  first_name?: string;
  last_name?: string;
  full_name?: string;

  // Contact
  email?: string;
  email_status?: 'valid' | 'invalid' | 'risky' | 'unknown';
  phone?: string;
  linkedin_url?: string;
  linkedin_id?: string;

  // Professional
  title?: string;
  seniority?: string;
  department?: string;

  // Location
  city?: string;
  state?: string;
  country?: string;

  // Employment history
  current_company?: string;
  current_company_linkedin?: string;
  employment_history?: Array<{
    company: string;
    title: string;
    start_date?: string;
    end_date?: string;
    is_current: boolean;
  }>;

  // Social
  twitter_url?: string;

  // Meta
  photo_url?: string;
  last_updated?: string;
}

// ==========================================
// COMPANY ENRICHMENT AGENT
// ==========================================

export interface CompanyEnrichmentInput {
  // Required: at least one identifier
  company_name?: string;
  company_domain?: string;
  company_linkedin?: string;
}

export interface CompanyEnrichmentOutput {
  // Identity
  company_name?: string;
  company_name_legal?: string;
  company_domain?: string;
  company_linkedin?: string;

  // Classification
  industry?: string;
  sub_industry?: string;
  sic_codes?: string[];
  naics_codes?: string[];

  // Size
  employee_count?: number;
  employee_range?: string;
  annual_revenue?: string;

  // Location
  headquarters_city?: string;
  headquarters_country?: string;
  address?: string;

  // Company info
  founded_year?: number;
  company_type?: string;  // public, private, nonprofit
  description?: string;

  // Funding (if available)
  total_funding?: string;
  latest_funding_round?: string;
  latest_funding_date?: string;

  // Tech stack
  technologies?: string[];

  // Social
  twitter_url?: string;
  facebook_url?: string;

  // Meta
  logo_url?: string;
  website_url?: string;
  phone?: string;
}

// ==========================================
// EMAIL FINDER AGENT
// ==========================================

export interface EmailFinderInput {
  first_name: string;
  last_name: string;
  company_domain: string;

  // Optional hints
  linkedin_url?: string;
  title?: string;
}

export interface EmailFinderOutput {
  email?: string;
  email_status: 'valid' | 'invalid' | 'risky' | 'catch_all' | 'unknown';
  email_confidence: number;  // 0-100
  email_type?: 'professional' | 'personal' | 'generic';

  // Alternative emails found
  alternative_emails?: Array<{
    email: string;
    confidence: number;
    type: string;
  }>;

  // Verification details
  mx_found?: boolean;
  smtp_valid?: boolean;
  catch_all_domain?: boolean;
}

// ==========================================
// PHONE FINDER AGENT
// ==========================================

export interface PhoneFinderInput {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  linkedin_url?: string;
  company_name?: string;
  company_domain?: string;
}

export interface PhoneFinderOutput {
  phone?: string;
  phone_type: 'mobile' | 'direct' | 'company' | 'unknown';
  phone_status: 'valid' | 'invalid' | 'unknown';
  phone_confidence: number;  // 0-100

  // E.164 format
  phone_e164?: string;
  country_code?: string;

  // Additional phones
  alternative_phones?: Array<{
    phone: string;
    type: string;
    confidence: number;
  }>;
}

// ==========================================
// LINKEDIN RESOLVER AGENT
// ==========================================

export interface LinkedInResolverInput {
  first_name: string;
  last_name: string;
  company_name?: string;
  company_domain?: string;
  title?: string;
}

export interface LinkedInResolverOutput {
  linkedin_url?: string;
  linkedin_id?: string;
  linkedin_headline?: string;
  linkedin_connections?: number;
  profile_match_confidence: number;  // 0-100

  // Profile data if available
  profile_summary?: string;
  skills?: string[];
}

// ==========================================
// ORCHESTRATOR TYPES
// ==========================================

export interface OrchestrationPlan {
  record_id: string;

  // Agents to run in order
  agents_to_run: Array<{
    agent_type: AgentType;
    reason: string;
    priority: 'high' | 'normal' | 'low';
    estimated_cost: number;
  }>;

  // Agents skipped
  agents_skipped: Array<{
    agent_type: AgentType;
    reason: string;
  }>;

  // Total estimated cost
  total_estimated_cost: number;

  // Fields that will be enriched
  fields_to_enrich: string[];

  // Gate check result
  passes_icp_gate_after: boolean;
}

export interface OrchestrationResult {
  record_id: string;
  original_record: NormalizedLeadObject;
  enriched_record: NormalizedLeadObject;

  // Agent results
  agent_results: AgentOutput[];

  // Summary
  total_credits_used: number;
  total_api_calls: number;
  total_duration_ms: number;

  // Fields changed
  fields_enriched: string[];
  fields_failed: string[];

  // Status
  status: 'success' | 'partial' | 'failed';
  ready_for_icp: boolean;
}

// ==========================================
// PROVIDER TYPES
// ==========================================

export interface ProviderConfig {
  id: string;
  name: string;
  type: 'person' | 'company' | 'email' | 'phone' | 'linkedin';

  // API config
  api_key_env: string;  // Environment variable name
  base_url?: string;

  // Capabilities
  capabilities: {
    person_search: boolean;
    company_search: boolean;
    email_finder: boolean;
    email_verifier: boolean;
    phone_finder: boolean;
    linkedin_resolver: boolean;
  };

  // Cost
  cost_per_person_search: number;
  cost_per_company_search: number;
  cost_per_email_find: number;
  cost_per_phone_find: number;

  // Limits
  rate_limit_per_minute: number;
  daily_limit: number;

  // Priority in waterfall
  priority: number;  // Lower = higher priority

  // Health
  is_active: boolean;
  last_success_at?: string;
  error_rate?: number;
}

// Default provider configurations
export const DEFAULT_PROVIDERS: ProviderConfig[] = [
  {
    id: 'apollo',
    name: 'Apollo.io',
    type: 'person',
    api_key_env: 'APOLLO_API_KEY',
    capabilities: {
      person_search: true,
      company_search: true,
      email_finder: true,
      email_verifier: false,
      phone_finder: false,
      linkedin_resolver: true,
    },
    cost_per_person_search: 0,  // Free tier
    cost_per_company_search: 0,
    cost_per_email_find: 1,
    cost_per_phone_find: 0,
    rate_limit_per_minute: 100,
    daily_limit: 10000,
    priority: 1,
    is_active: true,
  },
  {
    id: 'hunter',
    name: 'Hunter.io',
    type: 'email',
    api_key_env: 'HUNTER_API_KEY',
    capabilities: {
      person_search: false,
      company_search: false,
      email_finder: true,
      email_verifier: true,
      phone_finder: false,
      linkedin_resolver: false,
    },
    cost_per_person_search: 0,
    cost_per_company_search: 0,
    cost_per_email_find: 1,
    cost_per_phone_find: 0,
    rate_limit_per_minute: 30,
    daily_limit: 500,
    priority: 2,
    is_active: true,
  },
  {
    id: 'prospeo',
    name: 'Prospeo',
    type: 'phone',
    api_key_env: 'PROSPEO_API_KEY',
    capabilities: {
      person_search: true,
      company_search: false,
      email_finder: true,
      email_verifier: true,
      phone_finder: true,
      linkedin_resolver: true,
    },
    cost_per_person_search: 1,
    cost_per_company_search: 0,
    cost_per_email_find: 1,
    cost_per_phone_find: 10,
    rate_limit_per_minute: 60,
    daily_limit: 1000,
    priority: 3,
    is_active: true,
  },
];
