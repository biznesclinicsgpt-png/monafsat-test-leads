import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Target, Zap, CheckCircle2, TrendingUp, Sparkles, ArrowDown, MessageSquare, Briefcase } from 'lucide-react';

export const MonafsatBridge = () => {
    const shouldReduceMotion = useReducedMotion();
    
    // Hover state to control particle flow and highlight
    const [hoverState, setHoverState] = useState<'none' | 'ninja' | 'monafsat' | 'core'>('none');
    
    // Activity logs cycling indices
    const [ninjaLogIndex, setNinjaLogIndex] = useState(0);
    const [monafsatLogIndex, setMonafsatLogIndex] = useState(0);
    const [subtextIndex, setSubtextIndex] = useState(0);

    const ninjaLogs = [
        "رصد صانع القرار في الشركة المستهدفة",
        "توليد رسالة مخصصة لاهتمام العميل",
        "رد إيجابي: طلب تفاصيل العرض",
        "تأكيد موعد الاجتماع وتحديث التقويم"
    ];

    const monafsatLogs = [
        "رصد مناقصة حكومية جديدة في قطاعك",
        "تحليل ذكي لشروط الكراسة ومطابقتها",
        "تنبيه: فرصة جديدة مطابقة بنسبة ٩٤٪",
        "بدء صياغة العرض الفني الأولي تلقائياً"
    ];

    const subtexts = [
        "+ فرص أكثر",
        "+ مبيعات أسرع",
        "+ نمو واضح"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setNinjaLogIndex((prev) => (prev + 1) % ninjaLogs.length);
            setMonafsatLogIndex((prev) => (prev + 1) % monafsatLogs.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setSubtextIndex((prev) => (prev + 1) % subtexts.length);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    const showNinjaFlow = hoverState === 'ninja' || hoverState === 'core';
    const showMonafsatFlow = hoverState === 'monafsat' || hoverState === 'core';

    return (
        <div className="w-full max-w-7xl mx-auto px-4 mb-24 select-none text-right">
            <div className="bg-slate-950/50 border border-slate-900/90 p-8 md:p-12 rounded-3xl relative overflow-hidden backdrop-blur-md">
                
                {/* Background visual glow gradients */}
                <div className="absolute top-0 left-0 w-[400px] h-[300px] bg-cyan-500/[0.02] blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-emerald-500/[0.02] blur-[120px] rounded-full pointer-events-none" />

                {/* 1. Header Area */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 border border-emerald-500/10 text-emerald-400 mb-4"
                    >
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black tracking-wider">تكامل استراتيجي ثنائي</span>
                    </motion.div>
                    
                    <motion.h3 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight"
                    >
                        مدعوم بتكامل النينجا × منافسات
                    </motion.h3>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        فريق النينجا يفتح الوصول ويحرك المحادثات مع صناع القرار… وفريق منافسات يرصد المشاريع والفرص الجديدة ويصل بكم إلى أفضل الفرص في السوق.
                    </motion.p>
                </div>

                {/* 2. Main Interactive Flow Section */}
                <div className="relative min-h-[400px] flex flex-col justify-between z-10">
                    
                    {/* DESKTOP VIEW */}
                    <div className="hidden lg:grid grid-cols-12 gap-6 items-stretch relative">
                        
                        {/* SVG Connection Lines overlay behind the cards */}
                        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                            <svg className="w-full h-full" viewBox="0 0 1000 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="ninjaGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                                    </linearGradient>
                                    <linearGradient id="monafsatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                                    </linearGradient>
                                </defs>

                                {/* Ninja to Center Paths */}
                                <path d="M 750 150 Q 625 100 500 150" stroke="#1e293b" strokeWidth="2" strokeDasharray="5 5" />
                                <path d="M 750 150 Q 625 200 500 150" stroke="#1e293b" strokeWidth="2" strokeDasharray="5 5" />

                                {/* Monafsat to Center Paths */}
                                <path d="M 250 150 Q 375 100 500 150" stroke="#1e293b" strokeWidth="2" strokeDasharray="5 5" />
                                <path d="M 250 150 Q 375 200 500 150" stroke="#1e293b" strokeWidth="2" strokeDasharray="5 5" />

                                {/* Animated Laser Flows */}
                                {!shouldReduceMotion && (
                                    <>
                                        {/* Ninja Laser Pulse A */}
                                        <motion.path 
                                            d="M 750 150 Q 625 100 500 150" 
                                            stroke="url(#ninjaGrad)" 
                                            strokeWidth="2.5" 
                                            strokeDasharray="30 150"
                                            animate={{ strokeDashoffset: [0, 180] }}
                                            transition={{ duration: showNinjaFlow ? 1.5 : 3.5, repeat: Infinity, ease: "linear" }}
                                        />
                                        {/* Ninja Laser Pulse B */}
                                        <motion.path 
                                            d="M 750 150 Q 625 200 500 150" 
                                            stroke="url(#ninjaGrad)" 
                                            strokeWidth="2.5" 
                                            strokeDasharray="40 180"
                                            animate={{ strokeDashoffset: [0, 220] }}
                                            transition={{ duration: showNinjaFlow ? 1.2 : 3.2, repeat: Infinity, ease: "linear" }}
                                        />

                                        {/* Monafsat Laser Pulse A */}
                                        <motion.path 
                                            d="M 250 150 Q 375 100 500 150" 
                                            stroke="url(#monafsatGrad)" 
                                            strokeWidth="2.5" 
                                            strokeDasharray="30 150"
                                            animate={{ strokeDashoffset: [0, -180] }}
                                            transition={{ duration: showMonafsatFlow ? 1.5 : 3.5, repeat: Infinity, ease: "linear" }}
                                        />
                                        {/* Monafsat Laser Pulse B */}
                                        <motion.path 
                                            d="M 250 150 Q 375 200 500 150" 
                                            stroke="url(#monafsatGrad)" 
                                            strokeWidth="2.5" 
                                            strokeDasharray="40 180"
                                            animate={{ strokeDashoffset: [0, -220] }}
                                            transition={{ duration: showMonafsatFlow ? 1.2 : 3.2, repeat: Infinity, ease: "linear" }}
                                        />
                                    </>
                                )}
                            </svg>
                        </div>

                        {/* Floating elements Ninja (flows to center) */}
                        {showNinjaFlow && !shouldReduceMotion && (
                            <>
                                <motion.div
                                    className="absolute z-20 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black rounded-full pointer-events-none whitespace-nowrap"
                                    initial={{ right: "26%", top: "30%", opacity: 0, scale: 0.8 }}
                                    animate={{ right: ["26%", "47%"], opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
                                    transition={{ duration: 2.2, repeat: Infinity, delay: 0, ease: "easeInOut" }}
                                >
                                    وصول مباشر
                                </motion.div>
                                <motion.div
                                    className="absolute z-20 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black rounded-full pointer-events-none whitespace-nowrap"
                                    initial={{ right: "28%", top: "62%", opacity: 0, scale: 0.8 }}
                                    animate={{ right: ["28%", "47%"], opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
                                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
                                >
                                    محادثة ذكية
                                </motion.div>
                            </>
                        )}

                        {/* Floating elements Monafsat (flows to center) */}
                        {showMonafsatFlow && !shouldReduceMotion && (
                            <>
                                <motion.div
                                    className="absolute z-20 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] font-black rounded-full pointer-events-none whitespace-nowrap"
                                    initial={{ left: "26%", top: "28%", opacity: 0, scale: 0.8 }}
                                    animate={{ left: ["26%", "47%"], opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
                                    transition={{ duration: 2.3, repeat: Infinity, delay: 0.3, ease: "easeInOut" }}
                                >
                                    مشروع جديد
                                </motion.div>
                                <motion.div
                                    className="absolute z-20 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] font-black rounded-full pointer-events-none whitespace-nowrap"
                                    initial={{ left: "28%", top: "60%", opacity: 0, scale: 0.8 }}
                                    animate={{ left: ["28%", "47%"], opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
                                    transition={{ duration: 2.6, repeat: Infinity, delay: 1.1, ease: "easeInOut" }}
                                >
                                    فرصة مطابقة
                                </motion.div>
                            </>
                        )}

                        {/* Right: Ninja Card (الوصول) */}
                        <motion.div 
                            className={`col-span-4 bg-slate-950/80 border rounded-2xl p-6 relative overflow-hidden transition-all duration-300 z-10 flex flex-col justify-between min-h-[260px] ${
                                hoverState === 'ninja' ? 'border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-[1.02]' : 'border-slate-900/80 hover:border-emerald-500/30'
                            }`}
                            onMouseEnter={() => setHoverState('ninja')}
                            onMouseLeave={() => setHoverState('none')}
                            whileHover={{ y: -4 }}
                        >
                            {/* Card badge header */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black">الوصول والمبيعات</span>
                            </div>

                            {/* Focus Word */}
                            <div>
                                <h4 className="text-2xl font-black text-white mb-2">الوصول</h4>
                                <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-4">
                                    محرك النينجا يفتح الوصول المباشر ويحرك المحادثات المغلقة مع صناع القرار المناسبين في السوق السعودي.
                                </p>
                            </div>

                            {/* Live activity simulator feed */}
                            <div className="h-10 flex items-center justify-center bg-slate-900/40 border border-slate-900/90 rounded-lg px-3 py-1.5 text-[9.5px] overflow-hidden text-center w-full">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={ninjaLogIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full text-slate-300 font-bold"
                                    >
                                        {ninjaLogs[ninjaLogIndex]}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Center: The Core Node (النمو) */}
                        <div className="col-span-4 flex items-center justify-center z-10 relative">
                            <motion.div 
                                className={`w-48 h-48 rounded-full bg-gradient-to-tr from-slate-950 via-slate-900/95 to-slate-950 border flex flex-col items-center justify-center p-6 text-center cursor-default transition-all duration-300 shadow-2xl ${
                                    hoverState === 'core' 
                                        ? 'border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.08)] scale-[1.08]' 
                                        : 'border-slate-800/80 hover:border-slate-700/80'
                                }`}
                                onMouseEnter={() => setHoverState('core')}
                                onMouseLeave={() => setHoverState('none')}
                            >
                                {/* Dual spinning dashed rings */}
                                {!shouldReduceMotion && (
                                    <>
                                        <motion.div 
                                            className="absolute inset-2 border-2 border-dashed border-emerald-500/20 rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                        />
                                        <motion.div 
                                            className="absolute inset-4 border border-dashed border-cyan-500/20 rounded-full"
                                            animate={{ rotate: -360 }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        />
                                    </>
                                )}

                                {/* Glow effect at center */}
                                <div className={`absolute w-24 h-24 rounded-full blur-xl transition-all duration-300 pointer-events-none ${
                                    hoverState === 'core' 
                                        ? 'bg-gradient-to-tr from-cyan-500/10 to-emerald-500/10 opacity-100 scale-125' 
                                        : 'bg-gradient-to-tr from-cyan-500/5 to-emerald-500/5 opacity-50'
                                }`} />

                                <div className="relative z-10 flex flex-col items-center">
                                    <span className="text-[10px] font-black text-transparent bg-gradient-to-r from-cyan-400 via-white to-emerald-400 bg-clip-text uppercase tracking-wider mb-1">محرك النمو</span>
                                    
                                    {/* Focus Word */}
                                    <span className="text-2xl font-black text-white tracking-tight mb-2">النمو</span>

                                    {/* Synergy indicator info */}
                                    <div className="min-h-[42px] flex flex-col justify-center items-center">
                                        {hoverState === 'core' ? (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex flex-col items-center"
                                            >
                                                <span className="text-[10px] font-black text-emerald-400">فرص أكثر × إغلاق أسرع</span>
                                                <span className="text-[7.5px] font-bold text-slate-400 mt-1">تكامُل مبيعات حتمي</span>
                                            </motion.div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-[11px] font-black text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text">نمو مضاعف للفرص</span>
                                                <div className="h-4 flex items-center justify-center mt-0.5">
                                                    <AnimatePresence mode="wait">
                                                        <motion.span
                                                            key={subtextIndex}
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -5 }}
                                                            transition={{ duration: 0.25 }}
                                                            className="text-[9px] font-bold text-slate-400"
                                                        >
                                                            {subtexts[subtextIndex]}
                                                        </motion.span>
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Left: Monafsat Card (الفرص) */}
                        <motion.div 
                            className={`col-span-4 bg-slate-950/80 border rounded-2xl p-6 relative overflow-hidden transition-all duration-300 z-10 flex flex-col justify-between min-h-[260px] ${
                                hoverState === 'monafsat' ? 'border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.15)] scale-[1.02]' : 'border-slate-900/80 hover:border-cyan-500/30'
                            }`}
                            onMouseEnter={() => setHoverState('monafsat')}
                            onMouseLeave={() => setHoverState('none')}
                            whileHover={{ y: -4 }}
                        >
                            {/* Card badge header */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                    <Target className="w-5 h-5" />
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black">الفرص والمشاريع</span>
                            </div>

                            {/* Focus Word */}
                            <div>
                                <h4 className="text-2xl font-black text-white mb-2">الفرص</h4>
                                <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-4">
                                    فريق منافسات يرصد المشاريع والفرص الجديدة فور طرحها ويصل بكم إلى أفضل الصفقات المتاحة في السوق.
                                </p>
                            </div>

                            {/* Live activity simulator feed */}
                            <div className="h-10 flex items-center justify-center bg-slate-900/40 border border-slate-900/90 rounded-lg px-3 py-1.5 text-[9.5px] overflow-hidden text-center w-full">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={monafsatLogIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full text-slate-300 font-bold"
                                    >
                                        {monafsatLogs[monafsatLogIndex]}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </motion.div>

                    </div>

                    {/* MOBILE VIEW (Simplified vertical stack) */}
                    <div className="block lg:hidden space-y-6">
                        
                        {/* 1. Ninja Card */}
                        <div className="bg-slate-950 border border-slate-900 p-6 rounded-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black">النينجا: الوصول والمبيعات</span>
                            </div>
                            <h4 className="text-xl font-black text-white mb-1">الوصول</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                يفتح الوصول ويحرك المحادثات مع صناع القرار.
                            </p>
                        </div>

                        {/* Flow Arrow Down 1 */}
                        <div className="flex flex-col items-center justify-center py-2 relative h-10 w-full">
                            <div className="w-0.5 h-full border-l border-dashed border-slate-800" />
                            <motion.div
                                className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                                animate={{ y: [-15, 15] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        {/* 2. Unified Core Node */}
                        <div className="flex justify-center">
                            <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center p-4 relative">
                                <div className="absolute inset-2 border border-dashed border-cyan-500/15 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                                
                                <span className="text-[8.5px] font-black text-slate-500 mb-0.5">محرك النمو المشترك</span>
                                <span className="text-xl font-black text-white mb-1">النمو</span>
                                <span className="text-[10px] font-black text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text">نمو مضاعف للفرص</span>
                                <div className="h-4 mt-0.5">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={subtextIndex}
                                            initial={{ opacity: 0, y: 3 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -3 }}
                                            className="text-[8.5px] font-bold text-slate-400 block"
                                        >
                                            {subtexts[subtextIndex]}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Flow Arrow Down 2 */}
                        <div className="flex flex-col items-center justify-center py-2 relative h-10 w-full">
                            <div className="w-0.5 h-full border-l border-dashed border-slate-800" />
                            <motion.div
                                className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                                animate={{ y: [-15, 15] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        {/* 3. Monafsat Card */}
                        <div className="bg-slate-950 border border-slate-900 p-6 rounded-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                    <Target className="w-5 h-5" />
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black">منافسات: الفرص والمشاريع</span>
                            </div>
                            <h4 className="text-xl font-black text-white mb-1">الفرص</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                يرصد المشاريع والفرص الجديدة ويصل بكم إلى أفضل الصفقات بالسوق.
                            </p>
                        </div>

                    </div>

                </div>

                {/* 3. High-impact Outcome Box */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-16 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-emerald-500/[0.03] to-cyan-500/[0.03] border border-emerald-500/15 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.015] blur-2xl rounded-full" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/[0.015] blur-2xl rounded-full" />
                    
                    <div className="flex gap-4 items-start relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="block text-[11px] font-black text-emerald-400 mb-1.5">النتيجة الاستراتيجية للمزيج:</span>
                            <p className="text-sm md:text-base text-white font-black leading-relaxed">
                                النتيجة: فرص أكثر، وصول أسرع، واحتمالية أعلى لنمو المبيعات والإغلاق داخل السوق السعودي.
                            </p>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};
