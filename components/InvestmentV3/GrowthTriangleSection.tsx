import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowOrb } from './GlowOrb';
import { 
    Users, 
    Bot, 
    Activity, 
    Target, 
    Briefcase, 
    TrendingUp, 
    ShieldCheck, 
    Eye, 
    Sparkles, 
    RefreshCw,
    BrainCircuit,
    Zap,
    Check,
    ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const GrowthTriangleSection = () => {
    const [activeNode, setActiveNode] = useState<string | null>(null);

    const journeySteps = [
        {
            title: "رصد الاحتياج والفرص",
            desc: "رصد المشاريع والفرص المناسبة بالسوق السعودي.",
            icon: <Eye className="w-4 h-4 text-cyan-400" />
        },
        {
            title: "تجهيز وتدريب فريقكم",
            desc: "تطوير الأداء ورفع كفاءة مبيعاتكم فوراً.",
            icon: <Users className="w-4 h-4 text-violet-400" />
        },
        {
            title: "الوصول وتحريك الاهتمام",
            desc: "فتح المحادثات وبدء التواصل الفعال مع المستهدفين.",
            icon: <Target className="w-4 h-4 text-cyan-400" />
        },
        {
            title: "التنفيذ والإغلاق",
            desc: "تقديم العروض، التفاوض، وحسم التعاقد بنجاح.",
            icon: <Briefcase className="w-4 h-4 text-blue-400" />
        },
        {
            title: "التحسين المستمر والنمو",
            desc: "مراجعة النتائج لضمان تكرار النجاحات بيقين.",
            icon: <RefreshCw className="w-4 h-4 text-emerald-400" />
        }
    ];

    const outcomes = [
        {
            title: "وصول أسرع للسوق السعودي",
            desc: "استهداف مباشر وسريع لصناع القرار وتجاوز عقبات الدخول.",
            icon: <Zap className="w-4 h-4" />
        },
        {
            title: "فريق مبيعات أقوى وأكثر مهارة",
            desc: "تمكين فريقكم بأدلة عمل ومنهجيات تفاوضية احترافية.",
            icon: <Users className="w-4 h-4" />
        },
        {
            title: "صفقات أعلى جودة وأقرب للحسم",
            desc: "رصد دقيق للاحتياجات وتلبية متطلبات السوق الفعلية.",
            icon: <TrendingUp className="w-4 h-4" />
        },
        {
            title: "زيادة نسب التحويل والإيرادات",
            desc: "إدارة ذكية ومتابعة منظمة تمنع ضياع الفرص المتاحة.",
            icon: <Activity className="w-4 h-4" />
        },
        {
            title: "ميزة تنافسية مستدامة وصعبة",
            desc: "منظومة نمو متكاملة يصعب على المنافسين محاكاتها.",
            icon: <ShieldCheck className="w-4 h-4" />
        }
    ];

    return (
        <div className="py-28 bg-[#050505] relative overflow-hidden" id="ninja-growth-triangle">
            {/* Background Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-cyan-500/5 blur-[130px] rounded-full" />
                <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-violet-500/5 blur-[130px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/[0.015] blur-[150px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white mb-6 backdrop-blur-sm">
                            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                            <span className="font-semibold text-xs text-slate-300">محرك الإيرادات الحقيقي</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                            مثلث النمو والمبيعات المتكامل
                        </h2>
                        <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
                            لا نعتمد على الوصول للسوق فقط… بل نبني معكم منظومة متكاملة تجمع بين <span className="text-violet-400 font-bold">تطوير فريقكم البيعي</span>، <span className="text-cyan-400 font-bold">تشغيل السوق وتحريك الفرص</span>، و <span className="text-emerald-400 font-bold">نظام النينجا الذكي</span>.
                        </p>
                        <div className="inline-block bg-emerald-500/10 border border-emerald-500/25 px-5 py-2.5 rounded-2xl text-base font-extrabold text-emerald-400">
                            النتيجة: فريق أقوى + فرص أكثر + متابعة أذكى + إغلاق أعلى.
                        </div>
                    </motion.div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Left Column (col-span-3): هدفنا معك & كيف نعمل معاً */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        {/* هدفنا معك */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-950/40 border border-slate-900/60 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-colors"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] blur-2xl rounded-full" />
                            <div className="flex items-center gap-2.5 mb-3 text-emerald-400">
                                <Sparkles className="w-4 h-4" />
                                <h3 className="text-sm font-bold text-white">هدفنا معك</h3>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                تمكين فريقكم وتطويره لزيادة تحويل الفرص ومضاعفة المبيعات الفعلية.
                            </p>
                        </motion.div>

                        {/* كيف نعمل معاً؟ */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-950/40 border border-slate-900/60 p-5 rounded-2xl relative overflow-hidden flex-1"
                        >
                            <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-cyan-400" />
                                كيف نعمل معاً؟
                            </h3>
                            
                            <div className="relative pr-6">
                                {/* Vertical connector line */}
                                <div className="absolute right-[11px] top-4 bottom-4 w-px border-r border-dashed border-slate-800/80" />
                                
                                {/* Steps */}
                                <div className="space-y-6 relative">
                                    {journeySteps.map((step, idx) => (
                                        <div key={idx} className="flex gap-3.5 items-start relative group">
                                            {/* Icon / Marker */}
                                            <div className="absolute right-[-23px] top-0.5 w-6 h-6 rounded-full bg-slate-950 border border-slate-800/80 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:border-cyan-500/40 group-hover:text-cyan-400 transition-colors z-10">
                                                {step.icon}
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                                                    {step.title}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                                                    {step.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Middle Column (col-span-6): Interactive Triangle Layout */}
                    <div className="lg:col-span-6 flex items-center justify-center relative min-h-[480px] lg:min-h-0">
                        
                        {/* DESKTOP INTERACTIVE TRIANGLE VISUAL */}
                        <div className="relative w-full aspect-[600/520] max-w-[600px] mx-auto hidden lg:block select-none font-sans">
                            
                            {/* SVG Connecting Glow Lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="violet-cyan-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
                                    </linearGradient>
                                    <linearGradient id="cyan-blue-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
                                    </linearGradient>
                                    <linearGradient id="blue-violet-grad" x1="100%" y1="100%" x2="0%" y2="0%">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
                                    </linearGradient>
                                    
                                    <linearGradient id="emerald-violet-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
                                    </linearGradient>
                                    <linearGradient id="emerald-cyan-grad" x1="100%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
                                    </linearGradient>
                                    <linearGradient id="emerald-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
                                    </linearGradient>
                                    
                                    <filter id="glow-violet" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="5" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                    <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="5" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                    <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="5" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                    <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="6" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>

                                {/* Base static subtle triangle */}
                                <path d="M 50 14 L 26 74 L 74 74 Z" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1.5" fill="none" />
                                <path d="M 50 52 L 50 14" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" fill="none" />
                                <path d="M 50 52 L 26 74" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" fill="none" />
                                <path d="M 50 52 L 74 74" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" fill="none" />

                                {/* Interactive Glowing Outer Lines */}
                                {/* Top to Left */}
                                <motion.path
                                    d="M 50 14 L 26 74"
                                    stroke="url(#violet-cyan-grad)"
                                    strokeWidth={activeNode === 'coaching' || activeNode === 'access' ? "3" : "1.5"}
                                    fill="none"
                                    animate={activeNode === 'coaching' || activeNode === 'access' ? { strokeDashoffset: -50 } : { strokeDashoffset: 0 }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                    style={{ 
                                        strokeDasharray: activeNode === 'coaching' || activeNode === 'access' ? "6 8" : "none",
                                        filter: activeNode === 'coaching' || activeNode === 'access' ? 'url(#glow-cyan)' : 'none',
                                        opacity: activeNode === null || activeNode === 'coaching' || activeNode === 'access' ? 1 : 0.2
                                    }}
                                />
                                {/* Left to Right */}
                                <motion.path
                                    d="M 26 74 L 74 74"
                                    stroke="url(#cyan-blue-grad)"
                                    strokeWidth={activeNode === 'access' || activeNode === 'sales' ? "3" : "1.5"}
                                    fill="none"
                                    animate={activeNode === 'access' || activeNode === 'sales' ? { strokeDashoffset: -50 } : { strokeDashoffset: 0 }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                    style={{ 
                                        strokeDasharray: activeNode === 'access' || activeNode === 'sales' ? "6 8" : "none",
                                        filter: activeNode === 'access' || activeNode === 'sales' ? 'url(#glow-blue)' : 'none',
                                        opacity: activeNode === null || activeNode === 'access' || activeNode === 'sales' ? 1 : 0.2
                                    }}
                                />
                                {/* Right to Top */}
                                <motion.path
                                    d="M 74 74 L 50 14"
                                    stroke="url(#blue-violet-grad)"
                                    strokeWidth={activeNode === 'sales' || activeNode === 'coaching' ? "3" : "1.5"}
                                    fill="none"
                                    animate={activeNode === 'sales' || activeNode === 'coaching' ? { strokeDashoffset: -50 } : { strokeDashoffset: 0 }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                    style={{ 
                                        strokeDasharray: activeNode === 'sales' || activeNode === 'coaching' ? "6 8" : "none",
                                        filter: activeNode === 'sales' || activeNode === 'coaching' ? 'url(#glow-violet)' : 'none',
                                        opacity: activeNode === null || activeNode === 'sales' || activeNode === 'coaching' ? 1 : 0.2
                                    }}
                                />

                                {/* Inner Spokes connecting to center */}
                                <motion.path
                                    d="M 50 52 L 50 14"
                                    stroke="url(#emerald-violet-grad)"
                                    strokeWidth={activeNode === 'ninja' || activeNode === 'coaching' ? "2.5" : "1"}
                                    fill="none"
                                    style={{ 
                                        filter: activeNode === 'ninja' || activeNode === 'coaching' ? 'url(#glow-emerald)' : 'none',
                                        opacity: activeNode === null || activeNode === 'ninja' || activeNode === 'coaching' ? 1 : 0.15
                                    }}
                                />
                                <motion.path
                                    d="M 50 52 L 26 74"
                                    stroke="url(#emerald-cyan-grad)"
                                    strokeWidth={activeNode === 'ninja' || activeNode === 'access' ? "2.5" : "1"}
                                    fill="none"
                                    style={{ 
                                        filter: activeNode === 'ninja' || activeNode === 'access' ? 'url(#glow-emerald)' : 'none',
                                        opacity: activeNode === null || activeNode === 'ninja' || activeNode === 'access' ? 1 : 0.15
                                    }}
                                />
                                <motion.path
                                    d="M 50 52 L 74 74"
                                    stroke="url(#emerald-blue-grad)"
                                    strokeWidth={activeNode === 'ninja' || activeNode === 'sales' ? "2.5" : "1"}
                                    fill="none"
                                    style={{ 
                                        filter: activeNode === 'ninja' || activeNode === 'sales' ? 'url(#glow-emerald)' : 'none',
                                        opacity: activeNode === null || activeNode === 'ninja' || activeNode === 'sales' ? 1 : 0.15
                                    }}
                                />

                                {/* Moving Data Particles from Center AI to other nodes */}
                                {activeNode === 'ninja' && (
                                    <>
                                        {/* To Top */}
                                        <motion.circle cx={50} cy={52} r={1.5} fill="#10b981" animate={{ cy: [52, 14], opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0 }} />
                                        <motion.circle cx={50} cy={52} r={1.5} fill="#10b981" animate={{ cy: [52, 14], opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }} />
                                        
                                        {/* To Left */}
                                        <motion.circle cx={50} cy={52} r={1.5} fill="#10b981" animate={{ cx: [50, 26], cy: [52, 74], opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
                                        <motion.circle cx={50} cy={52} r={1.5} fill="#10b981" animate={{ cx: [50, 26], cy: [52, 74], opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.9 }} />

                                        {/* To Right */}
                                        <motion.circle cx={50} cy={52} r={1.5} fill="#10b981" animate={{ cx: [50, 74], cy: [52, 74], opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
                                        <motion.circle cx={50} cy={52} r={1.5} fill="#10b981" animate={{ cx: [50, 74], cy: [52, 74], opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 1.1 }} />
                                    </>
                                )}
                            </svg>

                            {/* NODES (HTML Absolutely Positioned elements matching SVG percentages) */}

                            {/* Node 1: Top (الفريق الاستشاري والقيادي) */}
                            <motion.div 
                                className="absolute top-[14%] left-[50%] z-20 text-center"
                                style={{ x: "-50%", y: "-50%" }}
                                onMouseEnter={() => setActiveNode('coaching')}
                                onMouseLeave={() => setActiveNode(null)}
                                animate={{ y: activeNode === 'coaching' ? "-56%" : ["-50%", "-55%", "-50%"] }}
                                transition={{ 
                                    y: activeNode === 'coaching' 
                                        ? { duration: 0.2 } 
                                        : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 } 
                                }}
                            >
                                <div className="absolute -top-10 left-1/2 whitespace-nowrap text-center" style={{ transform: 'translateX(-50%)' }}>
                                    <span className="block text-xs font-bold text-violet-400">الفريق الاستشاري والقيادي</span>
                                </div>
                                <div className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center border bg-[#090710]/95 cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.1)]",
                                    activeNode === 'coaching' 
                                        ? "border-violet-500 shadow-[0_0_25px_rgba(139,92,246,0.35)] scale-105" 
                                        : "border-violet-500/30 hover:border-violet-500/70"
                                )}>
                                    <Users className="w-6 h-6 text-violet-400" />
                                </div>
                            </motion.div>

                            {/* Node 2: Left (فريق منافسات) */}
                            <motion.div 
                                className="absolute top-[74%] left-[26%] z-20"
                                style={{ x: "-50%", y: "-50%" }}
                                onMouseEnter={() => setActiveNode('access')}
                                onMouseLeave={() => setActiveNode(null)}
                                animate={{ y: activeNode === 'access' ? "-56%" : ["-50%", "-55%", "-50%"] }}
                                transition={{ 
                                    y: activeNode === 'access' 
                                        ? { duration: 0.2 } 
                                        : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 } 
                                }}
                            >
                                <div className="absolute -top-10 right-6 whitespace-nowrap text-right">
                                    <span className="block text-xs font-bold text-cyan-400">فريق منافسات</span>
                                </div>
                                <div className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center border bg-[#060a0c]/95 cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.1)]",
                                    activeNode === 'access' 
                                        ? "border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.35)] scale-105" 
                                        : "border-cyan-500/30 hover:border-cyan-500/70"
                                )}>
                                    <Target className="w-6 h-6 text-cyan-400" />
                                </div>
                            </motion.div>

                            {/* Node 3: Right (فريقكم البيعي) */}
                            <motion.div 
                                className="absolute top-[74%] left-[74%] z-20"
                                style={{ x: "-50%", y: "-50%" }}
                                onMouseEnter={() => setActiveNode('sales')}
                                onMouseLeave={() => setActiveNode(null)}
                                animate={{ y: activeNode === 'sales' ? "-56%" : ["-50%", "-55%", "-50%"] }}
                                transition={{ 
                                    y: activeNode === 'sales' 
                                        ? { duration: 0.2 } 
                                        : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2.4 } 
                                }}
                            >
                                <div className="absolute -top-10 left-6 whitespace-nowrap text-left">
                                    <span className="block text-xs font-bold text-blue-400">فريقكم البيعي</span>
                                </div>
                                <div className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center border bg-[#050810]/95 cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.1)]",
                                    activeNode === 'sales' 
                                        ? "border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.35)] scale-105" 
                                        : "border-blue-500/30 hover:border-blue-500/70"
                                )}>
                                    <Briefcase className="w-6 h-6 text-blue-400" />
                                </div>
                            </motion.div>

                            {/* Node 4: Center Core (نظام النينجا الذكي) */}
                            <motion.div 
                                className="absolute top-[52%] left-[50%] z-30"
                                style={{ x: "-50%", y: "-50%" }}
                                onMouseEnter={() => setActiveNode('ninja')}
                                onMouseLeave={() => setActiveNode(null)}
                                animate={{ 
                                    y: activeNode === 'ninja' ? "-54%" : ["-50%", "-53%", "-50%"],
                                    scale: activeNode === 'ninja' ? 1.05 : [1, 1.02, 1]
                                }}
                                transition={{ 
                                    duration: 5, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                            >
                                {/* Pulsing Central GlowOrb */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60 z-0">
                                    <GlowOrb color="emerald" size="sm" />
                                </div>
                                <div className={cn(
                                    "w-20 h-20 rounded-full flex items-center justify-center border bg-[#060a08]/95 cursor-pointer transition-all duration-500 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative z-10",
                                    activeNode === 'ninja' 
                                        ? "border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.45)]" 
                                        : "border-emerald-500/35 hover:border-emerald-400/70"
                                )}>
                                    {/* Pulse effect rings */}
                                    <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-pulse pointer-events-none" />
                                    <BrainCircuit className={cn(
                                        "w-8 h-8 transition-colors duration-300",
                                        activeNode === 'ninja' ? "text-emerald-400" : "text-emerald-500"
                                    )} />
                                </div>
                                <div className="absolute -bottom-10 left-1/2 whitespace-nowrap text-center z-10" style={{ transform: 'translateX(-50%)' }}>
                                    <span className="block text-[11px] font-extrabold text-emerald-400">نظام النينجا الذكي</span>
                                </div>
                            </motion.div>

                            {/* FLOATING DETAIL CARDS (SHOWN ONLY ON HOVER FOR EXTREME MINIMALISM) */}

                            {/* Coaching details checklist */}
                            <AnimatePresence>
                                {activeNode === 'coaching' && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-[8%] left-[60%] w-[25%] max-w-[200px] p-3.5 rounded-xl bg-slate-950/95 border border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.25)] backdrop-blur-md z-50 text-right cursor-default"
                                        onMouseEnter={() => setActiveNode('coaching')}
                                        onMouseLeave={() => setActiveNode(null)}
                                    >
                                        <h4 className="text-[10px] font-bold text-white mb-2 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-violet-400" />
                                            تطوير وقيادة المبيعات
                                        </h4>
                                        <ul className="space-y-1.5 text-[9px] leading-tight">
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-violet-400 shrink-0 mt-0.5" />
                                                <span>تدريب وتطوير فريقكم البيعي</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-violet-400 shrink-0 mt-0.5" />
                                                <span>بناء آليات المتابعة وتجاوز العقبات</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-violet-400 shrink-0 mt-0.5" />
                                                <span>متابعة وتقييم مستمر للأداء</span>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Access details checklist */}
                            <AnimatePresence>
                                {activeNode === 'access' && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-[72%] left-[0%] w-[24%] max-w-[170px] p-3.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md z-50 text-right cursor-default"
                                        onMouseEnter={() => setActiveNode('access')}
                                        onMouseLeave={() => setActiveNode(null)}
                                    >
                                        <h4 className="text-[10px] font-bold text-white mb-2 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-cyan-400" />
                                            محرك الوصول للسوق
                                        </h4>
                                        <ul className="space-y-1.5 text-[9px] leading-tight">
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-cyan-400 shrink-0 mt-0.5" />
                                                <span>الوصول المباشر لصناع القرار</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-cyan-400 shrink-0 mt-0.5" />
                                                <span>رصد الفرص والمشاريع الجديدة</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-cyan-400 shrink-0 mt-0.5" />
                                                <span>تشغيل حملات الوصول المستمر</span>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Sales details checklist */}
                            <AnimatePresence>
                                {activeNode === 'sales' && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-[72%] left-[76%] w-[24%] max-w-[170px] p-3.5 rounded-xl bg-slate-950/95 border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.25)] backdrop-blur-md z-50 text-right cursor-default"
                                        onMouseEnter={() => setActiveNode('sales')}
                                        onMouseLeave={() => setActiveNode(null)}
                                    >
                                        <h4 className="text-[10px] font-bold text-white mb-2 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-blue-400" />
                                            فريق المبيعات الداخلي
                                        </h4>
                                        <ul className="space-y-1.5 text-[9px] leading-tight">
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-blue-400 shrink-0 mt-0.5" />
                                                <span>إدارة الاجتماعات وتقديم العروض</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-blue-400 shrink-0 mt-0.5" />
                                                <span>التفاوض وإتمام صفقات الإغلاق</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-blue-400 shrink-0 mt-0.5" />
                                                <span>تحويل الفرص المتاحة لإيرادات</span>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Central Ninja interactive detailed hover popover */}
                            <AnimatePresence>
                                {activeNode === 'ninja' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                        className="absolute top-[34%] left-[18%] w-[35%] max-w-[210px] p-3 rounded-xl bg-slate-950/95 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)] backdrop-blur-md z-50 text-right cursor-default"
                                        onMouseEnter={() => setActiveNode('ninja')}
                                        onMouseLeave={() => setActiveNode(null)}
                                    >
                                        <h4 className="text-[10px] font-bold text-emerald-400 mb-2 flex items-center gap-1.5 justify-start">
                                            <Bot className="w-3.5 h-3.5" />
                                            نظام النينجا الذكي
                                        </h4>
                                        <ul className="space-y-1.5 text-[8.5px] text-slate-300 leading-tight">
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0 mt-0.5" />
                                                <span>إثراء البيانات والبحث الذكي للفرص</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0 mt-0.5" />
                                                <span>أتمتة المحادثات ورصد الاهتمام</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0 mt-0.5" />
                                                <span>إدارة علاقات العملاء وسير الفرص</span>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Goal pill at bottom of triangle */}
                            <div className="absolute bottom-[2%] left-0 w-full text-center">
                                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold shadow-md backdrop-blur-sm">
                                    <Users className="w-4 h-4 text-emerald-400" />
                                    <span>ثلاثة أضلاع... هدف واحد: نموك ونجاحك في السوق السعودي</span>
                                </div>
                            </div>
                        </div>

                        {/* MOBILE ONLY LAYOUT (STACKED LIST OF NODE FORCES) */}
                        <div className="lg:hidden w-full space-y-6 z-10 px-2 select-none font-sans">
                            <div className="text-center py-2">
                                <span className="text-xs font-bold text-slate-500">أضلاع المنظومة الأربعة</span>
                            </div>

                            {/* 1. نظام النينجا الذكي */}
                            <div className="bg-[#060a08]/90 border border-emerald-500/25 p-5 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25">
                                    <BrainCircuit className="w-4 h-4 text-emerald-400" />
                                </div>
                                <h3 className="text-sm font-bold text-emerald-400 mb-1">نظام النينجا الذكي</h3>
                                <p className="text-[10px] text-slate-400 mb-4 font-medium">الذكاء الاصطناعي والأتمتة - القلب الذكي للمنظومة</p>
                                <ul className="grid grid-cols-1 gap-2 text-xs text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span>إثراء البيانات والبحث الذكي للفرص</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span>أتمتة المحادثات الأولية وتصنيف العملاء</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span>إدارة علاقات العملاء وسير الفرص</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Arrow */}
                            <div className="flex justify-center text-slate-800 -my-2">
                                <ChevronDown className="w-5 h-5" />
                            </div>

                            {/* 2. فريق منافسات */}
                            <div className="bg-[#060a0c]/90 border border-cyan-500/25 p-5 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/25">
                                    <Target className="w-4 h-4 text-cyan-400" />
                                </div>
                                <h3 className="text-sm font-bold text-cyan-400 mb-1">فريق منافسات</h3>
                                <p className="text-[10px] text-slate-400 mb-4 font-medium">الوصول وتحريك السوق والفرص</p>
                                <ul className="grid grid-cols-1 gap-2 text-xs text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                        <span>الوصول المباشر لصناع القرار</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                        <span>رصد الفرص والمشاريع الجديدة</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                        <span>تشغيل حملات الوصول المستمر</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Arrow */}
                            <div className="flex justify-center text-slate-800 -my-2">
                                <ChevronDown className="w-5 h-5" />
                            </div>

                            {/* 3. الفريق الاستشاري والقيادي */}
                            <div className="bg-[#090710]/90 border border-violet-500/25 p-5 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/25">
                                    <Users className="w-4 h-4 text-violet-400" />
                                </div>
                                <h3 className="text-sm font-bold text-violet-400 mb-1">الفريق الاستشاري والقيادي</h3>
                                <p className="text-[10px] text-slate-400 mb-4 font-medium">تطوير وقيادة المبيعات</p>
                                <ul className="grid grid-cols-1 gap-2 text-xs text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                                        <span>تدريب وتطوير فريقكم البيعي</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                                        <span>بناء آليات المتابعة وتجاوز العقبات</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                                        <span>متابعة وتقييم مستمر للأداء</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Arrow */}
                            <div className="flex justify-center text-slate-800 -my-2">
                                <ChevronDown className="w-5 h-5" />
                            </div>

                            {/* 4. فريقكم البيعي */}
                            <div className="bg-[#050810]/90 border border-blue-500/25 p-5 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/25">
                                    <Briefcase className="w-4 h-4 text-blue-400" />
                                </div>
                                <h3 className="text-sm font-bold text-blue-400 mb-1">فريقكم البيعي</h3>
                                <p className="text-[10px] text-slate-400 mb-4 font-medium">التنفيذ والإغلاق وإتمام التعاقد</p>
                                <ul className="grid grid-cols-1 gap-2 text-xs text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                        <span>إدارة الاجتماعات وتقديم العروض</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                        <span>التفاوض وإتمام صفقات الإغلاق</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                        <span>تحويل الفرص المتاحة لإيرادات فعلية</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="text-center pt-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-semibold shadow-md">
                                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>هدف واحد: نموك ونجاحك في السوق السعودي</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (col-span-3): النتيجة النهائية */}
                    <div className="lg:col-span-3">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-slate-950/40 border border-slate-900/60 p-5 rounded-2xl relative overflow-hidden h-full flex flex-col justify-start"
                        >
                            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/[0.03] blur-2xl rounded-full" />
                            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-400" />
                                النتيجة النهائية للمنظومة
                            </h3>
                            
                            <div className="space-y-5">
                                {outcomes.map((item, idx) => (
                                    <div key={idx} className="flex gap-3.5 items-start group">
                                        <div className="w-7 h-7 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-blue-400 group-hover:border-blue-500/50 group-hover:bg-blue-950/20 transition-all shrink-0 mt-0.5">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-200 group-hover:text-blue-300 transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                </div>

                {/* Closing Line Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mt-20 max-w-4xl mx-auto text-center"
                >
                    <div className="relative p-6 md:p-8 rounded-3xl bg-slate-950/30 border border-slate-900/80 overflow-hidden animate-pulse-slow">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.015] via-transparent to-violet-500/[0.015]" />
                        <h3 className="text-lg md:text-xl font-extrabold text-slate-200 leading-relaxed max-w-3xl mx-auto">
                            "لا نوفر لكم فرصًا فقط… بل نساعدكم على بناء فريق مبيعات أقوى قادر على تحويل الفرص إلى نمو حقيقي ومستدام."
                        </h3>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
