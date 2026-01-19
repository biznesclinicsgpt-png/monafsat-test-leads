import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle2, ShieldCheck, Zap, Building2, Rocket } from 'lucide-react';

const PACKAGES = [
    {
        name: "باقة الرصيد القياسي",
        nameEn: "(Standard Pack)",
        price: "7,000",
        description: "مناسبة لـ: \"اختبار السوق\" أو الشركات الناشئة جداً",
        target: "الشركات الناشئة والصغيرة (Startups)",
        dealType: "صفقات صغيرة وسريعة",
        channels: "(LinkedIn + Email) فقط",
        credit: "15 فرصة مؤهلة",
        color: "blue",
        bgGradient: "from-blue-500/10 to-transparent",
        borderColor: "border-blue-500/20",
        iconColor: "text-blue-400",
        buttonColor: "bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white",
        features: [
            "تغطية قنوات أساسية",
            "استهداف دقيق للشركات الناشئة",
            "تقارير أداء شهرية"
        ]
    },
    {
        name: "باقة الرصيد المميز",
        nameEn: "(Premium Pack)",
        tag: "الخيار الموصى به",
        price: "9,000",
        description: "مناسبة لـ: الشركات التي تبحث عن \"نمو حقيقي\" وصفقات مربحة.",
        target: "الشركات المتوسطة والمستقرة (Established SMEs & Mid-Market)",
        dealType: "فرص تسعير أفضل (High Ticket) وعقود طويلة الأمد.",
        channels: "شامل أتمتة الواتساب + مسؤول جودة (QMO)",
        credit: "15 فرصة مؤهلة (عالية الجودة)",
        color: "cyan",
        bgGradient: "from-cyan-500/20 to-transparent",
        borderColor: "border-cyan-500/50",
        iconColor: "text-cyan-400",
        buttonColor: "bg-cyan-500 hover:bg-cyan-400 text-black",
        isPopular: true,
        features: [
            "متابعة ما بعد الاجتماع ورفع تقرير بالأسباب",
            "تفعيل قنوات واتساب الرسمية",
            "مدير حساب مخصص"
        ]
    },
    {
        name: "باقة الرصيد المؤسسي",
        nameEn: "(Enterprise Pack)",
        price: "20,000",
        description: "مناسبة لـ: العقود الحكومية والمنافسات الكبرى فقط.",
        target: "المؤسسات الكبرى، الجهات الحكومية، وشبه الحكومية.",
        dealType: "عقود ضخمة جداً ولكن بدورة بيع طويلة.",
        channels: "دعم تنفيذي للدخول في المنافسات والعطاءات.",
        credit: "15 فرصة مؤهلة (Enterprise Level)",
        color: "purple",
        bgGradient: "from-purple-500/10 to-transparent",
        borderColor: "border-purple-500/20",
        iconColor: "text-purple-400",
        buttonColor: "bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white",
        features: [
            "استراتيجية دخول المناقصات",
            "وصول لصناع القرار في الجهات الكبرى",
            "دعم لوجستي وقانوني للصفقات"
        ]
    }
];

export const WalletModel = () => {
    return (
        <section className="py-24 bg-[#0a0a0f] relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-xs font-bold mb-4"
                    >
                        <Wallet size={16} />
                        الخيار الثاني: نموذج المحفظة
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white mb-6"
                    >
                        نموذج المحفظة والفرص المؤهلة <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 font-mono text-3xl block mt-2">(The Wallet Model)</span>
                    </motion.h2>

                    <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                        نظام رصيد مرن: ادفع فقط مقابل الاجتماع المؤكد.
                        الرصيد صالح لمدة سنة كاملة، وفي حال عدم استهلاكه بعد 6 أشهر يحق لكم استرداد الرصيد المتبقي نقداً.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {PACKAGES.map((pkg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative rounded-[32px] border ${pkg.borderColor} bg-slate-900/50 backdrop-blur-sm p-8 flex flex-col group hover:shadow-2xl hover:shadow-${pkg.color}-500/10 transition-all duration-300`}
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-b ${pkg.bgGradient} rounded-[32px] opacity-50`}></div>

                            {/* Popular Badge */}
                            {pkg.isPopular && (
                                <div className="absolute top-0 right-0 left-0 -mt-4 flex justify-center">
                                    <span className="bg-cyan-500 text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-cyan-500/20 flex items-center gap-1">
                                        <ShieldCheck size={12} />
                                        {pkg.tag}
                                    </span>
                                </div>
                            )}

                            {/* Header */}
                            <div className="text-center mb-8 relative z-10">
                                <div className={`w-12 h-12 mx-auto rounded-2xl bg-${pkg.color}-500/10 flex items-center justify-center ${pkg.iconColor} mb-4`}>
                                    <span className="font-mono font-bold text-xl">{idx + 1}</span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-1">{pkg.name}</h3>
                                <div className={`text-sm font-mono ${pkg.iconColor} opacity-70 mb-4`}>{pkg.nameEn}</div>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-black text-white">{pkg.price}</span>
                                    <span className="text-slate-500 font-bold">ريال</span>
                                </div>
                                <div className="text-slate-500 text-xs mt-1">دفعة واحدة / رصيد ممتد</div>
                            </div>

                            {/* Divider */}
                            <div className="h-px w-full bg-slate-800 mb-8 relative z-10"></div>

                            {/* Details */}
                            <div className="space-y-6 flex-1 relative z-10 text-right">
                                <div>
                                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">الفئة المستهدفة</div>
                                    <p className="text-slate-300 text-sm leading-relaxed">{pkg.target}</p>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">طبيعة الصفقات</div>
                                    <p className="text-slate-300 text-sm leading-relaxed">{pkg.dealType}</p>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">القنوات والمميزات</div>
                                    <p className={`text-sm font-bold ${pkg.iconColor}`}>{pkg.channels}</p>
                                </div>

                                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-400 text-xs">الرصيد المشحون</span>
                                        <Zap size={14} className={pkg.iconColor} />
                                    </div>
                                    <div className="text-white font-bold">{pkg.credit}</div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-8 relative z-10">
                                <button className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${pkg.buttonColor}`}>
                                    {pkg.isPopular ? <Rocket size={18} /> : <CheckCircle2 size={18} />}
                                    اشحن المحفظة الآن
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
