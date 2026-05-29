import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, HelpCircle } from 'lucide-react';

export const WhyAgentsBlock = () => {
    const shouldReduceMotion = useReducedMotion();

    const items = [
        { q: "من نستهدف؟", a: "تحديد الشركات الأعلى قيمة وصنّاع القرار الفعليين." },
        { q: "من نراسل؟", a: "اختيار المسؤول المباشر عن التعاقد وتجاوز الحواجز الإدارية." },
        { q: "متى نراسل؟", a: "إرسال الرسائل في الأوقات والظروف الأكثر ملاءمة للاستجابة." },
        { q: "أي قناة نستخدم؟", a: "تحديد القناة المفضلة لكل عميل (واتساب، بريد إلكتروني، لينكدإن)." },
        { q: "كيف نتابع؟", a: "متابعة ذكية ومنتظمة دون إزعاج للحفاظ على اهتمام العميل." },
        { q: "متى نحول؟", a: "تحويل العميل فوراً للاجتماع عند استكشاف الاهتمام والجدية." },
        { q: "كيف نغلق؟", a: "تقديم العروض والاعتراضات المناسبة لحسم وتوقيع العقد." }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 mb-20">
            <div className="bg-slate-950/40 border border-slate-900/60 p-8 rounded-3xl backdrop-blur-sm relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/[0.01] blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/[0.01] blur-[80px] rounded-full pointer-events-none" />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Text Title Column */}
                    <div className="lg:col-span-4 text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 mb-4">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">لماذا 25 وكيلاً ذكياً بالذات؟</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
                            دورة مبيعات كاملة ومؤتمتة بالكامل
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                            المبيعات ليست مجرد إرسال رسائل؛ بل هي سلسلة قرارات متتالية معقدة. يتولى الوكلاء الـ 25 الإجابة التلقائية والدقيقة على كافة الأسئلة الصعبة في كل مرحلة لضمان الإغلاق.
                        </p>
                    </div>

                    {/* Checkmarks Grid Column */}
                    <motion.div 
                        className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {items.map((item, idx) => (
                            <motion.div
                                key={idx}
                                className="bg-slate-950/60 border border-slate-900/80 p-4 rounded-2xl group hover:border-slate-800 transition-colors duration-300 flex items-start gap-3"
                                variants={itemVariants}
                            >
                                <div className="w-6 h-6 rounded-lg bg-emerald-500/5 border border-emerald-500/15 flex items-center justify-center shrink-0 text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors duration-300">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                                <div className="text-right">
                                    <h4 className="text-xs font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors duration-300">
                                        {item.q}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                        {item.a}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
