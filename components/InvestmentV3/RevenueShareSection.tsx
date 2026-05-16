import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Users, Presentation, Handshake, Coins, ChevronDown, CheckCircle2, Workflow } from 'lucide-react';
import { cn } from '../../lib/utils';

export const RevenueShareSection = () => {
    const [hoveredTier, setHoveredTier] = useState<number | null>(null);

    const pipelineSteps = [
        { label: "فرصة", icon: Target },
        { label: "اهتمام", icon: CheckCircle2 },
        { label: "اجتماع", icon: Users },
        { label: "عرض", icon: Presentation },
        { label: "تفاوض", icon: Workflow },
        { label: "إغلاق", icon: Handshake },
    ];

    const revenueTiers = [
        {
            range: "١,٠٠٠ — ٤,٩٩٩ ريال",
            percent: "٢٠٪",
            scale: 1.2,
            details: "تشغيل أعلى + متابعة مكثفة + مشاريع صغيرة الحجم تتطلب جهداً متكرراً",
            glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
            color: "text-red-400",
            border: "border-red-500/30"
        },
        {
            range: "٥,٠٠٠ — ٩,٩٩٩ ريال",
            percent: "١٥٪",
            scale: 1.1,
            details: "تحريك مستمر + تواصل مكثف لضمان تحويل الفرص المتوسطة",
            glow: "shadow-[0_0_20px_rgba(249,115,22,0.3)]",
            color: "text-orange-400",
            border: "border-orange-500/30"
        },
        {
            range: "١٠,٠٠٠ — ٥٠,٠٠٠ ريال",
            percent: "١٠٪",
            scale: 1.0,
            details: "مشاركة متوازنة + دعم تفاوض للمشاريع ذات القيمة الجيدة",
            glow: "shadow-[0_0_20px_rgba(234,179,8,0.3)]",
            color: "text-yellow-400",
            border: "border-yellow-500/30"
        },
        {
            range: "٥٠,٠٠٠ — ٢٥٠,٠٠٠ ريال",
            percent: "٧٪",
            scale: 0.9,
            details: "شراكة نوعية + تركيز على دورات البيع الأطول والعقود الدسمة",
            glow: "shadow-[0_0_20px_rgba(52,211,153,0.3)]",
            color: "text-emerald-400",
            border: "border-emerald-500/30"
        },
        {
            range: "٢٥٠,٠٠٠ — ١,٠٠٠,٠٠٠ ريال",
            percent: "٥٪",
            scale: 0.8,
            details: "شراكة استراتيجية عليا + إدارة فرص كبرى + علاقات بمستوى عالٍ",
            glow: "shadow-[0_0_20px_rgba(56,189,248,0.3)]",
            color: "text-sky-400",
            border: "border-sky-500/30"
        },
        {
            range: "أكثر من ذلك",
            percent: "نسب خاصة",
            scale: 0.7,
            details: "تحالف استراتيجي ومشاريع بنية تحتية أو حكومية طويلة الأمد",
            glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
            color: "text-purple-400",
            border: "border-purple-500/30"
        }
    ];

    return (
        <div className="py-32 bg-[#0A0A0A] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-yellow-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
                        <Coins className="w-5 h-5" />
                        <span className="font-semibold text-sm">نموذج مشاركة النجاح</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        لسنا جهة تبيع اشتراكًا فقط...
                    </h2>
                    
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                        بل نشارككم: <span className="text-emerald-400 font-bold">الوصول</span>، <span className="text-emerald-400 font-bold">المتابعة</span>، <span className="text-emerald-400 font-bold">تحريك الفرص</span>، <span className="text-emerald-400 font-bold">دعم الاجتماعات</span>، <span className="text-emerald-400 font-bold">تحسين احتمالية الإغلاق</span> وتسريع الوصول للمشاريع المناسبة.
                    </p>
                    
                    <div className="inline-block bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <p className="text-2xl text-white font-medium">
                            لذلك، جزء من نجاحنا مرتبط <span className="text-yellow-400 font-bold border-b-2 border-yellow-500/50 pb-1">بنتائجكم الفعلية</span> داخل السوق.
                        </p>
                    </div>
                </motion.div>

                {/* Pipeline to Revenue Animation */}
                <div className="mb-32 relative">
                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 relative z-10">
                        {pipelineSteps.map((step, i) => (
                            <React.Fragment key={i}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.15, duration: 0.5 }}
                                    className="flex flex-col items-center gap-3"
                                >
                                    <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                                        <step.icon className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-300">{step.label}</span>
                                </motion.div>
                                
                                {i < pipelineSteps.length - 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, width: 0 }}
                                        whileInView={{ opacity: 1, width: 40 }}
                                        transition={{ delay: (i * 0.15) + 0.1, duration: 0.3 }}
                                        className="h-0.5 bg-slate-700 hidden md:block"
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="mt-12 text-center"
                    >
                        <ChevronDown className="w-8 h-8 text-yellow-500 mx-auto animate-bounce mb-4" />
                        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                            مشاركة الإيرادات
                        </div>
                        <div className="text-sm text-slate-400 mt-2">كجزء صغير من نجاح أكبر</div>
                    </motion.div>
                </div>

                {/* Dynamic Percentages Table / Cards */}
                <div className="max-w-4xl mx-auto text-right">
                    <h3 className="text-3xl font-bold text-white mb-4 text-center">ويتم تطبيق نسب متدرجة حسب حجم الأعمال</h3>
                    <p className="text-slate-400 text-center mb-12">
                        كلما زادت قيمة الأعمال... قلت النسبة وزادت الشراكة الاستراتيجية
                    </p>

                    <div className="space-y-4 relative">
                        {/* Connecting vertical line */}
                        <div className="absolute right-8 top-8 bottom-8 w-px bg-white/10 hidden md:block" />

                        {revenueTiers.map((tier, idx) => {
                            const isHovered = hoveredTier === idx;
                            return (
                                <motion.div
                                    key={idx}
                                    onHoverStart={() => setHoveredTier(idx)}
                                    onHoverEnd={() => setHoveredTier(null)}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    className="relative"
                                >
                                    <div className={cn(
                                        "relative z-10 flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl border bg-[#0A0A0A]/80 backdrop-blur-md transition-all duration-300 overflow-hidden group cursor-default",
                                        isHovered ? tier.border : "border-white/5 hover:border-white/20",
                                        isHovered ? "bg-white/5" : ""
                                    )}>
                                        {/* Background Glow on Hover */}
                                        <div className={cn(
                                            "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                                            tier.color.replace('text-', 'bg-')
                                        )} />

                                        {/* Value Range */}
                                        <div className="flex-1 text-right order-2 md:order-1 mb-4 md:mb-0">
                                            <div className="text-2xl md:text-3xl font-bold text-white mb-1" dir="rtl">
                                                {tier.range}
                                            </div>
                                            <AnimatePresence>
                                                {isHovered && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="text-sm text-slate-300 mt-2"
                                                    >
                                                        {tier.details}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Percentage with Dynamic Scale */}
                                        <div className="w-32 flex justify-center order-1 md:order-2 shrink-0 mb-4 md:mb-0">
                                            <motion.div 
                                                animate={{ scale: isHovered ? tier.scale * 1.1 : tier.scale }}
                                                className={cn(
                                                    "font-black text-5xl md:text-6xl transition-colors duration-300 text-center",
                                                    isHovered ? tier.color : "text-slate-500"
                                                )}
                                            >
                                                {tier.percent}
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Final Psychological Statement */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-32 max-w-3xl mx-auto"
                >
                    <div className="p-[1px] rounded-3xl bg-gradient-to-b from-white/20 to-transparent">
                        <div className="bg-[#050505] rounded-[23px] p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                            
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
                                نحن لا نربح من التوقيع فقط...
                            </h3>
                            
                            <div className="flex flex-wrap justify-center gap-4 mb-10">
                                {["استمرار الفرص", "نجاح الوصول", "تحريك المشاريع", "تحقيق نتائج فعلية"].map((item, i) => (
                                    <span key={i} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold">
                                        {item}
                                    </span>
                                ))}
                            </div>

                            <button className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                اكتشف كيف يمكننا بناء تدفق فرص حقيقي لنشاطكم
                            </button>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};
