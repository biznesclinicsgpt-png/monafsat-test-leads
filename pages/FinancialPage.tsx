import React from 'react';

const FinancialPage = () => {
    return (
        <div className="space-y-8" dir="rtl">
            <h1 className="text-2xl font-bold text-slate-800">الحسابات والمالية</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-bold text-slate-500 mb-1">إجمالي الإيرادات (2024)</div>
                    <div className="text-3xl font-black text-slate-800">452,150 ر.س</div>
                    <div className="text-xs text-green-600 font-bold mt-2">↑ 12% عن العام الماضي</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-bold text-slate-500 mb-1">المصاريف التشغيلية</div>
                    <div className="text-3xl font-black text-red-600">128,400 ر.س</div>
                    <div className="text-xs text-red-400 font-bold mt-2">↓ 5% عن العام الماضي</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-bold text-slate-500 mb-1">صافي الربح</div>
                    <div className="text-3xl font-black text-emerald-600">323,750 ر.س</div>
                    <div className="text-xs text-emerald-600 font-bold mt-2">هامش ربح 71%</div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="font-bold text-slate-800">أحدث التعاملات المالية</h2>
                    <button className="text-sm text-blue-600 font-bold hover:underline">عرض الكل</button>
                </div>
                <div className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" /></svg>
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 text-sm">دفعة مشروع: تطوير متجر إلكتروني</div>
                                    <div className="text-xs text-slate-400">من: مجموعة البناء • 15 يناير 2024</div>
                                </div>
                            </div>
                            <div className="font-bold text-slate-800">+ 15,000 ر.س</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FinancialPage;
