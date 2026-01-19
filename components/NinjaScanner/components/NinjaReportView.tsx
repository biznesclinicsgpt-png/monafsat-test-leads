import React, { useState, useMemo, useRef } from 'react';
import {
    BarChart3, FileText, Lightbulb, Download, Trophy,
    Flame, Zap, Target, CheckCircle, AlertTriangle
} from 'lucide-react';
import { NinjaFormData } from '../types';
import { calculateResults } from '../utils';

// Define TS for html2pdf
declare global {
    interface Window {
        html2pdf: () => any;
    }
}

interface NinjaReportViewProps {
    data: NinjaFormData;
}

export const NinjaReportView: React.FC<NinjaReportViewProps> = ({ data }) => {
    const [resultTab, setResultTab] = useState<'kpis' | 'scores' | 'recs' | 'pdf'>('scores');
    const results = useMemo(() => calculateResults(data), [data]);
    const pdfRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        let html2pdf = (window as any).html2pdf;
        if (!html2pdf) {
            try {
                const module = await import('html2pdf.js');
                html2pdf = module.default;
            } catch (e) { }
        }
        if (!pdfRef.current || !html2pdf) {
            alert('PDF Library Loading...');
            setIsGenerating(false);
            return;
        }
        const element = pdfRef.current;
        const companyName = data.companyName || 'Company';
        const today = new Date().toISOString().split('T')[0];
        const filename = `Ninja-Report-${companyName.replace(/\s+/g, '-')}-${today}.pdf`;
        const opt = {
            margin: 10,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        html2pdf().set(opt).from(element).save().then(() => setIsGenerating(false)).catch(() => setIsGenerating(false));
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 50) return 'text-amber-400';
        return 'text-rose-400';
    };

    const ResultTabBtn = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => setResultTab(id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border ${resultTab === id ? 'bg-blue-600 text-white border-blue-500 shadow-xl shadow-blue-500/20 scale-105' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 hover:text-slate-700'}`}
        >
            <Icon size={18} /> {label}
        </button>
    );

    return (
        <div className="space-y-8 animate-fadeIn text-right" dir="rtl">
            <div className="flex justify-center flex-wrap gap-4 mb-8">
                <ResultTabBtn id="scores" label="النتيجة والتحليل" icon={Trophy} />
                <ResultTabBtn id="kpis" label="فجوات النمو" icon={BarChart3} />
                <ResultTabBtn id="recs" label="خارطة الطريق (التوصيات)" icon={Lightbulb} />
                {/* <ResultTabBtn id="pdf" label="تحميل التقرير (PDF)" icon={Download} /> */}
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-6 md:p-10 border border-slate-800 shadow-2xl relative overflow-hidden min-h-[600px] text-slate-200">

                {resultTab === 'scores' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
                            {/* Deep Analysis Grid */}
                            {[
                                { label: "الأصول (Assets)", sub: "الجاهزية الرقمية", score: results.scores.teamScore, icon: FileText, color: "text-blue-400" },
                                { label: "النشاط (Volume)", sub: "وتيرة الوصول", score: results.scores.outboundScore, icon: Flame, color: "text-orange-400" },
                                { label: "التقنية (Tech)", sub: "أدوات الذكاء", score: results.scores.crmScore, icon: Zap, color: "text-purple-400" },
                                { label: "الاستراتيجية (Fit)", sub: "دقة الاستهداف", score: results.scores.icpScore, icon: Target, color: "text-rose-400" }
                            ].map((stat, idx) => (
                                <div key={idx} className="group bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors flex items-center justify-between relative overflow-hidden">
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                                            <stat.icon size={24} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-200 text-lg">{stat.label}</div>
                                            <div className="text-slate-500 text-xs font-mono">{stat.sub}</div>
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <div className={`text-3xl font-black font-mono ${getScoreColor(stat.score)}`}>
                                            {Math.round(stat.score)}%
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700 w-full" dir="rtl">
                                        <div className={`h-full ${stat.score >= 80 ? 'bg-emerald-500' : stat.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${stat.score}%` }}></div>
                                    </div>
                                </div>
                            ))}

                            {/* Benchmark Comparison */}
                            <div className="md:col-span-2 bg-slate-800/30 p-6 rounded-2xl border border-slate-700 mt-4">
                                <h4 className="flex items-center gap-2 text-white font-bold mb-6">
                                    <Target className="text-rose-500" size={18} />
                                    مقارنة مع المعيار العالمي (The 100 Club)
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { label: "المكالمات اليومية", val: data.dailyCalls, target: 100 },
                                        { label: "رسائل الواتساب", val: data.dailyWhatsapp, target: 100 },
                                        { label: "تواصل LinkedIn", val: data.dailyLinkedin, target: 100 },
                                    ].map((metric, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1 text-slate-400">
                                                <span>{metric.label}</span>
                                                <span className="font-mono">{metric.val} / {metric.target}</span>
                                            </div>
                                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${metric.val >= metric.target ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                    style={{ width: `${Math.min((metric.val / metric.target) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Overall Score Circle */}
                        <div className="lg:col-span-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 flex flex-col items-center justify-center text-center shadow-xl relative">
                            <div className="w-48 h-48 rounded-full border-8 border-slate-700 flex items-center justify-center mb-6 relative">
                                <div className="absolute inset-0 rounded-full border-t-8 border-emerald-500 animate-spin-slow" style={{ animationDuration: '3s' }}></div>
                                <div className="text-6xl font-black text-white tracking-tighter">
                                    {results.scores.overallScore}
                                    <span className="text-2xl text-slate-500 align-top">%</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">{results.scores.tierLabel}</h3>
                            <p className="text-slate-400 text-sm mb-6">مستوى الجاهزية الرقمية للمنافسة في السوق السعودي.</p>

                            <div className="w-full bg-slate-700/50 rounded-xl p-4 text-sm mt-auto border border-slate-600">
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-400">اللقب المستحق:</span>
                                    <span className="text-emerald-400 font-bold">{results.scores.tier}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">نقاط المكافأة:</span>
                                    <span className="text-yellow-400 font-bold font-mono">{results.scores.credits} Credits</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {resultTab === 'kpis' && (
                    <div className="space-y-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                <h4 className="text-slate-400 text-sm font-bold uppercase mb-4">الفجوة المالية (Revenue Gap)</h4>
                                <div className="text-4xl font-black text-rose-500 mb-2 font-mono" dir="ltr">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(results.kpis.revenueGap)}
                                </div>
                                <p className="text-slate-500 text-xs">قيمة العجز الشهري عن الهدف المحدد.</p>
                            </div>
                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                <h4 className="text-slate-400 text-sm font-bold uppercase mb-4">قيمة الـ Pipeline المتوقعة</h4>
                                <div className="text-4xl font-black text-emerald-500 mb-2 font-mono" dir="ltr">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(results.kpis.projectedRevenue)}
                                </div>
                                <p className="text-slate-500 text-xs">بناءً على الصفقات المغلقة شهرياً.</p>
                            </div>
                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                <h4 className="text-slate-400 text-sm font-bold uppercase mb-4">سرعة المبيعات (Velocity)</h4>
                                <div className="text-4xl font-black text-blue-500 mb-2 font-mono" dir="ltr">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(results.kpis.salesVelocity)}
                                </div>
                                <p className="text-slate-500 text-xs">قيمة الإيرادات الداخلة يومياً.</p>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                                <BarChart3 className="text-blue-500" />
                                تحليل قمع المبيعات (Funnel Health)
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { label: "Leads (عملاء محتملين)", val: data.leadsPerMonth, bench: 1000, color: "bg-blue-500" },
                                    { label: "Meetings (اجتماعات)", val: data.meetingsPerMonth, bench: 20, color: "bg-yellow-500" },
                                    { label: "Proposals (عروض أسعار)", val: data.proposalsPerMonth, bench: 15, color: "bg-orange-500" },
                                    { label: "Wins (إغلاق صفقات)", val: data.closedWonPerMonth, bench: 2, color: "bg-emerald-500" }
                                ].map((step, i) => (
                                    <div key={i} className="relative">
                                        <div className="flex justify-between text-sm mb-2 font-bold z-10 relative">
                                            <span>{step.label}</span>
                                            <span className="font-mono">{step.val} <span className="text-slate-600 font-normal text-xs">/ {step.bench} Ref</span></span>
                                        </div>
                                        <div className="h-4 bg-slate-700 rounded-lg overflow-hidden relative">
                                            <div
                                                className={`h-full rounded-lg ${step.color} bg-opacity-80`}
                                                style={{ width: `${Math.min((step.val / step.bench) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {resultTab === 'recs' && (
                    <div className="space-y-6 relative z-10">
                        {results.recommendations.map((rec, i) => (
                            <div key={i} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex gap-6 hover:border-slate-600 transition-colors">
                                <div className="text-4xl bg-slate-900 w-16 h-16 rounded-xl flex items-center justify-center shrink-0">
                                    {rec.icon}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                                        {rec.title}
                                        {rec.type === 'critical' && <span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-1 rounded-lg border border-rose-500/20">Critical</span>}
                                        {rec.type === 'warning' && <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-lg border border-amber-500/20">Warning</span>}
                                    </h4>
                                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">{rec.problem} <span className="text-rose-400">({rec.impact})</span></p>

                                    <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                                        <strong className="text-emerald-400 block mb-1 text-xs uppercase tracking-wider">💡 الحل المقترح:</strong>
                                        <p className="text-slate-300 text-sm">{rec.solution}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
