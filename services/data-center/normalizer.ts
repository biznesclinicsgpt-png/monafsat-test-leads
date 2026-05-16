/**
 * AI-Assisted Normalizer
 *
 * AI Prompt Module يشتغل كـ "Normalizer + Mapper + Cleaner"
 * لكن الإخراج لازم يعدّي على Rules/Validators (Regex/Enums/Hard checks)
 * يعني: AI يجهز/يستنتج، والـ system يثبت/يرفض/يعلّم Unknown
 */

import {
  NormalizedLeadObject,
  AISuggestion,
  ValidationError,
  ValidationWarning,
  CANONICAL_FIELDS,
  CanonicalField,
} from './types';
import {
  validateRecord,
  generateIdentityHash,
  generateDedupKey,
} from './validators';

// ==========================================
// AI FIELD MAPPING PROMPT
// ==========================================

const FIELD_MAPPING_PROMPT = `You are a data field mapper for a B2B lead management system.

Given a list of source column names, map them to the canonical fields below.
Return a JSON object where keys are canonical field names and values are the source column names.

CANONICAL FIELDS:
- first_name: Person's first name
- last_name: Person's last name
- full_name: Person's full name
- email: Business email address
- phone: Phone number (mobile preferred)
- linkedin_url: LinkedIn profile URL
- title: Job title / position
- company_name: Company/Organization name
- company_domain: Company website domain
- company_linkedin: Company LinkedIn URL
- industry: Business industry/sector
- company_size: Number of employees
- country: Country
- city: City
- region: Region/State

RULES:
1. Only map if confident (>80%)
2. Return empty string for fields you can't map
3. Handle Arabic column names
4. Prefer specific mappings over generic ones

SOURCE COLUMNS:
{columns}

Return ONLY valid JSON, no explanation.`;

// ==========================================
// AI NORMALIZATION PROMPT
// ==========================================

const NORMALIZATION_PROMPT = `You are a data normalizer for B2B leads in the KSA/GCC market.

Given raw data, suggest normalized values for these fields:
- title_normalized: Standardize job title (CEO, VP, Director, Manager, etc.)
- seniority: C-Level | VP | Director | Manager | Senior | Mid | Junior
- department: Engineering | Sales | Marketing | HR | Finance | Operations | Product | Executive
- industry_normalized: Standardize to: technology | construction | healthcare | finance | retail | manufacturing | energy | real_estate | education | hospitality | logistics | consulting
- company_name_normalized: Clean company name (remove LLC, Inc, etc. from end, fix spacing)

INPUT DATA:
{data}

RULES:
1. Preserve Arabic names as-is
2. For titles, map Arabic equivalents (مدير = Manager, رئيس = Head/Chief)
3. Be conservative - only suggest if confident
4. Return confidence scores (0-100)

Return JSON with structure:
{
  "suggestions": [
    { "field": "...", "original": "...", "suggested": "...", "confidence": 85, "reason": "..." }
  ]
}`;

// ==========================================
// AI SERVICE INTERFACE
// ==========================================

interface AIService {
  generateContent(prompt: string): Promise<string>;
}

// Simple AI service wrapper (can be replaced with actual Gemini/OpenAI)
class AIServiceImpl implements AIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gemini-1.5-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateContent(prompt: string): Promise<string> {
    // In production, this would call actual AI API
    // For now, return empty to fall back to rule-based
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 2000,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      console.warn('AI service error:', error);
      return '';
    }
  }
}

// ==========================================
// RULE-BASED FIELD MAPPER (Fallback)
// ==========================================

const ruleBasedFieldMapping = (columns: string[]): Record<string, string> => {
  const mapping: Record<string, string> = {};

  for (const column of columns) {
    const lowerCol = column.toLowerCase().trim();

    // Check each canonical field
    for (const [field, config] of Object.entries(CANONICAL_FIELDS)) {
      for (const alias of config.aliases) {
        if (lowerCol === alias.toLowerCase() || lowerCol.includes(alias.toLowerCase())) {
          if (!mapping[field]) {
            mapping[field] = column;
          }
          break;
        }
      }
    }
  }

  return mapping;
};

// ==========================================
// RULE-BASED NORMALIZER (Fallback)
// ==========================================

const ruleBasedNormalization = (data: Record<string, any>): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];

  // Title normalization
  const title = data.title || data.Title || data['Job Title'] || data['المسمى الوظيفي'];
  if (title) {
    const titleLower = title.toLowerCase();

    // Seniority detection
    let seniority = 'Unknown';
    if (/\b(ceo|cto|cfo|coo|chief|رئيس مجلس|مدير عام)\b/i.test(titleLower)) {
      seniority = 'C-Level';
    } else if (/\b(vp|vice president|نائب)\b/i.test(titleLower)) {
      seniority = 'VP';
    } else if (/\b(director|head of|مدير|رئيس قسم)\b/i.test(titleLower)) {
      seniority = 'Director';
    } else if (/\b(manager|lead|supervisor|مشرف)\b/i.test(titleLower)) {
      seniority = 'Manager';
    } else if (/\b(senior|sr\.|أول|خبير)\b/i.test(titleLower)) {
      seniority = 'Senior';
    } else if (/\b(junior|jr\.|intern|متدرب)\b/i.test(titleLower)) {
      seniority = 'Junior';
    } else {
      seniority = 'Mid';
    }

    suggestions.push({
      field: 'seniority',
      original_value: title,
      suggested_value: seniority,
      confidence: 75,
      reason: 'Rule-based title analysis',
      accepted: null,
    });

    // Department detection
    let department = null;
    if (/\b(engineer|developer|tech|تقني|مهندس)\b/i.test(titleLower)) {
      department = 'Engineering';
    } else if (/\b(sales|مبيعات)\b/i.test(titleLower)) {
      department = 'Sales';
    } else if (/\b(market|تسويق)\b/i.test(titleLower)) {
      department = 'Marketing';
    } else if (/\b(hr|human|موارد)\b/i.test(titleLower)) {
      department = 'HR';
    } else if (/\b(finance|مالي|محاسب)\b/i.test(titleLower)) {
      department = 'Finance';
    }

    if (department) {
      suggestions.push({
        field: 'department',
        original_value: title,
        suggested_value: department,
        confidence: 70,
        reason: 'Rule-based department detection',
        accepted: null,
      });
    }
  }

  // Industry normalization
  const industry = data.industry || data.Industry || data['الصناعة'] || data['القطاع'];
  if (industry) {
    const industryLower = industry.toLowerCase();
    const industryMap: Record<string, string[]> = {
      'technology': ['tech', 'software', 'it', 'تقنية', 'برمجيات', 'تكنولوجيا'],
      'construction': ['construction', 'building', 'مقاولات', 'بناء', 'تشييد'],
      'healthcare': ['health', 'medical', 'hospital', 'صحة', 'طب', 'مستشفى'],
      'finance': ['finance', 'banking', 'bank', 'مالية', 'بنك', 'مصرف'],
      'retail': ['retail', 'ecommerce', 'تجزئة', 'تجارة'],
      'energy': ['energy', 'oil', 'gas', 'طاقة', 'نفط', 'غاز', 'بترول'],
      'real_estate': ['real estate', 'property', 'عقار', 'عقارات'],
      'consulting': ['consulting', 'advisory', 'استشار'],
    };

    for (const [normalized, keywords] of Object.entries(industryMap)) {
      if (keywords.some(k => industryLower.includes(k))) {
        suggestions.push({
          field: 'industry_normalized',
          original_value: industry,
          suggested_value: normalized,
          confidence: 80,
          reason: 'Rule-based industry matching',
          accepted: null,
        });
        break;
      }
    }
  }

  return suggestions;
};

// ==========================================
// MAIN NORMALIZER CLASS
// ==========================================

export interface NormalizerOptions {
  useAI?: boolean;
  aiApiKey?: string;
  strictValidation?: boolean;
  autoAcceptHighConfidence?: boolean;
  confidenceThreshold?: number;
}

export interface NormalizationResult {
  id: string;
  status: 'success' | 'partial' | 'failed';
  normalized: NormalizedLeadObject;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  ai_suggestions: AISuggestion[];
  dedup_key: string | null;
}

export class Normalizer {
  private aiService: AIService | null = null;
  private options: NormalizerOptions;

  constructor(options: NormalizerOptions = {}) {
    this.options = {
      useAI: options.useAI ?? true,
      strictValidation: options.strictValidation ?? false,
      autoAcceptHighConfidence: options.autoAcceptHighConfidence ?? true,
      confidenceThreshold: options.confidenceThreshold ?? 85,
      ...options,
    };

    if (this.options.useAI && this.options.aiApiKey) {
      this.aiService = new AIServiceImpl(this.options.aiApiKey);
    }
  }

  /**
   * Detect field mapping from source columns
   */
  async detectFieldMapping(columns: string[]): Promise<{
    mapping: Record<string, string>;
    confidence: Record<string, number>;
    unmapped: string[];
  }> {
    let mapping: Record<string, string> = {};
    const confidence: Record<string, number> = {};

    // Try AI mapping first
    if (this.aiService) {
      try {
        const prompt = FIELD_MAPPING_PROMPT.replace('{columns}', JSON.stringify(columns));
        const response = await this.aiService.generateContent(prompt);

        // Parse AI response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const aiMapping = JSON.parse(jsonMatch[0]);
          for (const [field, sourceCol] of Object.entries(aiMapping)) {
            if (sourceCol && typeof sourceCol === 'string' && sourceCol.trim()) {
              mapping[field] = sourceCol;
              confidence[field] = 90; // AI mapping
            }
          }
        }
      } catch (error) {
        console.warn('AI mapping failed, using rule-based:', error);
      }
    }

    // Fill gaps with rule-based mapping
    const ruleMapping = ruleBasedFieldMapping(columns);
    for (const [field, sourceCol] of Object.entries(ruleMapping)) {
      if (!mapping[field]) {
        mapping[field] = sourceCol;
        confidence[field] = 70; // Rule-based mapping
      }
    }

    // Find unmapped columns
    const mappedCols = new Set(Object.values(mapping));
    const unmapped = columns.filter(c => !mappedCols.has(c));

    return { mapping, confidence, unmapped };
  }

  /**
   * Normalize a single record
   */
  async normalizeRecord(
    raw: Record<string, any>,
    mapping?: Record<string, string>,
    id?: string
  ): Promise<NormalizationResult> {
    const recordId = id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Step 1: Validate using hard rules
    const validation = validateRecord(raw, mapping);

    // Step 2: Get AI suggestions (if enabled)
    let aiSuggestions: AISuggestion[] = [];

    if (this.options.useAI && this.aiService) {
      try {
        const prompt = NORMALIZATION_PROMPT.replace('{data}', JSON.stringify(raw));
        const response = await this.aiService.generateContent(prompt);

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          aiSuggestions = parsed.suggestions || [];
        }
      } catch (error) {
        console.warn('AI normalization failed, using rule-based:', error);
      }
    }

    // Fallback to rule-based suggestions
    if (aiSuggestions.length === 0) {
      aiSuggestions = ruleBasedNormalization(raw);
    }

    // Step 3: Apply high-confidence AI suggestions
    const normalized = { ...validation.normalized } as Partial<NormalizedLeadObject>;

    if (this.options.autoAcceptHighConfidence) {
      for (const suggestion of aiSuggestions) {
        if (suggestion.confidence >= (this.options.confidenceThreshold || 85)) {
          (normalized as any)[suggestion.field] = suggestion.suggested_value;
          suggestion.accepted = true;
        }
      }
    }

    // Step 4: Generate identity hash
    const identityHash = await generateIdentityHash(normalized);
    const dedupKey = generateDedupKey(normalized);

    // Step 5: Build final normalized object
    const now = new Date().toISOString();
    const finalNormalized: NormalizedLeadObject = {
      id: recordId,
      identity_hash: identityHash,

      // Person fields
      first_name: normalized.first_name || null,
      last_name: normalized.last_name || null,
      full_name: normalized.full_name || null,
      email: normalized.email || null,
      email_status: normalized.email ? 'unknown' : null,
      email_confidence: null,
      phone: normalized.phone || null,
      phone_status: normalized.phone ? 'unknown' : null,
      linkedin_url: normalized.linkedin_url || null,
      linkedin_id: normalized.linkedin_id || null,

      // Title
      title_raw: normalized.title_raw || null,
      title_normalized: normalized.title_normalized || null,
      seniority: normalized.seniority || 'Unknown',
      seniority_level: normalized.seniority || 'Unknown',  // Alias for seniority
      department: normalized.department || null,

      // Company
      company_name: normalized.company_name || null,
      company_name_normalized: normalized.company_name_normalized || null,
      company_domain: normalized.company_domain || null,
      company_linkedin: normalized.company_linkedin || null,
      industry: normalized.industry || null,
      industry_normalized: normalized.industry_normalized || null,
      sub_industry: null,
      company_size: normalized.company_size || null,
      company_size_raw: normalized.company_size_raw || null,
      company_region: normalized.company_region || null,
      company_country: normalized.company_country || null,

      // Location (Person-level)
      country: normalized.country || normalized.company_country || null,
      city: normalized.city || null,
      region: normalized.region || normalized.company_region || null,

      // ICP (to be filled later)
      icp_status: null,
      icp_fit_score: null,
      icp_tier: null,  // Based on score
      icp_reasons: [],
      icp_confidence: null,
      icp_missing_fields: [],

      // Pipeline
      pipeline_stage: 1, // Stage 1 = Normalized
      stage_status: validation.valid ? 'completed' : 'failed',
      stage_error: validation.valid ? null : validation.errors.map(e => e.message).join('; '),

      // Enrichment
      enrichment_sources: [],
      enrichment_cost: 0,
      last_enriched_at: null,
      enrichment_attempts: 0,

      // Source
      source_type: 'csv_upload',
      source_name: null,
      source_file_name: null,
      source_row_number: null,
      imported_at: now,

      // Raw
      raw_data: raw,

      // AI
      ai_processed: aiSuggestions.length > 0,
      ai_confidence: aiSuggestions.length > 0
        ? aiSuggestions.reduce((sum, s) => sum + s.confidence, 0) / aiSuggestions.length
        : null,
      ai_suggestions: aiSuggestions,

      // Validation
      validation_errors: validation.errors,
      validation_warnings: validation.warnings,
      is_valid: validation.valid,

      // Metadata
      created_at: now,
      updated_at: now,
      created_by: null,
      tags: [],
    };

    return {
      id: recordId,
      status: validation.valid ? 'success' : (validation.errors.length > 0 ? 'failed' : 'partial'),
      normalized: finalNormalized,
      errors: validation.errors,
      warnings: validation.warnings,
      ai_suggestions: aiSuggestions,
      dedup_key: dedupKey,
    };
  }

  /**
   * Normalize batch of records
   */
  async normalizeBatch(
    records: Array<{ id?: string; raw_data: Record<string, any> }>,
    mapping?: Record<string, string>,
    onProgress?: (current: number, total: number) => void
  ): Promise<{
    results: NormalizationResult[];
    summary: {
      total: number;
      success: number;
      partial: number;
      failed: number;
      duplicates: number;
    };
  }> {
    const results: NormalizationResult[] = [];
    const dedupMap = new Map<string, string[]>();

    let success = 0;
    let partial = 0;
    let failed = 0;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      const result = await this.normalizeRecord(
        record.raw_data,
        mapping,
        record.id
      );

      results.push(result);

      // Track duplicates
      if (result.dedup_key) {
        if (!dedupMap.has(result.dedup_key)) {
          dedupMap.set(result.dedup_key, []);
        }
        dedupMap.get(result.dedup_key)!.push(result.id);
      }

      // Update counts
      if (result.status === 'success') success++;
      else if (result.status === 'partial') partial++;
      else failed++;

      // Progress callback
      if (onProgress) {
        onProgress(i + 1, records.length);
      }

      // Small delay to prevent blocking
      if (i % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    // Count duplicates
    let duplicates = 0;
    for (const ids of dedupMap.values()) {
      if (ids.length > 1) {
        duplicates += ids.length - 1;
      }
    }

    return {
      results,
      summary: {
        total: records.length,
        success,
        partial,
        failed,
        duplicates,
      },
    };
  }
}

// ==========================================
// EXPORT SINGLETON
// ==========================================

let normalizerInstance: Normalizer | null = null;

export const getNormalizer = (options?: NormalizerOptions): Normalizer => {
  if (!normalizerInstance || options) {
    normalizerInstance = new Normalizer(options);
  }
  return normalizerInstance;
};

export default Normalizer;
