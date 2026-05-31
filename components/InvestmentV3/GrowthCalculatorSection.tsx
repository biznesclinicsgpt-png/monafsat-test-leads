import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Calculator, Target, TrendingUp, CheckCircle, RefreshCw, BarChart3, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const toArabicNumerals = (num: number | string): string => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, (w) => arabicDigits[+w]);
};

export const GrowthCalculatorSection = () => {
    const shouldReduceMotion = useReducedMotion();
    
    // Inputs state
    const [sector, setSector] = useState<string>('مقاولات');
    const [targetRevenue, setTargetRevenue] = useState<number>(1000000);
    const [avgDealValue, setAvgDealValue] = useState<number>(100000);
    const [region, setRegion] = useState<string>('السعودية بالكامل');
    
    // UI states
    const [isCalculated, setIsCalculated] = useState<boolean>(true);
    const [activeMobileScenario, setActiveMobileScenario] = useState<'conservative' | 'realistic' | 'accelerated'>('realistic');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
                    closeRatePercent: `${toArabicNumerals(config.closeRate * 100)}٪`,
                    meetingPercent: "٧٥٪",
                    convPercent: `${toArabicNumerals(config.convToMeetingRate * 100)}٪`,
                    openPercent: `${toArabicNumerals(config.openRate * 100)}٪`
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
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
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
                                    onChange={(e) => setSector(e.target.value)}
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
                                    value={targetRevenue}
                                    onChange={(e) => setTargetRevenue(Number(e.target.value))}
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
                                    value={avgDealValue}
                                    onChange={(e) => setAvgDealValue(Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-white font-sans font-bold focus:border-emerald-500 focus:outline-none transition-colors"
                                    required
                                />
                            </div>

                            {/* 4. Target Region */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-400">المنطقة المستهدفة بالمملكة</label>
                                <select 
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
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
                                    {/* Mobile Scenario Tabs Switcher */}
                                    <div className="lg:hidden flex items-center bg-slate-950 border border-slate-900 p-1.5 rounded-2xl">
                                        <button
                                            onClick={() => setActiveMobileScenario('accelerated')}
                                            className={cn(
                                                "flex-1 py-2 text-center rounded-xl text-xs font-bold transition-all duration-300",
                                                activeMobileScenario === 'accelerated' ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20" : "text-slate-500"
                                            )}
                                        >
                                            متسارع
                                        </button>
                                        <button
                                            onClick={() => setActiveMobileScenario('realistic')}
                                            className={cn(
                                                "flex-1 py-2 text-center rounded-xl text-xs font-bold transition-all duration-300",
                                                activeMobileScenario === 'realistic' ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/20" : "text-slate-500"
                                            )}
                                        >
                                            واقعي
                                        </button>
                                        <button
                                            onClick={() => setActiveMobileScenario('conservative')}
                                            className={cn(
                                                "flex-1 py-2 text-center rounded-xl text-xs font-bold transition-all duration-300",
                                                activeMobileScenario === 'conservative' ? "bg-slate-900 text-slate-400 border border-slate-800" : "text-slate-500"
                                            )}
                                        >
                                            محافظ
                                        </button>
                                    </div>

                                    {/* Desktop columns / Mobile active card layout */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-stretch">
                                        {results.map((scen) => {
                                            const isMobileHidden = activeMobileScenario !== scen.id;
                                            
                                            return (
                                                <div 
                                                    key={scen.id}
                                                    className={cn(
                                                        "border p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden backdrop-blur-sm transition-all duration-300",
                                                        scen.color,
                                                        isMobileHidden ? "hidden lg:flex" : "flex"
                                                    )}
                                                >
                                                    {/* Radial internal glow */}
                                                    <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${scen.glowColor}, transparent 70%)` }} />

                                                    <div>
                                                        {/* Header Scenario Name */}
                                                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900/60">
                                                            <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border", scen.badgeColor)}>
                                                                السيناريو
                                                            </span>
                                                            <h4 className="text-sm font-black text-white">{scen.name}</h4>
                                                        </div>

                                                        {/* Metrics List in Arabic digits */}
                                                        <div className="space-y-4 text-right">
                                                            {/* 1. الصفقات المطلوبة */}
                                                            <div>
                                                                <span className="block text-[8.5px] text-slate-500 font-bold">الصفقات المطلوبة للإغلاق</span>
                                                                <span className="block text-xl font-black text-white mt-1 font-sans">{toArabicNumerals(scen.metrics.deals)}</span>
                                                            </div>
                                                            {/* 2. عروض الأسعار المطلوبة */}
                                                            <div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-[7.5px] text-slate-500 font-bold">معدل الإغلاق: {scen.assumptions.closeRatePercent}</span>
                                                                    <span className="text-[8.5px] text-slate-500 font-bold">عروض الأسعار المطلوبة</span>
                                                                </div>
                                                                <span className="block text-xl font-black text-white mt-1 font-sans">{toArabicNumerals(scen.metrics.proposals)}</span>
                                                            </div>
                                                            {/* 3. الاجتماعات المطلوبة */}
                                                            <div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-[7.5px] text-slate-500 font-bold">عروض/اجتماع: {scen.assumptions.meetingPercent}</span>
                                                                    <span className="text-[8.5px] text-slate-500 font-bold">الاجتماعات المطلوبة</span>
                                                                </div>
                                                                <span className="block text-xl font-black text-white mt-1 font-sans">{toArabicNumerals(scen.metrics.meetings)}</span>
                                                            </div>
                                                            {/* 4. المحادثات المطلوبة */}
                                                            <div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-[7.5px] text-slate-500 font-bold">اجتماع/محادثة: {scen.assumptions.convPercent}</span>
                                                                    <span className="text-[8.5px] text-slate-500 font-bold">المحادثات المطلوبة</span>
                                                                </div>
                                                                <span className="block text-xl font-black text-white mt-1 font-sans">{toArabicNumerals(scen.metrics.conversations)}</span>
                                                            </div>
                                                            {/* 5. الجهات المستهدفة */}
                                                            <div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-[7.5px] text-slate-500 font-bold">محادثة/جهة: {scen.assumptions.openPercent}</span>
                                                                    <span className="text-[8.5px] text-slate-500 font-bold">إجمالي الجهات المستهدفة (الداتا)</span>
                                                                </div>
                                                                <span className="block text-xl font-black text-white mt-1 font-sans">{toArabicNumerals(scen.metrics.targetOutreach)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Output Note */}
                                                    <div className="mt-6 pt-4 border-t border-slate-900/60 text-[8.5px] text-slate-500 leading-normal flex items-start gap-1">
                                                        <HelpCircle className="w-3 h-3 text-slate-600 shrink-0 mt-0.5" />
                                                        <span>توقعات خلال الـ ٩٠ يوماً الأولى من التشغيل الفعلي.</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
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
