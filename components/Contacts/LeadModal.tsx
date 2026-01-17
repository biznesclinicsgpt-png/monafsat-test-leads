import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Contact, LeadSource, PipelineStage, PipelineStageLabels } from '../../types';

interface LeadModalProps {
    mode: 'add' | 'edit' | 'view';
    contact?: Contact;
    onClose: () => void;
    onSave: (contact: Contact) => void;
}

const LeadModal: React.FC<LeadModalProps> = ({ mode, contact, onClose, onSave }) => {
    const { enrichLead } = useData();
    const [enriching, setEnriching] = useState(false);
    const [formData, setFormData] = useState<Partial<Contact>>({
        name: '',
        first_name: '',
        last_name: '',
        company_name: '',
        email: '',
        phone: '',
        title: '',
        stage: PipelineStage.NEW,
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
    });

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
                                        ✨ تحسين (AI)
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
                <div className="p-8 overflow-y-auto">
                    <form id="leadForm" onSubmit={handleSubmit} className="space-y-8 text-right">
                        {/* Section 1: Core Contact */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-blue-600 border-b pb-2">بيانات التواصل الأساسية</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">الاسم الكامل</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500" required dir="ltr" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">الهاتف</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500" dir="ltr" />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Professional Info */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-blue-600 border-b pb-2">المعلومات المهنية</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">الشركة (اسم العمل)</label>
                                    <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">المنصب</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">رابط LinkedIn</label>
                                    <input type="text" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500" dir="ltr" />
                                </div>
                            </div>
                        </section>

                        {/* Section 4: Company Details & Enrichment */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-blue-600 border-b pb-2">تفاصيل الشركة (Enrichment)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">وصف الشركة</label>
                                    <textarea name="company_description" value={formData.company_description} onChange={handleChange} disabled={isViewMode} rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500" placeholder="وصف نشاط الشركة..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">رابط LinkedIn للشركة</label>
                                    <input type="text" name="company_linkedin_url" value={formData.company_linkedin_url} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500" dir="ltr" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">عدد الموظفين</label>
                                    <input type="text" name="employee_count" value={formData.employee_count} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">الإيرادات السنوية</label>
                                    <input type="text" name="annual_revenue" value={formData.annual_revenue} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">المصدر (Source)</label>
                                    <input type="text" name="source" value={formData.source} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </section>

                        {/* Section 5: GHL Custom Fields (Arabic & Strategy) */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-blue-600 border-b pb-2">بيانات خاصة (GHL)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">ملخص باللغة العربية</label>
                                    <textarea name="arabic_summary" value={formData.arabic_summary} onChange={handleChange} disabled={isViewMode} rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">رسالة افتتاحية (Icebreaker)</label>
                                    <textarea name="initial_icebreaker" value={formData.initial_icebreaker} onChange={handleChange} disabled={isViewMode} rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">المجال (بالعربي)</label>
                                    <input type="text" name="industry_ar" value={formData.industry_ar} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">المرحلة في المسار</label>
                                    <select name="stage" value={formData.stage} onChange={handleChange} disabled={isViewMode} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500">
                                        {Object.entries(PipelineStageLabels).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>
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
