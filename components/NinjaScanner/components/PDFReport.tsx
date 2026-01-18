
import React from 'react';
import { NinjaFormData } from '../types';
import { fmtCurrency } from '../utils';

interface PDFReportProps {
    data: NinjaFormData;
    results: any;
    reportRef: React.RefObject<HTMLDivElement>;
}

export const PDFReport: React.FC<PDFReportProps> = ({ data, results, reportRef }) => {
    return (
        <div style={{ position: 'absolute', top: -10000, left: -10000 }}>
            <div ref={reportRef} className="p-10 bg-white text-slate-900 w-[210mm] min-h-[297mm]" dir="rtl">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-8 mb-8 border-slate-200">
                    <div className="text-right">
                        <h1 className="text-4xl font-black text-brand-600 mb-2">تقرير نينجا الاستراتيجي 🥷</h1>
                        <h2 className="text-2xl font-bold text-slate-700">{data.companyName || 'مقدمة لشركة'}</h2>
                    </div>
                    <div>
                        <img src="/logo_full.png" alt="BiznesClinics" className="h-16 w-auto object-contain" />
                    </div>
                </div>

                <div className="flex justify-between gap-6 mb-8 text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span>🗓️ التاريخ: {new Date().toLocaleDateString('ar-SA')}</span>
                    <span>🏢 الصناعة: {data.industry}</span>
                    <span>📍 المقر: {data.country}</span>
                </div>

                {/* Score Summary */}
                <div className="grid grid-cols-3 gap-8 mb-10 text-center">
                    <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 col-span-1">
                        <div className="text-xs uppercase font-bold text-brand-800 mb-2">مؤشر الجاهزية</div>
                        <div className="text-6xl font-black text-brand-600 mb-2">{results.scores.overallScore}</div>
                        <div className="text-sm font-bold text-brand-700 bg-brand-200/50 inline-block px-3 py-1 rounded-full">
                            {results.scores.tierLabel}
                        </div>
                    </div>
                    <div className="col-span-2 text-right">
                        <h3 className="font-bold text-lg mb-4 text-slate-800">تحليل الفجوات المالية:</h3>
                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                            <div className="flex justify-between border-b border-dashed pb-1">
                                <span className="text-slate-500">الهدف الشهري:</span>
                                <strong>{fmtCurrency(data.monthlyTarget)}</strong>
                            </div>
                            <div className="flex justify-between border-b border-dashed pb-1 mr-4">
                                <span className="text-slate-500">المتوقع (Forecast):</span>
                                <strong>{fmtCurrency(results.kpis.projectedRevenue)}</strong>
                            </div>
                            <div className="flex justify-between border-b border-dashed pb-1">
                                <span className="text-slate-500">الخسارة الشهرية (Gap):</span>
                                <strong className="text-rose-600">{fmtCurrency(results.kpis.revenueGap)}</strong>
                            </div>
                            <div className="flex justify-between border-b border-dashed pb-1 mr-4">
                                <span className="text-slate-500">قيمة الـ Pipeline:</span>
                                <strong>{fmtCurrency(data.pipelineValue)}</strong>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
                            <strong>تشخيص سريع:</strong> تحتاج إلى {Math.ceil(results.kpis.revenueGap / (data.avgDealSize || 10000))} صفقات إضافية شهرياً لسد الفجوة.
                        </div>
                    </div>
                </div>

                {/* Asset Checklist */}
                <div className="mb-10">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2 flex items-center gap-2">
                        <span>📁</span> فحص الأصول والجاهزية
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'الملف التعريفي (Profile)', val: data.hasCompanyProfile },
                            { label: 'العرض الاستثماري (Pitch Deck)', val: data.hasPitchDeck },
                            { label: 'ملف التسعير (Pricing)', val: data.hasPricingFile },
                            { label: 'الموقع الرسمي (Website)', val: data.hasProfessionalWebsite },
                            { label: 'لينكد إن (Social)', val: data.hasSocialPresence },
                            { label: 'Sales Navigator', val: data.hasSalesNavigator },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="font-bold text-slate-700">{item.label}</span>
                                {item.val ? (
                                    <span className="text-emerald-600 font-bold text-sm">✅ موجود</span>
                                ) : (
                                    <span className="text-rose-500 font-bold text-sm">❌ مفقود</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* The 100 Club Analysis */}
                <div className="mb-10">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2 flex items-center gap-2">
                        <span>🔥</span> تحليل النشاط اليومي (The 100 Club)
                    </h3>
                    <table className="w-full text-sm text-right">
                        <thead className="bg-slate-100 text-slate-600">
                            <tr>
                                <th className="p-3 rounded-r-lg">القناة</th>
                                <th className="p-3">نشاطك الحالي</th>
                                <th className="p-3">المعيار العالمي</th>
                                <th className="p-3 rounded-l-lg">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { n: 'المكالمات (Calls)', v: data.dailyCalls, t: 100 },
                                { n: 'واتساب (WhatsApp)', v: data.dailyWhatsapp, t: 100 },
                                { n: 'لينكد إن (LinkedIn)', v: data.dailyLinkedin, t: 100 },
                                { n: 'الإيميل (Email)', v: data.dailyEmails, t: 100 }
                            ].map((row, i) => (
                                <tr key={i}>
                                    <td className="p-3 font-bold">{row.n}</td>
                                    <td className="p-3">{row.v}</td>
                                    <td className="p-3 text-slate-500">{row.t}</td>
                                    <td className="p-3">
                                        {row.v >= row.t ?
                                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">ممتاز</span> :
                                            <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-bold">ضعيف</span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Recommendations */}
                <div className="mb-10">
                    <h3 className="text-xl font-bold mb-6 border-b pb-2">التوصيات وخطة العمل</h3>
                    <div className="space-y-4">
                        {results.recommendations.map((rec: any, i: number) => (
                            <div key={i} className="flex gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                                <div className="text-2xl mt-1">{rec.icon}</div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1 text-slate-800">{rec.title}</h4>
                                    <p className="text-xs text-slate-500 mb-2">{rec.problem}</p>
                                    <div className="text-sm text-emerald-800 bg-emerald-100/50 p-2 rounded border border-emerald-100">
                                        <strong>💡 الحل المقترح:</strong> {rec.solution}
                                    </div>
                                    <div className="mt-2 text-xs flex gap-2">
                                        <span className="font-bold text-slate-400">أدوات مقترحة:</span>
                                        <span className="text-emerald-600 font-mono">{rec.tools}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto text-center text-xs text-slate-400 border-t pt-8">
                    تم الإنشاء بواسطة نظام نينجا للنمو (Ninja Growth Engine) • سري للغاية ويمنع مشاركته خارج الشركة
                </div>
            </div>
        </div>
    );
};
