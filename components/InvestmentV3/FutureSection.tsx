import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Activity, Users, Target, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const FutureSection = () => {
  const chartData = [
    { month: 'الشهر ١', value: 10 },
    { month: 'الشهر ٢', value: 25 },
    { month: 'الشهر ٣', value: 45 },
    { month: 'الشهر ٤', value: 80 },
    { month: 'الشهر ٥', value: 120 },
    { month: 'الشهر ٦', value: 180 },
  ];

  const benefits = [
    "تدفق فرص مستمر لا يتوقف",
    "اجتماعات أسبوعية مجدولة مع صناع القرار",
    "رؤية كاملة وواضحة لحركة الفرص",
    "قاعدة علاقات أكبر في السوق",
    "سرعة أعلى بكثير في الوصول والإغلاق"
  ];

  return (
    <div className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            بعد ٦ شهور من التشغيل...
          </motion.h2>
          <p className="text-xl text-slate-400">
            كيف سيبدو شكل النمو في شركتك؟
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Right Side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              {benefits.map((benefit, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-xl text-slate-200">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Left Side - Dashboard Simulation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            {/* Glassmorphism Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="text-slate-400 font-medium text-sm">محاكاة لوحة تحكم الإيرادات</div>
            </div>

            {/* Counters */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <Target className="w-5 h-5 text-blue-400 mb-2" />
                <div className="text-sm text-slate-400 mb-1">الفرص النشطة</div>
                <div className="text-2xl font-bold text-white flex items-center gap-1">
                  <CountUp end={180} duration={4} />
                  <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <Users className="w-5 h-5 text-purple-400 mb-2" />
                <div className="text-sm text-slate-400 mb-1">الاجتماعات</div>
                <div className="text-2xl font-bold text-white flex items-center gap-1">
                  <CountUp end={45} duration={4} />
                  <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-900/40 to-black rounded-2xl p-4 border border-emerald-500/30">
                <Activity className="w-5 h-5 text-emerald-400 mb-2" />
                <div className="text-sm text-emerald-400/80 mb-1">معدل النمو</div>
                <div className="text-2xl font-bold text-emerald-400 flex items-center gap-1">
                  +<CountUp end={320} duration={4} />%
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={4}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8, fill: '#10b981' }}
                    animationDuration={3000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </div>
  );
};
