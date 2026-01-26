import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Rocket, MousePointer2 } from 'lucide-react';
import { useInvestmentTheme } from '../../context/InvestmentThemeContext';

export const EngineHero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const { isDark } = useInvestmentTheme();

    return (
        <div className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0a0a0f]' : 'bg-gradient-to-b from-gray-50 to-white'
            }`}>
            {/* --- Ambient Background Effects --- */}

            {/* Aurora Borealis Gradient 1 */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full blur-[120px] pointer-events-none ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-400/10'
                    }`}
            />

            {/* Aurora Gradient 2 */}
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, 50, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute bottom-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full blur-[100px] pointer-events-none ${isDark ? 'bg-cyan-600/20' : 'bg-cyan-400/10'
                    }`}
            />

            {/* Grid Overlay */}
            <div className={`absolute inset-0 bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none ${isDark
                    ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]'
                    : 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]'
                }`}></div>

            <div className="container mx-auto px-4 relative z-10 text-center">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md mb-8 group cursor-default transition-colors ${isDark
                            ? 'border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] hover:bg-emerald-500/10'
                            : 'border-emerald-500/30 bg-emerald-50 shadow-lg hover:bg-emerald-100'
                        }`}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className={`text-xs font-mono tracking-widest uppercase ${isDark ? 'text-emerald-400' : 'text-emerald-600'
                            }`}>Outbound Revenue Engine v2.0</span>
                    </div>
                </motion.div>

                {/* Main Headline */}
                <div className="relative mb-8">
                    <motion.h1
                        style={{ y: y1 }}
                        className={`text-6xl md:text-8xl font-black leading-[1.1] tracking-tight relative z-20 ${isDark ? 'text-white' : 'text-slate-900'
                            }`}
                    >
                        <motion.span
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="block"
                        >
                            The Future of
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-gradient-x pb-4"
                        >
                            Deal Flow
                        </motion.span>
                    </motion.h1>

                    {/* Decorative Elements around Text */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className={`absolute -top-10 -right-10 rotate-12 hidden md:block ${isDark ? 'text-slate-700/20' : 'text-slate-300/30'
                            }`}
                    >
                        <Rocket size={120} strokeWidth={1} />
                    </motion.div>
                </div>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className={`text-xl md:text-2xl font-light mb-12 max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                >
                    استثمر في <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>نظام متكامل</span> يحول البيانات الخام إلى
                    <span className={`px-2 py-0.5 mx-1 rounded border ${isDark
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>فرص حقيقية</span>
                    باستخدام وكلاء الذكاء الاصطناعي.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => document.getElementById('qualified-opportunities')?.scrollIntoView({ behavior: 'smooth' })}
                        className={`group relative px-12 py-5 text-lg font-black rounded-2xl transition-all overflow-hidden ${isDark
                                ? 'bg-white text-black shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_-20px_rgba(255,255,255,0.5)]'
                                : 'bg-slate-900 text-white shadow-xl hover:shadow-2xl'
                            }`}
                    >
                        <div className={`absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ${isDark
                                ? 'bg-gradient-to-r from-transparent via-slate-200/50 to-transparent'
                                : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'
                            }`} />
                        <span className="relative flex items-center gap-2">
                            الفرص المؤهلة <Zap size={20} className={isDark ? 'fill-black' : 'fill-white'} />
                        </span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => document.getElementById('strategic-partnership')?.scrollIntoView({ behavior: 'smooth' })}
                        className={`group px-8 py-5 rounded-2xl border font-bold transition-all flex items-center gap-3 backdrop-blur-sm ${isDark
                                ? 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/30 text-white'
                                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-100 text-slate-900'
                            }`}
                    >
                        <Rocket size={20} />
                        الشراكة الاستراتيجية
                    </motion.button>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 2, duration: 2, repeat: Infinity }}
                    className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 ${isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}
                >
                    <span className="text-[10px] uppercase tracking-widest">Scroll to Explore</span>
                    <MousePointer2 size={16} />
                </motion.div>
            </div>
        </div>
    );
};
