import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Sparkles, Target, MessageSquare, TrendingUp, BrainCircuit, ShieldCheck } from 'lucide-react';
import { StatsRow } from './dashboard/StatsRow';
import { WhyAgentsBlock } from './dashboard/WhyAgentsBlock';
import { AgentsStoryFlow } from './dashboard/AgentsStoryFlow';
import { BeforeAfterToggle } from './dashboard/BeforeAfterToggle';
import { AgentOrbitGrid } from './dashboard/AgentOrbitGrid';
import { MonafsatBridge } from './dashboard/MonafsatBridge';
import { DashboardCTA } from './dashboard/DashboardCTA';

export const SmartDashboardSection = () => {
    // List of features in the Left column of the main section grid
    const features = [
        {
            title: "يعمل قبل أول رسالة",
            desc: "تحليل ذكي للسوق والشركات لتحديد أعلى الفرص احتمالية للتعاقد.",
            icon: <Sparkles className="w-5 h-5 text-violet-400" />
        },
        {
            title: "يوصل لأصحاب القرار",
            desc: "تحديد متخذ القرار الفعلي واختيار أفضل قناة وتوقيت للتواصل المباشر.",
            icon: <Target className="w-5 h-5 text-cyan-400" />
        },
        {
            title: "يتابع ويحول الفرص",
            desc: "رصد فوري لاهتمام العملاء وأتمتة المحادثات وجدولتها حتى حجز الاجتماع.",
            icon: <MessageSquare className="w-5 h-5 text-emerald-400" />
        },
        {
            title: "يتوقع ويحسن النمو",
            desc: "التنبؤ الذكي بالإيرادات والفرص المستقبلية مع تقديم توصيات الإغلاق اليومية.",
            icon: <TrendingUp className="w-5 h-5 text-blue-400" />
        },
        {
            title: "قاعدة بيانات ضخمة ومحدثة",
            desc: "الوصول لأكثر من 8 مليون جهة وصانع قرار ومشاريع جديدة في السوق السعودي.",
            icon: <BrainCircuit className="w-5 h-5 text-emerald-400 animate-pulse" />
        },
        {
            title: "أمان وخصوصية كاملة",
            desc: "تشفير وحماية كاملة لبيانات شركتكم وعلاقاتكم مع العملاء.",
            icon: <ShieldCheck className="w-5 h-5 text-blue-400" />
        }
    ];

    return (
        <div className="py-28 bg-[#050505] relative overflow-hidden" id="ninja-command-center">
            {/* Background Neural Network Glow */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[25%] left-[15%] w-[600px] h-[600px] bg-emerald-500/[0.015] blur-[150px] rounded-full" />
                <div className="absolute bottom-[25%] right-[15%] w-[600px] h-[600px] bg-cyan-500/[0.015] blur-[150px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                
                {/* 1. Header & Intro */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white mb-6 backdrop-blur-sm">
                            <Cpu className="w-4 h-4 text-cyan-400" />
                            <span className="font-semibold text-xs text-slate-300">٢٥ وكيل ذكي مترابطون معاً في منظومة واحدة</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                            لوحة قيادة النينجا الذكية
                        </h2>
                        <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            فريق متكامل من ٢٥ وكيل ذكاء اصطناعي يعملون بتنسيق وتوافق تام 24/7 لمسح السوق وتوليد الفرص وإدارتها حتى حسم التعاقد وإغلاقه.
                        </p>
                    </motion.div>
                </div>

                {/* 2. Stats Row (5 big numbers) */}
                <StatsRow />

                {/* 3. Why 25 Agents Block (Outreach questions checkmarks) */}
                <WhyAgentsBlock />

                {/* 4. Agents Story Flow Timeline (13 steps sequence) */}
                <AgentsStoryFlow />

                {/* 5. Before / After Interactive Toggle */}
                <BeforeAfterToggle />

                {/* 6. Main Grid (Left features column + Right interactive orbit layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
                    {/* Left Column: Side features lists */}
                    <div className="lg:col-span-3 space-y-5 flex flex-col justify-start">
                        {features.map((feat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                className="bg-slate-950/40 border border-slate-900/60 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-colors duration-300"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-slate-700 transition-colors">
                                        {feat.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white mb-1.5 group-hover:text-slate-200 transition-colors">
                                            {feat.title}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                            {feat.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Column: Orbit layout & satellite agents */}
                    <div className="lg:col-span-9 flex items-center justify-center relative">
                        <AgentOrbitGrid />
                    </div>
                </div>

                {/* 7. Monafsat Positioning Bridge */}
                <MonafsatBridge />

                {/* 8. Section Footer CTA Banner */}
                <DashboardCTA />

            </div>
        </div>
    );
};
