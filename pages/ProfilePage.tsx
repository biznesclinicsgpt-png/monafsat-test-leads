import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { ProviderProfile, ServiceLine, ClientReference } from '../types';
import ProviderWizard from '../components/Wizard/ProviderWizard';

const ProfilePage = () => {
    const { user, providerProfile, updateProviderProfile } = useData();
    const [activeTab, setActiveTab] = useState<'company' | 'strategy' | 'services' | 'clients'>('company');
    const [saving, setSaving] = useState(false);
    const [showWizard, setShowWizard] = useState(false);

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
        icp_structured: {
            decision_makers: [],
            pain_points: [],
            business_goals: [],
            company_size_ideal: []
        },

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

        // Check for Guest Diagnosis Data (from /diagnosis)
        const guestData = localStorage.getItem('ninja_guest_data');
        if (guestData) {
            try {
                const parsed = JSON.parse(guestData);
                // console.log("Found guest diagnosis data, applying...", parsed);

                setFormData(prev => ({
                    ...prev,
                    company_name: parsed.companyName || prev.company_name,
                    headquarters_country: parsed.country || prev.headquarters_country,
                    industries: parsed.industry ? [{ id: '99', name: parsed.industry, allocation: 100 }] : prev.industries, // Mock ServiceLine
                    ninja_diagnosis: parsed,
                    // Pre-fill ICP Strategy
                    icp_structured: {
                        ...prev.icp_structured!,
                        decision_makers: parsed.icpTitles?.length ? parsed.icpTitles : prev.icp_structured?.decision_makers,
                        company_size_ideal: parsed.icpCompanySize?.length ? parsed.icpCompanySize : prev.icp_structured?.company_size_ideal,
                    }
                }));

                // Auto-open wizard if URL param exists (it usually does from the redirect)
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('wizard') === 'true') {
                    setShowWizard(true);
                }

                // Clear after applying? Maybe safer to keep until save.
                // localStorage.removeItem('ninja_guest_data'); 
            } catch (e) {
                console.error("Failed to parse guest data", e);
            }
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
                        {/* ... (Keep existing company fields) ... */}
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
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-blue-900">🧠 عقل المحرك (The Engine Brain)</h3>
                                <p className="text-sm text-blue-700 mt-1 mb-2 max-w-xl">
                                    هذه المعلومات تبني "ملف العميل المثالي" (ICP) وتستخدم لتوجيه الذكاء الاصطناعي في البحث وكتابة الرسائل.
                                </p>
                            </div>
                            <button
                                onClick={async () => {
                                    if (!formData.company_name && !formData.description) return alert("يرجى تعبئة اسم الشركة ووصفها في تبويب 'معلومات الشركة' أولاً.");
                                    const btn = document.getElementById('ai-btn');
                                    if (btn) btn.innerText = "جاري التحليل... 🧠";

                                    try {
                                        const res = await fetch('/api/ai/strategy', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                company_name: formData.company_name,
                                                description: formData.description,
                                                website: formData.website
                                            })
                                        });
                                        const data = await res.json();
                                        if (data.value_proposition) {
                                            const newIcp = data.icp_structured || {
                                                decision_makers: [],
                                                pain_points: [],
                                                business_goals: [],
                                                company_size_ideal: []
                                            };

                                            setFormData(prev => ({
                                                ...prev,
                                                value_proposition: data.value_proposition,
                                                target_audience: data.target_audience,
                                                unique_selling_points: data.unique_selling_points,
                                                icp_structured: newIcp
                                            }));
                                            setUspString(data.unique_selling_points.join('\n'));
                                            alert("تم بناء استراتيجية العميل المثالي بنجاح! 🚀");
                                        }
                                    } catch (e) {
                                        alert("حدث خطأ أثناء التوليد. تأكد من اتصالك بالإنترنت.");
                                    } finally {
                                        if (btn) btn.innerText = "✨ توليد الاستراتيجية بالذكاء الاصطناعي";
                                    }
                                }}
                                id="ai-btn"
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl shadow-md text-sm font-bold transition-all transform hover:scale-105"
                            >
                                ✨ توليد الاستراتيجية بالذكاء الاصطناعي
                            </button>
                        </div>

                        {/* Value Prop Banner */}
                        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg mb-8">
                            <label className="block text-xs font-bold text-slate-300 uppercase mb-2 tracking-wider">القيمة المقترحة (Value Proposition)</label>
                            <textarea
                                name="value_proposition"
                                value={formData.value_proposition}
                                onChange={handleChange}
                                rows={2}
                                className="w-full bg-transparent border-none text-xl font-bold placeholder-slate-500 focus:ring-0 text-white resize-none"
                                placeholder="مثال: نساعد الشركات العقارية على زيادة المبيعات بنسبة 30%..."
                            />
                        </div>

                        {/* Visual ICP Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Card 1: Decision Makers */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    </div>
                                    <h3 className="font-bold text-slate-800">صناع القرار (Decision Makers)</h3>
                                </div>
                                <div className="space-y-2">
                                    {(formData.icp_structured?.decision_makers?.length ? formData.icp_structured.decision_makers : ['']).map((role, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            value={role}
                                            onChange={(e) => {
                                                const newRoles = [...(formData.icp_structured?.decision_makers || [])];
                                                newRoles[idx] = e.target.value;
                                                setFormData(prev => ({ ...prev, icp_structured: { ...prev.icp_structured!, decision_makers: newRoles } }));
                                            }}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium text-slate-700 focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                                            placeholder="Role title..."
                                        />
                                    ))}
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, icp_structured: { ...prev.icp_structured!, decision_makers: [...(prev.icp_structured?.decision_makers || []), ''] } }))}
                                        className="text-xs text-purple-600 font-bold hover:underline"
                                    >
                                        + إضافة دور
                                    </button>
                                </div>
                            </div>

                            {/* Card 2: Pain Points */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    </div>
                                    <h3 className="font-bold text-slate-800">نقاط الألم (Pain Points)</h3>
                                </div>
                                <div className="space-y-2">
                                    {(formData.icp_structured?.pain_points?.length ? formData.icp_structured.pain_points : ['']).map((pain, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            value={pain}
                                            onChange={(e) => {
                                                const newPain = [...(formData.icp_structured?.pain_points || [])];
                                                newPain[idx] = e.target.value;
                                                setFormData(prev => ({ ...prev, icp_structured: { ...prev.icp_structured!, pain_points: newPain } }));
                                            }}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium text-slate-700 focus:bg-white focus:border-red-300 focus:ring-2 focus:ring-red-100"
                                            placeholder="Pain point..."
                                        />
                                    ))}
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, icp_structured: { ...prev.icp_structured!, pain_points: [...(prev.icp_structured?.pain_points || []), ''] } }))}
                                        className="text-xs text-red-600 font-bold hover:underline"
                                    >
                                        + إضافة مشكلة
                                    </button>
                                </div>
                            </div>

                            {/* Card 3: Business Goals */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                    </div>
                                    <h3 className="font-bold text-slate-800">أهداف العمل (Business Goals)</h3>
                                </div>
                                <div className="space-y-2">
                                    {(formData.icp_structured?.business_goals?.length ? formData.icp_structured.business_goals : ['']).map((goal, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            value={goal}
                                            onChange={(e) => {
                                                const newGoals = [...(formData.icp_structured?.business_goals || [])];
                                                newGoals[idx] = e.target.value;
                                                setFormData(prev => ({ ...prev, icp_structured: { ...prev.icp_structured!, business_goals: newGoals } }));
                                            }}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium text-slate-700 focus:bg-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                                            placeholder="Goal..."
                                        />
                                    ))}
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, icp_structured: { ...prev.icp_structured!, business_goals: [...(prev.icp_structured?.business_goals || []), ''] } }))}
                                        className="text-xs text-emerald-600 font-bold hover:underline"
                                    >
                                        + إضافة هدف
                                    </button>
                                </div>
                            </div>

                            {/* Card 4: Company Profile */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    </div>
                                    <h3 className="font-bold text-slate-800">بيانات الشركة (Firmographics)</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">حجم الشركة المثالي</label>
                                        <input
                                            type="text"
                                            value={formData.icp_structured?.company_size_ideal?.[0] || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, icp_structured: { ...prev.icp_structured!, company_size_ideal: [e.target.value] } }))}
                                            className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium text-slate-700 focus:bg-white focus:border-blue-300"
                                            placeholder="e.g. 50-200 employees"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">وصف الجمهور (Target Audience)</label>
                                        <textarea
                                            name="target_audience"
                                            value={formData.target_audience}
                                            onChange={handleChange}
                                            rows={2}
                                            className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium text-slate-700 focus:bg-white focus:border-blue-300 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* USPs Section (Full Width) */}
                        <div className="mt-8">
                            <label className="block text-sm font-bold text-slate-700 mb-2">نقاط التميز (Unique Selling Points)</label>
                            <textarea
                                value={uspString}
                                onChange={handleUspChange}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="- نقطة تميز 1..."
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'services' && (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Services Selection */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">📌 خدماتنا (Our Services)</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {['Digital Marketing', 'Software Development', 'SEO', 'Content Creation', 'Consulting', 'Legal Services', 'Accounting', 'HR Services', 'Event Management', 'Cybersecurity'].map(service => (
                                    <label key={service} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.service_lines?.some((s: any) => s.name === service) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}>
                                        <input
                                            type="checkbox"
                                            checked={formData.service_lines?.some((s: any) => s.name === service)}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setFormData(prev => {
                                                    const current = prev.service_lines || [];
                                                    if (checked) {
                                                        return { ...prev, service_lines: [...current, { id: String(Date.now()), name: service, allocation: 100 }] };
                                                    } else {
                                                        return { ...prev, service_lines: current.filter((s: any) => s.name !== service) };
                                                    }
                                                });
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <span className="font-medium text-sm">{service}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Industries Selection */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">🏭 القطاعات المستهدفة (Target Industries)</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['E-commerce', 'Fintech', 'Real Estate', 'Healthcare', 'Education', 'Construction', 'Government', 'Retail', 'Logistics', 'Energy'].map(ind => (
                                    <label key={ind} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.industries?.some((i: any) => (i.name || i) === ind) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-slate-300'}`}>
                                        <input
                                            type="checkbox"
                                            checked={formData.industries?.some((i: any) => (i.name || i) === ind)}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setFormData(prev => {
                                                    const current = prev.industries || [];
                                                    // Handle both string and object structure (legacy vs new)
                                                    const isString = current.length > 0 && typeof current[0] === 'string';

                                                    if (checked) {
                                                        return { ...prev, industries: [...current, { id: String(Date.now()), name: ind, allocation: 100 }] };
                                                    } else {
                                                        return { ...prev, industries: current.filter((i: any) => (i.name || i) !== ind) };
                                                    }
                                                });
                                            }}
                                            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                        />
                                        <span className="font-medium text-sm">{ind}</span>
                                    </label>
                                ))}
                            </div>
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
