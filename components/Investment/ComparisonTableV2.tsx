import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';

const ROWS = [
    { label: 'أتمتة الواتساب', diy: true, dwy: true, dfy: true },
    { label: 'أتمتة لينكد إن', diy: true, dwy: true, dfy: true },
    { label: 'أتمتة الإيميل', diy: true, dwy: true, dfy: true },
    { label: 'اشتراك الأدوات', diy: true, dwy: true, dfy: true },
    { label: 'تجهيز الرسائل والأتمتة', diy: false, dwy: true, dfy: true },
    { label: 'وكلاء AI Agents', diy: false, dwy: true, dfy: true },
    { label: 'شراء بيانات وأرقام', diy: false, dwy: true, dfy: true },
    { label: 'فريق تنفيذ كامل', diy: false, dwy: false, dfy: true },
    { label: 'مدير نجاح عملاء', diy: false, dwy: false, dfy: true },
    { label: 'فرص مؤهلة جاهزة', diy: false, dwy: false, dfy: true },
];

const CheckIcon = ({ color = 'emerald' }: { color?: 'emerald' | 'purple' | 'blue' }) => {
    const bgClasses = {
        emerald: 'bg-emerald-100 text-emerald-600',
        purple: 'bg-purple-100 text-purple-600',
        blue: 'bg-blue-100 text-blue-600',
    };
    return (
        <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${bgClasses[color]}`}>
            <Check size={14} strokeWidth={3} />
        </div>
    );
};

const DashIcon = () => <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300"><Minus size={14} strokeWidth={3} /></div>;

export const ComparisonTableV2 = () => {
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    return (
        <div className="py-24 px-6 max-w-[1280px] mx-auto" dir="rtl" id="comparison">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-sm px-5 py-1.5 rounded-full mb-5 font-tajawal">
                    📊 مقارنة تفصيلية
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-tajawal">
                    ما الفرق بين <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-400">النماذج الثلاثة؟</span>
                </h2>
                <p className="text-lg text-slate-500 max-w-[650px] mx-auto leading-relaxed font-tajawal">
                    جدول يوضح الفروقات الجوهرية بين باقاتنا لتختار الأنسب لاحتياجاتك.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-white"
            >
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-right font-tajawal border-collapse">
                        <thead>
                            <tr className="sticky top-0 z-10">
                                <th className="p-6 bg-slate-50/90 backdrop-blur-md border-b border-slate-200 text-slate-500 font-bold text-sm w-1/4 min-w-[200px]">الميزة / الخدمة</th>

                                {/* DIY - Purple */}
                                <th className="p-6 text-center w-1/4 min-w-[200px] bg-purple-50/90 backdrop-blur-md border-b border-purple-100">
                                    <div className="text-lg font-black text-slate-900 mb-1">افعلها بنفسك</div>
                                    <div className="text-xs text-purple-600 font-bold">للمستقلين</div>
                                </th>

                                {/* DWY - Emerald */}
                                <th className="p-6 text-center w-1/4 min-w-[200px] bg-emerald-50/90 backdrop-blur-md border-b border-emerald-100">
                                    <div className="text-lg font-black text-slate-900 mb-1">ننفذها معك</div>
                                    <div className="text-xs text-emerald-600 font-bold">للمتعاونين</div>
                                </th>

                                {/* DFY - Blue */}
                                <th className="p-6 text-center w-1/4 min-w-[200px] bg-blue-50/90 backdrop-blur-md border-b-4 border-b-blue-500">
                                    <div className="text-lg font-black text-slate-900 mb-1">ننفذها لك</div>
                                    <div className="text-xs text-blue-600 font-bold">للمؤسسات</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {ROWS.map((row, i) => (
                                <tr
                                    key={i}
                                    className={`transition-colors duration-200 ${hoveredRow === i ? 'bg-slate-50' : 'bg-white'}`}
                                    onMouseEnter={() => setHoveredRow(i)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                >
                                    <td className="p-6 border-b border-slate-100 font-bold text-slate-700">{row.label}</td>

                                    {/* DIY Column */}
                                    <td className={`p-6 border-b border-slate-100 text-center ${hoveredRow === i ? 'bg-purple-50/50' : ''}`}>
                                        <div className="flex justify-center">{row.diy ? <CheckIcon color="purple" /> : <DashIcon />}</div>
                                    </td>

                                    {/* DWY Column */}
                                    <td className={`p-6 border-b border-slate-100 text-center ${hoveredRow === i ? 'bg-emerald-50/50' : ''}`}>
                                        <div className="flex justify-center">{row.dwy ? <CheckIcon color="emerald" /> : <DashIcon />}</div>
                                    </td>

                                    {/* DFY Column */}
                                    <td className={`p-6 border-b border-slate-100 text-center ${hoveredRow === i ? 'bg-blue-50/50' : 'bg-blue-50/10'}`}>
                                        <div className="flex justify-center">{row.dfy ? <CheckIcon color="blue" /> : <DashIcon />}</div>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-slate-50">
                                <td className="p-6 font-black text-slate-900 text-lg">التكلفة الشهرية</td>
                                <td className="p-6 text-center bg-purple-50/30">
                                    <div className="text-xl font-black text-purple-600">1,000 ريال</div>
                                    <div className="text-xs text-slate-400 mt-1">دفع ربع سنوي</div>
                                </td>
                                <td className="p-6 text-center bg-emerald-50/30">
                                    <div className="text-xl font-black text-emerald-600">6,000 ريال</div>
                                    <div className="text-xs text-slate-400 mt-1">شامل الفريق والأدوات</div>
                                </td>
                                <td className="p-6 text-center bg-blue-50/30">
                                    <div className="text-xl font-black text-blue-600">من 6,000 ريال</div>
                                    <div className="text-xs text-slate-400 mt-1">حسب حجم الصفقة</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};
