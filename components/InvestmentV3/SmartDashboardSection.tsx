import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, CalendarCheck, Cpu, Database, Filter, Flame, MessageSquareText, Search, Send, TrendingUp, UserRoundCheck } from 'lucide-react';
import { WhyAgentsBlock } from './dashboard/WhyAgentsBlock';
import { BeforeAfterToggle } from './dashboard/BeforeAfterToggle';
import { AgentOrbitGrid } from './dashboard/AgentOrbitGrid';
import { MonafsatBridge } from './dashboard/MonafsatBridge';
import { DashboardCTA } from './dashboard/DashboardCTA';

const SimpleAutomationEngineSection = () => {
    const capabilities = [
        {
            title: 'تحليل السوق والقطاعات',
            desc: 'فهم القطاعات المناسبة والفرص الأقرب لخدمتك.',
            icon: Search,
        },
        {
            title: 'تحديد الحسابات وصناع القرار',
            desc: 'اختيار الشركات والأشخاص الأعلى احتمالًا للاستجابة.',
            icon: UserRoundCheck,
        },
        {
            title: 'إثراء البيانات',
            desc: 'استكمال معلومات التواصل والملاءمة قبل بدء الحركة.',
            icon: Database,
        },
        {
            title: 'تخصيص الرسائل واختيار القنوات',
            desc: 'صياغة رسالة مناسبة واختيار القناة الأنسب لكل حالة.',
            icon: MessageSquareText,
        },
        {
            title: 'بدء التواصل والمتابعة الأولية',
            desc: 'تشغيل الجزء البارد من الرحلة دون إنهاك فريقك.',
            icon: Send,
        },
        {
            title: 'تصنيف المحادثات وتحويلها إلى فرص',
            desc: 'رفع المحادثات الجاهزة فقط إلى فريق المبيعات.',
            icon: Filter,
        },
    ];

    const flowSteps = ['السوق', 'البيانات', 'الرسائل', 'الردود الأولية', 'المحادثات النشطة', 'فرص لفريق المبيعات'];

    const metrics = [
        { label: 'المحادثات النشطة', value: '٣٤٧', icon: MessageSquareText, color: 'text-cyan-300' },
        { label: 'العملاء المهتمون', value: '٦٢', icon: UserRoundCheck, color: 'text-emerald-300' },
        { label: 'الاجتماعات القادمة', value: '١٨', icon: CalendarCheck, color: 'text-violet-300' },
        { label: 'الفرص الساخنة', value: '١٢', icon: Flame, color: 'text-amber-300' },
        { label: 'قيمة خط المبيعات', value: '٤.٨٥ مليون ر.س', icon: BarChart3, color: 'text-cyan-300' },
        { label: 'الإيراد المتوقع', value: '١.٢ مليون ر.س', icon: TrendingUp, color: 'text-emerald-300' },
    ];

    return (
        <div className="py-28 bg-[#050505] relative overflow-hidden" id="ninja-command-center">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[18%] right-[12%] w-[520px] h-[520px] bg-emerald-500/[0.025] blur-[150px] rounded-full" />
                <div className="absolute bottom-[12%] left-[12%] w-[520px] h-[520px] bg-cyan-500/[0.02] blur-[150px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="text-center mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 mb-6 backdrop-blur-sm">
                            <Cpu className="w-4 h-4" />
                            <span className="font-black text-xs">مدعوم داخليًا بوكلاء ذكاء متخصصين</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight max-w-5xl mx-auto">
                            محرك ذكاء وأتمتة يعمل خلف الكواليس
                        </h2>
                        <p className="text-base md:text-lg text-slate-400 max-w-4xl mx-auto leading-relaxed">
                            جزء كبير من منظومتنا يعمل بالذكاء الاصطناعي والأتمتة حتى لا يبدأ فريقك من الصفر. نحلل السوق، نحدد الحسابات، نجهز البيانات، نخصص الرسائل، نبدأ التواصل، ونتابع الردود الأولية قبل تحويل الجاهز منها لفريقك.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                    {capabilities.map((capability, idx) => (
                        <motion.div
                            key={capability.title}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-slate-950/65 border border-slate-800 rounded-3xl p-6 text-right hover:border-emerald-500/30 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center justify-center mb-5">
                                <capability.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-3">{capability.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed font-bold">{capability.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-5 md:p-7 mb-10">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                        {flowSteps.map((step, idx) => (
                            <React.Fragment key={step}>
                                <div className="rounded-2xl bg-black/35 border border-slate-900 px-4 py-3 text-center flex-1">
                                    <span className="text-sm font-black text-slate-200">{step}</span>
                                </div>
                                {idx < flowSteps.length - 1 && (
                                    <ArrowLeft className="w-5 h-5 text-emerald-300 mx-auto rotate-90 lg:rotate-0 shrink-0" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/25 p-6 md:p-8 flex flex-col justify-center"
                    >
                        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-5">
                            التقنية تقلل العبء وتزيد جاهزية الفرص
                        </h3>
                        <p className="text-slate-300 font-bold leading-relaxed">
                            فريق المبيعات لديك لا يبدأ من البحث والمطاردة، بل يبدأ من المحادثات النشطة التي تم تجهيزها وتحليلها ورفع جاهزيتها للتحويل.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-3xl p-6 md:p-8"
                    >
                        <div className="flex items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800">
                            <div>
                                <div className="text-xs font-black text-cyan-300 mb-1">لوحة مختصرة</div>
                                <h3 className="text-2xl font-black text-white">جاهزية الفرص اليوم</h3>
                            </div>
                            <div className="rounded-full bg-emerald-500/10 border border-emerald-500/25 px-4 py-2 text-emerald-300 font-black text-xs">
                                تشغيل نشط
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {metrics.map((metric) => (
                                <div key={metric.label} className="rounded-2xl bg-black/35 border border-slate-900 p-4">
                                    <metric.icon className={`w-5 h-5 mb-3 ${metric.color}`} />
                                    <div className="text-[10px] text-slate-500 font-black mb-1">{metric.label}</div>
                                    <div className="text-xl font-black text-white">{metric.value}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export const SmartDashboardSection = ({ showComparison = true, simple = false }: { showComparison?: boolean; simple?: boolean }) => {
    const [hoveredQuestionIdx, setHoveredQuestionIdx] = useState<number | null>(null);

    if (simple) {
        return <SimpleAutomationEngineSection />;
    }

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
                <WhyAgentsBlock onHoverQuestion={setHoveredQuestionIdx} activeQuestionIdx={hoveredQuestionIdx} />

                {/* 3. Central Command Orbit Dashboard Grid (Centered, Full Width) */}
                <div className="flex items-center justify-center relative mb-20 w-full">
                    <AgentOrbitGrid activeQuestionIdx={hoveredQuestionIdx} />
                </div>

                {/* 4. Before / After Interactive Comparison Toggle */}
                {showComparison && <BeforeAfterToggle />}

                {/* 5. Monafsat Positioning Bridge */}
                <MonafsatBridge />

                {/* 6. Section Footer CTA Banner */}
                <DashboardCTA />

            </div>
        </div>
    );
};
