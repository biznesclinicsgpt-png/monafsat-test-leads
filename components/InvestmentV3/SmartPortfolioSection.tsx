import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Zap } from 'lucide-react';
import CountUp from 'react-countup';
import { cn } from '../../lib/utils';

export const SmartPortfolioSection = () => {
    const [isQuarterly, setIsQuarterly] = useState(false);
    const [hasSalesperson, setHasSalesperson] = useState<boolean | null>(null);

    const packages = [
        {
            name: 'باقة الرصيد القياسي',
            monthlyPrice: 6000,
            quarterlyPrice: 12000,
            quarterlyOriginalPrice: 18000,
            target: 'الشركات الناشئة والصغيرة',
            dealType: 'صفقات صغيرة وسريعة',
            monthlyCredits: '15 فرصة مؤهلة',
            quarterlyCredits: '45 فرصة مؤهلة',
            color: 'blue'
        },
        {
            name: 'باقة الرصيد المميز',
            monthlyPrice: 9000,
            quarterlyPrice: 18000,
            quarterlyOriginalPrice: 27000,
            target: 'الشركات المتوسطة والمستقرة',
            dealType: 'فرص تسعير أفضل وعقود طويلة الأمد.',
            monthlyCredits: '15 فرصة مؤهلة (عالية الجودة)',
            quarterlyCredits: '45 فرصة مؤهلة (عالية الجودة)',
            moneyBackPerLead: 200,
            recommended: true,
            color: 'emerald'
        },
        {
            name: 'باقة الرصيد المؤسسي',
            monthlyPrice: 20000,
            quarterlyPrice: 40000,
            quarterlyOriginalPrice: 60000,
            target: 'المؤسسات الكبرى، الجهات الحكومية، وشبه الحكومية.',
            dealType: 'عقود ضخمة جداً ولكن بدورة بيع طويلة.',
            monthlyCredits: '15 فرصة مؤهلة (مستوى الشركات الكبرى)',
            quarterlyCredits: '45 فرصة مؤهلة (مستوى الشركات الكبرى)',
            moneyBackPerLead: 500,
            color: 'purple'
        },
    ];

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="py-32 bg-[#050505] relative overflow-hidden" id="smart-portfolio">
            {/* Incoming Alternative Path from Pricing (Desktop only) */}
            <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none hidden md:block select-none">
                <svg className="w-full h-full" viewBox="0 0 1000 160" fill="none" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="blue-arrival-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                    {/* Curve from left side (Pricing alternative end at ~250) to the center (500) */}
                    <motion.path
                        d="M 250 0 C 250 80, 500 40, 500 160"
                        stroke="url(#blue-arrival-grad)"
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.8, ease: "easeOut" }}
                    />
                    {/* Particle flow on path */}
                    <motion.circle
                        cx="0" cy="0" r="2" fill="#60a5fa"
                        style={{ filter: "drop-shadow(0 0 4px #60a5fa)" }}
                    >
                        <animateMotion dur="3.5s" repeatCount="indefinite" path="M 250 0 C 250 80, 500 40, 500 160" />
                    </motion.circle>
                </svg>
            </div>

            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative w-full px-6 py-10 md:px-12 md:py-12 rounded-3xl bg-[#090D16]/80 border border-slate-900/80 backdrop-blur-md max-w-4xl mx-auto shadow-2xl z-10"
                    >
                        {/* Inner glass reflection */}
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-3xl pointer-events-none" />
                        
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
                            <Zap className="w-5 h-5" />
                            <span className="font-semibold text-sm">مسار بديل</span>
                        </div>

                        {/* Question section with dynamic button styling */}
                        <div className="text-center py-4">
                            <h3 className="text-xl md:text-2xl font-black text-white mb-6 leading-relaxed">
                                هل لا يوجد لديكم مسؤول مبيعات داخل الفريق نقدر نبني حوله التشغيل؟
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button
                                    onClick={() => setHasSalesperson(false)}
                                    className={cn(
                                        "px-8 py-3.5 rounded-2xl font-black transition-all min-w-[260px] text-base cursor-pointer border",
                                        hasSalesperson === false
                                            ? "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.25)]"
                                            : "bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
                                    )}
                                >
                                    نعم، لا يوجد لدينا مسؤول مبيعات
                                </button>
                                <button
                                    onClick={() => setHasSalesperson(true)}
                                    className={cn(
                                        "px-8 py-3.5 rounded-2xl font-black transition-all min-w-[260px] text-base cursor-pointer border",
                                        hasSalesperson === true
                                            ? "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.25)]"
                                            : "bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
                                    )}
                                >
                                    لا، يوجد لدينا مسؤول مبيعات
                                </button>
                            </div>
                        </div>

                        {/* Selected "No, salesperson exists" -> Show small hint */}
                        {hasSalesperson === true && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-emerald-400 font-black text-base md:text-lg mt-6"
                            >
                                ممتاز، باقات التشغيل الأساسية موضحة بالأعلى.
                            </motion.p>
                        )}

                        {/* Selected "Yes, no salesperson" -> Reveals Alternative Path details */}
                        {hasSalesperson === false && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                className="border-t border-slate-800/80 mt-8 pt-6 overflow-hidden text-right"
                            >
                                <h4 className="text-xl md:text-3xl font-black text-white mb-4">
                                    المسار البديل لمن لا يملك مسؤول مبيعات حاليًا
                                </h4>
                                <p className="text-sm md:text-base text-slate-300 mb-6 leading-relaxed font-bold">
                                    إذا لم يكن لديكم مسؤول مبيعات داخل الفريق حاليًا، يمكننا البدء معكم بمسار بديل أخف، يساعدكم على الوصول إلى فرص مؤهلة وتحريك الاهتمام، إلى أن تصبحوا جاهزين لبناء تشغيل كامل لاحقًا.
                                </p>

                                <div className="grid md:grid-cols-2 gap-4 bg-black/40 border border-white/5 rounded-2xl p-5 mb-6">
                                    <div>
                                        <h5 className="text-xs text-blue-400 font-black mb-2">باقات التشغيل الأساسية:</h5>
                                        <p className="text-xs text-slate-400 leading-relaxed font-bold">
                                            مناسبة إذا لديكم مسؤول مبيعات أو موظف واحد نقدر نبني حوله التشغيل.
                                        </p>
                                    </div>
                                    <div className="border-r border-slate-800/80 pr-4 md:border-r md:pr-4">
                                        <h5 className="text-xs text-emerald-400 font-black mb-2">المسار البديل:</h5>
                                        <p className="text-xs text-slate-400 leading-relaxed font-bold">
                                            مناسب إذا لا يوجد لديكم مسؤول مبيعات حالياً، وتريدون بداية أخف لفتح فرص مؤهلة وتحريك الاهتمام.
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h5 className="text-xs text-blue-400 font-black mb-3">العناصر المختصرة داخل المسار البديل:</h5>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                        {[
                                            'رصد الفرص المناسبة',
                                            'فتح المحادثات الأولية',
                                            'فرز الاهتمام',
                                            'تسليم الفرص الجادة',
                                            'دعم الانتقال للمرحلة التالية'
                                        ].map((item) => (
                                            <div key={item} className="flex items-center gap-2 rounded-xl bg-blue-500/5 border border-blue-500/10 px-3 py-2 justify-center">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                                <span className="text-xs text-slate-300 font-black">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-8 border-t border-slate-800/80 pt-6">
                                    <div className="text-right mb-4 sm:mb-0">
                                        <span className="text-xs text-slate-400 font-black block mb-1">اختر باقة المحفظة بالأسفل أو ابدأ بالمسار البديل مباشرة:</span>
                                        <span className="text-sm text-slate-300 font-bold">يمكنك تحديد رصيد الفرص المناسب لنشاطك</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            scrollToSection('final-cta');
                                            if (window.history.pushState) {
                                                const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?interest=alternative_path&selected_path=meeting_wallet';
                                                window.history.pushState({path:newurl},'',newurl);
                                            }
                                        }}
                                        className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] text-base self-stretch sm:self-auto text-center cursor-pointer"
                                    >
                                        ابدأ بالمسار البديل
                                    </button>
                                </div>

                                {/* Billing Toggle (Shows under revealed contents) */}
                                <div className="flex justify-center mt-8 pt-4 border-t border-slate-800/50">
                                    <div className="inline-flex bg-black/40 rounded-full p-1.5 shadow-inner border border-white/5 backdrop-blur-sm">
                                        <button
                                            onClick={() => setIsQuarterly(false)}
                                            className={cn(
                                                "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer",
                                                !isQuarterly ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'text-slate-400 hover:text-white'
                                            )}
                                        >
                                            شهري
                                        </button>
                                        <button
                                            onClick={() => setIsQuarterly(true)}
                                            className={cn(
                                                "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer",
                                                isQuarterly ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'text-slate-400 hover:text-white'
                                            )}
                                        >
                                            ربع سنوي
                                            <span className={cn(
                                                "text-[10px] px-2 py-0.5 rounded-full",
                                                isQuarterly ? 'bg-blue-500 text-white border border-blue-400' : 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                                            )}>
                                                خصم 33%
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Conditional packages rendering */}
                <AnimatePresence>
                    {hasSalesperson === false && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                                {packages.map((pkg, idx) => (
                                    <div
                                        key={`${pkg.name}-${isQuarterly}`}
                                        className={cn(
                                            "relative bg-[#090D16]/95 rounded-3xl p-8 border backdrop-blur-md transition-all duration-300 hover:-translate-y-2 group overflow-hidden shadow-xl",
                                            pkg.recommended ? 'border-blue-500/80 shadow-[0_0_30px_rgba(37,99,235,0.25)] z-20' : 'border-slate-800/60 z-10',
                                            isQuarterly && pkg.recommended && 'shadow-[0_0_40px_rgba(16,185,129,0.25)] border-emerald-500/80'
                                        )}
                                    >
                                        {/* Glow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                        {pkg.recommended && !isQuarterly && (
                                            <div className="absolute top-0 inset-x-0 bg-blue-600 text-white text-center text-xs font-bold py-1.5 shadow-md">
                                                موصى به للنمو
                                            </div>
                                        )}
                                        {pkg.recommended && isQuarterly && (
                                            <div className="absolute top-0 inset-x-0 bg-emerald-600 text-white text-center text-xs font-bold py-1.5 shadow-md">
                                                الخيار الأفضل استراتيجياً
                                            </div>
                                        )}

                                        <div className="pt-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-full flex items-center justify-center font-black text-xl mx-auto mb-6",
                                                isQuarterly ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                                            )}>
                                                {idx + 1}
                                            </div>

                                            <h4 className="text-2xl font-bold text-center text-white mb-2">
                                                {pkg.name}
                                            </h4>

                                            <div className="text-center mb-8">
                                                {isQuarterly ? (
                                                    <>
                                                        <div className="inline-flex items-center justify-center gap-2 mb-2 w-full">
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">خصم 33%</span>
                                                            <span className="text-slate-500 line-through font-bold text-sm">{pkg.quarterlyOriginalPrice.toLocaleString('en-US')}</span>
                                                        </div>
                                                        <div className="text-4xl font-black text-white mb-1">
                                                            <CountUp end={pkg.quarterlyPrice} duration={1} separator="," /> <span className="text-base text-slate-400 font-medium">ريال</span>
                                                        </div>
                                                        <div className="text-xs text-emerald-400 mt-2">دفعة ربع سنوية (توفر قيمة شهر كامل)</div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="text-4xl font-black text-white mb-1">
                                                            <CountUp end={pkg.monthlyPrice} duration={1} separator="," /> <span className="text-base text-slate-400 font-medium">ريال</span>
                                                        </div>
                                                        <div className="text-xs text-slate-400 mt-2">شهرياً</div>
                                                    </>
                                                )}
                                            </div>

                                            {isQuarterly && (
                                                <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-6 text-center space-y-3">
                                                    <div>
                                                        <div className="text-[10px] font-bold text-slate-400 mb-1">في حال عدم تحقيق الهدف (45 فرصة)</div>
                                                        <div className="text-sm font-bold text-emerald-400">تمديد مجاني (1 - 3 أشهر)</div>
                                                    </div>
                                                    {pkg.moneyBackPerLead && (
                                                        <>
                                                            <div className="h-px bg-white/10 w-full" />
                                                            <div>
                                                                <div className="text-[10px] font-bold text-slate-400 mb-1">ضمان استرداد نقدي</div>
                                                                <div className="text-sm font-bold text-emerald-400">{pkg.moneyBackPerLead} ريال / فرصة غير محققة</div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            <div className="h-px bg-white/10 w-full mb-6" />

                                            <div className="space-y-6 text-center">
                                                <div>
                                                    <div className="text-xs text-blue-400 font-bold mb-2">الفئة المستهدفة</div>
                                                    <div className="text-sm text-slate-300 leading-relaxed">{pkg.target}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-blue-400 font-bold mb-2">طبيعة الصفقات</div>
                                                    <div className="text-sm text-slate-300 leading-relaxed">{pkg.dealType}</div>
                                                </div>
                                            </div>

                                            <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                                                    ⚡
                                                </div>
                                                <div className="text-right flex-1">
                                                    <div className="text-xs text-slate-400 font-bold mb-1">الرصيد المشحون</div>
                                                    <div className="text-sm font-black text-white">
                                                        {isQuarterly ? pkg.quarterlyCredits : pkg.monthlyCredits}
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => {
                                                    scrollToSection('final-cta');
                                                    if (window.history.pushState) {
                                                        const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?interest=alternative_path&selected_path=meeting_wallet&package=${encodeURIComponent(pkg.name)}&billing=${isQuarterly ? 'quarterly' : 'monthly'}`;
                                                        window.history.pushState({path:newurl},'',newurl);
                                                    }
                                                }}
                                                className={cn(
                                                    "w-full mt-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer",
                                                    pkg.recommended || isQuarterly 
                                                        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                                                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                                                )}
                                            >
                                                {pkg.recommended || isQuarterly ? 'ابدأ النمو الآن' : 'اختر الباقة'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
