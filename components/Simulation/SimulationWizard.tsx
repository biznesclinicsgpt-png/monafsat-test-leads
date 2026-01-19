import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Globe, Search, Database, Filter,
    Target, Zap, CheckCircle, Shield, XCircle,
    Loader2, ChevronRight, Play, Terminal
} from 'lucide-react';
import { injectDemoData } from '../../services/simulationService';

interface SimulationWizardProps {
    onClose: () => void;
}

const STEPS = [
    { id: 'profile', title: 'بيانات الشركة', icon: Globe },
    { id: 'analysis', title: 'تحليل AI', icon: Sparkles },
    { id: 'scouting', title: 'البحث الشامل', icon: Search },
    { id: 'enrichment', title: 'الإثراء والتحقق', icon: Database },
    { id: 'scoring', title: 'الفلترة والتقييم', icon: Filter },
    { id: 'ready', title: 'جاهز للانطلاق', icon: Zap },
];

const LOGS = {
    analysis: [
        "Analyzing website structure...",
        "Extracting meta tags and keywords...",
        "Identifying core service lines...",
        "Detecting target audience signals...",
        "Mapping competitor landscape..."
    ],
    scouting: [
        "Connecting to Apollo API...",
        "Scanning LinkedIn Sales Navigator...",
        "Querying Google Business Directory...",
        "Found 1,420 raw leads...",
        "Filtering by Industry: Construction...",
        "Filtering by Location: Saudi Arabia..."
    ],
    enrichment: [
        "Verifying emails via Hunter.io...",
        "Enriching phone numbers via Lusha...",
        "Checking LinkedIn profiles for recent activity...",
        "Removing bounce-risk emails...",
        "Enriching company revenue data..."
    ],
    scoring: [
        "Applying ICP Filter v2.1...",
        "Scoring lead fit (0-100)...",
        "Removing low scores (< 50)...",
        "Prioritizing decision makers...",
        "Finalizing qualified list..."
    ]
};

export const SimulationWizard: React.FC<SimulationWizardProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [companyUrl, setCompanyUrl] = useState('www.mycompany.com');
    const [companyName, setCompanyName] = useState('My Company');
    const [logs, setLogs] = useState<string[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    // Step Runner
    useEffect(() => {
        if (currentStep === 1) runSimulation('analysis', 3000);
        if (currentStep === 2) runSimulation('scouting', 4000);
        if (currentStep === 3) runSimulation('enrichment', 4000);
        if (currentStep === 4) runSimulation('scoring', 3000);
    }, [currentStep]);

    const runSimulation = (stage: keyof typeof LOGS, duration: number) => {
        setLogs([]);
        const stageLogs = LOGS[stage];
        let i = 0;

        const interval = setInterval(() => {
            if (i < stageLogs.length) {
                setLogs(prev => [...prev, stageLogs[i]]);
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    setCurrentStep(prev => prev + 1);
                }, 1000);
            }
        }, duration / stageLogs.length);
    };

    const handleLaunch = () => {
        // Use window.location.assign to force hard reload for DataContext re-hydration
        injectDemoData();
        window.location.assign('/app');
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[600px] md:h-[500px]"
                dir="rtl"
            >
                {/* Sidebar / Progress */}
                <div className="w-full md:w-1/3 bg-slate-50 border-l border-slate-200 p-6 flex flex-col">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 font-black text-xl text-slate-800">
                            <Zap className="text-brand-600" />
                            محرك النمو الذكي
                        </div>
                        <p className="text-slate-500 text-xs mt-1">Simulating AI Agent Workflow...</p>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto">
                        {STEPS.map((step, idx) => {
                            const isActive = idx === currentStep;
                            const isCompleted = idx < currentStep;
                            const Icon = step.icon;

                            return (
                                <div key={step.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-white shadow-md border border-slate-100' : 'opacity-50'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-brand-600 text-white' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                        {isCompleted ? <CheckCircle size={16} /> : <Icon size={16} />}
                                    </div>
                                    <div>
                                        <div className={`font-bold text-sm ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>{step.title}</div>
                                        {isActive && <div className="text-[10px] text-brand-600 animate-pulse">جاري المعالجة...</div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-8 bg-white relative flex flex-col">

                    {/* Step 0: Input */}
                    {currentStep === 0 && (
                        <div className="flex-1 flex flex-col justify-center animate-fadeIn">
                            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 text-brand-600 mx-auto">
                                <Globe size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">لنبدأ بتحليل شركتك</h2>
                            <p className="text-center text-slate-500 mb-8 max-w-sm mx-auto">أدخل رابط موقعك لنقوم بتحليل القطاع، الخدمات، والجمهور المستهدف تلقائياً.</p>

                            <div className="max-w-sm mx-auto w-full space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">اسم الشركة</label>
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 outline-none transition-all"
                                        placeholder="مثال: شركة الإعمار"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">رابط الموقع</label>
                                    <input
                                        type="text"
                                        value={companyUrl}
                                        onChange={(e) => setCompanyUrl(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 outline-none transition-all text-left"
                                        dir="ltr"
                                        placeholder="example.com"
                                    />
                                </div>
                                <button
                                    onClick={() => setCurrentStep(1)}
                                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    ابدأ المحاكاة <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Simulation Steps (1-4) - TERMINAL VIEW */}
                    {currentStep > 0 && currentStep < 5 && (
                        <div className="flex-1 flex flex-col relative animate-fadeIn">
                            <div className="absolute top-0 left-0 right-0 flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Terminal size={18} className="text-slate-400" />
                                    سجل العمليات (System Logs)
                                </h3>
                                <div className="text-xs font-mono text-slate-400">Agent-ID: #8492</div>
                            </div>

                            <div className="flex-1 bg-slate-900 rounded-xl p-6 font-mono text-sm overflow-hidden relative mt-8 border border-slate-800 shadow-inner">
                                <div className="absolute top-0 left-0 w-full h-8 bg-slate-800 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="mt-6 space-y-2 h-full overflow-y-auto custom-scrollbar">
                                    {logs.map((log, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-green-400 flex gap-2"
                                        >
                                            <span className="text-slate-600 shrink-0">{`>`}</span>
                                            <span>{log}</span>
                                        </motion.div>
                                    ))}
                                    <div ref={logsEndRef} />
                                    <motion.div
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                        className="w-2 h-4 bg-green-500 inline-block align-middle ml-1"
                                    />
                                </div>
                            </div>

                            {/* Visual Context based on step */}
                            <div className="mt-6 h-24 bg-slate-50 rounded-xl border border-slate-100 p-4 flex items-center justify-center">
                                {currentStep === 1 && (
                                    <div className="flex items-center gap-4 text-slate-600 font-bold">
                                        <Globe className="animate-spin-slow" /> جاري تحليل {companyUrl}...
                                    </div>
                                )}
                                {currentStep === 2 && (
                                    <div className="flex gap-8">
                                        <div className="flex flex-col items-center gap-1 opacity-50"><Globe size={20} /> Web</div>
                                        <div className="flex flex-col items-center gap-1 text-blue-600 scale-110"><Search size={24} /> Apollo</div>
                                        <div className="flex flex-col items-center gap-1 opacity-50"><Database size={20} /> LinkedIn</div>
                                    </div>
                                )}
                                {currentStep === 3 && (
                                    <div className="flex items-center gap-4 text-emerald-600 font-bold">
                                        <CheckCircle /> تم التحقق من 85% من البيانات
                                    </div>
                                )}
                                {currentStep === 4 && (
                                    <div className="flex items-center gap-4 text-rose-600 font-bold">
                                        <Filter /> حذف 320 ليد غير مطابق للمعاير
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Final Step: Ready */}
                    {currentStep === 5 && (
                        <div className="flex-1 flex flex-col justify-center items-center text-center animate-fadeIn">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 relative">
                                <CheckCircle size={48} />
                                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">المهمة اكتملت بنجاح!</h2>
                            <p className="text-slate-500 mb-8 max-w-md">
                                قام العميل الذكي بتجهيز قائمة عملاء محتملين عالية الجودة، تم التحقق منها واثراؤها وجاهزة للتواصل.
                            </p>

                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full max-w-sm mb-8 grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-xs text-slate-400">Total Leads</div>
                                    <div className="text-xl font-bold text-slate-800">1,420</div>
                                </div>
                                <div className="text-center border-r border-slate-200">
                                    <div className="text-xs text-slate-400">Qualified (ICP)</div>
                                    <div className="text-xl font-bold text-green-600">315</div>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full max-w-sm">
                                <button
                                    onClick={handleLaunch}
                                    className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-brand-500/30 transition-all flex items-center justify-center gap-2 hover:scale-105"
                                >
                                    <Play size={20} className="fill-current" />
                                    عرض النتائج (Dashboard)
                                </button>
                            </div>
                            <button onClick={onClose} className="mt-4 text-slate-400 hover:text-slate-600 text-sm">إلغاء</button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
