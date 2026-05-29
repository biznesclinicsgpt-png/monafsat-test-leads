import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, ArrowLeft, ArrowRight, Zap, RefreshCw, XCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const BeforeAfterToggle = () => {
    const [isAfter, setIsAfter] = useState<boolean>(true);
    const shouldReduceMotion = useReducedMotion();

    const beforeState = {
        title: "قبل نظام النينجا (الأسلوب التقليدي اليدوي)",
        description: "عمليات بطيئة، غير دقيقة، وتعتمد بالكامل على الجهد البشري المجهد الذي لا يمكن مضاعفته بسهولة.",
        badgeColor: "bg-red-500/10 border-red-500/20 text-red-400",
        icon: <ShieldAlert className="w-6 h-6 text-red-400" />,
        points: [
            { title: "تنقيب يدوي بطيء ومحدود", desc: "البحث عن ١٠-١٥ جهة فقط يومياً عبر محركات البحث التقليدية." },
            { title: "بيانات قديمة وغير دقيقة", desc: "نسب هدر وتواصل خاطئ تصل إلى ٣٠٪ بسبب أرقام وهواتف غير محدثة." },
            { title: "رسائل باردة وعشوائية (سبام)", desc: "إرسال نفس الصيغة للجميع مما يؤدي لنسب استجابة متدنية جداً (أقل من ٢٪)." },
            { title: "نسيان المتابعات وإهمال العملاء", desc: "ضياع أكثر من ٧٠٪ من الفرص لعدم قدرة موظفي المبيعات على المتابعة الدورية بانتظام." },
            { title: "تكلفة تشغيلية مرتفعة وهدر مالي", desc: "رواتب ومصاريف عالية مقابل عدد صفقات منخفض ومسار مبيعات طويل وغير متوقع." }
        ]
    };

    const afterState = {
        title: "مع لوحة قيادة النينجا الذكية (المستقبل المؤتمت)",
        description: "٢٥ وكيلاً يعملون بانسجام 24/7 لأتمتة وتدقيق كل تفصيلة في نمو مبيعاتكم بكفاءة تامة.",
        badgeColor: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        icon: <ShieldCheck className="w-6 h-6 text-emerald-400 animate-pulse" />,
        points: [
            { title: "مسح فوري وشامل لآلاف الشركات", desc: "تغطية كامل السوق المستهدف يومياً وتصفية الفرص الحقيقية خلال دقائق." },
            { title: "بيانات مدققة ونشطة بالكامل", desc: "نسبة دقة ووصول فعلي تتخطى ٩٥٪ مع أتمتة تنظيف وتدقيق البيانات الحية." },
            { title: "تواصل دافئ ومخصص بنسبة ١٠٠٪", desc: "صياغة ميزات شركتكم وتفصيل الرسائل لتلائم احتياج متخذ القرار بدقة متناهية." },
            { title: "متابعة ذكية ومنتظمة ومثابرة", desc: "أتمتة المتابعة عبر عدة قنوات لحين تحديد موعد وحجزه بالتقويم تلقائياً دون نسيان." },
            { title: "عائد استثمار متضاعف ومبيعات حتمية", desc: "تقليص تكلفة الوصول لأصحاب القرار بنسبة ٧٠٪ مع تحويل الفرص لاجتماعات مستمرة." }
        ]
    };

    const activeState = isAfter ? afterState : beforeState;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 mb-20 select-none">
            <div className="bg-slate-950/40 border border-slate-900/60 p-6 md:p-8 rounded-3xl backdrop-blur-sm relative overflow-hidden">
                
                {/* Toggle Control Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-900/80 pb-6 mb-8">
                    <div className="text-right">
                        <h3 className="text-lg md:text-xl font-black text-white">مقارنة تفاعلية حية</h3>
                        <p className="text-[11px] text-slate-500 font-medium">اختر الحالة لترى الفارق الفعلي في أداء شركتك</p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center bg-slate-950 border border-slate-900 p-1.5 rounded-2xl">
                        <button
                            onClick={() => setIsAfter(false)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2",
                                !isAfter 
                                    ? "bg-red-950/40 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]" 
                                    : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <XCircle className="w-4 h-4" />
                            الأسلوب التقليدي
                        </button>
                        <button
                            onClick={() => setIsAfter(true)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2",
                                isAfter 
                                    ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]" 
                                    : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <CheckCircle className="w-4 h-4" />
                            نظام النينجا الذكي
                        </button>
                    </div>
                </div>

                {/* Displaying State with AnimatePresence */}
                <div className="min-h-[300px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isAfter ? 'after' : 'before'}
                            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                        >
                            {/* Visual Indicator Column */}
                            <div className="lg:col-span-4 space-y-4 text-right">
                                <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold", activeState.badgeColor)}>
                                    {activeState.icon}
                                    <span>{isAfter ? "أتمتة ونمو متسارع" : "تحديات المبيعات التقليدية"}</span>
                                </div>
                                <h4 className="text-xl font-black text-white leading-snug">
                                    {activeState.title}
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                    {activeState.description}
                                </p>

                                {/* Decorative mini status widget */}
                                <div className={cn(
                                    "p-4 rounded-2xl border",
                                    isAfter 
                                        ? "bg-emerald-950/10 border-emerald-500/10" 
                                        : "bg-red-950/10 border-red-500/10"
                                )}>
                                    <div className="flex justify-between items-center text-xs font-bold">
                                        <span className={isAfter ? "text-emerald-400" : "text-red-400"}>
                                            {isAfter ? "أداء ممتاز 24/7" : "أداء محدود ومهدر"}
                                        </span>
                                        <span className="text-slate-500">حالة الكفاءة</span>
                                    </div>
                                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2.5">
                                        <motion.div 
                                            className={isAfter ? "bg-emerald-500" : "bg-red-500"} 
                                            initial={{ width: 0 }}
                                            animate={{ width: isAfter ? "98%" : "25%" }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            style={{ height: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Point-by-Point Comparison List */}
                            <div className="lg:col-span-8 space-y-3.5">
                                {activeState.points.map((point, idx) => (
                                    <div 
                                        key={idx} 
                                        className={cn(
                                            "p-4.5 rounded-2xl border text-right transition-colors duration-300 flex items-start gap-4",
                                            isAfter 
                                                ? "bg-slate-950/60 border-slate-900/80 hover:border-emerald-500/20" 
                                                : "bg-slate-950/60 border-slate-900/80 hover:border-red-500/20"
                                        )}
                                    >
                                        {/* Status Marker Icon */}
                                        <div className={cn(
                                            "w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5",
                                            isAfter 
                                                ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-400" 
                                                : "bg-red-950/20 border-red-500/20 text-red-400"
                                        )}>
                                            {isAfter ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                        </div>

                                        <div>
                                            <h5 className="text-xs font-bold text-white mb-1">
                                                {point.title}
                                            </h5>
                                            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                                {point.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};
