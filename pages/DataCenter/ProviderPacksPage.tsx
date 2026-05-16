import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '@/constants';
import { generateICPFromProvider } from '@/services/providerToICP';
import { generateApolloFilters } from '@/services/ai/apolloQueryBuilder';
import { searchApolloPeople, searchApolloCompanies, transformApolloToStaging, ApolloSearchFilters } from '@/services/apolloService';

// Mock Providers (Ninja)
const MOCK_PROVIDERS = [
    {
        id: 'p1',
        name: 'شركة الإنجاز للمقاولات',
        description: 'شركة مقاولات عامة متخصصة في بناء الأبراج السكنية والتجارية، نقدم خدمات التصميم والإنشاء والتشطيبات.',
        industries: [{ id: 1, name: 'Construction' }, { id: 2, name: 'Real Estate' }],
        service_lines: [{ id: 101, name: 'General Contracting' }, { id: 102, name: 'Interior Design' }]
    },
    {
        id: 'p2',
        name: 'عيادات النخبة للأسنان',
        description: 'مركز طبي متكامل لطب وتجميل الأسنان، زراعة الأسنان، والتقويم. نستهدف العائلات والمدارس.',
        industries: [{ id: 3, name: 'Healthcare' }],
        service_lines: [{ id: 201, name: 'Orthodontics' }, { id: 202, name: 'Dental Implants' }]
    },
    {
        id: 'p3',
        name: 'آفاق للحلول التقنية',
        description: 'شركة برمجيات تقدم حلول إدارة الموارد ERP وتطبيقات الجوال للمتاجر الإلكترونية.',
        industries: [{ id: 4, name: 'Information Technology' }],
        service_lines: [{ id: 301, name: 'Software Development' }, { id: 302, name: 'Mobile Apps' }]
    }
];

// ==========================================
// فلاتر Apollo الافتراضية الكاملة
// ==========================================
const DEFAULT_FILTERS: ApolloSearchFilters = {
    // People Search
    person_titles: [],
    person_locations: [],
    person_seniorities: ['c_suite', 'vp', 'director', 'manager'],
    q_keywords: '',
    contact_email_status: ['verified'],
    include_similar_titles: true,

    // Organization
    q_organization_domains_list: [],
    q_organization_name: '',
    organization_locations: [],
    organization_not_locations: [],
    organization_num_employees_ranges: [],

    // Revenue
    revenue_range_min: undefined,
    revenue_range_max: undefined,

    // Technology
    currently_using_any_of_technology_uids: [],

    // Funding
    latest_funding_amount_range_min: undefined,
    latest_funding_amount_range_max: undefined,
    total_funding_range_min: undefined,
    total_funding_range_max: undefined,

    // Pagination
    page: 1,
    per_page: 100,
};

// ==========================================
// خيارات الفلاتر
// ==========================================
const SENIORITY_OPTIONS = [
    { value: 'owner', label: 'Owner' },
    { value: 'founder', label: 'Founder' },
    { value: 'c_suite', label: 'C-Level' },
    { value: 'partner', label: 'Partner' },
    { value: 'vp', label: 'VP' },
    { value: 'head', label: 'Head' },
    { value: 'director', label: 'Director' },
    { value: 'manager', label: 'Manager' },
    { value: 'senior', label: 'Senior' },
    { value: 'entry', label: 'Entry' },
];

const EMPLOYEE_RANGE_OPTIONS = [
    { value: '1,10', label: '1-10' },
    { value: '11,50', label: '11-50' },
    { value: '51,200', label: '51-200' },
    { value: '201,500', label: '201-500' },
    { value: '501,1000', label: '501-1000' },
    { value: '1001,5000', label: '1001-5000' },
    { value: '5001,10000', label: '5001-10000' },
    { value: '10001,', label: '10000+' },
];

const EMAIL_STATUS_OPTIONS = [
    { value: 'verified', label: 'Verified' },
    { value: 'unverified', label: 'Unverified' },
    { value: 'likely to engage', label: 'Likely to Engage' },
];

const ProviderPacksPage = () => {
    const navigate = useNavigate();
    const [selectedProvider, setSelectedProvider] = useState<any>(null);
    const [icpProfile, setIcpProfile] = useState<any>(null);
    const [apolloFilters, setApolloFilters] = useState<ApolloSearchFilters | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchMode, setSearchMode] = useState<'people' | 'companies'>('people');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleGenerate = async (provider: any) => {
        setLoading(true);
        setSelectedProvider(provider);
        setIcpProfile(null);
        setApolloFilters(null);

        // 1. Generate local ICP (Legacy/Fallback)
        const profile = generateICPFromProvider(provider);
        setIcpProfile(profile);

        // 2. Generate Apollo Filters via AI
        try {
            const industryNames = provider.industries.map((i: any) => i.name);
            const aiFilters = await generateApolloFilters(provider.description, industryNames);
            // دمج الفلاتر الافتراضية مع فلاتر AI
            setApolloFilters({
                ...DEFAULT_FILTERS,
                ...aiFilters,
            });
        } catch (err) {
            console.error("AI Generation Failed", err);
            setApolloFilters(DEFAULT_FILTERS);
        }

        setLoading(false);
    };

    const updateFilter = (key: keyof ApolloSearchFilters, value: any) => {
        if (!apolloFilters) return;
        setApolloFilters({ ...apolloFilters, [key]: value });
    };

    const toggleArrayFilter = (key: keyof ApolloSearchFilters, value: string) => {
        if (!apolloFilters) return;
        const current = (apolloFilters[key] as string[]) || [];
        const newValue = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        setApolloFilters({ ...apolloFilters, [key]: newValue });
    };

    const handleRunSearch = async () => {
        const envKey = (import.meta as any).env.VITE_APOLLO_API_KEY;

        if (!envKey) {
            alert("مفتاح Apollo API غير موجود في ملف .env (VITE_APOLLO_API_KEY)");
            return;
        }

        if (!apolloFilters) {
            alert("الرجاء توليد الفلاتر أولاً");
            return;
        }

        setLoading(true);
        try {
            let results: any[] = [];
            if (searchMode === 'people') {
                results = await searchApolloPeople(apolloFilters, envKey);
            } else {
                results = await searchApolloCompanies(apolloFilters, envKey);
            }

            const stagingRows = transformApolloToStaging(results, `job-apollo-${Date.now()}`, searchMode);

            navigate('/app/data-center/staging', {
                state: {
                    importId: `job-apollo-${Date.now()}`,
                    rows: stagingRows,
                    source: 'apollo'
                }
            });
        } catch (err: any) {
            alert(`فشل البحث في Apollo: ${err.message}`);
            console.error("Apollo Error", err);
        }
        setLoading(false);
    };

    return (
        <div className="h-full flex flex-col p-6 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Icons.Contacts className="w-8 h-8 text-brand" />
                    مرشحات نينجا - Apollo Search
                    <span className="text-xs bg-brand/10 text-brand px-2 py-1 rounded-full">AI Powered</span>
                </h1>
                <p className="text-slate-500 mt-2 max-w-2xl">
                    بحث متقدم في قاعدة بيانات Apollo.io باستخدام كل الفلاتر المتاحة للعثور على العملاء المحتملين.
                </p>
            </div>

            <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">

                {/* Left Column: Provider List */}
                <div className="col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-bold text-slate-800">اختر مزود الخدمة</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {MOCK_PROVIDERS.map((provider) => (
                            <button
                                key={provider.id}
                                onClick={() => handleGenerate(provider)}
                                className={`w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-right
                                    ${selectedProvider?.id === provider.id ? 'bg-blue-50 border-r-4 border-brand' : ''}
                                `}
                            >
                                <div>
                                    <div className="font-bold text-slate-800">{provider.name}</div>
                                    <div className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">{provider.description}</div>
                                </div>
                                <Icons.ChevronLeft className="w-4 h-4 text-slate-300 transform rotate-180" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Filters */}
                <div className="col-span-9 overflow-y-auto">
                    {loading && (
                        <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-dashed border-slate-300">
                            <div className="text-center">
                                <Icons.Settings className="w-8 h-8 text-brand animate-spin mx-auto mb-2" />
                                <p className="text-slate-500">جاري تحليل البيانات وبناء الفلاتر...</p>
                            </div>
                        </div>
                    )}

                    {!loading && apolloFilters && (
                        <div className="space-y-6 animate-slide-up">
                            {/* Header with Search Button */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            <span className="text-2xl">⚡</span>
                                            فلاتر البحث في Apollo
                                        </h3>
                                        <p className="text-slate-500 text-sm mt-1">
                                            تم توليد الفلاتر بناءً على تحليل {selectedProvider.name}. يمكنك تعديلها حسب الحاجة.
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-3">
                                        <div className="flex bg-slate-100 p-1 rounded-lg">
                                            <button
                                                onClick={() => setSearchMode('people')}
                                                className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${searchMode === 'people' ? 'bg-white shadow text-brand' : 'text-slate-500'}`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <Icons.User className="w-4 h-4" />
                                                    أشخاص
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => setSearchMode('companies')}
                                                className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${searchMode === 'companies' ? 'bg-white shadow text-brand' : 'text-slate-500'}`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <Icons.Building className="w-4 h-4" />
                                                    شركات
                                                </span>
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleRunSearch}
                                            className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-bold shadow-lg shadow-brand/20 flex items-center gap-2"
                                        >
                                            <Icons.Search className="w-5 h-5" />
                                            بحث واستيراد ({apolloFilters.per_page} نتيجة)
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Person Filters */}
                            {searchMode === 'people' && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Icons.User className="w-5 h-5 text-brand" />
                                        فلاتر الأشخاص
                                    </h4>

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Job Titles */}
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">المسميات الوظيفية</label>
                                            <input
                                                type="text"
                                                value={apolloFilters.person_titles?.join(', ') || ''}
                                                onChange={(e) => updateFilter('person_titles', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                                placeholder="CEO, CTO, Manager..."
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                            />
                                            <p className="text-xs text-slate-400 mt-1">افصل بين المسميات بفاصلة</p>
                                        </div>

                                        {/* Keywords */}
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">كلمات مفتاحية</label>
                                            <input
                                                type="text"
                                                value={apolloFilters.q_keywords || ''}
                                                onChange={(e) => updateFilter('q_keywords', e.target.value)}
                                                placeholder="software, marketing, sales..."
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                            />
                                        </div>

                                        {/* Seniority Levels */}
                                        <div className="col-span-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">مستوى الأقدمية</label>
                                            <div className="flex flex-wrap gap-2">
                                                {SENIORITY_OPTIONS.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => toggleArrayFilter('person_seniorities', opt.value)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                            apolloFilters.person_seniorities?.includes(opt.value as any)
                                                                ? 'bg-brand text-white'
                                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                        }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Email Status */}
                                        <div className="col-span-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">حالة البريد الإلكتروني</label>
                                            <div className="flex flex-wrap gap-2">
                                                {EMAIL_STATUS_OPTIONS.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => toggleArrayFilter('contact_email_status', opt.value)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                            apolloFilters.contact_email_status?.includes(opt.value as any)
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                        }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Organization Filters */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Icons.Building className="w-5 h-5 text-brand" />
                                    فلاتر الشركات
                                </h4>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Locations */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">المواقع الجغرافية</label>
                                        <input
                                            type="text"
                                            value={apolloFilters.organization_locations?.join(', ') || ''}
                                            onChange={(e) => updateFilter('organization_locations', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                            placeholder="Saudi Arabia, UAE, Egypt..."
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                        />
                                    </div>

                                    {/* Excluded Locations */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">استبعاد المواقع</label>
                                        <input
                                            type="text"
                                            value={apolloFilters.organization_not_locations?.join(', ') || ''}
                                            onChange={(e) => updateFilter('organization_not_locations', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                            placeholder="China, India..."
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                        />
                                    </div>

                                    {/* Domains */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">نطاقات محددة</label>
                                        <input
                                            type="text"
                                            value={apolloFilters.q_organization_domains_list?.join(', ') || ''}
                                            onChange={(e) => updateFilter('q_organization_domains_list', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                            placeholder="google.com, microsoft.com..."
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                        />
                                    </div>

                                    {/* Company Name */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">اسم الشركة</label>
                                        <input
                                            type="text"
                                            value={apolloFilters.q_organization_name || ''}
                                            onChange={(e) => updateFilter('q_organization_name', e.target.value)}
                                            placeholder="Google, Microsoft..."
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                        />
                                    </div>

                                    {/* Employee Ranges */}
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">حجم الشركة (عدد الموظفين)</label>
                                        <div className="flex flex-wrap gap-2">
                                            {EMPLOYEE_RANGE_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => toggleArrayFilter('organization_num_employees_ranges', opt.value)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                        apolloFilters.organization_num_employees_ranges?.includes(opt.value)
                                                            ? 'bg-purple-500 text-white'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Filters Toggle */}
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="w-full py-3 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <Icons.Settings className="w-4 h-4" />
                                {showAdvanced ? 'إخفاء الفلاتر المتقدمة' : 'عرض الفلاتر المتقدمة'}
                                <Icons.ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Advanced Filters */}
                            {showAdvanced && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Icons.Settings className="w-5 h-5 text-brand" />
                                        فلاتر متقدمة
                                    </h4>

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Revenue Range */}
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">الإيرادات السنوية (الحد الأدنى)</label>
                                            <input
                                                type="number"
                                                value={apolloFilters.revenue_range_min || ''}
                                                onChange={(e) => updateFilter('revenue_range_min', e.target.value ? Number(e.target.value) : undefined)}
                                                placeholder="1000000"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">الإيرادات السنوية (الحد الأقصى)</label>
                                            <input
                                                type="number"
                                                value={apolloFilters.revenue_range_max || ''}
                                                onChange={(e) => updateFilter('revenue_range_max', e.target.value ? Number(e.target.value) : undefined)}
                                                placeholder="100000000"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                            />
                                        </div>

                                        {/* Funding Range */}
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">آخر تمويل (الحد الأدنى)</label>
                                            <input
                                                type="number"
                                                value={apolloFilters.latest_funding_amount_range_min || ''}
                                                onChange={(e) => updateFilter('latest_funding_amount_range_min', e.target.value ? Number(e.target.value) : undefined)}
                                                placeholder="500000"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">آخر تمويل (الحد الأقصى)</label>
                                            <input
                                                type="number"
                                                value={apolloFilters.latest_funding_amount_range_max || ''}
                                                onChange={(e) => updateFilter('latest_funding_amount_range_max', e.target.value ? Number(e.target.value) : undefined)}
                                                placeholder="50000000"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                            />
                                        </div>

                                        {/* Total Funding */}
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">إجمالي التمويل (الحد الأدنى)</label>
                                            <input
                                                type="number"
                                                value={apolloFilters.total_funding_range_min || ''}
                                                onChange={(e) => updateFilter('total_funding_range_min', e.target.value ? Number(e.target.value) : undefined)}
                                                placeholder="1000000"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">إجمالي التمويل (الحد الأقصى)</label>
                                            <input
                                                type="number"
                                                value={apolloFilters.total_funding_range_max || ''}
                                                onChange={(e) => updateFilter('total_funding_range_max', e.target.value ? Number(e.target.value) : undefined)}
                                                placeholder="100000000"
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                            />
                                        </div>

                                        {/* Results Per Page */}
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">عدد النتائج</label>
                                            <select
                                                value={apolloFilters.per_page || 100}
                                                onChange={(e) => updateFilter('per_page', Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                            >
                                                <option value={25}>25</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                            </select>
                                        </div>

                                        {/* Include Similar Titles */}
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="similar-titles"
                                                checked={apolloFilters.include_similar_titles || false}
                                                onChange={(e) => updateFilter('include_similar_titles', e.target.checked)}
                                                className="w-4 h-4 text-brand rounded"
                                            />
                                            <label htmlFor="similar-titles" className="text-sm text-slate-700">
                                                تضمين مسميات وظيفية مشابهة
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* JSON Preview */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <details className="group">
                                    <summary className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 hover:text-brand font-medium select-none">
                                        <Icons.Code className="w-4 h-4" />
                                        عرض الفلاتر كـ JSON
                                    </summary>
                                    <pre className="mt-4 p-4 bg-slate-900 text-slate-50 rounded-lg text-xs font-mono overflow-auto max-h-64" dir="ltr">
                                        {JSON.stringify(apolloFilters, null, 2)}
                                    </pre>
                                </details>
                            </div>
                        </div>
                    )}

                    {!loading && !selectedProvider && (
                        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <div className="text-center">
                                <Icons.Contacts className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-400">اختر مزود خدمة من القائمة لتوليد فلاتر البحث</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProviderPacksPage;
