// ==========================================
// Lemlist API Service
// ==========================================

import {
    LemlistPerson,
    LemlistSearchParams,
    LemlistSearchResponse,
    LemlistEnrichmentParams,
    LemlistEnrichmentResponse,
    LemlistEnrichmentResult,
    LemlistFilterOption,
    EnrichmentStrategy,
    SmartEnrichmentOptions,
    ParsedEnrichmentResult,
} from '@/types/lemlist';

// Use proxy to avoid CORS issues (configured in vite.config.ts)
const LEMLIST_API_BASE = '/api/lemlist';

// Create Basic Auth header
const createAuthHeader = (apiKey: string): string => {
    // Lemlist uses Basic auth with API key as password (username can be empty or 'api')
    const credentials = Buffer.from(`:${apiKey}`).toString('base64');
    return `Basic ${credentials}`;
};

// Browser-compatible Base64 encoding
const createAuthHeaderBrowser = (apiKey: string): string => {
    const credentials = btoa(`:${apiKey}`);
    return `Basic ${credentials}`;
};

// ==========================================
// Search People Database
// POST /database/people
// ==========================================
export const searchLemlistPeople = async (
    params: LemlistSearchParams,
    apiKey: string
): Promise<LemlistSearchResponse> => {
    console.log('[LEMLIST] Searching people database:', params);

    // Ensure each filter has the required 'out' field
    const normalizedFilters = params.filters.map(filter => ({
        ...filter,
        out: filter.out || [],
    }));

    const response = await fetch(`${LEMLIST_API_BASE}/database/people`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': createAuthHeaderBrowser(apiKey),
        },
        body: JSON.stringify({
            filters: normalizedFilters,
            page: params.page || 1,
            size: params.size || 25,
            excludes: params.excludes,
            search: params.search,
        }),
    });

    const data = await response.json();

    // Check for error in response (Lemlist sometimes returns 200 with error)
    if (data.error) {
        console.error('[LEMLIST] Search failed:', data);
        throw new Error(data.error);
    }

    if (!response.ok) {
        console.error('[LEMLIST] Search failed:', data);
        throw new Error(data.message || data.error || `Lemlist API error: ${response.status}`);
    }
    console.log('[LEMLIST] Search results:', data.total, 'people found');
    return data;
};

// ==========================================
// Enrich Data
// POST /enrich
// ==========================================
export const enrichLemlistData = async (
    params: LemlistEnrichmentParams,
    apiKey: string
): Promise<LemlistEnrichmentResponse> => {
    console.log('[LEMLIST] Starting enrichment for:', params.firstName, params.lastName);

    const queryParams = new URLSearchParams();

    if (params.findEmail) queryParams.append('findEmail', 'true');
    if (params.verifyEmail) queryParams.append('verifyEmail', 'true');
    if (params.linkedinEnrichment) queryParams.append('linkedinEnrichment', 'true');
    if (params.findPhone) queryParams.append('findPhone', 'true');
    if (params.email) queryParams.append('email', params.email);
    if (params.linkedinUrl) queryParams.append('linkedinUrl', params.linkedinUrl);
    if (params.firstName) queryParams.append('firstName', params.firstName);
    if (params.lastName) queryParams.append('lastName', params.lastName);
    if (params.companyDomain) queryParams.append('companyDomain', params.companyDomain);
    if (params.companyName) queryParams.append('companyName', params.companyName);
    if (params.webhookUrl) queryParams.append('webhookUrl', params.webhookUrl);

    const response = await fetch(`${LEMLIST_API_BASE}/enrich?${queryParams.toString()}`, {
        method: 'POST',
        headers: {
            'Authorization': createAuthHeaderBrowser(apiKey),
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[LEMLIST] Enrichment request failed:', errorData);
        throw new Error(errorData.message || `Lemlist enrichment error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[LEMLIST] Enrichment started, ID:', data.id);
    return data;
};

// ==========================================
// Get Enrichment Result
// GET /enrich/:id
// ==========================================
export const getLemlistEnrichmentResult = async (
    enrichmentId: string,
    apiKey: string
): Promise<LemlistEnrichmentResult> => {
    console.log('[LEMLIST] Fetching enrichment result:', enrichmentId);

    const response = await fetch(`${LEMLIST_API_BASE}/enrich/${enrichmentId}`, {
        method: 'GET',
        headers: {
            'Authorization': createAuthHeaderBrowser(apiKey),
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to get enrichment: ${response.status}`);
    }

    return response.json();
};

// ==========================================
// Check Enrichment Credits
// GET /team/credits
// ==========================================
export const checkLemlistCredits = async (apiKey: string): Promise<{
    total: number;
    freemium: number;
    subscription: number;
    gifted: number;
    paid: number;
}> => {
    const response = await fetch(`${LEMLIST_API_BASE}/team/credits`, {
        method: 'GET',
        headers: {
            'Authorization': createAuthHeaderBrowser(apiKey),
        },
    });

    if (!response.ok) {
        return { total: 0, freemium: 0, subscription: 0, gifted: 0, paid: 0 };
    }

    const data = await response.json();
    return data.details?.remaining || { total: data.credits || 0, freemium: 0, subscription: 0, gifted: 0, paid: 0 };
};

// ==========================================
// Get Available Filters
// GET /database/people/filters
// ==========================================
export const getLemlistFilters = async (apiKey: string): Promise<LemlistFilterOption[]> => {
    console.log('[LEMLIST] Fetching available filters');

    const response = await fetch(`${LEMLIST_API_BASE}/database/people/filters`, {
        method: 'GET',
        headers: {
            'Authorization': createAuthHeaderBrowser(apiKey),
        },
    });

    if (!response.ok) {
        console.warn('[LEMLIST] Could not fetch filters, using defaults');
        return getDefaultFilters();
    }

    return response.json();
};

// Default filters if API doesn't return them
const getDefaultFilters = (): LemlistFilterOption[] => [
    { filterId: 'country', label: 'Country', type: 'multiselect' },
    { filterId: 'state', label: 'State/Region', type: 'multiselect' },
    { filterId: 'city', label: 'City', type: 'multiselect' },
    { filterId: 'industry', label: 'Industry', type: 'multiselect' },
    { filterId: 'company_size', label: 'Company Size', type: 'multiselect' },
    { filterId: 'department', label: 'Department', type: 'multiselect' },
    { filterId: 'seniority', label: 'Seniority', type: 'multiselect' },
    { filterId: 'title', label: 'Job Title', type: 'text' },
    { filterId: 'company_name', label: 'Company Name', type: 'text' },
    { filterId: 'skills', label: 'Skills', type: 'multiselect' },
];

// ==========================================
// Transform Lemlist Person to StagingRow format
// ==========================================
export const transformLemlistPersonToRawJson = (person: LemlistPerson): Record<string, any> => {
    const currentExp = person.experiences?.[0];

    return {
        // Personal Info
        'Full Name': person.full_name,
        'First Name': person.first_name || person.full_name?.split(' ')[0],
        'Last Name': person.last_name || person.full_name?.split(' ').slice(1).join(' '),
        'Headline': person.headline,
        'Summary': person.summary,

        // Contact
        'Email': person.email,
        'Phone': person.phone,
        'LinkedIn URL': person.lead_linkedin_url,
        'LinkedIn Short': person.linkedin_short,

        // Location
        'Country': person.country,
        'State': person.state,
        'Location': person.location,

        // Professional
        'Job Title': currentExp?.title || currentExp?.title_normalized,
        'Department': person.department,
        'Seniority': person.years_of_exp_bucket,

        // Company (from current experience)
        'Company Name': currentExp?.company_name || person.current_exp_company_name,
        'Company Domain': currentExp?.company_domain,
        'Company Website': currentExp?.company_website_url,
        'Company LinkedIn URL': currentExp?.company_linkedin_url,
        'Company Industry': currentExp?.company_industry,
        'Company Size': currentExp?.company_size,
        'Company Employees': currentExp?.company_employee_count,

        // Experience
        'Experience Count': person.experience_count,
        'Years of Experience': person.years_of_exp_bucket,
        'Current Role Duration': currentExp?.duration,
        'Employment History': person.experiences?.map(exp => ({
            company: exp.company_name,
            title: exp.title,
            duration: exp.duration,
            location: exp.location,
        })),

        // Skills & Interests
        'Skills': person.skills?.join(', '),
        'Interests': person.interests?.join(', '),
        'Languages': person.languages?.map(l => l.language).join(', '),

        // Scores
        'Lead Quality Score': person.lead_quality_score,
        'Connections Count': person.connections_count,
        'Connections Bucket': person.connections_count_bucket,

        // Meta
        'Lemlist Lead ID': person.lead_id,
        'Data Source': 'Lemlist People Database',
        'Import Date': new Date().toISOString(),
    };
};

// ==========================================
// Batch Transform for multiple people
// ==========================================
export const transformLemlistPeopleToRows = (
    people: LemlistPerson[]
): Array<{ rawJson: Record<string, any>; normalizedJson: Record<string, any> }> => {
    return people.map(person => {
        const rawJson = transformLemlistPersonToRawJson(person);
        const currentExp = person.experiences?.[0];

        return {
            rawJson,
            normalizedJson: {
                firstName: rawJson['First Name'],
                lastName: rawJson['Last Name'],
                fullName: rawJson['Full Name'],
                email: rawJson['Email'],
                phone: rawJson['Phone'],
                linkedin: rawJson['LinkedIn URL'],
                jobTitle: rawJson['Job Title'],
                companyName: rawJson['Company Name'],
                companyDomain: rawJson['Company Domain'],
                companyLinkedin: rawJson['Company LinkedIn URL'],
                location: rawJson['Location'],
                country: rawJson['Country'],
                industry: rawJson['Company Industry'],
                seniority: rawJson['Seniority'],
            },
        };
    });
};

// ==========================================
// Smart Enrichment Functions
// Bypass LinkedIn login requirement using alternative data inputs
// ==========================================

// Helper to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Determine the best enrichment strategy based on available data
// Prioritizes strategies that do NOT require LinkedIn login
const selectEnrichmentStrategy = (
    data: {
        linkedinUrl?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        companyDomain?: string;
        companyName?: string;
    }
): EnrichmentStrategy => {
    // Priority 1: Name + Company Domain (most reliable for email/phone, no LinkedIn needed)
    if (data.firstName && data.lastName && data.companyDomain) {
        return 'name_company_domain';
    }

    // Priority 2: Name + Company Name (no LinkedIn needed)
    if (data.firstName && data.lastName && data.companyName) {
        return 'name_company_name';
    }

    // Priority 3: Email only (can reverse lookup, no LinkedIn needed)
    if (data.email) {
        return 'email_only';
    }

    // Priority 4: LinkedIn URL (last resort - may require LinkedIn login for full enrichment)
    if (data.linkedinUrl) {
        return 'linkedin_url';
    }

    // Default to name + company name as last resort
    return 'name_company_name';
};

// Build enrichment params based on strategy
const buildEnrichmentParams = (
    data: {
        linkedinUrl?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        companyDomain?: string;
        companyName?: string;
    },
    strategy: EnrichmentStrategy,
    options: SmartEnrichmentOptions
): LemlistEnrichmentParams => {
    const params: LemlistEnrichmentParams = {
        findEmail: options.findEmail ?? true,
        findPhone: options.findPhone ?? true,
        // Default linkedinEnrichment to false to avoid requiring LinkedIn login
        linkedinEnrichment: options.linkedinEnrichment ?? false,
        verifyEmail: options.verifyEmail ?? false,
    };

    switch (strategy) {
        case 'linkedin_url':
            params.linkedinUrl = data.linkedinUrl;
            // Also pass name if available for better matching
            if (data.firstName) params.firstName = data.firstName;
            if (data.lastName) params.lastName = data.lastName;
            // Keep linkedinEnrichment as set by options (defaults to false)
            // to avoid LinkedIn login requirement
            break;

        case 'name_company_domain':
            params.firstName = data.firstName;
            params.lastName = data.lastName;
            params.companyDomain = data.companyDomain;
            // Also include company name if available
            if (data.companyName) params.companyName = data.companyName;
            break;

        case 'name_company_name':
            params.firstName = data.firstName;
            params.lastName = data.lastName;
            params.companyName = data.companyName;
            // Include domain if available
            if (data.companyDomain) params.companyDomain = data.companyDomain;
            break;

        case 'email_only':
            params.email = data.email;
            // Still pass name/company if we have them for better enrichment
            if (data.firstName) params.firstName = data.firstName;
            if (data.lastName) params.lastName = data.lastName;
            if (data.companyDomain) params.companyDomain = data.companyDomain;
            if (data.companyName) params.companyName = data.companyName;
            break;

        case 'auto':
        default:
            // Include all available data for maximum enrichment potential
            if (data.linkedinUrl) params.linkedinUrl = data.linkedinUrl;
            if (data.email) params.email = data.email;
            if (data.firstName) params.firstName = data.firstName;
            if (data.lastName) params.lastName = data.lastName;
            if (data.companyDomain) params.companyDomain = data.companyDomain;
            if (data.companyName) params.companyName = data.companyName;
            break;
    }

    return params;
};

// Parse the enrichment result into a normalized format
export const parseEnrichmentResult = (
    result: LemlistEnrichmentResult,
    enrichmentId: string
): ParsedEnrichmentResult => {
    // Handle the new API response format
    if (result.data && result.data.length > 0) {
        const item = result.data[0];
        const emailData = item.data?.find_email;
        const phoneData = item.data?.find_phone;
        const linkedinData = item.data?.linkedin_enrichment;

        const currentPosition = linkedinData?.positionGroups?.[0];
        const currentRole = currentPosition?.profilePositions?.[0];

        return {
            success: true,
            enrichmentId: item.id || enrichmentId,
            email: emailData?.email,
            emailStatus: emailData?.status,
            phone: phoneData?.phone,
            linkedinUrl: linkedinData?.linkedinUrl,
            firstName: linkedinData?.firstName,
            lastName: linkedinData?.lastName,
            fullName: linkedinData?.firstName && linkedinData?.lastName
                ? `${linkedinData.firstName} ${linkedinData.lastName}`
                : undefined,
            picture: linkedinData?.picture,
            tagline: linkedinData?.tagline,
            summary: linkedinData?.summary,
            location: linkedinData?.locationName,
            skills: linkedinData?.skills?.split(', ').filter(Boolean),
            languages: linkedinData?.languages?.split(', ').filter(Boolean),
            currentCompany: currentPosition?.company ? {
                name: currentPosition.company.name,
                domain: currentPosition.company.domain,
                linkedinUrl: currentPosition.company.linkedinUrl,
                industry: currentPosition.company.industry,
                size: currentPosition.company.size,
                employeeCount: currentPosition.company.employeesOnLinkedin,
                website: currentPosition.company.website,
                logo: currentPosition.company.logo,
                headquarters: currentPosition.company.headQuarter,
                foundedYear: currentPosition.company.foundedOn,
            } : undefined,
            currentPosition: currentRole ? {
                title: currentRole.title,
                description: currentRole.description,
                startDate: currentRole.date?.start,
            } : undefined,
            employmentHistory: linkedinData?.positionGroups?.flatMap(group =>
                group.profilePositions?.map(pos => ({
                    companyName: pos.companyName || group.company?.name,
                    title: pos.title,
                    startDate: pos.date?.start,
                    endDate: pos.date?.end,
                })) || []
            ),
            rawData: result,
        };
    }

    // Handle legacy/simple response format
    return {
        success: result.status === 'completed' || result.type === 'enrichmentDone',
        enrichmentId,
        email: result.email,
        emailStatus: result.emailStatus,
        phone: result.phone,
        linkedinUrl: result.linkedinUrl,
        firstName: result.firstName,
        lastName: result.lastName,
        fullName: result.firstName && result.lastName
            ? `${result.firstName} ${result.lastName}`
            : undefined,
        location: result.location,
        currentCompany: result.companyName ? {
            name: result.companyName,
            domain: result.companyDomain,
        } : undefined,
        currentPosition: result.title ? {
            title: result.title,
        } : undefined,
        rawData: result,
        error: result.error,
    };
};

// ==========================================
// Smart Enrichment - Main Function
// Automatically selects best strategy to bypass LinkedIn login
// ==========================================
export const smartEnrichContact = async (
    data: {
        linkedinUrl?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        companyDomain?: string;
        companyName?: string;
    },
    apiKey: string,
    options: SmartEnrichmentOptions = {}
): Promise<ParsedEnrichmentResult> => {
    const {
        strategy = 'auto',
        pollForResult = true,
        pollTimeoutMs = 60000, // 60 seconds default
        pollIntervalMs = 2000, // 2 seconds between polls
    } = options;

    // Select strategy
    const selectedStrategy = strategy === 'auto'
        ? selectEnrichmentStrategy(data)
        : strategy;

    console.log(`[LEMLIST] Smart enrichment using strategy: ${selectedStrategy}`);
    console.log('[LEMLIST] Input data:', {
        hasLinkedIn: !!data.linkedinUrl,
        hasEmail: !!data.email,
        hasName: !!(data.firstName && data.lastName),
        hasCompanyDomain: !!data.companyDomain,
        hasCompanyName: !!data.companyName,
    });

    // Build params
    const params = buildEnrichmentParams(data, selectedStrategy, options);

    try {
        // Start enrichment
        const enrichResponse = await enrichLemlistData(params, apiKey);
        const enrichmentId = enrichResponse.id;

        if (!pollForResult) {
            return {
                success: true,
                enrichmentId,
            };
        }

        // Poll for results
        const startTime = Date.now();
        let attempts = 0;

        while (Date.now() - startTime < pollTimeoutMs) {
            attempts++;
            await delay(pollIntervalMs);

            try {
                const result = await getLemlistEnrichmentResult(enrichmentId, apiKey);
                console.log(`[LEMLIST] Poll attempt ${attempts}, status:`, result.type || result.status);

                // Check if completed
                if (result.type === 'enrichmentDone' || result.status === 'completed') {
                    return parseEnrichmentResult(result, enrichmentId);
                }

                // Check if failed
                if (result.type === 'enrichmentFailed' || result.status === 'failed') {
                    return {
                        success: false,
                        enrichmentId,
                        error: result.error || 'Enrichment failed',
                        rawData: result,
                    };
                }
            } catch (pollError) {
                console.warn(`[LEMLIST] Poll attempt ${attempts} failed:`, pollError);
                // Continue polling on non-fatal errors
            }
        }

        // Timeout
        return {
            success: false,
            enrichmentId,
            error: `Enrichment timed out after ${pollTimeoutMs}ms`,
        };
    } catch (error) {
        console.error('[LEMLIST] Smart enrichment failed:', error);
        return {
            success: false,
            enrichmentId: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};

// ==========================================
// Batch Smart Enrichment
// Enriches multiple contacts with rate limiting
// ==========================================
export const batchSmartEnrich = async (
    contacts: Array<{
        linkedinUrl?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        companyDomain?: string;
        companyName?: string;
    }>,
    apiKey: string,
    options: SmartEnrichmentOptions & {
        batchDelayMs?: number;
        onProgress?: (completed: number, total: number, result: ParsedEnrichmentResult) => void;
    } = {}
): Promise<ParsedEnrichmentResult[]> => {
    const { batchDelayMs = 1000, onProgress, ...enrichOptions } = options;
    const results: ParsedEnrichmentResult[] = [];

    console.log(`[LEMLIST] Starting batch enrichment for ${contacts.length} contacts`);

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        try {
            const result = await smartEnrichContact(contact, apiKey, enrichOptions);
            results.push(result);

            if (onProgress) {
                onProgress(i + 1, contacts.length, result);
            }
        } catch (error) {
            const errorResult: ParsedEnrichmentResult = {
                success: false,
                enrichmentId: '',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
            results.push(errorResult);

            if (onProgress) {
                onProgress(i + 1, contacts.length, errorResult);
            }
        }

        // Rate limiting between requests (except for last one)
        if (i < contacts.length - 1) {
            await delay(batchDelayMs);
        }
    }

    console.log(`[LEMLIST] Batch enrichment completed. Success: ${results.filter(r => r.success).length}/${results.length}`);
    return results;
};

// ==========================================
// Try Multiple Strategies
// Attempts different enrichment methods until one succeeds
// ==========================================
export const enrichWithFallback = async (
    data: {
        linkedinUrl?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        companyDomain?: string;
        companyName?: string;
    },
    apiKey: string,
    options: SmartEnrichmentOptions = {}
): Promise<ParsedEnrichmentResult> => {
    // Define strategy order based on available data
    // Prioritize strategies that don't require LinkedIn login
    const strategies: EnrichmentStrategy[] = [];

    if (data.firstName && data.lastName && data.companyDomain) {
        strategies.push('name_company_domain');
    }
    if (data.firstName && data.lastName && data.companyName) {
        strategies.push('name_company_name');
    }
    if (data.email) {
        strategies.push('email_only');
    }
    // LinkedIn URL as last resort (may require LinkedIn login)
    if (data.linkedinUrl) {
        strategies.push('linkedin_url');
    }

    if (strategies.length === 0) {
        return {
            success: false,
            enrichmentId: '',
            error: 'Insufficient data for enrichment. Need at least: LinkedIn URL, email, or name + company.',
        };
    }

    console.log(`[LEMLIST] Enrichment with fallback. Strategies to try: ${strategies.join(' -> ')}`);

    for (const strategy of strategies) {
        console.log(`[LEMLIST] Trying strategy: ${strategy}`);

        const result = await smartEnrichContact(data, apiKey, { ...options, strategy });

        // Check if we got meaningful results
        if (result.success && (result.email || result.phone || result.linkedinUrl)) {
            console.log(`[LEMLIST] Strategy ${strategy} succeeded`);
            return result;
        }

        console.log(`[LEMLIST] Strategy ${strategy} did not return usable data, trying next...`);
    }

    // Return last result even if not successful
    return {
        success: false,
        enrichmentId: '',
        error: 'All enrichment strategies failed to return usable data',
    };
};

// ==========================================
// Quick Enrichment Helpers
// Convenience functions for common use cases
// ==========================================

// Enrich by email only - no LinkedIn needed
export const enrichByEmail = (email: string, apiKey: string, options?: SmartEnrichmentOptions) =>
    smartEnrichContact({ email }, apiKey, { ...options, strategy: 'email_only' });

// Enrich by name and company domain - no LinkedIn needed
export const enrichByNameAndDomain = (
    firstName: string,
    lastName: string,
    companyDomain: string,
    apiKey: string,
    options?: SmartEnrichmentOptions
) => smartEnrichContact(
    { firstName, lastName, companyDomain },
    apiKey,
    { ...options, strategy: 'name_company_domain' }
);

// Enrich by name and company name - no LinkedIn needed
export const enrichByNameAndCompany = (
    firstName: string,
    lastName: string,
    companyName: string,
    apiKey: string,
    options?: SmartEnrichmentOptions
) => smartEnrichContact(
    { firstName, lastName, companyName },
    apiKey,
    { ...options, strategy: 'name_company_name' }
);

// Enrich by LinkedIn URL - direct method
export const enrichByLinkedIn = (
    linkedinUrl: string,
    apiKey: string,
    options?: SmartEnrichmentOptions
) => smartEnrichContact(
    { linkedinUrl },
    apiKey,
    { ...options, strategy: 'linkedin_url' }
);
