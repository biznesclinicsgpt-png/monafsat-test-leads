import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, AlertCircle, Rocket } from 'lucide-react';

export const GuaranteeSection = () => {
    return (
        <section className="py-32 bg-[#0a0a0f] relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* The Guarantee Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[3rem] p-10 border border-emerald-500/30 shadow-[0_0_50px_-20px_rgba(16,185,129,0.2)] mb-20 text-center relative overflow-hidden group"
                    >

                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-yellow-400 to-emerald-500"></div>

                        {/* Animated Shield */}
                        <div className="inline-block p-6 rounded-full bg-emerald-900/40 text-emerald-400 mb-8 relative">
                            <ShieldCheck size={48} className="relative z-10" />
                            <div className="absolute inset-0 bg-emerald-500/20 blur-xl animate-pulse rounded-full"></div>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-white mb-8">
                            التزامنا بالنتائج <span className="text-emerald-500 block text-lg font-bold mt-2 font-mono">(Realistic Guarantee)</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 md:pr-10 border-b border-slate-700 pb-10">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col items-center p-4 rounded-2xl bg-slate-950/50 border border-slate-800"
                            >
                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-600 mb-2">10-15</div>
                                <div className="text-slate-300 font-bold">فرص مؤهلة <br />(Opportunities) شهرياً</div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col items-center p-4 rounded-2xl bg-slate-950/50 border border-slate-800"
                            >
                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600 mb-2">30-45</div>
                                <div className="text-slate-300 font-bold">فرصة مؤهلة <br />خلال الربع سنوي</div>
                            </motion.div>
                        </div>

                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 text-right backdrop-blur-md">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <AlertCircle className="text-yellow-500" />
                                ماذا لو لم نصل إلى 30 فرصة؟
                            </h3>
                            <p className="text-slate-300 mb-2 leading-relaxed">
                                الضمان هو استمرار الوقود التشغيلي مع المحرك وفريق العمل من <span className="text-white font-bold underline decoration-emerald-500 decoration-2">30-90 يوم مجاناً</span> لحين الوصول إلى النتائج المتفق عليها، وقد يمتد لأكثر من ذلك.
                            </p>
                            <p className="text-slate-500 text-sm">
                                ✅ شهر كامل مجانًا يشمل: رصيد تشغيلي على حسابنا + فريق التنفيذ + المحرك كامل.
                            </p>
                        </div>
                    </motion.div>

                    {/* How We Measure ROI */}
                    <div className="text-center mb-20">
                        <h3 className="text-2xl font-bold text-white mb-10">كيف نقيس العائد على الاستثمار؟</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {['عدد الفرص المؤهلة', 'تكلفة الفرصة (CPO)', 'سرعة أول فرصة', 'نسب التحويل'].map((metric, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5, borderColor: '#10b981' }}
                                    className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700 text-slate-300 hover:text-white hover:shadow-lg transition-all"
                                >
                                    <TrendingUp className="mx-auto mb-3 text-cyan-400" size={24} />
                                    <span className="font-bold">{metric}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="text-center relative">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] -z-10 rounded-full"></div>
                        <h2 className="text-4xl font-black text-white mb-8 leading-tight">
                            جاهز لتجربة المحرك؟
                        </h2>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 40px -10px rgba(16, 185, 129, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-12 py-6 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-2xl rounded-full shadow-2xl transition-all flex items-center gap-4 mx-auto overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                            <Rocket size={28} className="group-hover:-translate-y-1 transition-transform" />
                            <span className="relative">حدد أسرع قناة لقطاعك</span>
                        </motion.button>
                        <p className="text-slate-400 mt-6 text-sm max-w-md mx-auto">
                            نبدأ بتحليل مجاني + خطة تشغيل مخصصة قبل أن تدفع ريالاً واحداً.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
