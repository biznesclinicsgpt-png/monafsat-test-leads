import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { ProviderProfile, ServiceLine, ClientReference } from '../types';

const ProfilePage = () => {
    const { user, providerProfile, updateProviderProfile } = useData();
    const [activeTab, setActiveTab] = useState<'company' | 'strategy' | 'services' | 'clients'>('company');
    const [saving, setSaving] = useState(false);

    // Initial state based on providerProfile
    const [formData, setFormData] = useState<Partial<ProviderProfile>>({
        company_name: '',
        tagline: '',
        description: '',
        company_size: '1-10',
        contact_email: '',
        contact_phone: '',
        website: '',
        linkedin_url: '',
        headquarters_city: '',
        headquarters_country: 'Saudi Arabia',

        // Strategy
        value_proposition: '',
        target_audience: '',
        unique_selling_points: [], // Will handle as string in UI

        service_lines: [],
        clients: []
    });

    const [uspString, setUspString] = useState('');

    useEffect(() => {
        if (providerProfile) {
            setFormData(providerProfile);
            if (providerProfile.unique_selling_points) {
                setUspString(providerProfile.unique_selling_points.join('\n'));
            }
        } else if (user) {
            setFormData(prev => ({
                ...prev,
                company_name: user?.name || '',
                contact_email: user?.email || '',
                contact_phone: user?.phone || ''
            }));
        }
    }, [providerProfile, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUspChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUspString(e.target.value);
        setFormData(prev => ({
            ...prev,
            unique_selling_points: e.target.value.split('\n').filter(s => s.trim() !== '')
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProviderProfile(formData);
            alert('تم حفظ الملف الشخصي بنجاح! 💾');
        } catch (error) {
            alert('فشل الحفظ. يرجى المحاولة مرة أخرى.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">الملف الشخصي (Provider Profile)</h1>
                    <p className="text-slate-500 mt-1">قم بإدارة معلومات شركتك وكيف تظهر للمشترين والمنافسين.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? 'جاري الحفظ...' : 'حفظ التغييرات 💾'}
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto">
                <button onClick={() => setActiveTab('company')} className={`pb-4 px-2 font-bold whitespace-nowrap transition-all relative ${activeTab === 'company' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    معلومات الشركة
                    {activeTab === 'company' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
                </button>
                <button onClick={() => setActiveTab('strategy')} className={`pb-4 px-2 font-bold whitespace-nowrap transition-all relative ${activeTab === 'strategy' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    الاستراتيجية (Strategy)
                    {activeTab === 'strategy' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
                </button>
                <button onClick={() => setActiveTab('services')} className={`pb-4 px-2 font-bold whitespace-nowrap transition-all relative ${activeTab === 'services' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    الخدمات والقطاعات
                    {activeTab === 'services' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
                </button>
                <button onClick={() => setActiveTab('clients')} className={`pb-4 px-2 font-bold whitespace-nowrap transition-all relative ${activeTab === 'clients' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    دراسات الحالة (Case Studies)
                    {activeTab === 'clients' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[400px]">
                {activeTab === 'company' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">الهوية التجارية</h3>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">اسم الشركة (Company Name)</label>
                                <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">شعار نصي (Tagline)</label>
                                <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="مثال: نبتكر الحلول الرقمية..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">وصف الشركة (Description)</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">التواصل والموقع</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">حجم الشركة</label>
                                    <select name="company_size" value={formData.company_size} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500">
                                        <option value="1-10">1-10 موظفين</option>
                                        <option value="11-50">11-50 موظف</option>
                                        <option value="51-200">51-200 موظف</option>
                                        <option value="200+">+200 موظف</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">المدينة (HQ)</label>
                                    <input type="text" name="headquarters_city" value={formData.headquarters_city} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">الموقع الإلكتروني</label>
                                <input type="text" name="website" value={formData.website} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-left" dir="ltr" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'strategy' && (
                    <div className="space-y-6 animate-fadeIn max-w-3xl">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                            <h3 className="font-bold text-blue-900">🧠 عقل المحرك (The Engine Brain)</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                هذه المعلومات ستستخدم لتدريب الذكاء الاصطناعي عند كتابة رسائل البريد الإلكتروني وعند البحث عن عملاء محتملين.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">القيمة المقترحة (Value Proposition)</label>
                            <p className="text-xs text-slate-500 mb-2">جملة واحدة قوية تشرح لماذا يجب على العميل التعامل معك.</p>
                            <textarea
                                name="value_proposition"
                                value={formData.value_proposition}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                                placeholder="مثال: نساعد الشركات العقارية على زيادة المبيعات بنسبة 30% من خلال التسويق الرقمي المؤتمت."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">الجمهور المستهدف (Target Audience)</label>
                            <textarea
                                name="target_audience"
                                value={formData.target_audience}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                                placeholder="مثال: مدراء التسويق في شركات التجزئة الكبرى في الرياض وجدة."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">نقاط التميز (USPs)</label>
                            <p className="text-xs text-slate-500 mb-2">اكتب كل نقطة في سطر جديد.</p>
                            <textarea
                                value={uspString}
                                onChange={handleUspChange}
                                rows={5}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                                placeholder="- خبرة 10 سنوات
- فريق معتمد من Google
- دعم فني 24/7"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'services' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <p className="text-slate-500">🚧 سيتم إضافة أداة تخصيص الخدمات والقطاعات قريباً.</p>
                            <p className="text-sm text-slate-400 mt-2">حالياً يعتمد النظام على الوصف العام للشركة.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'clients' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-emerald-900">دراسات الحالة (Case Studies)</h3>
                                <p className="text-sm text-emerald-700 mt-1">
                                    سيتم استخدام هذه القصص لإثبات كفاءتك للعملاء المحتملين في الرسائل المتابعة.
                                </p>
                            </div>
                            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700">
                                + إضافة دراسة حالة
                            </button>
                        </div>

                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <p className="text-slate-500">لا توجد دراسات حالة مضافة حتى الآن.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
