import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TrendingUp, Users, MessageSquare, Calendar, Handshake, DollarSign, Activity, BarChart2, ShieldAlert } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface LiveDashboardPanelProps {
    className?: string;
    highlightedMetric?: string; // Can be used to highlight specific metrics based on hovered agent
}

export const LiveDashboardPanel: React.FC<LiveDashboardPanelProps> = ({ className, highlightedMetric }) => {
    const shouldReduceMotion = useReducedMotion();
    const [activeTab, setActiveTab] = useState<'forecast' | 'channels'>('forecast');

    // 6 Metrics daily logs
    const metrics = [
        { id: 'leads', label: "الفرص الساخنة", value: "١٢", change: "🔥 +٣ اليوم", color: "text-amber-500", glow: "rgba(245,158,11,0.05)" },
        { id: 'decision_makers', label: "صناع القرار", value: "١٢٨", change: "👤 +٢٤ اليوم", color: "text-cyan-400", glow: "rgba(34,211,238,0.05)" },
        { id: 'conversations', label: "محادثات نشطة", value: "٣٤٧", change: "💬 +٥٧ اليوم", color: "text-emerald-400", glow: "rgba(16,185,129,0.05)" },
        { id: 'meetings', label: "اجتماعات قادمة", value: "١٨", change: "📅 +٥ اليوم", color: "text-violet-400", glow: "rgba(167,139,250,0.05)" },
        { id: 'negotiations', label: "تحت التفاوض", value: "٧", change: "🤝 +٢ اليوم", color: "text-blue-400", glow: "rgba(59,130,246,0.05)" },
        { id: 'expected_revenue', label: "إيراد متوقع", value: "1.2M SAR", change: "📈 +180K أسبوعياً", color: "text-emerald-400", glow: "rgba(16,185,129,0.08)" }
    ];

    // Revenue Forecast: 5 business indicators
    const businessIndicators = [
        { label: "إيراد ربع سنوي متوقع", value: "١,٢٤٠,٠٠٠ ر.س", desc: "بناءً على الصفقات المفتوحة", color: "text-white" },
        { label: "قيمة قمع الفرص (Pipeline)", value: "٤,٨٥٠,٠٠٠ ر.س", desc: "مجموع الفرص النشطة حالياً", color: "text-cyan-400" },
        { label: "الصفقات المتوقعة", value: "١٤ صفقة", desc: "خلال الـ ٤ أسابيع القادمة", color: "text-violet-400" },
        { label: "احتمالية الإغلاق (Win Rate)", value: "٢٦.٨٪", desc: "المتوسط العام للمنظومة", color: "text-emerald-400" },
        { label: "إيراد تحت الخطر", value: "١٩٠,٠٠٠ ر.س", desc: "تأخر العميل بالرد أو المفاوضات", color: "text-rose-500" }
    ];

    return (
        <div className={cn("bg-slate-950/70 border border-slate-900/80 rounded-3xl p-5 flex flex-col justify-between backdrop-blur-sm shadow-[0_0_40px_rgba(0,0,0,0.5)] text-right", className)}>
            
            {/* Dashboard Top Header */}
            <div className="flex items-center justify-between border-b border-slate-900/80 pb-3">
                {/* Tabs selection */}
                <div className="flex items-center bg-slate-950 border border-slate-900 p-0.5 rounded-xl">
                    <button
                        onClick={() => setActiveTab('channels')}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all duration-300",
                            activeTab === 'channels' ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        القنوات والصفقات
                    </button>
                    <button
                        onClick={() => setActiveTab('forecast')}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all duration-300",
                            activeTab === 'forecast' ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        توقعات الإيرادات (Forecast)
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-bold text-slate-300">نظرة عامة ومتابعة حية للمبيعات</span>
                </div>
            </div>

            {/* Six Metrics Cards Grid */}
            <div className="grid grid-cols-3 gap-2 my-3">
                {metrics.map((metric) => {
                    const isHighlighted = highlightedMetric === metric.id;
                    return (
                        <div 
                            key={metric.id}
                            className={cn(
                                "bg-slate-950/80 border p-2 rounded-xl text-right transition-all duration-300 relative overflow-hidden",
                                isHighlighted 
                                    ? "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                                    : "border-slate-900/60"
                            )}
                            style={{ backgroundColor: isHighlighted ? 'rgba(16,185,129,0.02)' : '' }}
                        >
                            {/* Glow spot */}
                            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at top left, ${metric.glow}, transparent 60%)` }} />
                            <span className="block text-[8px] text-slate-500 font-bold">{metric.label}</span>
                            <span className="block text-xs md:text-sm font-black text-white my-0.5">{metric.value}</span>
                            <span className={cn("block text-[7px] font-bold", metric.color)}>{metric.change}</span>
                        </div>
                    );
                })}
            </div>

            {/* Interactive Tab Panels */}
            <div className="flex-1 flex flex-col min-h-[190px] justify-between">
                {activeTab === 'forecast' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch flex-1">
                        
                        {/* Interactive Graph Panel */}
                        <div className="md:col-span-7 bg-slate-950/80 border border-slate-900/60 p-2.5 rounded-xl flex flex-col justify-between">
                            <div className="relative w-full h-24 bg-slate-950/20 rounded overflow-hidden">
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
                                <span className="absolute top-1.5 right-2 text-[7px] text-slate-500 font-sans">مسار توقعات نمو الإيرادات المتراكم للربع الحالي</span>
                            </div>
                            
                            {/* Graphic Footer info */}
                            <div className="flex items-center justify-between text-[7px] text-slate-500 mt-2 px-1">
                                <span className="font-sans">Target: 1.5M SAR</span>
                                <span className="font-sans">Current: 1.24M (82.6%)</span>
                            </div>
                        </div>

                        {/* 5 Business Indicators List */}
                        <div className="md:col-span-5 bg-slate-950/80 border border-slate-900/60 p-2.5 rounded-xl flex flex-col justify-between text-right">
                            <span className="block text-[8px] text-slate-500 font-bold mb-1.5 border-b border-slate-900 pb-1">مؤشرات الأداء المالي</span>
                            <div className="space-y-1.5">
                                {businessIndicators.map((indicator, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-[7px] border-b border-slate-900/40 pb-1 last:border-0 last:pb-0">
                                        <div className="text-left font-sans">
                                            <span className={cn("font-bold block text-[8.5px]", indicator.color)}>{indicator.value}</span>
                                            <span className="text-[6px] text-slate-500 block">{indicator.desc}</span>
                                        </div>
                                        <span className="text-slate-400 font-medium">{indicator.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

                {activeTab === 'channels' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch flex-1">
                        
                        {/* Channels performance */}
                        <div className="md:col-span-6 bg-slate-950/80 border border-slate-900/60 p-2.5 rounded-xl flex flex-col justify-between">
                            <span className="block text-[8px] text-slate-500 font-bold text-right mb-2">أعلى قنوات التواصل أداءً</span>
                            <div className="space-y-2">
                                {/* WhatsApp */}
                                <div className="flex items-center gap-2 justify-between text-[8px]">
                                    <span className="text-slate-500 w-8 text-left font-sans">62%</span>
                                    <div className="flex-1 bg-slate-900 h-1 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="bg-emerald-500 h-full rounded-full" 
                                            initial={{ width: 0 }}
                                            animate={{ width: '62%' }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                    <span className="text-emerald-400 font-bold w-12 text-right">واتساب</span>
                                </div>
                                {/* LinkedIn */}
                                <div className="flex items-center gap-2 justify-between text-[8px]">
                                    <span className="text-slate-500 w-8 text-left font-sans">48%</span>
                                    <div className="flex-1 bg-slate-900 h-1 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="bg-blue-400 h-full rounded-full" 
                                            initial={{ width: 0 }}
                                            animate={{ width: '48%' }}
                                            transition={{ duration: 1, delay: 0.1 }}
                                        />
                                    </div>
                                    <span className="text-blue-400 font-bold w-12 text-right">لينكدإن</span>
                                </div>
                                {/* Email */}
                                <div className="flex items-center gap-2 justify-between text-[8px]">
                                    <span className="text-slate-500 w-8 text-left font-sans">35%</span>
                                    <div className="flex-1 bg-slate-900 h-1 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="bg-cyan-400 h-full rounded-full" 
                                            initial={{ width: 0 }}
                                            animate={{ width: '35%' }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                        />
                                    </div>
                                    <span className="text-cyan-400 font-bold w-12 text-right">البريد الالكتروني</span>
                                </div>
                            </div>
                        </div>

                        {/* Deals table & Donut chart */}
                        <div className="md:col-span-6 bg-slate-950/80 border border-slate-900/60 p-2.5 rounded-xl flex flex-col justify-between text-right">
                            {/* Mini Opportunities table */}
                            <div className="space-y-1">
                                <span className="block text-[8px] text-slate-500 font-bold mb-1">أعلى الفرص تقدماً</span>
                                <div className="space-y-1 text-[7px] text-slate-300">
                                    <div className="flex justify-between border-b border-slate-900/60 pb-1 text-slate-500 font-bold">
                                        <span>العميل</span>
                                        <span>المرحلة</span>
                                        <span>القيمة</span>
                                    </div>
                                    <div className="flex justify-between py-0.5">
                                        <span className="text-slate-200">مجموعة الشايع</span>
                                        <span className="text-blue-400">تفاوض</span>
                                        <span className="text-emerald-400 font-sans">240K SAR</span>
                                    </div>
                                    <div className="flex justify-between py-0.5">
                                        <span className="text-slate-200">الخزف السعودي</span>
                                        <span className="text-violet-400">اجتماع محجوز</span>
                                        <span className="text-emerald-400 font-sans">180K SAR</span>
                                    </div>
                                    <div className="flex justify-between py-0.5">
                                        <span className="text-slate-200">سدافكو الغذائية</span>
                                        <span className="text-cyan-400">تقديم عرض سعر</span>
                                        <span className="text-emerald-400 font-sans">150K SAR</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Donut percentage split */}
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-900/60">
                                <div className="relative w-8 h-8 shrink-0">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a78bfa" strokeWidth="4.5" strokeDasharray="38 100" strokeDashoffset="0" />
                                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22d3ee" strokeWidth="4.5" strokeDasharray="28 100" strokeDashoffset="-38" />
                                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="18 100" strokeDashoffset="-66" />
                                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.5" strokeDasharray="16 100" strokeDashoffset="-84" />
                                    </svg>
                                </div>
                                <div className="grid grid-cols-2 gap-x-2 text-[6.5px] text-slate-400 leading-none">
                                    <div className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-violet-400" /> ٣٨٪ استكشاف</div>
                                    <div className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-cyan-400" /> ٢٨٪ تأهيل</div>
                                    <div className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-blue-500" /> ١٨٪ عروض</div>
                                    <div className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-emerald-500" /> ١٦٪ حسم</div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
            
        </div>
    );
};
