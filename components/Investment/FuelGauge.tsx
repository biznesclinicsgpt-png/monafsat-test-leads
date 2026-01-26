import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mail, Linkedin, Database, TrendingUp, Zap } from 'lucide-react';
import CountUp from 'react-countup';
import { useInvestmentTheme } from '../../context/InvestmentThemeContext';

const CHANNELS = [
    { id: 'calls', icon: Phone, label: 'اتصالات مباشرة', capacity: 7200, unit: 'دقيقة', color: 'from-rose-500 to-orange-500', shadow: 'shadow-rose-500/20' },
    { id: 'whatsapp', icon: MessageCircle, label: 'واتساب رسمي', capacity: 12000, unit: 'رسالة', color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
    { id: 'email', icon: Mail, label: 'تسلسل بريدي', capacity: 10000, unit: 'إيميل', color: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-500/20' },
    { id: 'linkedin', icon: Linkedin, label: 'لينكد إن', capacity: 3000, unit: 'تفاعل', color: 'from-sky-500 to-cyan-500', shadow: 'shadow-sky-500/20' },
];

export const FuelGauge = () => {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const { isDark } = useInvestmentTheme();

    return (
        <section className={`py-32 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0a0a0f]' : 'bg-white'
            }`}>
            {/* Background Glow */}
            <div className={`absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full blur-[128px] -translate-y-1/2 pointer-events-none ${isDark ? 'bg-emerald-900/10' : 'bg-emerald-100/40'
                }`} />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Content Side */}
                    <div className="space-y-8 text-right lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-bold mb-4 ${isDark
                                    ? 'bg-slate-800/50 border-slate-700 text-emerald-400'
                                    : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                }`}
                        >
                            <TrendingUp size={14} />
                            المرحلة الأولى: ضخ الوقود
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className={`text-4xl md:text-6xl font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'
                                }`}
                        >
                            وقود التشغيل <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-cyan-400">الذكي والمرن</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className={`text-lg leading-relaxed max-w-xl ml-auto ${isDark ? 'text-slate-400' : 'text-slate-600'
                                }`}
                        >
                            تكلفة الحملات <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>5,000 ريال شهرياً</span> (أو <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>9,000 ريال</span> للمشتركين ربع سنوياً). مقابل هذا الاستثمار، نشحن محركك بـ <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>15,000 نقطة تشغيلية</span> ربع سنوياً، ونوجهها تلقائياً للقناة التي تحقق أعلى عائد استثمار لقطاعك.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className={`flex flex-col gap-4 pl-12 border-r-2 ${isDark ? 'border-slate-800' : 'border-slate-200'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-lg mt-1 ${isDark ? 'bg-slate-800 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                                    }`}>
                                    <Database size={20} />
                                </div>
                                <div>
                                    <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>تكلفة حقيقية وليست عمالة</h4>
                                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>نقاطك تذهب لشراء البيانات، رسائل الواتساب، وأدوات الذكاء الاصطناعي، وليس رواتب موظفين.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-lg mt-1 ${isDark ? 'bg-slate-800 text-cyan-400' : 'bg-cyan-100 text-cyan-600'
                                    }`}>
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>إعادة توجيه فوري</h4>
                                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>لو مكالماتك لا تجيب نتيجة؟ نحول الرصيد فوراً لحملات الواتساب أو اللينكدإن.</p>
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
                        <div className={`relative backdrop-blur-xl border rounded-[40px] p-8 shadow-2xl overflow-hidden ${isDark
                                ? 'bg-slate-900/60 border-slate-700/50 shadow-black/50'
                                : 'bg-white/80 border-slate-200 shadow-slate-200/50'
                            }`}>
                            {/* Reflection */}
                            <div className={`absolute top-0 right-0 w-full h-[500px] pointer-events-none ${isDark
                                    ? 'bg-gradient-to-bl from-white/5 to-transparent'
                                    : 'bg-gradient-to-bl from-white/40 to-transparent'
                                }`} />

                            {/* Dashboard Header */}
                            <div className={`flex items-center justify-between mb-10 border-b pb-6 ${isDark ? 'border-white/5' : 'border-slate-100'
                                }`}>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="font-mono text-xs text-slate-500 tracking-widest uppercase">
                                    حالة النظام: <span className="text-emerald-400">متصل</span>
                                </div>
                            </div>

                            {/* Main Metric */}
                            <div className="text-center mb-12 relative">
                                <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">إجمالي رصيد العمليات (ربع سنوي)</div>
                                <div className={`text-7xl md:text-8xl font-black text-transparent bg-clip-text tracking-tighter ${isDark
                                        ? 'bg-gradient-to-b from-white to-slate-500'
                                        : 'bg-gradient-to-b from-slate-900 to-slate-500'
                                    }`}>
                                    <CountUp end={15000} duration={3} separator="," />
                                </div>
                                <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 font-bold text-xs px-3 py-1 rounded-full border whitespace-nowrap ${isDark
                                        ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                                        : 'text-emerald-600 bg-emerald-50 border-emerald-200'
                                    }`}>
                                    + تم تفعيل الشحن الربع سنوي
                                </div>
                            </div>

                            {/* Channel Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {CHANNELS.map((channel, idx) => (
                                    <motion.div
                                        key={idx}
                                        onHoverStart={() => setHoveredIdx(idx)}
                                        onHoverEnd={() => setHoveredIdx(null)}
                                        className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-default ${isDark
                                                ? hoveredIdx === idx ? 'bg-slate-800 border-slate-600' : 'bg-slate-800/40 border-slate-800'
                                                : hoveredIdx === idx ? 'bg-white border-slate-300 shadow-lg' : 'bg-slate-50 border-slate-200'
                                            }`}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${channel.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />

                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform duration-300 ${isDark ? 'bg-slate-900' : 'bg-white shadow-sm'
                                                } ${channel.shadow}`}>
                                                <channel.icon size={18} className={isDark ? 'text-white' : 'text-slate-700'} />
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-400 transition-colors">نشط</div>
                                        </div>

                                        <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'
                                            }`}>{channel.capacity.toLocaleString()}</div>
                                        <div className="text-xs text-slate-400">{channel.label} / {channel.unit}</div>

                                        {/* Progress Bar */}
                                        <div className={`mt-4 h-1 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'
                                            }`}>
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
