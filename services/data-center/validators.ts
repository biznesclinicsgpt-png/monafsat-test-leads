/**
 * Data Center Validators
 * Rules/Validators (Regex/Enums/Hard checks)
 *
 * AI يجهز/يستنتج → System يثبت/يرفض/يعلّم Unknown
 */

import {
  ValidationError,
  ValidationWarning,
  SENIORITY_PATTERNS,
  INDUSTRY_TAXONOMY,
  COMPANY_SIZE_RANGES,
  GCC_REGIONS,
  CANONICAL_FIELDS,
  NormalizedLeadObject,
} from './types';

// ==========================================
// REGEX PATTERNS
// ==========================================

const PATTERNS = {
  // Email validation (strict)
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // Domain validation
  domain: /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,

  // LinkedIn URL patterns
  linkedin_person: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i,
  linkedin_company: /^https?:\/\/(www\.)?linkedin\.com\/company\/[\w-]+\/?$/i,

  // Phone E.164 format (with + prefix)
  phone_e164: /^\+[1-9]\d{6,14}$/,

  // Saudi phone patterns
  phone_saudi: /^(\+966|00966|966)?[0]?(5\d{8})$/,
  phone_saudi_landline: /^(\+966|00966|966)?[0]?(1[1-9]\d{7})$/,

  // URL validation
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,

  // Name validation (letters, spaces, hyphens, Arabic)
  name: /^[a-zA-Z\u0600-\u06FF\u0750-\u077F\s\-'\.]+$/,

  // Company name (letters, numbers, spaces, common chars)
  company_name: /^[a-zA-Z0-9\u0600-\u06FF\u0750-\u077F\s\-&\.'(),]+$/,
};

// ==========================================
// EMAIL VALIDATORS
// ==========================================

export const validateEmail = (email: string | null | undefined): {
  valid: boolean;
  normalized: string | null;
  errors: ValidationError[];
  warnings: ValidationWarning[];
} => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!email || email.trim() === '') {
    return { valid: true, normalized: null, errors, warnings };
  }

  // Normalize: lowercase + trim
  const normalized = email.toLowerCase().trim();

  // Check format
  if (!PATTERNS.email.test(normalized)) {
    errors.push({
      field: 'email',
      value: email,
      rule: 'email_format',
      message: 'Invalid email format',
      message_ar: 'صيغة البريد الإلكتروني غير صحيحة',
    });
    return { valid: false, normalized: null, errors, warnings };
  }

  // Check for personal email domains (warning, not error)
  const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
  const domain = normalized.split('@')[1];
  if (personalDomains.includes(domain)) {
    warnings.push({
      field: 'email',
      value: email,
      rule: 'personal_email',
      message: 'Personal email domain detected - may not be a business contact',
      message_ar: 'تم اكتشاف بريد شخصي - قد لا يكون جهة اتصال عمل',
    });
  }

  // Check for disposable email domains
  const disposableDomains = ['tempmail.com', 'throwaway.com', 'guerrillamail.com', 'mailinator.com'];
  if (disposableDomains.some(d => domain.includes(d))) {
    errors.push({
      field: 'email',
      value: email,
      rule: 'disposable_email',
      message: 'Disposable email domain not allowed',
      message_ar: 'نطاق البريد المؤقت غير مسموح',
    });
    return { valid: false, normalized: null, errors, warnings };
  }

  return { valid: true, normalized, errors, warnings };
};

// ==========================================
// PHONE VALIDATORS
// ==========================================

export const validatePhone = (phone: string | null | undefined): {
  valid: boolean;
  normalized: string | null;
  format: 'e164' | 'saudi' | 'other' | null;
  errors: ValidationError[];
  warnings: ValidationWarning[];
} => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!phone || phone.trim() === '') {
    return { valid: true, normalized: null, format: null, errors, warnings };
  }

  // Remove common separators
  let cleaned = phone.replace(/[\s\-\.\(\)]/g, '');

  // Handle Saudi numbers
  const saudiMatch = cleaned.match(PATTERNS.phone_saudi);
  if (saudiMatch) {
    // Convert to E.164
    const number = saudiMatch[2] || cleaned.replace(/^(\+966|00966|966)?0?/, '');
    const normalized = `+966${number}`;

    if (!PATTERNS.phone_e164.test(normalized)) {
      errors.push({
        field: 'phone',
        value: phone,
        rule: 'phone_format',
        message: 'Invalid Saudi phone number format',
        message_ar: 'صيغة رقم الهاتف السعودي غير صحيحة',
      });
      return { valid: false, normalized: null, format: null, errors, warnings };
    }

    return { valid: true, normalized, format: 'saudi', errors, warnings };
  }

  // Try to parse as E.164
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  if (PATTERNS.phone_e164.test(cleaned)) {
    return { valid: true, normalized: cleaned, format: 'e164', errors, warnings };
  }

  // Invalid format
  warnings.push({
    field: 'phone',
    value: phone,
    rule: 'phone_format_unknown',
    message: 'Could not normalize phone to E.164 format',
    message_ar: 'لم يتم التعرف على صيغة رقم الهاتف',
  });

  return { valid: true, normalized: phone.trim(), format: 'other', errors, warnings };
};

// ==========================================
// LINKEDIN URL VALIDATORS
// ==========================================

export const validateLinkedInUrl = (url: string | null | undefined, type: 'person' | 'company' = 'person'): {
  valid: boolean;
  normalized: string | null;
  linkedin_id: string | null;
  errors: ValidationError[];
  warnings: ValidationWarning[];
} => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!url || url.trim() === '') {
    return { valid: true, normalized: null, linkedin_id: null, errors, warnings };
  }

  const trimmed = url.trim();

  // Try to fix common issues
  let normalized = trimmed;
  if (!normalized.startsWith('http')) {
    normalized = 'https://' + normalized;
  }
  normalized = normalized.replace('http://', 'https://');

  // Validate pattern
  const pattern = type === 'person' ? PATTERNS.linkedin_person : PATTERNS.linkedin_company;

  if (!pattern.test(normalized)) {
    // Try to extract from longer URL
    const match = normalized.match(type === 'person'
      ? /linkedin\.com\/in\/([\w-]+)/i
      : /linkedin\.com\/company\/([\w-]+)/i
    );

    if (match) {
      normalized = `https://www.linkedin.com/${type === 'person' ? 'in' : 'company'}/${match[1]}`;
    } else {
      errors.push({
        field: type === 'person' ? 'linkedin_url' : 'company_linkedin',
        value: url,
        rule: 'linkedin_format',
        message: `Invalid LinkedIn ${type} URL format`,
        message_ar: `صيغة رابط LinkedIn غير صحيحة`,
      });
      return { valid: false, normalized: null, linkedin_id: null, errors, warnings };
    }
  }

  // Extract LinkedIn ID
  const idMatch = normalized.match(type === 'person'
    ? /linkedin\.com\/in\/([\w-]+)/i
    : /linkedin\.com\/company\/([\w-]+)/i
  );
  const linkedin_id = idMatch ? idMatch[1] : null;

  return { valid: true, normalized, linkedin_id, errors, warnings };
};

// ==========================================
// NAME VALIDATORS
// ==========================================

export const validateName = (name: string | null | undefined, field: 'first_name' | 'last_name' | 'full_name'): {
  valid: boolean;
  normalized: string | null;
  errors: ValidationError[];
  warnings: ValidationWarning[];
} => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!name || name.trim() === '') {
    return { valid: true, normalized: null, errors, warnings };
  }

  const trimmed = name.trim();

  // Check for invalid characters
  if (!PATTERNS.name.test(trimmed)) {
    warnings.push({
      field,
      value: name,
      rule: 'name_characters',
      message: 'Name contains unusual characters',
      message_ar: 'الاسم يحتوي على أحرف غير معتادة',
    });
  }

  // Check for suspiciously short names
  if (trimmed.length < 2) {
    warnings.push({
      field,
      value: name,
      rule: 'name_too_short',
      message: 'Name seems too short',
      message_ar: 'الاسم قصير جداً',
    });
  }

  // Normalize: proper case
  const normalized = trimmed
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

  return { valid: true, normalized, errors, warnings };
};

// ==========================================
// COMPANY NAME VALIDATORS
// ==========================================

export const validateCompanyName = (name: string | null | undefined): {
  valid: boolean;
  normalized: string | null;
  errors: ValidationError[];
  warnings: ValidationWarning[];
} => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!name || name.trim() === '') {
    return { valid: true, normalized: null, errors, warnings };
  }

  const trimmed = name.trim();

  // Check for invalid characters
  if (!PATTERNS.company_name.test(trimmed)) {
    warnings.push({
      field: 'company_name',
      value: name,
      rule: 'company_name_characters',
      message: 'Company name contains unusual characters',
      message_ar: 'اسم الشركة يحتوي على أحرف غير معتادة',
    });
  }

  // Normalize: remove extra spaces, standardize common suffixes
  let normalized = trimmed.replace(/\s+/g, ' ');

  // Standardize common suffixes
  const suffixMap: Record<string, string> = {
    'llc': 'LLC',
    'inc': 'Inc.',
    'ltd': 'Ltd.',
    'co': 'Co.',
    'corp': 'Corp.',
    'شركة': 'شركة',
    'مؤسسة': 'مؤسسة',
  };

  for (const [pattern, replacement] of Object.entries(suffixMap)) {
    const regex = new RegExp(`\\b${pattern}\\.?$`, 'i');
    normalized = normalized.replace(regex, replacement);
  }

  return { valid: true, normalized, errors, warnings };
};

// ==========================================
// DOMAIN VALIDATORS
// ==========================================

export const validateDomain = (domain: string | null | undefined): {
  valid: boolean;
  normalized: string | null;
  errors: ValidationError[];
  warnings: ValidationWarning[];
} => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!domain || domain.trim() === '') {
    return { valid: true, normalized: null, errors, warnings };
  }

  // Extract domain from URL if needed
  let normalized = domain.trim().toLowerCase();

  // Remove protocol
  normalized = normalized.replace(/^https?:\/\//, '');

  // Remove www
  normalized = normalized.replace(/^www\./, '');

  // Remove path
  normalized = normalized.split('/')[0];

  // Validate
  if (!PATTERNS.domain.test(normalized)) {
    errors.push({
      field: 'company_domain',
      value: domain,
      rule: 'domain_format',
      message: 'Invalid domain format',
      message_ar: 'صيغة النطاق غير صحيحة',
    });
    return { valid: false, normalized: null, errors, warnings };
  }

  return { valid: true, normalized, errors, warnings };
};

// ==========================================
// TITLE / SENIORITY VALIDATORS
// ==========================================

export const validateTitle = (title: string | null | undefined): {
  valid: boolean;
  normalized: string | null;
  seniority: NormalizedLeadObject['seniority'];
  department: string | null;
  errors: ValidationError[];
  warnings: ValidationWarning[];
} => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!title || title.trim() === '') {
    return { valid: true, normalized: null, seniority: 'Unknown', department: null, errors, warnings };
  }

  const trimmed = title.trim();

  // Detect seniority
  let seniority: NormalizedLeadObject['seniority'] = 'Unknown';
  for (const [level, pattern] of Object.entries(SENIORITY_PATTERNS)) {
    if (pattern.test(trimmed)) {
      seniority = level as NormalizedLeadObject['seniority'];
      break;
    }
  }

  // Detect department
  let department: string | null = null;
  const departmentPatterns: Record<string, RegExp> = {
    'Engineering': /\b(engineer|developer|devops|software|tech|architect|تقني|مهندس)\b/i,
    'Sales': /\b(sales|account executive|business development|bdr|sdr|مبيعات)\b/i,
    'Marketing': /\b(marketing|growth|brand|content|seo|تسويق)\b/i,
    'HR': /\b(hr|human resources|people|talent|recruiter|موارد بشرية)\b/i,
    'Finance': /\b(finance|accounting|controller|مالية|محاسبة)\b/i,
    'Operations': /\b(operations|ops|logistics|عمليات)\b/i,
    'Product': /\b(product|pm|ux|ui|design|منتج)\b/i,
    'Executive': /\b(ceo|cto|cfo|coo|president|founder|تنفيذي|رئيس)\b/i,
  };

  for (const [dept, pattern] of Object.entries(departmentPatterns)) {
    if (pattern.test(trimmed)) {
      department = dept;
      break;
    }
  }

  return { valid: true, normalized: trimmed, seniority, department, errors, warnings };
};

// ==========================================
// INDUSTRY VALIDATORS
// ==========================================

export const validateIndustry = (industry: string | null | undefined): {
  valid: boolean;
  normalized: string | null;
  taxonomy_key: string | null;
  errors: ValidationError[];
  warnings: ValidationWarning[];
} => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!industry || industry.trim() === '') {
    return { valid: true, normalized: null, taxonomy_key: null, errors, warnings };
  }

  const trimmed = industry.trim().toLowerCase();

  // Try to match to taxonomy
  for (const [key, data] of Object.entries(INDUSTRY_TAXONOMY)) {
    if (
      key === trimmed ||
      data.ar.toLowerCase() === trimmed ||
      data.aliases.some(a => a.toLowerCase() === trimmed || trimmed.includes(a.toLowerCase()))
    ) {
      return { valid: true, normalized: key, taxonomy_key: key, errors, warnings };
    }
  }

  // Unknown industry - still valid but warn
  warnings.push({
    field: 'industry',
    value: industry,
    rule: 'industry_unknown',
    message: 'Industry not found in taxonomy',
    message_ar: 'الصناعة غير موجودة في التصنيف',
  });

  return { valid: true, normalized: trimmed, taxonomy_key: null, errors, warnings };
};

// ==========================================
// COMPANY SIZE VALIDATORS
// ==========================================

export const validateCompanySize = (size: string | number | null | undefined): {
  valid: boolean;
  normalized: NormalizedLeadObject['company_size'];
  raw: number | null;
  errors: ValidationError[];
  warnings: ValidationWarning[];
} => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (size === null || size === undefined || size === '') {
    return { valid: true, normalized: null, raw: null, errors, warnings };
  }

  let numericSize: number;

  if (typeof size === 'number') {
    numericSize = size;
  } else {
    // Try to parse from string
    const parsed = parseInt(size.replace(/[^\d]/g, ''), 10);
    if (isNaN(parsed)) {
      // Try to match range patterns
      const rangeMatch = size.match(/(\d+)\s*[-–]\s*(\d+)/);
      if (rangeMatch) {
        numericSize = Math.round((parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2);
      } else {
        warnings.push({
          field: 'company_size',
          value: size,
          rule: 'company_size_parse',
          message: 'Could not parse company size',
          message_ar: 'لم يتم التعرف على حجم الشركة',
        });
        return { valid: true, normalized: null, raw: null, errors, warnings };
      }
    } else {
      numericSize = parsed;
    }
  }

  // Map to range
  let normalized: NormalizedLeadObject['company_size'] = null;
  for (const [range, data] of Object.entries(COMPANY_SIZE_RANGES)) {
    if (numericSize >= data.min && numericSize <= data.max) {
      normalized = range as NormalizedLeadObject['company_size'];
      break;
    }
  }

  return { valid: true, normalized, raw: numericSize, errors, warnings };
};

// ==========================================
// COUNTRY/REGION VALIDATORS
// ==========================================

export const validateCountry = (country: string | null | undefined): {
  valid: boolean;
  normalized: string | null;
  code: string | null;
  is_gcc: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
} => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!country || country.trim() === '') {
    return { valid: true, normalized: null, code: null, is_gcc: false, errors, warnings };
  }

  const trimmed = country.trim().toLowerCase();

  // Check GCC countries
  for (const [code, data] of Object.entries(GCC_REGIONS)) {
    if (
      code.toLowerCase() === trimmed ||
      data.name.toLowerCase() === trimmed ||
      data.ar === country.trim() ||
      trimmed.includes(data.name.toLowerCase()) ||
      trimmed.includes(data.ar)
    ) {
      return { valid: true, normalized: data.name, code, is_gcc: true, errors, warnings };
    }
  }

  // Non-GCC country
  return { valid: true, normalized: country.trim(), code: null, is_gcc: false, errors, warnings };
};

// ==========================================
// FULL RECORD VALIDATOR
// ==========================================

export interface ValidateRecordResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  normalized: Partial<NormalizedLeadObject>;
}

export const validateRecord = (
  raw: Record<string, any>,
  mapping?: Record<string, string>
): ValidateRecordResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const normalized: Partial<NormalizedLeadObject> = {};

  // Helper to get value from raw using mapping
  const getValue = (canonicalField: string): any => {
    if (mapping && mapping[canonicalField]) {
      return raw[mapping[canonicalField]];
    }
    // Try common aliases
    const fieldConfig = CANONICAL_FIELDS[canonicalField as keyof typeof CANONICAL_FIELDS];
    if (fieldConfig) {
      for (const alias of fieldConfig.aliases) {
        if (raw[alias] !== undefined) return raw[alias];
      }
    }
    return raw[canonicalField];
  };

  // Validate each field
  const emailResult = validateEmail(getValue('email'));
  errors.push(...emailResult.errors);
  warnings.push(...emailResult.warnings);
  normalized.email = emailResult.normalized;

  const phoneResult = validatePhone(getValue('phone'));
  errors.push(...phoneResult.errors);
  warnings.push(...phoneResult.warnings);
  normalized.phone = phoneResult.normalized;

  const linkedinResult = validateLinkedInUrl(getValue('linkedin_url'), 'person');
  errors.push(...linkedinResult.errors);
  warnings.push(...linkedinResult.warnings);
  normalized.linkedin_url = linkedinResult.normalized;
  normalized.linkedin_id = linkedinResult.linkedin_id;

  const firstNameResult = validateName(getValue('first_name'), 'first_name');
  errors.push(...firstNameResult.errors);
  warnings.push(...firstNameResult.warnings);
  normalized.first_name = firstNameResult.normalized;

  const lastNameResult = validateName(getValue('last_name'), 'last_name');
  errors.push(...lastNameResult.errors);
  warnings.push(...lastNameResult.warnings);
  normalized.last_name = lastNameResult.normalized;

  const fullNameResult = validateName(getValue('full_name'), 'full_name');
  errors.push(...fullNameResult.errors);
  warnings.push(...fullNameResult.warnings);
  normalized.full_name = fullNameResult.normalized;

  const companyResult = validateCompanyName(getValue('company_name'));
  errors.push(...companyResult.errors);
  warnings.push(...companyResult.warnings);
  normalized.company_name = companyResult.normalized;
  normalized.company_name_normalized = companyResult.normalized;

  const domainResult = validateDomain(getValue('company_domain') || getValue('website'));
  errors.push(...domainResult.errors);
  warnings.push(...domainResult.warnings);
  normalized.company_domain = domainResult.normalized;

  const titleResult = validateTitle(getValue('title'));
  errors.push(...titleResult.errors);
  warnings.push(...titleResult.warnings);
  normalized.title_raw = getValue('title');
  normalized.title_normalized = titleResult.normalized;
  normalized.seniority = titleResult.seniority;
  normalized.department = titleResult.department;

  const industryResult = validateIndustry(getValue('industry'));
  errors.push(...industryResult.errors);
  warnings.push(...industryResult.warnings);
  normalized.industry = getValue('industry');
  normalized.industry_normalized = industryResult.normalized;

  const sizeResult = validateCompanySize(getValue('company_size') || getValue('employees'));
  errors.push(...sizeResult.errors);
  warnings.push(...sizeResult.warnings);
  normalized.company_size = sizeResult.normalized;
  normalized.company_size_raw = sizeResult.raw;

  const countryResult = validateCountry(getValue('country'));
  errors.push(...countryResult.errors);
  warnings.push(...countryResult.warnings);
  normalized.company_country = countryResult.normalized;
  normalized.company_region = countryResult.is_gcc ? 'GCC' : null;

  // Company LinkedIn
  const companyLinkedinResult = validateLinkedInUrl(getValue('company_linkedin'), 'company');
  errors.push(...companyLinkedinResult.errors);
  warnings.push(...companyLinkedinResult.warnings);
  normalized.company_linkedin = companyLinkedinResult.normalized;

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    normalized,
  };
};

// ==========================================
// DEDUP KEY GENERATOR
// ==========================================

export const generateDedupKey = (record: Partial<NormalizedLeadObject>): string | null => {
  // Priority: email > linkedin_url > phone > (domain + name)
  if (record.email) {
    return `email:${record.email}`;
  }

  if (record.linkedin_url) {
    return `linkedin:${record.linkedin_id || record.linkedin_url}`;
  }

  if (record.phone) {
    return `phone:${record.phone}`;
  }

  if (record.company_domain && record.full_name) {
    const nameKey = record.full_name.toLowerCase().replace(/\s+/g, '_');
    return `domain_name:${record.company_domain}:${nameKey}`;
  }

  return null;
};

// ==========================================
// IDENTITY HASH GENERATOR
// ==========================================

export const generateIdentityHash = async (record: Partial<NormalizedLeadObject>): Promise<string> => {
  const dedupKey = generateDedupKey(record);

  if (!dedupKey) {
    // Generate random hash for records without identity
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `unknown:${randomPart}`;
  }

  // Use Web Crypto API for SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(dedupKey);

  // In browser/Node 18+
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback: simple hash
  let hash = 0;
  for (let i = 0; i < dedupKey.length; i++) {
    const char = dedupKey.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `simple:${Math.abs(hash).toString(16)}`;
};
