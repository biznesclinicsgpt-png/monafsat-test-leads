import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { GrowthStats } from './GrowthStats';

/* ============================================================
   DATA (Arabic Only)
   ============================================================ */

const DIY_FEATURES = [
    { text: 'أتمتة الواتساب', sub: 'إرسال رسائل آلية عبر واتساب', active: true },
    { text: 'أتمتة لينكد إن', sub: 'رسائل وتفاعل تلقائي', active: true },
    { text: 'أتمتة الإيميل', sub: 'تسلسلات بريدية آلية', active: true },
    { text: 'اشتراك الأدوات', sub: 'وصول كامل للمنصة', active: true },
    { text: 'توفير بيانات', sub: 'غير متوفر في هذه الباقة', active: false },
    { text: 'فريق تنفيذ', sub: 'غير متوفر في هذه الباقة', active: false },
];

const DWY_TOOLS = [
    { text: 'أتمتة شاملة للأدوات', sub: 'واتساب + لينكد إن + إيميل' },
    { text: 'وكلاء الذكاء الاصطناعي', sub: 'أكثر من 14,000 سيناريو جاهز', highlight: true },
    { text: 'بيانات مستهدفة', sub: 'أرقام وإيميلات جاهزة للتواصل' },
    { text: 'ساعات اتصال مكثفة', sub: 'فريقنا ينفذ المكالمات نيابة عنك' },
    { text: 'إدارة حملات متكاملة', sub: 'تنفيذ كامل ومتابعة مستمرة' },
];

const DWY_TEAM = [
    { text: 'بناء النظام المخصص', sub: 'هيكلة كاملة تناسب قطاعك' },
    { text: 'سيناريوهات مخصصة', sub: 'رسائل ذكية لكل مرحلة بيع' },
    { text: 'متابعة الردود', sub: 'فرز الردود ورصد المهتمين' },
    { text: 'تحسين الاستراتيجية', sub: 'تطوير مستمر للأداء' },
];

const PIPELINE_STEPS = [
    { num: 1, title: 'جمع البيانات', sub: 'المصادر', color: 'blue' },
    { num: 2, title: 'تحليل ذكي', sub: 'الإثراء', color: 'blue' },
    { num: 3, title: 'تصنيف دقيق', sub: 'الفلترة', color: 'green' },
    { num: 4, title: 'التحقق', sub: 'ضمان الجودة', color: 'green' },
    { num: 5, title: 'المراسلات', sub: 'الوصول', color: 'purple' },
    { num: 6, title: 'رصد الاهتمام', sub: 'النتائج', color: 'orange' },
];

interface DFYPackage {
    name: string;
    monthlyPrice: number;
    quarterlyPrice: number;
    quarterlyOriginalPrice: number;
    target: string;
    dealType: string;
    monthlyCredits: string;
    quarterlyCredits: string;
    moneyBackPerLead?: number;
    recommended?: boolean;
}

const DFY_PACKAGES: DFYPackage[] = [
    {
        name: 'باقة الرصيد القياسي',
        monthlyPrice: 6000,
        quarterlyPrice: 12000,
        quarterlyOriginalPrice: 18000,
        target: 'الشركات الناشئة والصغيرة (Startups)',
        dealType: 'صفقات صغيرة وسريعة',
        monthlyCredits: '15 فرصة مؤهلة',
        quarterlyCredits: '45 فرصة مؤهلة',
    },
    {
        name: 'باقة الرصيد المميز',
        monthlyPrice: 9000,
        quarterlyPrice: 18000,
        quarterlyOriginalPrice: 27000,
        target: 'الشركات المتوسطة والمستقرة (Established SMEs & Mid-Market)',
        dealType: 'فرص تسعير أفضل (High Ticket) وعقود طويلة الأمد.',
        monthlyCredits: '15 فرصة مؤهلة (عالية الجودة)',
        quarterlyCredits: '45 فرصة مؤهلة (عالية الجودة)',
        moneyBackPerLead: 200,
        recommended: true,
    },
    {
        name: 'باقة الرصيد المؤسسي',
        monthlyPrice: 20000,
        quarterlyPrice: 40000,
        quarterlyOriginalPrice: 60000,
        target: 'المؤسسات الكبرى، الجهات الحكومية، وشبه الحكومية.',
        dealType: 'عقود ضخمة جداً ولكن بدورة بيع طويلة.',
        monthlyCredits: '15 فرصة مؤهلة (Level Enterprise)',
        quarterlyCredits: '45 فرصة مؤهلة (Level Enterprise)',
        moneyBackPerLead: 500,
    },
];

/* ============================================================
   HELPERS & COMPONENTS
   ============================================================ */

const numColor: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-600',
    green: 'bg-emerald-400/10 text-emerald-700',
    purple: 'bg-violet-500/10 text-violet-600',
    orange: 'bg-amber-400/10 text-amber-600',
};

const pkgNumColors = [
    'bg-emerald-50 text-emerald-700',
    'bg-blue-500/10 text-blue-600',
    'bg-violet-500/10 text-violet-600',
];

// CountUp Component
const CountUp = ({ to }: { to: number }) => {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const prevTo = useRef(0);

    useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        const controls = {
            value: prevTo.current
        };

        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            const current = Math.floor(prevTo.current + (to - prevTo.current) * ease);
            node.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                prevTo.current = to;
            }
        };

        requestAnimationFrame(animate);
    }, [to]);

    return <span ref={nodeRef}>{to.toLocaleString()}</span>;
};

// Spotlight Card Component
const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    return (
        <div
            className={`relative group bg-white overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                          650px circle at ${mouseX}px ${mouseY}px,
                          rgba(255, 255, 255, 0.4),
                          transparent 80%
                        )
                    `,
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export const TierSectionV2 = () => {
    const [isQuarterly, setIsQuarterly] = useState(false);

    return (
        <div className="py-24 px-6 max-w-[1280px] mx-auto" dir="rtl" id="tiers">
            {/* --- Section Header --- */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-sm px-5 py-1.5 rounded-full mb-5 font-tajawal">
                    📋 اختر المسار الأنسب
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    ثلاث طرق <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-400">للنمو المتسارع</span>
                </h2>
                <p className="text-lg text-slate-500 max-w-[650px] mx-auto leading-relaxed font-tajawal">
                    صممنا باقات مرنة تناسب حجم فريقك وميزانيتك — ابدأ بنفسك أو دعنا ندير المحرك بالكامل نيابة عنك.
                </p>
            </motion.div>

            {/* --- Growth Stats Section --- */}
            <GrowthStats />

            {/* ========== TIER 1 — DIY (Purple Theme) ========== */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="mb-10"
            >
                <SpotlightCard className="rounded-3xl p-8 md:p-12 bg-purple-50/50 border border-purple-100">
                    <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-200/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10 relative z-10">
                        <div className="flex-1 min-w-[300px]">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 font-black text-xl mb-6">1</div>
                            <h3 className="text-3xl font-black text-slate-900 mb-2 font-tajawal">افعلها بنفسك</h3>
                            <p className="text-base text-slate-500 leading-relaxed max-w-[500px] font-tajawal">
                                تحكم كامل بأدوات الأتمتة. اشتراك شهري يمنحك القوة التقنية لإدارة حملاتك بنفسك.
                                <br /><strong className="text-purple-600">ملاحظة: الباقة لا تشمل توفير البيانات.</strong>
                            </p>
                        </div>
                        <div className="text-center min-w-[200px] px-10 py-8 bg-white rounded-2xl border border-purple-100 shadow-sm">
                            <div className="text-5xl font-black text-slate-900 font-tajawal mb-2">
                                <CountUp to={1000} /> <span className="text-lg text-slate-400 font-medium">ريال</span>
                            </div>
                            <div className="text-sm text-slate-500 font-tajawal">
                                دفع <strong className="text-purple-600">ربع سنوي</strong> (3,000 ريال)
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                        {DIY_FEATURES.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 font-tajawal ${f.active
                                    ? 'bg-white border-purple-100 shadow-sm'
                                    : 'bg-slate-50 border-transparent opacity-60'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs ${f.active ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-400'}`}>
                                    {f.active ? '✓' : '✕'}
                                </div>
                                <div>
                                    <div className={`text-sm font-bold ${f.active ? 'text-slate-900' : 'text-slate-400 line-through'}`}>{f.text}</div>
                                    <div className="text-xs text-slate-400 mt-1">{f.sub}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </SpotlightCard>
            </motion.div>

            {/* ========== TIER 2 — DWY (Emerald Theme) ========== */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-10"
            >
                <SpotlightCard className="rounded-3xl p-8 md:p-12 bg-emerald-50/50 border border-emerald-100">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10 relative z-10">
                        <div className="flex-1 min-w-[300px]">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 font-black text-xl mb-6">2</div>
                            <h3 className="text-3xl font-black text-slate-900 mb-2 font-tajawal">ننفذها معك</h3>
                            <p className="text-base text-slate-500 leading-relaxed max-w-[500px] font-tajawal">
                                شراكة تشغيلية متكاملة. نحن نبني المحرك، ونشغله، ونعمل معك جنباً إلى جنب لتحسين النتائج لحظة بلحظة.
                            </p>
                        </div>
                        <div className="text-center min-w-[200px] px-10 py-8 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                            <div className="text-5xl font-black text-slate-900 font-tajawal mb-2">
                                <CountUp to={6000} /> <span className="text-lg text-slate-400 font-medium">ريال</span>
                            </div>
                            <div className="text-sm text-slate-500 mb-3 font-tajawal">إجمالي شهري</div>
                            <div className="flex items-center justify-center gap-2">
                                <span className="h-1 flex-1 bg-emerald-100 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 1 }} className="h-full bg-emerald-500" />
                                </span>
                                <span className="text-xs text-slate-400 font-mono" dir="ltr">3k + 3k</span>
                                <span className="h-1 flex-1 bg-emerald-100 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-emerald-500" />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 font-tajawal">
                        {/* Tools Part */}
                        <div className="p-6 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 transition-colors shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">🔧</div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900">
                                        <CountUp to={3000} /> <span className="text-sm text-slate-400 font-medium">ريال</span>
                                    </div>
                                    <div className="text-xs text-slate-500">الاشتراكات والتشغيل التقني</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {DWY_TOOLS.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle2 size={16} className="text-emerald-500 mt-1 flex-shrink-0" />
                                        <span className="text-sm text-slate-700 leading-snug">
                                            {item.text}
                                            <span className="block text-xs text-slate-400 mt-0.5">{item.sub}</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Team Part */}
                        <div className="p-6 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 transition-colors shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">🧠</div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900">
                                        <CountUp to={3000} /> <span className="text-sm text-slate-400 font-medium">ريال</span>
                                    </div>
                                    <div className="text-xs text-slate-500">إدارة الفريق والتطوير</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {DWY_TEAM.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle2 size={16} className="text-emerald-500 mt-1 flex-shrink-0" />
                                        <span className="text-sm text-slate-700 leading-snug">
                                            {item.text}
                                            <span className="block text-xs text-slate-400 mt-0.5">{item.sub}</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 relative z-10 font-tajawal">
                        <div className="text-center mb-8">
                            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-200">
                                ⚙️ مراحل العمل الستة
                            </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {PIPELINE_STEPS.map((s, i) => (
                                <motion.div
                                    key={s.num}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="text-center p-5 bg-white rounded-2xl border border-emerald-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className={`w-8 h-8 rounded-lg inline-flex items-center justify-center font-black text-sm mb-3 ${numColor[s.color]}`}>
                                        {s.num}
                                    </div>
                                    <div className="text-sm font-bold text-slate-900 leading-tight mb-1">{s.title}</div>
                                    <div className="text-[10px] text-slate-400">{s.sub}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </SpotlightCard>
            </motion.div>

            {/* ========== TIER 3 — DFY (Blue Theme) ========== */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-10"
            >
                <SpotlightCard className="rounded-3xl p-8 md:p-12 bg-blue-50/50 border border-blue-100">
                    <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                    <div className="flex flex-col items-center text-center mb-10 relative z-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 font-black text-xl mb-6">3</div>
                        <h3 className="text-3xl font-black text-slate-900 mb-2 font-tajawal">ننفذها لك بالكامل</h3>
                        <p className="text-lg text-slate-500 font-tajawal mb-6">
                            نموذج المحفظة الذكية — ادفع فقط مقابل النتائج.
                        </p>

                        {/* Billing Toggle */}
                        <div className="inline-flex bg-white rounded-full p-1.5 shadow-sm border border-blue-100">
                            <button
                                onClick={() => setIsQuarterly(false)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 font-tajawal ${!isQuarterly ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                شهري
                            </button>
                            <button
                                onClick={() => setIsQuarterly(true)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 font-tajawal ${isQuarterly ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                ربع سنوي
                                <span className={`${isQuarterly ? 'bg-blue-500 text-white' : 'bg-amber-100 text-amber-700'} text-[10px] px-2 py-0.5 rounded-full`}>خصم 33%</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 font-tajawal">
                        <AnimatePresence mode="wait">
                            {DFY_PACKAGES.map((pkg, idx) => (
                                <motion.div
                                    key={`${pkg.name}-${isQuarterly}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    className={`relative bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${pkg.recommended ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg' : 'border-blue-100'}`}
                                >
                                    {pkg.recommended && !isQuarterly && (
                                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                            موصى به للنمو
                                        </div>
                                    )}

                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg mx-auto mb-4 ${isQuarterly ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {idx + 1}
                                    </div>

                                    <h4 className="text-xl font-black text-center text-slate-900 mb-2 font-tajawal">
                                        {pkg.name}
                                        {isQuarterly && <span className="block text-xs text-slate-400 font-medium mt-1">(Premium Pack)</span>}
                                    </h4>

                                    <div className="text-center mb-6">
                                        {isQuarterly ? (
                                            <>
                                                <div className="inline-flex items-center gap-2 mb-1">
                                                    <span className="text-sm px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">خصم 33%</span>
                                                    <span className="text-slate-400 line-through font-bold text-sm decorative-strikethrough">{pkg.quarterlyOriginalPrice.toLocaleString()}</span>
                                                </div>
                                                <div className="text-4xl font-black text-slate-900 mb-1">
                                                    <CountUp to={pkg.quarterlyPrice} /> <span className="text-sm text-slate-400 font-medium">ريال</span>
                                                </div>
                                                <div className="text-xs text-slate-400">دفعة ربع سنوية (توفر قيمة شهر كامل)</div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-4xl font-black text-slate-900 mb-1">
                                                    <CountUp to={pkg.monthlyPrice} /> <span className="text-sm text-slate-400 font-medium">ريال</span>
                                                </div>
                                                <div className="text-xs text-slate-400">شهرياً</div>
                                            </>
                                        )}
                                    </div>

                                    {isQuarterly && (
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-center space-y-3">
                                            <div>
                                                <div className="text-[10px] font-bold text-slate-500 mb-1">في حال عدم تحقيق الهدف (45 فرصة)</div>
                                                <div className="text-sm font-black text-emerald-600">تمديد مجاني (1 - 3 أشهر)</div>
                                            </div>

                                            {pkg.moneyBackPerLead && (
                                                <>
                                                    <div className="h-px bg-slate-200 w-full" />
                                                    <div>
                                                        <div className="text-[10px] font-bold text-slate-500 mb-1">ضمان استرداد نقدي</div>
                                                        <div className="text-sm font-black text-emerald-600">{pkg.moneyBackPerLead} ريال / فرصة غير محققة</div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <div className="h-px bg-slate-100 w-full mb-6" />

                                    <div className="space-y-4 text-center font-tajawal">
                                        <div>
                                            <div className="text-xs text-blue-600 font-bold mb-1">الفئة المستهدفة</div>
                                            <div className="text-sm text-slate-600 font-medium">{pkg.target}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-blue-600 font-bold mb-1">طبيعة الصفقات</div>
                                            <div className="text-sm text-slate-600 font-medium">{pkg.dealType}</div>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-3 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold shadow-sm">⚡</div>
                                        <div className="text-right flex-1">
                                            <div className="text-[10px] text-slate-400 font-bold">الرصيد المشحون</div>
                                            <div className="text-sm font-black text-slate-900">
                                                {isQuarterly ? pkg.quarterlyCredits : pkg.monthlyCredits}
                                            </div>
                                        </div>
                                    </div>

                                    <button className={`w-full mt-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${pkg.recommended || isQuarterly ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-900 hover:text-slate-900'}`}>
                                        {pkg.recommended || isQuarterly ? 'ابدأ النمو الآن' : 'اختر الباقة'}
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </SpotlightCard>
            </motion.div>
        </div>
    );
};

