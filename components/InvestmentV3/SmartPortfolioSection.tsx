import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Zap } from 'lucide-react';
import CountUp from 'react-countup';
import { cn } from '../../lib/utils';

export const SmartPortfolioSection = () => {
    const [isQuarterly, setIsQuarterly] = useState(false);

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

    return (
        <div className="py-32 bg-[#050505] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
                            <Zap className="w-5 h-5" />
                            <span className="font-semibold text-sm">مسار بديل</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight max-w-4xl mx-auto">
                            تفضل نموذجًا أبسط؟ اختر محفظة الاجتماعات المؤهلة
                        </h2>
                        <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                            <span className="text-emerald-400 font-bold">الباقات =</span> منظومة تشغيل ونمو متكاملة لشركتك | <span className="text-cyan-400 font-bold">محفظة الاجتماعات =</span> شراء اجتماعات وفرص مؤهلة فقط بدون تشغيل المنظومة.
                        </p>

                        {/* Billing Toggle */}
                        <div className="inline-flex bg-white/5 rounded-full p-1.5 shadow-sm border border-white/10 backdrop-blur-sm">
                            <button
                                onClick={() => setIsQuarterly(false)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                                    !isQuarterly ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'text-slate-400 hover:text-white'
                                )}
                            >
                                شهري
                            </button>
                            <button
                                onClick={() => setIsQuarterly(true)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2",
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
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <AnimatePresence mode="wait">
                        {packages.map((pkg, idx) => (
                            <motion.div
                                key={`${pkg.name}-${isQuarterly}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className={cn(
                                    "relative bg-white/5 rounded-3xl p-8 border backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 group overflow-hidden",
                                    pkg.recommended ? 'border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.2)] z-20' : 'border-white/10 z-10',
                                    isQuarterly && pkg.recommended && 'shadow-[0_0_40px_rgba(16,185,129,0.2)] border-emerald-500'
                                )}
                            >
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

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

                                    <button className={cn(
                                        "w-full mt-8 py-4 rounded-xl font-bold text-sm transition-all duration-300",
                                        pkg.recommended || isQuarterly 
                                            ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                                            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                                    )}>
                                        {pkg.recommended || isQuarterly ? 'ابدأ النمو الآن' : 'اختر الباقة'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
