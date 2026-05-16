/**
 * Prospeo API Service
 *
 * Provides person enrichment with mobile phone numbers using Prospeo's Enrich Person API.
 *
 * Credit Usage:
 * - Person data + company data + free email: 1 credit per match
 * - Mobile phone enrichment: 10 credits per match
 * - No charge if no results found
 * - No charge for duplicate enrichments (lifetime)
 *
 * API Docs: https://prospeo.io/api/enrich-person
 */

const PROSPEO_API_URL = 'https://api.prospeo.io';

// ==========================================
// Prospeo API Types
// ==========================================

export interface ProspeoEnrichRequest {
    data: ProspeoPersonData;
    only_verified_email?: boolean;
    enrich_mobile?: boolean;
    only_verified_mobile?: boolean;
}

export interface ProspeoPersonData {
    first_name?: string;
    last_name?: string;
    full_name?: string;
    linkedin_url?: string;
    email?: string;
    company_name?: string;
    company_website?: string;
    company_linkedin_url?: string;
    person_id?: string; // From Search Person API
}

export interface ProspeoMobile {
    status: 'VERIFIED' | 'UNVERIFIED' | 'INVALID' | string;
    revealed: boolean;
    mobile?: string;
    mobile_national?: string;
    mobile_international?: string;
    mobile_country?: string;
    mobile_country_code?: string;
}

export interface ProspeoEmail {
    status: 'VERIFIED' | 'UNVERIFIED' | 'INVALID' | string;
    revealed: boolean;
    email?: string;
    verification_method?: string;
    email_mx_provider?: string;
}

export interface ProspeoLocation {
    country?: string;
    country_code?: string;
    state?: string;
    city?: string;
    time_zone?: string;
    time_zone_offset?: number;
}

export interface ProspeoJobHistory {
    title?: string;
    company_name?: string;
    logo_url?: string;
    current?: boolean;
    start_year?: number;
    start_month?: number;
    end_year?: number | null;
    end_month?: number | null;
    duration_in_months?: number;
    departments?: string[];
    seniority?: string;
    company_id?: string;
    job_key?: string;
}

export interface ProspeoFundingEvent {
    amount?: number | null;
    amount_printed?: string | null;
    raised_at?: string;
    stage?: string;
    link?: string;
}

export interface ProspeoTechnology {
    name: string;
    category: string;
}

export interface ProspeoCompany {
    company_id?: string;
    name?: string;
    website?: string;
    domain?: string;
    other_websites?: string[];
    description?: string;
    description_seo?: string;
    description_ai?: string;
    type?: string; // e.g., "Private", "Public"
    industry?: string;
    employee_count?: number;
    employee_range?: string;
    location?: ProspeoLocation;
    sic_codes?: string[];
    naics_codes?: string[];
    email_tech?: {
        domain?: string;
        mx_provider?: string;
    };
    linkedin_url?: string;
    twitter_url?: string;
    facebook_url?: string;
    crunchbase_url?: string;
    instagram_url?: string;
    youtube_url?: string;
    phone_hq?: {
        phone_hq?: string;
        phone_hq_national?: string;
        phone_hq_international?: string;
        phone_hq_country?: string;
        phone_hq_country_code?: string;
    };
    linkedin_id?: string | null;
    founded?: number;
    revenue_range?: {
        min?: number;
        max?: number;
    };
    revenue_range_printed?: string;
    keywords?: string[];
    logo_url?: string;
    attributes?: {
        is_b2b?: boolean;
        has_demo?: boolean;
        has_free_trial?: boolean;
        has_downloadable?: boolean;
        has_mobile_apps?: boolean;
        has_online_reviews?: boolean;
        has_pricing?: boolean;
    };
    funding?: {
        count?: number;
        total_funding?: number;
        total_funding_printed?: string;
        latest_funding_date?: string;
        latest_funding_stage?: string;
        funding_events?: ProspeoFundingEvent[];
    };
    technology?: {
        count?: number;
        technology_names?: string[];
        technology_list?: ProspeoTechnology[];
    };
    job_postings?: {
        active_count?: number;
        active_titles?: string[];
    };
}

export interface ProspeoPersonResult {
    person_id?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    linkedin_url?: string;
    current_job_title?: string;
    current_job_key?: string | null;
    headline?: string;
    linkedin_member_id?: string | null;
    last_job_change_detected_at?: string | null;
    job_history?: ProspeoJobHistory[];
    mobile?: ProspeoMobile;
    email?: ProspeoEmail;
    location?: ProspeoLocation;
    skills?: string[];
}

export interface ProspeoEnrichResponse {
    error: boolean;
    error_code?: string;
    free_enrichment?: boolean;
    person?: ProspeoPersonResult;
    company?: ProspeoCompany;
}

// ==========================================
// Error Types
// ==========================================

export type ProspeoErrorCode =
    | 'NO_MATCH'
    | 'INVALID_DATAPOINTS'
    | 'INSUFFICIENT_CREDITS'
    | 'INVALID_API_KEY'
    | 'RATE_LIMITED'
    | 'INVALID_REQUEST'
    | 'INTERNAL_ERROR';

export class ProspeoError extends Error {
    constructor(
        public code: ProspeoErrorCode,
        public httpStatus: number,
        message: string
    ) {
        super(message);
        this.name = 'ProspeoError';
    }
}

// ==========================================
// Main Service Functions
// ==========================================

/**
 * Enrich a person with Prospeo API
 *
 * Minimum requirements for matching:
 * - first_name + last_name + (company_name OR company_website OR company_linkedin_url)
 * - full_name + (company_name OR company_website OR company_linkedin_url)
 * - linkedin_url
 * - email
 * - person_id
 *
 * @param apiKey - Prospeo API key (X-KEY header)
 * @param data - Person data for matching
 * @param options - Enrichment options
 */
export const enrichProspecoPerson = async (
    apiKey: string,
    data: ProspeoPersonData,
    options: {
        enrichMobile?: boolean;
        onlyVerifiedEmail?: boolean;
        onlyVerifiedMobile?: boolean;
    } = {}
): Promise<ProspeoEnrichResponse> => {
    // Validate minimum requirements
    const hasLinkedIn = !!data.linkedin_url;
    const hasEmail = !!data.email;
    const hasPersonId = !!data.person_id;
    const hasFullName = !!data.full_name;
    const hasFirstAndLast = !!data.first_name && !!data.last_name;
    const hasCompanyIdentifier = !!data.company_name || !!data.company_website || !!data.company_linkedin_url;

    const meetRequirements =
        hasLinkedIn ||
        hasEmail ||
        hasPersonId ||
        ((hasFullName || hasFirstAndLast) && hasCompanyIdentifier);

    if (!meetRequirements) {
        throw new ProspeoError(
            'INVALID_DATAPOINTS',
            400,
            'Minimum requirements not met. Need: linkedin_url OR email OR (name + company identifier)'
        );
    }

    const requestBody: ProspeoEnrichRequest = {
        data: data,
        enrich_mobile: options.enrichMobile ?? true, // Default to true for mobile enrichment
        only_verified_email: options.onlyVerifiedEmail ?? false,
        only_verified_mobile: options.onlyVerifiedMobile ?? false,
    };

    console.log('[PROSPEO] Enriching person:', {
        name: data.full_name || `${data.first_name} ${data.last_name}`,
        company: data.company_name || data.company_website,
        enrichMobile: requestBody.enrich_mobile,
    });

    try {
        const response = await fetch(`${PROSPEO_API_URL}/enrich-person`, {
            method: 'POST',
            headers: {
                'X-KEY': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();

        // Handle error responses
        if (!response.ok || responseData.error) {
            const errorCode = responseData.error_code as ProspeoErrorCode;
            console.error('[PROSPEO] API Error:', errorCode, response.status);

            throw new ProspeoError(
                errorCode || 'INTERNAL_ERROR',
                response.status,
                `Prospeo API Error: ${errorCode || 'Unknown error'}`
            );
        }

        console.log('[PROSPEO] Enrichment successful:', {
            personId: responseData.person?.person_id,
            hasMobile: !!responseData.person?.mobile?.mobile,
            mobileRevealed: responseData.person?.mobile?.revealed,
            hasEmail: !!responseData.person?.email?.email,
            freeEnrichment: responseData.free_enrichment,
        });

        return responseData;
    } catch (error) {
        if (error instanceof ProspeoError) {
            throw error;
        }
        console.error('[PROSPEO] Request failed:', error);
        throw new ProspeoError('INTERNAL_ERROR', 500, `Prospeo request failed: ${(error as Error).message}`);
    }
};

/**
 * Batch enrich multiple persons with Prospeo
 *
 * Note: For better performance, consider using Prospeo's Bulk Enrich endpoint
 * which allows up to 50 persons at once.
 */
export const batchEnrichProspeoPersons = async (
    apiKey: string,
    persons: ProspeoPersonData[],
    options: {
        enrichMobile?: boolean;
        onlyVerifiedEmail?: boolean;
        onlyVerifiedMobile?: boolean;
        onProgress?: (current: number, total: number, result: ProspeoEnrichResponse | null) => void;
        delayMs?: number;
    } = {}
): Promise<{
    results: Array<{ data: ProspeoPersonData; result: ProspeoEnrichResponse | null; error?: string }>;
    summary: {
        total: number;
        enriched: number;
        withMobile: number;
        withEmail: number;
        failed: number;
        freeEnrichments: number;
    };
}> => {
    const results: Array<{ data: ProspeoPersonData; result: ProspeoEnrichResponse | null; error?: string }> = [];
    let enriched = 0;
    let withMobile = 0;
    let withEmail = 0;
    let failed = 0;
    let freeEnrichments = 0;

    for (let i = 0; i < persons.length; i++) {
        const person = persons[i];

        try {
            const result = await enrichProspecoPerson(apiKey, person, {
                enrichMobile: options.enrichMobile,
                onlyVerifiedEmail: options.onlyVerifiedEmail,
                onlyVerifiedMobile: options.onlyVerifiedMobile,
            });

            results.push({ data: person, result });
            enriched++;

            if (result.person?.mobile?.revealed && result.person?.mobile?.mobile) {
                withMobile++;
            }
            if (result.person?.email?.revealed && result.person?.email?.email) {
                withEmail++;
            }
            if (result.free_enrichment) {
                freeEnrichments++;
            }

            if (options.onProgress) {
                options.onProgress(i + 1, persons.length, result);
            }
        } catch (error) {
            const errorMessage = (error as Error).message;
            results.push({ data: person, result: null, error: errorMessage });
            failed++;

            if (options.onProgress) {
                options.onProgress(i + 1, persons.length, null);
            }
        }

        // Delay between requests to avoid rate limiting
        if (i < persons.length - 1) {
            await new Promise(resolve => setTimeout(resolve, options.delayMs ?? 500));
        }
    }

    return {
        results,
        summary: {
            total: persons.length,
            enriched,
            withMobile,
            withEmail,
            failed,
            freeEnrichments,
        },
    };
};

// ==========================================
// Data Transformation Helpers
// ==========================================

/**
 * Transform Prospeo enrichment result to rawJson format compatible with StagingRow
 */
export const transformProspeoToRawJson = (
    response: ProspeoEnrichResponse,
    existingRaw: Record<string, any> = {}
): Record<string, any> => {
    const result: Record<string, any> = { ...existingRaw };
    const person = response.person;
    const company = response.company;

    if (!person) return result;

    // ==========================================
    // Person - Basic Info
    // ==========================================
    if (person.person_id) result["Prospeo Person ID"] = person.person_id;
    if (person.first_name) result["First Name"] = person.first_name;
    if (person.last_name) result["Last Name"] = person.last_name;
    if (person.full_name) result["Full Name"] = person.full_name;
    if (person.linkedin_url) result["LinkedIn URL"] = person.linkedin_url;
    if (person.current_job_title) result["Job Title"] = person.current_job_title;
    if (person.headline) result["Headline"] = person.headline;

    // ==========================================
    // Person - Mobile Phone (KEY VALUE!)
    // ==========================================
    if (person.mobile) {
        result["Mobile Status"] = person.mobile.status;
        result["Mobile Revealed"] = person.mobile.revealed ? 'Yes' : 'No';

        if (person.mobile.revealed && person.mobile.mobile) {
            result["Mobile Phone"] = person.mobile.mobile;
            result["Mobile Phone National"] = person.mobile.mobile_national;
            result["Mobile Phone International"] = person.mobile.mobile_international;
            result["Mobile Country"] = person.mobile.mobile_country;
            result["Mobile Country Code"] = person.mobile.mobile_country_code;
        } else if (!person.mobile.revealed && person.mobile.mobile) {
            // Masked mobile (e.g., "+1 415-3**-****")
            result["Mobile Phone (Masked)"] = person.mobile.mobile;
        }
    }

    // ==========================================
    // Person - Email
    // ==========================================
    if (person.email) {
        result["Email Status"] = person.email.status;
        result["Email Revealed"] = person.email.revealed ? 'Yes' : 'No';

        if (person.email.revealed && person.email.email) {
            result["Email"] = person.email.email;
        } else if (!person.email.revealed && person.email.email) {
            result["Email (Masked)"] = person.email.email;
        }

        if (person.email.verification_method) {
            result["Email Verification Method"] = person.email.verification_method;
        }
        if (person.email.email_mx_provider) {
            result["Email MX Provider"] = person.email.email_mx_provider;
        }
    }

    // ==========================================
    // Person - Location
    // ==========================================
    if (person.location) {
        if (person.location.city) result["City"] = person.location.city;
        if (person.location.state) result["State"] = person.location.state;
        if (person.location.country) result["Country"] = person.location.country;
        if (person.location.country_code) result["Country Code"] = person.location.country_code;
        if (person.location.time_zone) result["Timezone"] = person.location.time_zone;

        const locationParts = [person.location.city, person.location.state, person.location.country].filter(Boolean);
        if (locationParts.length > 0) {
            result["Person Location"] = locationParts.join(', ');
        }
    }

    // ==========================================
    // Person - Job History
    // ==========================================
    if (person.job_history && person.job_history.length > 0) {
        result["Job History"] = person.job_history
            .map(job => {
                const parts = [];
                if (job.title) parts.push(job.title);
                if (job.company_name) parts.push(`@ ${job.company_name}`);
                if (job.current) parts.push('(Current)');
                else if (job.start_year) {
                    const end = job.end_year || 'Present';
                    parts.push(`(${job.start_year} - ${end})`);
                }
                return parts.join(' ');
            })
            .join(' | ');

        // Current job
        const currentJob = person.job_history.find(j => j.current);
        if (currentJob) {
            if (currentJob.title) result["Current Role"] = currentJob.title;
            if (currentJob.company_name) result["Current Company"] = currentJob.company_name;
            if (currentJob.seniority) result["Seniority"] = currentJob.seniority;
            if (currentJob.departments?.length) {
                result["Departments"] = currentJob.departments.join(' | ');
            }
        }

        // Experience duration
        const totalMonths = person.job_history.reduce((sum, j) => sum + (j.duration_in_months || 0), 0);
        if (totalMonths > 0) {
            result["Total Experience (Months)"] = totalMonths;
            result["Total Experience (Years)"] = Math.round(totalMonths / 12 * 10) / 10;
        }
    }

    // ==========================================
    // Person - Skills
    // ==========================================
    if (person.skills && person.skills.length > 0) {
        result["Skills"] = person.skills.join(' | ');
    }

    // ==========================================
    // Company - Basic Info
    // ==========================================
    if (company) {
        if (company.company_id) result["Prospeo Company ID"] = company.company_id;
        if (company.name) result["Company Name"] = company.name;
        if (company.domain) result["Company Domain"] = company.domain;
        if (company.website) result["Company Website"] = company.website;
        if (company.type) result["Company Type"] = company.type;
        if (company.industry) result["Company Industry"] = company.industry;
        if (company.employee_count) result["Company Employees"] = company.employee_count;
        if (company.employee_range) result["Company Employee Range"] = company.employee_range;
        if (company.founded) result["Company Founded Year"] = company.founded;
        if (company.logo_url) result["Company Logo"] = company.logo_url;

        // Description
        if (company.description_ai) {
            result["Company Description"] = company.description_ai;
        } else if (company.description_seo) {
            result["Company Description"] = company.description_seo;
        } else if (company.description) {
            result["Company Description"] = company.description.substring(0, 500);
        }

        // ==========================================
        // Company - Social Links
        // ==========================================
        if (company.linkedin_url) result["Company LinkedIn URL"] = company.linkedin_url;
        if (company.twitter_url) result["Company Twitter URL"] = company.twitter_url;
        if (company.facebook_url) result["Company Facebook URL"] = company.facebook_url;
        if (company.crunchbase_url) result["Company Crunchbase URL"] = company.crunchbase_url;
        if (company.instagram_url) result["Company Instagram URL"] = company.instagram_url;
        if (company.youtube_url) result["Company YouTube URL"] = company.youtube_url;

        // ==========================================
        // Company - Location
        // ==========================================
        if (company.location) {
            if (company.location.city) result["Company City"] = company.location.city;
            if (company.location.state) result["Company State"] = company.location.state;
            if (company.location.country) result["Company Country"] = company.location.country;

            const companyLocationParts = [
                company.location.city,
                company.location.state,
                company.location.country
            ].filter(Boolean);
            if (companyLocationParts.length > 0) {
                result["Company Location"] = companyLocationParts.join(', ');
            }
        }

        // ==========================================
        // Company - Phone
        // ==========================================
        if (company.phone_hq) {
            if (company.phone_hq.phone_hq_international) {
                result["Company Phone HQ"] = company.phone_hq.phone_hq_international;
            } else if (company.phone_hq.phone_hq) {
                result["Company Phone HQ"] = company.phone_hq.phone_hq;
            }
        }

        // ==========================================
        // Company - Revenue
        // ==========================================
        if (company.revenue_range_printed) {
            result["Company Revenue Range"] = company.revenue_range_printed;
        } else if (company.revenue_range) {
            if (company.revenue_range.min && company.revenue_range.max) {
                result["Company Revenue Range"] = `$${company.revenue_range.min.toLocaleString()} - $${company.revenue_range.max.toLocaleString()}`;
            }
        }

        // ==========================================
        // Company - Keywords
        // ==========================================
        if (company.keywords && company.keywords.length > 0) {
            result["Company Keywords"] = company.keywords.join(' | ');
        }

        // ==========================================
        // Company - SIC/NAICS Codes
        // ==========================================
        if (company.sic_codes && company.sic_codes.length > 0) {
            result["Company SIC Codes"] = company.sic_codes.join(' | ');
        }
        if (company.naics_codes && company.naics_codes.length > 0) {
            result["Company NAICS Codes"] = company.naics_codes.join(' | ');
        }

        // ==========================================
        // Company - Funding
        // ==========================================
        if (company.funding) {
            if (company.funding.total_funding_printed) {
                result["Company Total Funding"] = company.funding.total_funding_printed;
            }
            if (company.funding.latest_funding_stage) {
                result["Company Latest Funding Stage"] = company.funding.latest_funding_stage;
            }
            if (company.funding.latest_funding_date) {
                result["Company Latest Funding Date"] = company.funding.latest_funding_date;
            }
            if (company.funding.count) {
                result["Company Funding Rounds"] = company.funding.count;
            }
        }

        // ==========================================
        // Company - Technology
        // ==========================================
        if (company.technology) {
            if (company.technology.count) {
                result["Company Tech Stack Count"] = company.technology.count;
            }
            if (company.technology.technology_names && company.technology.technology_names.length > 0) {
                result["Company Tech Stack"] = company.technology.technology_names.slice(0, 20).join(' | ');
            }
        }

        // ==========================================
        // Company - Job Postings
        // ==========================================
        if (company.job_postings) {
            if (company.job_postings.active_count) {
                result["Company Active Jobs Count"] = company.job_postings.active_count;
            }
            if (company.job_postings.active_titles && company.job_postings.active_titles.length > 0) {
                result["Company Active Jobs"] = company.job_postings.active_titles.slice(0, 10).join(' | ');
            }
        }

        // ==========================================
        // Company - Attributes
        // ==========================================
        if (company.attributes) {
            result["Company Is B2B"] = company.attributes.is_b2b ? 'Yes' : 'No';
            result["Company Has Free Trial"] = company.attributes.has_free_trial ? 'Yes' : 'No';
            result["Company Has Pricing Page"] = company.attributes.has_pricing ? 'Yes' : 'No';
        }
    }

    // ==========================================
    // Enrichment Metadata
    // ==========================================
    result["Prospeo Enrichment Date"] = new Date().toISOString();
    result["Prospeo Free Enrichment"] = response.free_enrichment ? 'Yes' : 'No';
    result["Prospeo Data Source"] = 'Prospeo Enrich Person API';

    return result;
};

/**
 * Check if a StagingRow has enough data for Prospeo enrichment
 */
export const canEnrichWithProspeo = (rawJson: Record<string, any>): boolean => {
    if (!rawJson || typeof rawJson !== 'object') return false;

    const linkedin = rawJson['LinkedIn URL'] || rawJson['linkedin_url'] || rawJson['linkedin'];
    const email = rawJson['Email'] || rawJson['email'];
    const firstName = rawJson['First Name'] || rawJson['firstName'] || rawJson['first_name'];
    const lastName = rawJson['Last Name'] || rawJson['lastName'] || rawJson['last_name'];
    const fullName = rawJson['Full Name'] || rawJson['fullName'] || rawJson['full_name'];
    const companyName = rawJson['Company Name'] || rawJson['companyName'] || rawJson['company_name'] || rawJson['Organization'];
    const companyWebsite = rawJson['Company Website'] || rawJson['Company Domain'] || rawJson['companyDomain'] || rawJson['website'] || rawJson['domain'];
    const companyLinkedIn = rawJson['Company LinkedIn URL'] || rawJson['companyLinkedin'] || rawJson['company_linkedin_url'];

    // Check minimum requirements
    if (linkedin) return true;
    if (email) return true;

    const hasName = !!(fullName || (firstName && lastName));
    const hasCompany = !!(companyName || companyWebsite || companyLinkedIn);

    return hasName && hasCompany;
};

/**
 * Extract ProspeoPersonData from a rawJson object
 */
export const extractProspeoDataFromRaw = (rawJson: Record<string, any>): ProspeoPersonData => {
    return {
        first_name: rawJson['First Name'] || rawJson['firstName'] || rawJson['first_name'],
        last_name: rawJson['Last Name'] || rawJson['lastName'] || rawJson['last_name'],
        full_name: rawJson['Full Name'] || rawJson['fullName'] || rawJson['full_name'],
        linkedin_url: rawJson['LinkedIn URL'] || rawJson['linkedin_url'] || rawJson['linkedin'],
        email: rawJson['Email'] || rawJson['email'],
        company_name: rawJson['Company Name'] || rawJson['companyName'] || rawJson['company_name'] || rawJson['Organization'],
        company_website: rawJson['Company Domain'] || rawJson['Company Website'] || rawJson['domain'] || rawJson['website'],
        company_linkedin_url: rawJson['Company LinkedIn URL'] || rawJson['companyLinkedin'] || rawJson['company_linkedin_url'],
    };
};
