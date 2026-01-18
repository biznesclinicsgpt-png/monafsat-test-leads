
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, ChevronDown, CheckCircle2, Phone, TrendingUp, Target, ShieldCheck,
    XCircle, Briefcase, Zap, ArrowLeft, AlertTriangle, Users, MousePointerClick,
    ArrowRight, Settings, Linkedin, Mail, MessageCircle, Database, Layout, Shield,
    Search, Rocket, Filter, CheckSquare, Handshake, Check, CheckCircle, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const GrowthSystemPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // --- COMPONENTS ---

    const Navbar = () => (
        <nav className="fixed w-full bg-white/90 backdrop-blur-xl z-50 border-b border-gray-100 font-cairo">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logo_full.png" alt="BiznesClinics" className="h-10 w-auto object-contain" />
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#problem" className="text-slate-600 hover:text-brand-600 font-bold transition-colors">المشكلة</a>
                        <a href="#ninja-os" className="text-slate-600 hover:text-brand-600 font-bold transition-colors">Ninja OS</a>
                        <a href="#pricing" className="text-slate-600 hover:text-brand-600 font-bold transition-colors">الأسعار</a>
                        <button
                            onClick={() => navigate('/diagnosis')}
                            className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20"
                        >
                            احجز استشارة
                        </button>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-brand-600">
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            <a href="#problem" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-slate-700">المشكلة</a>
                            <a href="#ninja-os" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-slate-700">Ninja OS</a>
                            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-slate-700">الأسعار</a>
                            <button onClick={() => { setIsMenuOpen(false); navigate('/diagnosis'); }} className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold">
                                احجز استشارة
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );

    const Hero = () => (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 font-bold text-sm mb-8 border border-brand-100 shadow-sm"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
                        </span>
                        مخصص للسوق السعودي B2B
                    </motion.div>

                    <motion.h1
                        initial="hidden" animate="visible" variants={fadeInUp}
                        className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tight"
                    >
                        نظام تشغيل نمو لشركات <span className="text-brand-500">B2B</span> في السعودية
                    </motion.h1>

                    <motion.p
                        initial="hidden" animate="visible" variants={fadeInUp}
                        className="text-xl md:text-2xl text-slate-500 mb-10 max-w-3xl mx-auto leading-relaxed"
                    >
                        <span className="font-bold text-slate-800">Pipeline حقيقي… فرص واضحة… صفقات مقفولة.</span>
                        <br />
                        تساعد Biznes Clinics الشركات السعودية على بناء خط مبيعات مستدام عبر نظام ذكي يجمع بين Outbound و Inbound بدون هدر ميزانيات.
                    </motion.p>

                    <motion.div
                        initial="hidden" animate="visible" variants={fadeInUp}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <button
                            onClick={() => navigate('/diagnosis')}
                            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white text-lg px-8 py-5 rounded-2xl font-bold transition-all shadow-xl hover:shadow-brand-500/30 hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            احجز جلسة تشخيص 30 دقيقة
                            <ArrowLeft size={20} />
                        </button>
                        <button
                            onClick={() => document.getElementById('ninja-os')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-slate-700 border-2 border-slate-200 text-lg px-8 py-5 rounded-2xl font-bold transition-all flex items-center justify-center"
                        >
                            تعرّف هل Ninja OS مناسب لك؟
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-bold"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-brand-500" />
                            <span>بدون اجتماعات غير مؤهلة</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-brand-500" />
                            <span>نظام Outbound + Inbound</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-brand-500" />
                            <span>نتائج قابلة للقياس</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40">
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-brand-200 blur-[120px]"></div>
                <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-blue-200 blur-[100px]"></div>
            </div>
        </section>
    );

    const ProblemSection = () => {
        const problems = [
            {
                icon: Users,
                title: "اجتماعات كتير بدون قرار",
                desc: "تقضي وقتك في اجتماعات لا تنتهي بقرار حقيقي أو خطوة تالية واضحة."
            },
            {
                icon: MousePointerClick,
                title: "Leads شكلها كويس بس...",
                desc: "الأرقام تبدو جيدة لكن العملاء المحتملين غير جاهزين للشراء فعلياً."
            },
            {
                icon: AlertTriangle,
                title: "ضياع وقت فريق المبيعات",
                desc: "فريقك يستنزف طاقته في متابعة أشخاص غير مؤهلين بدلاً من التركيز على الصفقات."
            },
            {
                icon: XCircle,
                title: "صعوبة الوصول لصناع القرار",
                desc: "الباب مغلق دائماً عند محاولة الوصول للمدراء في الشركات المتوسطة والكبيرة."
            }
        ];

        return (
            <section id="problem" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                            className="text-3xl md:text-5xl font-black text-slate-900 mb-6"
                        >
                            ليه أغلب شركات B2B في السعودية <br /><span className="text-rose-500">بتعاني في المبيعات؟</span>
                        </motion.h2>
                        <div className="w-24 h-1.5 bg-brand-500 mx-auto rounded-full"></div>
                    </div>

                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {problems.map((item, index) => (
                            <motion.div variants={fadeInUp} key={index} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-rose-200 hover:shadow-xl hover:-translate-y-1 transition-all group">
                                <div className="w-14 h-14 bg-white border border-slate-200 text-rose-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 transition-colors shadow-sm">
                                    <item.icon size={26} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }}
                        className="mt-16 text-center"
                    >
                        <p className="text-2xl font-bold text-slate-800">
                            المشكلة مش في السوق… <span className="text-brand-600 bg-brand-50 px-3 py-1 rounded-lg">المشكلة في طريقة التشغيل.</span>
                        </p>
                    </motion.div>
                </div>
            </section>
        );
    };

    const MakeSolution = () => (
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[120px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
                <div className="md:w-1/2">
                    <motion.div
                        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                        className="inline-block p-4 bg-white/5 rounded-2xl mb-8 border border-white/10"
                    >
                        <Settings size={40} className="text-brand-400 animate-spin-slow" />
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                        Biznes Clinics = <br />
                        <span className="text-brand-400">Growth OS</span>
                    </h2>
                    <p className="text-xl text-slate-300 leading-relaxed mb-8 font-light">
                        إحنا مش وكالة تسويق ومش شركة توليد Leads.
                        <br /><br />
                        إحنا <strong className="text-white font-bold">نظام تشغيل نمو</strong> بيحوّل التواصل في السوق السعودي إلى فرص حقيقية (Opportunities) ثم صفقات (Deals).
                    </p>
                </div>

                <motion.div
                    initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}
                    className="md:w-1/2 bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] shadow-2xl"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 bg-white/5 h-20 rounded-2xl flex items-center justify-center font-bold text-slate-400">تواصل</div>
                        <ArrowRight className="text-brand-500" />
                        <div className="flex-1 bg-brand-500 h-24 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl shadow-brand-500/20 border border-brand-400 scale-110 relative z-10">فرص حقيقية</div>
                        <ArrowRight className="text-brand-500" />
                        <div className="flex-1 bg-white/5 h-20 rounded-2xl flex items-center justify-center font-bold text-slate-400">صفقات</div>
                    </div>
                    <p className="text-center text-slate-400 font-medium">
                        نقوم بفلترة الضوضاء والتركيز فقط على ما يحقق العائد.
                    </p>
                </motion.div>
            </div>
        </section>
    );

    const NinjaOS = () => (
        <section id="ninja-os" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <span className="text-brand-600 font-bold tracking-wider uppercase text-sm bg-brand-100 px-3 py-1 rounded-full">المنتج الأساسي</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 mb-6">
                        Ninja OS — Outbound Growth Engine
                    </h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                        نظام تشغيل خروج مصمم خصيصًا للسوق السعودي. هدفه: <span className="text-brand-600 font-bold bg-brand-50 px-2 rounded-md">فرص حقيقية مش مجرد نشاط.</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-16">
                    <div className="bg-white p-8 lg:p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden group hover:border-brand-200 transition-all">
                        <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-l from-brand-500 to-transparent"></div>
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-4">
                            <span className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900"><Zap /></span>
                            ماذا نفعل؟
                        </h3>

                        <div className="mb-10">
                            <h4 className="font-bold text-lg mb-4 text-slate-800">تشغيل شهري متعدد القنوات:</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl text-blue-700 font-bold border border-blue-100">
                                    <Linkedin size={20} /> LinkedIn
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl text-indigo-700 font-bold border border-indigo-100">
                                    <Mail size={20} /> Email
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-green-50/50 rounded-2xl text-green-700 font-bold border border-green-100">
                                    <MessageCircle size={20} /> WhatsApp
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-2xl text-orange-700 font-bold border border-orange-100">
                                    <Phone size={20} /> Calls
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4 text-slate-800">الوصول لصناع القرار في:</h4>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 p-3 rounded-xl">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                    الشركات المتوسطة (SMEs)
                                </li>
                                <li className="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 p-3 rounded-xl">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                    الشركات الكبيرة (Enterprises)
                                </li>
                                <li className="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 p-3 rounded-xl">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                    القطاعات الخدمية والتقنية
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-slate-900 text-white p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-500 rounded-full opacity-20 blur-3xl"></div>

                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <StarBadge /> الأهم في Ninja OS
                            </h3>
                            <ul className="space-y-6 text-lg">
                                <li className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-rose-400 font-bold text-2xl">❌</span>
                                    <div>
                                        <span className="font-bold block text-rose-200">مفيش دفع على الاجتماعات</span>
                                        <span className="text-sm text-slate-400">لا نحاسبك على مجرد "لقاء" بدون نتيجة.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 p-4 bg-brand-900/40 rounded-2xl border border-brand-500/30">
                                    <span className="text-brand-400 font-bold text-2xl">✅</span>
                                    <div>
                                        <span className="font-bold block text-brand-200">القياس على Opportunity حقيقية</span>
                                        <span className="text-sm text-slate-400">نية شراء واضحة (Intent) وموثقة.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Database size={24} className="text-brand-500" />
                                أكتر من مجرد تشغيل
                            </h3>
                            <p className="text-slate-600 mb-6 leading-relaxed font-medium">
                                Ninja OS مدعوم بـ <strong className="text-brand-600 bg-brand-50 px-1 rounded">41 مستوى دعم</strong> تشمل Strategy, Data, Automation, Analytics, و Coaching.
                            </p>
                            <div className="bg-slate-100 p-4 rounded-xl text-sm text-slate-600 font-bold text-center border border-slate-200">
                                مش بنبعث رسائل وخلاص، بنبني نظام مبيعات يشتغل معاك.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Opportunity Definition */}
                <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-12 bg-emerald-50/50">
                            <h3 className="text-2xl font-black text-emerald-900 mb-8 flex items-center gap-3">
                                <CheckCircle className="text-emerald-500" /> إيه اللي بنسميه Opportunity؟
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "تواصل مع شخص مناسب داخل الشركة",
                                    "اهتمام واضح بالخدمة",
                                    "قابلية حقيقية للنقاش التجاري",
                                    "موثّقة بالكامل داخل النظام"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="bg-emerald-200 p-1.5 rounded-full">
                                            <Check size={14} className="text-emerald-800" />
                                        </div>
                                        <span className="text-emerald-900 font-bold">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-12 bg-rose-50/50 border-t md:border-t-0 md:border-r border-slate-100">
                            <h3 className="text-2xl font-black text-rose-900 mb-8 flex items-center gap-3">
                                <XCircle className="text-rose-500" /> إيه اللي مش Opportunity؟
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "مجرد رد على الرسالة",
                                    "اجتماع مجاملة بدون نية شراء",
                                    "وعد غير واضح أو تسويف",
                                    "شخص غير صانع قرار"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="bg-rose-200 p-1.5 rounded-full">
                                            <X size={14} className="text-rose-800" />
                                        </div>
                                        <span className="text-rose-900 font-bold">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    const Process = () => {
        const steps = [
            { icon: Search, title: "1. نفهم نشاطك", desc: "والسوق اللي بتستهدفه" },
            { icon: Target, title: "2. نحدد ICP", desc: "عميلك المثالي بدقة" },
            { icon: Rocket, title: "3. نطلق التشغيل", desc: "LinkedIn, Email, Calls" },
            { icon: Filter, title: "4. نؤهل التواصل", desc: "فلترة الجادين فقط" },
            { icon: CheckSquare, title: "5. فرص حقيقية", desc: "تسليم Opportunities" },
            { icon: Handshake, title: "6. نتابع معاك", desc: "لحد إغلاق الصفقة" },
        ];

        return (
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">كيف نشتغل معاك؟</h2>
                        <p className="text-xl text-slate-500 font-bold">كل خطوة مقاسة ومتوثقة</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative group">
                                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all h-full z-10 relative">
                                    <div className="w-16 h-16 bg-white border-2 border-brand-100 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm">
                                        <step.icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                    <p className="text-slate-500 font-medium">{step.desc}</p>
                                </div>
                                {/* Connector Line (Desktop Only) */}
                                {index !== steps.length - 1 && index !== 2 && index !== 5 && (
                                    <div className="hidden lg:block absolute top-1/2 -left-8 w-16 h-0.5 bg-slate-200 z-0 transform -translate-y-1/2 border-t-2 border-dashed border-slate-200"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    const Pricing = () => (
        <section id="pricing" className="py-24 bg-brand-900 relative overflow-hidden">
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-800 rounded-full blur-[100px] opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900 rounded-full blur-[100px] opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">تسعير (Q1 2026)</h2>
                    <p className="text-xl text-brand-100 font-bold bg-brand-800/50 inline-block px-4 py-2 rounded-full border border-brand-700">باكدج واضحة بدون تعقيد</p>
                </div>

                <div className="max-w-lg mx-auto bg-white rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-3 text-center text-white text-sm font-black tracking-widest uppercase shadow-md">
                        🔥 الأكثر طلباً للنمو
                    </div>
                    <div className="p-10 md:p-14 text-center">
                        <h3 className="text-3xl font-black text-slate-900 mb-2">Ninja OS</h3>
                        <p className="text-slate-500 mb-10 font-bold">نظام التشغيل المتكامل</p>

                        <div className="flex justify-center items-end mb-8 gap-2">
                            <span className="text-6xl font-black text-brand-600 tracking-tighter">5,000</span>
                            <div className="text-left mb-3">
                                <span className="block text-base text-slate-900 font-bold">ريال</span>
                                <span className="block text-sm text-slate-400 font-medium">/ شهرياً</span>
                            </div>
                        </div>

                        <div className="inline-block bg-brand-50 rounded-xl px-5 py-3 mb-10 border border-brand-100">
                            <span className="text-brand-700 font-bold text-sm">✨ أو 9,000 ريال ربع سنوي (وفر 6,000 ريال)</span>
                        </div>

                        <ul className="text-right space-y-5 mb-12">
                            {[
                                "تشغيل متعدد القنوات (LinkedIn, Email, Calls)",
                                "تحديد دقيق للـ ICP وبناء الداتا",
                                "دعم استراتيجي وتقني كامل (Ninja Support)",
                                "تقارير أداء دورية (Bi-Weekly)",
                                "بدون رسوم خفية",
                                "بدون التزام طويل المدى (شهر بشهر)"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-4 text-slate-700 font-medium">
                                    <div className="flex-shrink-0 w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center">
                                        <Check size={14} className="text-brand-600 font-bold" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => navigate('/diagnosis')}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg mb-4"
                        >
                            🚀 ابدأ الآن
                        </button>
                        <p className="text-xs text-slate-400 font-medium">باكدج ثابتة لبداية 2026 - العرض محدود</p>
                    </div>
                </div>
            </div>
        </section>
    );

    const AudienceAndFooter = () => (
        <>
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-5xl font-black text-center text-slate-900 mb-20">
                        لمن هذا النظام؟
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                        {/* Suitable For */}
                        <div className="bg-white p-10 rounded-[2rem] border-t-8 border-brand-500 shadow-lg">
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                                <CheckCircle className="text-white fill-brand-500" size={40} />
                                مناسب لـ:
                            </h3>
                            <ul className="space-y-6">
                                {[
                                    "شركات B2B في السعودية (الرياض، جدة، الدمام)",
                                    "شركات خدمات احترافية (Consulting, Agency, Law)",
                                    "شركات تقنية / SaaS / Software House",
                                    "شركات تبحث عن Pipeline حقيقي ومستدام"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 text-lg text-slate-700 font-medium">
                                        <span className="mt-2 w-2 h-2 bg-brand-500 rounded-full flex-shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Not Suitable For */}
                        <div className="bg-white p-10 rounded-[2rem] border-t-8 border-rose-500 shadow-lg">
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                                <XCircle className="text-white fill-rose-500" size={40} />
                                غير مناسب لـ:
                            </h3>
                            <ul className="space-y-6">
                                {[
                                    "اللي عايز اجتماعات بأي ثمن (Quantity over Quality)",
                                    "اللي عايز Leads رخيصة وغير مؤهلة (B2C Mindset)",
                                    "اللي مش مستعد يشتغل بنظام وتشغيل واضح"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 text-lg text-slate-700 font-medium">
                                        <span className="mt-2 w-2 h-2 bg-rose-500 rounded-full flex-shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section id="contact" className="py-32 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-600/20 rounded-full blur-[150px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">جاهز تبني Pipeline مبيعات <br /> <span className="text-brand-500">حقيقي في السعودية؟</span></h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        احجز جلسة تشخيص 30 دقيقة، نشوف هل Ninja OS مناسب لنشاطك، ولو مش مناسب... هنقولك بصراحة.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => navigate('/diagnosis')}
                            className="bg-brand-500 hover:bg-brand-600 text-white text-xl px-10 py-5 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-brand-500/40"
                        >
                            احجز جلسة تشخيص
                        </button>
                        <button className="bg-transparent border-2 border-slate-700 hover:bg-white/5 text-white text-xl px-10 py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3">
                            <Phone size={24} />
                            كلّمنا على واتساب
                        </button>
                    </div>
                </div>
            </section>

            <footer className="bg-slate-950 text-slate-500 py-16 border-t border-slate-900 font-cairo">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-4">
                            <img src="/logo_full.png" alt="BiznesClinics" className="h-8 w-auto opacity-50 grayscale hover:grayscale-0 transition-all" />
                            <div>
                                <p className="text-sm font-bold opacity-50">B2B Growth Systems</p>
                            </div>
                        </div>

                        <div className="text-center md:text-right">
                            <p className="mb-2 font-bold">Riyadh – Saudi Arabia</p>
                            <p className="text-sm">© 2026 Biznes Clinics. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );

    const StarBadge = () => (
        <span className="relative flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-brand-500"></span>
        </span>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-cairo" dir="rtl">
            <Navbar />
            <Hero />
            <ProblemSection />
            <MakeSolution />
            <NinjaOS />
            <Process />
            <Pricing />
            <AudienceAndFooter />
        </div>
    );
};

export default GrowthSystemPage;
