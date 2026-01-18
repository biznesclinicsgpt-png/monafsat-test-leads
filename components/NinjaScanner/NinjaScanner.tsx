
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, Calculator, FileText, LayoutDashboard, Lightbulb,
    Download, Printer, Building2, DollarSign, Flame, Zap, Users,
    Database, Target, Search, Mail, Linkedin, Phone, MessageCircle,
    Sun, Moon, Save, ArrowRight, ArrowLeft, CheckCircle, Sparkles,
    Trophy, AlertTriangle, Play, Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

import {
    INITIAL_STATE, INDUSTRIES, COUNTRIES, WHY_NOW_OPTIONS,
    LEAK_OPTIONS, TITLES_OPTIONS, COMPANY_SIZE_OPTIONS
} from './constants';

import { NinjaFormData } from './types';
import { calculateResults, fmtCurrency, getStatusColor } from './utils';
import { InputGroup } from './components/InputGroup';
import { RadarChart, FunnelChart } from './components/Charts';
import { PDFReport } from './components/PDFReport';
import { useData } from '../../context/DataContext';

// Define TS for html2pdf
declare global {
    interface Window {
        html2pdf: () => any;
    }
}

const STEPS = [
    { title: "المقدمة", icon: Sparkles },
    { title: "الهوية", icon: Building2 },
    { title: "الحجم", icon: DollarSign },
    { title: "الاستراتيجية", icon: Target },
    { title: "التحديات", icon: AlertTriangle },
    { title: "التحليل", icon: Calculator },
    { title: "النتائج", icon: Trophy }
];

// Animation Variants
const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.95
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.95
    })
};

const NinjaScanner = () => {
    const { providerProfile, updateProviderProfile } = useData();
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(0);
    const [formData, setFormData] = useState<NinjaFormData>(INITIAL_STATE);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const pdfRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Results Tab within the Final Step
    const [resultTab, setResultTab] = useState<'kpis' | 'scores' | 'recs' | 'pdf'>('scores');

    const results = useMemo(() => calculateResults(formData), [formData]);

    // Load from Profile on Mount
    useEffect(() => {
        if (providerProfile?.ninja_diagnosis) {
            setFormData(prev => ({ ...prev, ...providerProfile.ninja_diagnosis }));
            // If already completed, go to results? No, let them restart or maybe show intro?
            // For now, start at 0 but with data filled.
        } else if (providerProfile) {
            setFormData(prev => ({
                ...prev,
                companyName: providerProfile.company_name || prev.companyName,
                industry: providerProfile.industries?.[0]?.name || prev.industry,
                country: providerProfile.headquarters_country || prev.country
            }));
        }
        document.documentElement.classList.add('dark');
    }, [providerProfile]);

    useEffect(() => {
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    const updateField = (field: keyof NinjaFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (step < STEPS.length - 1) {
            setDirection(1);
            setStep(s => s + 1);
        }
    };

    const prevStep = () => {
        if (step > 0) {
            setDirection(-1);
            setStep(s => s - 1);
        }
    };

    // Auto-advance analysis step
    useEffect(() => {
        if (step === 5) {
            const timer = setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                nextStep();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleSaveToProfile = () => {
        setIsSaving(true);
        setTimeout(() => {
            if (!providerProfile) {
                // Save complete deep data for Guest
                localStorage.setItem('ninja_guest_data', JSON.stringify(formData));
                window.location.href = '/app/profile?wizard=true';
                return;
            }
            if (providerProfile) {
                const updated = {
                    ...providerProfile,
                    ninja_diagnosis: formData,
                    company_name: formData.companyName || providerProfile.company_name,
                    headquarters_country: formData.country || providerProfile.headquarters_country,
                    website: formData.website || providerProfile.website,

                    // Deep ICP Sync
                    icp_structured: {
                        ...providerProfile.icp_structured,
                        company_size_ideal: formData.icpCompanySize.length > 0 ? formData.icpCompanySize : providerProfile.icp_structured?.company_size_ideal,
                        decision_makers: formData.icpTitles.length > 0 ? formData.icpTitles : providerProfile.icp_structured?.decision_makers,
                        industries: formData.icpIndustries.length > 0 ? formData.icpIndustries : providerProfile.icp_structured?.industries,
                        buying_triggers: formData.whyNow ? [formData.whyNow] : providerProfile.icp_structured?.buying_triggers
                    },

                    // Assets & Readiness Sync (For Admin/Search Engines)
                    assets_readiness: {
                        has_profile: formData.hasCompanyProfile,
                        has_deck: formData.hasPitchDeck,
                        has_pricing: formData.hasPricingFile,
                        has_website: formData.hasProfessionalWebsite,
                        has_social: formData.hasSocialPresence
                    },

                    // Profile enrichment
                    founded_year: formData.companyAge > 0 ? (new Date().getFullYear() - formData.companyAge) : providerProfile.founded_year
                };
                updateProviderProfile(updated);
                alert('عظيم! تم حفظ تحليل النينجا وتحديث ملفك بنجاح 🥷💾');
            }
            setIsSaving(false);
        }, 800);
    };

    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        // ... (Keep existing PDF logic)
        let html2pdf = (window as any).html2pdf;
        if (!html2pdf) {
            try {
                const module = await import('html2pdf.js');
                html2pdf = module.default;
            } catch (e) { }
        }
        if (!pdfRef.current || !html2pdf) {
            alert('PDF Library Loading...');
            setIsGenerating(false);
            return;
        }
        const element = pdfRef.current;
        const companyName = formData.companyName || 'Company';
        const today = new Date().toISOString().split('T')[0];
        const filename = `Ninja-Report-${companyName.replace(/\s+/g, '-')}-${today}.pdf`;
        const opt = {
            margin: 10,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        html2pdf().set(opt).from(element).save().then(() => setIsGenerating(false)).catch(() => setIsGenerating(false));
    };

    // --- RENDER STEPS ---

    const renderIntro = () => (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border-4 border-emerald-500/20"
            >
                <div className="text-6xl">🥷</div>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                هل أنت مستعد لمضاعفة أرقامك؟
            </h1>
            <p className="text-xl text-slate-500 dark:text-gray-400 max-w-2xl mb-12 leading-relaxed">
                في أقل من 3 دقائق، سنقوم بتشخيص كامل لعملية المبيعات لديك، نحدد الثغرات، ونعطيك خطة عمل جاهزة للتنفيذ. بدون مجاملات، فقط أرقام وحقائق.
            </p>
            <button onClick={nextStep} className="group relative px-12 py-5 bg-emerald-500 hover:bg-emerald-600 rounded-full text-white font-black text-xl shadow-2xl shadow-emerald-500/40 transition-all hover:scale-105 flex items-center gap-3 overflow-hidden">
                <span className="relative z-10">🚀 ابدأ التشخيص الآن</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
            </button>
            <div className="mt-8 flex gap-8 text-sm text-gray-500 font-bold opacity-60">
                <span className="flex items-center gap-1"><CheckCircle size={14} /> مجاني 100%</span>
                <span className="flex items-center gap-1"><CheckCircle size={14} /> تقرير سري</span>
                <span className="flex items-center gap-1"><CheckCircle size={14} /> نتائج فورية</span>
            </div>
        </div>
    );

    const renderIdentity = () => (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold dark:text-white mb-2">لنبدأ بالأساسيات 🏗️</h2>
                <p className="text-gray-500">عرّفنا بشركتك لنقارنك بالسوق بشكل صحيح.</p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl">
                <InputGroup label="1. اسم الشركة" id="n" value={formData.companyName} onChange={v => updateField('companyName', v)} />
                <div className="h-4"></div>
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="2. الصناعة" id="ind" type="select" options={['--', ...INDUSTRIES]} value={formData.industry} onChange={v => updateField('industry', v)} />
                    <InputGroup label="3. البلد" id="co" type="select" options={['--', ...COUNTRIES]} value={formData.country} onChange={v => updateField('country', v)} />
                </div>
                <div className="h-4"></div>
                <InputGroup label="4. الموقع الإلكتروني (Website)" id="web" value={formData.website} onChange={v => updateField('website', v)} />
                <div className="h-4"></div>
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="عمر الشركة (سنوات)" id="age" type="number" value={formData.companyAge} onChange={v => updateField('companyAge', v)} />
                    <InputGroup label="مستوى التخصص (1-10)" id="spec" type="number" value={formData.specializationFocus} onChange={v => updateField('specializationFocus', v)} />
                </div>
                <p className="text-xs text-gray-400 mt-2">* التخصص: هل تقدم خدمات محددة جداً لعملاء محددين؟ (10 = تخصص دقيق)</p>
            </div>
        </div>
    );

    // ... renderScale unchanged ...
    const renderScale = () => (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold dark:text-white mb-2">لنتحدث بلغة الأرقام 📊</h2>
                <p className="text-gray-500">حجم الفريق والأهداف المالية يحدد قواعد اللعبة.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg">
                    <h3 className="font-bold mb-4 flex items-center gap-2 dark:text-emerald-400"><DollarSign size={18} /> الأهداف المالية</h3>
                    <InputGroup label="الهدف الشهري (SAR)" id="tgt" type="number" value={formData.monthlyTarget} onChange={v => updateField('monthlyTarget', v)} />
                    <div className="h-4"></div>
                    <InputGroup label="متوسط قيمة الصفقة (SAR)" id="deal" type="number" value={formData.avgDealSize} onChange={v => updateField('avgDealSize', v)} />
                </div>

                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg">
                    <h3 className="font-bold mb-4 flex items-center gap-2 dark:text-blue-400"><Users size={18} /> قوة الفريق</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="SDRs" id="sdr" type="number" value={formData.sdrs} onChange={v => updateField('sdrs', v)} />
                        <InputGroup label="AEs" id="ae" type="number" value={formData.aes} onChange={v => updateField('aes', v)} />
                    </div>
                </div>
            </div>
        </div>
    );


    const renderStrategy = () => (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold dark:text-white mb-2">الجاهزية والأدوات 🛠️</h2>
                <p className="text-gray-500">هل تمتلك الأسلحة اللازمة للمعركة؟</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assets Checklist (Original Request: Deck, Pricing, Website, etc) */}
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg">
                    <h3 className="font-bold mb-4 text-violet-500">📁 الملفات والأصول (Assets)</h3>
                    <div className="space-y-4">
                        <InputGroup label="ملف تعريفي (Company Profile)" id="prf" type="toggle" value={formData.hasCompanyProfile} onChange={v => updateField('hasCompanyProfile', v)} />
                        <InputGroup label="عرض بيعي قصصي (Sales Deck)" id="dck" type="toggle" value={formData.hasPitchDeck} onChange={v => updateField('hasPitchDeck', v)} />
                        <InputGroup label="ملف تسعير (ROI-Based)" id="prc" type="toggle" value={formData.hasPricingFile} onChange={v => updateField('hasPricingFile', v)} />
                        <InputGroup label="موقع إلكتروني احترافي" id="web_ex" type="toggle" value={formData.hasProfessionalWebsite} onChange={v => updateField('hasProfessionalWebsite', v)} />
                        <InputGroup label="تواجد قوي (LinkedIn/Twitter)" id="soc" type="toggle" value={formData.hasSocialPresence} onChange={v => updateField('hasSocialPresence', v)} />
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg">
                    <h3 className="font-bold mb-4 text-rose-500">🤖 التقنية والعمليات</h3>
                    <div className="space-y-4">
                        <InputGroup label="Sales Navigator (مفعل)" id="nav" type="toggle" value={formData.hasSalesNavigator} onChange={v => updateField('hasSalesNavigator', v)} />
                        <InputGroup label="تسجيل المكالمات (للتدريب)" id="rec" type="toggle" value={formData.recordsCalls} onChange={v => updateField('recordsCalls', v)} />
                        <InputGroup label="تحليل المحادثات (AI)" id="anl" type="toggle" value={formData.analyzesConversations} onChange={v => updateField('analyzesConversations', v)} />
                        <InputGroup label="استخدام AI Agents" id="aia" type="toggle" value={formData.usesAIAgents} onChange={v => updateField('usesAIAgents', v)} />
                        <InputGroup label="رسائل مخصصة (Hyper-Personalized)" id="hyp" type="toggle" value={formData.hyperPersonalized} onChange={v => updateField('hyperPersonalized', v)} />
                    </div>
                </div>
            </div>

            {/* Outbound Quick Stats - THE 100 CLUB */}
            <div className="bg-slate-100 dark:bg-white/5 p-6 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
                <h3 className="font-bold mb-4 text-center">نشاط الفريق الحالي (يومياً) - نادي الـ 100 💯</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InputGroup label="📞 Calls" id="c_vol" type="number" value={formData.dailyCalls} onChange={v => updateField('dailyCalls', v)} />
                    <InputGroup label="💬 WhatsApp" id="w_vol" type="number" value={formData.dailyWhatsapp} onChange={v => updateField('dailyWhatsapp', v)} />
                    <InputGroup label="🔗 LinkedIn" id="l_vol" type="number" value={formData.dailyLinkedin} onChange={v => updateField('dailyLinkedin', v)} />
                    <InputGroup label="📧 Emails" id="e_vol" type="number" value={formData.dailyEmails} onChange={v => updateField('dailyEmails', v)} />
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">كم محاولة يقوم بها كل بائع يومياً في كل قناة؟</p>
            </div>
        </div>
    );

    // ... renderPain unchanged ... 
    const renderPain = () => (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold dark:text-white mb-2">الأداء الحالي 📉</h2>
                <p className="text-gray-500">أين تقف الآن من حيث النتائج؟</p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Leads شهرياً" id="lds" type="number" value={formData.leadsPerMonth} onChange={v => updateField('leadsPerMonth', v)} />
                    <InputGroup label="Leads مؤهلة (SQLs)" id="sql" type="number" value={formData.meetingsPerMonth} onChange={v => updateField('meetingsPerMonth', v)} />
                    <InputGroup label="عروض أسعار (Proposals)" id="prp" type="number" value={formData.proposalsPerMonth} onChange={v => updateField('proposalsPerMonth', v)} />
                    <InputGroup label="صفقات مغلقة (Won)" id="won" type="number" value={formData.closedWonPerMonth} onChange={v => updateField('closedWonPerMonth', v)} />
                </div>

                <div className="h-4"></div>
                <InputGroup label="لماذا الآن؟ (Why Now)" id="why" type="select" options={['--', ...WHY_NOW_OPTIONS]} value={formData.whyNow} onChange={v => updateField('whyNow', v)} />
            </div>
        </div>
    );
    // ... renderAnalysis unchanged ...
    const renderAnalysis = () => (
        <div className="flex flex-col items-center justify-center text-center py-20 h-full">
            <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-40 h-40 mb-8 relative"
            >
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
                <div className="absolute inset-0 rounded-full border-t-4 border-emerald-500 animate-spin"></div>
                <div className="absolute inset-4 rounded-full border-4 border-cyan-500/20"></div>
                <div className="absolute inset-4 rounded-full border-r-4 border-cyan-500 animate-spin-reverse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={40} className="text-white animate-pulse" />
                </div>
            </motion.div>
            <h2 className="text-3xl font-black text-white mb-4 animate-pulse">جاري تحليل بيانات النينجا...</h2>
            <div className="space-y-2 text-gray-400 font-mono text-sm">
                <p>Checking Asset Readiness...</p>
                <p>Benchmarking vs Top 1%...</p>
                <p>Analyzing Funnel Leaks...</p>
            </div>
        </div>
    );

    const renderResults = () => {
        const ResultTabBtn = ({ id, label, icon: Icon }: any) => (
            <button
                onClick={() => setResultTab(id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${resultTab === id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
                <Icon size={18} /> {label}
            </button>
        );

        return (
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black dark:text-white mb-2">تقرير النينجا الاستراتيجي 🥷</h2>
                    <p className="text-gray-500">حقيقتك الرقمية + خطة السيطرة على السوق.</p>
                </div>

                <div className="flex justify-center flex-wrap gap-4 mb-10">
                    <ResultTabBtn id="scores" label="النتيجة الشاملة" icon={Trophy} />
                    <ResultTabBtn id="kpis" label="تحليل الفجوات" icon={BarChart3} />
                    <ResultTabBtn id="recs" label="التوصيات والحلول" icon={Lightbulb} />
                    <ResultTabBtn id="pdf" label="تصدير (PDF)" icon={Download} />
                </div>

                <div className="bg-gray-900/60 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/10 min-h-[600px] shadow-2xl">
                    {resultTab === 'scores' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Main Score */}
                            <div className="lg:col-span-4 text-center bg-white/5 rounded-3xl p-8 border border-white/5">
                                <h3 className="text-lg font-bold text-gray-400 mb-6">مؤشر الجاهزية</h3>
                                <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full border-8 border-white/5"></div>
                                    <div className={`absolute inset-0 rounded-full border-8 border-emerald-500`} style={{ clipPath: `polygon(0 0, 100% 0, 100% ${results.scores.overallScore}%, 0 ${results.scores.overallScore}%)` }}></div>
                                    <div className="text-6xl font-black text-white">{results.scores.overallScore}</div>
                                </div>
                                <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                                    {results.scores.tierLabel}
                                </div>
                            </div>

                            {/* Deep Analysis Grid */}
                            <div className="lg:col-span-8 space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: "الأصول (Assets)", score: results.scores.teamScore, icon: "📂" },
                                        { label: "النشاط (Volume)", score: results.scores.outboundScore, icon: "🔥" },
                                        { label: "التقنية (Tech)", score: results.scores.crmScore, icon: "🤖" },
                                        { label: "الاستراتيجية (Fit)", score: results.scores.icpScore, icon: "🎯" }
                                    ].map((stat, idx) => (
                                        <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl">{stat.icon}</span>
                                                <span className="font-bold text-gray-300">{stat.label}</span>
                                            </div>
                                            <div className={`text-2xl font-black ${getStatusColor(stat.score, 80, 50).split(' ')[0]}`}>
                                                {stat.score}%
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Benchmark Comparison */}
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <Target size={18} className="text-rose-500" />
                                        مقارنة مع المعيار العالمي (The 100 Club)
                                    </h4>
                                    <div className="space-y-4">
                                        {[
                                            { l: 'Calls', v: formData.dailyCalls, t: 100 },
                                            { l: 'WhatsApp', v: formData.dailyWhatsapp, t: 100 },
                                            { l: 'LinkedIn', v: formData.dailyLinkedin, t: 100 },
                                            { l: 'Emails', v: formData.dailyEmails, t: 100 }
                                        ].map((b, i) => (
                                            <div key={i} className="flex items-center gap-4 text-sm">
                                                <div className="w-24 font-bold text-gray-400">{b.l}</div>
                                                <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                                                    <div className={`h-full ${b.v >= b.t ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min((b.v / b.t) * 100, 100)}%` }}></div>
                                                </div>
                                                <div className="w-16 font-mono text-white text-right">{b.v}/{b.t}</div>
                                                <div className="w-6">
                                                    {b.v >= b.t ? <CheckCircle size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-rose-500" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {resultTab === 'recs' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto px-2">
                            {results.recommendations.map((rec, i) => (
                                <div key={i} className={`p-6 rounded-2xl border ${rec.type === 'critical' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-white/5 border-white/5'} hover:bg-white/10 transition-colors`}>
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl bg-white/10 p-3 rounded-xl">{rec.icon}</div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                {rec.type === 'critical' && <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">CRITICAL</span>}
                                                <h4 className="font-bold text-white text-lg">{rec.title}</h4>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-3">{rec.problem}</p>
                                            <p className="text-emerald-400 font-bold text-sm bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                                                💡 {rec.solution}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {resultTab === 'kpis' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-6">Funnel Analysis</h3>
                                <FunnelChart kpis={results.kpis} leads={formData.leadsPerMonth || 100} won={formData.closedWonPerMonth || 1} />
                            </div>
                            <div className="grid grid-cols-2 gap-4 content-start">
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
                                    <div className="text-gray-400 text-sm mb-2 font-bold">Sales Velocity</div>
                                    <div className="text-2xl font-black text-emerald-400">{fmtCurrency(results.kpis.salesVelocity)}/mo</div>
                                </div>
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
                                    <div className="text-gray-400 text-sm mb-2 font-bold">Win Rate</div>
                                    <div className="text-2xl font-black text-white">{results.kpis.winRate.toFixed(1)}%</div>
                                </div>
                                <div className="col-span-2 p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
                                    <div className="text-gray-400 text-sm mb-2 font-bold">Revenue Gap</div>
                                    <div className="text-3xl font-black text-rose-500">{fmtCurrency(results.kpis.revenueGap)}</div>
                                    <p className="text-xs text-gray-500 mt-2">الفرق بين الهدف والمتوقع</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {resultTab === 'pdf' && (
                        <div className="text-center py-20">
                            <FileText size={80} className="mx-auto text-emerald-500 mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-4">تقرير احترافي جاهز</h3>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">قم بتحميل التقرير الكامل بصيغة PDF لمشاركته مع فريقك، يحتوي على التحليل التفصيلي وخطة العمل.</p>
                            <button onClick={handleDownloadPDF} disabled={isGenerating} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2 mx-auto">
                                {isGenerating ? <Loader2 className="animate-spin" /> : <Download />}
                                {isGenerating ? 'جاري التحضير...' : 'تحميل التقرير (PDF)'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };


    return (
        <div className={`min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-gray-100 font-sans selection:bg-emerald-500/30 transition-colors duration-300 w-full ${theme}`} dir="rtl">
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.10),transparent)] pointer-events-none" />

            {/* Header & Nav */}
            <header className="relative z-50 p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="font-black text-2xl flex items-center gap-2">
                    <span>🥷</span>
                    <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">NinjaScanner</span>
                </div>
                <button onClick={toggleTheme} className="p-2 rounded-full bg-white/5 hover:bg-white/10">{theme === 'dark' ? <Sun /> : <Moon />}</button>
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 min-h-[500px] flex flex-col justify-center">
                {/* Progress Bar (Only visible steps 1-5) */}
                {step > 0 && step < 6 && (
                    <div className="max-w-xl mx-auto w-full mb-12">
                        <div className="flex justify-between text-xs font-bold text-emerald-500 mb-2 uppercase tracking-widest">
                            <span>Step {step}</span>
                            <span>{STEPS[step].title}</span>
                            <span>{Math.round((step / 5) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-emerald-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${(step / 5) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                )}

                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={step}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ opacity: { duration: 0.2 }, x: { type: "spring", stiffness: 300, damping: 30 } }}
                        className="w-full"
                    >
                        {step === 0 && renderIntro()}
                        {step === 1 && renderIdentity()}
                        {step === 2 && renderScale()}
                        {step === 3 && renderStrategy()}
                        {step === 4 && renderPain()}
                        {step === 5 && renderAnalysis()}
                        {step === 6 && renderResults()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Navigation Footer (Steps 1-4) */}
            {step > 0 && step < 5 && (
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 z-40">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <button onClick={prevStep} className="flex items-center gap-2 text-gray-500 hover:text-white font-bold px-6 py-3 rounded-xl hover:bg-white/5 transition-colors">
                            <ArrowRight size={20} /> السابق
                        </button>

                        <div className="flex gap-2">
                            {/* Dots */}
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === step ? 'bg-emerald-500' : 'bg-gray-700'}`} />
                            ))}
                        </div>

                        <button onClick={nextStep} className="flex items-center gap-2 bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-500/20">
                            التالي <ArrowLeft size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Save Button in Results */}
            {step === 6 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
                    <button onClick={handleSaveToProfile} disabled={isSaving} className="flex items-center gap-3 bg-white text-emerald-600 font-bold px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform">
                        {isSaving ? <span className="animate-spin">⏳</span> : <Save />}
                        <span>{isSaving ? 'جاري الحفظ...' : 'حفظ النتائج في ملفي'}</span>
                    </button>
                </div>
            )}

            {/* Hidden PDF Container */}
            <PDFReport data={formData} results={results} reportRef={pdfRef} />
        </div>
    );
};

export default NinjaScanner;
