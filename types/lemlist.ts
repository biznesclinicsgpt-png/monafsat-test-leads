// ==========================================
// Lemlist API Types
// ==========================================

// Person Experience from Lemlist
export interface LemlistExperience {
    company_shorthand_name?: string;
    company_id?: number;
    company_name?: string;
    company_website_url?: string;
    company_linkedin_url?: string;
    company_employee_count?: number;
    company_size?: string;
    company_domain?: string;
    company_industry?: string;
    title?: string;
    title_normalized?: string;
    date_from?: string;
    date_to?: string;
    duration?: string;
    location?: string;
    current_exp_bucket?: string;
}

// Person Education from Lemlist
export interface LemlistEducation {
    school_name?: string;
    degree?: string;
    field_of_study?: string;
    date_from?: string;
    date_to?: string;
}

// Person Language
export interface LemlistLanguage {
    language: string;
    proficiency?: string;
}

// Main Person object from Lemlist People Database
export interface LemlistPerson {
    lead_id: number;
    _id: string;
    canonical_shorthand_name?: string;
    full_name: string;
    first_name?: string;
    last_name?: string;
    headline?: string;
    summary?: string;
    lead_linkedin_url?: string;
    linkedin_short?: string;
    country?: string;
    state?: string;
    location?: string;
    department?: string;
    lead_quality_score?: number;
    connections_count?: number;
    connections_count_bucket?: string;
    experience_count?: number;
    years_of_exp_bucket?: string;
    current_exp_company_name?: string;
    experiences?: LemlistExperience[];
    education?: LemlistEducation[];
    skills?: string[];
    interests?: string[];
    languages?: LemlistLanguage[];
    email?: string;
    phone?: string;
    _score?: number;
}

// Search Filter
export interface LemlistFilter {
    filterId: string;
    in?: string[];
    out?: string[];  // Required by API even if empty
    notIn?: string[];
    min?: number;
    max?: number;
    value?: string | boolean;
}

// Search Parameters
export interface LemlistSearchParams {
    filters: LemlistFilter[];
    page?: number;
    size?: number;
    excludes?: string[];
    search?: string;
}

// Search Response
export interface LemlistSearchResponse {
    results: LemlistPerson[];
    total: number;
    took: number;
    page: number;
    size: number;
    search: string;
    limitation: number;
    team: string;
}

// Enrichment Request Parameters
export interface LemlistEnrichmentParams {
    findEmail?: boolean;
    verifyEmail?: boolean;
    linkedinEnrichment?: boolean;
    findPhone?: boolean;
    email?: string;
    linkedinUrl?: string;
    firstName?: string;
    lastName?: string;
    companyDomain?: string;
    companyName?: string;
    webhookUrl?: string;
}

// Enrichment Response
export interface LemlistEnrichmentResponse {
    id: string;
}

// ==========================================
// Enhanced Enrichment Result Types (Full API Response)
// ==========================================

// Company info from LinkedIn enrichment
export interface LemlistEnrichedCompany {
    id?: number;
    name?: string;
    linkedinUrl?: string;
    linkedinUrlSalesNav?: string;
    logo?: string;
    domain?: string;
    website?: string;
    industry?: string;
    description?: string;
    employeesOnLinkedin?: number;
    foundedOn?: number;
    headQuarter?: string;
    size?: string;
    type?: string;
}

// Position date range
export interface LemlistDateRange {
    start?: { month?: number; year?: number };
    end?: { month?: number; year?: number };
}

// Individual position within a company
export interface LemlistProfilePosition {
    title?: string;
    description?: string;
    companyName?: string;
    date?: LemlistDateRange;
}

// Position group (company + positions)
export interface LemlistPositionGroup {
    company?: LemlistEnrichedCompany;
    date?: LemlistDateRange;
    profilePositions?: LemlistProfilePosition[];
}

// LinkedIn enrichment data
export interface LemlistLinkedInEnrichment {
    positionGroups?: LemlistPositionGroup[];
    linkedinUrl?: string;
    linkedinMemberId?: number;
    linkedinClassicId?: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
    locationName?: string;
    tagline?: string;
    industry?: string;
    summary?: string;
    languages?: string;
    skills?: string;
    companyName?: string;
    companyLinkedinUrl?: string;
    occupation?: string;
    companyDomain?: string;
    companyId?: number;
    companyWebsite?: string;
    companyDescription?: string;
    companyFoundedOn?: number;
    companyEmployeesOnLinkedin?: number;
    companyIndustry?: string;
    companyLogo?: string;
    companyType?: string;
    companyHeadQuarter?: string;
    companySize?: string;
}

// Email enrichment result
export interface LemlistEmailEnrichment {
    email?: string;
    status?: 'deliverable' | 'undeliverable' | 'risky' | 'unknown';
}

// Phone enrichment result
export interface LemlistPhoneEnrichment {
    phone?: string;
}

// Single enrichment data item
export interface LemlistEnrichmentDataItem {
    id: string;
    data?: {
        find_email?: LemlistEmailEnrichment;
        find_phone?: LemlistPhoneEnrichment;
        linkedin_enrichment?: LemlistLinkedInEnrichment;
    };
}

// Full enrichment result from polling
export interface LemlistEnrichmentResult {
    data?: LemlistEnrichmentDataItem[];
    type?: 'enrichmentDone' | 'enrichmentPending' | 'enrichmentFailed';
    // Legacy fields for backwards compatibility
    id?: string;
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    email?: string;
    emailStatus?: string;
    phone?: string;
    linkedinUrl?: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    companyDomain?: string;
    title?: string;
    location?: string;
    error?: string;
}

// Enrichment strategy types
export type EnrichmentStrategy =
    | 'linkedin_url'           // Use LinkedIn URL directly
    | 'name_company_domain'    // First name + Last name + Company domain
    | 'name_company_name'      // First name + Last name + Company name
    | 'email_only'             // Use email to find other data
    | 'auto';                  // Auto-select best strategy based on available data

// Enrichment options for the smart enricher
export interface SmartEnrichmentOptions {
    strategy?: EnrichmentStrategy;
    findEmail?: boolean;
    findPhone?: boolean;
    linkedinEnrichment?: boolean;
    verifyEmail?: boolean;
    pollForResult?: boolean;
    pollTimeoutMs?: number;
    pollIntervalMs?: number;
}

// Parsed/normalized enrichment result for easy consumption
export interface ParsedEnrichmentResult {
    success: boolean;
    enrichmentId: string;
    email?: string;
    emailStatus?: string;
    phone?: string;
    linkedinUrl?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    picture?: string;
    tagline?: string;
    summary?: string;
    location?: string;
    skills?: string[];
    languages?: string[];
    currentCompany?: {
        name?: string;
        domain?: string;
        linkedinUrl?: string;
        industry?: string;
        size?: string;
        employeeCount?: number;
        website?: string;
        logo?: string;
        headquarters?: string;
        foundedYear?: number;
    };
    currentPosition?: {
        title?: string;
        description?: string;
        startDate?: { month?: number; year?: number };
    };
    employmentHistory?: Array<{
        companyName?: string;
        title?: string;
        startDate?: { month?: number; year?: number };
        endDate?: { month?: number; year?: number };
    }>;
    rawData?: LemlistEnrichmentResult;
    error?: string;
}

// Available Filters (from GET /database/people/filters)
export interface LemlistFilterOption {
    filterId: string;
    label: string;
    type: 'select' | 'multiselect' | 'range' | 'boolean' | 'text';
    options?: { value: string; label: string }[];
}

// Common filter IDs based on Lemlist API
export const LEMLIST_FILTER_IDS = {
    COUNTRY: 'country',
    STATE: 'state',
    CITY: 'city',
    INDUSTRY: 'industry',
    COMPANY_SIZE: 'company_size',
    DEPARTMENT: 'department',
    SENIORITY: 'seniority',
    TITLE: 'title',
    COMPANY_NAME: 'company_name',
    SKILLS: 'skills',
    YEARS_OF_EXPERIENCE: 'years_of_exp',
} as const;
