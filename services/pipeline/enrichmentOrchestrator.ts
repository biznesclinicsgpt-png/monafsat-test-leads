import { StagingRow } from '@/types/data-center';
import {
    enrichApolloPerson,
    enrichApolloOrganization,
    resolvePersonMatch,
    ApolloPersonFull,
    ApolloOrganizationFull,
} from '../apolloService';
import {
    enrichProspecoPerson,
    transformProspeoToRawJson,
    canEnrichWithProspeo,
    extractProspeoDataFromRaw,
    ProspeoError,
} from '../prospeoService';

// ==========================================
// استخراج البيانات المطلوبة للإثراء من الصف
// ==========================================
const extractEnrichmentParams = (row: StagingRow) => {
    const raw = row.rawJson || {};
    const normalized = row.normalizedJson || {};

    const findValue = (...keys: string[]): string | undefined => {
        for (const key of keys) {
            const val = raw[key] || normalized[key];
            if (val && val !== 'N/A' && val !== 'null' && val !== 'undefined' && val !== '') {
                return String(val);
            }
        }
        return undefined;
    };

    return {
        first_name: findValue('First Name', 'firstName', 'first_name'),
        last_name: findValue('Last Name', 'lastName', 'last_name'),
        name: findValue('Full Name', 'fullName', 'name', 'Name'),
        email: findValue('Email', 'email', 'Work Email', 'Personal Email'),
        linkedin_url: findValue('LinkedIn URL', 'Linkedin URL', 'linkedin_url', 'linkedinUrl', 'Linkedin', 'LinkedIn'),
        company_linkedin_url: findValue('Company LinkedIn URL', 'companyLinkedin', 'company_linkedin_url'),
        organization_name: findValue('Company Name', 'Company', 'companyName', 'organization_name', 'Organization'),
        domain: findValue('Company Domain', 'domain', 'primary_domain', 'Website', 'website_url'),
        title: findValue('Job Title', 'Title', 'jobTitle', 'title', 'Headline'),
        id: findValue('Apollo ID', 'apollo_id', 'id'),
    };
};

// ==========================================
// تحويل بيانات الشخص من Apollo (استخراج شامل لكل الحقول المتاحة)
// ==========================================
const transformPersonToRawJson = (person: ApolloPersonFull, existingRaw: Record<string, any>): Record<string, any> => {
    const p = person as any; // Access all fields including untyped ones
    const contact = p.contact || {};
    const result: Record<string, any> = { ...existingRaw };

    // ==========================================
    // الهوية والمعلومات الأساسية
    // ==========================================
    if (p.id) result["Apollo Person ID"] = p.id;
    if (p.first_name) result["First Name"] = p.first_name;
    if (p.last_name) result["Last Name"] = p.last_name;
    if (p.name) result["Full Name"] = p.name;
    if (p.title) result["Job Title"] = p.title;
    if (p.headline) result["Headline"] = p.headline;
    if (p.photo_url) result["Photo URL"] = p.photo_url;

    // ==========================================
    // وسائل التواصل الاجتماعي
    // ==========================================
    if (p.linkedin_url) result["LinkedIn URL"] = p.linkedin_url;
    if (p.linkedin_uid) result["LinkedIn UID"] = p.linkedin_uid;
    if (p.twitter_url) result["Twitter URL"] = p.twitter_url;
    if (p.facebook_url) result["Facebook URL"] = p.facebook_url;
    if (p.github_url) result["GitHub URL"] = p.github_url;

    // ==========================================
    // الموقع الجغرافي
    // ==========================================
    if (p.city || contact.city) result["City"] = p.city || contact.city;
    if (p.state || contact.state) result["State"] = p.state || contact.state;
    if (p.country || contact.country) result["Country"] = p.country || contact.country;
    if (p.postal_code) result["Postal Code"] = p.postal_code;
    if (p.time_zone) result["Timezone"] = p.time_zone;

    // حقل مشتق: الموقع الكامل
    const locationParts = [p.city || contact.city, p.state || contact.state, p.country || contact.country].filter(Boolean);
    if (locationParts.length > 0) result["Person Location"] = locationParts.join(', ');

    // ==========================================
    // المعلومات المهنية
    // ==========================================
    if (p.seniority) result["Seniority"] = p.seniority;
    if (p.departments?.length) result["Departments"] = p.departments.join(' | ');
    if (p.subdepartments?.length) result["Sub-Departments"] = p.subdepartments.join(' | ');
    if (p.functions?.length) result["Functions"] = p.functions.join(' | ');

    // ==========================================
    // حقل البريد الإلكتروني (الحالة فقط - بدون كشف البريد لحفظ الرصيد)
    // ==========================================
    if (p.email_status) result["Email Status"] = p.email_status;
    if (p.email && !p.email.includes('*')) result["Email"] = p.email;
    if (p.extrapolated_email_confidence) result["Email Confidence"] = p.extrapolated_email_confidence;

    // ==========================================
    // تاريخ التوظيف (تفصيلي)
    // ==========================================
    if (p.employment_history?.length) {
        result["Employment History"] = p.employment_history
            .map((h: any) => {
                const parts = [];
                if (h.title) parts.push(h.title);
                if (h.organization_name) parts.push(`@ ${h.organization_name}`);
                if (h.current) parts.push('(Current)');
                else if (h.start_date || h.end_date) parts.push(`(${h.start_date || '?'} - ${h.end_date || '?'})`);
                return parts.join(' ');
            })
            .filter(Boolean)
            .slice(0, 8)
            .join(' | ');

        // حقل مشتق: عدد الشركات السابقة
        result["Previous Companies Count"] = p.employment_history.length;

        // حقل مشتق: الوظيفة الحالية
        const currentJob = p.employment_history.find((h: any) => h.current);
        if (currentJob) {
            if (currentJob.title) result["Current Role"] = currentJob.title;
            if (currentJob.organization_name) result["Current Company"] = currentJob.organization_name;
            if (currentJob.start_date) result["Current Role Start Date"] = currentJob.start_date;
        }

        // حقل مشتق: أبرز الشركات السابقة
        const pastCompanies = p.employment_history
            .filter((h: any) => !h.current && h.organization_name)
            .map((h: any) => h.organization_name);
        if (pastCompanies.length > 0) result["Past Companies"] = [...new Set(pastCompanies)].join(' | ');

        // حقل مشتق: أبرز المسميات الوظيفية السابقة
        const pastTitles = p.employment_history
            .filter((h: any) => !h.current && h.title)
            .map((h: any) => h.title);
        if (pastTitles.length > 0) result["Past Titles"] = [...new Set(pastTitles)].join(' | ');
    }

    // ==========================================
    // Intent & Engagement
    // ==========================================
    if (p.is_likely_to_engage !== undefined) {
        result["Likely to Engage"] = p.is_likely_to_engage ? 'Yes' : 'No';
    }
    if (p.intent_strength) result["Intent Strength"] = p.intent_strength;
    if (p.show_intent !== undefined) result["Show Intent"] = p.show_intent ? 'Yes' : 'No';
    if (p.last_refreshed_at) result["Last Refreshed"] = p.last_refreshed_at;
    if (p.revealed_for_current_team !== undefined) {
        result["Revealed for Team"] = p.revealed_for_current_team ? 'Yes' : 'No';
    }

    // ==========================================
    // حقول إضافية من الـ API (untyped fields)
    // ==========================================
    if (p.organization_id) result["Organization ID"] = p.organization_id;
    if (p.account_id) result["Account ID"] = p.account_id;
    if (p.contact_id) result["Contact ID"] = p.contact_id;
    if (p.account) result["Account Name"] = p.account?.name || p.account;
    if (p.prospected_by_current_team !== undefined) {
        result["Prospected by Team"] = p.prospected_by_current_team ? 'Yes' : 'No';
    }
    if (p.num_linkedin_connections) result["LinkedIn Connections"] = p.num_linkedin_connections;

    // ==========================================
    // حقول مشتقة ومحسوبة
    // ==========================================

    // تصنيف المستوى الوظيفي
    const title = (p.title || '').toLowerCase();
    if (title) {
        if (/\b(ceo|cto|cfo|coo|cmo|cio|cpo|chief|president)\b/.test(title)) {
            result["Seniority Level"] = 'C-Suite';
        } else if (/\b(founder|co-founder|owner|partner)\b/.test(title)) {
            result["Seniority Level"] = 'Founder/Owner';
        } else if (/\b(vp|vice president|svp|evp)\b/.test(title)) {
            result["Seniority Level"] = 'VP';
        } else if (/\b(director|head of)\b/.test(title)) {
            result["Seniority Level"] = 'Director';
        } else if (/\b(manager|lead|supervisor)\b/.test(title)) {
            result["Seniority Level"] = 'Manager';
        } else if (/\b(senior|sr\.?|principal|staff)\b/.test(title)) {
            result["Seniority Level"] = 'Senior';
        } else if (/\b(junior|jr\.?|associate|intern|trainee|entry)\b/.test(title)) {
            result["Seniority Level"] = 'Junior';
        } else {
            result["Seniority Level"] = 'Mid-Level';
        }

        // تصنيف القسم من العنوان الوظيفي
        if (/\b(engineer|developer|devops|software|tech|architect|programmer|backend|frontend|fullstack|data scientist|ml|ai)\b/.test(title)) {
            result["Department Category"] = 'Engineering/Tech';
        } else if (/\b(sales|account executive|business development|bdr|sdr|revenue)\b/.test(title)) {
            result["Department Category"] = 'Sales';
        } else if (/\b(marketing|growth|brand|content|seo|digital|social media|communications)\b/.test(title)) {
            result["Department Category"] = 'Marketing';
        } else if (/\b(hr|human resources|people|talent|recruiter|recruiting)\b/.test(title)) {
            result["Department Category"] = 'Human Resources';
        } else if (/\b(finance|accounting|controller|treasury|audit|tax)\b/.test(title)) {
            result["Department Category"] = 'Finance';
        } else if (/\b(operations|ops|logistics|supply chain|procurement)\b/.test(title)) {
            result["Department Category"] = 'Operations';
        } else if (/\b(legal|counsel|compliance|regulatory)\b/.test(title)) {
            result["Department Category"] = 'Legal';
        } else if (/\b(product|pm|ux|ui|design)\b/.test(title)) {
            result["Department Category"] = 'Product/Design';
        } else if (/\b(support|customer success|customer service|cs)\b/.test(title)) {
            result["Department Category"] = 'Customer Success';
        }
    }

    // نقاط القوة كهدف تسويقي
    const seniorityScore = { 'C-Suite': 100, 'Founder/Owner': 95, 'VP': 85, 'Director': 75, 'Manager': 60, 'Senior': 50, 'Mid-Level': 35, 'Junior': 20 };
    result["Target Score"] = seniorityScore[result["Seniority Level"] as keyof typeof seniorityScore] || 30;

    return result;
};

// ==========================================
// تحويل بيانات الشركة من Apollo (استخراج شامل لكل الحقول المتاحة + حقول مشتقة)
// ==========================================
const transformOrganizationToRawJson = (org: ApolloOrganizationFull, existingRaw: Record<string, any>): Record<string, any> => {
    const o = org as any; // Access all fields including untyped ones
    const result: Record<string, any> = { ...existingRaw };

    // ==========================================
    // معلومات الشركة الأساسية
    // ==========================================
    if (o.id) result["Company Apollo ID"] = o.id;
    if (o.name) result["Company Name"] = o.name;
    if (o.primary_domain) result["Company Domain"] = o.primary_domain;
    if (o.website_url) result["Company Website"] = o.website_url;
    if (o.blog_url) result["Company Blog"] = o.blog_url;
    if (o.logo_url) result["Company Logo"] = o.logo_url;
    if (o.short_description) result["Company Description"] = o.short_description;
    if (o.description) result["Company Full Description"] = o.description;
    if (o.sanitized_phone) result["Company Phone (Sanitized)"] = o.sanitized_phone;

    // ==========================================
    // وسائل التواصل والحضور الرقمي
    // ==========================================
    if (o.linkedin_url) result["Company LinkedIn URL"] = o.linkedin_url;
    if (o.linkedin_uid) result["Company LinkedIn UID"] = o.linkedin_uid;
    if (o.twitter_url) result["Company Twitter URL"] = o.twitter_url;
    if (o.facebook_url) result["Company Facebook URL"] = o.facebook_url;
    if (o.angellist_url) result["Company AngelList URL"] = o.angellist_url;
    if (o.crunchbase_url) result["Company Crunchbase URL"] = o.crunchbase_url;

    // حقل مشتق: عدد قنوات التواصل الاجتماعي
    const socialChannels = [o.linkedin_url, o.twitter_url, o.facebook_url, o.angellist_url, o.crunchbase_url, o.blog_url].filter(Boolean);
    result["Company Social Channels Count"] = socialChannels.length;

    // ==========================================
    // العنوان والموقع
    // ==========================================
    if (o.raw_address || o.street_address) result["Company Address"] = o.raw_address || o.street_address;
    if (o.city) result["Company City"] = o.city;
    if (o.state) result["Company State"] = o.state;
    if (o.country) result["Company Country"] = o.country;
    if (o.postal_code) result["Company Postal Code"] = o.postal_code;

    // حقل مشتق: الموقع الكامل
    const companyLocation = [o.city, o.state, o.country].filter(Boolean);
    if (companyLocation.length > 0) result["Company Location"] = companyLocation.join(', ');

    // ==========================================
    // الصناعة والتصنيف
    // ==========================================
    if (o.industry) result["Company Industry"] = o.industry;
    if (o.industries?.length) result["Company Industries"] = o.industries.join(' | ');
    if (o.keywords?.length) result["Company Keywords"] = o.keywords.join(' | ');
    if (o.sic_codes?.length) result["Company SIC Codes"] = o.sic_codes.join(' | ');
    if (o.naics_codes?.length) result["Company NAICS Codes"] = o.naics_codes.join(' | ');
    if (o.subindustries?.length) result["Company Sub-Industries"] = o.subindustries.join(' | ');
    if (o.industry_tag_id) result["Company Industry Tag ID"] = o.industry_tag_id;

    // ==========================================
    // الحجم والإيرادات
    // ==========================================
    if (o.estimated_num_employees) result["Company Employees"] = o.estimated_num_employees;
    if (o.employee_count_range) result["Company Employee Range"] = o.employee_count_range;
    if (o.annual_revenue_printed || o.annual_revenue) {
        result["Company Annual Revenue"] = o.annual_revenue_printed || o.annual_revenue;
    }
    if (o.founded_year) result["Company Founded Year"] = o.founded_year;

    // حقل مشتق: تصنيف حجم الشركة
    const employees = o.estimated_num_employees;
    if (employees) {
        if (employees <= 10) result["Company Size Category"] = 'Micro (1-10)';
        else if (employees <= 50) result["Company Size Category"] = 'Small (11-50)';
        else if (employees <= 200) result["Company Size Category"] = 'Medium (51-200)';
        else if (employees <= 1000) result["Company Size Category"] = 'Large (201-1000)';
        else if (employees <= 5000) result["Company Size Category"] = 'Enterprise (1001-5000)';
        else result["Company Size Category"] = 'Corporate (5000+)';
    }

    // حقل مشتق: عمر الشركة
    if (o.founded_year) {
        const age = new Date().getFullYear() - o.founded_year;
        result["Company Age (Years)"] = age;
        if (age <= 2) result["Company Stage"] = 'Startup';
        else if (age <= 5) result["Company Stage"] = 'Early Stage';
        else if (age <= 10) result["Company Stage"] = 'Growth';
        else if (age <= 20) result["Company Stage"] = 'Established';
        else result["Company Stage"] = 'Mature';
    }

    // ==========================================
    // التمويل
    // ==========================================
    if (o.total_funding_printed || o.total_funding) {
        result["Company Total Funding"] = o.total_funding_printed || o.total_funding;
    }
    if (o.latest_funding_amount) result["Company Latest Funding Amount"] = o.latest_funding_amount;
    if (o.latest_funding_date) result["Company Latest Funding Date"] = o.latest_funding_date;
    if (o.latest_funding_round_type) result["Company Latest Funding Round"] = o.latest_funding_round_type;
    if (o.funding_events?.length) {
        result["Company Funding Rounds Count"] = o.funding_events.length;
        result["Company Funding History"] = o.funding_events
            .map((f: any) => `${f.round_type || 'Unknown'}: $${f.amount || '?'} (${f.date || '?'})`)
            .join(' | ');
    }

    // حقل مشتق: تصنيف مرحلة التمويل
    if (o.latest_funding_round_type) {
        const round = o.latest_funding_round_type.toLowerCase();
        if (round.includes('seed') || round.includes('angel') || round.includes('pre')) {
            result["Company Funding Stage"] = 'Early (Seed/Angel)';
        } else if (round.includes('series_a') || round.includes('a')) {
            result["Company Funding Stage"] = 'Series A';
        } else if (round.includes('series_b') || round.includes('b')) {
            result["Company Funding Stage"] = 'Series B';
        } else if (round.includes('series_c') || round.includes('c') || round.includes('series_d') || round.includes('d')) {
            result["Company Funding Stage"] = 'Late Stage (C+)';
        } else if (round.includes('ipo') || round.includes('public')) {
            result["Company Funding Stage"] = 'Public/IPO';
        } else {
            result["Company Funding Stage"] = round;
        }
    }

    // ==========================================
    // البورصة
    // ==========================================
    if (o.publicly_traded_symbol) result["Company Stock Symbol"] = o.publicly_traded_symbol;
    if (o.publicly_traded_exchange) result["Company Stock Exchange"] = o.publicly_traded_exchange;

    // حقل مشتق: هل الشركة مدرجة؟
    result["Company Is Public"] = (o.publicly_traded_symbol) ? 'Yes' : 'No';

    // ==========================================
    // التقنيات
    // ==========================================
    if (o.current_technologies?.length) {
        result["Company Tech Stack"] = o.current_technologies.map((t: any) => t.name).join(' | ');
        result["Company Tech Count"] = o.current_technologies.length;

        // حقل مشتق: تصنيف التقنيات حسب الفئة
        const techCategories: Record<string, string[]> = {};
        o.current_technologies.forEach((t: any) => {
            const cat = t.category || 'Other';
            if (!techCategories[cat]) techCategories[cat] = [];
            techCategories[cat].push(t.name);
        });
        const categoryEntries = Object.entries(techCategories);
        if (categoryEntries.length > 0) {
            result["Company Tech Categories"] = categoryEntries
                .map(([cat, techs]) => `${cat}: ${(techs as string[]).join(', ')}`)
                .join(' | ');
        }
    } else if (o.technology_names?.length) {
        result["Company Tech Stack"] = o.technology_names.join(' | ');
        result["Company Tech Count"] = o.technology_names.length;
    }

    // ==========================================
    // معلومات إضافية
    // ==========================================
    if (o.alexa_ranking) result["Company Alexa Rank"] = o.alexa_ranking;
    if (o.retail_location_count) result["Company Retail Locations"] = o.retail_location_count;
    if (o.languages?.length) result["Company Languages"] = o.languages.join(' | ');
    if (o.phone) result["Company Phone"] = o.phone;
    if (o.primary_phone?.sanitized_number || o.primary_phone?.number) {
        result["Company Primary Phone"] = o.primary_phone.sanitized_number || o.primary_phone.number;
    }

    // ==========================================
    // توزيع الموظفين
    // ==========================================
    if (o.departmental_head_count) {
        const counts = Object.entries(o.departmental_head_count)
            .filter(([_, count]) => count && (count as number) > 0)
            .map(([dept, count]) => `${dept}: ${count}`)
            .join(' | ');
        if (counts) result["Company Dept Headcount"] = counts;

        // حقل مشتق: أكبر الأقسام
        const sortedDepts = Object.entries(o.departmental_head_count)
            .filter(([_, count]) => count && (count as number) > 0)
            .sort((a, b) => (b[1] as number) - (a[1] as number));
        if (sortedDepts.length > 0) {
            result["Company Largest Department"] = sortedDepts[0][0];
            result["Company Largest Dept Size"] = sortedDepts[0][1];
        }

        // حقل مشتق: نسبة الأقسام التقنية مقابل الأقسام الأخرى
        const techDepts = ['engineering', 'information_technology', 'data_science'];
        const deptHeadCount = o.departmental_head_count as Record<string, number>;
        const techCount = techDepts.reduce((sum, dept) => sum + (deptHeadCount[dept] || 0), 0);
        const totalCount = Object.values(deptHeadCount).reduce((sum: number, c: number) => sum + (c || 0), 0);
        if (totalCount > 0) {
            result["Company Tech Ratio"] = `${Math.round((techCount / totalCount) * 100)}%`;
        }
    }

    // ==========================================
    // Intent & Signals
    // ==========================================
    if (o.intent_strength) result["Company Intent Strength"] = o.intent_strength;
    if (o.show_intent !== undefined) result["Company Show Intent"] = o.show_intent ? 'Yes' : 'No';
    if (o.has_intent_signal_account !== undefined) {
        result["Company Has Intent Signal"] = o.has_intent_signal_account ? 'Yes' : 'No';
    }

    // ==========================================
    // حقول إضافية من الـ API
    // ==========================================
    if (o.account_id) result["Company Account ID"] = o.account_id;
    if (o.account_playbook_statuses?.length) {
        result["Company Playbook Status"] = o.account_playbook_statuses.join(' | ');
    }
    if (o.ownership_type) result["Company Ownership Type"] = o.ownership_type;
    if (o.organization_type) result["Company Type"] = o.organization_type;
    if (o.num_suborganizations) result["Company Sub-Organizations"] = o.num_suborganizations;

    return result;
};

// ==========================================
// واجهة نتيجة الإثراء
// ==========================================
export interface EnrichmentResult {
    row: StagingRow;
    status: 'enriched' | 'partial' | 'failed';
    message: string;
    personEnriched: boolean;
    companyEnriched: boolean;
    mobileEnriched?: boolean;
    errors?: string[];
}

// ==========================================
// خيارات الإثراء
// ==========================================
export interface EnrichmentOptions {
    apolloApiKey: string;
    prospeoApiKey?: string;
    enrichMobile?: boolean;
    onlyVerifiedMobile?: boolean;
}

// ==========================================
// إثراء سجل واحد عبر Apollo APIs + Prospeo (للموبايل)
// ✅ يستخدم /mixed_people/api_search (بدون رصيد) بدلاً من /people/match أو /organizations/enrich
// ✅ يستخدم Prospeo للحصول على أرقام الموبايل (10 credits لكل رقم)
// الحقول المستهدفة: Person LinkedIn + Company LinkedIn + بيانات أساسية + Mobile Phone
// ==========================================
export const runEnrichmentPipeline = async (
    row: StagingRow,
    apiKey: string,
    options?: Partial<EnrichmentOptions>
): Promise<EnrichmentResult> => {
    const params = extractEnrichmentParams(row);
    const errors: string[] = [];
    let enrichedRawJson = { ...row.rawJson };
    let personEnriched = false;
    let companyEnriched = false;
    let mobileEnriched = false;

    // استخراج مفاتيح API
    const apolloApiKey = options?.apolloApiKey || apiKey;
    const prospeoApiKey = options?.prospeoApiKey;
    const enrichMobile = options?.enrichMobile ?? true;

    // ==========================================
    // 1. إثراء بيانات الشخص عبر /mixed_people/api_search (مجاني - بدون رصيد)
    //    يُرجع: LinkedIn URL, Title, Location, Organization (مع LinkedIn الشركة)
    // ==========================================

    // إذا كان السجل يحتوي بالفعل على LinkedIn الشخص والشركة، لا حاجة للإثراء
    const alreadyHasLinkedIn = params.linkedin_url && params.company_linkedin_url;
    if (alreadyHasLinkedIn) {
        console.log('[CREDIT-FREE] Record already has Person & Company LinkedIn - skipping enrichment');
        personEnriched = true;
        companyEnriched = true;
    }

    if (!alreadyHasLinkedIn) try {
        const hasPersonData = (params.first_name && params.organization_name) ||
                              (params.first_name && params.domain) ||
                              (params.name && params.organization_name) ||
                              (params.name && params.domain) ||
                              params.domain || params.organization_name;

        if (hasPersonData) {
            const personResult = await enrichApolloPerson({
                first_name: params.first_name,
                last_name: params.last_name,
                name: params.name,
                organization_name: params.organization_name,
                domain: params.domain,
                title: params.title,
            }, apolloApiKey);

            if (personResult) {
                enrichedRawJson = transformPersonToRawJson(personResult, enrichedRawJson);
                personEnriched = true;

                // بيانات الشركة من الشخص (مضمنة في النتيجة - مجانية)
                if ((personResult as any).organization) {
                    enrichedRawJson = transformOrganizationToRawJson((personResult as any).organization, enrichedRawJson);
                    companyEnriched = true;
                }
            }
        }
    } catch (error: any) {
        errors.push(`خطأ في إثراء الشخص: ${error.message}`);
    }

    // ==========================================
    // 2. إثراء بيانات الشركة (مجاني - عبر البحث عن شخص في نفس الشركة)
    //    يستخدم /mixed_people/api_search بدلاً من /organizations/enrich المكلف
    // ==========================================
    if (!companyEnriched && !alreadyHasLinkedIn && params.domain) {
        try {
            const orgResult = await enrichApolloOrganization(params.domain, apolloApiKey);
            if (orgResult) {
                enrichedRawJson = transformOrganizationToRawJson(orgResult, enrichedRawJson);
                companyEnriched = true;
            }
        } catch (error: any) {
            errors.push(`خطأ في إثراء الشركة: ${error.message}`);
        }
    }

    // ==========================================
    // 3. /people/match — فقط linkedin_url ولا شيء غيره
    // ==========================================
    const needsLinkedIn = !enrichedRawJson['LinkedIn URL'];
    if (needsLinkedIn && params.first_name && (params.organization_name || params.domain)) {
        try {
            const matchResult = await resolvePersonMatch({
                first_name: params.first_name,
                last_name: params.last_name,
                name: params.name,
                organization_name: params.organization_name,
                domain: params.domain,
            }, apolloApiKey);

            if (matchResult.linkedin_url) {
                enrichedRawJson["LinkedIn URL"] = matchResult.linkedin_url;
                personEnriched = true;
                console.log('[MATCH] ✓ Got linkedin_url:', matchResult.linkedin_url);
            }
        } catch (error: any) {
            console.warn('[MATCH] Failed:', error.message);
        }
    }

    // ==========================================
    // 4. Prospeo Mobile Enrichment - إثراء رقم الموبايل عبر Prospeo
    // ⚠️ يكلف 10 credits لكل رقم موبايل
    // ==========================================
    const hasMobile = enrichedRawJson['Mobile Phone'] || enrichedRawJson['Phone Numbers'] || enrichedRawJson['mobile_phone'];
    if (prospeoApiKey && enrichMobile && !hasMobile && canEnrichWithProspeo(enrichedRawJson)) {
        try {
            console.log('[PROSPEO] Starting mobile enrichment for:', enrichedRawJson['Full Name'] || enrichedRawJson['First Name']);

            const prospeoData = extractProspeoDataFromRaw(enrichedRawJson);

            const prospeoResult = await enrichProspecoPerson(prospeoApiKey, prospeoData, {
                enrichMobile: true,
                onlyVerifiedMobile: options?.onlyVerifiedMobile ?? false,
            });

            if (prospeoResult.person) {
                // تحويل بيانات Prospeo إلى rawJson
                enrichedRawJson = transformProspeoToRawJson(prospeoResult, enrichedRawJson);
                mobileEnriched = !!prospeoResult.person.mobile?.revealed;

                if (prospeoResult.person.mobile?.revealed) {
                    console.log('[PROSPEO] ✓ Mobile enriched:', prospeoResult.person.mobile.mobile);
                } else if (prospeoResult.person.mobile?.status === 'VERIFIED') {
                    console.log('[PROSPEO] ⚠️ Mobile exists but not revealed (need enrich_mobile: true)');
                } else {
                    console.log('[PROSPEO] ✗ No mobile found for this person');
                }

                // تحديث بيانات الشخص من Prospeo إذا كانت أفضل
                if (!personEnriched && prospeoResult.person.full_name) {
                    personEnriched = true;
                }
                if (!companyEnriched && prospeoResult.company) {
                    companyEnriched = true;
                }
            }
        } catch (error: any) {
            if (error instanceof ProspeoError) {
                if (error.code === 'INSUFFICIENT_CREDITS') {
                    console.warn('[PROSPEO] ⚠️ Insufficient credits for mobile enrichment');
                    errors.push('Prospeo: رصيد غير كافٍ لإثراء الموبايل');
                } else if (error.code === 'NO_MATCH') {
                    console.log('[PROSPEO] ✗ No match found in Prospeo database');
                } else {
                    console.warn('[PROSPEO] Error:', error.code, error.message);
                    errors.push(`Prospeo: ${error.code}`);
                }
            } else {
                console.warn('[PROSPEO] Failed:', error.message);
                errors.push(`خطأ Prospeo: ${error.message}`);
            }
        }
    }

    // ==========================================
    // 5. إضافة حقول مشتقة ومحسوبة (بدون أي استدعاء API إضافي)
    // ==========================================
    const title = (enrichedRawJson['Job Title'] || enrichedRawJson['Title'] || '').toLowerCase();

    // تصنيف صانع القرار
    if (title) {
        if (/\b(ceo|cto|cfo|coo|cmo|cio|cpo|chief|president|founder|owner|partner)\b/.test(title)) {
            enrichedRawJson['Decision Maker'] = 'Yes - Executive';
        } else if (/\b(vp|vice president|svp|evp|director|head of)\b/.test(title)) {
            enrichedRawJson['Decision Maker'] = 'Yes - Senior Leader';
        } else if (/\b(manager|lead|supervisor|team lead)\b/.test(title)) {
            enrichedRawJson['Decision Maker'] = 'Possible - Manager';
        } else {
            enrichedRawJson['Decision Maker'] = 'No - Individual Contributor';
        }
    }

    // تصنيف نوع الحساب (ICP matching hints)
    const employees = enrichedRawJson['Company Employees'];
    const industry = enrichedRawJson['Company Industry'] || '';
    if (employees && industry) {
        enrichedRawJson['Account Type'] = employees > 500 ? 'Enterprise' : employees > 100 ? 'Mid-Market' : 'SMB';
    }

    // حقل مشتق: الاهتمامات المحتملة من الوظيفة
    if (title) {
        const buyerPersona: string[] = [];
        if (/\b(tech|engineer|developer|devops|architect|it)\b/.test(title)) buyerPersona.push('Technical Buyer');
        if (/\b(finance|cfo|accounting|controller)\b/.test(title)) buyerPersona.push('Financial Buyer');
        if (/\b(ceo|coo|president|founder|owner|gm|general manager)\b/.test(title)) buyerPersona.push('Economic Buyer');
        if (/\b(sales|marketing|growth|revenue|business development)\b/.test(title)) buyerPersona.push('Revenue Buyer');
        if (/\b(hr|people|talent|culture)\b/.test(title)) buyerPersona.push('People Buyer');
        if (/\b(operations|ops|procurement|supply)\b/.test(title)) buyerPersona.push('Operations Buyer');
        if (buyerPersona.length > 0) enrichedRawJson['Buyer Persona'] = buyerPersona.join(' | ');
    }

    // حقل مشتق: مستوى الأولوية للتواصل
    const seniority = enrichedRawJson['Seniority'] || enrichedRawJson['Seniority Level'] || '';
    const hasLinkedIn = !!enrichedRawJson['LinkedIn URL'];
    const hasCompanyLinkedIn = !!enrichedRawJson['Company LinkedIn URL'];
    const isDecisionMaker = enrichedRawJson['Decision Maker']?.includes('Yes');

    if (isDecisionMaker && hasLinkedIn) {
        enrichedRawJson['Outreach Priority'] = 'High';
    } else if (hasLinkedIn && (seniority.includes('director') || seniority.includes('vp') || seniority.includes('Manager'))) {
        enrichedRawJson['Outreach Priority'] = 'Medium-High';
    } else if (hasLinkedIn) {
        enrichedRawJson['Outreach Priority'] = 'Medium';
    } else {
        enrichedRawJson['Outreach Priority'] = 'Low';
    }

    // حقل مشتق: قنوات التواصل المتاحة
    const channels: string[] = [];
    if (enrichedRawJson['LinkedIn URL']) channels.push('LinkedIn');
    if (enrichedRawJson['Email']) channels.push('Email');
    if (enrichedRawJson['Mobile Phone']) channels.push('Mobile');
    if (enrichedRawJson['Twitter URL']) channels.push('Twitter');
    if (enrichedRawJson['Phone Numbers'] || enrichedRawJson['Company Phone']) channels.push('Phone');
    if (enrichedRawJson['Facebook URL']) channels.push('Facebook');
    enrichedRawJson['Available Channels'] = channels.length > 0 ? channels.join(' | ') : 'None';
    enrichedRawJson['Channels Count'] = channels.length;

    // حقل مشتق: اكتمال البيانات
    const dataFields = ['First Name', 'Last Name', 'Job Title', 'LinkedIn URL', 'Email',
        'Company Name', 'Company Domain', 'Company LinkedIn URL', 'Company Industry',
        'Company Employees', 'City', 'Country', 'Seniority'];
    const filledFields = dataFields.filter(f => enrichedRawJson[f] && enrichedRawJson[f] !== 'N/A');
    enrichedRawJson['Data Completeness'] = `${Math.round((filledFields.length / dataFields.length) * 100)}%`;
    enrichedRawJson['Missing Fields'] = dataFields.filter(f => !enrichedRawJson[f] || enrichedRawJson[f] === 'N/A').join(' | ') || 'None';

    // حقل مشتق: نقاط الجودة الشاملة
    let qualityScore = 0;
    if (enrichedRawJson['LinkedIn URL']) qualityScore += 20;
    if (enrichedRawJson['Company LinkedIn URL']) qualityScore += 15;
    if (enrichedRawJson['Mobile Phone']) qualityScore += 15; // رقم الموبايل قيمة عالية!
    if (enrichedRawJson['Company Apollo ID']) qualityScore += 5;
    if (enrichedRawJson['First Name'] && enrichedRawJson['Last Name']) qualityScore += 8;
    if (enrichedRawJson['Company Name']) qualityScore += 6;
    if (enrichedRawJson['Job Title']) qualityScore += 6;
    if (enrichedRawJson['Email']) qualityScore += 6;
    if (enrichedRawJson['Company Domain']) qualityScore += 5;
    if (enrichedRawJson['Company Industry']) qualityScore += 4;
    if (enrichedRawJson['Company Employees']) qualityScore += 4;
    if (enrichedRawJson['City'] || enrichedRawJson['Country']) qualityScore += 4;
    if (enrichedRawJson['Seniority']) qualityScore += 4;
    if (enrichedRawJson['Department'] || enrichedRawJson['Departments']) qualityScore += 3;
    if (enrichedRawJson['Employment History']) qualityScore += 4;
    if (enrichedRawJson['Company Tech Stack']) qualityScore += 4;
    if (enrichedRawJson['Buyer Persona']) qualityScore += 3;
    if (enrichedRawJson['Decision Maker']?.includes('Yes')) qualityScore += 2;
    enrichedRawJson['Quality Score'] = qualityScore;
    enrichedRawJson['Quality Grade'] = qualityScore >= 80 ? 'A' : qualityScore >= 60 ? 'B' : qualityScore >= 40 ? 'C' : 'D';

    // ==========================================
    // 6. تحديد الحالة النهائية
    // ==========================================
    let status: 'enriched' | 'partial' | 'failed';
    let message: string;

    if (personEnriched && companyEnriched) {
        status = 'enriched';
        message = mobileEnriched
            ? 'تم إثراء الشخص والشركة والموبايل بنجاح'
            : 'تم إثراء الشخص والشركة بنجاح';
    } else if (personEnriched || companyEnriched || mobileEnriched) {
        status = 'partial';
        const parts: string[] = [];
        if (personEnriched) parts.push('الشخص');
        if (companyEnriched) parts.push('الشركة');
        if (mobileEnriched) parts.push('الموبايل');
        message = `تم إثراء: ${parts.join(' + ')}`;
    } else {
        status = 'failed';
        message = errors.length > 0 ? errors.join(' | ') : 'لا توجد بيانات كافية';
    }

    enrichedRawJson["Enrichment Status"] = status;
    enrichedRawJson["Enrichment Date"] = new Date().toISOString();

    // تحديد مصدر البيانات
    const dataSources: string[] = [];
    if (personEnriched || companyEnriched) dataSources.push('Apollo');
    if (mobileEnriched) dataSources.push('Prospeo (Mobile)');
    enrichedRawJson["Data Source"] = dataSources.length > 0 ? dataSources.join(' + ') : 'N/A';
    enrichedRawJson["Mobile Enriched"] = mobileEnriched ? 'Yes' : 'No';

    // حساب عدد الحقول المثراة
    const enrichedFieldCount = Object.keys(enrichedRawJson).filter(k => enrichedRawJson[k] && enrichedRawJson[k] !== 'N/A').length;
    enrichedRawJson["Total Enriched Fields"] = enrichedFieldCount;

    // تحديث normalizedJson أيضاً
    const updatedNormalized = {
        ...(row.normalizedJson || {}),
        firstName: enrichedRawJson['First Name'] || row.normalizedJson?.firstName,
        lastName: enrichedRawJson['Last Name'] || row.normalizedJson?.lastName,
        fullName: enrichedRawJson['Full Name'] || row.normalizedJson?.fullName,
        email: enrichedRawJson['Email'] || row.normalizedJson?.email,
        phone: enrichedRawJson['Mobile Phone'] || enrichedRawJson['Phone Numbers'] || row.normalizedJson?.phone,
        mobile: enrichedRawJson['Mobile Phone'] || row.normalizedJson?.mobile,
        jobTitle: enrichedRawJson['Job Title'] || row.normalizedJson?.jobTitle,
        companyName: enrichedRawJson['Company Name'] || row.normalizedJson?.companyName,
        companyDomain: enrichedRawJson['Company Domain'] || row.normalizedJson?.companyDomain,
        linkedin: enrichedRawJson['LinkedIn URL'] || row.normalizedJson?.linkedin,
        companyLinkedin: enrichedRawJson['Company LinkedIn URL'] || row.normalizedJson?.companyLinkedin,
        location: enrichedRawJson['Person Location'] || enrichedRawJson['Company Location'] || row.normalizedJson?.location,
        industry: enrichedRawJson['Company Industry'] || row.normalizedJson?.industry,
        seniority: enrichedRawJson['Seniority'] || row.normalizedJson?.seniority,
    };

    return {
        row: {
            ...row,
            rawJson: enrichedRawJson,
            normalizedJson: updatedNormalized,
            rowStatus: status === 'failed' ? 'rejected' : 'enriched',
            updatedAt: new Date().toISOString(),
        },
        status,
        message,
        personEnriched,
        companyEnriched,
        mobileEnriched,
        errors: errors.length > 0 ? errors : undefined,
    };
};

// ==========================================
// إثراء مجموعة من السجلات (مع دعم Prospeo للموبايل)
// ==========================================
export const runBatchEnrichment = async (
    rows: StagingRow[],
    apiKey: string,
    optionsOrProgress?: Partial<EnrichmentOptions> | ((current: number, total: number, result: EnrichmentResult) => void),
    onProgress?: (current: number, total: number, result: EnrichmentResult) => void
): Promise<{
    results: EnrichmentResult[];
    summary: {
        total: number;
        fullyEnriched: number;
        partiallyEnriched: number;
        failed: number;
        personsEnriched: number;
        companiesEnriched: number;
        mobilesEnriched: number;
    };
}> => {
    // التعامل مع التوافق مع الإصدار السابق
    let options: Partial<EnrichmentOptions> | undefined;
    let progressCallback: ((current: number, total: number, result: EnrichmentResult) => void) | undefined;

    if (typeof optionsOrProgress === 'function') {
        // الإصدار القديم: (rows, apiKey, onProgress)
        progressCallback = optionsOrProgress;
        options = { apolloApiKey: apiKey };
    } else {
        // الإصدار الجديد: (rows, apiKey, options, onProgress)
        options = optionsOrProgress ? { ...optionsOrProgress, apolloApiKey: apiKey } : { apolloApiKey: apiKey };
        progressCallback = onProgress;
    }

    const results: EnrichmentResult[] = [];
    let fullyEnriched = 0;
    let partiallyEnriched = 0;
    let failed = 0;
    let personsEnriched = 0;
    let companiesEnriched = 0;
    let mobilesEnriched = 0;

    for (let i = 0; i < rows.length; i++) {
        const result = await runEnrichmentPipeline(rows[i], apiKey, options);
        results.push(result);

        if (result.status === 'enriched') fullyEnriched++;
        else if (result.status === 'partial') partiallyEnriched++;
        else failed++;

        if (result.personEnriched) personsEnriched++;
        if (result.companyEnriched) companiesEnriched++;
        if (result.mobileEnriched) mobilesEnriched++;

        if (progressCallback) {
            progressCallback(i + 1, rows.length, result);
        }

        // تأخير لتجنب rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    return {
        results,
        summary: {
            total: rows.length,
            fullyEnriched,
            partiallyEnriched,
            failed,
            personsEnriched,
            companiesEnriched,
            mobilesEnriched,
        }
    };
};

// ==========================================
// إثراء الموبايل فقط عبر Prospeo (للسجلات الموجودة)
// ==========================================
export const enrichMobilesOnly = async (
    rows: StagingRow[],
    prospeoApiKey: string,
    options?: {
        onlyVerifiedMobile?: boolean;
        onProgress?: (current: number, total: number, enriched: boolean) => void;
        delayMs?: number;
    }
): Promise<{
    results: Array<{ row: StagingRow; enriched: boolean; mobile?: string; error?: string }>;
    summary: { total: number; enriched: number; failed: number };
}> => {
    const results: Array<{ row: StagingRow; enriched: boolean; mobile?: string; error?: string }> = [];
    let enriched = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rawJson = row.rawJson || {};

        // تخطي السجلات التي لديها موبايل بالفعل
        if (rawJson['Mobile Phone']) {
            results.push({ row, enriched: false, mobile: rawJson['Mobile Phone'] });
            if (options?.onProgress) {
                options.onProgress(i + 1, rows.length, false);
            }
            continue;
        }

        // التحقق من إمكانية الإثراء
        if (!canEnrichWithProspeo(rawJson)) {
            results.push({ row, enriched: false, error: 'بيانات غير كافية للإثراء' });
            failed++;
            if (options?.onProgress) {
                options.onProgress(i + 1, rows.length, false);
            }
            continue;
        }

        try {
            const prospeoData = extractProspeoDataFromRaw(rawJson);
            const prospeoResult = await enrichProspecoPerson(prospeoApiKey, prospeoData, {
                enrichMobile: true,
                onlyVerifiedMobile: options?.onlyVerifiedMobile ?? false,
            });

            if (prospeoResult.person?.mobile?.revealed && prospeoResult.person.mobile.mobile) {
                const updatedRawJson = transformProspeoToRawJson(prospeoResult, rawJson);
                const updatedRow: StagingRow = {
                    ...row,
                    rawJson: updatedRawJson,
                    normalizedJson: {
                        ...(row.normalizedJson || {}),
                        mobile: prospeoResult.person.mobile.mobile,
                        phone: prospeoResult.person.mobile.mobile,
                    },
                    updatedAt: new Date().toISOString(),
                };

                results.push({
                    row: updatedRow,
                    enriched: true,
                    mobile: prospeoResult.person.mobile.mobile,
                });
                enriched++;
            } else {
                results.push({ row, enriched: false, error: 'لا يوجد موبايل في Prospeo' });
                failed++;
            }
        } catch (error: any) {
            const errorMessage = error instanceof ProspeoError ? error.code : error.message;
            results.push({ row, enriched: false, error: errorMessage });
            failed++;
        }

        if (options?.onProgress) {
            options.onProgress(i + 1, rows.length, results[results.length - 1].enriched);
        }

        // تأخير لتجنب rate limiting
        if (i < rows.length - 1) {
            await new Promise(resolve => setTimeout(resolve, options?.delayMs ?? 500));
        }
    }

    return {
        results,
        summary: { total: rows.length, enriched, failed },
    };
};
