import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mail, Linkedin, Database } from 'lucide-react';

const CHANNELS = [
    { id: 'calls', icon: Phone, label: 'مكالمات', capacity: '2400 دقيقة', color: 'bg-rose-500', text: 'text-rose-400' },
    { id: 'whatsapp', icon: MessageCircle, label: 'واتساب', capacity: '6000 رسالة', color: 'bg-emerald-500', text: 'text-emerald-400' },
    { id: 'email', icon: Mail, label: 'بريد إلكتروني', capacity: '5000 إيميل', color: 'bg-blue-500', text: 'text-blue-400' },
    { id: 'linkedin', icon: Linkedin, label: 'لينكدإن', capacity: 'Outreach & Auto', color: 'bg-sky-600', text: 'text-sky-400' },
];

export const FuelGauge = () => {
    const [activeChannel, setActiveChannel] = useState<string | null>(null);

    return (
        <section className="py-20 bg-slate-900 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                        أولاً: <span className="text-emerald-500">رصيد تشغيل الإدارة</span> (The Fuel)
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        نحن لا نبيع "عدد" قنوات، نحن نبيع "طاقة تشغيلية".
                        <br />
                        يتم شحن رصيد 15,000 نقطة واستهلاكها بمرونة في القناة الأعلى إنتاجية لقطاعك.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Visual Gauge */}
                    <div className="bg-slate-800/50 rounded-3xl p-8 border border-slate-700 backdrop-blur-xl relative">
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent"></div>

                        <div className="text-center mb-8">
                            <div className="font-mono text-emerald-400 text-sm mb-2">OPERATIONAL CREDIT BALANCE</div>
                            <div className="text-6xl font-black text-white tracking-tighter">15,000 <span className="text-2xl text-slate-500">PTS</span></div>
                        </div>

                        {/* Interactive Channels */}
                        <div className="grid grid-cols-2 gap-4">
                            {CHANNELS.map((channel) => (
                                <motion.div
                                    key={channel.id}
                                    onHoverStart={() => setActiveChannel(channel.id)}
                                    onHoverEnd={() => setActiveChannel(null)}
                                    className={`
                                        p-4 rounded-xl border border-slate-700 cursor-pointer transition-all duration-300
                                        ${activeChannel === channel.id ? 'bg-slate-700/80 border-emerald-500/50 scale-105' : 'bg-slate-800/50 hover:bg-slate-700'}
                                    `}
                                >
                                    <channel.icon className={`w-8 h-8 ${channel.text} mb-3`} />
                                    <div className="text-slate-200 font-bold text-lg">{channel.label}</div>
                                    <div className="text-slate-400 text-sm font-mono">{channel.capacity}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="space-y-8" dir="rtl">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                <Database size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">ما هو هذا الرصيد؟</h3>
                                <p className="text-slate-400 leading-relaxed">هو التكلفة الفعلية لتشغيل الحملات: شراء البيانات، أدوات الأتمتة، دقائق الاتصال، ورسائل الواتساب الرسمية.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                                <MessageCircle size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">المرونة الذكية</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    وارد جداً نكتشف ان "الواتساب" هو الأسرع في قطاعك، فنقوم بتحويل الرصيد بالكامل له.
                                    <br />
                                    <strong>الهدف:</strong> استهلاك الرصيد في المكان الذي يجلب "فرص" وليس مجرد "نشاط".
                                </p>
                            </div>
                        </div>

                        <div className="bg-emerald-900/20 border border-emerald-500/20 p-6 rounded-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-white font-bold">باقة الشحن الشهرية</span>
                                <span className="text-emerald-400 font-black text-2xl">5,000 ريال</span>
                            </div>
                            <div className="text-sm text-slate-400">
                                تغطي كافة تكاليف التشغيل التقني والبيانات.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
