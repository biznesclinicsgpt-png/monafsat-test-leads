import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowLeft } from 'lucide-react';

export const InvestmentCTAV2 = () => {
    return (
        <section className="relative py-32 px-6 overflow-hidden" dir="rtl">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-[800px] mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight font-tajawal">
                        جاهز تبدأ <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">رحلة النمو الحقيقي؟</span>
                    </h2>
                    <p className="text-xl text-slate-500 mb-10 max-w-[600px] mx-auto font-tajawal">
                        لا تضيع وقتك في التجربة والخطأ. اختر الشريك الذي يضمن لك النتائج بالأرقام.
                    </p>

                    <motion.a
                        href="#tiers"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative group inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg overflow-hidden shadow-2xl shadow-emerald-500/20"
                    >
                        <span className="relative z-10 flex items-center gap-2 font-tajawal">
                            ابدأ الآن <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </span>

                        {/* Shimmer Effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                            initial={{ x: '100%' }}
                            animate={{ x: '-100%' }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "linear",
                                repeatDelay: 3
                            }}
                        />

                        {/* Pulse Effect */}
                        <div className="absolute inset-0 rounded-2xl ring-4 ring-emerald-500/30 animate-pulse" />
                    </motion.a>

                    <p className="mt-6 text-sm text-slate-400 font-tajawal">
                        ضمان استرداد الأموال لمدة 14 يوم على جميع الباقات
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
