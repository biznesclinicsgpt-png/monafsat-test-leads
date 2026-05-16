import React, { useState, useMemo } from 'react';
import { Icons } from '@/constants';
import { StagingRow } from '@/types/data-center';
import LeadDetailTables from './LeadDetailTables';

interface AllDataViewProps {
    rows: StagingRow[];
    loading?: boolean;
}

// فحص إذا كانت القيمة غير مفيدة
const isUselessValue = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (value === '') return true;
    if (value === 'N/A' || value === 'n/a' || value === 'NA') return true;
    if (value === '-' || value === '--') return true;
    if (typeof value === 'boolean') return true;
    if (typeof value === 'string') {
        const lower = value.toLowerCase().trim();
        if (lower === 'true' || lower === 'false') return true;
    }
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return true;
    return false;
};

// تجميع كل الحقول المتاحة من جميع السجلات
const getAllAvailableFields = (rows: StagingRow[]): string[] => {
    const fieldSet = new Set<string>();

    rows.forEach(row => {
        // من rawJson
        Object.entries(row.rawJson || {}).forEach(([key, value]) => {
            if (!isUselessValue(value)) {
                fieldSet.add(key);
            }
        });

        // من normalizedJson
        Object.entries(row.normalizedJson || {}).forEach(([key, value]) => {
            if (!isUselessValue(value)) {
                fieldSet.add(`[N] ${key}`); // علامة للتمييز
            }
        });
    });

    return Array.from(fieldSet).sort();
};

// تصنيف الحقول
const categorizeFields = (fields: string[]): Record<string, string[]> => {
    const categories: Record<string, string[]> = {
        'المعلومات الشخصية': [],
        'معلومات الاتصال': [],
        'المعلومات المهنية': [],
        'معلومات الشركة': [],
        'الموقع': [],
        'التواصل الاجتماعي': [],
        'التقييم والتصنيف': [],
        'أخرى': []
    };

    fields.forEach(field => {
        const lower = field.toLowerCase();

        if (lower.includes('name') || lower.includes('first') || lower.includes('last') ||
            lower.includes('photo') || lower.includes('headline') || lower.includes('bio') ||
            lower.includes('gender') || lower.includes('age')) {
            categories['المعلومات الشخصية'].push(field);
        } else if (lower.includes('email') || lower.includes('phone') || lower.includes('mobile') ||
                   lower.includes('dial') || lower.includes('fax')) {
            categories['معلومات الاتصال'].push(field);
        } else if (lower.includes('title') || lower.includes('job') || lower.includes('seniority') ||
                   lower.includes('department') || lower.includes('function') || lower.includes('employment') ||
                   lower.includes('education') || lower.includes('role')) {
            categories['المعلومات المهنية'].push(field);
        } else if (lower.includes('company') || lower.includes('organization') || lower.includes('domain') ||
                   lower.includes('website') || lower.includes('employee') || lower.includes('revenue') ||
                   lower.includes('funding') || lower.includes('founded') || lower.includes('industry') ||
                   lower.includes('tech') || lower.includes('sic') || lower.includes('naics')) {
            categories['معلومات الشركة'].push(field);
        } else if (lower.includes('city') || lower.includes('state') || lower.includes('country') ||
                   lower.includes('location') || lower.includes('address') || lower.includes('postal') ||
                   lower.includes('timezone') || lower.includes('headquarters')) {
            categories['الموقع'].push(field);
        } else if (lower.includes('linkedin') || lower.includes('twitter') || lower.includes('facebook') ||
                   lower.includes('github') || lower.includes('social') || lower.includes('url')) {
            categories['التواصل الاجتماعي'].push(field);
        } else if (lower.includes('score') || lower.includes('status') || lower.includes('tag') ||
                   lower.includes('keyword') || lower.includes('intent') || lower.includes('quality') ||
                   lower.includes('verified') || lower.includes('confidence')) {
            categories['التقييم والتصنيف'].push(field);
        } else {
            categories['أخرى'].push(field);
        }
    });

    // إزالة الفئات الفارغة
    return Object.fromEntries(
        Object.entries(categories).filter(([_, fields]) => fields.length > 0)
    );
};

const AllDataView: React.FC<AllDataViewProps> = ({ rows, loading }) => {
    const [selectedLead, setSelectedLead] = useState<StagingRow | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // جمع كل الحقول المتاحة
    const allFields = useMemo(() => getAllAvailableFields(rows), [rows]);
    const categorizedFields = useMemo(() => categorizeFields(allFields), [allFields]);

    // فلترة الحقول حسب البحث
    const filteredFields = useMemo(() => {
        if (!searchTerm) return selectedCategory ? categorizedFields[selectedCategory] || [] : allFields;
        const lower = searchTerm.toLowerCase();
        const fieldsToFilter = selectedCategory ? categorizedFields[selectedCategory] || [] : allFields;
        return fieldsToFilter.filter(f => f.toLowerCase().includes(lower));
    }, [allFields, categorizedFields, selectedCategory, searchTerm]);

    // حساب إحصائيات البيانات
    const stats = useMemo(() => {
        const totalFields = allFields.length;
        const totalRows = rows.length;
        const avgFieldsPerRow = Math.round(
            rows.reduce((sum, row) => {
                let count = 0;
                Object.values(row.rawJson || {}).forEach(v => { if (!isUselessValue(v)) count++; });
                Object.values(row.normalizedJson || {}).forEach(v => { if (!isUselessValue(v)) count++; });
                return sum + count;
            }, 0) / totalRows
        );

        return { totalFields, totalRows, avgFieldsPerRow };
    }, [rows, allFields]);

    if (loading) {
        return (
            <div className="p-10 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-500">جاري تحميل البيانات...</p>
            </div>
        );
    }

    if (!rows || rows.length === 0) {
        return (
            <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                <Icons.Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">لا توجد بيانات حالياً</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header with Stats */}
            <div className="bg-gradient-to-l from-brand to-brand-dark text-white p-6 rounded-t-lg">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">عرض شامل للبيانات</h2>
                        <p className="text-white/80 text-sm mt-1">جميع البيانات المتاحة للعملاء المحتملين</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                        >
                            <Icons.Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                        >
                            <Icons.Layers className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold">{stats.totalRows}</div>
                        <div className="text-white/70 text-sm">عميل محتمل</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold">{stats.totalFields}</div>
                        <div className="text-white/70 text-sm">حقل متاح</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold">{stats.avgFieldsPerRow}</div>
                        <div className="text-white/70 text-sm">متوسط الحقول لكل عميل</div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-50 border-b border-slate-200 p-4">
                <div className="flex items-center gap-4 flex-wrap">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Icons.Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="ابحث في الحقول..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
                        />
                    </div>

                    {/* Category Filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                !selectedCategory
                                    ? 'bg-brand text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            الكل ({allFields.length})
                        </button>
                        {Object.entries(categorizedFields).map(([category, fields]) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                    selectedCategory === category
                                        ? 'bg-brand text-white'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {category} ({fields.length})
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-white">
                {viewMode === 'grid' ? (
                    /* Grid View - Full Data Table */
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 text-right font-bold text-slate-700 border-b border-slate-200 sticky right-0 bg-slate-50">#</th>
                                    {filteredFields.slice(0, 15).map((field) => (
                                        <th key={field} className="p-3 text-right font-bold text-slate-700 border-b border-slate-200 whitespace-nowrap min-w-[150px]">
                                            {field.replace('[N] ', '')}
                                            {field.startsWith('[N]') && (
                                                <span className="text-xs text-brand mr-1">(معياري)</span>
                                            )}
                                        </th>
                                    ))}
                                    <th className="p-3 text-right font-bold text-slate-700 border-b border-slate-200">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rows.map((row, index) => (
                                    <tr key={row.id} className="hover:bg-slate-50">
                                        <td className="p-3 text-slate-400 sticky right-0 bg-white">{index + 1}</td>
                                        {filteredFields.slice(0, 15).map((field) => {
                                            const isNormalized = field.startsWith('[N] ');
                                            const actualField = isNormalized ? field.replace('[N] ', '') : field;
                                            const value = isNormalized
                                                ? row.normalizedJson?.[actualField]
                                                : row.rawJson[actualField];
                                            return (
                                                <td key={`${row.id}-${field}`} className="p-3 text-slate-600 max-w-[200px] truncate" title={String(value || '')}>
                                                    {isUselessValue(value) ? (
                                                        <span className="text-slate-300">—</span>
                                                    ) : (
                                                        <span>{String(value)}</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="p-3">
                                            <button
                                                onClick={() => setSelectedLead(row)}
                                                className="text-white bg-brand hover:bg-brand-dark px-3 py-1 rounded-lg text-xs font-medium"
                                            >
                                                عرض الكل
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredFields.length > 15 && (
                            <div className="bg-amber-50 border-t border-amber-200 p-3 text-center text-sm text-amber-700">
                                يتم عرض أول 15 حقل فقط. اضغط على "عرض الكل" لمشاهدة جميع الـ {filteredFields.length} حقل.
                            </div>
                        )}
                    </div>
                ) : (
                    /* Cards View */
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rows.map((row, index) => {
                            const name = row.rawJson['Full Name'] || row.rawJson['First Name'] || row.normalizedJson?.fullName || 'عميل محتمل';
                            const title = row.rawJson['Job Title'] || row.normalizedJson?.jobTitle;
                            const company = row.rawJson['Company'] || row.normalizedJson?.companyName;
                            const email = row.rawJson['Email'] || row.normalizedJson?.email;
                            const fieldCount = Object.values(row.rawJson || {}).filter(v => !isUselessValue(v)).length;

                            return (
                                <div
                                    key={row.id}
                                    className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => setSelectedLead(row)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">{name}</h3>
                                                {title && <p className="text-sm text-slate-500">{title}</p>}
                                            </div>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                            fieldCount > 20 ? 'bg-green-100 text-green-700' :
                                            fieldCount > 10 ? 'bg-blue-100 text-blue-700' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {fieldCount} حقل
                                        </span>
                                    </div>

                                    {company && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                                            <Icons.Building className="w-4 h-4 text-slate-400" />
                                            {company}
                                        </div>
                                    )}

                                    {email && !isUselessValue(email) && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                                            <Icons.Email className="w-4 h-4 text-slate-400" />
                                            {email}
                                        </div>
                                    )}

                                    <div className="mt-3 pt-3 border-t border-slate-100">
                                        <button className="w-full text-center text-sm font-medium text-brand hover:text-brand-dark">
                                            عرض جميع البيانات ({fieldCount} حقل)
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Field Summary Footer */}
            <div className="bg-slate-100 border-t border-slate-200 p-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                        <span className="font-medium">الحقول المتاحة:</span>{' '}
                        {allFields.slice(0, 10).join(' | ')}
                        {allFields.length > 10 && ` و ${allFields.length - 10} حقل آخر...`}
                    </div>
                    <button
                        onClick={() => {
                            const data = rows.map(row => ({ ...row.rawJson, ...row.normalizedJson }));
                            const json = JSON.stringify(data, null, 2);
                            const blob = new Blob([json], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'leads_full_data.json';
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                        <Icons.Database className="w-4 h-4" />
                        تصدير كل البيانات (JSON)
                    </button>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedLead && (
                <LeadDetailTables
                    lead={selectedLead}
                    onClose={() => setSelectedLead(null)}
                />
            )}
        </div>
    );
};

export default AllDataView;
