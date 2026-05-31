import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TrendingUp, Users, MessageSquare, Calendar, Handshake, DollarSign, Activity, BarChart2, ShieldAlert } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface LiveDashboardPanelProps {
    className?: string;
    highlightedMetric?: string;
}

const toArabicNumerals = (num: number | string): string => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, (w) => arabicDigits[+w]);
};

export const LiveDashboardPanel: React.FC<LiveDashboardPanelProps> = ({ className, highlightedMetric }) => {
    const shouldReduceMotion = useReducedMotion();
    const [activeTab, setActiveTab] = useState<'forecast' | 'channels'>('forecast');

    // Load inputs from localStorage to calculate metrics dynamically
    const [calcValues, setCalcValues] = useState(() => {
        if (typeof window !== 'undefined') {
            const rev = localStorage.getItem('manafeth_target_revenue');
            const deal = localStorage.getItem('manafeth_avg_deal_value');
            const sec = localStorage.getItem('manafeth_sector');
            return {
                targetRevenue: rev ? Number(rev) : 1000000,
                avgDealValue: deal ? Number(deal) : 100000,
                sector: sec || 'مقاولات'
            };
        }
        return {
            targetRevenue: 1000000,
            avgDealValue: 100000,
            sector: 'مقاولات'
        };
    });

    useEffect(() => {
        const handleUpdate = () => {
            const rev = localStorage.getItem('manafeth_target_revenue');
            const deal = localStorage.getItem('manafeth_avg_deal_value');
            const sec = localStorage.getItem('manafeth_sector');
            setCalcValues({
                targetRevenue: rev ? Number(rev) : 1000000,
                avgDealValue: deal ? Number(deal) : 100000,
                sector: sec || 'مقاولات'
            });
        };
        window.addEventListener('manafeth_calculator_update', handleUpdate);
        return () => window.removeEventListener('manafeth_calculator_update', handleUpdate);
    }, []);

    const { targetRevenue, avgDealValue } = calcValues;

    // Realistic scenario calculator equations
    const deals = Math.ceil(targetRevenue / avgDealValue);
    const proposals = Math.ceil(deals / 0.25);
    const meetings = Math.ceil(proposals / 0.75);
    const conversations = Math.ceil(meetings / 0.07);
    const targetOutreach = Math.ceil(conversations / 0.28);

    const formatCurrency = (val: number): string => {
        if (val >= 1000000) {
            const num = (val / 1000000).toFixed(2);
            const formatted = parseFloat(num).toString();
            return `${toArabicNumerals(formatted)} مليون ر.س`;
        } else {
            const formatted = Math.round(val).toLocaleString('en-US');
            return `${toArabicNumerals(formatted)} ر.س`;
        }
    };

    const formatWeeklyChange = (val: number): string => {
        if (val >= 1000000) {
            return `+${toArabicNumerals((val / 1000000).toFixed(1))} مليون أسبوعياً`;
        } else if (val >= 1000) {
            return `+${toArabicNumerals(Math.round(val / 1000))} ألف أسبوعياً`;
        }
        return `+${toArabicNumerals(Math.round(val))} ر.س أسبوعياً`;
    };

    // 6 Metrics dynamically scaled
    const metrics = [
        { 
            id: 'leads', 
            label: "الفرص الساخنة", 
            value: toArabicNumerals(Math.round(proposals * 0.3)), 
            change: `🔥 +${toArabicNumerals(Math.ceil(proposals * 0.07))} اليوم`, 
            color: "text-amber-500", 
            glow: "rgba(245,158,11,0.05)" 
        },
        { 
            id: 'decision_makers', 
            label: "صناع القرار", 
            value: toArabicNumerals(Math.round(targetOutreach * 0.046)), 
            change: `👤 +${toArabicNumerals(Math.ceil(targetOutreach * 0.0087))} اليوم`, 
            color: "text-cyan-400", 
            glow: "rgba(34,211,238,0.05)" 
        },
        { 
            id: 'conversations', 
            label: "محادثات نشطة", 
            value: toArabicNumerals(Math.round(conversations * 0.45)), 
            change: `💬 +${toArabicNumerals(Math.ceil(conversations * 0.074))} اليوم`, 
            color: "text-emerald-400", 
            glow: "rgba(16,185,129,0.05)" 
        },
        { 
            id: 'meetings', 
            label: "اجتماعات قادمة", 
            value: toArabicNumerals(Math.round(meetings * 0.33)), 
            change: `📅 +${toArabicNumerals(Math.ceil(meetings * 0.09))} اليوم`, 
            color: "text-violet-400", 
            glow: "rgba(167,139,250,0.05)" 
        },
        { 
            id: 'negotiations', 
            label: "تحت التفاوض", 
            value: toArabicNumerals(Math.round(deals * 0.7)), 
            change: `🤝 +${toArabicNumerals(Math.ceil(deals * 0.2))} اليوم`, 
            color: "text-blue-400", 
            glow: "rgba(59,130,246,0.05)" 
        },
        { 
            id: 'expected_revenue', 
            label: "إيراد متوقع", 
            value: formatCurrency(targetRevenue * 1.2), 
            change: `📈 ${formatWeeklyChange(targetRevenue * 0.18)}`, 
            color: "text-emerald-400", 
            glow: "rgba(16,185,129,0.08)" 
        }
    ];

    // Revenue Forecast indicators dynamically scaled
    const businessIndicators = [
        { label: "إيراد ربع سنوي متوقع", value: formatCurrency(targetRevenue * 1.24), desc: "بناءً على الصفقات المفتوحة", color: "text-white" },
        { label: "قيمة قمع الفرص (Pipeline)", value: formatCurrency(targetRevenue * 4.85), desc: "مجموع الفرص النشطة حالياً", color: "text-cyan-400" },
        { label: "الصفقات المتوقعة", value: `${toArabicNumerals(Math.round(deals * 1.4))} صفقة`, desc: "خلال الـ ٤ أسابيع القادمة", color: "text-violet-400" },
        { label: "احتمالية الإغلاق (Win Rate)", value: "٢٦.٨٪", desc: "المتوسط العام للمنظومة", color: "text-emerald-400" },
        { label: "إيراد تحت الخطر", value: formatCurrency(targetRevenue * 0.19), desc: "تأخر العميل بالرد أو المفاوضات", color: "text-rose-500" }
    ];

    return (
        <div className={cn("bg-slate-950/70 border border-slate-900/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between backdrop-blur-sm shadow-[0_0_40px_rgba(0,0,0,0.5)] text-right w-full h-full", className)}>
            
            {/* Dashboard Top Header */}
            <div className="flex items-center justify-between border-b border-slate-900/80 pb-4">
                {/* Tabs selection */}
                <div className="flex items-center bg-slate-950 border border-slate-900 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('channels')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300",
                            activeTab === 'channels' ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        القنوات والصفقات
                    </button>
                    <button
                        onClick={() => setActiveTab('forecast')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300",
                            activeTab === 'forecast' ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        توقعات الإيرادات (Forecast)
                    </button>
                </div>

                <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs md:text-sm font-black text-slate-200">لوحة المتابعة الحية والنمو</span>
                </div>
            </div>

            {/* Six Metrics Cards Grid */}
            <div className="grid grid-cols-3 gap-3 my-4">
                {metrics.map((metric) => {
                    const isHighlighted = highlightedMetric === metric.id;
                    return (
                        <div 
                            key={metric.id}
                            className={cn(
                                "bg-slate-950/80 border p-3 rounded-xl text-right transition-all duration-300 relative overflow-hidden",
                                isHighlighted 
                                    ? "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                                    : "border-slate-900/60"
                            )}
                            style={{ backgroundColor: isHighlighted ? 'rgba(16,185,129,0.02)' : '' }}
                        >
                            {/* Glow spot */}
                            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at top left, ${metric.glow}, transparent 60%)` }} />
                            <span className="block text-[10px] md:text-xs text-slate-500 font-bold">{metric.label}</span>
                            <span className="block text-sm md:text-base font-black text-white my-1">{metric.value}</span>
                            <span className={cn("block text-[9px] md:text-[10px] font-bold", metric.color)}>{metric.change}</span>
                        </div>
                    );
                })}
            </div>

            {/* Interactive Tab Panels */}
            <div className="flex-1 flex flex-col min-h-[220px] justify-between">
                {activeTab === 'forecast' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch flex-1">
                        
                        {/* Interactive Graph Panel */}
                        <div className="md:col-span-7 bg-slate-950/80 border border-slate-900/60 p-3 rounded-xl flex flex-col justify-between">
                            <div className="relative w-full h-32 bg-slate-950/20 rounded overflow-hidden">
                                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="live-glow-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M 0 32 Q 20 30 40 18 T 80 8 T 100 3 L 100 40 L 0 40 Z" fill="url(#live-glow-gradient)" />
                                    <motion.path 
                                        d="M 0 32 Q 20 30 40 18 T 80 8 T 100 3" 
                                        fill="none" 
                                        stroke="#10b981" 
                                        strokeWidth="1.2"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                    <circle cx="100" cy="3" r="1" fill="#10b981" />
                                    {!shouldReduceMotion && <circle cx="100" cy="3" r="3" fill="#10b981" className="animate-ping opacity-45" />}
                                </svg>
                                <span className="absolute top-2 right-2.5 text-[9px] md:text-xs text-slate-500 font-bold">مسار توقعات نمو الإيرادات المتراكم للربع الحالي</span>
                            </div>
                            
                            {/* Graphic Footer info */}
                            <div className="flex items-center justify-between text-[9px] md:text-xs text-slate-400 mt-2 px-1 font-bold">
                                <span>الهدف: {formatCurrency(targetRevenue * 1.5)}</span>
                                <span>الحالي: {formatCurrency(targetRevenue * 1.24)} (٨٢.٦٪)</span>
                            </div>
                        </div>

                        {/* 5 Business Indicators List */}
                        <div className="md:col-span-5 bg-slate-950/80 border border-slate-900/60 p-3 rounded-xl flex flex-col justify-between text-right">
                            <span className="block text-[10px] md:text-xs text-slate-500 font-bold mb-2 border-b border-slate-900 pb-1.5">مؤشرات الأداء المالي</span>
                            <div className="space-y-2">
                                {businessIndicators.map((indicator, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-[9px] md:text-xs border-b border-slate-900/40 pb-1.5 last:border-0 last:pb-0">
                                        <div className="text-left font-sans">
                                            <span className={cn("font-black block text-[10px] md:text-xs", indicator.color)}>{indicator.value}</span>
                                            <span className="text-[8px] text-slate-500 block font-medium mt-0.5">{indicator.desc}</span>
                                        </div>
                                        <span className="text-slate-400 font-bold">{indicator.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

                {activeTab === 'channels' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch flex-1">
                        
                        {/* Channels performance */}
                        <div className="md:col-span-6 bg-slate-950/80 border border-slate-900/60 p-3 rounded-xl flex flex-col justify-between">
                            <span className="block text-[10px] md:text-xs text-slate-500 font-bold text-right mb-3">أعلى قنوات التواصل أداءً</span>
                            <div className="space-y-3">
                                {/* WhatsApp */}
                                <div className="flex items-center gap-2 justify-between text-[10px] md:text-xs">
                                    <span className="text-slate-400 w-8 text-left font-bold font-sans">٦٢٪</span>
                                    <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="bg-emerald-500 h-full rounded-full" 
                                            initial={{ width: 0 }}
                                            animate={{ width: '62%' }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                    <span className="text-emerald-400 font-black w-14 text-right">واتساب</span>
                                </div>
                                {/* LinkedIn */}
                                <div className="flex items-center gap-2 justify-between text-[10px] md:text-xs">
                                    <span className="text-slate-400 w-8 text-left font-bold font-sans">٤٨٪</span>
                                    <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="bg-blue-400 h-full rounded-full" 
                                            initial={{ width: 0 }}
                                            animate={{ width: '48%' }}
                                            transition={{ duration: 1, delay: 0.1 }}
                                        />
                                    </div>
                                    <span className="text-blue-400 font-black w-14 text-right">لينكدإن</span>
                                </div>
                                {/* Email */}
                                <div className="flex items-center gap-2 justify-between text-[10px] md:text-xs">
                                    <span className="text-slate-400 w-8 text-left font-bold font-sans">٣٥٪</span>
                                    <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="bg-cyan-400 h-full rounded-full" 
                                            initial={{ width: 0 }}
                                            animate={{ width: '35%' }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                        />
                                    </div>
                                    <span className="text-cyan-400 font-black w-14 text-right">البريد</span>
                                </div>
                            </div>
                        </div>

                        {/* Deals table & Donut chart */}
                        <div className="md:col-span-6 bg-slate-950/80 border border-slate-900/60 p-3 rounded-xl flex flex-col justify-between text-right">
                            {/* Mini Opportunities table */}
                            <div className="space-y-1.5">
                                <span className="block text-[10px] md:text-xs text-slate-500 font-bold mb-2">أعلى الفرص تقدماً</span>
                                <div className="space-y-1.5 text-[9px] md:text-xs text-slate-300">
                                    <div className="flex justify-between border-b border-slate-900/60 pb-1.5 text-slate-500 font-bold">
                                        <span>العميل</span>
                                        <span>المرحلة</span>
                                        <span>القيمة</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-slate-200">مجموعة الشايع</span>
                                        <span className="text-blue-400">تفاوض</span>
                                        <span className="text-emerald-400 font-bold">{formatCurrency(targetRevenue * 0.24)}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-slate-200">الخزف السعودي</span>
                                        <span className="text-violet-400">اجتماع محجوز</span>
                                        <span className="text-emerald-400 font-bold">{formatCurrency(targetRevenue * 0.18)}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-slate-200">سدافكو الغذائية</span>
                                        <span className="text-cyan-400">تقديم عرض سعر</span>
                                        <span className="text-emerald-400 font-bold">{formatCurrency(targetRevenue * 0.15)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Donut percentage split */}
                            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-900/60">
                                <div className="relative w-10 h-10 shrink-0">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a78bfa" strokeWidth="4.5" strokeDasharray="38 100" strokeDashoffset="0" />
                                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22d3ee" strokeWidth="4.5" strokeDasharray="28 100" strokeDashoffset="-38" />
                                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="18 100" strokeDashoffset="-66" />
                                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.5" strokeDasharray="16 100" strokeDashoffset="-84" />
                                    </svg>
                                </div>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[8.5px] md:text-[9.5px] text-slate-400 leading-tight">
                                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-violet-400" /> ٣٨٪ استكشاف</div>
                                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> ٢٨٪ تأهيل</div>
                                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> ١٨٪ عروض</div>
                                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> ١٦٪ حسم</div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
            
        </div>
    );
};
