
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ScanLine, ArrowLeft, CheckCircle2, AlertTriangle, Phone, Mail,
    MessageSquare, Linkedin, Search, BrainCircuit, FileSearch, FileText,
    BarChart3, Zap, Quote, X, Loader2, Sparkles, CheckCircle, AlertCircle,
    Database, Activity, ZapOff, PhoneCall, GitMerge, Cpu, Network, FileCheck,
    Plus, Minus, ArrowDown, MessageCircle, Menu, TrendingUp, Target, Wallet,
    LayoutDashboard, Settings, Users, Layers, ChevronDown, Building2, Globe, Clock
} from 'lucide-react';

const CTA_LINK = "/app/profile?wizard=true"; // Direct to internal wizard

// --- UTILS ---
const useOnScreen = (options: any): [React.RefObject<HTMLDivElement>, boolean] => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);
        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, [ref, options]);

    return [ref, isVisible];
};

const RevealOnScroll = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    return (
        <div ref={ref} className={`reveal-section ${isVisible ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    );
};

// --- COMPONENTS ---

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="px-4 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <div className="text-brand font-bold text-xl md:text-2xl flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-brand text-white p-1.5 rounded-lg shadow-md group-hover:rotate-12 transition-transform duration-300">
                            <ScanLine className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="tracking-tight text-slate-900">Ninja<span className="text-brand">Scanner</span></span>
                            <span className="text-[10px] text-gold font-bold tracking-widest uppercase">Saudi Edition</span>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8 font-bold text-slate-600 text-sm">
                    {['التحول الرقمي', 'الميزات', 'قصص النجاح', 'الأسئلة الشائعة'].map((item, i) => (
                        <a key={i} href={`#section-${i}`} className="hover:text-brand transition-colors relative group py-2">
                            {item}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-1.5 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg" alt="KSA" className="w-5 h-auto rounded-sm shadow-sm border border-slate-200" />
                        <span className="text-xs font-bold text-brand-900">صنع في السعودية</span>
                    </div>

                    <button
                        onClick={() => navigate(CTA_LINK)}
                        className="hidden md:inline-flex bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 shadow-lg shadow-brand/20 hover:shadow-brand/40 transform hover:-translate-y-0.5"
                    >
                        ابدأ التشخيص المجاني
                    </button>

                    <button
                        className="md:hidden text-slate-800 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-2xl animate-fade-in-up w-full z-50">
                    <div className="flex flex-col p-6 gap-4">
                        {['التحول الرقمي', 'الميزات', 'قصص النجاح', 'الأسئلة الشائعة'].map((item, i) => (
                            <a key={i} href="#" onClick={() => setMobileMenuOpen(false)} className="text-slate-800 text-base font-bold p-2 hover:bg-slate-50 rounded-lg">{item}</a>
                        ))}
                        <button onClick={() => navigate(CTA_LINK)} className="bg-brand text-white text-center py-3 rounded-xl font-bold text-base shadow-lg hover:bg-brand-dark transition-colors w-full block">
                            ابدأ التشخيص الآن
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

const Hero = () => {
    const navigate = useNavigate();
    return (
        <section className="relative pt-28 md:pt-40 pb-16 md:pb-24 px-4 overflow-hidden min-h-[90dvh] flex items-center bg-slate-50 w-full bg-sadu-pattern">
            {/* Background Layers */}
            <div className="absolute top-0 left-0 w-full h-full bg-kingdom-tower bg-cover bg-center bg-no-repeat opacity-5 pointer-events-none grayscale"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-white/90 to-slate-50"></div>

            {/* Vision 2030 Abstract Decoration */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand/5 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10 relative w-full">
                <div className="text-right">
                    <RevealOnScroll>
                        <div className="inline-flex items-center gap-3 bg-white border border-slate-200 pl-4 pr-1 py-1 rounded-full shadow-sm mb-6 hover:shadow-md transition-shadow">
                            <div className="bg-slate-50 p-1.5 rounded-full border border-slate-100">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/23/Saudi_Vision_2030_logo.svg" className="h-6 w-auto" alt="Vision 2030" />
                            </div>
                            <span className="text-slate-600 font-bold text-xs flex items-center gap-1 pl-2">
                                متوافق مع مستهدفات التحول الرقمي
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.4] md:leading-[1.4] mb-6">
                            كم فرصة بيع تخسرها شركتك <br className="hidden lg:block" />
                            شهرياً <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand to-brand-600">بدون ما تدري؟</span>
                        </h1>

                        <h2 className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium mb-8 max-w-2xl ml-auto">
                            <span className="font-bold text-brand">NinjaScanner</span> يكشف فجوات المبيعات الرقمية في شركتك ويعطيك تقريرًا تنفيذيًا وخطة عملية لرفع التحويل خلال <span className="font-bold text-brand bg-brand-50 px-1.5 rounded border border-brand-100">90 يوم</span>.
                        </h2>

                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <button
                                onClick={() => navigate(CTA_LINK)}
                                className="bg-brand hover:bg-brand-dark text-white text-lg px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-2 hover:-translate-y-1 hover:scale-105 w-full sm:w-auto border-b-4 border-brand-900"
                            >
                                🔍 اعرف وين تضيع فرص المبيعات عندك
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs md:text-sm mb-8">
                            <Clock size={16} className="text-gold" />
                            <span>⏱️ 20 دقيقة فقط – تقرير تنفيذي فوري – بدون التزام</span>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs md:text-sm text-slate-600 font-bold">
                            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded border border-slate-100 shadow-sm">
                                <CheckCircle2 size={16} className="text-gold" />
                                <span>مصمم خصيصًا للسوق السعودي</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded border border-slate-100 shadow-sm">
                                <CheckCircle2 size={16} className="text-gold" />
                                <span>مخصص لصنّاع القرار</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded border border-slate-100 shadow-sm">
                                <CheckCircle2 size={16} className="text-gold" />
                                <span>تشخيص مستقل (بدون بيع)</span>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>

                <div className="relative perspective-1000 lg:mr-auto mt-8 lg:mt-0 w-full flex justify-center">
                    <RevealOnScroll delay={200} className="w-full max-w-lg">
                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-brand/20 to-gold/20 rounded-full blur-[80px] -z-10"></div>

                        {/* Mockup Container */}
                        <div className="bg-[#0F172A] rounded-[2rem] shadow-2xl border border-slate-700/50 transform rotate-y-6 hover:rotate-0 transition-all duration-700 w-full overflow-hidden animate-float">

                            {/* Dashboard Header */}
                            <div className="bg-[#1E293B]/90 backdrop-blur-md px-5 py-4 flex justify-between items-center border-b border-slate-700/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-brand/20">
                                        <ScanLine size={16} />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-xs">Ninja Scanner</div>
                                        <div className="text-slate-400 text-[10px]">Saudi Enterprise Edition</div>
                                    </div>
                                </div>
                                <div className="bg-emerald-900/50 text-emerald-400 text-[10px] px-2 py-1 rounded border border-emerald-800 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                    Connected
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Score Section with Gold Accent */}
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <div className="text-slate-400 text-xs mb-0.5">مؤشر الجاهزية الرقمية</div>
                                        <h3 className="text-white font-bold text-lg">Digital Readiness</h3>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-white leading-none">41<span className="text-sm text-slate-500 font-medium">/100</span></div>
                                        <div className="text-red-400 text-[10px] font-bold mt-1 bg-red-500/10 px-2 py-0.5 rounded-full inline-block border border-red-500/20">يحتاج تطوير ⚠️</div>
                                    </div>
                                </div>

                                {/* Radar Chart Visual */}
                                <div className="relative h-48 mb-8 flex items-center justify-center bg-[#1E293B]/50 rounded-2xl border border-slate-700/50">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                        <div className="w-32 h-32 border border-brand rounded-full"></div>
                                        <div className="w-20 h-20 border border-brand rounded-full absolute"></div>
                                    </div>

                                    <svg viewBox="0 0 200 180" className="w-full h-full absolute drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                        <polygon points="100,60 140,90 120,130 80,150 50,90" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" strokeWidth="2" />
                                        <circle cx="100" cy="60" r="3" fill="#10B981" />
                                        <circle cx="140" cy="90" r="3" fill="#10B981" />
                                        <circle cx="120" cy="130" r="3" fill="#10B981" />
                                        <circle cx="80" cy="150" r="3" fill="#10B981" />
                                        <circle cx="50" cy="90" r="3" fill="#10B981" />
                                    </svg>

                                    {/* Labels localized */}
                                    <div className="absolute top-2 text-[10px] font-bold text-slate-300">استراتيجية العرض</div>
                                    <div className="absolute right-4 text-[10px] font-bold text-slate-300">البيانات</div>
                                    <div className="absolute bottom-4 right-8 text-[10px] font-bold text-slate-300">المحرك</div>
                                    <div className="absolute bottom-4 left-8 text-[10px] font-bold text-slate-300">الفريق</div>
                                    <div className="absolute left-4 text-[10px] font-bold text-slate-300">العقلية</div>
                                </div>

                                {/* Progress Bars with Brand Colors */}
                                <div className="space-y-4">
                                    {[
                                        { l: "جودة البيانات (CRM)", v: 60, c: "bg-emerald-500" },
                                        { l: "محرك المبيعات (Outbound)", v: 30, c: "bg-gold" },
                                        { l: "كفاءة الفريق (Team)", v: 45, c: "bg-red-500" },
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                                                <span>{item.l}</span>
                                                <span className="text-white font-mono">{item.v}%</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div className={`h-full ${item.c} shadow-lg`} style={{ width: `${item.v}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-400/50">
                <ChevronDown size={24} />
            </div>
        </section>
    );
};

const PainSection = () => {
    return (
        <section id="section-0" className="py-20 md:py-28 bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-12 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                    {[
                        { icon: Database, title: "بيانات مهدرة", desc: "بيانات العملاء موجودة… لكن غير مستخدمة لاتخاذ قرار." },
                        { icon: Activity, title: "غياب الإيقاع (Cadence)", desc: "غياب نظام متابعة واضح يجعل العملاء يبردون قبل إغلاق الصفقة." },
                        { icon: ZapOff, title: "عمل يدوي مرهق", desc: "فريق المبيعات يضيع وقته في مهام تشغيلية بدل إغلاق الصفقات." }
                    ].map((item, i) => (
                        <div key={i} className="h-full">
                            <RevealOnScroll delay={i * 150} className="h-full">
                                <div className="bg-slate-50 p-6 md:p-8 rounded-[1.5rem] border border-slate-100 hover:border-gold/30 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-gold/5 h-full group">
                                    <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center text-brand shadow-lg shadow-brand/10 mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-50">
                                        <item.icon size={28} className="group-hover:text-gold transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-base">
                                        {item.desc}
                                    </p>
                                </div>
                            </RevealOnScroll>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const QuantifiedPain = () => {
    return (
        <section className="py-20 md:py-28 bg-brand-900 text-white overflow-hidden relative w-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="absolute inset-0 bg-brand-900/95"></div>
            {/* Gold Accents */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/30 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10 w-full">
                <RevealOnScroll className="space-y-8">
                    <h2 className="text-3xl md:text-5xl font-black leading-tight">
                        <span className="text-gold inline-block px-1">70%</span> من ميزانية التسويق <br className="hidden md:block" />
                        قد تضيع بسبب فجوات غير مرئية في المبيعات
                    </h2>
                    <div className="space-y-6 pt-2">
                        <div className="flex gap-5 items-center group bg-white/5 p-4 rounded-xl border border-white/5 hover:border-gold/30 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center group-hover:bg-gold transition-colors shadow-lg">
                                <AlertTriangle size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-slate-100 font-bold text-lg">الإعلانات ليست المشكلة...</p>
                                <p className="text-slate-400 text-sm">المشكلة في ما يحدث بعد وصول العميل.</p>
                            </div>
                        </div>
                    </div>
                </RevealOnScroll>

                <RevealOnScroll delay={200}>
                    <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-6 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">

                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <h3 className="font-bold text-xl flex items-center gap-3">
                                <div className="bg-brand p-2.5 rounded-lg shadow-lg"><BarChart3 className="text-white" size={20} /></div>
                                تحليل الفجوة المالية
                            </h3>
                            <span className="text-xs font-bold text-gold bg-gold/10 border border-gold/20 px-3 py-1.5 rounded-full">تقرير شهري</span>
                        </div>
                        <div className="space-y-8 relative z-10">
                            <div>
                                <div className="flex justify-between text-base font-medium mb-3">
                                    <span className="text-slate-300">الفرص المتاحة (Leads)</span>
                                    <span className="text-brand-100 font-bold text-lg">100%</span>
                                </div>
                                <div className="h-4 bg-slate-800 rounded-full w-full overflow-hidden border border-slate-700">
                                    <div className="h-full bg-brand rounded-full w-full shadow-[0_0_20px_rgba(16,185,129,0.4)]"></div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="flex justify-between text-base font-medium mb-3">
                                    <span className="text-slate-300">التحويل الفعلي (Conversion)</span>
                                    <span className="text-red-400 font-bold text-lg">30%</span>
                                </div>
                                <div className="h-4 bg-slate-800 rounded-full w-full overflow-hidden border border-slate-700">
                                    <div className="h-full bg-red-500 rounded-full w-[30%] shadow-[0_0_20px_rgba(239,68,68,0.4)] relative">
                                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="absolute top-10 right-[15%] left-0 flex items-center justify-center pointer-events-none">
                                    <div className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl whitespace-nowrap animate-bounce border border-white/20">
                                        <ArrowDown size={14} />
                                        <span className="font-black">70% هدر في الميزانية</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 bg-white/5 p-5 rounded-xl border border-white/10 text-center relative z-10">
                            <p className="text-base text-slate-300 leading-relaxed font-medium">
                                هذا يعني أنك تدفع <span className="text-white font-bold">كامل التكلفة</span> لتحصل على <span className="text-red-400 font-bold">ثلث النتائج</span> فقط.
                            </p>
                        </div>
                    </div>
                </RevealOnScroll>
            </div>
        </section>
    );
};

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand selection:text-white scroll-smooth w-full overflow-x-hidden" dir="rtl">
            <Navbar />
            <main className="w-full overflow-x-hidden">
                <Hero />
                <PainSection />
                <QuantifiedPain />
                {/* We can add more sections here (ValueProp, AI, Testimonials) if needed, 
              but for now this covers the core "Ninja Scanner" experience requested */}
            </main>
            <footer className="bg-slate-900 text-white py-12 border-t border-slate-800 w-full bg-sadu-pattern relative">
                <div className="absolute inset-0 bg-slate-900/95"></div>
                <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 w-full relative z-10">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                            <ScanLine className="text-brand" />
                            BiznesClinics
                        </div>
                        <span className="text-xs text-slate-400">Saudi Smart Era: Powered by Odoo</span>
                    </div>
                    <div className="flex gap-6 text-slate-400 font-medium text-sm">
                        <a href="#" className="hover:text-gold transition-colors">سياسة الخصوصية</a>
                        <a href="#" className="hover:text-gold transition-colors">الشروط والأحكام</a>
                    </div>
                    <div className="text-slate-500 text-xs flex items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg" className="w-4 h-3 rounded-sm opacity-50" alt="Saudi Flag" />
                        جميع الحقوق محفوظة © 2025
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
