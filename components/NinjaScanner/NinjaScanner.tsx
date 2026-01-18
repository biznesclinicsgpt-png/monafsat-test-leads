
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, Calculator, FileText, LayoutDashboard, Lightbulb,
    Download, Printer, Building2, DollarSign, Flame, Zap, Users,
    Database, Target, Search, Mail, Linkedin, Phone, MessageCircle,
    Sun, Moon, Save, ArrowRight, ArrowLeft, CheckCircle, Sparkles,
    Trophy, AlertTriangle, Play, Loader2, Filter
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
import { SelectionCard, ToggleCard, VisualSlider } from './components/Interactions';
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
        <div className="flex flex-col items-center justify-center text-center py-12 md:py-20 relative overflow-hidden">
            {/* Background Matrix Effect (Simulated) */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 text-xs font-mono text-emerald-500">INIT_SYSTEM... OK</div>
                <div className="absolute top-20 right-20 text-xs font-mono text-emerald-500">LOADING_MODULES... 100%</div>
                <div className="absolute bottom-10 left-1/3 text-xs font-mono text-emerald-500">SCANNING_PORTS...</div>
            </div>

            <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-auto h-24 md:h-32 flex items-center justify-center mb-8 relative z-10"
            >
                <img src="/logo_full.png" alt="BiznesClinics" className="h-full w-auto object-contain drop-shadow-2xl" />
            </motion.div>

            <div className="relative z-10 max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-mono text-sm mb-6"
                >
                    System Status: <span className="animate-pulse font-bold">READY_TO_SCAN</span>
                </motion.div>

                <h1 className="text-4xl md:text-7xl font-black mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent leading-tight">
                    هل أنت مستعد <br />
                    <span className="text-emerald-500">لمضاعفة أرقامك؟</span>
                </h1>

                <div className="bg-slate-900 text-slate-300 font-mono text-right p-6 rounded-xl border border-slate-700 shadow-2xl max-w-2xl mx-auto mb-12 text-sm md:text-base leading-relaxed overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
                    <p className="typing-effect">
                        {">"} جاري تهيئة نظام الفحص... <br />
                        {">"} الهدف: كشف ثغرات المبيعات الخفية. <br />
                        {">"} المدة المتوقعة: 180 ثانية. <br />
                        <span className="text-emerald-400 font-bold">{">"} هل تسمح لنا بالدخول؟</span> <span className="animate-pulse">_</span>
                    </p>
                </div>
            </div>

            <button onClick={nextStep} className="group relative px-12 py-5 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-black text-xl shadow-2xl shadow-emerald-500/40 transition-all hover:scale-105 flex items-center gap-3 overflow-hidden z-10 hover:skew-x-3">
                <Zap className="fill-white group-hover:animate-bounce" />
                <span className="relative z-10">ابدأ التشخيص الآن 🚀</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
            </button>

            <div className="mt-8 flex gap-8 text-xs md:text-sm text-gray-500 font-bold opacity-60 z-10">
                <span className="flex items-center gap-1"><CheckCircle size={14} /> مجاني 100%</span>
                <span className="flex items-center gap-1"><CheckCircle size={14} /> تقرير سري</span>
                <span className="flex items-center gap-1"><CheckCircle size={14} /> نتائج فورية</span>
            </div>
        </div>
    );

    const renderIdentity = () => (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold dark:text-white mb-2">لنبدأ بالأساسيات 🏗️</h2>
                <p className="text-gray-500">عرّفنا بشركتك لنقارنك بالسوق بشكل صحيح.</p>
            </div>

            <div className="space-y-8">
                {/* 1. Name */}
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl">
                    <InputGroup label="1. اسم الشركة" id="n" value={formData.companyName} onChange={v => updateField('companyName', v)} />
                </div>

                {/* 2. Industry - Visual Grid */}
                <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-4 px-2">2. قطاع العمل (Industry)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {INDUSTRIES.map((ind, i) => (
                            <SelectionCard
                                key={i} title={ind} selected={formData.industry === ind}
                                onClick={() => updateField('industry', ind)}
                            />
                        ))}
                    </div>
                </div>

                {/* 3. Country - Visual Grid */}
                <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-4 px-2">3. المقر الرئيسي (HQ)</label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {COUNTRIES.map((cnt, i) => (
                            <SelectionCard
                                key={i} title={cnt} selected={formData.country === cnt}
                                onClick={() => updateField('country', cnt)}
                            />
                        ))}
                    </div>
                </div>

                {/* 4. Details */}
                <div className="bg-white dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl space-y-6">
                    <InputGroup label="4. الموقع الإلكتروني (Website)" id="web" value={formData.website} onChange={v => updateField('website', v)} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <VisualSlider
                            label="عمر الشركة (سنوات)"
                            value={formData.companyAge}
                            onChange={v => updateField('companyAge', v)}
                            min={0} max={20} step={1}
                            icon={Building2}
                            colorClass="blue"
                        />
                        <VisualSlider
                            label="مستوى التخصص (Focus)"
                            value={formData.specializationFocus}
                            onChange={v => updateField('specializationFocus', v)}
                            min={1} max={10} step={1}
                            icon={Target}
                            colorClass="rose"
                        />
                    </div>
                </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
                        <h3 className="font-bold mb-6 flex items-center gap-2 dark:text-emerald-400"><DollarSign size={18} /> الأهداف المالية</h3>

                        <VisualSlider
                            label="الهدف الشهري"
                            value={formData.monthlyTarget}
                            onChange={v => updateField('monthlyTarget', v)}
                            min={10000} max={1000000} step={10000}
                            prefix="SAR "
                            colorClass="emerald"
                        />
                        <div className="h-4"></div>
                        <VisualSlider
                            label="متوسط الصفقة"
                            value={formData.avgDealSize}
                            onChange={v => updateField('avgDealSize', v)}
                            min={1000} max={100000} step={1000}
                            prefix="SAR "
                            colorClass="emerald"
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg relative overflow-hidden h-fit">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
                    <h3 className="font-bold mb-6 flex items-center gap-2 dark:text-blue-400"><Users size={18} /> قوة الفريق</h3>

                    <div className="space-y-6">
                        <VisualSlider
                            label="SDRs (تطوير مبيعات)"
                            value={formData.sdrs}
                            onChange={v => updateField('sdrs', v)}
                            min={0} max={20} step={1}
                            colorClass="blue"
                        />
                        <VisualSlider
                            label="AEs (إغلاق صفقات)"
                            value={formData.aes}
                            onChange={v => updateField('aes', v)}
                            min={0} max={20} step={1}
                            colorClass="blue"
                        />
                    </div>
                </div>
            </div>
        </div>
    );


    const renderStrategy = () => (
        <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold dark:text-white mb-2">الجاهزية والأدوات 🛠️</h2>
                <p className="text-gray-500">هل تمتلك الأسلحة اللازمة للمعركة؟</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Assets Checklist */}
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg">
                    <h3 className="font-bold mb-6 text-violet-500 flex items-center gap-2">
                        <FileText size={20} /> الملفات والأصول (Assets)
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        <ToggleCard icon={FileText} label="ملف تعريفي (Profile)" value={formData.hasCompanyProfile} onChange={v => updateField('hasCompanyProfile', v)} />
                        <ToggleCard icon={LayoutDashboard} label="عرض بيعي (Sales Deck)" value={formData.hasPitchDeck} onChange={v => updateField('hasPitchDeck', v)} />
                        <ToggleCard icon={DollarSign} label="ملف تسعير (Pricing ROI)" value={formData.hasPricingFile} onChange={v => updateField('hasPricingFile', v)} />
                        <ToggleCard icon={Building2} label="موقع إلكتروني احترافي" value={formData.hasProfessionalWebsite} onChange={v => updateField('hasProfessionalWebsite', v)} />
                        <ToggleCard icon={Linkedin} label="تواجد قوي (LinkedIn)" value={formData.hasSocialPresence} onChange={v => updateField('hasSocialPresence', v)} />
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-lg">
                    <h3 className="font-bold mb-6 text-rose-500 flex items-center gap-2">
                        <Zap size={20} /> التقنية والعمليات
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        <ToggleCard icon={Search} label="Sales Navigator (مفعل)" value={formData.hasSalesNavigator} onChange={v => updateField('hasSalesNavigator', v)} />
                        <ToggleCard icon={Phone} label="تسجيل المكالمات (للتدريب)" value={formData.recordsCalls} onChange={v => updateField('recordsCalls', v)} />
                        <ToggleCard icon={BarChart3} label="تحليل المحادثات (AI)" value={formData.analyzesConversations} onChange={v => updateField('analyzesConversations', v)} />
                        <ToggleCard icon={Sparkles} label="استخدام AI Agents" value={formData.usesAIAgents} onChange={v => updateField('usesAIAgents', v)} />
                        <ToggleCard icon={Mail} label="رسائل مخصصة (Personalized)" value={formData.hyperPersonalized} onChange={v => updateField('hyperPersonalized', v)} />
                    </div>
                </div>
            </div>

            {/* Outbound Quick Stats - THE 100 CLUB */}
            <div className="bg-slate-900/5 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50"></div>
                <h3 className="font-bold mb-8 text-center text-xl dark:text-white">
                    🔥 نشاط الفريق اليومي (Per Person) - <span className="text-brand-500">نادي الـ 100</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <VisualSlider label="Calls 📞" value={formData.dailyCalls} onChange={v => updateField('dailyCalls', v)} min={0} max={100} step={5} colorClass="brand" />
                    <VisualSlider label="WhatsApp 💬" value={formData.dailyWhatsapp} onChange={v => updateField('dailyWhatsapp', v)} min={0} max={100} step={5} colorClass="emerald" />
                    <VisualSlider label="LinkedIn 🔗" value={formData.dailyLinkedin} onChange={v => updateField('dailyLinkedin', v)} min={0} max={100} step={5} colorClass="blue" />
                    <VisualSlider label="Emails 📧" value={formData.dailyEmails} onChange={v => updateField('dailyEmails', v)} min={0} max={100} step={5} colorClass="rose" />
                </div>
            </div>
        </div>
    );

    // ... renderPain unchanged ... 
    const renderPain = () => (
        <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold dark:text-white mb-2">الأداء الحالي 📉</h2>
                <p className="text-gray-500">أين تقف الآن من حيث النتائج؟</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800/50 p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl h-full">
                        <h3 className="font-bold mb-6 flex items-center gap-2 dark:text-white">
                            <Filter size={20} className="text-blue-500" />
                            Pipeline Health
                        </h3>
                        <div className="space-y-6">
                            <VisualSlider label="Leads شهرياً" value={formData.leadsPerMonth} onChange={v => updateField('leadsPerMonth', v)} min={0} max={1000} step={10} colorClass="blue" />
                            <VisualSlider label="Leads مؤهلة (SQLs)" value={formData.meetingsPerMonth} onChange={v => updateField('meetingsPerMonth', v)} min={0} max={200} step={5} colorClass="emerald" />
                            <VisualSlider label="عروض (Proposals)" value={formData.proposalsPerMonth} onChange={v => updateField('proposalsPerMonth', v)} min={0} max={100} step={5} colorClass="brand" />
                            <VisualSlider label="إغلاق (Won Deals)" value={formData.closedWonPerMonth} onChange={v => updateField('closedWonPerMonth', v)} min={0} max={50} step={1} colorClass="rose" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800/50 p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl h-full">
                        <h3 className="font-bold mb-6 flex items-center gap-2 dark:text-white">
                            <AlertTriangle size={20} className="text-amber-500" />
                            لماذا الآن؟ (Why Now)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {WHY_NOW_OPTIONS.map((opt, i) => (
                                <SelectionCard
                                    key={i}
                                    title={opt}
                                    selected={formData.whyNow === opt}
                                    onClick={() => updateField('whyNow', opt)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    // ... renderAnalysis unchanged ...
    const renderAnalysis = () => (
        <div className="flex flex-col items-center justify-center text-center py-20 h-full relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="w-40 h-40 mb-10 relative mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-t-4 border-emerald-500"
                    ></motion.div>
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-r-4 border-emerald-500/50"
                    ></motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl">🥷</span>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">جاري تحليل البيانات...</h2>
                <p className="text-emerald-500 font-mono text-sm mb-8 animate-pulse">Running System Diagnostics v2.0</p>

                <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-6 text-left font-mono text-sm space-y-3 max-w-sm mx-auto shadow-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                        className="flex items-center gap-3 text-emerald-400"
                    >
                        <CheckCircle size={14} /> <span>Checking Asset Readiness...</span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}
                        className="flex items-center gap-3 text-emerald-400"
                    >
                        <CheckCircle size={14} /> <span>Benchmarking vs 100 Club...</span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.9 }}
                        className="flex items-center gap-3 text-emerald-400"
                    >
                        <CheckCircle size={14} /> <span>Calculating Gap Analysis...</span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5 }}
                        className="flex items-center gap-3 text-white"
                    >
                        <Loader2 size={14} className="animate-spin" /> <span>Finalizing Strategy...</span>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );

    const renderResults = () => {
        const ResultTabBtn = ({ id, label, icon: Icon }: any) => (
            <button
                onClick={() => setResultTab(id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border ${resultTab === id ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white border-brand-500 shadow-xl shadow-brand-900/20 scale-105' : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white'}`}
            >
                <Icon size={18} /> {label}
            </button>
        );

        return (
            <div className="max-w-7xl mx-auto pb-20">
                <div className="text-center mb-12 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-500/5 blur-[120px] pointer-events-none"></div>
                    <h2 className="text-5xl font-black text-white mb-4 tracking-tight drop-shadow-xl relative z-10">
                        تقرير النينجا الاستراتيجي <span className="text-brand-500">.</span>
                    </h2>
                    <p className="text-slate-400 text-lg relative z-10">تشخيص عميق يكشف لك الحقيقة الرقمية وخارطة الطريق للسيطرة.</p>
                </div>

                <div className="flex justify-center flex-wrap gap-4 mb-12 relative z-10">
                    <ResultTabBtn id="scores" label="النتيجة والتحليل" icon={Trophy} />
                    <ResultTabBtn id="kpis" label="فجوات النمو" icon={BarChart3} />
                    <ResultTabBtn id="recs" label="خارطة الطريق (التوصيات)" icon={Lightbulb} />
                    <ResultTabBtn id="pdf" label="تحميل التقرير (PDF)" icon={Download} />
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 border border-slate-700/50 min-h-[600px] shadow-2xl relative z-10 overflow-hidden">
                    {/* Decorative Grid */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

                    {resultTab === 'scores' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                            {/* Main Score - Enhanced Visuals */}
                            <div className="lg:col-span-4 text-center bg-gradient-to-b from-slate-800/80 to-slate-900/80 rounded-3xl p-8 border border-slate-700 shadow-inner ring-1 ring-white/5">
                                <h3 className="text-xl font-bold text-slate-300 mb-8 flex items-center gap-2">
                                    <Sparkles size={18} className="text-brand-400" />
                                    مؤشر جاهزية النينجا
                                </h3>

                                <div className="relative w-56 h-56 mx-auto mb-8 flex items-center justify-center">
                                    {/* Score Rings */}
                                    <svg className="w-full h-full -rotate-90">
                                        <circle cx="112" cy="112" r="90" fill="none" stroke="#1e293b" strokeWidth="12" />
                                        <circle
                                            cx="112" cy="112" r="90" fill="none" stroke={results.scores.overallScore >= 80 ? '#5BB5C7' : results.scores.overallScore >= 50 ? '#f59e0b' : '#ef4444'}
                                            strokeWidth="12"
                                            strokeDasharray={`${2 * Math.PI * 90}`}
                                            strokeDashoffset={`${2 * Math.PI * 90 * (1 - results.scores.overallScore / 100)}`}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-6xl font-black tracking-tighter ${results.scores.overallScore >= 80 ? 'text-emerald-400' : 'text-white'}`}>
                                            {results.scores.overallScore}
                                        </span>
                                        <span className="text-slate-500 text-sm font-medium mt-1">من 100</span>
                                    </div>
                                </div>

                                <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-bold border ${results.scores.overallScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                                    {results.scores.tierLabel}
                                </div>
                            </div>

                            {/* Deep Analysis Grid */}
                            <div className="lg:col-span-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { label: "الأصول (Assets)", sub: "الجاهزية الرقمية", score: results.scores.teamScore, icon: "📂", color: "text-blue-400" },
                                        { label: "النشاط (Volume)", sub: "وتيرة الوصول", score: results.scores.outboundScore, icon: "🔥", color: "text-orange-400" },
                                        { label: "التقنية (Tech)", sub: "أدوات الذكاء", score: results.scores.crmScore, icon: "🤖", color: "text-purple-400" },
                                        { label: "الاستراتيجية (Fit)", sub: "دقة الاستهداف", score: results.scores.icpScore, icon: "🎯", color: "text-rose-400" }
                                    ].map((stat, idx) => (
                                        <div key={idx} className="group bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors flex items-center justify-between relative overflow-hidden">
                                            <div className="flex items-center gap-5 relative z-10">
                                                <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-2xl border border-slate-700 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                                                <div>
                                                    <div className="font-bold text-white text-lg">{stat.label}</div>
                                                    <div className="text-slate-500 text-xs font-mono">{stat.sub}</div>
                                                </div>
                                            </div>
                                            <div className="relative z-10">
                                                <div className={`text-3xl font-black font-mono ${stat.score >= 80 ? 'text-emerald-400' : stat.score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                    {stat.score}%
                                                </div>
                                            </div>
                                            {/* Progress Bar Bottom */}
                                            <div className="absolute bottom-0 left-0 h-1 bg-slate-700 w-full">
                                                <div className={`h-full ${stat.score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${stat.score}%` }}></div>
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
