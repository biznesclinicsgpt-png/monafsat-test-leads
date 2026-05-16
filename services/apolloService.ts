import { StagingRow } from "@/types/data-center";

const APOLLO_API_BASE = '/api/apollo';

// ==========================================
// Apollo API Interfaces (Based on Official Docs)
// ==========================================

export interface ApolloSearchFilters {
    // People Search Filters
    person_titles?: string[];
    person_locations?: string[];
    person_seniorities?: ('owner' | 'founder' | 'c_suite' | 'partner' | 'vp' | 'head' | 'director' | 'manager' | 'senior' | 'entry' | 'intern')[];
    q_keywords?: string;
    contact_email_status?: ('verified' | 'unverified' | 'likely to engage' | 'unavailable')[];
    include_similar_titles?: boolean;

    // Organization Filters
    q_organization_domains_list?: string[];
    q_organization_name?: string;
    organization_ids?: string[];
    organization_locations?: string[];
    organization_not_locations?: string[];
    organization_num_employees_ranges?: string[]; // e.g., "1,10", "250,500"

    // Revenue Filters
    revenue_range_min?: number;
    revenue_range_max?: number;

    // Technology Filters
    currently_using_any_of_technology_uids?: string[];
    currently_using_all_of_technology_uids?: string[];
    currently_not_using_any_of_technology_uids?: string[];

    // Job Posting Filters
    q_organization_job_titles?: string[];
    organization_job_locations?: string[];
    organization_num_jobs_range_min?: number;
    organization_num_jobs_range_max?: number;

    // Funding Filters
    latest_funding_amount_range_min?: number;
    latest_funding_amount_range_max?: number;
    total_funding_range_min?: number;
    total_funding_range_max?: number;

    // Pagination
    page?: number;
    per_page?: number;
}

// Full Person Response from Apollo API
export interface ApolloPersonFull {
    id: string;
    first_name: string;
    last_name: string;
    last_name_obfuscated?: string;
    name: string;
    title: string;
    headline?: string;

    // Contact Info
    email?: string;
    email_status?: string;
    personal_emails?: string[];
    phone_numbers?: Array<{
        number: string;
        sanitized_number: string;
        type?: string;
        position?: number;
    }>;
    mobile_phone?: string;
    corporate_phone?: string;
    direct_dial_phone?: string;

    // Social Links
    linkedin_url?: string;
    linkedin_uid?: string;
    twitter_url?: string;
    facebook_url?: string;
    github_url?: string;

    // Location
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    time_zone?: string;

    // Professional Info
    seniority?: string;
    departments?: string[];
    subdepartments?: string[];
    functions?: string[];

    // Employment
    employment_history?: Array<{
        id?: string;
        title?: string;
        organization_name?: string;
        organization_id?: string;
        current?: boolean;
        start_date?: string;
        end_date?: string;
        description?: string;
    }>;

    // Media
    photo_url?: string;

    // Intent & Engagement
    is_likely_to_engage?: boolean;
    intent_strength?: string | null;
    show_intent?: boolean;

    // Organization (Embedded)
    organization?: ApolloOrganizationFull;
    organization_id?: string;

    // Contact object (from enrichment)
    contact?: {
        email?: string;
        phone_numbers?: Array<{
            number: string;
            sanitized_number: string;
        }>;
        city?: string;
        state?: string;
        country?: string;
    };

    // Metadata
    revealed_for_current_team?: boolean;
    last_refreshed_at?: string;
}

// Full Organization Response from Apollo API
export interface ApolloOrganizationFull {
    id: string;
    name: string;

    // Web Presence
    website_url?: string;
    blog_url?: string;
    primary_domain?: string;

    // Social Links
    linkedin_url?: string;
    linkedin_uid?: string;
    twitter_url?: string;
    facebook_url?: string;
    angellist_url?: string;
    crunchbase_url?: string;

    // Contact Info
    phone?: string;
    primary_phone?: {
        number?: string;
        sanitized_number?: string;
        source?: string;
    };

    // Location
    raw_address?: string;
    street_address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;

    // Company Info
    industry?: string;
    industries?: string[];
    keywords?: string[];
    founded_year?: number;
    logo_url?: string;

    // Size & Revenue
    estimated_num_employees?: number;
    employee_count_range?: string;
    annual_revenue?: number;
    annual_revenue_printed?: string;

    // Funding
    total_funding?: number;
    total_funding_printed?: string;
    latest_funding_amount?: number;
    latest_funding_date?: string;
    latest_funding_round_type?: string;

    // Stock Info
    publicly_traded_symbol?: string;
    publicly_traded_exchange?: string;

    // Rankings & Metrics
    alexa_ranking?: number;
    retail_location_count?: number;

    // Languages
    languages?: string[];

    // Technologies
    technology_names?: string[];
    current_technologies?: Array<{
        uid: string;
        name: string;
        category?: string;
    }>;

    // Department Headcount
    departmental_head_count?: {
        engineering?: number;
        operations?: number;
        support?: number;
        marketing?: number;
        human_resources?: number;
        sales?: number;
        finance?: number;
        consulting?: number;
        legal?: number;
        arts_and_design?: number;
        accounting?: number;
        business_development?: number;
        information_technology?: number;
        education?: number;
        media_and_communication?: number;
        product_management?: number;
        entrepreneurship?: number;
        data_science?: number;
        administrative?: number;
    };

    // SIC/NAICS Codes
    sic_codes?: string[];
    naics_codes?: string[];

    // Intent
    intent_strength?: string | null;
    show_intent?: boolean;
    has_intent_signal_account?: boolean;
}

// ==========================================
// Helper: Clean filters (remove empty arrays and undefined values)
// ==========================================
const cleanFilters = (obj: Record<string, any>): Record<string, any> => {
    const cleaned: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
        // Skip undefined and null
        if (value === undefined || value === null) continue;

        // Skip empty strings
        if (value === '') continue;

        // Skip empty arrays
        if (Array.isArray(value) && value.length === 0) continue;

        // Include valid values
        cleaned[key] = value;
    }

    return cleaned;
};

// ==========================================
// API Functions
// ==========================================

export const searchApolloPeople = async (filters: ApolloSearchFilters, apiKey: string): Promise<ApolloPersonFull[]> => {
    try {
        // بناء body الطلب مع تنظيف القيم الفارغة (بدون api_key - يذهب في Header)
        const requestBody = cleanFilters({
            person_titles: filters.person_titles,
            person_locations: filters.person_locations,
            person_seniorities: filters.person_seniorities,
            q_keywords: filters.q_keywords,
            contact_email_status: filters.contact_email_status,

            // Organization filters
            q_organization_domains: filters.q_organization_domains_list,
            q_organization_name: filters.q_organization_name,
            organization_locations: filters.organization_locations,
            organization_not_locations: filters.organization_not_locations,
            organization_num_employees_ranges: filters.organization_num_employees_ranges,

            // Revenue
            revenue_range: (filters.revenue_range_min || filters.revenue_range_max) ? {
                min: filters.revenue_range_min,
                max: filters.revenue_range_max
            } : undefined,

            // Funding
            organization_latest_funding_stage_cd: filters.latest_funding_amount_range_min ? ['seed', 'angel', 'venture'] : undefined,

            // Pagination
            page: filters.page || 1,
            per_page: Math.min(filters.per_page || 25, 100),
        });

        console.log('Apollo People Search Request:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${APOLLO_API_BASE}/mixed_people/api_search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'X-Api-Key': apiKey,
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Apollo API Error Response:', errorBody);
            throw new Error(`Apollo API Error: ${response.status} - ${errorBody}`);
        }

        const data = await response.json();
        console.log('Apollo People Search Response:', data.people?.length || 0, 'results');
        return data.people || [];
    } catch (error) {
        console.error("Apollo Search Failed:", error);
        throw error;
    }
};

export const searchApolloCompanies = async (filters: ApolloSearchFilters, apiKey: string): Promise<ApolloOrganizationFull[]> => {
    try {
        const requestBody = cleanFilters({
            q_organization_domains: filters.q_organization_domains_list,
            q_organization_name: filters.q_organization_name,
            organization_locations: filters.organization_locations,
            organization_not_locations: filters.organization_not_locations,
            organization_num_employees_ranges: filters.organization_num_employees_ranges,
            page: filters.page || 1,
            per_page: Math.min(filters.per_page || 25, 100),
        });

        console.log('Apollo Companies Search Request:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${APOLLO_API_BASE}/mixed_companies/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'X-Api-Key': apiKey,
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Apollo API Error Response:', errorBody);
            throw new Error(`Apollo Org Search Error: ${response.status} - ${errorBody}`);
        }

        const data = await response.json();
        console.log('Apollo Companies Search Response:', data.organizations?.length || 0, 'results');
        return data.organizations || [];
    } catch (error) {
        console.error("Apollo Org Search Failed:", error);
        throw error;
    }
};

// ==========================================
// CREDIT-FREE Enrichment via /mixed_people/api_search
// This endpoint charges NO credits and returns partial profiles
// including LinkedIn URLs (person + company)
// ==========================================

// Helper: Check if a name is obfuscated (contains *** or similar patterns)
const isObfuscated = (value?: string): boolean => {
    if (!value) return true;
    return /\*{2,}/.test(value) || value.includes('***');
};

// Helper: Clean name - remove obfuscated parts
const cleanName = (value?: string): string | undefined => {
    if (!value || isObfuscated(value)) return undefined;
    return value.trim();
};

// Credit-Free Person Enrichment (uses /mixed_people/api_search - FREE)
export const enrichApolloPerson = async (params: {
    first_name?: string;
    last_name?: string;
    name?: string;
    email?: string;
    domain?: string;
    organization_name?: string;
    linkedin_url?: string;
    title?: string;
    id?: string;
}, apiKey: string): Promise<ApolloPersonFull | null> => {
    try {
        // Strategy: Use /mixed_people/api_search (FREE - no credits)
        // instead of /people/match (costs 1 credit/email, 1 credit/firmographic, 8 credits/phone)
        const searchBody: Record<string, any> = {
            per_page: 5, // Get a few candidates for better matching
            page: 1,
        };

        // Build search filters - skip obfuscated names (e.g., "Ar***h")
        const firstName = cleanName(params.first_name);
        const lastName = cleanName(params.last_name);
        const fullName = cleanName(params.name);

        if (firstName && lastName) {
            searchBody.q_keywords = `${firstName} ${lastName}`;
        } else if (firstName && !lastName) {
            // Only first name available (last name obfuscated)
            searchBody.q_keywords = firstName;
        } else if (fullName && !isObfuscated(fullName)) {
            searchBody.q_keywords = fullName;
        }

        // Use organization domain/name to narrow results
        if (params.domain) {
            searchBody.q_organization_domains = [params.domain];
        } else if (params.organization_name) {
            searchBody.q_organization_name = params.organization_name;
        }

        // Use job title as filter for better precision
        if (params.title && !isObfuscated(params.title)) {
            searchBody.person_titles = [params.title];
        }

        // Must have at least one meaningful search parameter
        if (!searchBody.q_keywords && !searchBody.q_organization_domains && !searchBody.q_organization_name) {
            console.log('[CREDIT-FREE] Not enough data to search - skipping');
            return null;
        }

        console.log('[CREDIT-FREE] Person enrichment via /mixed_people/api_search:', JSON.stringify(searchBody, null, 2));

        const response = await fetch(`${APOLLO_API_BASE}/mixed_people/api_search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'X-Api-Key': apiKey
            },
            body: JSON.stringify(searchBody)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Apollo Search Enrichment Error: ${response.status} - ${errorBody}`);
        }

        const data = await response.json();
        const people = data.people || [];

        if (people.length === 0) {
            console.log('[CREDIT-FREE] No results found for person search');
            return null;
        }

        // Find the best match - prioritize by name similarity if we have a name
        let bestMatch = people[0];
        if (firstName && people.length > 1) {
            const nameMatch = people.find((p: any) =>
                p.first_name?.toLowerCase() === firstName.toLowerCase()
            );
            if (nameMatch) bestMatch = nameMatch;
        }

        // 🔍 Debug: Log all available fields from the free API response
        console.log('[CREDIT-FREE] Person found:', bestMatch.name);
        console.log('[CREDIT-FREE] linkedin_url:', bestMatch.linkedin_url || '❌ NOT RETURNED');
        console.log('[CREDIT-FREE] All keys returned:', Object.keys(bestMatch).join(', '));
        if (bestMatch.organization) {
            console.log('[CREDIT-FREE] Org keys:', Object.keys(bestMatch.organization).join(', '));
            console.log('[CREDIT-FREE] Org linkedin_url:', bestMatch.organization?.linkedin_url || '❌ NOT RETURNED');
        }

        return bestMatch;
    } catch (error) {
        console.error("Apollo Credit-Free Person Enrichment Failed:", error);
        throw error;
    }
};

// ==========================================
// /people/match — ONLY for: linkedin_url
// Called ONLY when /mixed_people/api_search didn't return a LinkedIn URL
// ⚠️ نستخرج فقط linkedin_url — لا نقرأ أي حقل آخر من الاستجابة
// ==========================================

export interface ResolverResult {
    linkedin_url?: string;
}

export const resolvePersonMatch = async (params: {
    first_name?: string;
    last_name?: string;
    name?: string;
    domain?: string;
    organization_name?: string;
}, apiKey: string): Promise<ResolverResult> => {
    try {
        console.log('[MATCH] /people/match — looking for linkedin_url ONLY:', params.first_name, '@', params.organization_name || params.domain);

        const response = await fetch(`${APOLLO_API_BASE}/people/match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'X-Api-Key': apiKey
            },
            body: JSON.stringify({
                first_name: params.first_name,
                last_name: params.last_name,
                name: params.name,
                organization_name: params.organization_name,
                domain: params.domain,
                reveal_personal_emails: false,
                reveal_phone_number: false,
            })
        });

        const data = await response.json();

        // Check for credit error
        if (data?.error?.includes('insufficient credits')) {
            console.warn('[MATCH] ⚠️ NO CREDITS LEFT - /people/match requires credits!');
            return {};
        }

        if (!response.ok) {
            console.warn('[MATCH] API error:', data?.error || response.status);
            return {};
        }

        const linkedinUrl = data?.person?.linkedin_url;

        if (linkedinUrl) {
            console.log('[MATCH] ✓ LinkedIn found:', linkedinUrl);
            return { linkedin_url: linkedinUrl };
        }

        console.log('[MATCH] ✗ Person found but no LinkedIn URL in profile');
        return {};
    } catch (error) {
        console.error("[MATCH] Failed:", error);
        return {};
    }
};

// Credit-Free Bulk People Enrichment (uses /mixed_people/api_search - FREE)
// Processes each person individually via the free search endpoint
export const enrichApolloPeople = async (details: Array<{
    first_name?: string;
    last_name?: string;
    name?: string;
    email?: string;
    domain?: string;
    organization_name?: string;
    linkedin_url?: string;
    id?: string;
}>, apiKey: string): Promise<ApolloPersonFull[]> => {
    const results: ApolloPersonFull[] = [];

    // Process each person via the free /mixed_people/api_search endpoint
    for (const person of details.slice(0, 10)) {
        try {
            const result = await enrichApolloPerson(person, apiKey);
            if (result) {
                results.push(result);
            }
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
            console.error(`[CREDIT-FREE] Failed to enrich: ${person.name || person.first_name}`, error);
        }
    }

    console.log(`[CREDIT-FREE] Bulk enrichment: ${results.length}/${details.length} found`);
    return results;
};

// Credit-Free Organization Enrichment
// Strategy: Search for any person at the company via /mixed_people/api_search (FREE)
// and extract the embedded organization data from the result
export const enrichApolloOrganization = async (domain: string, apiKey: string): Promise<ApolloOrganizationFull | null> => {
    try {
        // Use the FREE /mixed_people/api_search endpoint with the company domain
        // The response includes embedded organization data with LinkedIn URL
        const searchBody = {
            q_organization_domains: [domain],
            per_page: 1, // We only need one person to get the org data
            page: 1,
            person_seniorities: ['c_suite', 'owner', 'founder', 'vp', 'director'], // Target senior people for richer org data
        };

        console.log('[CREDIT-FREE] Org enrichment via person search at domain:', domain);

        const response = await fetch(`${APOLLO_API_BASE}/mixed_people/api_search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'X-Api-Key': apiKey
            },
            body: JSON.stringify(searchBody)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Apollo Org Search Error: ${response.status} - ${errorBody}`);
        }

        const data = await response.json();
        const people = data.people || [];

        if (people.length === 0) {
            console.log('[CREDIT-FREE] No people found at domain:', domain);
            return null;
        }

        // Extract organization data from the person result
        const org = people[0].organization;
        if (org) {
            console.log('[CREDIT-FREE] Org found:', org.name, '| LinkedIn:', org.linkedin_url || 'N/A');
            return org;
        }

        console.log('[CREDIT-FREE] Person found but no org data embedded');
        return null;
    } catch (error) {
        console.error("Apollo Credit-Free Org Enrichment Failed:", error);
        throw error;
    }
};

// Credit-Free Bulk Organization Enrichment
// Processes each domain via the free person search endpoint
export const enrichApolloOrganizations = async (domains: string[], apiKey: string): Promise<ApolloOrganizationFull[]> => {
    const results: ApolloOrganizationFull[] = [];

    for (const domain of domains.slice(0, 10)) {
        try {
            const result = await enrichApolloOrganization(domain, apiKey);
            if (result) {
                results.push(result);
            }
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
            console.error(`[CREDIT-FREE] Failed to enrich org: ${domain}`, error);
        }
    }

    console.log(`[CREDIT-FREE] Bulk org enrichment: ${results.length}/${domains.length} found`);
    return results;
};

// ==========================================
// Data Transformation
// ==========================================

// Helper: Format phone numbers
const formatPhoneNumbers = (phones?: Array<{ number?: string; sanitized_number?: string }>): string => {
    if (!phones || phones.length === 0) return '';
    return phones
        .map(p => p.sanitized_number || p.number)
        .filter(Boolean)
        .join(' | ');
};

// Helper: Format employment history
const formatEmploymentHistory = (history?: Array<{ title?: string; organization_name?: string; current?: boolean; start_date?: string; end_date?: string }>): string => {
    if (!history || history.length === 0) return '';
    return history
        .map(h => {
            const period = h.current ? 'Present' : (h.end_date || '');
            return `${h.title || ''} @ ${h.organization_name || ''}${period ? ` (${h.start_date || '?'} - ${period})` : ''}`;
        })
        .filter(h => h.includes('@'))
        .join(' | ');
};

// Helper: Format technologies
const formatTechnologies = (techs?: Array<{ name: string; category?: string }> | string[]): string => {
    if (!techs || techs.length === 0) return '';
    if (typeof techs[0] === 'string') {
        return (techs as string[]).join(' | ');
    }
    return (techs as Array<{ name: string; category?: string }>)
        .map(t => t.name)
        .join(' | ');
};

// Helper: Format department headcount
const formatDepartmentHeadcount = (counts?: Record<string, number>): string => {
    if (!counts) return '';
    return Object.entries(counts)
        .filter(([_, count]) => count > 0)
        .map(([dept, count]) => `${dept}: ${count}`)
        .join(' | ');
};

// Clean value - remove empty/null/undefined
const cleanValue = (val: any): any => {
    if (val === null || val === undefined || val === '' || val === 'N/A') return undefined;
    if (typeof val === 'string' && (val.toLowerCase() === 'null' || val.toLowerCase() === 'undefined')) return undefined;
    return val;
};

// Main Transform Function - People to Staging
export const transformApolloToStaging = (data: any[], importJobId: string, type: 'people' | 'companies' = 'people'): StagingRow[] => {
    if (type === 'people') {
        return data.map((item: any) => {
            // Handle both direct person or wrapped in 'person' key
            const p: ApolloPersonFull = item.person || item;
            const org: Partial<ApolloOrganizationFull> = p.organization || {};
            const contact = p.contact || {};

            // Build comprehensive rawJson with ALL available fields
            const rawJson: Record<string, any> = {};

            // ==========================================
            // PERSON - Basic Info
            // ==========================================
            rawJson["Apollo ID"] = cleanValue(p.id);
            rawJson["Full Name"] = cleanValue(p.name) || `${p.first_name || ''} ${p.last_name || p.last_name_obfuscated || ''}`.trim();
            rawJson["First Name"] = cleanValue(p.first_name);
            rawJson["Last Name"] = cleanValue(p.last_name || p.last_name_obfuscated);
            rawJson["Job Title"] = cleanValue(p.title);
            rawJson["Headline"] = cleanValue(p.headline);
            rawJson["Photo URL"] = cleanValue(p.photo_url);

            // ==========================================
            // PERSON - Contact Info
            // ==========================================
            rawJson["Email"] = cleanValue(p.email || contact.email);
            rawJson["Email Status"] = cleanValue(p.email_status);
            rawJson["Personal Emails"] = cleanValue(p.personal_emails?.filter(Boolean).join(' | '));
            rawJson["Phone Numbers"] = cleanValue(formatPhoneNumbers(p.phone_numbers || contact.phone_numbers));
            rawJson["Mobile Phone"] = cleanValue(p.mobile_phone);
            rawJson["Corporate Phone"] = cleanValue(p.corporate_phone);
            rawJson["Direct Dial"] = cleanValue(p.direct_dial_phone);

            // ==========================================
            // PERSON - Social Links
            // ==========================================
            rawJson["LinkedIn URL"] = cleanValue(p.linkedin_url);
            rawJson["LinkedIn UID"] = cleanValue(p.linkedin_uid);
            rawJson["Twitter URL"] = cleanValue(p.twitter_url);
            rawJson["Facebook URL"] = cleanValue(p.facebook_url);
            rawJson["GitHub URL"] = cleanValue(p.github_url);

            // ==========================================
            // PERSON - Location
            // ==========================================
            rawJson["City"] = cleanValue(p.city || contact.city);
            rawJson["State"] = cleanValue(p.state || contact.state);
            rawJson["Country"] = cleanValue(p.country || contact.country);
            rawJson["Postal Code"] = cleanValue(p.postal_code);
            rawJson["Timezone"] = cleanValue(p.time_zone);
            rawJson["Location"] = [p.city || contact.city, p.state || contact.state, p.country || contact.country]
                .filter(Boolean).join(', ') || undefined;

            // ==========================================
            // PERSON - Professional Info
            // ==========================================
            rawJson["Seniority"] = cleanValue(p.seniority);
            rawJson["Departments"] = cleanValue(p.departments?.join(' | '));
            rawJson["Sub-Departments"] = cleanValue(p.subdepartments?.join(' | '));
            rawJson["Functions"] = cleanValue(p.functions?.join(' | '));

            // ==========================================
            // PERSON - Employment History
            // ==========================================
            rawJson["Employment History"] = cleanValue(formatEmploymentHistory(p.employment_history));
            rawJson["Current Employment"] = cleanValue(
                p.employment_history?.filter(h => h.current)
                    .map(h => `${h.title} @ ${h.organization_name}`)
                    .join(' | ')
            );

            // ==========================================
            // PERSON - Intent & Engagement
            // ==========================================
            rawJson["Likely to Engage"] = p.is_likely_to_engage === true ? 'Yes' : (p.is_likely_to_engage === false ? 'No' : undefined);
            rawJson["Intent Strength"] = cleanValue(p.intent_strength);
            rawJson["Last Refreshed"] = cleanValue(p.last_refreshed_at);

            // ==========================================
            // COMPANY - Basic Info
            // ==========================================
            rawJson["Company Name"] = cleanValue(org.name);
            rawJson["Company ID"] = cleanValue(org.id || p.organization_id);
            rawJson["Company Domain"] = cleanValue(org.primary_domain);
            rawJson["Company Website"] = cleanValue(org.website_url);
            rawJson["Company Blog"] = cleanValue(org.blog_url);
            rawJson["Company Logo"] = cleanValue(org.logo_url);

            // ==========================================
            // COMPANY - Social Links
            // ==========================================
            rawJson["Company LinkedIn URL"] = cleanValue(org.linkedin_url);
            rawJson["Company LinkedIn UID"] = cleanValue(org.linkedin_uid);
            rawJson["Company Twitter URL"] = cleanValue(org.twitter_url);
            rawJson["Company Facebook URL"] = cleanValue(org.facebook_url);
            rawJson["Company AngelList URL"] = cleanValue(org.angellist_url);
            rawJson["Company Crunchbase URL"] = cleanValue(org.crunchbase_url);

            // ==========================================
            // COMPANY - Contact Info
            // ==========================================
            rawJson["Company Phone"] = cleanValue(org.phone || org.primary_phone?.sanitized_number || org.primary_phone?.number);

            // ==========================================
            // COMPANY - Location
            // ==========================================
            rawJson["Company Address"] = cleanValue(org.raw_address || org.street_address);
            rawJson["Company City"] = cleanValue(org.city);
            rawJson["Company State"] = cleanValue(org.state);
            rawJson["Company Country"] = cleanValue(org.country);
            rawJson["Company Postal Code"] = cleanValue(org.postal_code);
            rawJson["Company Location"] = [org.city, org.state, org.country].filter(Boolean).join(', ') || undefined;

            // ==========================================
            // COMPANY - Industry & Keywords
            // ==========================================
            rawJson["Company Industry"] = cleanValue(org.industry);
            rawJson["Company Industries"] = cleanValue(org.industries?.join(' | '));
            rawJson["Company Keywords"] = cleanValue(org.keywords?.join(' | '));
            rawJson["Company SIC Codes"] = cleanValue(org.sic_codes?.join(' | '));
            rawJson["Company NAICS Codes"] = cleanValue(org.naics_codes?.join(' | '));

            // ==========================================
            // COMPANY - Size & Revenue
            // ==========================================
            rawJson["Company Employees"] = cleanValue(org.estimated_num_employees);
            rawJson["Company Employee Range"] = cleanValue(org.employee_count_range);
            rawJson["Company Annual Revenue"] = cleanValue(org.annual_revenue_printed || org.annual_revenue);
            rawJson["Company Founded Year"] = cleanValue(org.founded_year);

            // ==========================================
            // COMPANY - Funding
            // ==========================================
            rawJson["Company Total Funding"] = cleanValue(org.total_funding_printed || org.total_funding);
            rawJson["Company Latest Funding Amount"] = cleanValue(org.latest_funding_amount);
            rawJson["Company Latest Funding Date"] = cleanValue(org.latest_funding_date);
            rawJson["Company Latest Funding Round"] = cleanValue(org.latest_funding_round_type);

            // ==========================================
            // COMPANY - Stock Info
            // ==========================================
            rawJson["Company Stock Symbol"] = cleanValue(org.publicly_traded_symbol);
            rawJson["Company Stock Exchange"] = cleanValue(org.publicly_traded_exchange);

            // ==========================================
            // COMPANY - Technologies
            // ==========================================
            rawJson["Company Tech Stack"] = cleanValue(
                formatTechnologies(org.current_technologies) || org.technology_names?.join(' | ')
            );

            // ==========================================
            // COMPANY - Metrics
            // ==========================================
            rawJson["Company Alexa Rank"] = cleanValue(org.alexa_ranking);
            rawJson["Company Retail Locations"] = cleanValue(org.retail_location_count);
            rawJson["Company Languages"] = cleanValue(org.languages?.join(' | '));

            // ==========================================
            // COMPANY - Department Headcount
            // ==========================================
            rawJson["Company Dept Headcount"] = cleanValue(formatDepartmentHeadcount(org.departmental_head_count));

            // ==========================================
            // Metadata
            // ==========================================
            rawJson["Data Source"] = 'Apollo';
            rawJson["Import Date"] = new Date().toISOString();

            // Remove undefined values
            Object.keys(rawJson).forEach(key => {
                if (rawJson[key] === undefined) delete rawJson[key];
            });

            return {
                id: p.id || `apollo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                importJobId,
                rowStatus: 'new',
                rawJson,
                normalizedJson: {
                    firstName: p.first_name,
                    lastName: p.last_name || p.last_name_obfuscated,
                    fullName: rawJson["Full Name"],
                    email: p.email || contact.email,
                    phone: p.phone_numbers?.[0]?.sanitized_number || contact.phone_numbers?.[0]?.sanitized_number,
                    jobTitle: p.title,
                    companyName: org.name,
                    companyDomain: org.primary_domain,
                    linkedin: p.linkedin_url,
                    companyLinkedin: org.linkedin_url,
                    location: rawJson["Location"],
                    industry: org.industry,
                    seniority: p.seniority,
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            } as StagingRow;
        });
    } else {
        // Companies
        return data.map((c: ApolloOrganizationFull) => {
            const rawJson: Record<string, any> = {};

            // ==========================================
            // COMPANY - Basic Info
            // ==========================================
            rawJson["Company ID"] = cleanValue(c.id);
            rawJson["Company Name"] = cleanValue(c.name);
            rawJson["Company Domain"] = cleanValue(c.primary_domain);
            rawJson["Company Website"] = cleanValue(c.website_url);
            rawJson["Company Blog"] = cleanValue(c.blog_url);
            rawJson["Company Logo"] = cleanValue(c.logo_url);
            rawJson["Company Description"] = cleanValue((c as any).short_description || (c as any).description);

            // ==========================================
            // COMPANY - Social Links
            // ==========================================
            rawJson["Company LinkedIn URL"] = cleanValue(c.linkedin_url);
            rawJson["Company LinkedIn UID"] = cleanValue(c.linkedin_uid);
            rawJson["Company Twitter URL"] = cleanValue(c.twitter_url);
            rawJson["Company Facebook URL"] = cleanValue(c.facebook_url);
            rawJson["Company AngelList URL"] = cleanValue(c.angellist_url);
            rawJson["Company Crunchbase URL"] = cleanValue(c.crunchbase_url);

            // ==========================================
            // COMPANY - Contact Info
            // ==========================================
            rawJson["Company Phone"] = cleanValue(c.phone || c.primary_phone?.sanitized_number || c.primary_phone?.number);

            // ==========================================
            // COMPANY - Location
            // ==========================================
            rawJson["Company Address"] = cleanValue(c.raw_address || c.street_address);
            rawJson["Company City"] = cleanValue(c.city);
            rawJson["Company State"] = cleanValue(c.state);
            rawJson["Company Country"] = cleanValue(c.country);
            rawJson["Company Postal Code"] = cleanValue(c.postal_code);
            rawJson["Company Location"] = [c.city, c.state, c.country].filter(Boolean).join(', ') || undefined;

            // ==========================================
            // COMPANY - Industry & Keywords
            // ==========================================
            rawJson["Company Industry"] = cleanValue(c.industry);
            rawJson["Company Industries"] = cleanValue(c.industries?.join(' | '));
            rawJson["Company Keywords"] = cleanValue(c.keywords?.join(' | '));
            rawJson["Company SIC Codes"] = cleanValue(c.sic_codes?.join(' | '));
            rawJson["Company NAICS Codes"] = cleanValue(c.naics_codes?.join(' | '));

            // ==========================================
            // COMPANY - Size & Revenue
            // ==========================================
            rawJson["Company Employees"] = cleanValue(c.estimated_num_employees);
            rawJson["Company Employee Range"] = cleanValue(c.employee_count_range);
            rawJson["Company Annual Revenue"] = cleanValue(c.annual_revenue_printed || c.annual_revenue);
            rawJson["Company Founded Year"] = cleanValue(c.founded_year);

            // ==========================================
            // COMPANY - Funding
            // ==========================================
            rawJson["Company Total Funding"] = cleanValue(c.total_funding_printed || c.total_funding);
            rawJson["Company Latest Funding Amount"] = cleanValue(c.latest_funding_amount);
            rawJson["Company Latest Funding Date"] = cleanValue(c.latest_funding_date);
            rawJson["Company Latest Funding Round"] = cleanValue(c.latest_funding_round_type);

            // ==========================================
            // COMPANY - Stock Info
            // ==========================================
            rawJson["Company Stock Symbol"] = cleanValue(c.publicly_traded_symbol);
            rawJson["Company Stock Exchange"] = cleanValue(c.publicly_traded_exchange);

            // ==========================================
            // COMPANY - Technologies
            // ==========================================
            rawJson["Company Tech Stack"] = cleanValue(
                formatTechnologies(c.current_technologies) || c.technology_names?.join(' | ')
            );

            // ==========================================
            // COMPANY - Metrics
            // ==========================================
            rawJson["Company Alexa Rank"] = cleanValue(c.alexa_ranking);
            rawJson["Company Retail Locations"] = cleanValue(c.retail_location_count);
            rawJson["Company Languages"] = cleanValue(c.languages?.join(' | '));

            // ==========================================
            // COMPANY - Department Headcount
            // ==========================================
            rawJson["Company Dept Headcount"] = cleanValue(formatDepartmentHeadcount(c.departmental_head_count));

            // ==========================================
            // COMPANY - Intent
            // ==========================================
            rawJson["Company Intent Strength"] = cleanValue(c.intent_strength);
            rawJson["Company Has Intent Signal"] = c.has_intent_signal_account ? 'Yes' : undefined;

            // ==========================================
            // Metadata
            // ==========================================
            rawJson["Data Source"] = 'Apollo';
            rawJson["Import Date"] = new Date().toISOString();

            // Remove undefined values
            Object.keys(rawJson).forEach(key => {
                if (rawJson[key] === undefined) delete rawJson[key];
            });

            return {
                id: c.id || `apollo-org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                importJobId,
                rowStatus: 'new',
                rawJson,
                normalizedJson: {
                    companyName: c.name,
                    companyDomain: c.primary_domain,
                    website: c.website_url,
                    linkedin: c.linkedin_url,
                    phone: c.phone || c.primary_phone?.sanitized_number,
                    industry: c.industry,
                    employees: c.estimated_num_employees,
                    location: [c.city, c.country].filter(Boolean).join(', '),
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            } as StagingRow;
        });
    }
};

// ==========================================
// Apollo API Reference - All Available Fields
// ==========================================
/*
PERSON FIELDS:
- id (Apollo ID)
- first_name, last_name, name
- title, headline
- email, email_status, personal_emails[]
- phone_numbers[] (number, sanitized_number, type)
- mobile_phone, corporate_phone, direct_dial_phone
- linkedin_url, linkedin_uid
- twitter_url, facebook_url, github_url
- city, state, country, postal_code, time_zone
- seniority (owner/founder/c_suite/partner/vp/head/director/manager/senior/entry/intern)
- departments[], subdepartments[], functions[]
- employment_history[] (title, organization_name, current, start_date, end_date)
- photo_url
- is_likely_to_engage, intent_strength
- organization (embedded company object)
- last_refreshed_at, revealed_for_current_team

ORGANIZATION FIELDS:
- id (Apollo ID)
- name
- website_url, blog_url, primary_domain
- linkedin_url, linkedin_uid
- twitter_url, facebook_url, angellist_url, crunchbase_url
- phone, primary_phone (number, sanitized_number, source)
- raw_address, street_address, city, state, country, postal_code
- industry, industries[], keywords[]
- sic_codes[], naics_codes[]
- founded_year, logo_url
- estimated_num_employees, employee_count_range
- annual_revenue, annual_revenue_printed
- total_funding, total_funding_printed
- latest_funding_amount, latest_funding_date, latest_funding_round_type
- publicly_traded_symbol, publicly_traded_exchange
- alexa_ranking, retail_location_count
- languages[]
- technology_names[], current_technologies[] (uid, name, category)
- departmental_head_count (engineering, sales, marketing, etc.)
- intent_strength, show_intent, has_intent_signal_account

SEARCH FILTERS:
- person_titles[], person_locations[], person_seniorities[]
- q_keywords, include_similar_titles
- contact_email_status[] (verified/unverified/likely to engage/unavailable)
- q_organization_domains_list[], organization_locations[]
- organization_num_employees_ranges[]
- revenue_range (min/max)
- currently_using_any_of_technology_uids[]
- q_organization_job_titles[], organization_job_locations[]
- latest_funding_amount_range (min/max)
- total_funding_range (min/max)
- page, per_page (max 100 per page, 500 pages = 50,000 records)
*/
