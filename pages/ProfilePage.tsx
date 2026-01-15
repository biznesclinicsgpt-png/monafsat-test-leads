import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import ICPStrategyModal from '../components/Dashboard/ICPStrategyModal';

const ProfilePage = () => {
    const { userProfile, updateUserProfile, providerICP } = useData();
    const [showICPModal, setShowICPModal] = useState(false);

    const [formData, setFormData] = useState({
        name: userProfile.name,
        company: userProfile.company
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        updateUserProfile(formData);
        alert('تم حفظ البيانات بنجاح');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8" dir="rtl">
            <h1 className="text-2xl font-bold text-slate-800">الملف الشخصي وإعدادات الشركة</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Basic Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">المعلومات الأساسية</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">اسم المسؤول</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">اسم الشركة</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="pt-4 text-left">
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    حفظ التغييرات
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ICP Status */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">استراتيجية العميل المثالي (ICP)</h2>

                        <div className="flex items-center gap-2 mb-4">
                            <div className={`w-3 h-3 rounded-full ${providerICP.isSet ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm font-bold text-slate-600">
                                {providerICP.isSet ? 'الاستراتيجية نشطة' : 'لم يتم تحديد الاستراتيجية'}
                            </span>
                        </div>

                        <p className="text-sm text-slate-500 mb-6">
                            تساعد استراتيجية العميل المثالي المحرك في العثور على الليدات الأكثر ملاءمة لأعمالك بشكل تلقائي.
                        </p>

                        <button
                            onClick={() => setShowICPModal(true)}
                            className="w-full py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            {providerICP.isSet ? 'تحديث الاستراتيجية' : 'إعداد الاستراتيجية'}
                        </button>
                    </div>
                </div>
            </div>

            {showICPModal && <ICPStrategyModal onClose={() => setShowICPModal(false)} />}
        </div>
    );
};

export default ProfilePage;
