import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, AlertCircle, Rocket } from 'lucide-react';

export const GuaranteeSection = () => {
    return (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* The Guarantee Card */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] p-10 border border-emerald-500/30 shadow-[0_0_50px_-20px_rgba(16,185,129,0.2)] mb-20 text-center relative overflow-hidden">

                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-yellow-400 to-emerald-500"></div>

                        <div className="inline-block p-4 rounded-full bg-emerald-900/40 text-emerald-400 mb-6">
                            <ShieldCheck size={48} />
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                            التزامنا بالنتائج <span className="text-emerald-500">(Realistic Guarantee)</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-right md:pr-10">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-black text-emerald-400">10</div>
                                <div className="text-slate-300">فرص مؤهلة <br />(Opportunities) شهرياً</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-black text-emerald-400">30</div>
                                <div className="text-slate-300">فرصة مؤهلة <br />خلال الربع سنوي</div>
                            </div>
                        </div>

                        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 text-right">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <AlertCircle className="text-yellow-500" />
                                ماذا لو لم نصل إلى 30 فرصة؟
                            </h3>
                            <p className="text-slate-300 mb-4">
                                ✅ <span className="text-white font-bold">شهر كامل مجانًا</span> يشمل: رصيد تشغيلي على حسابنا + فريق التنفيذ + المحرك كامل.
                            </p>
                            <p className="text-slate-500 text-sm">
                                أنت لا تتحمل أي تكلفة إضافية. ده مش وعد تسويقي، ده التزام تشغيلي.
                            </p>
                        </div>
                    </div>

                    {/* How We Measure ROI */}
                    <div className="text-center mb-16">
                        <h3 className="text-2xl font-bold text-white mb-8">كيف نقيس العائد على الاستثمار؟</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {['عدد الفرص المؤهلة', 'تكلفة الفرصة (CPO)', 'سرعة أول فرصة', 'نسب التحويل'].map((metric, i) => (
                                <div key={i} className="p-4 bg-slate-800 rounded-xl border border-slate-700 text-slate-300">
                                    <TrendingUp className="mx-auto mb-2 text-cyan-400" size={20} />
                                    {metric}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-8">
                            جاهز لتجربة المحرك؟
                        </h2>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-12 py-6 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-2xl rounded-full shadow-2xl shadow-emerald-500/30 flex items-center gap-4 mx-auto"
                        >
                            <Rocket size={24} />
                            حدد أسرع قناة لقطاعك خلال 14 يوم
                        </motion.button>
                        <p className="text-slate-500 mt-4 text-sm max-w-md mx-auto">
                            نبدأ بتحليل مجاني + خطة تشغيل مخصصة قبل أن تدفع ريالاً واحداً.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
