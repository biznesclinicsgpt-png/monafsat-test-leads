import React, { useState } from 'react';
import { Icons } from '@/constants';
import { StagingRow } from '@/types/data-center';

interface LeadDetailTablesProps {
    lead: StagingRow;
    onClose: () => void;
}

// تصنيفات الحقول للعرض المنظم
const FIELD_CATEGORIES: Record<string, { label: string; icon: string; fields: string[] }> = {
    personal: {
        label: 'المعلومات الشخصية',
        icon: 'User',
        fields: [
            'first_name', 'last_name', 'name', 'full_name', 'fullName', 'firstName', 'lastName',
            'photo_url', 'avatar_url', 'headline', 'bio', 'summary', 'about',
            'gender', 'age', 'birth_date', 'nationality'
        ]
    },
    contact: {
        label: 'معلومات الاتصال',
        icon: 'Phone',
        fields: [
            'email', 'emails', 'personal_email', 'work_email', 'email_status', 'email_verified',
            'phone', 'phones', 'phone_numbers', 'mobile', 'mobile_phone', 'work_phone', 'direct_phone',
            'sanitized_phone', 'phone_2', 'fax'
        ]
    },
    professional: {
        label: 'المعلومات المهنية',
        icon: 'Briefcase',
        fields: [
            'title', 'job_title', 'jobTitle', 'position', 'role', 'headline',
            'seniority', 'seniority_level', 'department', 'departments', 'function', 'functions',
            'experience', 'years_experience', 'skills', 'expertise', 'certifications',
            'employment_history', 'previous_companies', 'career_path'
        ]
    },
    company: {
        label: 'معلومات الشركة',
        icon: 'Building',
        fields: [
            'company', 'company_name', 'companyName', 'organization', 'organization_name', 'org_name',
            'company_id', 'organization_id', 'employer'
        ]
    },
    companyDetails: {
        label: 'تفاصيل الشركة',
        icon: 'Info',
        fields: [
            'company_description', 'organization_description', 'company_about', 'company_summary',
            'company_founded', 'founded_year', 'company_type', 'company_status',
            'company_size', 'employees', 'employee_count', 'estimated_num_employees', 'num_employees',
            'employee_range', 'employee_count_range', 'headcount',
            'annual_revenue', 'revenue', 'revenue_range', 'funding', 'funding_total',
            'company_logo', 'logo_url', 'company_logo_url'
        ]
    },
    industry: {
        label: 'الصناعة والقطاع',
        icon: 'Layers',
        fields: [
            'industry', 'industries', 'industry_2', 'primary_industry', 'sub_industry',
            'sector', 'vertical', 'market', 'niche', 'category', 'segment',
            'sic_codes', 'naics_codes', 'industry_tags', 'industry_taxonomy'
        ]
    },
    location: {
        label: 'الموقع الجغرافي',
        icon: 'MapPin',
        fields: [
            'location', 'city', 'state', 'country', 'region', 'continent',
            'postal_code', 'zip_code', 'address', 'address_1', 'address_2', 'street',
            'timezone', 'time_zone', 'utc_offset', 'locale',
            'company_city', 'company_state', 'company_country', 'company_address', 'company_location',
            'headquarters', 'hq_location', 'hq_city', 'hq_country'
        ]
    },
    social: {
        label: 'وسائل التواصل الاجتماعي',
        icon: 'Share2',
        fields: [
            'linkedin', 'linkedin_url', 'linkedinUrl', 'linkedin_id', 'linkedin_profile',
            'twitter', 'twitter_url', 'twitter_handle', 'twitter_id',
            'facebook', 'facebook_url', 'facebook_id',
            'instagram', 'instagram_url', 'instagram_handle',
            'github', 'github_url', 'github_profile',
            'youtube', 'youtube_url', 'youtube_channel',
            'crunchbase', 'crunchbase_url', 'angellist', 'angellist_url',
            'company_linkedin', 'company_twitter', 'company_facebook'
        ]
    },
    web: {
        label: 'الويب والمواقع',
        icon: 'Globe',
        fields: [
            'website', 'website_url', 'domain', 'primary_domain', 'company_website',
            'blog', 'blog_url', 'portfolio', 'portfolio_url',
            'landing_page', 'personal_website', 'company_domain'
        ]
    },
    scoring: {
        label: 'التقييم والتصنيف',
        icon: 'Star',
        fields: [
            'score', 'fit_score', 'lead_score', 'icp_score', 'quality_score', 'engagement_score',
            'icp_status', 'lead_status', 'stage', 'pipeline_stage', 'funnel_stage',
            'priority', 'tier', 'segment', 'qualification', 'qualified',
            'rating', 'grade', 'rank', 'percentile'
        ]
    },
    tags: {
        label: 'التصنيفات والكلمات المفتاحية',
        icon: 'Tag',
        fields: [
            'tags', 'labels', 'categories', 'keywords', 'topics', 'interests',
            'custom_tags', 'user_tags', 'auto_tags', 'signals'
        ]
    },
    enrichment: {
        label: 'بيانات الإثراء',
        icon: 'Zap',
        fields: [
            'initial_icebreaker', 'icebreaker', 'personalized_message', 'outreach_message',
            'talking_points', 'conversation_starters', 'pain_points', 'challenges',
            'buying_intent', 'intent_signals', 'intent_score', 'tech_stack', 'technologies',
            'recent_news', 'company_news', 'hiring_signals', 'growth_signals'
        ]
    },
    verification: {
        label: 'التحقق والمصداقية',
        icon: 'Shield',
        fields: [
            'verification_status', 'email_verified', 'phone_verified', 'data_quality',
            'confidence_score', 'accuracy_score', 'freshness_score',
            'last_verified', 'verified_at', 'verification_source'
        ]
    },
    source: {
        label: 'المصدر والتتبع',
        icon: 'Database',
        fields: [
            'source', 'source_type', 'source_provider', 'source_id', 'source_record_id',
            'import_job_id', 'import_batch', 'campaign', 'campaign_id', 'campaign_name',
            'referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'channel',
            'list_name', 'list_id', 'file_name'
        ]
    },
    timestamps: {
        label: 'التواريخ والأوقات',
        icon: 'Clock',
        fields: [
            'created_at', 'createdAt', 'updated_at', 'updatedAt', 'imported_at',
            'first_seen_at', 'firstSeenAt', 'last_seen_at', 'lastSeenAt',
            'last_activity', 'last_contacted', 'last_engagement',
            'enriched_at', 'synced_at', 'verified_at'
        ]
    }
};

// فحص إذا كانت القيمة غير مفيدة
const isUselessValue = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (value === '') return true;
    if (value === 'N/A' || value === 'n/a' || value === 'NA') return true;
    if (value === '-' || value === '--') return true;

    // استبعاد القيم boolean فقط
    if (typeof value === 'boolean') return true;

    // استبعاد القيم التي هي فقط true/false كنص
    if (typeof value === 'string') {
        const lower = value.toLowerCase().trim();
        if (lower === 'true' || lower === 'false') return true;
    }

    // استبعاد المصفوفات الفارغة
    if (Array.isArray(value) && value.length === 0) return true;

    // استبعاد الكائنات الفارغة
    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return true;

    return false;
};

// تنسيق القيمة للعرض
const formatValue = (value: any): string => {
    if (isUselessValue(value)) return '';

    if (Array.isArray(value)) {
        // فلترة القيم الفارغة من المصفوفة
        const filtered = value.filter(v => !isUselessValue(v));
        if (filtered.length === 0) return '';
        return filtered.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(' | ');
    }

    if (typeof value === 'object') {
        // للكائنات المعقدة، عرض المحتوى بشكل منسق
        return formatObjectValue(value);
    }

    return String(value);
};

// تنسيق الكائنات المعقدة
const formatObjectValue = (obj: any): string => {
    if (!obj || typeof obj !== 'object') return String(obj);

    const parts: string[] = [];
    Object.entries(obj).forEach(([key, value]) => {
        if (!isUselessValue(value)) {
            if (typeof value === 'object') {
                parts.push(`${key}: ${formatObjectValue(value)}`);
            } else {
                parts.push(`${key}: ${value}`);
            }
        }
    });

    return parts.join(' | ');
};

// تحويل اسم الحقل للعرض
const formatFieldName = (fieldName: string): string => {
    return fieldName
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .trim();
};

// تصنيف حقل إلى فئته
const categorizeField = (fieldName: string): string => {
    const lowerField = fieldName.toLowerCase();

    for (const [category, config] of Object.entries(FIELD_CATEGORIES)) {
        if (config.fields.some(f => lowerField.includes(f.toLowerCase()) || f.toLowerCase().includes(lowerField))) {
            return category;
        }
    }

    return 'other';
};

const LeadDetailTables: React.FC<LeadDetailTablesProps> = ({ lead, onClose }) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(Object.keys(FIELD_CATEGORIES)));

    // جمع كل البيانات من rawJson و normalizedJson
    const allData: Record<string, any> = {
        ...lead.rawJson,
        ...lead.normalizedJson,
    };

    // إضافة metadata من StagingRow نفسه
    if (lead.rowStatus) allData['row_status'] = lead.rowStatus;
    if (lead.dedupeKey) allData['dedupe_key'] = lead.dedupeKey;
    if (lead.personId) allData['person_id'] = lead.personId;
    if (lead.companyId) allData['company_id'] = lead.companyId;
    if (lead.createdAt) allData['created_at'] = lead.createdAt;
    if (lead.updatedAt) allData['updated_at'] = lead.updatedAt;
    if (lead.rejectionReason) allData['rejection_reason'] = lead.rejectionReason;

    // تصنيف البيانات حسب الفئات
    const categorizedData: Record<string, Array<{ field: string; value: any }>> = {};
    const usedFields = new Set<string>();

    // أولاً: تصنيف الحقول المعروفة
    Object.entries(allData).forEach(([field, value]) => {
        if (isUselessValue(value)) return;

        const category = categorizeField(field);
        if (!categorizedData[category]) {
            categorizedData[category] = [];
        }
        categorizedData[category].push({ field, value });
        usedFields.add(field);
    });

    // ثانياً: إضافة الحقول غير المصنفة إلى "أخرى"
    Object.entries(allData).forEach(([field, value]) => {
        if (usedFields.has(field) || isUselessValue(value)) return;

        if (!categorizedData['other']) {
            categorizedData['other'] = [];
        }
        categorizedData['other'].push({ field, value });
    });

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const expandAll = () => setExpandedCategories(new Set([...Object.keys(FIELD_CATEGORIES), 'other']));
    const collapseAll = () => setExpandedCategories(new Set());

    const IconComponent = Icons.User; // Default icon

    const getCategoryIcon = (iconName: string) => {
        const iconMap: Record<string, any> = {
            User: Icons.User,
            Phone: Icons.Phone,
            Briefcase: Icons.Briefcase || Icons.User,
            Building: Icons.Building || Icons.Home,
            Info: Icons.Info || Icons.AlertCircle,
            Layers: Icons.Layers || Icons.Grid,
            MapPin: Icons.MapPin,
            Share2: Icons.Share2 || Icons.ExternalLink,
            Globe: Icons.Globe,
            Star: Icons.Star,
            Tag: Icons.Tag,
            Zap: Icons.Zap || Icons.Lightning,
            Shield: Icons.Shield || Icons.Check,
            Database: Icons.Database || Icons.Server,
            Clock: Icons.Clock,
            Folder: Icons.Folder || Icons.File
        };
        return iconMap[iconName] || Icons.File;
    };

    // حساب إحصائيات البيانات
    const totalFields = Object.values(categorizedData).reduce((sum, arr) => sum + arr.length, 0);
    const totalCategories = Object.keys(categorizedData).filter(cat => categorizedData[cat]?.length > 0).length;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-l from-brand to-brand-dark text-white p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                            <Icons.User className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">
                                {allData['Full Name'] || allData['fullName'] || allData['name'] ||
                                 `${allData['First Name'] || allData['firstName'] || ''} ${allData['Last Name'] || allData['lastName'] || ''}`.trim() ||
                                 'عميل محتمل'}
                            </h2>
                            <p className="text-white/80 text-sm mt-1">
                                {allData['Job Title'] || allData['title'] || allData['jobTitle']}
                                {(allData['Company'] || allData['companyName']) && ` في ${allData['Company'] || allData['companyName']}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right text-sm">
                            <div className="text-white/60">إجمالي البيانات</div>
                            <div className="font-bold">{totalFields} حقل في {totalCategories} فئة</div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                        >
                            <Icons.X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={expandAll}
                            className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            توسيع الكل
                        </button>
                        <button
                            onClick={collapseAll}
                            className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            طي الكل
                        </button>
                    </div>
                    <div className="text-sm text-slate-500">
                        يتم عرض جميع البيانات المتاحة (باستثناء القيم الفارغة و true/false)
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {[...Object.entries(FIELD_CATEGORIES), ['other', { label: 'بيانات أخرى', icon: 'Folder', fields: [] }] as const].map((entry) => {
                            const category = entry[0] as string;
                            const config = entry[1] as { label: string; icon: string; fields: string[] };
                            const categoryData = categorizedData[category];
                            if (!categoryData || categoryData.length === 0) return null;

                            const isExpanded = expandedCategories.has(category);
                            const CategoryIcon = getCategoryIcon(config.icon);

                            return (
                                <div
                                    key={category}
                                    className={`bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                                        categoryData.length > 8 ? 'lg:col-span-2' : ''
                                    }`}
                                >
                                    {/* Category Header */}
                                    <button
                                        onClick={() => toggleCategory(category)}
                                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-brand-50 text-brand rounded-lg flex items-center justify-center">
                                                <CategoryIcon className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-slate-700">{config.label}</span>
                                            <span className="text-xs bg-brand text-white px-2 py-0.5 rounded-full">
                                                {categoryData.length}
                                            </span>
                                        </div>
                                        <Icons.ChevronDown
                                            className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {/* Category Content */}
                                    {isExpanded && (
                                        <div className="divide-y divide-slate-100">
                                            {categoryData.map(({ field, value }, idx) => (
                                                <div
                                                    key={`${category}-${field}-${idx}`}
                                                    className="flex hover:bg-slate-50 transition-colors"
                                                >
                                                    <div className="w-1/3 p-3 bg-slate-50/50 border-l border-slate-100">
                                                        <span className="text-xs font-medium text-slate-500">
                                                            {formatFieldName(field)}
                                                        </span>
                                                    </div>
                                                    <div className="w-2/3 p-3">
                                                        <span className="text-sm text-slate-700 break-words">
                                                            {renderValue(field, value)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        <span className="font-medium text-slate-700">معرف السجل:</span> {lead.id}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                const dataStr = JSON.stringify(allData, null, 2);
                                navigator.clipboard.writeText(dataStr);
                                alert('تم نسخ البيانات!');
                            }}
                            className="px-4 py-2 text-sm font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2"
                        >
                            <Icons.Copy className="w-4 h-4" />
                            نسخ JSON
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function to render value with special formatting
const renderValue = (field: string, value: any): React.ReactNode => {
    const fieldLower = field.toLowerCase();
    const formattedValue = formatValue(value);

    if (!formattedValue) return <span className="text-slate-300">—</span>;

    // URLs - make clickable
    if (fieldLower.includes('url') || fieldLower.includes('website') || fieldLower.includes('linkedin') ||
        fieldLower.includes('twitter') || fieldLower.includes('facebook') || fieldLower.includes('domain')) {
        if (formattedValue.startsWith('http') || formattedValue.includes('.')) {
            const url = formattedValue.startsWith('http') ? formattedValue : `https://${formattedValue}`;
            return (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:text-brand-dark hover:underline flex items-center gap-1"
                >
                    {formattedValue}
                    <Icons.ExternalLink className="w-3 h-3" />
                </a>
            );
        }
    }

    // Emails - make mailto
    if (fieldLower.includes('email')) {
        return (
            <a
                href={`mailto:${formattedValue}`}
                className="text-brand hover:text-brand-dark hover:underline"
            >
                {formattedValue}
            </a>
        );
    }

    // Phone - make tel
    if (fieldLower.includes('phone') || fieldLower.includes('mobile')) {
        return (
            <a
                href={`tel:${formattedValue}`}
                className="text-brand hover:text-brand-dark hover:underline"
            >
                {formattedValue}
            </a>
        );
    }

    // Status badges
    if (fieldLower.includes('status')) {
        const statusColors: Record<string, string> = {
            verified: 'bg-green-100 text-green-700',
            valid: 'bg-green-100 text-green-700',
            active: 'bg-green-100 text-green-700',
            new: 'bg-blue-100 text-blue-700',
            enriched: 'bg-indigo-100 text-indigo-700',
            synced: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700',
            invalid: 'bg-red-100 text-red-700',
            risky: 'bg-yellow-100 text-yellow-700',
            pending: 'bg-yellow-100 text-yellow-700',
        };
        const colorClass = statusColors[formattedValue.toLowerCase()] || 'bg-slate-100 text-slate-700';
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                {formattedValue}
            </span>
        );
    }

    // Scores - show with color
    if (fieldLower.includes('score') && !isNaN(Number(formattedValue))) {
        const score = Number(formattedValue);
        const colorClass = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600';
        return <span className={`font-bold ${colorClass}`}>{formattedValue}</span>;
    }

    // Dates - format nicely
    if (fieldLower.includes('_at') || fieldLower.includes('date')) {
        try {
            const date = new Date(formattedValue);
            if (!isNaN(date.getTime())) {
                return (
                    <span className="text-slate-600">
                        {date.toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                );
            }
        } catch {
            // Fall through to default
        }
    }

    // Long text - truncate with tooltip
    if (formattedValue.length > 200) {
        return (
            <span title={formattedValue} className="cursor-help">
                {formattedValue.substring(0, 200)}...
            </span>
        );
    }

    return formattedValue;
};

export default LeadDetailTables;
