import React, { useState, useCallback } from 'react';
import { Icons } from '@/constants';
import { LemlistPerson, LemlistFilter, LemlistSearchResponse } from '@/types/lemlist';
import { searchLemlistPeople, transformLemlistPeopleToRows, enrichLemlistData, getLemlistEnrichmentResult, checkLemlistCredits } from '@/services/lemlistService';

interface LemlistSearchProps {
    apiKey: string;
    onImportLeads: (leads: Array<{ rawJson: Record<string, any>; normalizedJson: Record<string, any> }>) => void;
    onClose: () => void;
}

// Common filter options
const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Australia', 'Netherlands', 'Spain', 'Italy', 'Sweden', 'Switzerland', 'Belgium', 'Austria', 'Denmark', 'Norway', 'Finland', 'Ireland', 'Portugal', 'Poland', 'Czech Republic', 'India', 'Singapore', 'Japan', 'South Korea', 'Brazil', 'Mexico', 'UAE', 'Saudi Arabia', 'Israel', 'South Africa'];
const INDUSTRIES = ['Technology, Information and Media', 'Software Development', 'IT Services and IT Consulting', 'Financial Services', 'Marketing Services', 'Business Consulting and Services', 'Hospitals and Health Care', 'Real Estate', 'Retail', 'Manufacturing', 'Education', 'Telecommunications', 'Insurance', 'Banking', 'E-commerce', 'Automotive', 'Hospitality', 'Media and Entertainment'];
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+'];
const DEPARTMENTS = ['Sales', 'Marketing', 'Engineering', 'Product', 'Finance', 'Human Resources', 'Operations', 'Customer Success', 'Business Development', 'Executive', 'IT', 'Legal', 'Research'];
const SENIORITIES = ['Entry', 'Senior', 'Manager', 'Director', 'VP', 'C-Level', 'Owner', 'Partner'];

// Executive search presets - professional templates
const SEARCH_PRESETS = [
    {
        label: '👔 المدراء التنفيذيين (C-Level)',
        keywords: ['CEO', 'Chief Executive Officer', 'Managing Director', 'General Manager'],
        seniorities: ['C-Level', 'Owner', 'Partner'],
        titlePatterns: ['ceo', 'chief executive', 'managing director', 'general manager', 'president', 'مدير عام', 'رئيس تنفيذي'],
    },
    {
        label: '💰 المدراء الماليين (CFO)',
        keywords: ['CFO', 'Chief Financial Officer', 'Finance Director', 'VP Finance'],
        seniorities: ['C-Level', 'VP', 'Director'],
        titlePatterns: ['cfo', 'chief financial', 'finance director', 'vp finance', 'financial controller', 'مدير مالي'],
    },
    {
        label: '💻 المدراء التقنيين (CTO/CIO)',
        keywords: ['CTO', 'CIO', 'Chief Technology Officer', 'Chief Information Officer', 'VP Engineering'],
        seniorities: ['C-Level', 'VP', 'Director'],
        titlePatterns: ['cto', 'cio', 'chief technology', 'chief information', 'vp engineering', 'tech director', 'مدير تقني'],
    },
    {
        label: '📈 مدراء المبيعات',
        keywords: ['Sales Director', 'VP Sales', 'Chief Revenue Officer', 'Head of Sales'],
        seniorities: ['C-Level', 'VP', 'Director'],
        titlePatterns: ['sales director', 'vp sales', 'head of sales', 'chief revenue', 'commercial director', 'مدير مبيعات'],
    },
    {
        label: '📣 مدراء التسويق (CMO)',
        keywords: ['CMO', 'Chief Marketing Officer', 'Marketing Director', 'VP Marketing'],
        seniorities: ['C-Level', 'VP', 'Director'],
        titlePatterns: ['cmo', 'chief marketing', 'marketing director', 'vp marketing', 'head of marketing', 'مدير تسويق'],
    },
    {
        label: '👥 مدراء الموارد البشرية',
        keywords: ['CHRO', 'HR Director', 'VP Human Resources', 'Chief People Officer'],
        seniorities: ['C-Level', 'VP', 'Director'],
        titlePatterns: ['chro', 'hr director', 'vp hr', 'chief people', 'head of hr', 'مدير موارد بشرية'],
    },
    {
        label: '🏭 مدراء العمليات (COO)',
        keywords: ['COO', 'Chief Operating Officer', 'Operations Director', 'VP Operations'],
        seniorities: ['C-Level', 'VP', 'Director'],
        titlePatterns: ['coo', 'chief operating', 'operations director', 'vp operations', 'مدير عمليات'],
    },
    {
        label: '🚀 المؤسسين ورواد الأعمال',
        keywords: ['Founder', 'Co-Founder', 'Entrepreneur', 'Owner'],
        seniorities: ['Owner', 'Partner', 'C-Level'],
        titlePatterns: ['founder', 'co-founder', 'مؤسس', 'owner', 'entrepreneur', 'شريك مؤسس'],
    },
];

// Check if title matches any of the patterns
const titleMatchesPatterns = (title: string | undefined, patterns: string[]): boolean => {
    if (!title) return false;
    const lowerTitle = title.toLowerCase();
    return patterns.some(pattern => lowerTitle.includes(pattern.toLowerCase()));
};

const LemlistSearch: React.FC<LemlistSearchProps> = ({ apiKey, onImportLeads, onClose }) => {
    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    const [selectedCompanySizes, setSelectedCompanySizes] = useState<string[]>([]);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [selectedSeniorities, setSelectedSeniorities] = useState<string[]>([]);
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');

    // Results state
    const [results, setResults] = useState<LemlistPerson[]>([]);
    const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(100); // Max allowed in free trial
    const [isFreeTrialLimited, setIsFreeTrialLimited] = useState(false);
    const [searchId, setSearchId] = useState<string>('');
    const [limitation, setLimitation] = useState<number | null>(null);

    // UI state
    const [isSearching, setIsSearching] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'filters' | 'results'>('filters');

    // Multi-search state
    const [multiSearchEnabled, setMultiSearchEnabled] = useState(false);
    const [multiSearchRounds, setMultiSearchRounds] = useState(5);
    const [multiSearchProgress, setMultiSearchProgress] = useState<{ current: number; total: number; found: number } | null>(null);
    const [seenLeadIds, setSeenLeadIds] = useState<Set<number>>(new Set());

    // Smart filtering state
    const [strictTitleFilter, setStrictTitleFilter] = useState(true); // Filter results to match title
    const [selectedPreset, setSelectedPreset] = useState<typeof SEARCH_PRESETS[0] | null>(null);
    const [filteredResultsCount, setFilteredResultsCount] = useState(0);

    // Enrichment state
    const [isEnriching, setIsEnriching] = useState(false);
    const [enrichmentProgress, setEnrichmentProgress] = useState<{ current: number; total: number; success: number; failed: number } | null>(null);
    const [enrichedData, setEnrichedData] = useState<Map<string, { email?: string; phone?: string; status: 'pending' | 'success' | 'failed' | 'no_credits'; error?: string }>>(new Map());
    const [enrichmentOptions, setEnrichmentOptions] = useState({ findEmail: true, findPhone: true });
    const [credits, setCredits] = useState<{ total: number; subscription: number; gifted: number; paid: number } | null>(null);

    // Check credits on mount
    React.useEffect(() => {
        checkLemlistCredits(apiKey).then(setCredits).catch(() => {});
    }, [apiKey]);

    // Apply a search preset
    const applyPreset = (preset: typeof SEARCH_PRESETS[0]) => {
        setSelectedPreset(preset);
        setSearchQuery(preset.keywords[0]); // Use first keyword
        setSelectedSeniorities(preset.seniorities);
        setStrictTitleFilter(true); // Always enable strict filter for presets
        setMultiSearchEnabled(true);
        setMultiSearchRounds(100); // Good default for executive search
    };

    // Clear preset
    const clearPreset = () => {
        setSelectedPreset(null);
        setSearchQuery('');
        setSelectedSeniorities([]);
    };

    // Get title patterns for current search
    const getCurrentTitlePatterns = (): string[] => {
        if (selectedPreset) {
            return selectedPreset.titlePatterns;
        }
        // Create patterns from search query and job title
        const patterns: string[] = [];
        if (searchQuery.trim()) {
            patterns.push(searchQuery.trim().toLowerCase());
        }
        if (jobTitle.trim()) {
            patterns.push(jobTitle.trim().toLowerCase());
        }
        return patterns;
    };

    // Filter results by title match
    const filterResultsByTitle = (people: LemlistPerson[]): LemlistPerson[] => {
        if (!strictTitleFilter) return people;

        const patterns = getCurrentTitlePatterns();
        if (patterns.length === 0) return people;

        return people.filter(person => {
            const currentTitle = person.experiences?.[0]?.title || '';
            return titleMatchesPatterns(currentTitle, patterns);
        });
    };

    // Enrich selected leads with email and phone
    // Uses name + company domain/name strategy to avoid LinkedIn login requirement
    const handleEnrichment = async () => {
        if (selectedResults.size === 0) {
            setError('الرجاء تحديد عميل واحد على الأقل للإثراء');
            return;
        }

        setIsEnriching(true);
        setError(null);

        const selectedPeople = results.filter(p => selectedResults.has(p._id));
        const total = selectedPeople.length;
        let success = 0;
        let failed = 0;

        setEnrichmentProgress({ current: 0, total, success: 0, failed: 0 });

        const newEnrichedData = new Map(enrichedData);

        for (let i = 0; i < selectedPeople.length; i++) {
            const person = selectedPeople[i];
            setEnrichmentProgress({ current: i + 1, total, success, failed });

            // Skip if already enriched successfully
            const existing = newEnrichedData.get(person._id);
            if (existing?.status === 'success') {
                success++;
                continue;
            }

            // Get company domain from current experience
            const currentExp = person.experiences?.[0];
            const companyDomain = currentExp?.company_domain ||
                currentExp?.company_website_url?.replace(/^https?:\/\//, '').split('/')[0];

            // Extract first and last name
            const nameParts = person.full_name?.split(' ') || [];
            const firstName = person.first_name || nameParts[0] || '';
            const lastName = person.last_name || nameParts.slice(1).join(' ') || '';

            try {
                // Build query params for enrichment
                // Strategy: Use firstName + lastName + companyDomain/companyName
                // This avoids the LinkedIn login requirement entirely
                const params = new URLSearchParams();
                if (firstName) params.append('firstName', firstName);
                if (lastName) params.append('lastName', lastName);
                if (companyDomain) params.append('companyDomain', companyDomain);
                if (currentExp?.company_name) params.append('companyName', currentExp.company_name);
                // DO NOT pass linkedinUrl - it triggers LinkedIn login requirement
                // DO NOT request linkedinEnrichment - it requires LinkedIn account
                if (enrichmentOptions.findEmail) params.append('findEmail', 'true');
                if (enrichmentOptions.findPhone) params.append('findPhone', 'true');

                const response = await fetch(`/api/lemlist/enrich?${params.toString()}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${btoa(':' + apiKey)}`,
                    },
                });

                const data = await response.json();

                if (data.error) {
                    // Check if it's a credits issue
                    if (data.error.includes('Failed to enrich') || data.error.includes('credits') || response.status === 400) {
                        newEnrichedData.set(person._id, {
                            status: 'no_credits',
                            error: 'لا يوجد رصيد للإثراء. يرجى ترقية الحساب.'
                        });
                        failed++;
                    } else {
                        newEnrichedData.set(person._id, {
                            status: 'failed',
                            error: data.error
                        });
                        failed++;
                    }
                } else if (data.id) {
                    // Enrichment started - poll for results
                    let enrichResult: any = null;
                    let attempts = 0;
                    const maxAttempts = 15;

                    while (attempts < maxAttempts) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        attempts++;

                        const resultResponse = await fetch(`/api/lemlist/enrich/${data.id}`, {
                            headers: {
                                'Authorization': `Basic ${btoa(':' + apiKey)}`,
                            },
                        });

                        enrichResult = await resultResponse.json();

                        // Handle both API response formats
                        const isDone = enrichResult.type === 'enrichmentDone' || enrichResult.status === 'completed';
                        const isFailed = enrichResult.type === 'enrichmentFailed' || enrichResult.status === 'failed';

                        if (isDone || isFailed) {
                            break;
                        }
                    }

                    // Parse result - handle both new nested format and legacy flat format
                    const isDone = enrichResult?.type === 'enrichmentDone' || enrichResult?.status === 'completed';

                    if (isDone) {
                        let email: string | undefined;
                        let phone: string | undefined;

                        // New format: data[0].data.find_email / find_phone
                        if (enrichResult.data && enrichResult.data.length > 0) {
                            const item = enrichResult.data[0];
                            email = item.data?.find_email?.email;
                            phone = item.data?.find_phone?.phone;
                        } else {
                            // Legacy flat format
                            email = enrichResult.email;
                            phone = enrichResult.phone;
                        }

                        newEnrichedData.set(person._id, {
                            email,
                            phone,
                            status: 'success'
                        });
                        success++;
                    } else {
                        newEnrichedData.set(person._id, {
                            status: 'failed',
                            error: enrichResult?.error || 'فشل الإثراء - انتهت المهلة'
                        });
                        failed++;
                    }
                }
            } catch (err: any) {
                console.error('[ENRICHMENT] Error:', err);
                newEnrichedData.set(person._id, {
                    status: 'failed',
                    error: err.message
                });
                failed++;
            }

            // Rate limiting - wait between requests
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        setEnrichedData(newEnrichedData);
        setEnrichmentProgress({ current: total, total, success, failed });

        // Check if all failed due to no credits
        const firstEntry = Array.from(newEnrichedData.values())[0];
        if (failed === total && firstEntry?.status === 'no_credits') {
            setError('لا يوجد رصيد للإثراء في حسابك. يرجى ترقية حساب Lemlist للحصول على رصيد الإثراء.');
        } else if (success > 0 && failed > 0) {
            setError(`تم إثراء ${success} من ${total} عميل. فشل ${failed} عميل.`);
        } else if (failed === total) {
            setError(`فشل إثراء جميع العملاء (${total}). تحقق من رصيد الحساب أو البيانات المدخلة.`);
        }

        setIsEnriching(false);
    };

    // Build filters from selections
    const buildFilters = (includeSearchQuery: boolean = false): LemlistFilter[] => {
        const filters: LemlistFilter[] = [];

        // Only these filter IDs work with Lemlist API:
        // country, department, seniority, keyword

        if (selectedCountries.length > 0) {
            filters.push({ filterId: 'country', in: selectedCountries });
        }
        if (selectedDepartments.length > 0) {
            filters.push({ filterId: 'department', in: selectedDepartments });
        }
        if (selectedSeniorities.length > 0) {
            filters.push({ filterId: 'seniority', in: selectedSeniorities });
        }

        // Use keyword filter for job title, company name, industry (combined)
        // Also include search query as keyword for better filtering (multi-search)
        const keywords: string[] = [];
        if (includeSearchQuery && searchQuery.trim()) keywords.push(searchQuery.trim());
        if (jobTitle.trim()) keywords.push(jobTitle.trim());
        if (companyName.trim()) keywords.push(companyName.trim());
        if (selectedIndustries.length > 0) keywords.push(...selectedIndustries);
        if (selectedCompanySizes.length > 0) keywords.push(...selectedCompanySizes);

        if (keywords.length > 0) {
            filters.push({ filterId: 'keyword', in: keywords });
        }

        return filters;
    };

    // Perform search
    const handleSearch = async (page: number = 1) => {
        // Include search query as keyword filter for better results
        const filters = buildFilters(true);

        if (filters.length === 0) {
            setError('الرجاء اختيار فلتر واحد على الأقل أو إدخال كلمة بحث');
            return;
        }

        setIsSearching(true);
        setError(null);

        try {
            // Free trial is limited to page 1 with max 100 results
            const response = await searchLemlistPeople({
                filters,
                page: 1, // Always page 1 for free trial
                size: pageSize,
                // search query is now included in keyword filter for better results
            }, apiKey);

            // Apply strict title filtering if enabled
            const filteredResults = strictTitleFilter ? filterResultsByTitle(response.results) : response.results;

            setResults(filteredResults);
            setTotalResults(filteredResults.length);
            setFilteredResultsCount(response.results.length - filteredResults.length);
            setCurrentPage(1);
            setSearchId(response.search);
            setLimitation(response.limitation);
            setIsFreeTrialLimited(response.total > 100);
            setActiveTab('results');

            if (filteredResults.length === 0) {
                if (response.results.length > 0) {
                    setError(`تم العثور على ${response.results.length} نتيجة لكن لم تتطابق أي منها مع المسمى الوظيفي. جرب إيقاف "فلتر المسمى الصارم".`);
                } else {
                    setError('لم يتم العثور على نتائج مطابقة');
                }
            }
        } catch (err: any) {
            // Handle free trial limitation error
            if (err.message?.includes('free trial') || err.message?.includes('limited')) {
                setError('التجربة المجانية محدودة بـ 100 نتيجة فقط. استخدم فلاتر أدق للحصول على نتائج أفضل.');
                setIsFreeTrialLimited(true);
            } else {
                setError(err.message || 'حدث خطأ أثناء البحث');
            }
            console.error('[LEMLIST] Search error:', err);
        } finally {
            setIsSearching(false);
        }
    };

    // Multi-search: Run multiple searches with smart subdivisions to get maximum unique results
    // Strategy: Combine Department × Seniority × Industry to create hundreds of unique search combinations
    const handleMultiSearch = async () => {
        // Include search query in keyword filter for better results
        const baseFilters = buildFilters(true);

        if (baseFilters.length === 0) {
            setError('الرجاء اختيار فلتر واحد على الأقل أو إدخال كلمة بحث');
            return;
        }

        setIsSearching(true);
        setError(null);

        const allResults: LemlistPerson[] = [];
        const seen = new Set<number>();

        // Check what the user has already selected
        const hasDepartmentSelected = selectedDepartments.length > 0;
        const hasSenioritySelected = selectedSeniorities.length > 0;

        // All available options for subdivision
        const deptOptions = hasDepartmentSelected ? selectedDepartments : DEPARTMENTS;
        const seniorityOptions = hasSenioritySelected ? selectedSeniorities : SENIORITIES;
        const industryOptions = INDUSTRIES.slice(0, 10); // Top 10 industries for more combinations

        // Generate all possible combinations based on rounds requested
        interface SearchCombination {
            department?: string;
            seniority?: string;
            industry?: string;
            label: string;
        }

        const combinations: SearchCombination[] = [];

        // Check if this is an executive search (using preset or C-Level/Owner seniority)
        const isExecutiveSearch = selectedPreset !== null ||
            selectedSeniorities.some(s => ['C-Level', 'Owner', 'Partner', 'VP'].includes(s));

        if (isExecutiveSearch) {
            // EXECUTIVE SEARCH STRATEGY: Use Industry-based subdivision
            // Executives can be in any department, so we focus on industry variations
            console.log('[MULTI-SEARCH] Using EXECUTIVE strategy (Industry-based)');

            // First pass: Just industries (18 combinations)
            for (const ind of INDUSTRIES) {
                if (combinations.length >= multiSearchRounds) break;
                combinations.push({ industry: ind, label: ind });
            }

            // Second pass: Industry × Department (18 × 13 = 234 combinations)
            if (combinations.length < multiSearchRounds) {
                for (const ind of INDUSTRIES) {
                    for (const dept of deptOptions) {
                        if (combinations.length >= multiSearchRounds) break;
                        combinations.push({
                            industry: ind,
                            department: dept,
                            label: `${ind.slice(0, 15)} + ${dept}`
                        });
                    }
                    if (combinations.length >= multiSearchRounds) break;
                }
            }

            // Third pass: Add company sizes for more combinations
            if (combinations.length < multiSearchRounds) {
                for (const ind of INDUSTRIES) {
                    for (const size of COMPANY_SIZES) {
                        if (combinations.length >= multiSearchRounds) break;
                        combinations.push({
                            industry: `${ind} ${size}`,
                            label: `${ind.slice(0, 12)} (${size})`
                        });
                    }
                    if (combinations.length >= multiSearchRounds) break;
                }
            }
        } else {
            // STANDARD SEARCH STRATEGY: Department-based subdivision
            console.log('[MULTI-SEARCH] Using STANDARD strategy (Department-based)');

            if (multiSearchRounds <= 15) {
                // Small number: just use departments
                for (const dept of deptOptions) {
                    if (combinations.length >= multiSearchRounds) break;
                    combinations.push({ department: dept, label: dept });
                }
            } else if (multiSearchRounds <= 120) {
                // Medium number: Department × Seniority (13 × 8 = 104 combinations)
                for (const dept of deptOptions) {
                    for (const sen of seniorityOptions) {
                        if (combinations.length >= multiSearchRounds) break;
                        combinations.push({
                            department: dept,
                            seniority: sen,
                            label: `${dept} + ${sen}`
                        });
                    }
                    if (combinations.length >= multiSearchRounds) break;
                }
            } else {
                // Large number: Department × Seniority × Industry
                for (const dept of deptOptions) {
                    for (const sen of seniorityOptions) {
                        for (const ind of industryOptions) {
                            if (combinations.length >= multiSearchRounds) break;
                            combinations.push({
                                department: dept,
                                seniority: sen,
                                industry: ind,
                                label: `${dept} + ${sen} + ${ind.slice(0, 15)}...`
                            });
                        }
                        if (combinations.length >= multiSearchRounds) break;
                    }
                    if (combinations.length >= multiSearchRounds) break;
                }

                // If still need more combinations, add more industries
                if (combinations.length < multiSearchRounds) {
                    const moreIndustries = INDUSTRIES.slice(10);
                    for (const dept of deptOptions) {
                        for (const sen of seniorityOptions) {
                            for (const ind of moreIndustries) {
                                if (combinations.length >= multiSearchRounds) break;
                                combinations.push({
                                    department: dept,
                                    seniority: sen,
                                    industry: ind,
                                    label: `${dept} + ${sen} + ${ind.slice(0, 15)}...`
                                });
                            }
                            if (combinations.length >= multiSearchRounds) break;
                        }
                        if (combinations.length >= multiSearchRounds) break;
                    }
                }
            }
        }

        const totalRounds = combinations.length;
        setMultiSearchProgress({ current: 0, total: totalRounds, found: 0 });

        console.log(`[MULTI-SEARCH] Starting ${totalRounds} search rounds with smart subdivision`);

        try {
            for (let i = 0; i < combinations.length; i++) {
                const combo = combinations[i];
                setMultiSearchProgress({ current: i + 1, total: totalRounds, found: allResults.length });

                // Build filters for this combination
                const searchFilters = baseFilters
                    .filter(f => !['department', 'seniority'].includes(f.filterId))
                    .map(f => ({ ...f, out: f.out || [] }));

                if (combo.department) {
                    searchFilters.push({ filterId: 'department', in: [combo.department], out: [] });
                }
                if (combo.seniority) {
                    searchFilters.push({ filterId: 'seniority', in: [combo.seniority], out: [] });
                }

                // Add industry as keyword if specified
                if (combo.industry) {
                    const keywordFilter = searchFilters.find(f => f.filterId === 'keyword');
                    if (keywordFilter) {
                        keywordFilter.in = [...(keywordFilter.in || []), combo.industry];
                    } else {
                        searchFilters.push({ filterId: 'keyword', in: [combo.industry], out: [] });
                    }
                }

                try {
                    const response = await searchLemlistPeople({
                        filters: searchFilters,
                        page: 1,
                        size: 100,
                    }, apiKey);

                    const newCount = response.results.filter(p => !seen.has(p.lead_id)).length;
                    console.log(`[MULTI-SEARCH] ${i + 1}/${totalRounds} ${combo.label}: +${newCount} new (${response.total} total)`);

                    for (const person of response.results) {
                        if (!seen.has(person.lead_id)) {
                            seen.add(person.lead_id);
                            allResults.push(person);
                        }
                    }

                    setLimitation(response.limitation);

                    // Dynamic delay based on results (faster if no new results)
                    await new Promise(resolve => setTimeout(resolve, newCount > 0 ? 200 : 100));
                } catch (err: any) {
                    console.warn(`[MULTI-SEARCH] ${combo.label} failed:`, err.message);
                }

                // Update progress every 10 rounds
                if (i % 10 === 0) {
                    setMultiSearchProgress({ current: i + 1, total: totalRounds, found: allResults.length });
                }
            }

            // Apply strict title filtering if enabled
            const filteredResults = strictTitleFilter ? filterResultsByTitle(allResults) : allResults;

            // Update state with filtered results
            setResults(filteredResults);
            setTotalResults(filteredResults.length);
            setFilteredResultsCount(allResults.length - filteredResults.length);
            setSeenLeadIds(seen);
            setCurrentPage(1);
            setActiveTab('results');
            setIsFreeTrialLimited(true);

            if (filteredResults.length === 0) {
                if (allResults.length > 0) {
                    setError(`تم العثور على ${allResults.length} نتيجة لكن لم تتطابق أي منها مع المسمى الوظيفي المطلوب. جرب إيقاف "فلتر المسمى الوظيفي الصارم".`);
                } else {
                    setError('لم يتم العثور على نتائج مطابقة');
                }
            } else {
                setError(null);
                console.log(`[MULTI-SEARCH] ✅ Total: ${allResults.length}, After title filter: ${filteredResults.length}`);
            }
        } catch (err: any) {
            setError(err.message || 'حدث خطأ أثناء البحث المتعدد');
            console.error('[LEMLIST] Multi-search error:', err);
        } finally {
            setIsSearching(false);
            setMultiSearchProgress(null);
        }
    };

    // Toggle selection
    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedResults);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedResults(newSelected);
    };

    // Select all
    const selectAll = () => {
        const allIds = new Set(results.map(r => r._id));
        setSelectedResults(allIds);
    };

    // Clear selection
    const clearSelection = () => {
        setSelectedResults(new Set());
    };

    // Import selected leads (includes enriched email/phone if available)
    const handleImport = async () => {
        if (selectedResults.size === 0) {
            setError('الرجاء اختيار عميل واحد على الأقل');
            return;
        }

        setIsImporting(true);
        setError(null);

        try {
            const selectedPeople = results.filter(r => selectedResults.has(r._id));
            const transformedLeads = transformLemlistPeopleToRows(selectedPeople);

            // Merge enriched email/phone into the transformed leads
            const enrichedLeads = transformedLeads.map((lead, idx) => {
                const person = selectedPeople[idx];
                const enrichment = enrichedData.get(person._id);

                if (enrichment?.status === 'success') {
                    if (enrichment.email) {
                        lead.rawJson['Email'] = enrichment.email;
                        lead.normalizedJson.email = enrichment.email;
                    }
                    if (enrichment.phone) {
                        lead.rawJson['Phone'] = enrichment.phone;
                        lead.normalizedJson.phone = enrichment.phone;
                    }
                }

                return lead;
            });

            onImportLeads(enrichedLeads);
            onClose();
        } catch (err: any) {
            setError(err.message || 'حدث خطأ أثناء الاستيراد');
        } finally {
            setIsImporting(false);
        }
    };

    // Multi-select dropdown component
    const MultiSelect: React.FC<{
        label: string;
        options: string[];
        selected: string[];
        onChange: (selected: string[]) => void;
        placeholder?: string;
    }> = ({ label, options, selected, onChange, placeholder }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                <div
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg cursor-pointer bg-white hover:border-brand transition-colors min-h-[42px] flex items-center flex-wrap gap-1"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selected.length === 0 ? (
                        <span className="text-slate-400">{placeholder || 'اختر...'}</span>
                    ) : (
                        selected.map(item => (
                            <span key={item} className="bg-brand/10 text-brand text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                {item}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(selected.filter(s => s !== item));
                                    }}
                                    className="hover:text-red-500"
                                >
                                    ×
                                </button>
                            </span>
                        ))
                    )}
                </div>
                {isOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {options.map(option => (
                            <div
                                key={option}
                                className={`px-3 py-2 cursor-pointer hover:bg-slate-50 flex items-center gap-2 ${
                                    selected.includes(option) ? 'bg-brand/5' : ''
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (selected.includes(option)) {
                                        onChange(selected.filter(s => s !== option));
                                    } else {
                                        onChange([...selected, option]);
                                    }
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option)}
                                    readOnly
                                    className="rounded border-slate-300 text-brand focus:ring-brand"
                                />
                                <span className="text-sm">{option}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const totalPages = Math.ceil(totalResults / pageSize);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-l from-purple-600 to-purple-800 text-white p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Icons.Database className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Lemlist People Database</h2>
                            <p className="text-white/80 text-sm">البحث واستيراد العملاء المحتملين</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {limitation !== null && (
                            <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                                الاستعلامات المتبقية: <span className="font-bold">{limitation}</span>
                            </div>
                        )}
                        <button onClick={onClose} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
                            <Icons.X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200 px-6">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab('filters')}
                            className={`py-3 px-1 border-b-2 font-medium transition-colors ${
                                activeTab === 'filters'
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <Icons.Filter className="w-4 h-4 inline ml-2" />
                            الفلاتر والبحث
                        </button>
                        <button
                            onClick={() => setActiveTab('results')}
                            className={`py-3 px-1 border-b-2 font-medium transition-colors ${
                                activeTab === 'results'
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <Icons.Contacts className="w-4 h-4 inline ml-2" />
                            النتائج {totalResults > 0 && `(${totalResults})`}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                            <Icons.AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {activeTab === 'filters' && (
                        <div className="space-y-6">
                            {/* Search Presets - Professional Templates */}
                            <div className="bg-gradient-to-l from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Icons.Star className="w-5 h-5 text-amber-600" />
                                    <span className="font-bold text-amber-800">قوالب البحث الاحترافية</span>
                                    <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">موصى به</span>
                                </div>
                                <p className="text-xs text-amber-700 mb-3">اختر قالب جاهز للحصول على نتائج دقيقة ومتوافقة مع المسمى الوظيفي المطلوب</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {SEARCH_PRESETS.map((preset, index) => (
                                        <button
                                            key={index}
                                            onClick={() => applyPreset(preset)}
                                            className={`px-3 py-2 text-sm rounded-lg border transition-all text-right ${
                                                selectedPreset === preset
                                                    ? 'bg-amber-600 text-white border-amber-600'
                                                    : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-100'
                                            }`}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                                {selectedPreset && (
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-xs text-amber-700">القالب المختار: {selectedPreset.label}</span>
                                        <button
                                            onClick={clearPreset}
                                            className="text-xs text-red-600 hover:text-red-700 underline"
                                        >
                                            إلغاء القالب
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Strict Title Filter Toggle */}
                            <div className="bg-gradient-to-l from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={strictTitleFilter}
                                                onChange={(e) => setStrictTitleFilter(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                        <div>
                                            <span className="font-medium text-green-800">فلتر المسمى الوظيفي الصارم</span>
                                            <p className="text-xs text-green-600">إظهار فقط من يتطابق مسماه الوظيفي مع البحث</p>
                                        </div>
                                    </div>
                                    {filteredResultsCount > 0 && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                            تم استبعاد {filteredResultsCount} نتيجة غير مطابقة
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Free text search */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">بحث نصي حر</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            if (selectedPreset) setSelectedPreset(null);
                                        }}
                                        placeholder="ابحث بالاسم، المسمى الوظيفي، الشركة..."
                                        className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                </div>
                            </div>

                            {/* Filters Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <MultiSelect
                                    label="الدولة"
                                    options={COUNTRIES}
                                    selected={selectedCountries}
                                    onChange={setSelectedCountries}
                                    placeholder="اختر الدول..."
                                />
                                <MultiSelect
                                    label="الصناعة"
                                    options={INDUSTRIES}
                                    selected={selectedIndustries}
                                    onChange={setSelectedIndustries}
                                    placeholder="اختر الصناعات..."
                                />
                                <MultiSelect
                                    label="حجم الشركة"
                                    options={COMPANY_SIZES}
                                    selected={selectedCompanySizes}
                                    onChange={setSelectedCompanySizes}
                                    placeholder="اختر الحجم..."
                                />
                                <MultiSelect
                                    label="القسم"
                                    options={DEPARTMENTS}
                                    selected={selectedDepartments}
                                    onChange={setSelectedDepartments}
                                    placeholder="اختر الأقسام..."
                                />
                                <MultiSelect
                                    label="المستوى الوظيفي"
                                    options={SENIORITIES}
                                    selected={selectedSeniorities}
                                    onChange={setSelectedSeniorities}
                                    placeholder="اختر المستوى..."
                                />
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">المسمى الوظيفي</label>
                                    <input
                                        type="text"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        placeholder="مثال: CEO, Sales Manager..."
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div className="md:col-span-2 lg:col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">اسم الشركة</label>
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="مثال: Google, Microsoft..."
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Multi-Search Controls */}
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={multiSearchEnabled}
                                                onChange={(e) => setMultiSearchEnabled(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                        <div>
                                            <span className="font-medium text-slate-800">البحث المتعدد (Multi-Search)</span>
                                            <p className="text-xs text-slate-500">تشغيل بحث متعدد للحصول على نتائج أكثر وفريدة</p>
                                        </div>
                                    </div>
                                    {multiSearchEnabled && (
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-slate-600">عدد الجولات:</label>
                                            <select
                                                value={multiSearchRounds}
                                                onChange={(e) => setMultiSearchRounds(Number(e.target.value))}
                                                className="px-3 py-1.5 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                                            >
                                                {[5, 10, 20, 50, 100, 150, 200, 300, 500].map(n => (
                                                    <option key={n} value={n}>{n} جولات</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                                {multiSearchEnabled && (
                                    <div className="text-xs text-purple-700 bg-purple-100 px-3 py-2 rounded-lg">
                                        <Icons.Info className="w-4 h-4 inline ml-1" />
                                        {multiSearchRounds <= 15
                                            ? `سيتم البحث في ${multiSearchRounds} قسم مختلف. النتائج المتوقعة: حتى ${multiSearchRounds * 100} شخص.`
                                            : multiSearchRounds <= 120
                                            ? `سيتم البحث في تركيبات (قسم × مستوى وظيفي). النتائج المتوقعة: حتى ${Math.min(multiSearchRounds, 104) * 100} شخص.`
                                            : `سيتم البحث في تركيبات (قسم × مستوى × صناعة). النتائج المتوقعة: حتى ${Math.min(multiSearchRounds * 100, 50000)} شخص. ⚡`
                                        }
                                    </div>
                                )}

                                {/* Multi-search Progress */}
                                {multiSearchProgress && (
                                    <div className="mt-3 bg-white rounded-lg p-3 border border-purple-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-purple-700">
                                                جاري البحث المتعدد...
                                            </span>
                                            <span className="text-sm text-slate-600">
                                                {multiSearchProgress.current} / {multiSearchProgress.total}
                                            </span>
                                        </div>
                                        <div className="w-full bg-purple-100 rounded-full h-2.5">
                                            <div
                                                className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                                                style={{ width: `${(multiSearchProgress.current / multiSearchProgress.total) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="mt-2 text-xs text-slate-500 text-center">
                                            تم العثور على {multiSearchProgress.found} نتيجة فريدة حتى الآن
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Enrichment Options */}
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Icons.Zap className="w-5 h-5 text-blue-600" />
                                    <span className="font-bold text-blue-800">خيارات الإثراء (Enrichment)</span>
                                    <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">بدون LinkedIn</span>
                                </div>
                                <p className="text-xs text-blue-600 mb-3">
                                    إثراء بيانات العملاء المحددين بالبريد الإلكتروني ورقم الهاتف باستخدام الاسم + الشركة (بدون تسجيل دخول LinkedIn)
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={enrichmentOptions.findEmail}
                                            onChange={(e) => setEnrichmentOptions(prev => ({ ...prev, findEmail: e.target.checked }))}
                                            className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-blue-800">البحث عن البريد الإلكتروني</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={enrichmentOptions.findPhone}
                                            onChange={(e) => setEnrichmentOptions(prev => ({ ...prev, findPhone: e.target.checked }))}
                                            className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-blue-800">البحث عن رقم الهاتف</span>
                                    </label>
                                </div>
                                {credits && (
                                    <div className={`mt-3 text-xs px-3 py-2 rounded-lg ${
                                        credits.subscription > 0 || credits.paid > 0
                                            ? 'text-green-700 bg-green-100'
                                            : 'text-amber-700 bg-amber-100'
                                    }`}>
                                        <Icons.Info className="w-4 h-4 inline ml-1" />
                                        {credits.subscription > 0 || credits.paid > 0 ? (
                                            <>رصيد الإثراء: {credits.total} رصيد متاح (Email: 5 رصيد، Phone: 20 رصيد لكل عميل)</>
                                        ) : (
                                            <>رصيد البحث: {credits.total} (هدية). الإثراء (findEmail/findPhone) يحتاج خطة مدفوعة من Lemlist. الرصيد الحالي للبحث في قاعدة البيانات فقط.</>
                                        )}
                                    </div>
                                )}
                                {!credits && (
                                    <div className="mt-3 text-xs text-green-700 bg-green-100 px-3 py-2 rounded-lg">
                                        <Icons.Info className="w-4 h-4 inline ml-1" />
                                        يتم الإثراء عبر (الاسم + نطاق الشركة) بدون الحاجة لحساب LinkedIn. يحتاج رصيد في حساب Lemlist.
                                    </div>
                                )}
                            </div>

                            {/* Search Button */}
                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={() => multiSearchEnabled ? handleMultiSearch() : handleSearch(1)}
                                    disabled={isSearching}
                                    className={`px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2 ${
                                        multiSearchEnabled
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                                    }`}
                                >
                                    {isSearching ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            {multiSearchEnabled ? 'جاري البحث المتعدد...' : 'جاري البحث...'}
                                        </>
                                    ) : (
                                        <>
                                            <Icons.Search className="w-5 h-5" />
                                            {multiSearchEnabled ? `بحث متعدد (${multiSearchRounds} جولات)` : 'بحث في قاعدة البيانات'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'results' && (
                        <div className="space-y-4">
                            {/* Results Actions */}
                            {results.length > 0 && (
                                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={selectAll}
                                            className="text-sm text-purple-600 hover:text-purple-800"
                                        >
                                            تحديد الكل
                                        </button>
                                        <button
                                            onClick={clearSelection}
                                            className="text-sm text-slate-500 hover:text-slate-700"
                                        >
                                            إلغاء التحديد
                                        </button>
                                        <span className="text-sm text-slate-600">
                                            {selectedResults.size} من {results.length} محدد
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        صفحة {currentPage} من {totalPages} ({totalResults} نتيجة)
                                    </div>
                                </div>
                            )}

                            {/* Enrichment Progress */}
                            {enrichmentProgress && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-blue-700">
                                            جاري الإثراء...
                                        </span>
                                        <span className="text-sm text-blue-600">
                                            {enrichmentProgress.current} / {enrichmentProgress.total}
                                        </span>
                                    </div>
                                    <div className="w-full bg-blue-100 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${(enrichmentProgress.current / enrichmentProgress.total) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-2 flex justify-between text-xs">
                                        <span className="text-green-600">✓ نجح: {enrichmentProgress.success}</span>
                                        <span className="text-red-600">✗ فشل: {enrichmentProgress.failed}</span>
                                    </div>
                                </div>
                            )}

                            {/* Results Table */}
                            {results.length > 0 ? (
                                <div className="border border-slate-200 rounded-lg overflow-hidden overflow-x-auto">
                                    <table className="w-full min-w-[900px]">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="w-12 p-3"></th>
                                                <th className="text-right p-3 font-medium text-slate-700">الاسم</th>
                                                <th className="text-right p-3 font-medium text-slate-700">المسمى الوظيفي</th>
                                                <th className="text-right p-3 font-medium text-slate-700">الشركة</th>
                                                <th className="text-right p-3 font-medium text-slate-700">📧 البريد</th>
                                                <th className="text-right p-3 font-medium text-slate-700">📱 الهاتف</th>
                                                <th className="text-right p-3 font-medium text-slate-700">الموقع</th>
                                                <th className="text-right p-3 font-medium text-slate-700">LinkedIn</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((person) => {
                                                const currentExp = person.experiences?.[0];
                                                const enrichment = enrichedData.get(person._id);
                                                const displayEmail = enrichment?.email || person.email;
                                                const displayPhone = enrichment?.phone || person.phone;

                                                return (
                                                    <tr
                                                        key={person._id}
                                                        className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                                                            selectedResults.has(person._id) ? 'bg-purple-50' : ''
                                                        }`}
                                                        onClick={() => toggleSelection(person._id)}
                                                    >
                                                        <td className="p-3 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedResults.has(person._id)}
                                                                readOnly
                                                                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                                            />
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="font-medium text-slate-900">{person.full_name}</div>
                                                            <div className="text-xs text-slate-500">{person.headline?.slice(0, 40)}...</div>
                                                        </td>
                                                        <td className="p-3 text-slate-700 text-sm">{currentExp?.title || '-'}</td>
                                                        <td className="p-3">
                                                            <div className="text-slate-700 text-sm">{currentExp?.company_name || '-'}</div>
                                                            <div className="text-xs text-slate-500">{currentExp?.company_industry?.slice(0, 20)}</div>
                                                        </td>
                                                        <td className="p-3">
                                                            {displayEmail ? (
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-sm text-green-700 font-medium">{displayEmail}</span>
                                                                    {enrichment?.status === 'success' && (
                                                                        <span className="text-green-500 text-xs">✓</span>
                                                                    )}
                                                                </div>
                                                            ) : enrichment?.status === 'pending' ? (
                                                                <span className="text-xs text-blue-500 animate-pulse">جاري البحث...</span>
                                                            ) : enrichment?.status === 'failed' ? (
                                                                <span className="text-xs text-red-500" title={enrichment.error}>❌</span>
                                                            ) : enrichment?.status === 'no_credits' ? (
                                                                <span className="text-xs text-amber-500" title="لا يوجد رصيد">⚠️</span>
                                                            ) : (
                                                                <span className="text-slate-400 text-sm">-</span>
                                                            )}
                                                        </td>
                                                        <td className="p-3">
                                                            {displayPhone ? (
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-sm text-green-700 font-medium">{displayPhone}</span>
                                                                    {enrichment?.status === 'success' && (
                                                                        <span className="text-green-500 text-xs">✓</span>
                                                                    )}
                                                                </div>
                                                            ) : enrichment?.status === 'pending' ? (
                                                                <span className="text-xs text-blue-500 animate-pulse">جاري البحث...</span>
                                                            ) : enrichment?.status === 'failed' ? (
                                                                <span className="text-xs text-red-500" title={enrichment.error}>❌</span>
                                                            ) : enrichment?.status === 'no_credits' ? (
                                                                <span className="text-xs text-amber-500" title="لا يوجد رصيد">⚠️</span>
                                                            ) : (
                                                                <span className="text-slate-400 text-sm">-</span>
                                                            )}
                                                        </td>
                                                        <td className="p-3 text-slate-600 text-sm">
                                                            {person.location || person.country || '-'}
                                                        </td>
                                                        <td className="p-3">
                                                            {person.lead_linkedin_url ? (
                                                                <a
                                                                    href={person.lead_linkedin_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <Icons.ExternalLink className="w-4 h-4" />
                                                                </a>
                                                            ) : (
                                                                <span className="text-slate-400">-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    <Icons.Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>استخدم الفلاتر للبحث في قاعدة البيانات</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 pt-4">
                                    <button
                                        onClick={() => handleSearch(currentPage - 1)}
                                        disabled={currentPage <= 1 || isSearching}
                                        className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 hover:bg-slate-50"
                                    >
                                        السابق
                                    </button>
                                    <span className="px-4 py-2 text-slate-600">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handleSearch(currentPage + 1)}
                                        disabled={currentPage >= totalPages || isSearching}
                                        className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 hover:bg-slate-50"
                                    >
                                        التالي
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        إغلاق
                    </button>
                    <div className="flex items-center gap-3">
                        {/* Enrichment Button */}
                        <button
                            onClick={handleEnrichment}
                            disabled={selectedResults.size === 0 || isEnriching || (!enrichmentOptions.findEmail && !enrichmentOptions.findPhone)}
                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                            {isEnriching ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    جاري الإثراء...
                                </>
                            ) : (
                                <>
                                    <Icons.Zap className="w-5 h-5" />
                                    إثراء {selectedResults.size} عميل
                                </>
                            )}
                        </button>

                        {/* Import Button */}
                        <button
                            onClick={handleImport}
                            disabled={selectedResults.size === 0 || isImporting}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                            {isImporting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    جاري الاستيراد...
                                </>
                            ) : (
                                <>
                                    <Icons.Check className="w-5 h-5" />
                                    استيراد {selectedResults.size} عميل
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LemlistSearch;
