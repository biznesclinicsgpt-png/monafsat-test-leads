import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Globe, Search, Database, Filter,
    Target, Zap, CheckCircle, Shield, XCircle,
    Loader2, ChevronRight, Play, Terminal, Cpu,
    Crosshair, Signal, Lock, Scan, Code
} from 'lucide-react';
import { injectDemoData } from '../../services/simulationService';
import confetti from 'canvas-confetti';

interface SimulationWizardProps {
    onClose: () => void;
}

const STEPS = [
    { id: 'profile', title: 'Start', icon: Globe },
    { id: 'analysis', title: 'Analysis', icon: Cpu },
    { id: 'scouting', title: 'Scouting', icon: Search },
    { id: 'enrichment', title: 'Enrichment', icon: Database },
    { id: 'scoring', title: 'Scoring', icon: Target },
    { id: 'ready', title: 'Ready', icon: Zap },
];

const LOGS = {
    analysis: [
        "جاري تحليل هيكلة الموقع الإلكتروني...",
        "استخراج الكلمات المفتاحية والبيانات الوصفية...",
        "تحديد نطاق الخدمات والمنتجات الأساسية...",
        "رصد مؤشرات الجمهور المستهدف...",
        "رسم خارطة المنافسين في السوق..."
    ],
    scouting: [
        "الاتصال بقواعد بيانات Apollo...",
        "فحص شبكة LinkedIn Sales Navigator...",
        "البحث في دليل Google للأعمال...",
        "تم العثور على 1,420 عميل محتمل مبدئي...",
        "تطبيق فلتر القطاع: المقاولات والإنشاءات...",
        "تطبيق فلتر المنطقة: المملكة العربية السعودية..."
    ],
    enrichment: [
        "التحقق من صحة العناوين البريدية عبر Hunter...",
        "إثراء بيانات التواصل باستخدام Lemlist...",
        "مراجعة النشاط الأخير للملفات الشخصية...",
        "استبعاد الإيميلات غير الآمنة...",
        "إضافة بيانات الإيرادات وحجم الشركة..."
    ],
    scoring: [
        "تطبيق معايير العميل المثالي (ICP)...",
        "حساب نقاط التوافق وتصنيف العملاء...",
        "استبعاد النتائج ذات التصنيف المنخفض...",
        "تحديد أولوية صناع القرار...",
        "إعداد القائمة النهائية المؤهلة..."
    ]
};

// --- VISUAL COMPONENTS ---

const MatrixBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-90"></div>
        <div className="absolute w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    </div>
);

const AICore = ({ active, stage }: { active: boolean, stage: number }) => {
    return (
        <div className="relative flex items-center justify-center w-64 h-64 md:w-96 md:h-96">
            {/* Outer Rings */}
            <motion.div
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-slate-700/50 rounded-full"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-slate-700/30 rounded-full border-dashed"
            />

            {/* Core Pulse */}
            <motion.div
                animate={{
                    scale: active ? [0.8, 1.2, 0.8] : 1,
                    opacity: active ? [0.5, 0.8, 0.5] : 0.3
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute w-32 h-32 md:w-48 md:h-48 rounded-full blur-3xl ${stage === 4 ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}
            />

            {/* Central Icon */}
            <div className="relative z-10 bg-slate-900 p-6 rounded-full border border-slate-700 shadow-2xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={stage}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="text-white"
                    >
                        {stage === 0 && <Globe size={48} className="text-blue-400" />}
                        {stage === 1 && <Cpu size={48} className="text-indigo-400 animate-pulse" />}
                        {stage === 2 && <Scan size={48} className="text-cyan-400 animate-spin-slow" />}
                        {stage === 3 && <Database size={48} className="text-purple-400" />}
                        {stage === 4 && <Crosshair size={48} className="text-rose-400" />}
                        {stage === 5 && <CheckCircle size={64} className="text-emerald-400" />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Scanning Effect */}
            {stage > 0 && stage < 5 && (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t-2 border-transparent border-t-emerald-500/50"
                />
            )}
        </div>
    );
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
        if (currentStep === 1) runSimulation('analysis', 5000 + Math.random() * 2000);
        if (currentStep === 2) runSimulation('scouting', 12000 + Math.random() * 5000);
        if (currentStep === 3) runSimulation('enrichment', 15000 + Math.random() * 5000);
        if (currentStep === 4) runSimulation('scoring', 8000 + Math.random() * 3000);

        if (currentStep === 5) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#10b981', '#3b82f6', '#ffffff']
            });
        }
    }, [currentStep]);

    const runSimulation = (stage: keyof typeof LOGS, duration: number) => {
        setLogs([]);
        const stageLogs = LOGS[stage];
        let i = 0;

        // Initial burst
        setLogs([stageLogs[0]]);
        i++;

        const interval = setInterval(() => {
            if (i < stageLogs.length) {
                setLogs(prev => [...prev, stageLogs[i]]);
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    setCurrentStep(prev => prev + 1);
                }, 1500);
            }
        }, duration / stageLogs.length);
    };

    const handleLaunch = () => {
        injectDemoData();
        window.location.assign('/app');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black text-white font-sans overflow-hidden flex flex-col"
            dir="rtl"
        >
            <MatrixBackground />

            {/* Header */}
            <div className="relative z-10 p-6 flex justify-between items-center border-b border-white/10 bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/50">
                        <Sparkles size={20} className="text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-wider text-slate-200">AI AGENT <span className="text-emerald-500">SIMULATION</span></h1>
                        <div className="text-[10px] font-mono text-emerald-500/60 tracking-[0.2em]">SYSTEM_ACTIVE_V2.4</div>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                    <XCircle size={24} />
                </button>
            </div>

            {/* Main Stage */}
            <div className="flex-1 relative z-10 flex flex-col md:flex-row items-center justify-center p-4 md:p-10 gap-8 md:gap-16">

                {/* Left: AI Visualizer */}
                <div className="flex-1 flex justify-center items-center py-10">
                    <AICore active={currentStep > 0 && currentStep < 5} stage={currentStep} />
                </div>

                {/* Right: Context & Interaction using AnimatePresence for smooth transitions */}
                <div className="flex-1 w-full max-w-lg">
                    <AnimatePresence mode="wait">

                        {/* Step 0: Input */}
                        {currentStep === 0 && (
                            <motion.div
                                key="input"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-slate-900/50 border border-slate-700/50 p-8 rounded-3xl backdrop-blur-xl shadow-2xl"
                            >
                                <h2 className="text-3xl font-bold mb-2 text-white">تهيئة النظام</h2>
                                <p className="text-slate-400 mb-8">أدخل رابط شركتك لنقوم بتشغيل خوارزميات الاستهداف والتحليل.</p>

                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-xs font-bold text-emerald-500 mb-2 uppercase tracking-wider">اسم الشركة</label>
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            className="w-full bg-black/40 border border-slate-700/50 rounded-xl px-4 py-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-mono"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-xs font-bold text-emerald-500 mb-2 uppercase tracking-wider">رابط الموقع</label>
                                        <div className="relative">
                                            <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                type="text"
                                                value={companyUrl}
                                                onChange={(e) => setCompanyUrl(e.target.value)}
                                                className="w-full bg-black/40 border border-slate-700/50 rounded-xl pr-12 pl-4 py-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-mono text-left"
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        تشغيل المحاكاة
                                        <Play size={18} className="fill-current group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Steps 1-4: Terminal */}
                        {currentStep > 0 && currentStep < 5 && (
                            <motion.div
                                key="terminal"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="w-full"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                                        </div>
                                        <span className="text-xs font-mono text-slate-500 ml-3">PROTOCOL://{STEPS[currentStep].title.toUpperCase()}</span>
                                    </div>
                                    <div className="text-xs font-mono text-emerald-500 animate-pulse">PROCESSING...</div>
                                </div>

                                <div className="bg-black/80 border border-slate-800 rounded-lg p-6 font-mono text-sm h-64 overflow-hidden relative shadow-inner">
                                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
                                    <div className="space-y-3">
                                        {logs.map((log, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-start gap-2"
                                            >
                                                <span className="text-emerald-500 mt-1">➜</span>
                                                <span className={i === logs.length - 1 ? "text-white" : "text-emerald-500/70"}>
                                                    {log}
                                                </span>
                                            </motion.div>
                                        ))}
                                        <div ref={logsEndRef} />
                                        <motion.span
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                            className="inline-block w-2.5 h-4 bg-emerald-500 align-middle ml-2"
                                        />
                                    </div>
                                </div>

                                {/* Progress Indicators */}
                                <div className="mt-8 grid grid-cols-4 gap-2">
                                    {[1, 2, 3, 4].map(s => (
                                        <div key={s} className="h-1 rounded-full bg-slate-800 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: currentStep > s ? '100%' : currentStep === s ? '100%' : '0%' }}
                                                transition={{ duration: currentStep === s ? 5 : 0.5 }}
                                                className={`h-full ${currentStep === s ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-500/50'}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-500 uppercase">
                                    <span>Analysis</span>
                                    <span>Scouting</span>
                                    <span>Enrichment</span>
                                    <span>Scoring</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 5: Success */}
                        {currentStep === 5 && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                                className="bg-gradient-to-b from-slate-800 to-slate-900 border border-emerald-500/30 p-1 rounded-3xl shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)]"
                            >
                                <div className="bg-black/40 rounded-[22px] p-8 text-center backdrop-blur-sm">
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/40"
                                    >
                                        <CheckCircle size={40} className="text-black" />
                                    </motion.div>

                                    <h2 className="text-3xl font-bold text-white mb-2">اكتملت المهمة!</h2>
                                    <p className="text-slate-400 mb-8 text-sm">تم بناء قاعدة بيانات مخصصة وجاهزة للإطلاق.</p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
                                            <div className="text-xs text-slate-500 mb-1">TOTAL LEADS</div>
                                            <div className="text-3xl font-mono font-bold text-white">1,420</div>
                                        </div>
                                        <div className="bg-emerald-900/20 p-4 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                                            <div className="text-xs text-emerald-400 mb-1">QUALIFIED (ICP)</div>
                                            <div className="text-3xl font-mono font-bold text-emerald-400">315</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleLaunch}
                                        className="w-full bg-white hover:bg-slate-200 text-black font-black py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                                    >
                                        <Zap size={20} className="fill-black" />
                                        عرض النتائج (DASHBOARD)
                                    </button>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Status */}
            <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-sm flex justify-between items-center text-[10px] font-mono text-slate-600">
                <div className="flex gap-4">
                    <span>CPU: 42%</span>
                    <span>MEM: 1.2GB</span>
                    <span>NET: SECURE</span>
                </div>
                <div>SESSION_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
            </div>
        </motion.div>
    );
};
