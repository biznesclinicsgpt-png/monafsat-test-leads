import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { ProviderProfile, ServiceLine, ClientReference } from '../types';

const ProfilePage = () => {
    const { user, providerProfile, updateProviderProfile } = useData();
    const [activeTab, setActiveTab] = useState<'company' | 'services' | 'clients'>('company');
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
        service_lines: [],
        clients: []
    });

    useEffect(() => {
        if (providerProfile) {
            setFormData(providerProfile);
        } else if (user) {
            // Fallback defaults
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

    // --- Sub-components (simplified for single-file) ---

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
            <div className="flex items-center gap-6 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('company')}
                    className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'company' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    معلومات الشركة
                    {activeTab === 'company' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
                </button>
                <button
                    onClick={() => setActiveTab('services')}
                    className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'services' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    الخدمات والقطاعات
                    {activeTab === 'services' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
                </button>
                <button
                    onClick={() => setActiveTab('clients')}
                    className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'clients' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    سابقة الأعمال (Clients)
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
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">رابط LinkedIn</label>
                                <input type="text" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-left" dir="ltr" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">بريد التواصل</label>
                                <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-left" dir="ltr" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'services' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <p className="text-slate-500">🚧 قسم إدارة الخدمات قيد التطوير...</p>
                            <p className="text-sm text-slate-400 mt-2">سيتمكن المستخدم من تحديد نسب الخدمات والقطاعات المستهدفة هنا.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'clients' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <p className="text-slate-500">🚧 قسم سابقة الأعمال قيد التطوير...</p>
                            <p className="text-sm text-slate-400 mt-2">سيتمكن المستخدم من إضافة شعارات العملاء ووصف المشاريع السابقة هنا.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
