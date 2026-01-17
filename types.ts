
// ═══════════════════════════════════════════════════════════════════════════
// My App Types - Clutch-style User Portal
// V1.0 - Single account, dual profile (Buyer + Provider)
// ═══════════════════════════════════════════════════════════════════════════

export enum LeadSource {
  INBOUND_MARKETPLACE = 'inbound_marketplace',
  OUTBOUND_CONTACTS = 'outbound_contacts'
}

export enum PipelineStage {
  NEW = 'New',
  ICP_VERIFIED = 'ICP Verified',
  HIGH_FIT = 'Fit ≥ 70',
  READY_TO_OUTREACH = 'Ready to Outreach',
  IN_CONVERSATION = 'In Conversation',
  MEETING_BOOKED = 'Meeting Booked',
  OPPORTUNITY = 'Opportunity'
}

export const PipelineStageLabels: Record<PipelineStage, string> = {
  [PipelineStage.NEW]: 'جديد',
  [PipelineStage.ICP_VERIFIED]: 'تم التحقق (ICP)',
  [PipelineStage.HIGH_FIT]: 'ملاءمة عالية (≥70%)',
  [PipelineStage.READY_TO_OUTREACH]: 'جاهز للتواصل',
  [PipelineStage.IN_CONVERSATION]: 'محادثة جارية',
  [PipelineStage.MEETING_BOOKED]: 'موعد محجوز',
  [PipelineStage.OPPORTUNITY]: 'فرصة بيعية'
};

// ─────────────────────────────────────────────────────────────────────────────
// GHL-Style Contacts & Leads
// ─────────────────────────────────────────────────────────────────────────────

export interface Contact {
  id: string;

  // Core contact info
  first_name?: string;
  last_name?: string;
  name: string;
  email: string;
  phone?: string;
  title?: string;
  company_name: string;

  // Location
  address1?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  timezone?: string;
  website?: string;

  // GHL Custom Fields
  initial_icebreaker?: string;
  industry_2?: string;
  function_2?: string;
  company_official_name?: string;
  title_description?: string;
  linkedin_url?: string;
  prospect_about?: string;
  company_description?: string;
  phone_2?: string;
  size_2?: string;
  source: string;
  record_id?: string;
  about?: string;
  company_linkedin_url?: string;
  linkedin_company_url?: string;
  open_profile?: string;
  premium?: string;
  linkedin_sales_navigator?: string;
  date_of_birth?: string;
  employee_count?: string;
  company_country?: string;
  arabic_summary?: string;
  call_recordings?: string;
  lowercase_business_name?: string;
  type?: string;
  welcome_message?: string;
  follow_up_1?: string;
  follow_up_2?: string;
  follow_up_3?: string;
  follow_up_4?: string;
  subcategory?: string;
  sub_subcategory?: string;
  manufacture?: string;
  annual_revenue?: string;
  _phone_updated?: string;
  profile_unique_id?: string;
  li_messages?: string;
  company_location?: string;
  "3rd_scene"?: string;
  subject_f1?: string;
  subject_f2?: string;
  subject_f3?: string;
  "3rd_scene_subject"?: string;
  industry_tier?: string;
  title_tier?: string;
  final_icp_tier?: string;
  industry_ar?: string;
  field_ar?: string;
  profile?: string;
  b2b_status?: string;
  industry_22?: string;
  b2b_summary?: string;

  // App Specific / Pipeline
  icpStatus?: 'pending' | 'verified' | 'failed';
  fitScore?: number;
  stage?: PipelineStage;
  tags?: string[];
}

export interface Business {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  state?: string;
  city?: string;
  description?: string;
  postalcode?: string;
  country?: string;
}

export interface Opportunity {
  id: string;
  name: string;
  pipeline_id: string;
  pipeline_stage_id: string;
  status: 'open' | 'won' | 'lost' | 'abandoned';
  monetary_value?: number;
  assigned_to?: string;
  source?: string;
  lost_reason?: string;
  call_record_url?: string;
  feedback?: string;

  contact_id?: string;
  business_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Segment {
  id: string;
  name: string;
  count: number;
  description: string;
}

export interface ProviderICP {
  isSet: boolean;
  lastUpdated?: string;
  industries: string[];
  titles: string[];
  budgetRange: { min: number; max: number };
}

// ─────────────────────────────────────────────────────────────────────────────
// Core User Account (One account per email)
// ─────────────────────────────────────────────────────────────────────────────

export type AppUserMode = 'buyer' | 'provider';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  nameEn?: string;
  phone?: string;
  avatar?: string;

  // Profile links (optional - can have one or both)
  buyer_profile_id?: string;
  provider_profile_id?: string;

  // Current active mode
  default_mode: AppUserMode;

  // Account status
  status: 'active' | 'inactive' | 'suspended';
  email_verified: boolean;

  // Timestamps
  created_at: string;
  last_login?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Buyer Profile (Links to existing Buyers/Clients in Admin)
// ─────────────────────────────────────────────────────────────────────────────

export interface BuyerProfile {
  id: string;
  user_id: string;

  // Company info
  company_name: string;
  company_name_en?: string;
  cr_number?: string;
  industry?: string;
  company_size?: '1-10' | '11-50' | '51-200' | '200+';

  // Contact
  contact_name: string;
  contact_role?: string;
  contact_email: string;
  contact_phone?: string;

  // Location
  city?: string;
  country: string;

  // Profile completeness
  profile_complete: boolean;

  created_at: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider Profile (Links to existing Providers in Admin)
// ─────────────────────────────────────────────────────────────────────────────

export type ProviderProfileStatus = 'draft' | 'pending_review' | 'published' | 'suspended';

export interface ServiceLine {
  id: string;
  name: string;
  name_en?: string;
  allocation: number; // 0-100, total must = 100
  description?: string;
  domain_id?: string;  // Service domain
  subtype_ids?: string[];  // L2 subservice codes
}

export interface IndustryFocus {
  id: string;
  name: string;
  name_en?: string;
  allocation: number; // 0-100, total must = 100
}

// Client/Past Project reference - used for API input/output
// DB column mapping (provider_clients table):
// - service_line_id → service_category_id (INTEGER FK)
// - industry_id → industry_sector_id (INTEGER FK)
// - subservice_id → subservice_id (INTEGER FK)
// - sub_industry_id → sub_industry_id (INTEGER FK)
export interface ClientReference {
  id: string;
  company_name: string;
  project_description?: string;   // Min 100 chars - detailed project description
  project_type?: string;
  year?: number;
  testimonial?: string;
  is_public: boolean;
  // Taxonomy IDs (INTEGER FK to taxonomy tables)
  service_category_id?: number;   // → service_categories.id (Level 2)
  subservice_id?: number;         // → service_categories.id (Level 3)
  industry_sector_id?: number;    // → industry_sectors.id (Level 1)
  sub_industry_id?: number;       // → industry_sectors.id (Level 2)
  // Legacy fields (for backward compatibility with frontend)
  industry?: string;              // Display name
  industry_id?: number;           // Legacy → maps to industry_sector_id
  service_line?: string;          // Display name
  service_line_id?: number;       // Legacy → maps to service_category_id
  domain_id?: number;             // Legacy - not stored, derived from parent
  service_id?: number;            // Legacy → maps to service_category_id
}

export interface ProviderProfile {
  id: string;
  user_id: string;
  provider_id: string; // Links to Provider entity in Admin

  // Company basics
  company_name: string;
  company_name_en?: string;
  tagline?: string;
  tagline_en?: string;
  description?: string;
  description_en?: string;
  logo_url?: string;
  cover_url?: string;

  // Company details
  cr_number?: string;
  is_saudi_verified?: boolean;   // Admin-verified Saudi presence
  founded_year?: number;
  company_size: '1-10' | '11-50' | '51-200' | '200+';

  // Contact
  contact_name: string;
  contact_role?: string;
  contact_email: string;
  contact_phone?: string;
  website?: string;

  // Locations
  headquarters_city: string;
  headquarters_country: string;
  service_locations: string[]; // List of cities/regions

  // Social
  linkedin_url?: string;
  twitter_url?: string;

  // Service lines (allocation = 100%)
  service_lines: ServiceLine[];

  // Industry focus (allocation = 100%)
  industries: IndustryFocus[];

  // Client references
  clients: ClientReference[];

  // Ideal client
  ideal_client_description?: string;
  min_project_size?: number;
  max_project_size?: number;
  preferred_project_duration?: string;

  // Certifications
  certifications?: string[];

  // Tags & Keywords (for text-based matching)
  tags?: string[];
  keywords?: string[];
  capabilities?: string[];

  // Profile status
  status: ProviderProfileStatus;
  profile_health: number; // 0-100

  // Review
  submitted_for_review_at?: string;
  reviewed_at?: string;
  review_notes?: string;

  created_at: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Buyer Projects (Client requests/RFPs)
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectStatus =
  | 'draft'
  | 'open'           // Published, accepting responses
  | 'in_progress'    // Working with providers
  | 'closed'         // Completed or cancelled
  | 'archived';

export type ProjectBudgetBand =
  | 'under_10k'
  | '10k_50k'
  | '50k_100k'
  | '100k_500k'
  | 'over_500k';

export interface ProjectAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploaded_at: string;
}

export interface BuyerProject {
  id: string;
  buyer_profile_id: string;
  owner_user_id: string; // For self-match prevention

  // Basics
  title: string;
  title_en?: string;
  category: string;
  subcategory?: string;
  description: string;
  description_en?: string;

  // Scope
  deliverables?: string[];
  goals?: string[];
  attachments: ProjectAttachment[];

  // Budget & Timeline
  budget_band: ProjectBudgetBand;
  budget_min?: number;
  budget_max?: number;
  timeline_start?: string;
  timeline_end?: string;
  urgency: 'flexible' | 'normal' | 'urgent';

  // Location preference
  preferred_locations?: string[];
  remote_ok: boolean;

  // Saudi presence requirement
  saudi_presence_required?: boolean;  // If true, only verified Saudi providers match strictly

  // Status
  status: ProjectStatus;

  // Matching
  invited_providers: string[]; // Provider IDs
  excluded_providers: string[]; // For self-match prevention

  // Stats
  responses_count: number;
  meetings_count: number;

  created_at: string;
  updated_at?: string;
  published_at?: string;
  closed_at?: string;

  // Source tracking (for hybrid mock + database)
  _source?: 'mock' | 'database';
  _dbId?: number;        // Original database ID
  _dbStatus?: string;    // Original database status
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider Project Response (Provider's response to a project)
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectResponseStatus =
  | 'invited'        // Provider invited but not responded
  | 'interested'     // Provider expressed interest
  | 'declined'       // Provider declined
  | 'discussing'     // In conversation
  | 'meeting_set'    // Meeting scheduled
  | 'proposal_sent'  // Formal proposal sent
  | 'hired'          // Won the project
  | 'not_selected';  // Lost

export interface ProjectResponse {
  id: string;
  project_id: string;
  provider_profile_id: string;

  status: ProjectResponseStatus;

  // Provider's response
  interest_note?: string;
  decline_reason?: string;
  proposed_budget?: number;
  proposed_timeline?: string;

  // Timestamps
  invited_at: string;
  responded_at?: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Messages / Conversations
// ─────────────────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string; // User ID
  sender_type: 'buyer' | 'provider';

  content: string;
  attachments?: ProjectAttachment[];

  read: boolean;
  created_at: string;
}

export interface MessageThread {
  id: string;
  project_id: string;
  buyer_user_id: string;
  provider_user_id: string;

  // Last message preview
  last_message?: string;
  last_message_at?: string;
  last_sender_type?: 'buyer' | 'provider';

  // Unread counts
  buyer_unread: number;
  provider_unread: number;

  // Status
  is_archived: boolean;
  is_priority: boolean;

  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Meetings
// ─────────────────────────────────────────────────────────────────────────────

export type MeetingStatus =
  | 'requested'
  | 'pending_confirmation'
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Meeting {
  id: string;
  project_id: string;
  thread_id?: string;
  buyer_user_id: string;
  provider_user_id: string;

  title: string;
  description?: string;

  // Scheduling
  proposed_times?: string[]; // ISO dates
  scheduled_at?: string;
  duration_minutes: number;

  // Location
  meeting_type: 'video' | 'phone' | 'in_person';
  meeting_link?: string;
  meeting_location?: string;

  status: MeetingStatus;

  // Notes
  buyer_notes?: string;
  provider_notes?: string;

  created_at: string;
  updated_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider Shortlist (Buyer's saved providers)
// ─────────────────────────────────────────────────────────────────────────────

export interface ShortlistItem {
  id: string;
  buyer_user_id: string;
  provider_profile_id: string;

  notes?: string;
  added_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────────────────────────

export type NotificationType =
  | 'new_project_invite'
  | 'new_message'
  | 'project_response'
  | 'meeting_request'
  | 'meeting_confirmed' | 'profile_published'
  | 'profile_needs_review';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  created_at: string;
}
