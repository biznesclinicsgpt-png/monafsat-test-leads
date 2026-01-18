
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, ChevronDown, CheckCircle2, Phone, TrendingUp, Target, ShieldCheck,
    XCircle, Briefcase, Zap, ArrowLeft, AlertTriangle, Users, MousePointerClick,
    ArrowRight, Settings, Linkedin, Mail, MessageCircle, Database, Layout, Shield,
    Search, Rocket, Filter, CheckSquare, Handshake, Check, CheckCircle, Sparkles,
    Bot, MessageSquare, Eye, Headphones, Calendar, FileText
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
                        <a href="#ninja-os" className="text-slate-600 hover:text-brand-600 font-bold transition-colors">نظام Ninja OS</a>
                        <button key="scanner-link" onClick={() => navigate('/scanner')} className="text-slate-600 hover:text-brand-600 font-bold transition-colors flex items-center gap-2">
                            <Layout size={18} />
                            عن تشخيص النينجا
                        </button>

                        <button
                            onClick={() => navigate('/diagnosis')}
                            className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2"
                        >
                            <Zap size={18} className="fill-white" />
                            ابدأ تشخيص النينجا (مجاناً)
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
                            <a href="#ninja-os" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-slate-700">نظام Ninja OS</a>
                            <button onClick={() => { setIsMenuOpen(false); navigate('/scanner'); }} className="block text-lg font-bold text-slate-700 w-full text-right">عن تشخيص النينجا 🥷</button>

                            <button onClick={() => { setIsMenuOpen(false); navigate('/diagnosis'); }} className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                <Zap size={18} className="fill-white" />
                                ابدأ تشخيص النينجا (مجاناً)
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
                        مخصص للشركات السعودية
                    </motion.div>

                    <motion.h1
                        initial="hidden" animate="visible" variants={fadeInUp}
                        className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tight"
                    >
                        ضاعف مبيعاتك الربع القادم بأتمتة <span className="text-brand-500">الذكاء الاصطناعي</span> في السعودية
                    </motion.h1>

                    <motion.p
                        initial="hidden" animate="visible" variants={fadeInUp}
                        className="text-xl md:text-2xl text-slate-500 mb-10 max-w-4xl mx-auto leading-relaxed"
                    >
                        <span className="font-bold text-slate-800">شراكه تغنيك عن التوظيف وشراء الأدوات.</span>
                        <br />
                        ندير العملية بالكامل <span className="text-brand-600 font-black bg-brand-50 px-2 rounded">من الوصول للعميل المحتمل وحتى إغلاق الصفقة</span>، بفريق من 6 خبراء بتكلفة موظف واحد.
                    </motion.p>

                    <motion.div
                        initial="hidden" animate="visible" variants={fadeInUp}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <button
                            onClick={() => navigate('/diagnosis')}
                            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white text-lg px-8 py-5 rounded-2xl font-black transition-all shadow-xl hover:shadow-brand-500/30 hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            <Zap size={24} className="fill-white" />
                            ابدأ التشخيص مجاناً
                        </button>
                        <button
                            onClick={() => navigate('/scanner')}
                            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-slate-700 border-2 border-slate-200 text-lg px-8 py-5 rounded-2xl font-bold transition-all flex items-center justify-center"
                        >
                            كيف يعمل التشخيص؟
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-600 font-bold"
                    >
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                            <CheckCircle2 size={18} className="text-brand-500" />
                            <span> فريق كامل (6 أفراد) براتب واحد</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                            <CheckCircle2 size={18} className="text-brand-500" />
                            <span> تقني + مبيعات + استراتيجي</span>
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

    const TeamComparison = () => (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">فريقك المخصص <span className="text-brand-600">الجاهز</span></h2>
                    <p className="text-xl text-slate-500 font-medium">لماذا توظف، تدرب، وتدير... ونحن جاهزون الآن؟</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Traditional Way */}
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 opacity-60 hover:opacity-100 transition-opacity">
                        <h3 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                            <XCircle className="text-slate-400" /> الطريقة التقليدية (التوظيف)
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-slate-600">
                                <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">1</span>
                                موظف مبيعات (Sales Rep)
                            </li>
                            <li className="flex items-center gap-3 text-slate-600">
                                <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">2</span>
                                موظف أبحاث (Researcher)
                            </li>
                            <li className="flex items-center gap-3 text-slate-600">
                                <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">3</span>
                                كاتب محتوى (Copywriter)
                            </li>
                            <li className="flex items-center gap-3 text-slate-600">
                                <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">4</span>
                                خبير أتمتة (Automation Tech)
                            </li>
                        </ul>
                        <div className="mt-8 pt-8 border-t border-slate-200 text-center">
                            <p className="text-lg font-bold text-slate-500">التكلفة الشهرية المتوقعة:</p>
                            <p className="text-3xl font-black text-slate-400 line-through decoration-red-500 decoration-4">25,000+ ريال</p>
                        </div>
                    </div>

                    {/* Biznes Clinics Way */}
                    <div className="bg-gradient-to-br from-brand-900 to-slate-900 p-10 rounded-3xl text-white shadow-2xl relative transform md:scale-105 border border-brand-500/30">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-[80px] opacity-30"></div>

                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <CheckCircle className="text-brand-400" />
                            Biznes Clinics Growth Team
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {[
                                "مدير حساب (Account Manager)",
                                "استراتيجي نمو (Strategist)",
                                "مطور أتمتة (Tech Lead)",
                                "خبير محتوى سعودي (Copywriter)",
                                "باحث بيانات (Data Researcher)",
                                "أخصائي إغلاق (Closer Support)"
                            ].map((role, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm bg-white/10 p-2 rounded-lg border border-white/5">
                                    <Users size={14} className="text-brand-400" /> {role}
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-white/10 text-center">
                            <p className="text-lg font-bold text-brand-200">استثمارك الربع سنوي:</p>
                            <p className="text-3xl font-black text-white">تكلفة موظف واحد</p>
                            <p className="text-sm text-slate-400 mt-2">شامل الفريق والأدوات والإدارة</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );



    const TechStack = () => (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                        رحلة العميل داخل <span className="text-brand-600">"المحرك"</span>
                    </h2>
                    <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
                        نظام متكامل من 10 مراحل يضمن تحويل "البيانات الخام" إلى "صفقات مغلقة"، بدقة متناهية وبدون تدخل منك.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute right-8 md:right-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-200 via-brand-500 to-brand-200 rounded-full"></div>

                    <div className="space-y-12">
                        {[
                            {
                                step: "01",
                                title: "جمع البيانات الخام",
                                desc: "تجميع دقيق للشركات المستهدفة من مصادر متعددة وموثوقة لبناء قاعدة بيانات أولية.",
                                icon: <Database size={24} className="text-white" />,
                                color: "bg-blue-500"
                            },
                            {
                                step: "02",
                                title: "التحليل الذكي (AI)",
                                desc: "نستخدم عملاء ذكاء اصطناعي لتحليل كل شركة وشخص: الأخبار، الوضع المالي، والتوجهات الحالية.",
                                icon: <Bot size={24} className="text-white" />,
                                color: "bg-indigo-500"
                            },
                            {
                                step: "03",
                                title: "التصنيف والفلترة",
                                desc: "يتم منح كل عميل درجة (Score) بناءً على مدى مطابقته لمواصفات عميلك المثالي. لا نضيع وقتك مع غير المؤهلين.",
                                icon: <Filter size={24} className="text-white" />,
                                color: "bg-purple-500"
                            },
                            {
                                step: "04",
                                title: "إثراء بيانات التواصل",
                                desc: "استخراج أرقام الهواتف الشخصية والإيميلات المباشرة لصناع القرار بدقة عالية.",
                                icon: <Phone size={24} className="text-white" />,
                                color: "bg-pink-500"
                            },
                            {
                                step: "05",
                                title: "سلاسل المراسلة المخصصة",
                                desc: "بناء رسائل مخصصة لكل قناة (واتساب، بريد إلكتروني، لينكدإن) تعكس فهمنا لاحتياج العميل.",
                                icon: <MessageSquare size={24} className="text-white" />,
                                color: "bg-rose-500"
                            },
                            {
                                step: "06",
                                title: "رصد الاهتمام المبكر",
                                desc: "مراقبة سلوك العميل (فتح الرسائل، زيارة الموقع) للتدخل في اللحظة المناسبة قبل المنافسين.",
                                icon: <Eye size={24} className="text-white" />,
                                color: "bg-orange-500"
                            },
                            {
                                step: "07",
                                title: "مكالمة الفرز والتأهيل",
                                desc: "مكالمة مدتها 10 دقائق يجريها فريقنا للتأكد من جدية العميل وملاءمته لخدمتك قبل نقله لك.",
                                icon: <Headphones size={24} className="text-white" />,
                                color: "bg-amber-500"
                            },
                            {
                                step: "08",
                                title: "إدارة وحجز الاجتماع",
                                desc: "جدولة الاجتماع في تقويمك، وإرسال تذكيرات للعميل، والتأكد من حضوره.",
                                icon: <Calendar size={24} className="text-white" />,
                                color: "bg-emerald-500"
                            },
                            {
                                step: "09",
                                title: "تقديم العرض والمفاوضة",
                                desc: "متابعة إرسال عرض السعر نيابة عنك، وإدارة جولات المفاوضات الأولية بمهنية.",
                                icon: <FileText size={24} className="text-white" />,
                                color: "bg-teal-500"
                            },
                            {
                                step: "10",
                                title: "إغلاق الصفقة",
                                desc: "الوصول للمحطة النهائية: توقيع العقد واحتفالنا بالنجاح، أو تسجيل أسباب الرفض للتحسين.",
                                icon: <CheckCircle2 size={24} className="text-white" />,
                                color: "bg-green-600"
                            }
                        ].map((item, index) => (
                            <div key={index} className={`relative flex items-center justify-between md:justify-normal gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                {/* Timeline Dot (Mobile: Right, Desktop: Center) */}
                                <div className={`absolute right-8 md:right-1/2 transform translate-x-1/2 w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10 ${item.color}`}>
                                    {item.icon}
                                </div>

                                {/* Content Spacer for Desktop Alternating Layout */}
                                <div className="hidden md:block w-1/2"></div>

                                {/* Content Card */}
                                <div className="w-[calc(100%-80px)] md:w-1/2 p-4">
                                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:border-brand-200 transition-all hover:-translate-y-1 relative">
                                        {/* Step Number Badge */}
                                        <div className="absolute -top-4 left-6 bg-slate-900 text-white text-sm font-black px-3 py-1 rounded-lg shadow-md">
                                            مرحلة {item.step}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 mt-2">{item.title}</h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Final Success Badge */}
                    <div className="mt-20 text-center relative z-10">
                        <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl border-4 border-brand-500">
                            <Sparkles className="text-brand-400" />
                            <span className="font-bold text-lg">نظام يعمل كالساعة، بينما أنت تركز على "تقديم الخدمة".</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    const OurNumbers = () => (
        <section className="py-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl text-center">
                    {/* Background Glows */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/20 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px]"></div>

                    <div className="relative z-10 mb-16">
                        <div className="inline-flex items-center gap-2 bg-white/10 text-brand-300 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-white/10 backdrop-blur-sm">
                            <TrendingUp size={16} />
                            <span>نتائج حقيقية ملموسة</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                            أرقامنا في <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200">2025</span>
                        </h2>
                        <p className="text-xl md:text-3xl text-slate-300 font-bold leading-relaxed">
                            وبإذن الله جاهزين نضاعف أرقامنا <span className="text-white border-b-4 border-brand-500">لعملائنا ولينا</span> في 2026 🚀
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { value: "+4,230", label: "فرصة حقيقية (Leads)", desc: "تم توليدها لعملائنا", color: "text-brand-400" },
                            { value: "63", label: "شركة سعودية", desc: "نخدمها في مختلف القطاعات", color: "text-purple-400" },
                            { value: "+128M", label: "ريال سعودي", desc: "إجمالي قيمة عروض التسعير", color: "text-emerald-400" },
                            { value: "+11M", label: "ريال سعودي", desc: "مبيعات محققة (Closed Won)", color: "text-blue-400" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all group">
                                <div className={`text-4xl md:text-5xl font-black mb-2 ${stat.color}`}>{stat.value}</div>
                                <div className="text-lg font-bold text-white mb-1">{stat.label}</div>
                                <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{stat.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );

    const AIAgentDemo = () => (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <span className="text-brand-600 font-bold bg-brand-50 px-3 py-1 rounded-full text-sm">AI Agent السعودي</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 mb-6 leading-tight">
                            يتكلم لغتك... <br />
                            <span className="text-brand-600">ويقنع عميلك.</span>
                        </h2>
                        <p className="text-xl text-slate-500 mb-8 leading-relaxed">
                            نستخدم AI مدرب بكفاءة على منتجاتك وخدماتك، والاهم... مدرب على <strong className="text-slate-900">اللهجة السعودية (White-label)</strong>.
                            <br />
                            ما يبين إنه بوت، يبين إنه "عبدالعزيز" أو "سارة" من فريقك.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 font-bold text-slate-700">
                                <CheckCircle className="text-brand-500" size={20} />
                                تخصيص الرسائل حسب قطاع العميل (Construction vs Tech)
                            </li>
                            <li className="flex items-center gap-3 font-bold text-slate-700">
                                <CheckCircle className="text-brand-500" size={20} />
                                ردود فورية ذكية على الاستفسارات
                            </li>
                            <li className="flex items-center gap-3 font-bold text-slate-700">
                                <CheckCircle className="text-brand-500" size={20} />
                                حجز اجتماعات في الكالندر تلقائياً
                            </li>
                        </ul>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="absolute inset-0 bg-brand-500/20 blur-[100px] rounded-full"></div>
                        {/* Chat UI Mockup */}
                        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 relative z-10 max-w-md mx-auto">
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                                    <img src="https://ui-avatars.com/api/?name=Saud+Manager&background=0D8ABC&color=fff" alt="Avatar" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">أبو عبدالله (المدير العام)</h4>
                                    <span className="text-xs text-green-500 font-bold flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> متصل الآن</span>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm font-bold">
                                {/* Agent Msg */}
                                <div className="flex items-start gap-3">
                                    <div className="bg-brand-50 text-slate-800 p-4 rounded-2xl rounded-tr-none max-w-[85%] border border-brand-100">
                                        <p>مساك الله بالخير أبو عبدالله، معك فيصل من بزنس كلينيك. 👋</p>
                                        <p className="mt-2">كنت أقرأ عن توسعاتكم الأخيرة في مشروع القدية، ما شاء الله شغل جبار.</p>
                                        <p className="mt-2">حبيت أتواصل معك بخصوص...</p>
                                    </div>
                                </div>

                                {/* User Msg */}
                                <div className="flex items-start gap-3 flex-row-reverse">
                                    <div className="bg-slate-100 text-slate-800 p-3 rounded-2xl rounded-tl-none max-w-[85%]">
                                        <p>ياهلا فيصل، الله يحييك. تفضل اسمعك</p>
                                    </div>
                                </div>

                                {/* Agent Msg */}
                                <div className="flex items-start gap-3">
                                    <div className="bg-brand-50 text-slate-800 p-4 rounded-2xl rounded-tr-none max-w-[85%] border border-brand-100">
                                        <p>الله يسلمك. طال عمرك لاحظت انكم تستخدمون X حالياً، واحنا طورنا نظام يساعدكم توفرون 30% من التكاليف..</p>
                                        <p className="mt-2">متى يناسبك ناخذ اتصال سريع 5 دقايق اشرح لك الفكرة؟</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    const ManafethInbound = () => (
        <section className="py-24 bg-slate-900 text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-12 rounded-[2.5rem] bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 p-10 md:p-16 relative overflow-hidden">
                    {/* Decorative */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]"></div>

                    <div className="md:w-2/3 relative z-10">
                        <span className="text-emerald-400 font-bold tracking-wider uppercase text-sm border border-emerald-500/30 px-3 py-1 rounded-full mb-6 inline-block">خدمة إضافية (Inbound)</span>
                        <h2 className="text-3xl md:text-4xl font-black mb-6">
                            مش بس Outbound...<br />
                            كمان <span className="text-emerald-400">منافسات حكومية 🇸🇦</span>
                        </h2>
                        <p className="text-lg text-slate-300 leading-relaxed mb-8">
                            عندنا فريق موازي "قناص" بيتابع منصة اعتماد ومنافسات.
                            <br />
                            ما نكتفي بإرسال المنافسة لك، بل نساعدك في:
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <li className="flex items-center gap-3 text-slate-200">
                                <CheckCircle size={18} className="text-emerald-500" />
                                فلترة الفرص المناسبة لتصنيفك
                            </li>
                            <li className="flex items-center gap-3 text-slate-200">
                                <CheckCircle size={18} className="text-emerald-500" />
                                تحليل كراسة الشروط (RFP)
                            </li>
                            <li className="flex items-center gap-3 text-slate-200">
                                <CheckCircle size={18} className="text-emerald-500" />
                                الوصول لصاحب المنافسة (Inbound Lead)
                            </li>
                            <li className="flex items-center gap-3 text-slate-200">
                                <CheckCircle size={18} className="text-emerald-500" />
                                تجهيز العرض الفني والمالي
                            </li>
                        </ul>
                    </div>

                    <div className="md:w-1/3 text-center relative z-10">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
                            <div className="text-4xl mb-4">🏛️</div>
                            <h3 className="text-xl font-bold text-white mb-2">باب المنافسات</h3>
                            <p className="text-slate-400 text-sm mb-6">قناة نمو هامة للشركات السعودية</p>
                            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors">
                                اطلب تفاصيل الخدمة
                            </button>
                        </div>
                    </div>
                </div>
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
                                <Sparkles className="text-yellow-400 fill-yellow-400" size={32} /> الأهم في Ninja OS
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

    const StrategicAdvantage = () => (
        <section className="py-24 bg-slate-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-24">
                    <span className="text-brand-600 font-bold bg-brand-100 px-4 py-1.5 rounded-full text-sm tracking-wide">الخلطة السرية</span>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mt-6 mb-8 leading-tight">
                        كيف نصل للفرص قبل <span className="text-brand-600 relative">
                            منافسينك؟
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                            </svg>
                        </span>
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-bold">
                        فريق مخصص لشركتك يدير نظام سعودي متكامل مع أدوات الذكاء الاصطناعي، مع تخصيص الرسائل الموجهة لعميلك المحتمل بشكل احترافي.
                    </p>
                </div>

                <div className="space-y-32">
                    {/* 1. Team */}
                    <TeamComparison />

                    {/* 2. Tech */}
                    <TechStack />

                    {/* 3. Numbers */}
                    <OurNumbers />

                    {/* 4. Agent */}
                    <AIAgentDemo />
                </div>
            </div>
        </section>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-cairo" dir="rtl">
            <Navbar />
            <Hero />
            <ProblemSection />
            <MakeSolution />
            <StrategicAdvantage />
            <ManafethInbound />
            <NinjaOS />
            <Process />
            <AudienceAndFooter />
        </div>
    );
};

export default GrowthSystemPage;
