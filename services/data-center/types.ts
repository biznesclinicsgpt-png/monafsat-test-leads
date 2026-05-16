/**
 * Data Center Core Types
 * Canonical Pipeline Types for GTM Engineering
 */

// ==========================================
// NORMALIZED LEAD OBJECT - الكائن الموحد
// ==========================================

export interface NormalizedLeadObject {
  // === Identity ===
  id: string;
  identity_hash: string;  // SHA256(email || linkedin_url || phone_e164 || domain+name)

  // === Person Fields (normalized) ===
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;

  // Contact Info
  email: string | null;           // lowercase + trimmed
  email_status: 'valid' | 'invalid' | 'risky' | 'unknown' | null;
  email_confidence: number | null; // 0-100

  phone: string | null;           // E.164 format
  phone_status: 'valid' | 'invalid' | 'unknown' | null;

  linkedin_url: string | null;
  linkedin_id: string | null;

  // === Title Normalization ===
  title_raw: string | null;
  title_normalized: string | null; // VP / Head / Manager / Director
  seniority: 'C-Level' | 'VP' | 'Director' | 'Manager' | 'Senior' | 'Mid' | 'Junior' | 'Unknown' | null;
  seniority_level: string | null;  // Alias for seniority (for compatibility)
  department: string | null;

  // === Company Fields ===
  company_name: string | null;
  company_name_normalized: string | null;
  company_domain: string | null;
  company_linkedin: string | null;
  industry: string | null;
  industry_normalized: string | null;
  sub_industry: string | null;
  company_size: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+' | null;
  company_size_raw: number | null;
  company_region: string | null;
  company_country: string | null;

  // === Location (Person-level) ===
  country: string | null;
  city: string | null;
  region: string | null;

  // === ICP Fields ===
  icp_status: 'Yes' | 'No' | 'Unknown' | null;
  icp_fit_score: number | null;   // 0-100
  icp_tier: 'VIP' | 'Priority' | 'Standard' | 'Low' | null;  // Based on score
  icp_reasons: string[];
  icp_confidence: number | null;  // 0.7-1.0
  icp_missing_fields: string[];

  // === Pipeline Status ===
  pipeline_stage: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  stage_status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  stage_error: string | null;

  // === Enrichment Tracking ===
  enrichment_sources: string[];  // ['apollo', 'hunter', 'prospeo']
  enrichment_cost: number;
  last_enriched_at: string | null;
  enrichment_attempts: number;

  // === Source Tracking ===
  source_type: 'master_db' | 'csv_upload' | 'external_pull' | 'api';
  source_name: string | null;
  source_file_name: string | null;
  source_row_number: number | null;
  imported_at: string;

  // === Raw Data ===
  raw_data: Record<string, any>;

  // === AI Processing ===
  ai_processed: boolean;
  ai_confidence: number | null;
  ai_suggestions: AISuggestion[];

  // === Validation ===
  validation_errors: ValidationError[];
  validation_warnings: ValidationWarning[];
  is_valid: boolean;

  // === Metadata ===
  created_at: string;
  updated_at: string;
  created_by: string | null;
  tags: string[];
}

// ==========================================
// AI SUGGESTIONS
// ==========================================

export interface AISuggestion {
  field: string;
  original_value: any;
  suggested_value: any;
  confidence: number;
  reason: string;
  accepted: boolean | null;
}

// ==========================================
// VALIDATION TYPES
// ==========================================

export interface ValidationError {
  field: string;
  value: any;
  rule: string;
  message: string;
  message_ar: string;
}

export interface ValidationWarning {
  field: string;
  value: any;
  rule: string;
  message: string;
  message_ar: string;
}

// ==========================================
// INGEST REQUEST/RESPONSE
// ==========================================

export interface IngestRequest {
  source_type: 'csv_upload' | 'external_pull' | 'api' | 'master_db';
  source_name?: string;
  file_name?: string;

  // Raw records to ingest
  records: Record<string, any>[];

  // Field mapping (optional - AI will suggest if not provided)
  field_mapping?: Record<string, string>;

  // Options
  options?: {
    skip_ai_normalization?: boolean;
    skip_dedup?: boolean;
    auto_enrich_missing?: boolean;
    icp_profile_id?: string;
  };
}

export interface IngestResponse {
  job_id: string;
  status: 'accepted' | 'processing' | 'completed' | 'failed';

  total_records: number;
  processed_records: number;

  // Field mapping results
  field_mapping: {
    detected: Record<string, string>;
    confidence: Record<string, number>;
    unmapped: string[];
  };

  // Dedup results
  dedup: {
    unique_records: number;
    duplicate_records: number;
    merge_candidates: Array<{
      identity_hash: string;
      records: string[];
      confidence: number;
    }>;
  };

  // Validation summary
  validation: {
    valid_records: number;
    invalid_records: number;
    warnings_count: number;
    top_errors: Array<{ rule: string; count: number }>;
  };

  // Output
  normalized_records?: NormalizedLeadObject[];
  errors?: string[];
}

// ==========================================
// NORMALIZE REQUEST/RESPONSE
// ==========================================

export interface NormalizeRequest {
  records: Array<{
    id?: string;
    raw_data: Record<string, any>;
  }>;

  field_mapping?: Record<string, string>;

  options?: {
    use_ai?: boolean;
    strict_validation?: boolean;
    generate_identity_hash?: boolean;
  };
}

export interface NormalizeResponse {
  status: 'success' | 'partial' | 'failed';

  results: Array<{
    id: string;
    status: 'normalized' | 'failed';
    normalized?: NormalizedLeadObject;
    errors?: ValidationError[];
    ai_suggestions?: AISuggestion[];
  }>;

  summary: {
    total: number;
    normalized: number;
    failed: number;
    ai_applied: number;
  };
}

// ==========================================
// ICP VERIFICATION
// ==========================================

export interface ICPRule {
  id: string;
  name: string;
  field: string;
  operator: 'equals' | 'contains' | 'in' | 'not_in' | 'regex' | 'range' | 'exists';
  value: any;
  weight: number;  // 0-100, contribution to fit score
  required: boolean;  // If true and missing, ICP = Unknown
}

export interface ICPVerifyRequest {
  records: NormalizedLeadObject[];
  icp_profile_id?: string;
  rules?: ICPRule[];
  threshold?: number;  // Default 60
}

export interface ICPVerifyResponse {
  results: Array<{
    id: string;
    icp_status: 'Yes' | 'No' | 'Unknown';
    fit_score: number;
    reasons: string[];
    confidence: number;
    missing_fields: string[];
    matched_rules: string[];
    failed_rules: string[];
  }>;

  summary: {
    total: number;
    icp_yes: number;
    icp_no: number;
    icp_unknown: number;
    avg_fit_score: number;
  };
}

// ==========================================
// FIELD MAPPING TYPES
// ==========================================

export const CANONICAL_FIELDS = {
  // Person
  first_name: { type: 'string', aliases: ['First Name', 'firstName', 'first_name', 'الاسم الأول'] },
  last_name: { type: 'string', aliases: ['Last Name', 'lastName', 'last_name', 'الاسم الأخير'] },
  full_name: { type: 'string', aliases: ['Full Name', 'Name', 'fullName', 'name', 'الاسم الكامل'] },
  email: { type: 'email', aliases: ['Email', 'email', 'Work Email', 'البريد الإلكتروني'] },
  phone: { type: 'phone', aliases: ['Phone', 'phone', 'Mobile', 'رقم الهاتف', 'الجوال'] },
  linkedin_url: { type: 'url', aliases: ['LinkedIn', 'LinkedIn URL', 'linkedin_url', 'لينكد إن'] },
  title: { type: 'string', aliases: ['Title', 'Job Title', 'title', 'المسمى الوظيفي'] },

  // Company
  company_name: { type: 'string', aliases: ['Company', 'Company Name', 'company_name', 'الشركة'] },
  company_domain: { type: 'domain', aliases: ['Domain', 'Website', 'company_domain', 'الموقع'] },
  industry: { type: 'string', aliases: ['Industry', 'industry', 'الصناعة', 'القطاع'] },
  company_size: { type: 'number', aliases: ['Employees', 'Company Size', 'حجم الشركة'] },

  // Location
  country: { type: 'string', aliases: ['Country', 'country', 'الدولة'] },
  city: { type: 'string', aliases: ['City', 'city', 'المدينة'] },
  region: { type: 'string', aliases: ['Region', 'State', 'المنطقة'] },
} as const;

export type CanonicalField = keyof typeof CANONICAL_FIELDS;

// ==========================================
// SENIORITY MAPPING
// ==========================================

export const SENIORITY_PATTERNS = {
  'C-Level': /\b(ceo|cto|cfo|coo|cmo|cio|cpo|chief|president|رئيس|مدير عام)\b/i,
  'VP': /\b(vp|vice president|svp|evp|نائب الرئيس)\b/i,
  'Director': /\b(director|head of|مدير|رئيس قسم)\b/i,
  'Manager': /\b(manager|lead|supervisor|مشرف|قائد فريق)\b/i,
  'Senior': /\b(senior|sr\.?|principal|staff|أول|خبير)\b/i,
  'Mid': /\b(specialist|analyst|engineer|consultant|متخصص|محلل|مهندس)\b/i,
  'Junior': /\b(junior|jr\.?|associate|intern|trainee|entry|مبتدئ|متدرب)\b/i,
} as const;

// ==========================================
// INDUSTRY TAXONOMY (KSA/GCC Focus)
// ==========================================

export const INDUSTRY_TAXONOMY = {
  'technology': { ar: 'التقنية', aliases: ['tech', 'software', 'it', 'تقنية', 'برمجيات'] },
  'construction': { ar: 'البناء والمقاولات', aliases: ['building', 'مقاولات', 'بناء', 'تشييد'] },
  'healthcare': { ar: 'الرعاية الصحية', aliases: ['medical', 'health', 'صحة', 'طب'] },
  'finance': { ar: 'المالية', aliases: ['banking', 'financial', 'بنوك', 'مالية'] },
  'retail': { ar: 'التجزئة', aliases: ['ecommerce', 'commerce', 'تجارة', 'بيع'] },
  'manufacturing': { ar: 'التصنيع', aliases: ['production', 'صناعة', 'إنتاج'] },
  'energy': { ar: 'الطاقة', aliases: ['oil', 'gas', 'نفط', 'غاز', 'طاقة'] },
  'real_estate': { ar: 'العقارات', aliases: ['property', 'عقارات', 'تطوير عقاري'] },
  'education': { ar: 'التعليم', aliases: ['training', 'تعليم', 'تدريب'] },
  'hospitality': { ar: 'الضيافة', aliases: ['tourism', 'سياحة', 'فنادق'] },
  'logistics': { ar: 'اللوجستيات', aliases: ['transportation', 'نقل', 'شحن'] },
  'consulting': { ar: 'الاستشارات', aliases: ['advisory', 'استشارات'] },
} as const;

// ==========================================
// COMPANY SIZE RANGES
// ==========================================

export const COMPANY_SIZE_RANGES = {
  '1-10': { min: 1, max: 10, label: 'Micro', label_ar: 'صغيرة جداً' },
  '11-50': { min: 11, max: 50, label: 'Small', label_ar: 'صغيرة' },
  '51-200': { min: 51, max: 200, label: 'Medium', label_ar: 'متوسطة' },
  '201-500': { min: 201, max: 500, label: 'Mid-Market', label_ar: 'متوسطة-كبيرة' },
  '501-1000': { min: 501, max: 1000, label: 'Large', label_ar: 'كبيرة' },
  '1000+': { min: 1001, max: Infinity, label: 'Enterprise', label_ar: 'مؤسسة كبرى' },
} as const;

// ==========================================
// GCC REGIONS
// ==========================================

export const GCC_REGIONS = {
  'SA': { name: 'Saudi Arabia', ar: 'المملكة العربية السعودية', cities: ['Riyadh', 'Jeddah', 'Dammam', 'Khobar'] },
  'AE': { name: 'UAE', ar: 'الإمارات', cities: ['Dubai', 'Abu Dhabi', 'Sharjah'] },
  'QA': { name: 'Qatar', ar: 'قطر', cities: ['Doha'] },
  'KW': { name: 'Kuwait', ar: 'الكويت', cities: ['Kuwait City'] },
  'BH': { name: 'Bahrain', ar: 'البحرين', cities: ['Manama'] },
  'OM': { name: 'Oman', ar: 'عمان', cities: ['Muscat'] },
} as const;

export type GCCCountryCode = keyof typeof GCC_REGIONS;
