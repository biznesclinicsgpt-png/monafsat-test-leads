
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
        <div className="p-8 max-w-7xl mx-auto dark:text-white min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">💎 Ninja Control Center</h1>
                    <p className="text-gray-400">مراقبة أداء المزودين وتشخيص النينجا</p>
                </div>
                <button className="bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-slate-700 transition-colors border border-slate-700 shadow-lg font-bold">
                    <Download size={18} />
                    تصدير البيانات
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 relative z-10">
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl group hover:border-emerald-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                            <Users size={24} />
                        </div>
                        <span className="text-emerald-400 text-sm font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                            <TrendingUp size={14} /> +12%
                        </span>
                    </div>
                    <div className="text-3xl font-black mb-1 text-white">{providers.length}</div>
                    <div className="text-sm text-gray-400">إجمالي المزودين</div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl group hover:border-emerald-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                            <Activity size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-black mb-1 text-white">66.2</div>
                    <div className="text-sm text-gray-400">متوسط درجة النينجا</div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl group hover:border-emerald-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                            <Trophy size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-black mb-1 text-white">25%</div>
                    <div className="text-sm text-gray-400">نسبة النخب (Top Tier)</div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl group hover:border-emerald-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                            <Building2 size={24} />
                        </div>
                        <span className="text-rose-400 text-sm font-bold bg-rose-500/10 px-2 py-1 rounded-lg">Needs Action</span>
                    </div>
                    <div className="text-3xl font-black mb-1 text-white">8</div>
                    <div className="text-sm text-gray-400">مزودين بفجوات حرجة</div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden relative z-10">
                {/* Filters */}
                <div className="p-6 border-b border-slate-700/50 flex flex-col md:flex-row gap-4 justify-between bg-white/5">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="بحث عن شركة، مدير..."
                            className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-600 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-6 py-2 border border-slate-600 rounded-xl flex items-center gap-2 hover:bg-slate-700 transition-colors text-gray-300 font-bold">
                            <Filter size={18} />
                            تصنيف: {filterTier === 'all' ? 'الكل' : filterTier}
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-900/50 text-gray-400 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-6">الشركة</th>
                                <th className="p-6">الصناعة</th>
                                <th className="p-6">مؤشر النينجا</th>
                                <th className="p-6">جاهزية الأصول</th>
                                <th className="p-6">حالة الـ ICP</th>
                                <th className="p-6">آخر نشاط</th>
                                <th className="p-6 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {providers.filter(p => p.company_name.toLowerCase().includes(searchTerm.toLowerCase())).map((provider) => (
                                <tr key={provider.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-6">
                                        <div className="font-bold text-white text-lg">{provider.company_name}</div>
                                        <div className="text-sm text-gray-500 font-medium">{provider.contact_name}</div>
                                    </td>
                                    <td className="p-6 text-sm text-gray-300">
                                        <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">{provider.industry}</span>
                                    </td>
                                    <td className="p-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold ${getScoreColor(provider.ninja_score)}`}>
                                            <Trophy size={14} />
                                            {provider.ninja_score} | {provider.tier}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        {getAssetsSummary(provider.assets_ready)}
                                    </td>
                                    <td className="p-6 text-sm font-medium">
                                        {provider.icp_status === 'Defined' ? (
                                            <span className="text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg w-fit"><CheckCircle size={14} /> مكتمل</span>
                                        ) : (
                                            <span className="text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg w-fit"><AlertTriangle size={14} /> يحتاج مراجعة</span>
                                        )}
                                    </td>
                                    <td className="p-6 text-sm text-gray-500 font-mono">
                                        {provider.last_active}
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <button className="p-2 hover:bg-emerald-500/20 text-emerald-400 rounded-lg tooltip border border-transparent hover:border-emerald-500/30 transition-colors" title="عرض التقرير">
                                                <FileText size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg tooltip border border-transparent hover:border-blue-500/30 transition-colors" title="تعديل الملف">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-slate-700 text-gray-400 rounded-lg transition-colors">
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
                <div className="p-6 border-t border-slate-700/50 flex justify-center text-sm text-gray-500 font-bold">
                    عرض 1-4 من أصل 4
                </div>
            </div>
        </div>
    );
};

export default AdminNinjaPage;
