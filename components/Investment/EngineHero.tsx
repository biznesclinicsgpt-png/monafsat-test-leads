import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Play, Rocket } from 'lucide-react';

export const EngineHero = () => {
    return (
        <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Background Grid & Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 via-transparent to-transparent opacity-50"></div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-900/20 text-emerald-400 font-mono text-sm mb-6 backdrop-blur-sm"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Outbound Revenue Engine v2.0
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight"
                >
                    استثمر في <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">محرك</span> يسبق المنافسين
                    <br />
                    <span className="text-3xl md:text-5xl text-slate-400 font-bold mt-4 block">
                        ويحوّل البيانات إلى فرص مبيعات حقيقية 🥷🚀
                    </span>
                </motion.h1>

                {/* Sub-headline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-xl text-slate-300 font-light mb-10 max-w-2xl mx-auto"
                >
                    نموذج عادل =
                    <span className="text-emerald-400 font-bold mx-2">رصيد تشغيل</span>
                    +
                    <span className="text-cyan-400 font-bold mx-2">محرك أداء مرتبط بالنتائج</span>
                </motion.p>

                {/* CTA */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-xl rounded-2xl shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
                    <span className="relative flex items-center gap-3">
                        <Rocket className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                        ابدأ تشغيل المحرك الآن
                    </span>
                </motion.button>
            </div>

            {/* Abstract Engine Visual (CSS Shapes/Gradients) */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20 pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/20 blur-[100px] rounded-t-full"></div>
            </div>
        </div>
    );
};
