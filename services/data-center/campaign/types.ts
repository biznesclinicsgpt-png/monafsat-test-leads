/**
 * Campaign Prep Types
 *
 * Stage 6: Campaign Prep & Export
 *
 * Defines types for:
 * - Campaign templates
 * - Personalization tokens
 * - Channel exports (Email, LinkedIn, WhatsApp)
 * - Export formats and destinations
 */

import { NormalizedLeadObject } from '../types';

// ==========================================
// CAMPAIGN CHANNELS
// ==========================================

export type CampaignChannel = 'email' | 'linkedin' | 'whatsapp' | 'phone' | 'sms';

export interface ChannelConfig {
  id: CampaignChannel;
  name: string;
  name_ar: string;
  enabled: boolean;
  provider?: string;
  api_key_env?: string;
  rate_limit?: number;
  daily_limit?: number;
}

export const DEFAULT_CHANNELS: ChannelConfig[] = [
  {
    id: 'email',
    name: 'Email',
    name_ar: 'البريد الإلكتروني',
    enabled: true,
    provider: 'smartlead',
    api_key_env: 'SMARTLEAD_API_KEY',
    rate_limit: 100,
    daily_limit: 500,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    name_ar: 'لينكد إن',
    enabled: true,
    provider: 'phantombuster',
    api_key_env: 'PHANTOMBUSTER_API_KEY',
    rate_limit: 50,
    daily_limit: 100,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    name_ar: 'واتساب',
    enabled: true,
    provider: 'twilio',
    api_key_env: 'TWILIO_API_KEY',
    rate_limit: 20,
    daily_limit: 200,
  },
  {
    id: 'phone',
    name: 'Phone Call',
    name_ar: 'مكالمة هاتفية',
    enabled: false,
    provider: 'manual',
  },
  {
    id: 'sms',
    name: 'SMS',
    name_ar: 'رسالة نصية',
    enabled: false,
    provider: 'twilio',
    api_key_env: 'TWILIO_API_KEY',
  },
];

// ==========================================
// PERSONALIZATION TOKENS
// ==========================================

export interface PersonalizationToken {
  token: string;          // e.g., {{first_name}}
  field: keyof NormalizedLeadObject | string;
  fallback?: string;
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  description: string;
  description_ar: string;
}

export const PERSONALIZATION_TOKENS: PersonalizationToken[] = [
  // Person tokens
  {
    token: '{{first_name}}',
    field: 'first_name',
    fallback: 'there',
    transform: 'capitalize',
    description: 'First name of the lead',
    description_ar: 'الاسم الأول',
  },
  {
    token: '{{last_name}}',
    field: 'last_name',
    fallback: '',
    transform: 'capitalize',
    description: 'Last name of the lead',
    description_ar: 'اسم العائلة',
  },
  {
    token: '{{full_name}}',
    field: 'full_name',
    fallback: 'Friend',
    transform: 'capitalize',
    description: 'Full name of the lead',
    description_ar: 'الاسم الكامل',
  },
  {
    token: '{{title}}',
    field: 'title_normalized',
    fallback: 'Professional',
    description: 'Job title',
    description_ar: 'المسمى الوظيفي',
  },
  {
    token: '{{seniority}}',
    field: 'seniority_level',
    fallback: '',
    description: 'Seniority level (C-Level, VP, etc.)',
    description_ar: 'المستوى الوظيفي',
  },

  // Company tokens
  {
    token: '{{company}}',
    field: 'company_name',
    fallback: 'your company',
    description: 'Company name',
    description_ar: 'اسم الشركة',
  },
  {
    token: '{{company_short}}',
    field: 'company_name_short',
    fallback: 'your company',
    description: 'Short company name',
    description_ar: 'اسم الشركة المختصر',
  },
  {
    token: '{{industry}}',
    field: 'industry',
    fallback: 'your industry',
    description: 'Industry category',
    description_ar: 'القطاع',
  },
  {
    token: '{{company_size}}',
    field: 'company_size',
    fallback: '',
    description: 'Company size bracket',
    description_ar: 'حجم الشركة',
  },
  {
    token: '{{country}}',
    field: 'country',
    fallback: '',
    description: 'Country',
    description_ar: 'الدولة',
  },
  {
    token: '{{city}}',
    field: 'city',
    fallback: '',
    description: 'City',
    description_ar: 'المدينة',
  },

  // ICP tokens
  {
    token: '{{icp_score}}',
    field: 'icp_fit_score',
    fallback: '',
    description: 'ICP fit score (0-100)',
    description_ar: 'نقاط التوافق',
  },
  {
    token: '{{icp_tier}}',
    field: 'icp_tier',
    fallback: '',
    description: 'ICP tier (VIP, Priority, etc.)',
    description_ar: 'فئة العميل',
  },

  // Dynamic tokens
  {
    token: '{{linkedin_url}}',
    field: 'linkedin_url',
    fallback: '',
    description: 'LinkedIn profile URL',
    description_ar: 'رابط لينكد إن',
  },
  {
    token: '{{email}}',
    field: 'email',
    fallback: '',
    description: 'Email address',
    description_ar: 'البريد الإلكتروني',
  },
];

// ==========================================
// CAMPAIGN TEMPLATES
// ==========================================

export interface CampaignTemplate {
  id: string;
  name: string;
  name_ar: string;
  channel: CampaignChannel;

  // Content
  subject?: string;         // For email
  body: string;
  signature?: string;

  // Personalization
  tokens_used: string[];

  // Targeting
  target_icp_status?: ('Yes' | 'No' | 'Unknown')[];
  target_icp_tier?: ('VIP' | 'Priority' | 'Standard' | 'Low')[];
  target_industries?: string[];
  target_seniorities?: string[];

  // Settings
  language: 'en' | 'ar' | 'mixed';
  is_follow_up: boolean;
  sequence_step?: number;
  delay_days?: number;       // For follow-ups

  // Metadata
  created_at: string;
  updated_at: string;
  created_by?: string;
}

// ==========================================
// EXPORT RECORD
// ==========================================

export interface ExportRecord {
  // From NormalizedLeadObject
  id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  email_status: string | null;
  phone: string | null;
  phone_status: string | null;
  linkedin_url: string | null;

  // Company
  company_name: string | null;
  company_domain: string | null;
  title_normalized: string | null;
  seniority_level: string | null;
  industry: string | null;
  company_size: string | null;
  country: string | null;
  city: string | null;

  // ICP
  icp_status: string | null;
  icp_fit_score: number | null;
  icp_tier: string | null;

  // Campaign specific
  campaign_channels: string[];
  personalized_subject?: string;
  personalized_body?: string;

  // Export metadata
  export_id: string;
  exported_at: string;
  destination: string;
}

// ==========================================
// EXPORT CONFIG
// ==========================================

export interface ExportConfig {
  // What to export
  channel: CampaignChannel;
  template_id?: string;

  // Filters
  filters: {
    icp_status?: ('Yes' | 'No' | 'Unknown')[];
    icp_tier?: ('VIP' | 'Priority' | 'Standard' | 'Low')[];
    min_score?: number;
    max_score?: number;
    has_email?: boolean;
    has_phone?: boolean;
    has_linkedin?: boolean;
    industries?: string[];
    countries?: string[];
  };

  // Limits
  limit?: number;
  offset?: number;

  // Format
  format: 'json' | 'csv' | 'smartlead' | 'lemlist' | 'instantly';
  include_personalization: boolean;

  // Destination
  destination?: {
    type: 'download' | 'api' | 'webhook';
    url?: string;
    api_key?: string;
    campaign_id?: string;
  };
}

// ==========================================
// EXPORT RESULT
// ==========================================

export interface ExportResult {
  export_id: string;
  status: 'success' | 'partial' | 'failed';

  // Counts
  total_records: number;
  exported_records: number;
  failed_records: number;

  // By channel
  channel: CampaignChannel;

  // Details
  records?: ExportRecord[];
  errors?: { record_id: string; error: string }[];

  // File (for download)
  file_url?: string;
  file_name?: string;

  // API push result
  api_result?: {
    destination: string;
    campaign_id?: string;
    leads_added?: number;
    message?: string;
  };

  // Timing
  duration_ms: number;
  exported_at: string;
}

// ==========================================
// CHANNEL-SPECIFIC EXPORTS
// ==========================================

// Smartlead export format
export interface SmartleadExport {
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  phone_number?: string;
  linkedin_url?: string;
  custom_fields: Record<string, string>;
}

// Lemlist export format
export interface LemlistExport {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone?: string;
  linkedinUrl?: string;
  picture?: string;
  icebreaker?: string;
}

// Instantly export format
export interface InstantlyExport {
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  personalization: string;
  website?: string;
}

// LinkedIn export (for PhantomBuster)
export interface LinkedInExport {
  linkedin_url: string;
  first_name: string;
  last_name: string;
  company: string;
  title: string;
  connection_message?: string;
}

// WhatsApp export
export interface WhatsAppExport {
  phone: string;
  first_name: string;
  message: string;
  template_id?: string;
}
