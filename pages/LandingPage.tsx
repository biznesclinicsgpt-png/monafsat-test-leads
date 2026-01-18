
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import {
    Menu, ScanLine, ArrowLeft, CheckCircle2, AlertTriangle, Phone, Mail,
    MessageSquare, Linkedin, Search, BrainCircuit, FileSearch, FileText,
    BarChart3, Zap, Quote, X, Loader2, Sparkles, CheckCircle, AlertCircle,
    Database, Activity, ZapOff, PhoneCall, GitMerge, Cpu, Network, FileCheck,
    Plus, Minus, ArrowDown, MessageCircle, Lock as LockIcon, MousePointer2
} from 'lucide-react';

const CTA_LINK = "/app/profile?wizard=true";

// --- TYPES ---
type AnalysisStatus = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';
interface AnalysisResult {
    summary: string;
    score: number;
    recommendations: string[];
}

// --- ANIMATION VARIANTS ---
import { type Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};


// --- MOCK AI SERVICE ---
const analyzeTeamHealth = async (input: string): Promise<AnalysisResult> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const randomScore = Math.floor(Math.random() * (85 - 40 + 1)) + 40;
    return {
        summary: "بناءً على المعطيات الأولية، يبدو أن هناك فرصاً كبيرة غير مستغلة في قنوات التواصل الحالية. هناك فجوة في المتابعة (Follow-up Cadence) تسبب تسرب العملاء المحتملين.",
        score: randomScore,
        recommendations: [
            "أتمتة رسائل المتابعة عبر WhatsApp لتقليل الجهد اليدوي.",
            "تحسين نصوص المكالمات (Scripts) للتركيز على القيمة بدلاً من البيع المباشر.",
            "تفعيل نظام CRM لتوحيد بيانات العملاء من جميع القنوات."
        ]
    };
};

// --- COMPONENTS ---

const Navbar = ({ onStartDiagnosis }: { onStartDiagnosis: () => void }) => {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const { scrollY } = useScroll();

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => setScrolled(latest > 20));
        return () => unsubscribe();
    }, [scrollY]);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 py-3' : 'bg-transparent py-5'}`}
        >
            <div className="px-4 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
                    <img src="/logo_full.png" alt="BiznesClinics" className="h-12 w-auto object-contain" />
                    <div className="h-8 w-px bg-slate-200 mx-2"></div>
                    <span className="font-bold text-slate-700 tracking-tight">Ninja Scanner</span>
                </div>

                <div className="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm">
                    {['كيف يعمل؟', 'الميزات', 'قصص النجاح', 'الأسئلة الشائعة'].map((item, i) => (
                        <a key={i} href={`#${item === 'كيف يعمل؟' ? 'how-it-works' : item === 'الميزات' ? 'value-prop' : item === 'قصص النجاح' ? 'testimonials' : 'faq'}`} className="hover:text-brand transition-colors relative group">
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full rounded-full"></span>
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="hidden md:block text-slate-600 font-bold hover:text-brand transition-colors text-sm"
                    >
                        تسجيل الدخول
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStartDiagnosis}
                        className="bg-brand text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-brand/20 hover:shadow-2xl hover:shadow-brand/30 transition-all flex items-center gap-2"
                    >
                        <Sparkles size={16} className="animate-pulse" />
                        ابدا تحليلك مجانا
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    );
};

const Hero = ({ onStartDiagnosis }: { onStartDiagnosis: () => void }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPoint = (clientX - left) / width;
        const yPoint = (clientY - top) / height;
        mouseX.set(xPoint);
        mouseY.set(yPoint);
    }

    const rotateX = useTransform(mouseY, [0, 1], [10, -10]);
    const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);

    return (
        <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-[95vh] flex items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-50 w-full" onMouseMove={handleMouseMove}>

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-brand/10 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-[80px]"
                />
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10 relative w-full">

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="text-right"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white border border-brand/20 rounded-full px-4 py-1.5 shadow-sm text-brand font-bold text-sm mb-6">
                        <Sparkles size={16} className="animate-pulse" />
                        <span>تقنية AI 2026</span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.2] mb-6">
                        كم فرصة <br className="hidden lg:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-500 relative">
                            تفقدها يوميًا؟
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                            </svg>
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-xl text-slate-600 leading-relaxed font-medium mb-10 max-w-2xl ml-auto">
                        اكتشف حجم الهدر في قنوات مبيعاتك (WhatsApp, LinkedIn, Calls) واحصل على خطة تطوير فورية تضاعف نتائجك <span className="font-extrabold text-slate-900 bg-brand/10 px-2 rounded">4X</span>.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-10">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onStartDiagnosis}
                            className="bg-brand hover:bg-brand-dark text-white text-lg px-8 py-5 rounded-2xl font-bold transition-all shadow-[0_10px_30px_-10px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3 w-full sm:w-auto overflow-hidden relative group"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                ابدأ التشخيص المجاني
                                <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-slate-700 hover:text-brand border border-slate-200 hover:border-brand/30 text-lg px-8 py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 w-full sm:w-auto shadow-sm hover:shadow-lg"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                <MousePointer2 size={16} />
                            </div>
                            كيف يعمل؟
                        </motion.button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                        {['تحليل 4 قنوات', 'خطة فورية', 'بدون تسجيل'].map((feat, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/60 shadow-sm">
                                <CheckCircle2 size={16} className="text-brand" />
                                <span>{feat}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* 3D Dashboard Card */}
                <motion.div
                    style={{ perspective: 1000 }}
                    className="relative flex justify-center lg:justify-end"
                >
                    <motion.div
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/50 p-8 w-full max-w-md relative z-10"
                    >
                        {/* Floating Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 z-20 flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <div className="text-xs text-gray-400 font-bold">هدر محتمل</div>
                                <div className="text-lg font-black text-slate-800">70%</div>
                            </div>
                        </motion.div>

                        <div className="flex justify-between items-center mb-8 border-b border-gray-100/50 pb-6">
                            <span className="font-bold text-slate-800 text-lg">تقرير الأداء العام</span>
                            <span className="bg-red-50 text-red-500 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 border border-red-100">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> مباشر
                            </span>
                        </div>

                        <div className="text-center mb-10 relative">
                            <svg className="w-40 h-40 mx-auto transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                                <motion.circle
                                    cx="80" cy="80" r="70"
                                    stroke="#10b981"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray="440"
                                    strokeDashoffset="264" // 40% filled approx
                                    strokeLinecap="round"
                                    initial={{ strokeDashoffset: 440 }}
                                    animate={{ strokeDashoffset: 264 }}
                                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <div className="text-5xl font-black text-slate-800">42</div>
                                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Score</div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {[
                                { n: 'WhatsApp', v: 30, c: 'bg-green-500', i: MessageSquare },
                                { n: 'LinkedIn', v: 55, c: 'bg-blue-500', i: Linkedin },
                                { n: 'Calls', v: 25, c: 'bg-purple-500', i: Phone },
                            ].map((ch, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${ch.c.replace('bg-', 'bg-opacity-10 text-opacity-100 ' + ch.c.replace('500', '600'))} bg-opacity-10`}>
                                        {/* Fallback for simple color classes - utilizing lucid icons directly */}
                                        <ch.i size={18} className={ch.c.replace('bg-', 'text-')} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                                            <span>{ch.n}</span>
                                            <span>{ch.v}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${ch.v}%` }}
                                                transition={{ duration: 1, delay: 0.8 + (idx * 0.2) }}
                                                className={`h-full ${ch.c} shadow-[0_0_10px_currentColor]`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Decorative Blur Behind Card */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-200/40 to-cyan-200/40 rounded-full blur-3xl -z-10 animate-pulse-slow" />
                </motion.div>
            </div>
        </section>
    );
};

const PainSection = () => {
    return (
        <section className="py-24 bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-12 w-full">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {[
                        { icon: Database, color: 'text-red-500', t: "بيانات القنوات غير مستغلة", d: "نسبة الرد أقل من 20%؟ هذا يعني أن الفرص تضيع وتتبخر قبل حتى أن تبدأ في المحاولة." },
                        { icon: Activity, color: 'text-amber-500', t: "عدم وجود Engine واضح", d: "بدون إيقاع (Cadence) ومتابعة دقيقة، ستضيع الـ Leads الساخنة في فوضى العمل اليومي." },
                        { icon: ZapOff, color: 'text-gray-500', t: "غياب الأتمتة", d: "فريقك يجري كل شيء بشكل يدوي ومرهق، لكن النتائج لا تتغير ولا تتناسب مع الجهد المبذول." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 relative overflow-hidden group"
                        >
                            {/* Scanning Beam Effect */}
                            <motion.div
                                animate={{ top: ['-10%', '110%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 1 }}
                                className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-brand/5 to-transparent -skew-y-12"
                            />

                            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200 mb-8 group-hover:scale-110 transition-transform duration-500">
                                <item.icon size={32} className={item.color} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.t}</h3>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                {item.d}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const QuantifiedPain = () => {
    return (
        <section className="py-24 bg-[#0a0f1c] text-white overflow-hidden relative w-full">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[50%] -right-[20%] w-[1000px] h-[1000px] bg-gradient-to-b from-brand/10 to-transparent rounded-full blur-[100px] opacity-30"
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="space-y-12"
                >
                    <h2 className="text-3xl md:text-5xl font-black leading-[1.4] md:leading-[1.4]">
                        الهدر في المبيعات قد يصل إلى <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400 inline-block px-2">70%</span> <br className="hidden md:block" />
                        قبل الوصول إلى الاجتماع الأول
                    </h2>
                    <div className="space-y-8 pt-4">
                        {['LinkedIn, WhatsApp', 'Calls, Email Follow-ups'].map((channel, i) => (
                            <div key={i} className="flex gap-5 items-center group">
                                <div className="w-1 absolute" /> {/* Spacer */}
                                <motion.div
                                    whileHover={{ scale: 1.5 }}
                                    className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                                />
                                <div className="pr-8">
                                    <h4 className="font-bold text-2xl text-white mb-1 group-hover:text-red-400 transition-colors">{channel}</h4>
                                    <p className="text-slate-400 text-lg">فقدان فرص محتملة بسبب ضعف الأداء.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-slate-700/50 shadow-2xl relative"
                >
                    {/* Glow effect behind card */}
                    <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent rounded-[2.5rem]" />

                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <h3 className="font-bold text-2xl flex items-center gap-3">
                            <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 shadow-lg"><BarChart3 className="text-brand" size={24} /></div>
                            تحليل الفجوة
                        </h3>
                        <span className="text-sm text-slate-300 bg-slate-800 border border-slate-700 px-4 py-1.5 rounded-full font-bold">شهرياً</span>
                    </div>

                    <div className="space-y-10 relative z-10">
                        <div>
                            <div className="flex justify-between text-base mb-4 font-bold">
                                <span className="text-slate-300">الفرص المتاحة (Leads)</span>
                                <span className="text-brand">100%</span>
                            </div>
                            <div className="h-4 bg-slate-800 rounded-full w-full overflow-hidden border border-slate-700/50">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex justify-between text-base mb-4 font-bold">
                                <span className="text-slate-300">الفرص الفعلية (Converted)</span>
                                <span className="text-red-400">30%</span>
                            </div>
                            <div className="h-4 bg-slate-800 rounded-full w-full overflow-hidden border border-slate-700/50">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '30%' }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                                />
                            </div>

                            {/* Animated Gap Indicator */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5 }}
                                className="absolute top-10 right-[15%] left-0 flex items-center justify-center pointer-events-none"
                            >
                                <div className="bg-[#0f172a] border border-red-500 text-red-400 text-sm px-5 py-2 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                    <ArrowDown size={16} className="animate-bounce" />
                                    <span className="font-black">70% فجوة هدر</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="mt-20 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                        />
                        <p className="text-lg text-slate-300 leading-relaxed font-medium relative z-10">
                            أنت تدفع تكلفة 100% من التسويق... <br /> لتحصل على <span className="text-white font-bold underline decoration-red-500">30% فقط</span> من النتائج.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const ValueProposition = () => {
    return (
        <section id="value-prop" className="py-24 bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-12 w-full">
                <div className="text-center max-w-5xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-[1.4]">
                        تشخيص واحد يكشف لك أين تضيع الفرص... <br />
                        <span className="text-brand inline-block mt-2">وكيف تضاعف مخرجات 4 قنوات كاملة</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: 'WhatsApp', icon: MessageCircle, color: 'green', desc: 'أين تتسرب المتابعات؟' },
                        { title: 'LinkedIn', icon: Linkedin, color: 'blue', desc: 'تقييم جودة رسائل التواصل.' },
                        { title: 'Calling', icon: PhoneCall, color: 'purple', desc: 'تحليل الـ Connect Rate.' },
                        { title: 'Email', icon: Mail, color: 'orange', desc: 'معدلات الفتح (Open Rate).' }
                    ].map((item, i) => (
                        <div key={i} className={`bg-${item.color}-50/50 rounded-3xl p-8 border border-${item.color}-100 hover:shadow-xl transition-all hover:bg-${item.color}-50 group hover:-translate-y-1`}>
                            <div className={`w-14 h-14 bg-${item.color}-100 rounded-2xl flex items-center justify-center text-${item.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
                                <item.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-5 text-gray-900">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const AISection = () => {
    return (
        <section className="py-32 bg-slate-50 overflow-hidden w-full relative">
            <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center w-full z-10 relative">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="order-2 lg:order-1"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-2 rounded-full text-sm font-bold mb-8 border border-brand/20">
                        <Sparkles size={16} />
                        <span>المحرك الذكي</span>
                    </motion.div>

                    <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-slate-900 mb-12 leading-[1.3]">
                        كيف نستخدم <span className="text-brand relative inline-block">
                            الذكاء الاصطناعي
                            <span className="absolute bottom-1 left-0 w-full h-3 bg-brand/20 -z-10 rounded-sm"></span>
                        </span> <br />
                        لرفع فرصك من 4 مصادر؟
                    </motion.h2>

                    <div className="space-y-10">
                        {[
                            { i: GitMerge, t: "تحليل متقاطع", d: "كل قناة تُحلل لوحدها... ثم تحلل مجتمعة لكشف الترابطات الخفية." },
                            { i: Cpu, t: "أولويات ذكية", d: "خوارزميات تحدد بدقة أين تبدأ التحسين لتحصل على أسرع نتائج (Quick Wins)." },
                            { i: Network, t: "Engine موحد", d: "ربط WhatsApp + LinkedIn + Email + Calls في نظام واحد متناغم." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                whileHover={{ x: -10 }}
                                className="flex gap-6 group"
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-brand flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-brand/10">
                                    <item.i size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-brand transition-colors">{item.t}</h4>
                                    <p className="text-slate-600 leading-relaxed text-lg font-medium">{item.d}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <div className="order-1 lg:order-2 flex justify-center relative">
                    <div className="relative w-full max-w-md aspect-square">
                        {/* Core Pulse */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 0 0 rgba(16, 185, 129, 0)", "0 0 0 20px rgba(16, 185, 129, 0.2)", "0 0 0 0 rgba(16, 185, 129, 0)"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-brand/40 z-20"
                        >
                            <div className="text-white text-center">
                                <Sparkles size={48} className="mx-auto mb-2 animate-spin-slow" style={{ animationDuration: '10s' }} />
                                <span className="font-black text-2xl tracking-widest">AI CORE</span>
                            </div>
                        </motion.div>

                        {/* Orbiting Rings */}
                        {[1, 2, 3].map((r) => (
                            <motion.div
                                key={r}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10 * r, repeat: Infinity, ease: "linear" }}
                                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-slate-300 z-10`}
                                style={{ width: `${r * 120 + 100}%`, height: `${r * 120 + 100}%`, opacity: 0.5 / r }}
                            >
                                <motion.div
                                    className="w-4 h-4 bg-brand rounded-full absolute -top-2 left-1/2 -translate-x-1/2 shadow-lg shadow-brand"
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const WhatYouGet = ({ onStartDiagnosis }: { onStartDiagnosis: () => void }) => {
    return (
        <section className="py-24 bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-12 w-full">
                <div className="bg-gray-50 rounded-[3rem] p-8 md:p-16 border border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-10 leading-[1.4]">
                                ماذا ستحصل عليه <br />
                                <span className="text-brand">بعد التشخيص؟</span>
                            </h2>
                            <div className="space-y-5 mb-12">
                                {[
                                    "درجة جاهزية الفريق (Score) دقيقة",
                                    "تحديد حجم الهدر المالي في كل قناة",
                                    "حساب عدد الفرص المفقودة شهرياً",
                                    "خطة تحسين عملية لمدة 90 يوم",
                                    "نماذج Cadence + Scripts جاهزة",
                                    "توصيات أتمتة فورية التنفيذ"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                        <CheckCircle2 className="text-brand flex-shrink-0" />
                                        <span className="text-gray-700 text-lg font-bold">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={onStartDiagnosis}
                                className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white px-10 py-5 rounded-2xl font-bold shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-3 hover:-translate-y-1"
                            >
                                أريد معرفة درجة جاهزية فريقي
                                <ArrowLeft size={20} />
                            </button>
                        </div>
                        <div className="relative">
                            <div className="bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-10 border border-gray-200 rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-5 mb-10 border-b border-gray-100 pb-8">
                                    <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
                                        <FileCheck size={32} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-2xl text-gray-900">تقرير التشخيص الاستراتيجي</h4>
                                        <p className="text-sm text-gray-500 mt-1">تم الانشاء: اليوم</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="h-5 bg-gray-100 rounded-full w-3/4"></div>
                                    <div className="h-5 bg-gray-100 rounded-full w-full"></div>
                                    <div className="h-5 bg-gray-100 rounded-full w-5/6"></div>
                                    <div className="h-40 bg-slate-50 rounded-2xl w-full border-2 border-dashed border-gray-300 mt-8 flex flex-col gap-2 items-center justify-center text-gray-400">
                                        <span className="text-lg font-bold">منطقة خطة العمل</span>
                                        <span className="text-sm">(90 يوم)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-white relative overflow-hidden w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-12 text-center relative z-10 w-full">
                <div className="mb-20">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-2">
                        كيف يعمل <span className="text-brand">التشخيص؟</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    <div className="hidden md:block absolute top-12 left-12 right-12 h-0.5 bg-gray-200 -z-10"></div>
                    {[
                        { title: "تشخيص شامل", icon: Search, desc: "جمع بيانات الفريق + القنوات + CRM لفهم الوضع الحالي بدقة." },
                        { title: "تحليل ذكي", icon: BrainCircuit, desc: "الذكاء الاصطناعي يحدد الفجوات، نقاط الخلل، وفرص النمو الضائعة." },
                        { title: "خطة تطوير", icon: FileSearch, desc: "توصيات قابلة للتطبيق فوراً، مع خارطة طريق واضحة لمدة 90 يوم." }
                    ].map((step, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl transition-all hover:-translate-y-2">
                            <div className="w-24 h-24 mx-auto bg-brand text-white rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-lg relative z-10">
                                <step.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">{i + 1}. {step.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Features = () => {
    return (
        <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden relative w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-12 w-full">
                <div className="flex flex-col md:flex-row items-center gap-20">
                    <motion.div
                        initial={{ opacity: 0, x: 50, rotateY: 10 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full md:w-1/2 relative perspective-1000"
                    >
                        <div className="relative z-10 bg-white rounded-[1.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden transform rotate-y-6 hover:rotate-0 transition-all duration-700 ease-out group">
                            {/* Mock Window Controls */}
                            <div className="bg-slate-900 px-4 py-3 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="ml-4 bg-slate-800 rounded-md px-3 py-1 flex-1 text-[10px] text-slate-400 font-mono text-center flex items-center justify-center gap-1">
                                    <LockIcon size={8} />
                                    app.monafsat.com/dashboard
                                </div>
                            </div>

                            <div className="flex h-[400px] bg-slate-50">
                                {/* Sidebar Mock */}
                                <div className="w-48 bg-white border-l border-gray-100 flex flex-col p-4 hidden md:flex">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-6 h-6 bg-brand rounded-md"></div>
                                        <span className="font-black text-slate-800 text-sm">منافذ</span>
                                    </div>
                                    <div className="space-y-1">
                                        {['لوحة التحكم', 'العملاء المحتملين', 'الفرص البيعية', 'التقارير'].map((item, i) => (
                                            <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${i === 1 ? 'bg-brand/5 text-brand' : 'text-slate-500'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-brand' : 'bg-slate-300'}`}></div>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-auto bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="text-[10px] text-slate-400 mb-1">الهدف الشهري</div>
                                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
                                            <div className="h-full bg-brand w-[75%]"></div>
                                        </div>
                                        <div className="text-xs font-bold text-slate-700">75% مكتمل</div>
                                    </div>
                                </div>

                                {/* Main Content Mock */}
                                <div className="flex-1 p-6 overflow-hidden relative">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800">قائمة العملاء (Live)</h3>
                                            <p className="text-xs text-slate-400">آخر تحديث: قبل دقيقة</p>
                                        </div>
                                        <div className="bg-brand text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg shadow-brand/20">
                                            <span>+ إضافة عميل</span>
                                        </div>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        {[
                                            { l: 'إجمالي العملاء', v: '1,240', c: 'text-slate-700' },
                                            { l: 'فرص ساخنة', v: '85', c: 'text-rose-500' },
                                            { l: 'تم الإغلاق', v: '32', c: 'text-emerald-600' }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                                <div className="text-[10px] text-slate-400 mb-1 font-bold">{stat.l}</div>
                                                <div className={`text-lg font-black ${stat.c}`}>{stat.v}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Table Mock */}
                                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                        <table className="w-full text-right">
                                            <thead className="bg-slate-50 border-b border-gray-100">
                                                <tr>
                                                    {['العميل', 'المجال', 'الحالة', 'الإجراء'].map((h, i) => (
                                                        <th key={i} className="px-4 py-2 text-[10px] font-bold text-slate-500">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {[
                                                    { n: 'شركة التقنية المتقدمة', i: 'SaaS', s: 'جديد', sc: 'bg-blue-50 text-blue-600' },
                                                    { n: 'مجموعة العمران', i: 'Real Estate', s: 'مفاوضات', sc: 'bg-amber-50 text-amber-600' },
                                                    { n: 'حلول المستقبل', i: 'Fintech', s: 'عميل', sc: 'bg-emerald-50 text-emerald-600' },
                                                    { n: 'رواد الأعمال', i: 'Education', s: 'متابعة', sc: 'bg-indigo-50 text-indigo-600' }
                                                ].map((row, idx) => (
                                                    <motion.tr
                                                        key={idx}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="hover:bg-slate-50/50"
                                                    >
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold text-slate-500">
                                                                    {row.n[0]}
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-700">{row.n}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-[10px] text-slate-500 font-medium">{row.i}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.sc}`}>{row.s}</span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    whileInView={{ width: '60%' }}
                                                                    className="h-full bg-slate-300"
                                                                />
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Cursor Animation */}
                                    <motion.div
                                        animate={{ x: [0, 100, 100, 0], y: [0, 50, 0, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute top-1/2 right-1/2 pointer-events-none"
                                    >
                                        <MousePointer2 className="fill-slate-900 text-white drop-shadow-xl" size={24} />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className="w-full md:w-1/2 text-right"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-brand/10 text-brand px-3 py-1 rounded-md text-sm font-bold mb-6">
                            <Zap size={16} fill="currentColor" />
                            <span>تقنيات متقدمة</span>
                        </motion.div>
                        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                            نظام متكامل <br />
                            <span className="text-brand">لإدارة الأداء</span>
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-gray-500 text-lg mb-10 leading-relaxed">
                            لا نكتفي بمجرد التحليل، بل نقدم نظاماً بيئياً متكاملاً يربط بين التشخيص والتطوير المستمر لضمان استدامة النتائج.
                        </motion.p>
                        <div className="space-y-8">
                            {[
                                { i: FileText, t: "توصيات قابلة للتنفيذ", d: "خطوات عملية ومحددة يمكن تطبيقها فوراً لتحسين الأداء الفردي والجماعي." },
                                { i: BarChart3, t: "لوحات بيانات تفاعلية", d: "راقب تقدم فريقك لحظة بلحظة من خلال لوحات تحكم ديناميكية وسهلة القراءة." }
                            ].map((item, i) => (
                                <motion.div key={i} variants={itemVariants} className="flex gap-5 items-start group cursor-default">
                                    <div className="w-14 h-14 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center text-brand flex-shrink-0 group-hover:bg-brand group-hover:text-white transition-all group-hover:rotate-12">
                                        <item.i size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-brand transition-colors">{item.t}</h4>
                                        <p className="text-gray-500 leading-relaxed font-medium">{item.d}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const Testimonials = () => {
    const data = [
        {
            id: 1,
            name: "سعود القحطاني",
            role: "مدير مشاريع - TechCorp",
            image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200&h=200",
            quote: "غيّر هذا النظام طريقة عمل فريقنا بالكامل. أصبحنا أكثر تناغماً.",
            result: "+52% زيادة في الاجتماعات"
        },
        {
            id: 2,
            name: "سارة العمري",
            role: "رئيسة مبيعات - GrowthInc",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
            quote: "الأداة الأقوى لتشخيص الثغرات في التواصل. التقارير دقيقة بشكل مخيف.",
            result: "3X معدل الرد في LinkedIn"
        },
        {
            id: 3,
            name: "خالد الزهراني",
            role: "CEO - FutureVision",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
            quote: "الاستثمار في نينجا سكانر كان أفضل قرار اتخذناه لضبط المبيعات.",
            result: "تقليل دورة البيع 40%"
        }
    ];

    return (
        <section id="testimonials" className="py-24 bg-slate-50 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-12 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
                        قصص <span className="text-brand">نجاح حقيقية</span>
                    </h2>
                </motion.div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ margin: "-50px" }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {data.map((t) => (
                        <motion.div
                            key={t.id}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-brand/10 transition-all cursor-default relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-brand/5 rounded-bl-[4rem] transition-all group-hover:scale-150" />

                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-brand/20 p-0.5">
                                    <img src={t.image} alt={t.name} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{t.name}</h4>
                                    <span className="text-sm text-gray-500 font-medium">{t.role}</span>
                                </div>
                            </div>

                            {t.result && (
                                <div className="bg-emerald-50 text-emerald-600 font-bold px-4 py-2 rounded-xl inline-block mb-6 text-sm border border-emerald-100/50">
                                    🚀 {t.result}
                                </div>
                            )}

                            <p className="text-gray-600 leading-relaxed font-medium text-lg relative z-10">
                                <Quote className="inline-block transform rotate-180 text-brand/20 ml-2 -mt-2" size={20} />
                                {t.quote}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const data = [
        { q: "هل التشخيص مجاني؟", a: "نعم، نقدم تشخيصاً أولياً مجانياً لتحديد مستوى جاهزية الفريق وكشف الفجوات الرئيسية." },
        { q: "هل يناسب الشركات الصغيرة والمتوسطة؟", a: "بالتأكيد. النظام مصمم ليكون مرناً ويناسب الفرق من حجم 3 موظفين وحتى المؤسسات الكبرى." },
        { q: "هل البيانات التي أقدمها تبقى خاصة؟", a: "نعم، نلتزم بأعلى معايير الخصوصية والأمان. بياناتك لا يتم مشاركتها مع أي طرف ثالث." },
        { q: "كم يستغرق وقت الجلسة؟", a: "جلسة التشخيص وعرض النتائج تستغرق عادة ما بين 20 إلى 30 دقيقة فقط." },
        { q: "هل الخطة قابلة للتطبيق فوراً؟", a: "نعم، صممنا المخرجات لتكون عملية (Actionable) ويمكن البدء بتنفيذها من اليوم التالي." }
    ];

    return (
        <section id="faq" className="py-24 bg-white w-full">
            <div className="max-w-3xl mx-auto px-4 w-full">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-black text-center text-gray-900 mb-12"
                >
                    الأسئلة المتكررة
                </motion.h2>
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border border-gray-200 rounded-2xl overflow-hidden transition-all hover:border-brand/50"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                className="w-full flex items-center justify-between p-6 text-right bg-white hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-gray-900 text-lg">{item.q}</span>
                                <span className="text-brand">
                                    <motion.div
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                    </motion.div>
                                </span>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                                            {item.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FinalCTA = ({ onStartDiagnosis }: { onStartDiagnosis: () => void }) => {
    return (
        <section className="py-24 bg-brand text-white text-center relative overflow-hidden w-full">
            {/* Animated Background Elements */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"
            />
            <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-400 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"
            />

            <div className="max-w-4xl mx-auto px-4 relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl md:text-5xl font-black mb-10 leading-[1.5]">
                        لا تخسر فرص إضافية هذا الشهر... <br className="hidden md:block" />
                        <span className="text-teal-200 block mt-3">اكشف الهدر الآن وابدأ تحسين قنواتك الأربعة فوراً.</span>
                    </h2>
                    <motion.button
                        onClick={onStartDiagnosis}
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-brand hover:bg-gray-100 text-xl px-14 py-6 rounded-2xl font-black transition-all shadow-2xl flex items-center justify-center gap-3 mx-auto relative overflow-hidden group"
                    >
                        <span className="relative z-10 flex items-center gap-2">🎯 ابدأ التشخيص الآن</span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent w-1/2 skew-x-12"
                            animate={{ x: ['-150%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
                        />
                    </motion.button>
                    <p className="mt-8 text-teal-100 font-medium text-lg opacity-90 tracking-wide">
                        20-30 دقيقة فقط • بدون التزام • تقرير جاهز للتنفيذ
                    </p>
                </motion.div>
            </div>
        </section>
    );
};


const Footer = () => (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 w-full">
            <div className="text-2xl font-bold text-brand">BiznesClinics</div>
            <div className="text-gray-400 text-sm">جميع الحقوق محفوظة © 2024 Ninja Scanner Pro</div>
        </div>
    </footer>
);

const AnalysisModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<AnalysisStatus>('IDLE');
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleAnalyze = async () => {
        if (!input.trim()) return;
        setStatus('LOADING');
        try {
            const diagnosis = await analyzeTeamHealth(input);
            setResult(diagnosis);
            setStatus('SUCCESS');
        } catch (error) {
            setStatus('ERROR');
        }
    };

    const reset = () => {
        setResult(null);
        setInput('');
        setStatus('IDLE');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans" style={{ direction: 'rtl' }}>
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in-up">
                <div className="bg-brand p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <Sparkles size={24} className="animate-pulse" />
                        <h3 className="font-bold text-xl">تشخيص النينجا الذكي (AI)</h3>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition"><X size={24} /></button>
                </div>

                <div className="p-8">
                    {status === 'IDLE' && (
                        <div className="space-y-4">
                            <label className="block text-gray-700 font-bold mb-2 text-lg">صف تحديات فريقك الحالية:</label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="مثال: الفريق يعاني من التواصل البطيء وتأخر في التسليمات..."
                                className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:border-brand focus:ring-0 outline-none resize-none text-gray-700 bg-gray-50 text-right"
                            />
                            <button
                                onClick={handleAnalyze}
                                disabled={!input.trim()}
                                className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 rounded-xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                تحليل الآن
                            </button>
                        </div>
                    )}

                    {status === 'LOADING' && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                            <Loader2 size={48} className="text-brand animate-spin" />
                            <p className="text-gray-500 text-lg animate-pulse">جاري تحليل البيانات بواسطة Gemini AI...</p>
                        </div>
                    )}

                    {status === 'SUCCESS' && result && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <h4 className="font-bold text-gray-900 text-xl">نتيجة التشخيص</h4>
                                <div className={`px-4 py-1 rounded-full text-white font-bold ${result.score > 70 ? 'bg-green-500' : result.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                    الدرجة: {result.score}/100
                                </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <h5 className="font-bold text-blue-800 mb-2">الملخص:</h5>
                                <p className="text-blue-900">{result.summary}</p>
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-brand" />
                                    التوصيات المقترحة:
                                </h5>
                                <ul className="space-y-3">
                                    {result.recommendations.map((rec, idx) => (
                                        <li key={idx} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                                            <span className="bg-brand text-white w-6 h-6 flex items-center justify-center rounded-full text-sm flex-shrink-0 mt-0.5">{idx + 1}</span>
                                            <span className="text-gray-700">{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={reset} className="flex-1 border-2 border-brand text-brand font-bold py-3 rounded-xl hover:bg-brand hover:text-white transition">
                                    تشخيص جديد
                                </button>
                                <button
                                    onClick={() => navigate(CTA_LINK)}
                                    className="flex-1 bg-brand text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition shadow-lg"
                                >
                                    🚀 ابدأ رحلة الاستهداف (Wizard)
                                </button>
                            </div>
                        </div>
                    )}

                    {status === 'ERROR' && (
                        <div className="text-center py-8">
                            <div className="text-red-500 mb-4 flex justify-center"><AlertCircle size={48} /></div>
                            <p className="text-gray-800 font-bold mb-4">عذراً، حدث خطأ أثناء الاتصال بالمعالج الذكي.</p>
                            <button onClick={reset} className="text-brand underline hover:text-brand-dark">حاول مرة أخرى</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();
    const startDiagnosis = () => navigate('/diagnosis');

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand selection:text-white scroll-smooth w-full overflow-x-hidden" dir="rtl">
            <Navbar onStartDiagnosis={startDiagnosis} />
            <main className="w-full">
                <Hero onStartDiagnosis={startDiagnosis} />
                <PainSection />
                <QuantifiedPain />
                <ValueProposition />
                <AISection />
                <WhatYouGet onStartDiagnosis={startDiagnosis} />
                <HowItWorks />
                <Features />
                <Testimonials />
                <FAQ />
                <FinalCTA onStartDiagnosis={startDiagnosis} />
            </main>
            <Footer />
            {/* AnalysisModal removed as we redirect to full page */}
        </div>
    );
};

export default LandingPage;
