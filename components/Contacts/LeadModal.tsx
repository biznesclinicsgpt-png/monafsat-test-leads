import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Contact, PipelineStageLabels } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle, AlertCircle, Building2, Globe, MapPin, BarChart3, Sparkles, Copy, X, Server, Database, Phone, Mail, Calendar } from 'lucide-react';

interface LeadModalProps {
    mode: 'add' | 'edit' | 'view';
    contact?: Contact;
    onClose: () => void;
    onSave: (contact: Contact) => void;
}

const LeadModal: React.FC<LeadModalProps> = ({ mode, contact, onClose, onSave }) => {
    const { enrichLead, generateLeadScripts } = useData();
    const [enriching, setEnriching] = useState(false);
    const [formData, setFormData] = useState<Partial<Contact>>({
        name: '',
        first_name: '',
        last_name: '',
        company_name: '',
        email: '',
        phone: '',
        title: '',
        stage: undefined,
        source: 'Outbound',
        fitScore: 0,
        icpStatus: 'pending',
        tags: [],
        // GHL Fields
        address1: '',
        city: '',
        state: '',
        country: '',
        website: '',
        linkedin_url: '',
        arabic_summary: '',
        industry_ar: '',
        company_description: '',
        initial_icebreaker: '',
        size_2: '',
        employee_count: '',
        annual_revenue: '',
        welcome_message: '',
        follow_up_1: '',
        follow_up_2: '',
        follow_up_3: '',
        follow_up_4: '',
    });

    // UI State for Tabs
    const [activeTab, setActiveTab] = useState<'details' | 'intelligence' | 'strategy' | 'scripts' | 'system'>('details');
    const [generatingScripts, setGeneratingScripts] = useState(false);

    useEffect(() => {
        if (contact && (mode === 'edit' || mode === 'view')) {
            setFormData(contact);
        }
    }, [contact, mode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'view') {
            onClose();
            return;
        }

        onSave(formData as Contact);
    };

    const handleEnrich = async () => {
        if (!formData.company_name) {
            alert('الرجاء إدخال اسم الشركة أولاً');
            return;
        }
        setEnriching(true);
        try {
            const enriched = await enrichLead(formData);
            setFormData(prev => ({
                ...prev,
                ...enriched,
                // Preserve existing values if enriched returns empty for them
                company_description: enriched.company_description || prev.company_description,
                employee_count: enriched.employee_count || prev.employee_count,
                annual_revenue: enriched.annual_revenue || prev.annual_revenue,
                industry_ar: enriched.industry_ar || prev.industry_ar,
                company_linkedin_url: enriched.company_linkedin_url || prev.company_linkedin_url,
                source: 'AI_Enriched'
            }));
        } catch (error) {
            alert('فشل التحسين باستخدام AI. تأكد من صحة البيانات.');
        } finally {
            setEnriching(false);
        }
    };

    const handleGenerateScripts = async () => {
        setGeneratingScripts(true);
        try {
            await generateLeadScripts(formData as Contact);
            alert('تم إنشاء الرسائل بنجاح! يرجى تحديث الصفحة لرؤية النتائج إذا لم تظهر.');
        } catch (error) {
            alert('فشل إنشاء الرسائل. تأكد من إعداد OpenAI API Key.');
        } finally {
            setGeneratingScripts(false);
        }
    };

    const isViewMode = mode === 'view';

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]" dir="rtl">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white">
                    <h2 className="text-xl font-bold">
                        {mode === 'add' ? 'إضافة عميل محتمل جديد' : mode === 'edit' ? 'تعديل بيانات العميل' : 'تفاصيل العميل'}
                    </h2>
                    <div className="flex items-center gap-2">
                        {!isViewMode && (
                            <button
                                onClick={handleEnrich}
                                disabled={enriching}
                                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                            >
                                {enriching ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/50 border-t-white"></div>
                                        جاري البحث...
                                    </>
                                ) : (
                                    <>
                                        ✨ تحسين البيانات
                                    </>
                                )}
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto min-h-[500px]">
                    <form id="leadForm" onSubmit={handleSubmit} className="space-y-8 text-right">

                        {/* Tab Navigation */}
                        <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
                            {[
                                { id: 'details', label: 'نظرة عامة', icon: '👤' },
                                { id: 'intelligence', label: 'تحليل معمق (Deep Intelligence)', icon: '🏢' },
                                { id: 'strategy', label: 'استراتيجية AI', icon: '🧠' },
                                { id: 'scripts', label: 'الحملات', icon: '✉️' },
                                { id: 'system', label: 'النظام', icon: '⚙️' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`pb-4 px-2 font-bold text-sm transition-all relative flex items-center gap-2 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <span>{tab.icon}</span>
                                    {tab.label}
                                    {activeTab === tab.id && <motion.span layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                                </button>
                            ))}
                        </div>

                        {/* TAB 1: OVERVIEW */}
                        {activeTab === 'details' && (
                            <div className="space-y-8 animate-fadeIn">
                                {/* Core Identity */}
                                <div className="flex items-start gap-6">
                                    <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-4xl shadow-inner">
                                        {formData.name?.charAt(0)}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">الاسم الكامل</label>
                                                <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">المسمى الوظيفي</label>
                                                <input type="text" name="title" value={formData.title} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">البريد الإلكتروني</label>
                                                <div className="relative">
                                                    <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={isViewMode} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm text-slate-600" dir="ltr" />
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">الهاتف</label>
                                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm text-slate-600 mb-2" dir="ltr" />
                                                <label className="block text-[10px] font-bold text-slate-300 mb-1 uppercase">هاتف إضافي</label>
                                                <input type="text" name="phone_2" value={formData.phone_2} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-100 bg-slate-50 focus:bg-white text-xs font-mono text-slate-500" dir="ltr" placeholder="Secondary Phone" />
                                            </div>
                                        </div>

                                        {/* Additional Personal Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">العنوان</label>
                                                <input type="text" name="address1" value={formData.address1} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm" placeholder="Street Address" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">المدينة</label>
                                                    <input type="text" name="city" value={formData.city} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">الموقع</label>
                                                    <input type="text" name="website" value={formData.website} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm font-mono text-blue-500" placeholder="www.example.com" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pipeline Status */}
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Activity size={16} className="text-blue-500" />
                                        حالة العميل (Pipeline Status)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 mb-1">المرحلة الحالية</label>
                                            <select name="stage" value={formData.stage} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-indigo-600 shadow-sm">
                                                {Object.entries(PipelineStageLabels).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 mb-1">مؤشر التوافق (Fit Score)</label>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-10 bg-white rounded-xl border border-slate-200 px-4 flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${Number(formData.fitScore) > 80 ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                                                    <span className="font-black text-slate-700">{formData.fitScore}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 mb-1">حالة التحقق (ICP)</label>
                                            <div className={`px-4 py-2.5 rounded-xl border font-bold flex items-center gap-2 ${formData.icpStatus === 'verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                {formData.icpStatus === 'verified' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                                {formData.icpStatus === 'verified' ? 'Matched Verified' : 'Pending Verification'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: DEEP INTELLIGENCE */}
                        {activeTab === 'intelligence' && (
                            <div className="space-y-6 animate-fadeIn">
                                {/* Company Snapshot */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                                        <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                                            <Building2 size={16} className="text-indigo-500" />
                                            معلومات الشركة
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">اسم الشركة (الرسمي)</label>
                                                <input type="text" name="company_official_name" value={formData.company_official_name || formData.company_name} readOnly className="w-full bg-white border-0 rounded-lg px-3 py-2 font-bold text-slate-700 shadow-sm" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">الموقع الرسمي</label>
                                                    <div className="flex items-center gap-2">
                                                        <Globe size={14} className="text-slate-400" />
                                                        <input type="text" value={formData.website || 'N/A'} readOnly className="flex-1 bg-transparent border-0 p-0 text-sm text-blue-600 font-medium" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">التصنيع</label>
                                                    <span className="text-sm font-bold text-slate-700">{formData.manufacture || 'Unknown'}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">المقر الرئيسي</label>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-slate-400" />
                                                    <span className="text-sm font-medium text-slate-600">{formData.company_location || formData.city || 'الرياض، المملكة العربية السعودية'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                                        <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                                            <BarChart3 size={16} className="text-emerald-500" />
                                            المؤشرات المالية والحجم
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">الإيرادات السنوية</div>
                                                <div className="text-lg font-black text-emerald-600 font-mono">{formData.annual_revenue || 'N/A'}</div>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">عدد الموظفين</div>
                                                <div className="text-lg font-black text-indigo-600 font-mono">{formData.employee_count || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                                        <div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">تصنيف الصناعة (Taxonomy)</div>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-1 rounded bg-slate-200 text-slate-600 text-xs font-bold">{formData.industry_2 || 'Construction'}</span>
                                                <span className="text-slate-300">›</span>
                                                <span className="px-2 py-1 rounded bg-slate-200 text-slate-600 text-xs font-bold">{formData.subcategory || 'General'}</span>
                                                {formData.sub_subcategory && (
                                                    <>
                                                        <span className="text-slate-300">›</span>
                                                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-xs font-bold">{formData.sub_subcategory}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            <div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Industry Tier</div>
                                                <div className="text-sm font-bold text-slate-800">{formData.industry_tier || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">ICP Tier</div>
                                                <div className="text-sm font-bold text-blue-600">{formData.final_icp_tier || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2">وصف النشاط التجاري</label>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm leading-relaxed text-slate-600">
                                        {formData.company_description || "No description available."}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: AI STRATEGY */}
                        {activeTab === 'strategy' && (
                            <div className="space-y-6 animate-fadeIn">
                                {/* Alert Banner */}
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100 flex items-start gap-4">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <Sparkles className="text-purple-600" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-purple-900 text-sm">تحليل الذكاء الاصطناعي</h4>
                                        <p className="text-xs text-purple-700 mt-1">تم توليد هذه الرؤى بناءً على تحليل نشاط العميل على LinkedIn وأخبار الشركة الأخيرة.</p>
                                    </div>
                                </div>

                                {/* Who is he? */}
                                <div>
                                    <h3 className="text-sm font-black text-slate-800 mb-3">من هو العميل المحتمل؟</h3>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                            {formData.arabic_summary || formData.prospect_about || "لا يتوفر ملخص عربي حالياً."}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${formData.linkedin_sales_navigator?.includes('Active') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                LinkedIn Activity: {formData.linkedin_sales_navigator || 'Unknown'}
                                            </span>
                                            {formData.premium === 'yes' && (
                                                <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700">
                                                    Premium User
                                                </span>
                                            )}
                                            {formData.open_profile === 'yes' && (
                                                <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                                                    Open Profile
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">B2B Status</label>
                                            <div className="font-bold text-slate-800">{formData.b2b_status || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Title Description</label>
                                            <div className="text-xs text-slate-600">{formData.title_description || '-'}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">B2B Summary</label>
                                            <div className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-100">{formData.b2b_summary || 'No B2B summary available.'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Icebreakers */}
                                <div>
                                    <h3 className="text-sm font-black text-slate-800 mb-3">مفتتح المحادثة المقترح (Icebreaker)</h3>
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-1 h-full bg-blue-500" />
                                        <blockquote className="text-sm font-medium text-blue-900 italic relative z-10">
                                            "{formData.initial_icebreaker || "Hello, I noticed we are both in the construction industry..."}"
                                        </blockquote>
                                        <div className="mt-3 flex justify-end">
                                            <button
                                                onClick={() => { navigator.clipboard.writeText(formData.initial_icebreaker || "") }}
                                                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Copy size={12} />
                                                نسخ النص
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: CAMPAIGNS (Old Scripts) */}
                        {activeTab === 'scripts' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <div>
                                        <h3 className="font-bold text-blue-900">منشئ الحملات الذكي (AI)</h3>
                                        <p className="text-sm text-blue-700 mt-1">قم بإنشاء سلسلة رسائل بريدية مخصصة بناءً على بيانات العميل وتفاصيل الشركة.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleGenerateScripts}
                                        disabled={generatingScripts}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-50 transition-all"
                                    >
                                        {generatingScripts ? <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                                            جاري الكتابة...
                                        </> : <>
                                            <Sparkles size={16} />
                                            كتابة الحملة
                                        </>}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">رسالة ترحيبية</label>
                                        <textarea name="welcome_message" value={formData.welcome_message} onChange={handleChange} disabled={isViewMode} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 font-mono text-sm" placeholder="سيتم إنشاء الرسالة هنا..." />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">متابعة 1 (تذكير)</label>
                                            <textarea name="follow_up_1" value={formData.follow_up_1} onChange={handleChange} disabled={isViewMode} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">متابعة 2 (قيمة مضافة)</label>
                                            <textarea name="follow_up_2" value={formData.follow_up_2} onChange={handleChange} disabled={isViewMode} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">متابعة 3 (حجز موعد)</label>
                                            <textarea name="follow_up_3" value={formData.follow_up_3} onChange={handleChange} disabled={isViewMode} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">متابعة 4 (الأخيرة)</label>
                                            <textarea name="follow_up_4" value={formData.follow_up_4} onChange={handleChange} disabled={isViewMode} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-200">
                                        <h4 className="font-bold text-slate-800 mb-3">تفاصيل التسلسل (Sequence)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 mb-1">Subject Line 1</label>
                                                <input type="text" value={formData.subject_f1} readOnly className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 mb-1">Subject Line 2</label>
                                                <input type="text" value={formData.subject_f2} readOnly className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-slate-400 mb-1">3rd Scene (Video/Asset)</label>
                                                <input type="text" value={formData['3rd_scene']} readOnly className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-mono text-indigo-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 5: SYSTEM DATA */}
                        {activeTab === 'system' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl font-mono text-sm shadow-inner">
                                    <h3 className="text-white font-bold mb-6 flex items-center gap-2 border-b border-slate-700 pb-2">
                                        <Server size={18} />
                                        SYSTEM METADATA
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">INTERNAL ID (UUID)</label>
                                            <div className="text-white">{formData.id}</div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">CREATED AT</label>
                                            <div className="text-white">{formData.created_at || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-emerald-500 mb-1">RECORD ID (GHL)</label>
                                            <div className="text-white font-bold">{formData.record_id || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-blue-500 mb-1">PROFILE UNIQUE ID</label>
                                            <div className="text-white font-bold">{formData.profile_unique_id || 'N/A'}</div>
                                        </div>
                                    </div>

                                    <div className="mt-8 border-t border-slate-700 pt-6">
                                        <div className="mb-4">
                                            <label className="block text-xs text-slate-500 mb-2">LINKEDIN MESSAGES LOG</label>
                                            <div className="bg-black/50 p-4 rounded-lg border border-slate-700 h-24 overflow-y-auto">
                                                {formData.li_messages || "// No message logs available"}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-2">CALL RECORDINGS</label>
                                            <div className="bg-black/50 p-4 rounded-lg border border-slate-700 flex items-center gap-2 text-slate-400">
                                                <Phone size={14} />
                                                {formData.call_recordings ? (
                                                    <a href={formData.call_recordings} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                                                        {formData.call_recordings}
                                                    </a>
                                                ) : "No recordings found"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex items-start gap-3">
                                    <Database className="text-yellow-600 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-bold text-yellow-900 text-sm">Raw Data Access</h4>
                                        <p className="text-xs text-yellow-700 mt-1">
                                            This view displays raw system fields used for synchronization and debugging.
                                            Modifying these values manually may break integrations.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-white transition-colors">
                        إغلاق
                    </button>
                    {!isViewMode && (
                        <button type="submit" form="leadForm" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                            حفظ البيانات
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadModal;
