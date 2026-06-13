import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Calculator, Target, TrendingUp, CheckCircle, RefreshCw, BarChart3, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const toArabicNumerals = (num: number | string): string => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, (w) => arabicDigits[+w]);
};

const useLocalMotion = () => {
  const shouldReduce = useReducedMotion();
  const reveal = {
    hidden: {
      opacity: 0,
      y: shouldReduce ? 0 : 25,
      filter: shouldReduce ? 'none' : 'blur(4px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'none',
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduce ? 0.02 : 0.06,
        delayChildren: shouldReduce ? 0.01 : 0.1
      }
    }
  };
  const item = {
    hidden: {
      opacity: 0,
      y: shouldReduce ? 0 : 15,
      filter: shouldReduce ? 'none' : 'blur(4px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'none',
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  return { shouldReduce, reveal, container, item };
};

export const GrowthCalculatorSection = () => {
    const { shouldReduce, reveal, container, item } = useLocalMotion();
    const shouldReduceMotion = shouldReduce;

    // Inputs state
    const [sector, setSector] = useState<string>('مقاولات');
    const [targetRevenue, setTargetRevenue] = useState<number>(1000000);
    const [avgDealValue, setAvgDealValue] = useState<number>(100000);
    const [region, setRegion] = useState<string>('السعودية بالكامل');

    // UI states
    const [isCalculated, setIsCalculated] = useState<boolean>(true);
    const [activeScenario, setActiveScenario] = useState<'conservative' | 'realistic' | 'accelerated'>('realistic');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Real-time synchronization helper
    const syncToDashboard = (rev: number, deal: number, sec: string, reg: string) => {
        if (typeof window !== 'undefined') {
            // Only update dashboard if inputs are valid (> 0) to prevent division by zero or NaN issues
            if (rev > 0 && deal > 0) {
                localStorage.setItem('manafeth_target_revenue', rev.toString());
                localStorage.setItem('manafeth_avg_deal_value', deal.toString());
                localStorage.setItem('manafeth_sector', sec);
                localStorage.setItem('manafeth_region', reg);
                window.dispatchEvent(new Event('manafeth_calculator_update'));
            }
        }
    };

    const sectors = ['مقاولات', 'مصانع', 'مستشفيات', 'شركات تقنية', 'خدمات لوجستية', 'أخرى'];
    const regions = ['الرياض', 'جدة', 'المنطقة الشرقية', 'السعودية بالكامل'];

    // Load initial values from localStorage or set defaults
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const rev = localStorage.getItem('manafeth_target_revenue');
            const deal = localStorage.getItem('manafeth_avg_deal_value');
            const sec = localStorage.getItem('manafeth_sector');
            const reg = localStorage.getItem('manafeth_region');

            if (rev) setTargetRevenue(Number(rev));
            if (deal) setAvgDealValue(Number(deal));
            if (sec) setSector(sec);
            if (reg) setRegion(reg);

            if (!rev) {
                localStorage.setItem('manafeth_target_revenue', '1000000');
                localStorage.setItem('manafeth_avg_deal_value', '100000');
                localStorage.setItem('manafeth_sector', 'مقاولات');
                localStorage.setItem('manafeth_region', 'السعودية بالكامل');
            }

            // Dispatch initial update event
            setTimeout(() => {
                window.dispatchEvent(new Event('manafeth_calculator_update'));
            }, 100);
        }
    }, []);

    // Equations and calculations helper
    const calculatePlan = () => {
        // Safe math validations
        if (!targetRevenue || targetRevenue <= 0) {
            return null;
        }
        if (!avgDealValue || avgDealValue <= 0) {
            return null;
        }

        // 1. Deals Required (الصفقات المطلوبة)
        const deals = Math.ceil(targetRevenue / avgDealValue);

        // 2. Scenario specific rates
        const scenarios = {
            conservative: {
                name: "محافظ",
                closeRate: 0.20,
                convToMeetingRate: 0.05,
                openRate: 0.25,
                color: "border-slate-800 text-slate-400 bg-slate-950/40",
                badgeColor: "bg-slate-900 border-slate-800 text-slate-400",
                glowColor: "rgba(148,163,184,0.02)"
            },
            realistic: {
                name: "واقعي (الافتراضي)",
                closeRate: 0.25,
                convToMeetingRate: 0.07,
                openRate: 0.28,
                color: "border-cyan-500/30 text-cyan-400 bg-cyan-950/5 shadow-[0_0_20px_rgba(6,182,212,0.05)]",
                badgeColor: "bg-cyan-950/40 border-cyan-500/20 text-cyan-400",
                glowColor: "rgba(6,182,212,0.03)"
            },
            accelerated: {
                name: "متسارع",
                closeRate: 0.30,
                convToMeetingRate: 0.10,
                openRate: 0.30,
                color: "border-emerald-500/30 text-emerald-400 bg-emerald-950/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]",
                badgeColor: "bg-emerald-950/40 border-emerald-500/20 text-emerald-400",
                glowColor: "rgba(16,185,129,0.03)"
            }
        };

        // Solve pipeline metrics for each scenario
        return Object.entries(scenarios).map(([key, config]) => {
            // Proposals required (Deals / Close Rate)
            const proposals = Math.ceil(deals / config.closeRate);

            // Meetings required (Proposals / 0.75)
            const meetings = Math.ceil(proposals / 0.75);

            // Conversations required (Meetings / ConvToMeetingRate)
            const conversations = Math.ceil(meetings / config.convToMeetingRate);

            // Target prospects outreach list (Conversations / OpenRate)
            const targetOutreach = Math.ceil(conversations / config.openRate);

            return {
                id: key,
                name: config.name,
                color: config.color,
                badgeColor: config.badgeColor,
                glowColor: config.glowColor,
                metrics: {
                    deals,
                    proposals,
                    meetings,
                    conversations,
                    targetOutreach
                },
                assumptions: {
                    closeRatePercent: `${toArabicNumerals(Math.round(config.closeRate * 100))}٪`,
                    meetingPercent: "٧٥٪",
                    convPercent: `${toArabicNumerals(Math.round(config.convToMeetingRate * 100))}٪`,
                    openPercent: `${toArabicNumerals(Math.round(config.openRate * 100))}٪`
                }
            };
        });
    };

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();

        if (avgDealValue > targetRevenue) {
            setErrorMsg("تنبيه: متوسط قيمة الصفقة لا يمكن أن يكون أكبر من الهدف البيعي الإجمالي.");
            setIsCalculated(false);
            return;
        }

        setErrorMsg(null);
        setIsCalculated(true);

        // Save inputs to localStorage to sync metrics across the page
        localStorage.setItem('manafeth_target_revenue', targetRevenue.toString());
        localStorage.setItem('manafeth_avg_deal_value', avgDealValue.toString());
        localStorage.setItem('manafeth_sector', sector);
        localStorage.setItem('manafeth_region', region);

        // Dispatch custom event to notify live dashboard panel
        window.dispatchEvent(new Event('manafeth_calculator_update'));
    };

    const results = calculatePlan();

    return (
        <div className="py-24 bg-[#050505] relative overflow-hidden border-t border-slate-900/60" id="growth-calculator">
            {/* Background decorative elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[450px] h-[450px] bg-cyan-500/[0.01] blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] left-[10%] w-[450px] h-[450px] bg-emerald-500/[0.015] blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        variants={reveal}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white mb-6 backdrop-blur-sm">
                            <Calculator className="w-4 h-4 text-emerald-400" />
                            <span className="font-semibold text-xs text-slate-300">تقديرات نمو تفاعلية</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                            احسب فرص النمو المتوقعة لنشاطك خلال أول 90 يوم
                        </h2>
                        <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            أدخل معلومات مبيعاتك الحالية ودع المنظومة تستخرج لك حجم الجهد المطلوب وقمع المبيعات اللازم بدقة متناهية.
                        </p>
                    </motion.div>
                </div>

                {/* Grid Layout: Inputs Left, Results Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* INPUT FORM (4 cols) */}
                    <div className="lg:col-span-4 bg-slate-950/40 border border-slate-900/60 p-6 md:p-8 rounded-3xl backdrop-blur-sm">
                        <h3 className="text-base font-bold text-white mb-6 border-b border-slate-900 pb-3 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-cyan-400" />
                            معلومات النشاط البيعي
                        </h3>

                        <form onSubmit={handleCalculate} className="space-y-5 text-right">
                            {/* 1. Sector Target */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-400">القطاع المستهدف</label>
                                <select
                                    value={sector}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSector(val);
                                        syncToDashboard(targetRevenue, avgDealValue, val, region);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-300 font-bold focus:border-emerald-500 focus:outline-none transition-colors"
                                >
                                    {sectors.map((sec, idx) => (
                                        <option key={idx} value={sec}>{sec}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 2. Target Revenue */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-400">الهدف البيعي خلال الربع الأول (ريال)</label>
                                <input
                                    type="number"
                                    min="1000"
                                    step="1000"
                                    value={targetRevenue || ''}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setTargetRevenue(val);
                                        syncToDashboard(val, avgDealValue, sector, region);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-white font-sans font-bold focus:border-emerald-500 focus:outline-none transition-colors"
                                    required
                                />
                            </div>

                            {/* 3. Avg Deal Value */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-400">متوسط قيمة الصفقة الواحدة (ريال)</label>
                                <input
                                    type="number"
                                    min="100"
                                    step="100"
                                    value={avgDealValue || ''}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setAvgDealValue(val);
                                        syncToDashboard(targetRevenue, val, sector, region);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-white font-sans font-bold focus:border-emerald-500 focus:outline-none transition-colors"
                                    required
                                />
                            </div>

                            {/* 4. Target Region */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-400">المنطقة المستهدفة بالمملكة</label>
                                <select
                                    value={region}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setRegion(val);
                                        syncToDashboard(targetRevenue, avgDealValue, sector, val);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-300 font-bold focus:border-emerald-500 focus:outline-none transition-colors"
                                >
                                    {regions.map((reg, idx) => (
                                        <option key={idx} value={reg}>{reg}</option>
                                    ))}
                                </select>
                            </div>

                            {errorMsg && (
                                <div className="text-[10px] font-bold text-rose-500 bg-rose-500/5 border border-rose-500/10 p-3 rounded-lg leading-relaxed">
                                    {errorMsg}
                                </div>
                            )}

                            {/* Button */}
                            <button
                                type="submit"
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.15)]"
                            >
                                <Calculator className="w-4 h-4 text-slate-950" />
                                احسب خطتي الآن
                            </button>
                        </form>
                    </div>

                    {/* RESULTS DISPLAY (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col justify-stretch h-full">
                        <AnimatePresence mode="wait">
                            {isCalculated && results ? (
                                <motion.div
                                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -15 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-6 flex-1 flex flex-col"
                                >
                                    {/* Scenario Tabs Switcher (Visible on both Desktop and Mobile) */}
                                    <div className="flex items-center bg-slate-950 border border-slate-900 p-1.5 rounded-2xl">
                                        <button
                                            type="button"
                                            onClick={() => setActiveScenario('accelerated')}
                                            className={cn(
                                                "flex-1 py-2.5 text-center rounded-xl text-xs font-black transition-all duration-300",
                                                activeScenario === 'accelerated' ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "text-slate-500 hover:text-slate-300"
                                            )}
                                        >
                                            سيناريو متسارع ⚡
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveScenario('realistic')}
                                            className={cn(
                                                "flex-1 py-2.5 text-center rounded-xl text-xs font-black transition-all duration-300",
                                                activeScenario === 'realistic' ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" : "text-slate-500 hover:text-slate-300"
                                            )}
                                        >
                                            سيناريو واقعي (المقترح) ✓
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveScenario('conservative')}
                                            className={cn(
                                                "flex-1 py-2.5 text-center rounded-xl text-xs font-black transition-all duration-300",
                                                activeScenario === 'conservative' ? "bg-slate-900 text-slate-400 border border-slate-800" : "text-slate-500 hover:text-slate-300"
                                            )}
                                        >
                                            سيناريو محافظ 🛡️
                                        </button>
                                    </div>

                                    {/* Active Scenario Card + Funnel Split Grid */}
                                    {results.filter(r => r.id === activeScenario).map((scen) => (
                                        <div
                                            key={scen.id}
                                            className={cn(
                                                "border p-6 md:p-8 rounded-3xl flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden backdrop-blur-sm transition-all duration-300",
                                                scen.color
                                            )}
                                        >
                                            {/* Radial internal glow */}
                                            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${scen.glowColor}, transparent 70%)` }} />

                                            {/* Right/Left: Metrics List in Arabic digits */}
                                            <div className="flex-1 w-full order-2 md:order-1 text-right space-y-4">
                                                {/* Header Scenario Name */}
                                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-900/60">
                                                    <span className={cn("text-[9px] font-bold px-2.5 py-0.5 rounded-full border", scen.badgeColor)}>
                                                        السيناريو النشط
                                                    </span>
                                                    <h4 className="text-sm font-black text-white">{scen.name}</h4>
                                                </div>

                                                {/* 1. الصفقات المطلوبة */}
                                                <div>
                                                    <span className="block text-[8.5px] text-slate-500 font-bold">الصفقات المطلوبة للإغلاق</span>
                                                    <span className="block text-xl font-black text-white mt-1 font-sans">{toArabicNumerals(scen.metrics.deals)} صفقات</span>
                                                </div>
                                                {/* 2. عروض الأسعار المطلوبة */}
                                                <div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[7.5px] text-slate-500 font-bold">معدل الإغلاق المتوقع: {scen.assumptions.closeRatePercent}</span>
                                                        <span className="text-[8.5px] text-slate-500 font-bold">عروض الأسعار المطلوبة</span>
                                                    </div>
                                                    <span className="block text-xl font-black text-white mt-1 font-sans">{toArabicNumerals(scen.metrics.proposals)} عروض</span>
                                                </div>
                                                {/* 3. الاجتماعات المطلوبة */}
                                                <div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[7.5px] text-slate-500 font-bold">عروض لكل اجتماع: {scen.assumptions.meetingPercent}</span>
                                                        <span className="text-[8.5px] text-slate-500 font-bold">الاجتماعات المطلوبة</span>
                                                    </div>
                                                    <span className="block text-xl font-black text-white mt-1 font-sans">{toArabicNumerals(scen.metrics.meetings)} اجتماعات</span>
                                                </div>
                                                {/* 4. المحادثات المطلوبة */}
                                                <div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[7.5px] text-slate-500 font-bold">اجتماع لكل محادثة: {scen.assumptions.convPercent}</span>
                                                        <span className="text-[8.5px] text-slate-500 font-bold">المحادثات المطلوبة</span>
                                                    </div>
                                                    <span className="block text-xl font-black text-white mt-1 font-sans">{toArabicNumerals(scen.metrics.conversations)} محادثة</span>
                                                </div>
                                                {/* 5. الجهات المستهدفة */}
                                                <div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[7.5px] text-slate-500 font-bold">محادثة لكل جهة: {scen.assumptions.openPercent}</span>
                                                        <span className="text-[8.5px] text-slate-500 font-bold">إجمالي الجهات المستهدفة (قاعدة البيانات)</span>
                                                    </div>
                                                    <span className="block text-xl font-black text-white mt-1 font-sans">{toArabicNumerals(scen.metrics.targetOutreach)} جهة</span>
                                                </div>
                                            </div>

                                            {/* Left/Right: The Funnel SVG Visual */}
                                            <div className="w-full md:w-[45%] flex-shrink-0 order-1 md:order-2">
                                                <div className="relative w-full aspect-[4/3] max-w-[280px] mx-auto bg-slate-950/80 border border-slate-900 rounded-3xl p-4 flex items-center justify-center">
                                                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                        <defs>
                                                            <linearGradient id="funnel-grad-conservative" x1="0" y1="0" x2="0" y2="100%">
                                                                <stop offset="0%" stopColor="#475569" stopOpacity="0.25" />
                                                                <stop offset="100%" stopColor="#334155" stopOpacity="0.05" />
                                                            </linearGradient>
                                                            <linearGradient id="funnel-grad-realistic" x1="0" y1="0" x2="0" y2="100%">
                                                                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                                                                <stop offset="100%" stopColor="#0891b2" stopOpacity="0.05" />
                                                            </linearGradient>
                                                            <linearGradient id="funnel-grad-accelerated" x1="0" y1="0" x2="0" y2="100%">
                                                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                                                                <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
                                                            </linearGradient>
                                                        </defs>

                                                        {/* Draw the funnel blocks */}
                                                        {/* 1. Outreach */}
                                                        <polygon points="10,10 90,10 80,24 20,24" fill={activeScenario === 'conservative' ? 'url(#funnel-grad-conservative)' : activeScenario === 'realistic' ? 'url(#funnel-grad-realistic)' : 'url(#funnel-grad-accelerated)'} stroke={activeScenario === 'conservative' ? '#64748b' : activeScenario === 'realistic' ? '#06b6d4' : '#10b981'} strokeWidth="0.8" opacity="0.85" />
                                                        {/* 2. Conversations */}
                                                        <polygon points="22,27 78,27 70,41 30,41" fill={activeScenario === 'conservative' ? 'url(#funnel-grad-conservative)' : activeScenario === 'realistic' ? 'url(#funnel-grad-realistic)' : 'url(#funnel-grad-accelerated)'} stroke={activeScenario === 'conservative' ? '#64748b' : activeScenario === 'realistic' ? '#06b6d4' : '#10b981'} strokeWidth="0.8" opacity="0.85" />
                                                        {/* 3. Meetings */}
                                                        <polygon points="32,44 68,44 60,58 40,58" fill={activeScenario === 'conservative' ? 'url(#funnel-grad-conservative)' : activeScenario === 'realistic' ? 'url(#funnel-grad-realistic)' : 'url(#funnel-grad-accelerated)'} stroke={activeScenario === 'conservative' ? '#64748b' : activeScenario === 'realistic' ? '#06b6d4' : '#10b981'} strokeWidth="0.8" opacity="0.85" />
                                                        {/* 4. Proposals */}
                                                        <polygon points="42,61 58,61 52,75 48,75" fill={activeScenario === 'conservative' ? 'url(#funnel-grad-conservative)' : activeScenario === 'realistic' ? 'url(#funnel-grad-realistic)' : 'url(#funnel-grad-accelerated)'} stroke={activeScenario === 'conservative' ? '#64748b' : activeScenario === 'realistic' ? '#06b6d4' : '#10b981'} strokeWidth="0.8" opacity="0.85" />
                                                        {/* 5. Deals */}
                                                        <polygon points="49,78 51,78 52,92 48,92" fill={activeScenario === 'conservative' ? 'url(#funnel-grad-conservative)' : activeScenario === 'realistic' ? 'url(#funnel-grad-realistic)' : 'url(#funnel-grad-accelerated)'} stroke={activeScenario === 'conservative' ? '#64748b' : activeScenario === 'realistic' ? '#06b6d4' : '#10b981'} strokeWidth="0.8" opacity="0.95" />

                                                        {/* Flowing particles down the center of the funnel */}
                                                        {!shouldReduceMotion && (
                                                            <>
                                                                <circle cx="50" cy="10" r="1.5" fill={activeScenario === 'conservative' ? '#94a3b8' : activeScenario === 'realistic' ? '#22d3ee' : '#34d399'}>
                                                                    <animate attributeName="cy" values="10;92" dur={activeScenario === 'conservative' ? '5s' : activeScenario === 'realistic' ? '3s' : '1.5s'} repeatCount="indefinite" />
                                                                    <animate attributeName="opacity" values="0;1;1;0" dur={activeScenario === 'conservative' ? '5s' : activeScenario === 'realistic' ? '3s' : '1.5s'} repeatCount="indefinite" />
                                                                </circle>
                                                                <circle cx="50" cy="30" r="1" fill={activeScenario === 'conservative' ? '#94a3b8' : activeScenario === 'realistic' ? '#22d3ee' : '#34d399'}>
                                                                    <animate attributeName="cy" values="30;92" dur={activeScenario === 'conservative' ? '5s' : activeScenario === 'realistic' ? '3s' : '1.5s'} begin={activeScenario === 'conservative' ? '2.5s' : activeScenario === 'realistic' ? '1.5s' : '0.75s'} repeatCount="indefinite" />
                                                                    <animate attributeName="opacity" values="0;1;1;0" dur={activeScenario === 'conservative' ? '5s' : activeScenario === 'realistic' ? '3s' : '1.5s'} begin={activeScenario === 'conservative' ? '2.5s' : activeScenario === 'realistic' ? '1.5s' : '0.75s'} repeatCount="indefinite" />
                                                                </circle>
                                                            </>
                                                        )}
                                                    </svg>

                                                    {/* Funnel Labels overlaid on left/right */}
                                                    <div className="absolute top-[12%] right-[5%] text-[7px] font-black text-slate-500">الجهات المستهدفة</div>
                                                    <div className="absolute top-[28%] right-[7%] text-[7px] font-black text-slate-500">محادثات نشطة</div>
                                                    <div className="absolute top-[45%] right-[9%] text-[7px] font-black text-slate-500">اجتماعات قادمة</div>
                                                    <div className="absolute top-[62%] right-[11%] text-[7px] font-black text-slate-500">عروض مقدمة</div>
                                                    <div className="absolute top-[79%] right-[13%] text-[7px] font-black text-slate-500">صفقات مغلقة</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Scenario Comparison Mini Bar */}
                                    <div className="bg-slate-950/80 border border-slate-900 p-5 rounded-3xl space-y-4">
                                        <h4 className="text-xs font-black text-white text-right">مقارنة حجم صفقات الإغلاق المتوقعة</h4>
                                        <div className="space-y-3">
                                            {results.map((scen) => {
                                                const maxDeals = Math.max(...results.map(r => r.metrics.deals));
                                                const percentage = (scen.metrics.deals / maxDeals) * 100;
                                                const isCurrent = scen.id === activeScenario;

                                                return (
                                                    <div key={scen.id} className="space-y-1.5 cursor-pointer" onClick={() => setActiveScenario(scen.id as any)}>
                                                        <div className="flex justify-between text-[10px] font-bold">
                                                            <span className={scen.id === 'conservative' ? 'text-slate-400' : scen.id === 'realistic' ? 'text-cyan-400' : 'text-emerald-400'}>
                                                                {toArabicNumerals(scen.metrics.deals)} صفقات (تحتاج {toArabicNumerals(scen.metrics.targetOutreach)} جهة مستهدفة)
                                                            </span>
                                                            <span className={cn("transition-colors", isCurrent ? "text-white font-extrabold" : "text-slate-500")}>
                                                                {scen.name} {isCurrent && "✓"}
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-2 bg-slate-900 border border-slate-900/60 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${percentage}%` }}
                                                                transition={{ duration: 0.6 }}
                                                                className={cn(
                                                                    "h-full rounded-full",
                                                                    scen.id === 'conservative' ? 'bg-slate-500' : scen.id === 'realistic' ? 'bg-cyan-500' : 'bg-emerald-500'
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Overall Info bar explaining mathematical rates in Arabic digits */}
                                    <div className="bg-slate-950/20 border border-slate-900/80 p-4 rounded-2xl text-right text-[9.5px] text-slate-400 leading-relaxed flex items-start gap-3">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block font-bold text-white mb-0.5">المعادلات والافتراضات المثبتة خلف الحساب:</span>
                                            معدل إغلاق صفقات عروض الأسعار (Close Rate): المحافظ ٢٠٪، الواقعي ٢٥٪، المتسارع ٣٠٪. |
                                            معدل تحويل الاجتماعات لعروض أسعار هو ٧٥٪. |
                                            معدل تحويل المحادثات لاجتماعات: المحافظ ٥٪، الواقعي ٧٪، المتسارع ١٠٪. |
                                            معدل فتح المحادثة من الجهات المستهدفة: المحافظ ٢٥٪، الواقعي ٢٨٪، المتسارع ٣٠٪.
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex-1 border border-dashed border-slate-900 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-slate-500">
                                    <Calculator className="w-8 h-8 text-slate-700 mb-3" />
                                    <span className="text-xs font-bold">يرجى ملء الحقول الجانبية والضغط على "احسب خطتي الآن" لتوليد النتائج المبيعية المتوقعة.</span>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

            </div>
        </div>
    );
};
