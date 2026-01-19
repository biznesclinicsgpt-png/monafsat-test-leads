import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mail, Linkedin, Database, TrendingUp, Zap } from 'lucide-react';
import CountUp from 'react-countup';

const CHANNELS = [
    { id: 'calls', icon: Phone, label: 'Cold Calling', capacity: 2400, unit: 'Min', color: 'from-rose-500 to-orange-500', shadow: 'shadow-rose-500/20' },
    { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp API', capacity: 6000, unit: 'Msg', color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
    { id: 'email', icon: Mail, label: 'Email Seq', capacity: 5000, unit: 'Sent', color: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-500/20' },
    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', capacity: 100, unit: '%', color: 'from-sky-500 to-cyan-500', shadow: 'shadow-sky-500/20' },
];

export const FuelGauge = () => {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    return (
        <section className="py-32 bg-[#0a0a0f] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[128px] -translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Content Side */}
                    <div className="space-y-8 text-right lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700 text-emerald-400 text-xs font-mono mb-4"
                        >
                            <TrendingUp size={14} />
                            PHASE 01 : FUEL INJECTION
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-6xl font-black text-white leading-tight"
                        >
                            وقود التشغيل <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-cyan-400">الذكي والمرن</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-slate-400 leading-relaxed max-w-xl ml-auto"
                        >
                            نحن لا نلزمك بقناة واحدة. نشحن محركك بـ <span className="text-white font-bold">15,000 نقطة تشغيلية</span> شهرياً، ونوجهها تلقائياً للقناة التي تحقق أعلى عائد استثمار لقطاعك.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col gap-4 pl-12 border-r-2 border-slate-800"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-slate-800 rounded-lg text-emerald-400 mt-1">
                                    <Database size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">تكلفة حقيقية وليست عمالة</h4>
                                    <p className="text-sm text-slate-500 mt-1">نقاطك تذهب لشراء البيانات، رسائل الواتساب، وأدوات الذكاء الاصطناعي، وليس رواتب موظفين.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-slate-800 rounded-lg text-cyan-400 mt-1">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">إعادة توجيه فوري</h4>
                                    <p className="text-sm text-slate-500 mt-1">لو مكالماتك لا تجيب نتيجة؟ نحول الرصيد فوراً لحملات الواتساب أو اللينكدإن.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Dashboard Visual Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative lg:order-1"
                    >
                        {/* Glass Panel */}
                        <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-[40px] p-8 shadow-2xl shadow-black/50 overflow-hidden">
                            {/* Reflection */}
                            <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />

                            {/* Dashboard Header */}
                            <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="font-mono text-xs text-slate-500 tracking-widest uppercase">
                                    System Status: <span className="text-emerald-400">Online</span>
                                </div>
                            </div>

                            {/* Main Metric */}
                            <div className="text-center mb-12 relative">
                                <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Total Credit Balance</div>
                                <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tighter">
                                    <CountUp end={15000} duration={3} separator="," />
                                </div>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-emerald-500 font-mono text-xs bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                    + Monthly Refill Active
                                </div>
                            </div>

                            {/* Channel Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {CHANNELS.map((channel, idx) => (
                                    <motion.div
                                        key={idx}
                                        onHoverStart={() => setHoveredIdx(idx)}
                                        onHoverEnd={() => setHoveredIdx(null)}
                                        className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-default ${hoveredIdx === idx ? 'bg-slate-800 border-slate-600' : 'bg-slate-800/40 border-slate-800'}`}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${channel.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />

                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-2 rounded-lg bg-slate-900 group-hover:scale-110 transition-transform duration-300 ${channel.shadow}`}>
                                                <channel.icon size={18} className="text-white" />
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-400 transition-colors">نشط</div>
                                        </div>

                                        <div className="text-2xl font-bold text-white mb-1">{channel.capacity.toLocaleString()}</div>
                                        <div className="text-xs text-slate-400">{channel.label} / {channel.unit}</div>

                                        {/* Progress Bar */}
                                        <div className="mt-4 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '70%' }}
                                                transition={{ duration: 1.5, delay: 0.5 + (idx * 0.1) }}
                                                className={`h-full bg-gradient-to-r ${channel.color}`}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
