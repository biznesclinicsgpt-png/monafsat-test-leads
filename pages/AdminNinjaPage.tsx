
import React, { useState } from 'react';
import {
    Search, Filter, Download, Eye, MoreHorizontal,
    CheckCircle, XCircle, Trophy, TrendingUp, Users,
    Building2, Activity, FileText, AlertTriangle
} from 'lucide-react';

import { useData } from '../context/DataContext';
import { ProviderProfile } from '../types';

const AdminNinjaPage = () => {
    const { providerProfile } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTier, setFilterTier] = useState('all');

    // Mock Data (Static)
    const staticProviders = [
        {
            id: '2',
            company_name: 'Gulf Construction',
            industry: 'Construction',
            contact_name: 'Sara Omar',
            ninja_score: 45,
            tier: 'مبتدئ',
            assets_ready: { profile: true, deck: false, website: true, pricing: false, social: false },
            icp_status: 'Vague',
            last_active: '1d ago'
        },
        {
            id: '3',
            company_name: 'Creative Minds',
            industry: 'Marketing',
            contact_name: 'Khalid Waleed',
            ninja_score: 72,
            tier: 'متقدم',
            assets_ready: { profile: true, deck: true, website: true, pricing: false, social: true },
            icp_status: 'Defined',
            last_active: '5h ago'
        },
        {
            id: '4',
            company_name: 'Saudi Health Co',
            industry: 'Healthcare',
            contact_name: 'Dr. Faisal',
            ninja_score: 60,
            tier: 'متوسط',
            assets_ready: { profile: true, deck: false, website: true, pricing: true, social: false },
            icp_status: 'Missing',
            last_active: '3d ago'
        },
    ];

    // Merge Real Profile if exists
    let providers = [...staticProviders];
    if (providerProfile) {
        const diag = providerProfile.ninja_diagnosis || {};
        const assets = providerProfile.assets_readiness || {};

        const realProvider = {
            id: providerProfile.id || '1',
            company_name: providerProfile.company_name || 'My Company',
            industry: providerProfile.industries?.[0]?.name || 'Technology',
            contact_name: providerProfile.contact_name || 'You',
            ninja_score: diag.scores?.overallScore || 0,
            tier: diag.scores?.tierLabel || 'غير مصنف',
            assets_ready: {
                profile: assets.has_profile || false,
                deck: assets.has_deck || false,
                website: assets.has_website || false,
                pricing: assets.has_pricing || false,
                social: assets.has_social || false
            },
            icp_status: providerProfile.icp_structured?.industries?.length ? 'Defined' : 'Missing',
            last_active: 'Now (You)'
        };
        providers = [realProvider, ...staticProviders];
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-500 bg-emerald-50 border-emerald-200';
        if (score >= 60) return 'text-amber-500 bg-amber-50 border-amber-200';
        return 'text-rose-500 bg-rose-50 border-rose-200';
    };

    const getAssetsSummary = (assets: any) => {
        const total = Object.keys(assets).length;
        const ready = Object.values(assets).filter(Boolean).length;
        const pct = (ready / total) * 100;

        let color = 'bg-rose-500';
        if (pct >= 80) color = 'bg-emerald-500';
        else if (pct >= 50) color = 'bg-amber-500';

        return (
            <div className="flex items-center gap-2">
                <div className="flex-1 w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color}`} style={{ width: `${pct}%` }}></div>
                </div>
                <span className="text-xs font-bold text-gray-500">{ready}/{total}</span>
            </div>
        );
    };

    return (
        <div className="p-8 max-w-7xl mx-auto dark:text-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">💎 Ninja Control Center</h1>
                    <p className="text-gray-500">مراقبة أداء المزودين وتشخيص النينجا</p>
                </div>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-colors">
                    <Download size={18} />
                    تصدير البيانات
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                            <Users size={24} />
                        </div>
                        <span className="text-green-500 text-sm font-bold flex items-center gap-1">
                            <TrendingUp size={14} /> +12%
                        </span>
                    </div>
                    <div className="text-3xl font-bold mb-1">{providers.length}</div>
                    <div className="text-sm text-gray-400">إجمالي المزودين</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
                            <Activity size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">66.2</div>
                    <div className="text-sm text-gray-400">متوسط درجة النينجا</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
                            <Trophy size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">25%</div>
                    <div className="text-sm text-gray-400">نسبة النخب (Top Tier)</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl">
                            <Building2 size={24} />
                        </div>
                        <span className="text-rose-500 text-sm font-bold">Needs Action</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">8</div>
                    <div className="text-sm text-gray-400">مزودين بفجوات حرجة</div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="بحث عن شركة، مدير..."
                            className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Filter size={18} />
                            تصنيف: {filterTier === 'all' ? 'الكل' : filterTier}
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 font-bold text-sm">
                            <tr>
                                <th className="p-4">الشركة</th>
                                <th className="p-4">الصناعة</th>
                                <th className="p-4">مؤشر النينجا</th>
                                <th className="p-4">جاهزية الأصول</th>
                                <th className="p-4">حالة الـ ICP</th>
                                <th className="p-4">آخر نشاط</th>
                                <th className="p-4 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {providers.filter(p => p.company_name.toLowerCase().includes(searchTerm.toLowerCase())).map((provider) => (
                                <tr key={provider.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900 dark:text-white">{provider.company_name}</div>
                                        <div className="text-xs text-gray-500">{provider.contact_name}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                                        <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">{provider.industry}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-bold ${getScoreColor(provider.ninja_score)}`}>
                                            <Trophy size={14} />
                                            {provider.ninja_score} | {provider.tier}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {getAssetsSummary(provider.assets_ready)}
                                    </td>
                                    <td className="p-4 text-sm font-medium">
                                        {provider.icp_status === 'Defined' ? (
                                            <span className="text-emerald-500 flex items-center gap-1"><CheckCircle size={14} /> مكتمل</span>
                                        ) : (
                                            <span className="text-amber-500 flex items-center gap-1"><AlertTriangle size={14} /> يحتاج مراجعة</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">
                                        {provider.last_active}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg tooltip" title="عرض التقرير">
                                                <FileText size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg tooltip" title="تعديل الملف">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-center text-sm text-gray-500">
                    عرض 1-4 من أصل 4
                </div>
            </div>
        </div>
    );
};

export default AdminNinjaPage;
