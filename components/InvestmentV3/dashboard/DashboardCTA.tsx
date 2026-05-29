import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, Calculator, Sparkles } from 'lucide-react';

export const DashboardCTA = () => {
    const shouldReduceMotion = useReducedMotion();

    const handleScrollToCalculator = () => {
        const element = document.getElementById('growth-calculator');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 mt-16 select-none">
            <div className="bg-slate-950/40 border border-slate-900/80 p-8 md:p-10 rounded-3xl relative overflow-hidden text-center">
                {/* Visual decoration glows */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.01] via-transparent to-violet-500/[0.01] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/[0.01] blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold">بناء وتجهيز مخصص لشركتك</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                        هل ترغب أن نبني هذه المنظومة الذكية لنشاطكم؟
                    </h3>

                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                        نوفر لكم وكلاء الذكاء الاصطناعي مهيئين ومربوطين بقاعدة بيانات شركتكم لتوليد ومتابعة صفقات مبيعاتكم على مدار الساعة.
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        
                        {/* Primary Button */}
                        <motion.a
                            href="https://wa.me/966500000000" // Placeholder phone number or booking link
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors duration-300 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.2)]"
                            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                        >
                            <Calendar className="w-4 h-4 text-slate-950" />
                            احجز جلسة استكشاف مجانية
                        </motion.a>

                        {/* Secondary Button */}
                        <motion.button
                            onClick={handleScrollToCalculator}
                            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2"
                            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                        >
                            <Calculator className="w-4 h-4 text-slate-400" />
                            احسب فرصك الآن
                        </motion.button>

                    </div>
                </div>
            </div>
        </div>
    );
};
