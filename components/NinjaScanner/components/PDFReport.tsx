
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
                <div className="text-center border-b pb-8 mb-8 border-slate-200">
                    <h1 className="text-4xl font-black text-emerald-600 mb-2">تقرير تشخيص نينجا (Ninja Scanner)</h1>
                    <h2 className="text-2xl font-bold text-slate-700">{data.companyName || 'مقدمة لشركة'}</h2>
                    <p className="text-slate-500 mt-2">{new Date().toLocaleDateString('ar-SA')}</p>
                </div>

                <div className="grid grid-cols-2 gap-10 mb-10">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                        <div className="text-sm uppercase font-bold text-slate-500 mb-2">درجة النينجا النهائية</div>
                        <div className="text-6xl font-black text-emerald-600">{results.scores.overallScore}</div>
                        <div className="text-xl font-bold text-slate-700 mt-2">{results.scores.tier}</div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4 border-b pb-2">ملخص التشخيص</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between"><span>الهدف المالي:</span> <strong>{fmtCurrency(data.monthlyTarget)}</strong></li>
                            <li className="flex justify-between"><span>المتوقع:</span> <strong>{fmtCurrency(results.kpis.projectedRevenue)}</strong></li>
                            <li className="flex justify-between"><span>فجوة الإيرادات:</span> <strong className="text-rose-500">{fmtCurrency(results.kpis.revenueGap)}</strong></li>
                            <li className="flex justify-between"><span>قيمة الـ Pipeline:</span> <strong>{fmtCurrency(data.pipelineValue)}</strong></li>
                        </ul>
                    </div>
                </div>

                <div className="mb-10">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2">تحليل الأداء (Score Breakdown)</h3>
                    <div className="grid grid-cols-5 gap-4 text-center">
                        <div>
                            <div className="text-sm font-bold">ICP</div>
                            <div className="text-2xl font-bold text-emerald-600">{results.scores.icpScore}%</div>
                        </div>
                        <div>
                            <div className="text-sm font-bold">CRM</div>
                            <div className="text-2xl font-bold text-cyan-600">{results.scores.crmScore}%</div>
                        </div>
                        <div>
                            <div className="text-sm font-bold">Outbound</div>
                            <div className="text-2xl font-bold text-amber-600">{results.scores.outboundScore}%</div>
                        </div>
                        <div>
                            <div className="text-sm font-bold">Team</div>
                            <div className="text-2xl font-bold text-rose-600">{results.scores.teamScore}%</div>
                        </div>
                        <div>
                            <div className="text-sm font-bold">Mindset</div>
                            <div className="text-2xl font-bold text-violet-600">{results.scores.mindsetScore}%</div>
                        </div>
                    </div>
                </div>

                <div className="mb-10">
                    <h3 className="text-xl font-bold mb-6 border-b pb-2">التوصيات الأساسية</h3>
                    <div className="space-y-6">
                        {results.recommendations.slice(0, 4).map((rec: any, i: number) => (
                            <div key={i} className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50">
                                <div className="text-3xl">{rec.icon}</div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">{rec.title}</h4>
                                    <p className="text-sm text-slate-600 mb-2"><strong>المشكلة:</strong> {rec.problem}</p>
                                    <p className="text-sm text-emerald-700"><strong>الحل المقترح:</strong> {rec.solution}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-20 text-center text-xs text-slate-400 border-t pt-8">
                    تم الإنشاء بواسطة Ninja Scanner Pro • جميع الحقوق محفوظة • سري للغاية
                </div>
            </div>
        </div>
    );
};
