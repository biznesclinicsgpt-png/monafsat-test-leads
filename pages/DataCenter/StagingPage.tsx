import React, { useEffect, useState } from 'react';
import StagingGrid from '@/components/DataCenter/StagingGrid';
import AllDataView from '@/components/DataCenter/AllDataView';
import LemlistSearch from '@/components/DataCenter/LemlistSearch';
import { Icons } from '@/constants';
import { useLocation } from 'react-router-dom';
import { StagingRow } from '@/types/data-center';
import { runBatchEnrichment, EnrichmentResult } from '@/services/pipeline/enrichmentOrchestrator';
import { getAvailableProviders, getProviderCredentials, type Provider } from '@/services/integrationsService';

interface EnrichmentProgress {
    current: number;
    total: number;
    lastResult?: EnrichmentResult;
}

interface EnrichmentSummary {
    total: number;
    fullyEnriched: number;
    partiallyEnriched: number;
    failed: number;
    personsEnriched: number;
    companiesEnriched: number;
}

const StagingPage = () => {
    const location = useLocation();
    const [rows, setRows] = useState<StagingRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'standard' | 'full'>('standard');
    const [enrichmentProgress, setEnrichmentProgress] = useState<EnrichmentProgress | null>(null);
    const [enrichmentSummary, setEnrichmentSummary] = useState<EnrichmentSummary | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showLemlistSearch, setShowLemlistSearch] = useState(false);
    const [lemlistApiKey, setLemlistApiKey] = useState<string>(
        (import.meta as any).env.VITE_LEMLIST_API_KEY || ''
    );
    const [connectedProviders, setConnectedProviders] = useState<Provider[]>([]);
    const [selectedProvider, setSelectedProvider] = useState<string>('apollo');
    const [enrichmentType, setEnrichmentType] = useState<'email' | 'phone'>('email');
    const [showProviderSelector, setShowProviderSelector] = useState(false);

    useEffect(() => {
        // Retrieve passed state from logic (or fetch from DB simulation)
        const state = location.state as { importId: string, rows: any[] };
        if (state?.rows) {
            // Check if rows are already StagingRow (from Apollo Service) or raw data (from CSV Import)
            const isAlreadyStaging = state.rows.length > 0 && 'importJobId' in state.rows[0];

            if (isAlreadyStaging) {
                setRows(state.rows);
            } else {
                // Convert raw rows to StagingRows mock
                const mockStagingRows: StagingRow[] = state.rows.map((r, idx) => ({
                    id: `row-${idx}`,
                    importJobId: state.importId,
                    rawJson: r,
                    rowStatus: 'new', // Reset status to new for testing pipeline
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }));
                setRows(mockStagingRows);
            }
        }
    }, [location.state]);

    // Load connected providers
    useEffect(() => {
        const providers = getAvailableProviders();
        const connected = providers.filter(p => p.status === 'active' && p.hasCredentials);
        console.log('📋 All providers:', providers.map(p => ({ slug: p.slug, status: p.status, hasCredentials: p.hasCredentials })));
        console.log('✅ Connected providers:', connected.map(p => p.slug));
        setConnectedProviders(connected);

        // Set default provider if available
        if (connected.length > 0) {
            // Prioritize by enrichment type
            const phoneProviders = connected.filter(p => p.capabilities.phone);
            const emailProviders = connected.filter(p => p.capabilities.email);

            if (enrichmentType === 'phone' && phoneProviders.length > 0) {
                setSelectedProvider(phoneProviders[0].slug);
            } else if (emailProviders.length > 0) {
                setSelectedProvider(emailProviders[0].slug);
            }
        }
    }, [enrichmentType]);

    const handleRunEnrichment = async () => {
        // Get API key for selected provider
        let apiKey = getProviderCredentials(selectedProvider);

        // Fallback to env variable for Apollo
        if (!apiKey && selectedProvider === 'apollo') {
            apiKey = (import.meta as any).env.VITE_APOLLO_API_KEY;
        }

        if (!apiKey) {
            const providerName = connectedProviders.find(p => p.slug === selectedProvider)?.name || selectedProvider;
            alert(`مفتاح ${providerName} API غير موجود. قم بربط المزود من صفحة التكاملات أولاً.`);
            return;
        }

        // تحديد الصفوف للمعالجة - المحددة أو الكل
        const rowsToProcess = selectedIds.size > 0
            ? rows.filter(r => selectedIds.has(r.id))
            : rows;

        if (rowsToProcess.length === 0) {
            alert('لا توجد بيانات للإثراء. قم بتحديد صفوف أو تأكد من وجود بيانات.');
            return;
        }

        setLoading(true);
        setEnrichmentProgress({ current: 0, total: rowsToProcess.length });
        setEnrichmentSummary(null);

        try {
            // تشغيل معالج الإثراء على الصفوف المحددة
            const { results, summary } = await runBatchEnrichment(
                rowsToProcess,
                apiKey,
                (current, total, result) => {
                    setEnrichmentProgress({ current, total, lastResult: result });
                }
            );

            // تحديث الصفوف المعالجة فقط في القائمة الكاملة
            const updatedRows = rows.map(row => {
                const processedResult = results.find(r => r.row.id === row.id);
                return processedResult ? processedResult.row : row;
            });

            setRows(updatedRows);

            // عرض الملخص
            setEnrichmentSummary(summary);
            setShowSummary(true);
            setEnrichmentProgress(null);

            // مسح الاختيار بعد المعالجة
            setSelectedIds(new Set());

        } catch (error: any) {
            console.error("Enrichment error", error);
            alert(`فشل الإثراء: ${error.message}`);
        }

        setLoading(false);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">المراجعة والإثراء</h2>
                    <p className="text-slate-500 text-sm">إثراء بيانات الأشخاص والشركات عبر Apollo API.</p>
                </div>
                <div className="flex gap-3">
                    {/* Provider & Type Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProviderSelector(!showProviderSelector)}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium flex items-center gap-2"
                        >
                            <Icons.Settings className="w-4 h-4" />
                            {connectedProviders.find(p => p.slug === selectedProvider)?.name || 'اختر مزود'}
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                                enrichmentType === 'phone' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                                {enrichmentType === 'phone' ? 'هاتف' : 'بريد'}
                            </span>
                        </button>

                        {showProviderSelector && (
                            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-4">
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">نوع الإثراء</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEnrichmentType('email')}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                enrichmentType === 'email'
                                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            البريد الإلكتروني
                                        </button>
                                        <button
                                            onClick={() => setEnrichmentType('phone')}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                enrichmentType === 'phone'
                                                    ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            الهاتف
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        المزود ({connectedProviders.filter(p =>
                                            enrichmentType === 'phone' ? p.capabilities.phone : p.capabilities.email
                                        ).length} متاح)
                                    </label>
                                    <div className="space-y-1 max-h-48 overflow-y-auto">
                                        {connectedProviders
                                            .filter(p => enrichmentType === 'phone' ? p.capabilities.phone : p.capabilities.email)
                                            .map(provider => (
                                                <button
                                                    key={provider.slug}
                                                    onClick={() => {
                                                        setSelectedProvider(provider.slug);
                                                        setShowProviderSelector(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                                        selectedProvider === provider.slug
                                                            ? 'bg-indigo-50 border-2 border-indigo-500'
                                                            : 'hover:bg-slate-50 border border-transparent'
                                                    }`}
                                                >
                                                    {provider.logoUrl ? (
                                                        <img
                                                            src={provider.logoUrl}
                                                            alt={provider.name}
                                                            className="w-8 h-8 rounded object-contain bg-slate-100 p-1"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                            {provider.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 text-right">
                                                        <div className="font-medium text-slate-900 text-sm">{provider.name}</div>
                                                        <div className="text-xs text-slate-500">
                                                            {provider.capabilities.phone && <span className="ml-1">📱</span>}
                                                            {provider.capabilities.email && <span className="ml-1">📧</span>}
                                                        </div>
                                                    </div>
                                                    {selectedProvider === provider.slug && (
                                                        <Icons.Check className="w-4 h-4 text-indigo-600" />
                                                    )}
                                                </button>
                                            ))}

                                        {connectedProviders.filter(p =>
                                            enrichmentType === 'phone' ? p.capabilities.phone : p.capabilities.email
                                        ).length === 0 && (
                                            <div className="text-center py-4 text-slate-500 text-sm">
                                                <p>لا يوجد مزودين متصلين يدعمون {enrichmentType === 'phone' ? 'الهاتف' : 'البريد'}</p>
                                                <a
                                                    href="/app/data-center/integrations"
                                                    className="text-indigo-600 hover:underline mt-1 block"
                                                >
                                                    قم بربط مزود من التكاملات
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowProviderSelector(false)}
                                    className="w-full mt-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200"
                                >
                                    إغلاق
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Lemlist Database Search */}
                    <button
                        onClick={() => setShowLemlistSearch(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 font-bold shadow-lg shadow-purple-200"
                    >
                        <Icons.Database className="w-5 h-5" />
                        بحث Lemlist
                    </button>

                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('standard')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                viewMode === 'standard'
                                    ? 'bg-white text-brand shadow-sm'
                                    : 'text-slate-600 hover:text-slate-800'
                            }`}
                        >
                            عرض قياسي
                        </button>
                        <button
                            onClick={() => setViewMode('full')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                viewMode === 'full'
                                    ? 'bg-white text-brand shadow-sm'
                                    : 'text-slate-600 hover:text-slate-800'
                            }`}
                        >
                            <span className="flex items-center gap-1">
                                <Icons.Database className="w-4 h-4" />
                                عرض شامل
                            </span>
                        </button>
                    </div>

                    <button
                        onClick={handleRunEnrichment}
                        disabled={loading || rows.length === 0 || !selectedProvider}
                        className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
                            loading
                                ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed'
                                : selectedIds.size > 0
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                        }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                جاري الإثراء من {connectedProviders.find(p => p.slug === selectedProvider)?.name || selectedProvider}...
                            </>
                        ) : (
                            <>
                                <Icons.Zap className="w-5 h-5" />
                                {selectedIds.size > 0
                                    ? `إثراء ${enrichmentType === 'phone' ? 'الهاتف' : 'البريد'} (${selectedIds.size})`
                                    : `إثراء ${enrichmentType === 'phone' ? 'الهاتف' : 'البريد'} (${rows.length})`
                                }
                            </>
                        )}
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-bold">
                        حذف الكل
                    </button>
                    <button className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors flex items-center gap-2 font-bold shadow-lg shadow-brand/20">
                        <Icons.Check className="w-5 h-5" />
                        اعتماد ونقل إلى جهات الاتصال
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            {enrichmentProgress && (
                <div className="mb-4 bg-white rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                            جاري إثراء {enrichmentType === 'phone' ? 'الهاتف' : 'البريد'} من {connectedProviders.find(p => p.slug === selectedProvider)?.name || selectedProvider}...
                        </span>
                        <span className="text-sm text-slate-500">
                            {enrichmentProgress.current} / {enrichmentProgress.total}
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div
                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(enrichmentProgress.current / enrichmentProgress.total) * 100}%` }}
                        />
                    </div>
                    {enrichmentProgress.lastResult && (
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                                enrichmentProgress.lastResult.status === 'enriched' ? 'bg-green-500' :
                                enrichmentProgress.lastResult.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            {enrichmentProgress.lastResult.message}
                        </div>
                    )}
                </div>
            )}

            {/* Summary Modal - Updated for new structure */}
            {showSummary && enrichmentSummary && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                        <div className="bg-gradient-to-l from-indigo-500 to-purple-600 text-white p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <Icons.Database className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">اكتمل إثراء {enrichmentType === 'phone' ? 'الهاتف' : 'البريد'}!</h3>
                                    <p className="text-white/80 text-sm">تم الإثراء عبر {connectedProviders.find(p => p.slug === selectedProvider)?.name || selectedProvider}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-slate-50 rounded-lg p-4 text-center">
                                    <div className="text-3xl font-bold text-slate-800">{enrichmentSummary.total}</div>
                                    <div className="text-sm text-slate-500">إجمالي السجلات</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <div className="text-3xl font-bold text-green-600">{enrichmentSummary.fullyEnriched}</div>
                                    <div className="text-sm text-green-700">إثراء كامل</div>
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                    <div className="text-3xl font-bold text-yellow-600">{enrichmentSummary.partiallyEnriched}</div>
                                    <div className="text-sm text-yellow-700">إثراء جزئي</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{enrichmentSummary.personsEnriched}</div>
                                    <div className="text-xs text-blue-700">أشخاص تم إثراؤهم</div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600">{enrichmentSummary.companiesEnriched}</div>
                                    <div className="text-xs text-purple-700">شركات تم إثراؤها</div>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-red-600">{enrichmentSummary.failed}</div>
                                    <div className="text-xs text-red-700">فشل الإثراء</div>
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    onClick={() => setShowSummary(false)}
                                    className="px-6 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition-colors"
                                >
                                    حسناً، عرض النتائج
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Selection Info Bar */}
            {selectedIds.size > 0 && (
                <div className="mb-4 bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Icons.Check className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="text-sm font-medium text-indigo-700">
                            تم تحديد <span className="font-bold">{selectedIds.size}</span> من أصل {rows.length} سجل
                        </span>
                    </div>
                    <button
                        onClick={() => setSelectedIds(new Set())}
                        className="text-xs px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-100"
                    >
                        إلغاء التحديد
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-auto bg-white rounded-lg shadow-sm border border-slate-200">
                {viewMode === 'standard' ? (
                    <StagingGrid
                        rows={rows}
                        loading={loading}
                        selectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                        onEdit={(row) => alert(`تعديل السجل: ${row.rawJson['First Name']} ${row.rawJson['Last Name']}\n(سيتم تفعيل واجهة التعديل الكاملة قريباً)`)}
                    />
                ) : (
                    <AllDataView
                        rows={rows}
                        loading={loading}
                    />
                )}
            </div>

            {/* Lemlist API Key Modal */}
            {showLemlistSearch && !lemlistApiKey && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Icons.Shield className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">مفتاح Lemlist API</h3>
                                <p className="text-sm text-slate-500">أدخل مفتاح API للوصول لقاعدة البيانات</p>
                            </div>
                        </div>
                        <input
                            type="password"
                            placeholder="أدخل مفتاح Lemlist API..."
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            onChange={(e) => setLemlistApiKey(e.target.value)}
                        />
                        <p className="text-xs text-slate-500 mb-4">
                            يمكنك الحصول على مفتاح API من{' '}
                            <a href="https://app.lemlist.com/settings/integrations" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                                إعدادات Lemlist
                            </a>
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLemlistSearch(false)}
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={() => {/* API key is already set via onChange */}}
                                disabled={!lemlistApiKey}
                                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                            >
                                متابعة
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lemlist Search Modal */}
            {showLemlistSearch && lemlistApiKey && (
                <LemlistSearch
                    apiKey={lemlistApiKey}
                    onImportLeads={(leads) => {
                        // Transform and add to existing rows
                        const newRows: StagingRow[] = leads.map((lead, idx) => ({
                            id: `lemlist-${Date.now()}-${idx}`,
                            importJobId: `lemlist-import-${Date.now()}`,
                            rawJson: lead.rawJson,
                            normalizedJson: lead.normalizedJson,
                            rowStatus: 'new',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        }));
                        setRows(prev => [...newRows, ...prev]);
                    }}
                    onClose={() => setShowLemlistSearch(false)}
                />
            )}
        </div>
    );
};

export default StagingPage;
