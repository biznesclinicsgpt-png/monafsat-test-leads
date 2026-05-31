import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Network, Zap, Globe, MessageSquare, Flame } from 'lucide-react';

export const MoatSection = () => {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const networkNodes = [
    {
      id: 1,
      title: "لا نبدأ من الصفر",
      desc: "شبكة علاقاتنا الحية والدافئة مع صناع القرار تمنحك الأسبقية المطلقة دون الحاجة للبحث والاتصال البارد من الصفر.",
      icon: Network,
      color: "text-cyan-400 border-cyan-500/30",
      x: "15%", y: "20%"
    },
    {
      id: 2,
      title: "التواجد اليومي بالسوق",
      desc: "نحن متواجدون باستمرار داخل منظومة العمل السعودية، نرصد التطورات والتعميدات في الرياض وجدة والمنطقة الشرقية لحظة بلحظة.",
      icon: Globe,
      color: "text-emerald-400 border-emerald-500/30",
      x: "45%", y: "15%"
    },
    {
      id: 3,
      title: "احتكاك مع صناع القرار",
      desc: "نعرف كيف يفكر صناع القرار في كبرى الجهات والشركات السعودية وما هي شروطهم وتطلعاتهم الفنية لتوجيه عرضك بدقة.",
      icon: ShieldCheck,
      color: "text-violet-400 border-violet-500/30",
      x: "75%", y: "25%"
    },
    {
      id: 4,
      title: "رسائل تفتح الحوار",
      desc: "نصيغ رسائل وسيناريوهات تواصل حية تثير الاهتمام فوراً وتدفع متخذي القرار للرد وطلب عروض تفصيلية.",
      icon: MessageSquare,
      color: "text-blue-400 border-blue-500/30",
      x: "30%", y: "65%"
    },
    {
      id: 5,
      title: "تحريك الفرص مبكراً",
      desc: "نحرك دفة الفرص ونقتنص الاحتياج قبل أن يزدحم السوق بالمنافسين وتنشب الحروب السعرية التقليدية.",
      icon: Flame,
      color: "text-amber-400 border-amber-500/30",
      x: "60%", y: "70%"
    }
  ];

  return (
    <div className="py-32 bg-[#0A0A0A] relative overflow-hidden flex flex-col items-center border-t border-slate-900/60" id="moat">
      
      {/* Market Pulse Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[800px] h-[800px] rounded-full bg-emerald-500/10 blur-[120px]"
        />
      </div>

      {/* Grid line mapping backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a55_1px,transparent_1px),linear-gradient(to_bottom,#0f172a55_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 pointer-events-none z-0" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-semibold text-sm">سر التفوق والميزة التنافسية</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
            لماذا نصل أسرع من الطرق التقليدية؟
          </h2>
          <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            بدلاً من البدء من الصفر مع كل عميل محتمل وتضييع شهور في محاولة اختراق الحسابات الكبرى، نحن نصل مباشرة إلى الهدف بفضل رصيد علاقاتنا الحية وفهمنا العميق لمتطلبات صناع القرار في السوق السعودي.
          </p>
        </motion.div>

        {/* Network Map Visual Area */}
        <div className="relative w-full min-h-[480px] bg-slate-950/20 border border-slate-900/50 rounded-3xl p-6 md:p-12 overflow-hidden flex flex-col md:flex-row gap-8 items-stretch">
          
          {/* Interactive SVG Network Graph (Left Side / Top on Mobile) */}
          <div className="flex-1 min-h-[300px] relative border border-slate-900/40 rounded-2xl bg-black/40 overflow-hidden">
            
            {/* Draw SVG Connectors between nodes */}
            <svg className="absolute inset-0 w-full h-full opacity-40 z-0" xmlns="http://www.w3.org/2000/svg">
              {/* Connect node 1 to 2, 2 to 3, 3 to 5, 4 to 5, 1 to 4 */}
              <line x1="15%" y1="20%" x2="45%" y2="15%" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="45%" y1="15%" x2="75%" y2="25%" stroke="#10b981" strokeWidth="1.5" />
              <line x1="75%" y1="25%" x2="60%" y2="70%" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="30%" y1="65%" x2="60%" y2="70%" stroke="#3b82f6" strokeWidth="1.5" />
              <line x1="15%" y1="20%" x2="30%" y2="65%" stroke="#06b6d4" strokeWidth="1.5" />
              <line x1="45%" y1="15%" x2="60%" y2="70%" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 5" />
            </svg>

            {/* Glowing Flow Dot traveling down paths */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
              <motion.div
                animate={{
                  x: ["15%", "45%", "75%", "60%", "30%", "15%"],
                  y: ["20%", "15%", "25%", "70%", "65%", "20%"]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"
              />
            </div>

            {/* Render Nodes */}
            {networkNodes.map((node) => {
              const Icon = node.icon;
              const isActive = activeNode === node.id;
              return (
                <button
                  key={node.id}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onClick={() => setActiveNode(node.id)}
                  className="absolute z-20 group -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
                  style={{ left: node.x, top: node.y }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-slate-950 border-2 flex items-center justify-center transition-all ${
                    isActive ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "border-slate-800"
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  </div>
                  <div className="absolute top-[110%] left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-[10px] font-extrabold text-white px-2 py-0.5 rounded border border-slate-800 opacity-60 group-hover:opacity-100 transition-opacity">
                    {node.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details Card display side (Right Side / Bottom on Mobile) */}
          <div className="w-full md:w-80 flex flex-col justify-center text-right bg-slate-950/40 border border-slate-900/50 p-6 rounded-2xl backdrop-blur-sm">
            <AnimatePresence mode="wait">
              {activeNode !== null ? (
                <motion.div
                  key={activeNode}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    الميزة التنافسية {activeNode}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {networkNodes[activeNode - 1].title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {networkNodes[activeNode - 1].desc}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-slate-500 flex flex-col items-center justify-center py-10 h-full"
                >
                  <Network className="w-8 h-8 text-slate-700 mb-3 animate-pulse" />
                  <span className="text-xs font-bold">مرر الماوس فوق النقاط لاستكشاف شبكة العلاقات والمزايا التنافسية التفاعلية</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Bottom checklist metrics */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-16 flex flex-wrap justify-center gap-4 text-slate-400 font-medium"
        >
          <span className="px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-xs font-bold">✓ اختصار زمن دورة المبيعات بـ ٣ أضعاف</span>
          <span className="px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-cyan-400 text-xs font-bold">✓ تجاوز حواجز السكرتارية والوصول المباشر</span>
          <span className="px-4 py-2 bg-violet-500/10 rounded-full border border-violet-500/20 text-violet-400 text-xs font-bold">✓ صياغة عروض وحلول مطابقة لتطلعات صناع القرار</span>
          <span className="px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400 text-xs font-bold">✓ تجنب البرود البيعي ومتابعة لحظية ومستمرة</span>
        </motion.div>

      </div>
    </div>
  );
};
