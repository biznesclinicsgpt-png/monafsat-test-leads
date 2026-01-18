
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, ScanLine, ArrowLeft, CheckCircle2, AlertTriangle, Phone, Mail,
    MessageSquare, Linkedin, Search, BrainCircuit, FileSearch, FileText,
    BarChart3, Zap, Quote, X, Loader2, Sparkles, CheckCircle, AlertCircle,
    Database, Activity, ZapOff, PhoneCall, GitMerge, Cpu, Network, FileCheck,
    Plus, Minus, ArrowDown, MessageCircle
} from 'lucide-react';
// import { GoogleGenAI } from '@google/genai'; // Keeping this commented out to avoid build errors if package missing, using mock for now.

const CTA_LINK = "/app/profile?wizard=true";

// --- TYPES ---
type AnalysisStatus = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';
interface AnalysisResult {
    summary: string;
    score: number;
    recommendations: string[];
}

// --- MOCK AI SERVICE ---
// In a real implementation, you would call your backend endpoint /api/ai/strategy
const analyzeTeamHealth = async (input: string): Promise<AnalysisResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simple mock logic based on input length to vary response slightly
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

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
            <div className="px-4 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="text-brand font-bold text-2xl flex items-center gap-2">
                        <div className="bg-brand text-white p-1.5 rounded-lg">
                            <ScanLine className="w-6 h-6" />
                        </div>
                        <span className="tracking-tight text-gray-900">Ninja<span className="text-brand">Scanner</span></span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8 font-medium text-gray-600 text-sm">
                    <a href="#how-it-works" className="hover:text-brand transition-colors">كيف يعمل؟</a>
                    <a href="#value-prop" className="hover:text-brand transition-colors">الميزات</a>
                    <a href="#testimonials" className="hover:text-brand transition-colors">قصص النجاح</a>
                    <a href="#faq" className="hover:text-brand transition-colors">الأسئلة الشائعة</a>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onStartDiagnosis}
                        className="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-brand/25 transform hover:-translate-y-0.5"
                    >
                        ابدأ التشخيص الآن
                    </button>
                </div>
            </div>
        </nav>
    );
};

const Hero = ({ onStartDiagnosis }: { onStartDiagnosis: () => void }) => {
    return (
        <section className="relative pt-36 pb-20 px-4 overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-b from-slate-50 to-white w-full">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 relative w-full">

                <div className="text-right animate-fade-in-up">
                    <h1 className="text-4xl lg:text-6xl font-black text-gray-900 leading-[1.4] lg:leading-[1.4] mb-8">
                        كم فرصة تفقدها يوميًا لأن <br className="hidden lg:block" />
                        <span className="text-brand inline-block mt-2">قنوات المبيعات</span> عندك غير مستغلة بالكامل؟
                    </h1>

                    <h2 className="text-xl text-gray-600 leading-loose font-medium mb-10 max-w-2xl ml-auto">
                        اكتشف حجم الهدر الحقيقي في WhatsApp وLinkedIn وCalls وEmail... واحصل على تشخيص ذكي يزيد فرصك <span className="font-bold text-gray-900 mx-1">4X</span> باستخدام الأتمتة والذكاء الاصطناعي.
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <button
                            onClick={onStartDiagnosis}
                            className="bg-brand hover:bg-brand-dark text-white text-lg px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-brand/20 flex items-center justify-center gap-3 hover:-translate-y-1 w-full sm:w-auto"
                        >
                            ابدأ التشخيص المجاني الآن
                            <ArrowLeft size={20} />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                            <CheckCircle2 size={18} className="text-brand" />
                            <span className="font-semibold">تحليل 4 قنوات</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                            <CheckCircle2 size={18} className="text-brand" />
                            <span className="font-semibold">خطة تطوير خلال 20-30 دقيقة</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                            <CheckCircle2 size={18} className="text-brand" />
                            <span className="font-semibold">بدون التزام</span>
                        </div>
                    </div>
                </div>

                <div className="relative perspective-1000 lg:mr-auto mt-12 lg:mt-0 w-full flex justify-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-100/50 rounded-full blur-3xl -z-10"></div>

                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 transform rotate-y-6 hover:rotate-0 transition-all duration-700 max-w-md mx-auto w-full">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-6">
                            <span className="font-bold text-gray-800 text-lg">تقرير الأداء العام</span>
                            <span className="bg-red-50 text-red-500 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 border border-red-100">
                                <AlertTriangle size={14} /> انتباه
                            </span>
                        </div>

                        <div className="text-center mb-10">
                            <div className="text-sm text-gray-500 font-semibold mb-2">Score جاهزية الفريق</div>
                            <div className="text-7xl font-black text-brand tracking-tight">42<span className="text-3xl text-gray-300 font-normal">/100</span></div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                                    <MessageSquare size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-gray-800">WhatsApp</span>
                                        <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded text-xs">هدر عالي</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full w-[30%] shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                    <Linkedin size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-gray-800">LinkedIn</span>
                                        <span className="text-yellow-500 font-bold bg-yellow-50 px-2 py-0.5 rounded text-xs">يحتاج تحسين</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full w-[55%] shadow-[0_0_10px_rgba(59,130,246,0.4)]"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
                                    <Phone size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-gray-800">Calls</span>
                                        <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded text-xs">هدر عالي</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-purple-500 h-full w-[25%] shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shadow-sm">
                                    <Mail size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-gray-800">Email</span>
                                        <span className="text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded text-xs">متوسط</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-orange-500 h-full w-[45%] shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>
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

const PainSection = () => {
    return (
        <section className="py-20 bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-12 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                        <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center text-red-500 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                            <Database size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">بيانات القنوات غير مستغلة</h3>
                        <p className="text-gray-600 leading-relaxed">
                            نسبة الرد أقل من 20%؟ هذا يعني أن الفرص تضيع وتتبخر قبل حتى أن تبدأ في المحاولة.
                        </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                        <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center text-red-500 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                            <Activity size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">عدم وجود Engine واضح</h3>
                        <p className="text-gray-600 leading-relaxed">
                            بدون إيقاع (Cadence) ومتابعة دقيقة، ستضيع الـ Leads الساخنة في فوضى العمل اليومي.
                        </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-brand/30 transition-all hover:-translate-y-1 group">
                        <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center text-red-500 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                            <ZapOff size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">غياب الأتمتة</h3>
                        <p className="text-gray-600 leading-relaxed">
                            فريقك يجري كل شيء بشكل يدوي ومرهق، لكن النتائج لا تتغير ولا تتناسب مع الجهد المبذول.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const QuantifiedPain = () => {
    return (
        <section className="py-24 bg-gray-900 text-white overflow-hidden relative w-full">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
                <div className="space-y-10">
                    <h2 className="text-3xl md:text-5xl font-black leading-[1.4] md:leading-[1.5]">
                        الهدر في المبيعات قد يصل إلى <span className="text-red-500 inline-block px-2">70%</span> <br className="hidden md:block" />
                        قبل الوصول إلى الاجتماع الأول
                    </h2>
                    <div className="space-y-8 pt-4">
                        {['LinkedIn', 'WhatsApp', 'Calls', 'Email'].map((channel, i) => (
                            <div key={i} className="flex gap-5 items-start group">
                                <div className="w-3 h-3 rounded-full bg-red-500 mt-2.5 group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
                                <div>
                                    <h4 className="font-bold text-2xl text-white mb-1">{channel}</h4>
                                    <p className="text-gray-400 text-lg leading-relaxed">فقدان فرص محتملة بسبب ضعف الأداء في هذه القناة.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-gray-800 rounded-[2rem] p-10 border border-gray-700 shadow-2xl">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="font-bold text-xl flex items-center gap-3">
                            <div className="bg-gray-700 p-2 rounded-lg"><BarChart3 className="text-brand" size={24} /></div>
                            تحليل الفجوة
                        </h3>
                        <span className="text-sm text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">شهرياً</span>
                    </div>
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between text-base mb-3">
                                <span className="text-gray-300">الفرص المتاحة (Leads)</span>
                                <span className="text-brand font-bold">100%</span>
                            </div>
                            <div className="h-5 bg-gray-700 rounded-full w-full overflow-hidden">
                                <div className="h-full bg-brand rounded-full w-full shadow-[0_0_15px_rgba(45,212,191,0.3)]"></div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="flex justify-between text-base mb-3">
                                <span className="text-gray-300">الفرص الفعلية (Converted)</span>
                                <span className="text-red-400 font-bold">30%</span>
                            </div>
                            <div className="h-5 bg-gray-700 rounded-full w-full overflow-hidden">
                                <div className="h-full bg-red-500 rounded-full w-[30%] shadow-[0_0_15px_rgba(239,68,68,0.3)]"></div>
                            </div>
                            <div className="absolute top-12 right-[30%] left-0 flex items-center justify-center">
                                <div className="bg-gray-900 border border-red-500/50 text-red-400 text-sm px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-bounce">
                                    <ArrowDown size={14} />
                                    <span className="font-bold">70% فجوة هدر</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 bg-gray-900/50 p-6 rounded-2xl border border-gray-700 text-center">
                        <p className="text-base text-gray-300 leading-relaxed">
                            هذا يعني أنك تدفع تكلفة 100% من التسويق لتحصل على 30% فقط من النتائج.
                        </p>
                    </div>
                </div>
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
        <section className="py-24 bg-slate-50 overflow-hidden w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center w-full">
                <div className="order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                        <Sparkles size={16} />
                        <span>المحرك الذكي</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-10 leading-[1.4]">
                        كيف نستخدم <span className="text-brand">الذكاء الاصطناعي</span> لرفع فرصك من 4 مصادر؟
                    </h2>
                    <div className="space-y-8">
                        <div className="flex gap-6 group">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-brand flex-shrink-0 group-hover:bg-brand group-hover:text-white transition-colors">
                                <GitMerge size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl text-gray-900 mb-2">تحليل متقاطع</h4>
                                <p className="text-gray-600 leading-relaxed text-lg">كل قناة تُحلل لوحدها... ثم تحلل مجتمعة لكشف الترابطات الخفية.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 group">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-brand flex-shrink-0 group-hover:bg-brand group-hover:text-white transition-colors">
                                <Cpu size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl text-gray-900 mb-2">أولويات ذكية</h4>
                                <p className="text-gray-600 leading-relaxed text-lg">خوارزميات تحدد بدقة أين تبدأ التحسين لتحصل على أسرع نتائج (Quick Wins).</p>
                            </div>
                        </div>
                        <div className="flex gap-6 group">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-brand flex-shrink-0 group-hover:bg-brand group-hover:text-white transition-colors">
                                <Network size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl text-gray-900 mb-2">Engine موحد</h4>
                                <p className="text-gray-600 leading-relaxed text-lg">ربط WhatsApp + LinkedIn + Email + Calls في نظام واحد متناغم.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="order-1 lg:order-2 flex justify-center">
                    <div className="relative w-full max-w-md aspect-square">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-brand rounded-full flex items-center justify-center shadow-2xl shadow-brand/30 z-20 animate-pulse">
                            <div className="text-white text-center">
                                <Sparkles size={40} className="mx-auto mb-2" />
                                <span className="font-black text-xl">AI Core</span>
                            </div>
                        </div>
                        <div className="absolute inset-12 border-2 border-dashed border-gray-300 rounded-full -z-10 animate-spin-slow"></div>
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
                    <div className="w-full md:w-1/2 relative perspective-1000">
                        <div className="relative z-10 bg-gray-900 rounded-[2rem] p-3 shadow-2xl shadow-gray-900/20 border-b-[12px] border-gray-800 transform rotate-y-6 hover:rotate-0 transition-all duration-700 ease-out">
                            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                            <div className="bg-gray-800 rounded-[1.25rem] overflow-hidden aspect-[16/10] relative">
                                <div className="absolute inset-0 bg-white p-6 flex flex-col">
                                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                                        <div className="w-24 h-4 bg-gray-200 rounded-full"></div>
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mb-4">
                                        <div className="w-1/3 h-24 bg-teal-50 rounded-xl animate-pulse"></div>
                                        <div className="w-1/3 h-24 bg-indigo-50 rounded-xl animate-pulse delay-75"></div>
                                        <div className="w-1/3 h-24 bg-rose-50 rounded-xl animate-pulse delay-150"></div>
                                    </div>
                                    <div className="flex gap-4 flex-1">
                                        <div className="w-2/3 bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col justify-end">
                                            <div className="flex items-end justify-between gap-3 h-32">
                                                {[40, 75, 50, 95, 60, 85].map((h, i) => (
                                                    <div key={i} className="w-full bg-brand rounded-t-md transition-all duration-1000" style={{ height: `${h}%`, opacity: 0.7 + (i * 0.05) }}></div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="w-1/3 bg-gray-50 rounded-xl border border-gray-100 p-3 space-y-2">
                                            <div className="w-full h-2 bg-gray-200 rounded-full"></div>
                                            <div className="w-3/4 h-2 bg-gray-200 rounded-full"></div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full mt-4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 text-right">
                        <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-3 py-1 rounded-md text-sm font-bold mb-6">
                            <Zap size={16} fill="currentColor" />
                            <span>تقنيات متقدمة</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                            نظام متكامل <br />
                            <span className="text-brand">لإدارة الأداء</span>
                        </h2>
                        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                            لا نكتفي بمجرد التحليل، بل نقدم نظاماً بيئياً متكاملاً يربط بين التشخيص والتطوير المستمر لضمان استدامة النتائج.
                        </p>
                        <div className="space-y-8">
                            <div className="flex gap-5 items-start">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center text-brand flex-shrink-0">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl mb-2 text-gray-900">توصيات قابلة للتنفيذ</h4>
                                    <p className="text-gray-500 leading-relaxed">خطوات عملية ومحددة يمكن تطبيقها فوراً لتحسين الأداء الفردي والجماعي.</p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center text-brand flex-shrink-0">
                                    <BarChart3 size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl mb-2 text-gray-900">لوحات بيانات تفاعلية</h4>
                                    <p className="text-gray-500 leading-relaxed">راقب تقدم فريقك لحظة بلحظة من خلال لوحات تحكم ديناميكية وسهلة القراءة.</p>
                                </div>
                            </div>
                        </div>
                    </div>
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
            image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=200&h=200",
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
        <section id="testimonials" className="py-24 bg-slate-50 w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-12 w-full">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
                        قصص <span className="text-brand">نجاح حقيقية</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data.map((t) => (
                        <div key={t.id} className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand/20">
                                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                                    <span className="text-xs text-gray-500">{t.role}</span>
                                </div>
                            </div>
                            {t.result && (
                                <div className="bg-brand/10 text-brand font-bold px-4 py-2 rounded-lg inline-block mb-4 text-sm">
                                    🚀 {t.result}
                                </div>
                            )}
                            <p className="text-gray-600 leading-relaxed text-sm">"{t.quote}"</p>
                        </div>
                    ))}
                </div>
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
                <h2 className="text-3xl font-black text-center text-gray-900 mb-12">الأسئلة المتكررة</h2>
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden transition-all hover:border-brand/50">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                className="w-full flex items-center justify-between p-6 text-right bg-white hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-gray-900 text-lg">{item.q}</span>
                                <span className="text-brand">{openIndex === index ? <Minus size={20} /> : <Plus size={20} />}</span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                                    {item.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FinalCTA = ({ onStartDiagnosis }: { onStartDiagnosis: () => void }) => {
    return (
        <section className="py-24 bg-brand text-white text-center relative overflow-hidden w-full">
            <div className="max-w-4xl mx-auto px-4 relative z-10 w-full">
                <h2 className="text-3xl md:text-5xl font-black mb-10 leading-[1.5]">
                    لا تخسر فرص إضافية هذا الشهر... <br className="hidden md:block" />
                    <span className="text-teal-200 block mt-3">اكشف الهدر الآن وابدأ تحسين قنواتك الأربعة فوراً.</span>
                </h2>
                <button
                    onClick={onStartDiagnosis}
                    className="bg-white text-brand hover:bg-gray-100 text-xl px-14 py-6 rounded-2xl font-black transition-all transform hover:-translate-y-1 shadow-2xl flex items-center justify-center gap-3 mx-auto"
                >
                    🎯 ابدأ التشخيص الآن
                </button>
                <p className="mt-8 text-teal-100 font-medium text-lg opacity-90 tracking-wide">
                    20-30 دقيقة فقط • بدون التزام • تقرير جاهز للتنفيذ
                </p>
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
