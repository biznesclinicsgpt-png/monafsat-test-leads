import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Play, Rocket, MousePointer2 } from 'lucide-react';

export const EngineHero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
            {/* --- Ambient Background Effects --- */}

            {/* Aurora Borealis Gradient 1 */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"
            />

            {/* Aurora Gradient 2 */}
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, 50, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"
            />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10 text-center">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] mb-8 group cursor-default hover:bg-emerald-500/10 transition-colors">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase">Outbound Revenue Engine v2.0</span>
                    </div>
                </motion.div>

                {/* Main Headline */}
                <div className="relative mb-8">
                    <motion.h1
                        style={{ y: y1 }}
                        className="text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tight relative z-20"
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
                        className="absolute -top-10 -right-10 text-slate-700/20 rotate-12 hidden md:block"
                    >
                        <Rocket size={120} strokeWidth={1} />
                    </motion.div>
                </div>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-xl md:text-2xl text-slate-400 font-light mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                    استثمر في <span className="text-white font-medium">نظام متكامل</span> يحول البيانات الخام إلى
                    <span className="px-2 py-0.5 mx-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">فرص حقيقية</span>
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
                        className="group relative px-12 py-5 bg-white text-black text-lg font-black rounded-2xl shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_-20px_rgba(255,255,255,0.5)] transition-all overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative flex items-center gap-2">
                            ابدأ تشغيل المحرك <Zap size={20} className="fill-black" />
                        </span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group px-8 py-5 rounded-2xl border border-slate-700 hover:border-slate-500 hover:bg-slate-800/30 text-white font-bold transition-all flex items-center gap-3 backdrop-blur-sm"
                    >
                        <Play size={20} className="fill-white" />
                        شاهد كيف يعمل
                    </motion.button>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 2, duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
                >
                    <span className="text-[10px] uppercase tracking-widest">Scroll to Explore</span>
                    <MousePointer2 size={16} />
                </motion.div>
            </div>
        </div>
    );
};
