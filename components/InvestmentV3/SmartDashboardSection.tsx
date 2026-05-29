import React from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { WhyAgentsBlock } from './dashboard/WhyAgentsBlock';
import { AgentsStoryFlow } from './dashboard/AgentsStoryFlow';
import { BeforeAfterToggle } from './dashboard/BeforeAfterToggle';
import { AgentOrbitGrid } from './dashboard/AgentOrbitGrid';
import { MonafsatBridge } from './dashboard/MonafsatBridge';
import { DashboardCTA } from './dashboard/DashboardCTA';

export const SmartDashboardSection = () => {
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

                {/* 2. Why 25 Agents Block (Outreach questions checkmarks) */}
                <WhyAgentsBlock />

                {/* 3. Agents Story Flow Timeline (13 steps sequence) */}
                <AgentsStoryFlow />

                {/* 4. Before / After Interactive Toggle */}
                <BeforeAfterToggle />

                {/* 5. Central Command Orbit Dashboard Grid (Centered, Full Width) */}
                <div className="flex items-center justify-center relative mb-20 w-full">
                    <AgentOrbitGrid />
                </div>

                {/* 6. Monafsat Positioning Bridge */}
                <MonafsatBridge />

                {/* 7. Section Footer CTA Banner */}
                <DashboardCTA />

            </div>
        </div>
    );
};
