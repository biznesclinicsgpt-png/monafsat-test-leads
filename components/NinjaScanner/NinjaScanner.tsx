
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    BarChart3,
    Calculator,
    FileText,
    LayoutDashboard,
    Lightbulb,
    Download,
    Printer,
    Building2,
    DollarSign,
    Flame,
    Zap,
    Users,
    Database,
    Target,
    Search,
    Mail,
    Linkedin,
    Phone,
    MessageCircle,
    Sun,
    Moon,
    Save,
    CheckCircle2
} from 'lucide-react';

import {
    INITIAL_STATE,
    INDUSTRIES,
    COUNTRIES,
    WHY_NOW_OPTIONS,
    LEAK_OPTIONS,
    TITLES_OPTIONS,
    COMPANY_SIZE_OPTIONS
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

const NinjaScanner = () => {
    const { providerProfile, updateProviderProfile } = useData();
    const [activeTab, setActiveTab] = useState<'input' | 'kpis' | 'scores' | 'recs' | 'pdf'>('input');
    const [formData, setFormData] = useState<NinjaFormData>(INITIAL_STATE);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const pdfRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const results = useMemo(() => calculateResults(formData), [formData]);

    // Load from Profile on Mount
    useEffect(() => {
        if (providerProfile?.ninja_diagnosis) {
            // Merge with initial state to ensure all fields exist
            setFormData(prev => ({ ...prev, ...providerProfile.ninja_diagnosis }));
        } else if (providerProfile) {
            // Pre-fill basics if diagnosis is empty
            setFormData(prev => ({
                ...prev,
                companyName: providerProfile.company_name || prev.companyName,
                industry: providerProfile.industries?.[0]?.name || prev.industry,
                country: providerProfile.headquarters_country || prev.country
            }));
        }

        // Auto-theme based on system? For now default dark as per user code
        document.documentElement.classList.add('dark');
    }, [providerProfile]);

    // Handle Theme Toggle
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const updateField = (field: keyof NinjaFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveToProfile = () => {
        setIsSaving(true);
        setTimeout(() => {
            // Guest Mode: Save locally and redirect
            if (!providerProfile) {
                localStorage.setItem('ninja_guest_data', JSON.stringify(formData));
                // Assuming /app/profile will trigger login/registration if not auth
                window.location.href = '/app/profile?wizard=true';
                return;
            }

            // Logged-in Mode
            if (providerProfile) {
                const updated = {
                    ...providerProfile,
                    ninja_diagnosis: formData,
                    // Also sync core fields if they changed or were empty
                    company_name: formData.companyName || providerProfile.company_name,
                    headquarters_country: formData.country || providerProfile.headquarters_country,
                    // Sync Structured ICP based on diagnosis inputs
                    icp_structured: {
                        ...providerProfile.icp_structured, // Keep existing if any
                        company_size_ideal: formData.icpCompanySize.length > 0 ? formData.icpCompanySize : providerProfile.icp_structured?.company_size_ideal,
                        decision_makers: formData.icpTitles.length > 0 ? formData.icpTitles : providerProfile.icp_structured?.decision_makers
                    }
                };
                updateProviderProfile(updated);
                alert('تم حفظ نتائج التشخيص في ملفك الشخصي بنجاح! 💾');
            }
            setIsSaving(false);
        }, 800);
    };

    const handleDownloadPDF = async () => {
        let html2pdf = (window as any).html2pdf;
        if (!html2pdf) {
            try {
                const module = await import('html2pdf.js');
                html2pdf = module.default;
            } catch (e) {
                // alert('PDF Generator loading...');
            }
        }

        if (!pdfRef.current || !html2pdf) {
            alert('جاري تحميل مكتبة PDF... يرجى المحاولة بعد ثوانٍ');
            return;
        }

        setIsGenerating(true);
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

        html2pdf().set(opt).from(element).save().then(() => {
            setIsGenerating(false);
        }).catch((err: any) => {
            console.error(err);
            setIsGenerating(false);
            alert('Error generating PDF');
        });
    };

    const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === id
                ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
        >
            <Icon size={18} />
            <span>{label}</span>
        </button>
    );

    return (
        <div className={`min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-gray-100 font-sans selection:bg-emerald-500/30 transition-colors duration-300 w-full ${theme}`} dir="rtl">
            {/* Background Gradient */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.10),transparent)] pointer-events-none" />

            <div className="relative container mx-auto px-4 py-8 max-w-7xl">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div className="text-center md:text-right flex-1">
                        <div className="inline-flex items-center gap-3 mb-2">
                            <div className="text-4xl md:text-5xl drop-shadow-md">🥷</div>
                            <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                                Ninja Scanner Pro
                            </h1>
                        </div>
                        <p className="text-slate-500 dark:text-gray-400 font-medium">35 نقطة تشخيصية + خطط علاج تفصيلية</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSaveToProfile}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all hover:scale-105 disabled:opacity-50"
                        >
                            {isSaving ? <span className="animate-spin">⏳</span> : <Save size={20} />}
                            <span>{isSaving ? 'جاري المعالجة...' : (!providerProfile ? '👉 التسجيل وبدء الاستراتيجية' : 'حفظ في الملف')}</span>
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-white/10 shadow-lg hover:scale-105 transition-transform text-slate-700 dark:text-amber-400"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                        </button>
                    </div>
                </header>

                {/* Navigation */}
                <div className="flex flex-wrap gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 dark:border-white/10 mb-8 justify-center md:justify-start shadow-sm sticky top-4 z-40">
                    <TabButton id="input" label="البيانات (35)" icon={LayoutDashboard} />
                    <TabButton id="kpis" label="KPIs" icon={BarChart3} />
                    <TabButton id="scores" label="النتيجة" icon={Calculator} />
                    <TabButton id="recs" label="خطة العمل" icon={Lightbulb} />
                    <TabButton id="pdf" label="PDF" icon={FileText} />
                </div>

                {/* Content Area */}
                <div className="animate-fade-in pb-20">

                    {/* INPUT TAB */}
                    {activeTab === 'input' && (
                        <div className="space-y-6">
                            {/* SECTION 1: CORE INFO */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Card 1: Company Info */}
                                <div className="bg-white dark:bg-gray-900/60 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors shadow-sm dark:shadow-none">
                                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-white/5">
                                        <Building2 className="text-emerald-500 dark:text-emerald-400" />
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100">بيانات الشركة</h3>
                                    </div>
                                    <InputGroup label="1. اسم الشركة" id="n" value={formData.companyName} onChange={v => updateField('companyName', v)} />
                                    <InputGroup label="2. عدد الموظفين" id="sz" type="number" value={formData.employees} onChange={v => updateField('employees', v)} />
                                    <InputGroup label="3. الصناعة" id="ind" type="select" options={['--', ...INDUSTRIES]} value={formData.industry} onChange={v => updateField('industry', v)} />
                                    <InputGroup label="4. البلد" id="co" type="select" options={['--', ...COUNTRIES]} value={formData.country} onChange={v => updateField('country', v)} />
                                    <InputGroup label="5. المنافس الرئيسي" id="comp" value={formData.competitor} onChange={v => updateField('competitor', v)} />

                                    {/* COLLAPSIBLE ICP DETAILS */}
                                    <div className="mt-6 space-y-3">
                                        <h4 className="text-xs font-bold text-slate-400 dark:text-gray-500 mb-2">تفاصيل ICP (اختياري)</h4>
                                        <InputGroup label="قطاعات مستهدفة" id="icp_ind" type="collapsible-multiselect" options={INDUSTRIES} value={formData.icpIndustries} onChange={v => updateField('icpIndustries', v)} />
                                        <InputGroup label="مسميات وظيفية" id="icp_ti" type="collapsible-multiselect" options={TITLES_OPTIONS} value={formData.icpTitles} onChange={v => updateField('icpTitles', v)} />
                                        <InputGroup label="حجم الشركات" id="icp_sz" type="collapsible-multiselect" options={COMPANY_SIZE_OPTIONS} value={formData.icpCompanySize} onChange={v => updateField('icpCompanySize', v)} />
                                    </div>
                                </div>

                                {/* Card 2: Commercial */}
                                <div className="bg-white dark:bg-gray-900/60 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors shadow-sm dark:shadow-none">
                                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-white/5">
                                        <DollarSign className="text-cyan-500 dark:text-cyan-400" />
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100">الملف التجاري</h3>
                                    </div>
                                    <InputGroup label="6. متوسط الصفقة (SAR)" id="deal" type="number" value={formData.avgDealSize} onChange={v => updateField('avgDealSize', v)} />
                                    <InputGroup label="7. الهدف الشهري (SAR)" id="tgt" type="number" value={formData.monthlyTarget} onChange={v => updateField('monthlyTarget', v)} />
                                    <InputGroup label="8. Sales Cycle (أيام)" id="cyc" type="number" value={formData.salesCycle} onChange={v => updateField('salesCycle', v)} />
                                    <InputGroup label="9. وصول صانع القرار" id="dm" type="select" options={[
                                        { value: '1', label: 'لا وصول' }, { value: '2', label: 'Gatekeeper' }, { value: '3', label: 'جزئي' }, { value: '4', label: 'مباشر' }, { value: '5', label: 'علاقة قوية' }
                                    ]} value={formData.decisionMakerAccess} onChange={v => updateField('decisionMakerAccess', parseInt(v.toString()))} />
                                    <InputGroup label="10. حالة الميزانية" id="bud" type="select" options={[
                                        { value: '1', label: 'لا ميزانية' }, { value: '2', label: 'تحت الموافقة' }, { value: '3', label: 'محدودة' }, { value: '4', label: 'مخصصة' }, { value: '5', label: 'سنوية واضحة' }
                                    ]} value={formData.budgetStatus} onChange={v => updateField('budgetStatus', parseInt(v.toString()))} />
                                </div>

                                {/* Card 3: Readiness */}
                                <div className="bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-900/20 dark:to-rose-900/10 backdrop-blur-md border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 shadow-sm dark:shadow-none">
                                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-amber-200 dark:border-amber-500/20">
                                        <Flame className="text-amber-500 dark:text-amber-400" />
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100">الجاهزية</h3>
                                    </div>
                                    <InputGroup label="11. مستوى الجاهزيه" id="urg" type="select" options={[
                                        { value: '1', label: 'استكشاف' }, { value: '2', label: 'هذه السنة' }, { value: '3', label: 'هذا الربع' }, { value: '4', label: 'هذا الشهر' }, { value: '5', label: 'الآن' }
                                    ]} value={formData.readinessLevel} onChange={v => updateField('readinessLevel', parseInt(v.toString()))} />
                                    <InputGroup label="12. Why Now?" id="why" type="select" options={['--', ...WHY_NOW_OPTIONS]} value={formData.whyNow} onChange={v => updateField('whyNow', v)} />

                                    <div className="mt-6 bg-white dark:bg-black/30 rounded-xl p-4 text-center border border-slate-200 dark:border-white/5 shadow-sm">
                                        <div className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1">درجة الجاهزية</div>
                                        <div className="text-3xl font-black font-mono text-slate-900 dark:text-white mb-1">{results.scores.overallScore}</div>
                                        <div className="text-xs text-amber-500 dark:text-amber-400 font-bold">{results.scores.tier}</div>
                                    </div>
                                </div>

                                {/* Card 4: Pipeline */}
                                <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 backdrop-blur-md border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6 shadow-sm dark:shadow-none">
                                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-emerald-200 dark:border-emerald-500/20">
                                        <Zap className="text-emerald-500 dark:text-emerald-400" />
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Pipeline</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <InputGroup label="13. Leads" id="ld" type="number" value={formData.leadsPerMonth} onChange={v => updateField('leadsPerMonth', v)} />
                                        <InputGroup label="14. Mtgs" id="mt" type="number" value={formData.meetingsPerMonth} onChange={v => updateField('meetingsPerMonth', v)} />
                                        <InputGroup label="15. Props" id="pr" type="number" value={formData.proposalsPerMonth} onChange={v => updateField('proposalsPerMonth', v)} />
                                        <InputGroup label="16. Won" id="cw" type="number" value={formData.closedWonPerMonth} onChange={v => updateField('closedWonPerMonth', v)} />
                                    </div>
                                    <InputGroup label="17. Pipeline Value (SAR)" id="pv" type="number" value={formData.pipelineValue} onChange={v => updateField('pipelineValue', v)} />
                                    <InputGroup label="19. أكبر تسريب" id="leak" type="select" options={LEAK_OPTIONS} value={formData.biggestLeak} onChange={v => updateField('biggestLeak', v)} />
                                </div>
                            </div>

                            {/* SECTION 2: DETAILED OUTBOUND (4 Pillars) */}
                            <div className="bg-slate-100 dark:bg-gray-900/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Target className="text-rose-500 dark:text-rose-400" />
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Outbound Engine (تحليل القنوات)</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {/* 1. Email */}
                                    <div className="bg-white dark:bg-gray-900/80 p-5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-colors shadow-sm dark:shadow-none">
                                        <div className="flex items-center gap-2 mb-4 text-blue-500 dark:text-blue-400"><Mail size={18} /> <span className="font-bold">Email</span></div>
                                        <InputGroup label="حجم الإرسال اليومي" id="em_vol" type="number" value={formData.emailVolume} onChange={v => updateField('emailVolume', v)} />
                                        <InputGroup label="Open Rate (%)" id="em_open" type="number" value={formData.emailOpenRate} onChange={v => updateField('emailOpenRate', v)} />
                                        <InputGroup label="الأدوات المستخدمة" id="em_tool" type="select" options={[{ value: '1', label: 'Gmail عادي' }, { value: '3', label: 'Mailchimp' }, { value: '5', label: 'Apollo/Instantly' }]} value={formData.emailTools} onChange={v => updateField('emailTools', parseInt(v.toString()))} />
                                        <InputGroup label="عدد الفرص الشهرية" id="em_opp" type="number" value={formData.emailOpportunities} onChange={v => updateField('emailOpportunities', v)} />
                                    </div>

                                    {/* 2. LinkedIn */}
                                    <div className="bg-white dark:bg-gray-900/80 p-5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-sky-500/30 transition-colors shadow-sm dark:shadow-none">
                                        <div className="flex items-center gap-2 mb-4 text-sky-500 dark:text-sky-500"><Linkedin size={18} /> <span className="font-bold">LinkedIn</span></div>
                                        <InputGroup label="طلبات التواصل اليومية" id="li_con" type="number" value={formData.linkedinConnects} onChange={v => updateField('linkedinConnects', v)} />
                                        <InputGroup label="نشر المحتوى" id="li_cont" type="select" options={[{ value: '1', label: 'لا يوجد' }, { value: '3', label: 'أسبوعي' }, { value: '5', label: 'يومي' }]} value={formData.linkedinContent} onChange={v => updateField('linkedinContent', parseInt(v.toString()))} />
                                        <InputGroup label="Sales Nav؟" id="li_nav" type="toggle" value={formData.linkedinNav} onChange={v => updateField('linkedinNav', v)} />
                                        <InputGroup label="عدد الفرص الشهرية" id="li_opp" type="number" value={formData.linkedinOpportunities} onChange={v => updateField('linkedinOpportunities', v)} />
                                    </div>

                                    {/* 3. Phone */}
                                    <div className="bg-white dark:bg-gray-900/80 p-5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-green-500/30 transition-colors shadow-sm dark:shadow-none">
                                        <div className="flex items-center gap-2 mb-4 text-green-500 dark:text-green-400"><Phone size={18} /> <span className="font-bold">Cold Calling</span></div>
                                        <InputGroup label="عدد المكالمات اليومية" id="ph_vol" type="number" value={formData.callsVolume} onChange={v => updateField('callsVolume', v)} />
                                        <InputGroup label="نسبة الرد (Connect %)" id="ph_con" type="number" value={formData.callsConnectRate} onChange={v => updateField('callsConnectRate', v)} />
                                        <InputGroup label="السيناريو (Script)" id="ph_sc" type="select" options={[{ value: '1', label: 'ارتجالي' }, { value: '3', label: 'مكتوب' }, { value: '5', label: 'Dynamic' }]} value={formData.callsScript} onChange={v => updateField('callsScript', parseInt(v.toString()))} />
                                        <InputGroup label="عدد الفرص الشهرية" id="ph_opp" type="number" value={formData.callsOpportunities} onChange={v => updateField('callsOpportunities', v)} />
                                    </div>

                                    {/* 4. WhatsApp */}
                                    <div className="bg-white dark:bg-gray-900/80 p-5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 transition-colors shadow-sm dark:shadow-none">
                                        <div className="flex items-center gap-2 mb-4 text-emerald-500"><MessageCircle size={18} /> <span className="font-bold">WhatsApp</span></div>
                                        <InputGroup label="رسائل للمحتملين يومياً" id="wa_vol" type="number" value={formData.whatsappVolume} onChange={v => updateField('whatsappVolume', v)} />
                                        <InputGroup label="نوع الاستخدام" id="wa_type" type="select" options={[{ value: '1', label: 'شخصي' }, { value: '3', label: 'Business App' }, { value: '5', label: 'API / Automation' }]} value={formData.whatsappType} onChange={v => updateField('whatsappType', parseInt(v.toString()))} />
                                        <InputGroup label="عدد الفرص الشهرية" id="wa_opp" type="number" value={formData.whatsappOpportunities} onChange={v => updateField('whatsappOpportunities', v)} />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: TEAM & PROCESS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Card 6: Team */}
                                <div className="bg-white dark:bg-gray-900/60 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors shadow-sm dark:shadow-none">
                                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-white/5">
                                        <Users className="text-violet-500 dark:text-violet-400" />
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100">الفريق</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <InputGroup label="SDRs" id="sdr" type="number" value={formData.sdrs} onChange={v => updateField('sdrs', v)} />
                                        <InputGroup label="AEs" id="ae" type="number" value={formData.aes} onChange={v => updateField('aes', v)} />
                                    </div>
                                    <InputGroup label="خبرة الفريق" id="exp" type="select" options={[{ value: '1', label: 'مبتدئ' }, { value: '3', label: 'جيد' }, { value: '5', label: 'محترف' }]} value={formData.teamExperience} onChange={v => updateField('teamExperience', parseInt(v.toString()))} />
                                    <InputGroup label="المتابعة" id="fu" type="select" options={[{ value: '1', label: '1-2' }, { value: '3', label: '5-6' }, { value: '5', label: 'نظام' }]} value={formData.followUp} onChange={v => updateField('followUp', parseInt(v.toString()))} />
                                </div>

                                {/* Card 7: Systems */}
                                <div className="bg-white dark:bg-gray-900/60 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors shadow-sm dark:shadow-none">
                                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-white/5">
                                        <Database className="text-blue-500 dark:text-blue-400" />
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100">الأنظمة</h3>
                                    </div>
                                    <InputGroup label="CRM" id="crm" type="select" options={[{ value: '1', label: 'لا' }, { value: '3', label: 'بسيط' }, { value: '5', label: 'Salesforce' }]} value={formData.crm} onChange={v => updateField('crm', parseInt(v.toString()))} />
                                    <InputGroup label="استخدام CRM" id="crmu" type="select" options={[{ value: '1', label: 'فارغ' }, { value: '3', label: 'أساسي' }, { value: '5', label: 'متكامل' }]} value={formData.crmUsage} onChange={v => updateField('crmUsage', parseInt(v.toString()))} />
                                    <InputGroup label="جودة Data" id="dq" type="select" options={[{ value: '1', label: 'سيئة' }, { value: '3', label: 'مقبولة' }, { value: '5', label: 'ممتازة' }]} value={formData.dataQuality} onChange={v => updateField('dataQuality', parseInt(v.toString()))} />
                                </div>

                                {/* Card 8: Discovery */}
                                <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 backdrop-blur-md border border-violet-200 dark:border-violet-500/20 rounded-2xl p-6 shadow-sm dark:shadow-none">
                                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-violet-200 dark:border-violet-500/20">
                                        <Search className="text-violet-500 dark:text-violet-400" />
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100">إدارة Discovery</h3>
                                    </div>
                                    <InputGroup label="وضوح ICP" id="icp" type="select" options={[{ value: '1', label: 'غير واضح' }, { value: '3', label: 'واضح نسبياً' }, { value: '5', label: 'موثق' }]} value={formData.icpClarity} onChange={v => updateField('icpClarity', parseInt(v.toString()))} />
                                    <div className="space-y-3 mt-4">
                                        <InputGroup label="Pitch Deck في الاجتماع" id="d_deck" type="toggle" value={formData.usePitchDeck} onChange={v => updateField('usePitchDeck', v)} />
                                        <InputGroup label="Proposal Deck منفصل" id="d_prop" type="toggle" value={formData.useProposalDeck} onChange={v => updateField('useProposalDeck', v)} />
                                        <InputGroup label="عدد اجتماعات الاستيضاح" id="d_mtgs" type="number" value={formData.clarificationMeetings} onChange={v => updateField('clarificationMeetings', v)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* KPIS TAB */}
                    {activeTab === 'kpis' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm dark:shadow-none">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800 dark:text-slate-200"><Calculator /> KPIs محسوبة</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {[
                                        { l: 'Win Rate', v: results.kpis.winRate.toFixed(1) + '%', c: getStatusColor(results.kpis.winRate, 25, 10) },
                                        { l: 'Lead→Meeting', v: results.kpis.leadToMeeting.toFixed(1) + '%', c: getStatusColor(results.kpis.leadToMeeting, 15, 5) },
                                        { l: 'Mtg→Proposal', v: results.kpis.meetingToProposal.toFixed(1) + '%', c: getStatusColor(results.kpis.meetingToProposal, 60, 40) },
                                        { l: 'Prop→Close', v: results.kpis.proposalToClose.toFixed(1) + '%', c: getStatusColor(results.kpis.proposalToClose, 30, 15) },
                                        { l: 'Coverage', v: results.kpis.pipelineCoverage.toFixed(1) + 'x', c: getStatusColor(results.kpis.pipelineCoverage, 3, 2) },
                                        { l: 'Sales Velocity', v: fmtCurrency(results.kpis.salesVelocity), c: 'text-sky-500 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/30' },
                                    ].map((k, i) => (
                                        <div key={i} className={`p-4 rounded-xl border ${k.c} flex flex-col items-center justify-center text-center`}>
                                            <span className="text-xs uppercase opacity-70 mb-1 font-bold">{k.l}</span>
                                            <span className="text-2xl font-black font-mono">{k.v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm dark:shadow-none">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800 dark:text-slate-200"><Zap /> Capacity & Funnel</h3>

                                {/* Funnel Chart */}
                                <div className="mb-8">
                                    <FunnelChart kpis={results.kpis} leads={formData.leadsPerMonth || 100} won={formData.closedWonPerMonth || 1} />
                                </div>

                                {/* Revenue Gap */}
                                <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-500/20 rounded-2xl p-6">
                                    <h4 className="text-violet-500 dark:text-violet-400 font-bold mb-4">📉 Revenue Gap Analysis</h4>
                                    <div className="grid grid-cols-3 gap-4 text-center mb-6">
                                        <div>
                                            <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">الهدف</div>
                                            <div className="font-mono font-bold text-lg text-slate-900 dark:text-white">{fmtCurrency(formData.monthlyTarget)}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">المتوقع</div>
                                            <div className="font-mono font-bold text-lg text-emerald-500 dark:text-emerald-400">{fmtCurrency(results.kpis.projectedRevenue)}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">الفجوة</div>
                                            <div className="font-mono font-bold text-lg text-rose-500 dark:text-rose-400">{fmtCurrency(results.kpis.revenueGap)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SCORES TAB */}
                    {activeTab === 'scores' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Main Score Visuals */}
                            <div className="lg:col-span-1 bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl p-8 flex flex-col items-center text-center shadow-sm dark:shadow-none">
                                <h3 className="text-xl font-bold mb-6 text-slate-500 dark:text-gray-400">النتيجة النهائية</h3>

                                {/* Radar Chart */}
                                <div className="mb-8 w-full flex justify-center">
                                    <RadarChart scores={results.scores} />
                                </div>

                                <div className="relative z-10 -mt-10">
                                    <div className="text-6xl font-black bg-gradient-to-br from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                                        {results.scores.overallScore}
                                    </div>
                                    <div className="text-slate-400 dark:text-gray-500 text-sm mt-1">/ 100</div>
                                </div>

                                <div className={`mt-6 px-6 py-2 rounded-full font-bold text-lg ${results.scores.tier === 'Tier 1' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/50' :
                                    results.scores.tier === 'Tier 2' ? 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/50' :
                                        'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/50'
                                    }`}>
                                    {results.scores.tier} – {results.scores.tierLabel}
                                </div>
                            </div>

                            {/* Breakdown & Analysis */}
                            <div className="lg:col-span-2 bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm dark:shadow-none">
                                <h3 className="text-2xl font-bold mb-8 text-slate-800 dark:text-slate-200">تحليل الأداء (Performance Matrix)</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        {[
                                            { l: '🎯 ICP & Offer', s: results.scores.icpScore, c: 'bg-emerald-500' },
                                            { l: '🗄️ Data & CRM', s: results.scores.crmScore, c: 'bg-cyan-500' },
                                            { l: '⚡ Outbound', s: results.scores.outboundScore, c: 'bg-amber-500' },
                                            { l: '👥 Team', s: results.scores.teamScore, c: 'bg-rose-500' },
                                            { l: '🔥 Mindset', s: results.scores.mindsetScore, c: 'bg-violet-500' },
                                        ].map((item, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between mb-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                                                    <span>{item.l}</span>
                                                    <span className="font-mono">{item.s}%</span>
                                                </div>
                                                <div className="h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                    <div className={`h-full ${item.c} transition-all duration-1000`} style={{ width: `${item.s}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/5">
                                        <h4 className="font-bold text-slate-700 dark:text-gray-300 mb-4">ملخص سريع</h4>
                                        <ul className="space-y-3 text-sm text-slate-600 dark:text-gray-400">
                                            <li className="flex items-start gap-2">
                                                <span className="text-emerald-500 dark:text-emerald-400">✓</span>
                                                <span>Segment: <strong className="text-slate-900 dark:text-white">{results.scores.segment}</strong></span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-emerald-500 dark:text-emerald-400">✓</span>
                                                <span>ACV المتوقع: <strong className="text-slate-900 dark:text-white">{results.scores.acv.toLocaleString()} SAR</strong></span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-emerald-500 dark:text-emerald-400">✓</span>
                                                <span>Credits: <strong className="text-slate-900 dark:text-white">{results.scores.credits}</strong></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* RECS TAB */}
                    {activeTab === 'recs' && (
                        <div className="space-y-6">

                            {/* Package Suggestion */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-800 dark:bg-gray-800 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center text-white">
                                    <div className="text-3xl mb-2">💰</div>
                                    <div className="text-xs uppercase text-gray-400 mb-1">Wallet</div>
                                    <div className="text-xl font-bold text-emerald-400">{results.pkg.wallet}</div>
                                </div>
                                <div className="bg-slate-800 dark:bg-gray-800 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center text-white">
                                    <div className="text-3xl mb-2">🎯</div>
                                    <div className="text-xs uppercase text-gray-400 mb-1">الأولوية</div>
                                    <div className="text-xl font-bold text-emerald-400">{results.pkg.priority}</div>
                                </div>
                                <div className="bg-slate-800 dark:bg-gray-800 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center text-white">
                                    <div className="text-3xl mb-2">⚡</div>
                                    <div className="text-xs uppercase text-gray-400 mb-1">Mode</div>
                                    <div className="text-xl font-bold text-emerald-400">{results.pkg.mode}</div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mt-8 mb-4 text-slate-800 dark:text-white">💡 خطة العلاج والتحسين (Detailed Action Plan)</h3>

                            <div className="grid grid-cols-1 gap-6">
                                {results.recommendations.map((rec, i) => (
                                    <div key={i} className={`p-6 rounded-2xl border bg-white dark:bg-gray-900/50 backdrop-blur-sm relative overflow-hidden group hover:-translate-y-1 transition-transform shadow-sm dark:shadow-none ${rec.type === 'critical' ? 'border-rose-200 dark:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/5' :
                                        rec.type === 'warning' ? 'border-amber-200 dark:border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-500/5' :
                                            rec.type === 'success' ? 'border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/5' :
                                                'border-cyan-200 dark:border-cyan-500/30 hover:bg-cyan-50 dark:hover:bg-cyan-500/5'
                                        }`}>
                                        <div className={`absolute top-0 right-0 w-1.5 h-full ${rec.type === 'critical' ? 'bg-rose-500' :
                                            rec.type === 'warning' ? 'bg-amber-500' :
                                                rec.type === 'success' ? 'bg-emerald-500' : 'bg-cyan-500'
                                            }`} />

                                        <div className="flex gap-4 mb-4">
                                            <div className="text-4xl">{rec.icon}</div>
                                            <div>
                                                <div className="text-xs uppercase text-slate-500 dark:text-gray-500 font-bold tracking-wider mb-1">{rec.category}</div>
                                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{rec.title}</h4>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                                                <h5 className="text-rose-500 dark:text-rose-400 text-xs font-bold mb-1 uppercase">التشخيص (Problem)</h5>
                                                <p className="text-sm text-slate-700 dark:text-gray-300">{rec.problem}</p>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                                                <h5 className="text-amber-500 dark:text-amber-400 text-xs font-bold mb-1 uppercase">الأثر (Impact)</h5>
                                                <p className="text-sm text-slate-700 dark:text-gray-300">{rec.impact}</p>
                                            </div>
                                        </div>

                                        <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/30">
                                            <h5 className="text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2 uppercase">الحل المقترح (Solution)</h5>
                                            <p className="text-sm text-slate-800 dark:text-gray-200 font-bold">{rec.solution}</p>
                                            {rec.tools && (
                                                <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-300">
                                                    🛠️ أدوات مقترحة: {rec.tools}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PDF TAB */}
                    {activeTab === 'pdf' && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl text-center shadow-sm dark:shadow-none">
                            <FileText size={64} className="text-violet-500 dark:text-violet-400 mb-6" />
                            <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-200">تصدير التقرير</h2>
                            <p className="text-slate-500 dark:text-gray-400 max-w-md mb-8">
                                يمكنك تحميل التقرير الكامل بصيغة PDF يتضمن جميع التحليلات والتوصيات والنتائج لعرضها على العميل.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleDownloadPDF}
                                    disabled={isGenerating}
                                    className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {isGenerating ? 'جاري التحميل...' : (
                                        <>
                                            <Download size={20} />
                                            <span>تحميل PDF</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center gap-3 bg-white dark:bg-gray-800 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                                >
                                    <Printer size={20} />
                                    <span>طباعة</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden PDF Container */}
            <PDFReport data={formData} results={results} reportRef={pdfRef} />
        </div>
    );
};

export default NinjaScanner;
