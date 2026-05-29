import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowDown, ChevronRight, ChevronLeft, Sparkles, Brain, Cpu, Mail, Phone, Calendar, ArrowLeftRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface Step {
    id: number;
    title: string;
    shortDesc: string;
    details: string;
    icon: React.ReactNode;
    category: 'data' | 'access';
}

export const AgentsStoryFlow = () => {
    const shouldReduceMotion = useReducedMotion();
    const [selectedStep, setSelectedStep] = useState<number>(0);

    const steps: Step[] = [
        { id: 1, title: "فهم النشاط", shortDesc: "استيعاب ميزتكم التنافسية وهويتكم", details: "يقوم الوكيل بتحليل موقعكم وعروضكم وبنائكم التعاقدي وصياغة الميزات التنافسية كقيمة واضحة.", icon: <Brain className="w-4 h-5" />, category: 'data' },
        { id: 2, title: "تحليل السوق", shortDesc: "تحديد القطاعات الأكثر طلباً لخدماتكم", details: "رصد حجم السوق الحالي بالقطاعات المستهدفة وتوجيه التركيز نحو القطاع الأكثر ربحية واحتياجاً.", icon: <Sparkles className="w-4 h-5" />, category: 'data' },
        { id: 3, title: "تقييم الفرص", shortDesc: "فرز الصفقات وتحديد ملاءمتها الفنية", details: "تصفية المشاريع المطروحة والمناقصات لفرز الأعلى ملاءمة وتوافقاً مع معايير شركتكم.", icon: <Cpu className="w-4 h-5" />, category: 'data' },
        { id: 4, title: "جلب البيانات", shortDesc: "جمع بيانات الجهات المستهدفة آلياً", details: "استخراج وتجميع بيانات وتفاصيل العملاء المستهدفين من بين أكثر من 8 مليون جهة بالسعودية.", icon: <Brain className="w-4 h-5" />, category: 'data' },
        { id: 5, title: "تنظيف وتدقيق", shortDesc: "التحقق من صحة وسائل الاتصال", details: "التأكد من أن البريد الإلكتروني وأرقام الهواتف نشطة وصحيحة لتجنب أي هدر في التواصل.", icon: <Cpu className="w-4 h-5" />, category: 'data' },
        { id: 6, title: "صنّاع القرار", shortDesc: "كشف متخذ القرار والمدراء المسؤولين", details: "استخلاص المناصب التنفيذية وأسماء صناع القرار المباشرين لضمان عدم إضاعة الوقت مع الهواة.", icon: <Brain className="w-4 h-5" />, category: 'access' },
        { id: 7, title: "اختيار القناة", shortDesc: "تحديد أفضل وسيلة تواصل للعميل", details: "الربط عبر القناة الأنسب لكل صانع قرار، سواء كان يفضل واتساب، بريد إلكتروني، أو لينكدإن.", icon: <Mail className="w-4 h-5" />, category: 'access' },
        { id: 8, title: "احتمالية الرد", shortDesc: "تقييم استعداد العميل التاريخي للتفاعل", details: "تحليل سلوك العميل التاريخي وتوقع احتمالية تفاعله لترتيب أولويات التواصل بذكاء وكفاءة.", icon: <Cpu className="w-4 h-5" />, category: 'access' },
        { id: 9, title: "تخصيص الرسالة", shortDesc: "صياغة رسالة افتتاحية مخصصة للجهة", details: "تخصيص كامل للرسالة الأولى لتبدو دافئة واحترافية وتتطابق مع احتياج الشركة والقطاع بدقة.", icon: <Mail className="w-4 h-5" />, category: 'access' },
        { id: 10, title: "بدء التواصل", shortDesc: "إطلاق حملة المحادثات التلقائية الذكية", details: "فتح النقاشات الأولية وعرض القيمة المضافة لشركتكم عبر القنوات المحددة للعملاء بكثافة ودقة.", icon: <Phone className="w-4 h-5" />, category: 'access' },
        { id: 11, title: "متابعة وجدولة", shortDesc: "أتمتة المتابعة وحجز موعد الاجتماع", details: "مواصلة الحديث وحجز اللقاء وجدولته في التقويم تلقائياً بالتنسيق مع العميل دون تدخل يدوي.", icon: <Calendar className="w-4 h-5" />, category: 'access' },
        { id: 12, title: "تأهيل اللقاء", shortDesc: "جمع المتطلبات والملف التعريفي للعميل", details: "استجواب العميل الأولي وتأهيله قبل اللقاء، وتجهيز ملف متكامل لفريق مبيعاتكم لحسم الصفقة.", icon: <Brain className="w-4 h-5" />, category: 'access' },
        { id: 13, title: "تحليل الاجتماع", shortDesc: "كشف الاعتراضات وتخطيط الخطوة التالية", details: "تحليل ما دار بالاجتماع، استخراج التوصيات والمخاوف، وجدولة المتابعات القادمة للإغلاق.", icon: <Cpu className="w-4 h-5" />, category: 'access' }
    ];

    const currentStep = steps[selectedStep];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 mb-24 select-none">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 mb-3">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">رحلة تدفق البيانات المبيعية</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-white mb-4">
                    كيف يتدفق العميل عبر الـ 13 خطوة الأولى؟
                </h3>
                <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto font-medium">
                    من استيعاب شركتكم إلى صياغة الرسالة والمتابعة حتى إغلاق الصفقة، دورة مبيعات متسلسلة بلا ثغرات.
                </p>
            </div>

            {/* Step Selector Horizontal Flow for Desktop */}
            <div className="hidden lg:block relative bg-slate-950/40 border border-slate-900/60 p-6 rounded-3xl backdrop-blur-sm mb-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-cyan-500/[0.005] blur-[80px] rounded-full pointer-events-none" />
                
                {/* Horizontal flow containing the steps with connecting lines */}
                <div className="relative flex items-center justify-between gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar">
                    {steps.map((step, idx) => {
                        const isActive = selectedStep === idx;
                        const isPast = idx < selectedStep;
                        
                        return (
                            <React.Fragment key={step.id}>
                                {/* Step Node */}
                                <button
                                    onClick={() => setSelectedStep(idx)}
                                    className="flex flex-col items-center shrink-0 focus:outline-none group relative"
                                    style={{ width: '6.5%' }}
                                >
                                    <div 
                                        className={cn(
                                            "w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 relative z-20",
                                            isActive 
                                                ? step.category === 'data' 
                                                    ? "bg-violet-950/40 border-violet-500 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                                                    : "bg-cyan-950/40 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                                                : isPast
                                                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400"
                                                    : "bg-slate-950 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-300"
                                        )}
                                    >
                                        <span className="text-[10px] font-bold font-sans">{step.id}</span>
                                    </div>
                                    
                                    <span 
                                        className={cn(
                                            "text-[9px] font-bold mt-2.5 whitespace-nowrap text-center transition-colors duration-300 max-w-[70px] truncate",
                                            isActive 
                                                ? step.category === 'data' 
                                                    ? "text-violet-400"
                                                    : "text-cyan-400"
                                                : "text-slate-400 group-hover:text-slate-200"
                                        )}
                                    >
                                        {step.title}
                                    </span>
                                </button>

                                {/* Connector Line (except for the last node) */}
                                {idx < steps.length - 1 && (
                                    <div className="flex-1 min-w-[10px] h-[1px] relative z-10 mx-1 shrink">
                                        <div 
                                            className={cn(
                                                "w-full h-full transition-all duration-500",
                                                isPast 
                                                    ? "bg-emerald-500/50" 
                                                    : "bg-slate-900"
                                            )}
                                        />
                                        {isPast && !shouldReduceMotion && (
                                            <motion.div 
                                                className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-1 rounded-full bg-emerald-400"
                                                animate={{ x: [0, 20, 0], opacity: [0, 1, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            />
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Horizontal Selector with prev/next buttons */}
            <div className="lg:hidden flex items-center justify-between gap-3 bg-slate-950/40 border border-slate-900/60 px-4 py-3.5 rounded-2xl mb-4">
                <button 
                    onClick={() => setSelectedStep(prev => Math.min(steps.length - 1, prev + 1))}
                    disabled={selectedStep === steps.length - 1}
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
                
                <div className="text-center">
                    <span className="text-[9px] font-sans font-bold text-slate-500">الخطوة {currentStep.id} من ١٣</span>
                    <h4 className="text-xs font-bold text-white mt-0.5">{currentStep.title}</h4>
                </div>

                <button 
                    onClick={() => setSelectedStep(prev => Math.max(0, prev - 1))}
                    disabled={selectedStep === 0}
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
            </div>

            {/* Step Detailed Info Card (shared for both layouts with transitions) */}
            <div className="bg-slate-950/60 border border-slate-900/80 p-6 md:p-8 rounded-3xl backdrop-blur-sm relative overflow-hidden min-h-[160px] flex flex-col justify-center">
                {/* Visual Category tag */}
                <div className="absolute top-6 left-6">
                    <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full border",
                        currentStep.category === 'data'
                            ? "bg-violet-950/20 border-violet-500/20 text-violet-400"
                            : "bg-cyan-950/20 border-cyan-500/20 text-cyan-400"
                    )}>
                        {currentStep.category === 'data' ? "أتمتة البيانات والفلترة" : "أتمتة التواصل والوصول"}
                    </span>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedStep}
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -15 }}
                        transition={{ duration: 0.25 }}
                        className="text-right max-w-4xl"
                    >
                        <div className="flex items-center gap-3.5 mb-4">
                            <div className={cn(
                                "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0",
                                currentStep.category === 'data'
                                    ? "bg-violet-950/30 border-violet-500/30 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                                    : "bg-cyan-950/30 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                            )}>
                                {currentStep.icon}
                            </div>
                            <div>
                                <span className="block text-[8px] font-sans font-bold text-slate-500">الوكيل رقم {currentStep.id}</span>
                                <h4 className="text-base md:text-lg font-black text-white">{currentStep.title}</h4>
                            </div>
                        </div>
                        
                        <h5 className="text-xs md:text-sm font-bold text-slate-200 mb-2 leading-relaxed">
                            {currentStep.shortDesc}
                        </h5>
                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                            {currentStep.details}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
