import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Bot, Sparkles, ShieldCheck, TrendingUp, Cpu, ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { LiveDashboardPanel } from './LiveDashboardPanel';

interface Agent {
    id: number;
    name: string;
    desc: string;
    kpi: string;
    benefit: string;
    category: 'data' | 'access' | 'closing' | 'market';
    position: { x: number; y: number }; // Percentage position on desktop orbit layout
    metricId: string; // Linked to dashboard metric
}

const toArabicNumerals = (num: number | string): string => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, (w) => arabicDigits[+w]);
};

export const AgentOrbitGrid = () => {
    const [activeNode, setActiveNode] = useState<number | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const [expandedCategory, setExpandedCategory] = useState<string | null>('data');

    const agents: Agent[] = [
        // TOP ROW (01 to 05) - Y: 8% (Sorted RTL: 1 starts on the right, 5 ends on the left)
        { id: 1, name: "٠١ فهم النشاط التجاري", desc: "يفهم نشاطكم وعروضكم ويصيغ ميزتكم التنافسية بدقة.", kpi: "دقة استيعاب الهوية ١٠٠٪", benefit: "هوية متناسقة ومقنعة في السوق", category: "data", position: { x: 78, y: 8 }, metricId: "leads" },
        { id: 2, name: "٠٢ تحليل السوق والقطاعات", desc: "يرصد حجم الطلب والقطاعات الأكثر احتياجاً لخدماتكم بالسوق.", kpi: "كشف +٥ قطاعات واعدة شهرياً", benefit: "توجيه ذكي لميزانيات الحملات", category: "data", position: { x: 64, y: 8 }, metricId: "leads" },
        { id: 3, name: "٠٣ تحليل وتقييم الفرص", desc: "يقيم المشاريع والصفقات المطروحة لتحديد ربحيتها وملائمتها.", kpi: "فرز +٥٠ صفقة شهرياً وتقييمها", benefit: "تركيز الموارد على الصفقات الأسهل حسمًا", category: "data", position: { x: 50, y: 8 }, metricId: "leads" },
        { id: 4, name: "٠٤ جلب البيانات الذكية", desc: "يبحث ويفلتر البيانات من بين ملايين السجلات والشركات بالمملكة.", kpi: "تحديث فوري لـ ٨ مليون جهة اتصال", benefit: "قاعدة عملاء مستهدفة متكاملة ودقيقة", category: "data", position: { x: 36, y: 8 }, metricId: "decision_makers" },
        { id: 5, name: "٠٥ تنظيف وتدقيق البيانات", desc: "يتحقق من دقة وصلاحية أرقام الهواتف والبريد الإلكتروني للجهات.", kpi: "دقة وصول للعميل الفعلي تتجاوز ٩٥٪", benefit: "منع ارتداد الرسائل وهدر التواصل", category: "data", position: { x: 22, y: 8 }, metricId: "decision_makers" },

        // RIGHT COLUMN (06 to 13) - X: 91%
        { id: 6, name: "٠٦ تحديد صناع القرار", desc: "يحدد هوية ومناصب المدراء والتنفيذيين المسؤولين مباشرة.", kpi: "كشف المسمى التنفيذي المسؤول بدقة", benefit: "تجاوز السكرتارية والوصول المباشر فوراً", category: "access", position: { x: 91, y: 17 }, metricId: "decision_makers" },
        { id: 7, name: "٠٧ اختيار القناة الأنسب", desc: "يحدد قناة التواصل الفعالة لكل صانع قرار (واتساب، بريد، إلخ).", kpi: "رفع معدل استجابة القناة بنسبة ٤٠٪", benefit: "تواصل شخصي دافئ في القناة المفضلة للعميل", category: "access", position: { x: 91, y: 25 }, metricId: "conversations" },
        { id: 8, name: "٠٨ تحديد احتمالية الرد", desc: "يحلل التجاوب التاريخي للمستهدفين لتوقع احتمالية رد العميل.", kpi: "ترتيب أولويات التواصل بذكاء وكفاءة", benefit: "توجيه الجهد البشري للعملاء الأكثر استعداداً للرد", category: "access", position: { x: 91, y: 33 }, metricId: "conversations" },
        { id: 9, name: "٠٩ تخصيص الرسالة الأولى", desc: "يصيغ عروضًا ورسائل مخصصة تلائم طبيعة عمل واحتياج كل جهة.", kpi: "تحقيق نسبة فتح وقراءة تتجاوز ٨٠٪", benefit: "خلق انطباع أولي احترافي يكسر الجليد", category: "access", position: { x: 91, y: 41 }, metricId: "conversations" },
        { id: 10, name: "١٠ بدء المحادثة الذكية", desc: "يطلق حملات الوصول الأولي وبدء المحادثات عبر قنوات الاتصال.", kpi: "أتمتة إرسال وتوليد حملات مخصصة 24/7", benefit: "تدفق يومي مستمر للمهتمين دون تنقيب يدوي", category: "access", position: { x: 91, y: 49 }, metricId: "conversations" },
        { id: 11, name: "١١ المتابعة الذكية والجدولة", desc: "يتابع بانتظام وااحترافية للحفاظ على حيوية المحادثات وحجز موعد.", kpi: "جدولة وتأكيد الاجتماع تلقائياً بالتقويم", benefit: "الحفاظ على العميل ومنع نسيان أي فرصة", category: "access", position: { x: 91, y: 57 }, metricId: "meetings" },
        { id: 12, name: "١٢ تجهيز الاجتماع وتأهيله", desc: "يجمع ملفاً متكاملاً واحتياجات العميل قبل اللقاء البيعي.", kpi: "تجهيز ملخص الاحتياجات والملف التعريفي للعميل", benefit: "دخول الاجتماع بوعي كامل وقدرة إقناع عالية", category: "access", position: { x: 91, y: 65 }, metricId: "meetings" },
        { id: 13, name: "١٣ تحليل مسار الاجتماعات", desc: "يحلل ما تم بالاجتماع لتسجيل النقاط والاعتراضات والخطوات القادمة.", kpi: "استخلاص الاعتراضات وبناء خطة الإغلاق", benefit: "ضمان توجيه الخطوة القادمة لإتمام البيع", category: "access", position: { x: 91, y: 73 }, metricId: "meetings" },

        // BOTTOM ROW (14 to 21) - Y: 92% (Sorted RTL: 14 starts on the right, 21 ends on the left)
        { id: 14, name: "١٤ إدارة وتصنيف الفرص", desc: "يتابع حركة الصفقات داخل قمع المبيعات وتوجيهها للمرحلة الأنسب.", kpi: "تصنيف فوري للصفقات حسب الجدية", benefit: "رؤية شاملة وموثوقة لجميع صفقات الشركة النشطة", category: "closing", position: { x: 88, y: 92 }, metricId: "negotiations" },
        { id: 15, name: "١٥ التنبؤ بفرص الإغلاق", desc: "يحلل سلوك العميل لتقييم مدى جاهزية الصفقة وتحديد موعد حسمها.", kpi: "دقة توقع مالي بالتدفقات بنسبة ٩٠٪", benefit: "رؤية استباقية دقيقة تخدم اتخاذ القرار", category: "closing", position: { x: 77, y: 92 }, metricId: "negotiations" },
        { id: 16, name: "١٦ تحسين وتعديل العروض", desc: "يقترح التعديلات المناسبة على العروض الفنية والمالية لجذب العميل.", kpi: "تخصيص صيغة وتسعير العرض بما يطابق رغبة العميل", benefit: "عروض أسعار مثالية تكتسح المنافسين", category: "closing", position: { x: 66, y: 92 }, metricId: "negotiations" },
        { id: 17, name: "١٧ دعم التفاوض وحسم السعر", desc: "يزود فريقكم بالردود المناسبة على الاعتراضات وتسهيل التفاوض.", kpi: "تزويد المبيعات بنقاط القوة لحسم السعر", benefit: "حماية هوامش الأرباح وإتمام الصفقة بقيمة ممتازة", category: "closing", position: { x: 55, y: 92 }, metricId: "negotiations" },
        { id: 18, name: "١٨ توقع وتحليل الإيرادات", desc: "يحلل البيانات التاريخية والنشطة للتنبؤ بالتدفقات المالية القادمة.", kpi: "توقعات تدفق مالي تراكمي للربع القادم", benefit: "ثقة مطلقة في التخطيط لاستثمارات النمو والتوسع", category: "closing", position: { x: 44, y: 92 }, metricId: "expected_revenue" },
        { id: 19, name: "١٩ تحليل المكالمات الصوتية", desc: "يقيم التسجيلات الصوتية لتحسين نبرة البيع ومعالجة الاعتراضات.", kpi: "رصد فوري لنسب الالتزام وجودة التحدث", benefit: "تطوير مستمر ومباشر لمهارات مبيعات الفريق البشري", category: "closing", position: { x: 33, y: 92 }, metricId: "negotiations" },
        { id: 20, name: "٢٠ تحليل محادثات واتساب", desc: "يقيس تفاعلية وسرعة الردود عبر الواتساب ويقترك الرد الأفضل.", kpi: "تحسين سرعة الاستجابة ورفع الرضا للعميل", benefit: "حسم اهتمام العميل الفوري وتفادي برود المحادثة", category: "closing", position: { x: 22, y: 92 }, metricId: "conversations" },
        { id: 21, name: "٢١ تحليل التفاعل المهني", desc: "يراقب التفاعلات المهنية لصناع القرار عبر لينكدإن لبناء علاقات.", kpi: "رصد اهتمامات ومشاركات صانع القرار لبناء الثقة", benefit: "فتح قنوات بيعية مبنية على العلاقات المهنية الوثيقة", category: "closing", position: { x: 11, y: 92 }, metricId: "decision_makers" },

        // LEFT COLUMN (22 to 25) - X: 9%
        { id: 22, name: "٢٢ مراقبة السوق والمنافسين", desc: "يرصد تحركات المنافسين، تغييرات أسعارهم، والخدمات الجديدة.", kpi: "رصد تنافسي مستمر لحظة بلحظة", benefit: "الحفاظ على الصدارة وتعديل عروضكم استباقياً", category: "market", position: { x: 9, y: 17 }, metricId: "leads" },
        { id: 23, name: "٢٣ رصد فرص منافسات", desc: "يمسح ويفلتر المناقصات والمشاريع الحكومية والخاصة لحظة بلحظة.", kpi: "مسح فوري وشامل لفرص مناقصات الخليج", benefit: "عدم تفويت أي مشروع أو منافسة تناسب تخصصكم", category: "market", position: { x: 9, y: 35 }, metricId: "leads" },
        { id: 24, name: "٢٤ رصد واكتشاف الموردين", desc: "يبحث عن أفضل شركاء التنفيذ والموردين لدعم مشاريعكم.", kpi: "تقليص كلفة توريد مشاريعكم بنسبة ٢٠٪", benefit: "تقديم أسعار منافسة تضمن لكم الفوز بالصفقة", category: "market", position: { x: 9, y: 53 }, metricId: "leads" },
        { id: 25, name: "٢٥ وكيل قيادة الإيرادات", desc: "الوكيل المحرك الرئيسي لتوجيه وتكامل عمل كافة الوكلاء.", kpi: "تشغيل متناغم للمنظومة كعقل ذكي واحد", benefit: "أتمتة شاملة وتكامل للنمو المستمر دون أي تعطل", category: "market", position: { x: 9, y: 71 }, metricId: "expected_revenue" },
    ];

    // Helper map to assign category styling classes
    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'data': return 'border-violet-500/20 hover:border-violet-500 text-violet-400 bg-violet-950/10 shadow-[0_0_10px_rgba(139,92,246,0.05)] hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]';
            case 'access': return 'border-cyan-500/20 hover:border-cyan-500 text-cyan-400 bg-cyan-950/10 shadow-[0_0_10px_rgba(6,182,212,0.05)] hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]';
            case 'closing': return 'border-blue-500/20 hover:border-blue-500 text-blue-400 bg-blue-950/10 shadow-[0_0_10px_rgba(59,130,246,0.05)] hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]';
            case 'market': return 'border-emerald-500/20 hover:border-emerald-500 text-emerald-400 bg-emerald-950/10 shadow-[0_0_10px_rgba(16,185,129,0.05)] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]';
            default: return 'border-slate-800 text-slate-400 bg-slate-900/10';
        }
    };

    // Calculate nearest point on the central dashboard boundary
    const getConnectPoints = (x: number, y: number) => {
        let destX = x;
        let destY = y;
        
        if (x < 23) destX = 23;
        else if (x > 77) destX = 77;
        
        if (y < 16) destY = 16;
        else if (y > 84) destY = 84;
        
        return { destX, destY };
    };

    // Mobile categories grouping list
    const categories = [
        { id: 'data', title: "١. تحليل السوق والبيانات (الأعضاء ٠١ - ٠٥)", color: "text-violet-400", border: "border-violet-500/20", glow: "bg-violet-500/5" },
        { id: 'access', title: "٢. الوصول وصناعة القرار (الأعضاء ٠٦ - ١٣)", color: "text-cyan-400", border: "border-cyan-500/20", glow: "bg-cyan-500/5" },
        { id: 'closing', title: "٣. إدارة الفرص وحسم الإغلاق (الأعضاء ١٤ - ٢١)", color: "text-blue-400", border: "border-blue-500/20", glow: "bg-blue-500/5" },
        { id: 'market', title: "٤. المراقبة الاستباقية للنمو (الأعضاء ٢٢ - ٢٥)", color: "text-emerald-400", border: "border-emerald-500/20", glow: "bg-emerald-500/5" }
    ];

    const getHighlightedMetricId = () => {
        if (activeNode === null) return undefined;
        const currentAgent = agents.find(a => a.id === activeNode);
        return currentAgent ? currentAgent.metricId : undefined;
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 select-none mb-12">
            
            {/* DESKTOP NEURAL ORBIT GRID VIEW (Height increased via aspect-780 for better vertical spacing) */}
            <div className="relative w-full aspect-[900/780] hidden lg:block">
                
                {/* SVG Network Connector Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <filter id="glow-line" x="-10%" y="-10%" width="120%" height="120%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    
                    {agents.map((agent) => {
                        const { destX, destY } = getConnectPoints(agent.position.x, agent.position.y);
                        const isHovered = activeNode === agent.id;
                        
                        return (
                            <g key={agent.id} className="transition-all duration-300">
                                {/* Base line connection */}
                                <line 
                                    x1={`${agent.position.x}%`} 
                                    y1={`${agent.position.y}%`} 
                                    x2={`${destX}%`} 
                                    y2={`${destY}%`} 
                                    stroke={isHovered ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.025)"}
                                    strokeWidth={isHovered ? 1.8 : 0.8}
                                    className="transition-all duration-300"
                                />
                                
                                {/* Animated glowing connector line */}
                                {isHovered && (
                                    <>
                                        <line 
                                            x1={`${agent.position.x}%`} 
                                            y1={`${agent.position.y}%`} 
                                            x2={`${destX}%`} 
                                            y2={`${destY}%`} 
                                            stroke="#10b981"
                                            strokeWidth={1.5}
                                            strokeDasharray="4 6"
                                            style={{ filter: "url(#glow-line)" }}
                                        />
                                        {!shouldReduceMotion && (
                                            <motion.circle
                                                cx={`${agent.position.x}%`}
                                                cy={`${agent.position.y}%`}
                                                r={1.2}
                                                fill="#10b981"
                                                animate={{ 
                                                    cx: [`${agent.position.x}%`, `${destX}%`],
                                                    cy: [`${agent.position.y}%`, `${destY}%`],
                                                    opacity: [0, 1, 0]
                                                }}
                                                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                                            />
                                        )}
                                    </>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* CENTRAL METRICS PANEL - Repositioned inside taller grid */}
                <div className="absolute left-[23%] top-[14%] w-[54%] h-[68%] z-20">
                    <LiveDashboardPanel 
                        className="w-full h-full" 
                        highlightedMetric={getHighlightedMetricId()} 
                    />
                </div>

                {/* SATELITE OUTER AGENTS GLASSMORPHIC PILLS */}
                {agents.map((agent) => {
                    const isHovered = activeNode === agent.id;
                    
                    return (
                        <motion.div
                            key={agent.id}
                            className={cn(
                                "absolute cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3.5 xl:py-2 rounded-full border text-[8.5px] xl:text-[9.5px] font-black z-30 transition-all duration-300 backdrop-blur-sm whitespace-nowrap select-none",
                                getCategoryStyles(agent.category)
                            )}
                            style={{ 
                                left: `${agent.position.x}%`, 
                                top: `${agent.position.y}%`,
                                x: "-50%",
                                y: "-50%"
                            }}
                            onMouseEnter={() => setActiveNode(agent.id)}
                            onMouseLeave={() => setActiveNode(null)}
                            animate={shouldReduceMotion ? {} : { 
                                y: isHovered 
                                    ? "-58%" 
                                    : [
                                        "-50%", 
                                        `-${50 + (Math.sin(agent.id) * 2.5)}%`, 
                                        "-50%"
                                    ] 
                            }}
                            transition={{ 
                                y: isHovered 
                                    ? { duration: 0.15 } 
                                    : { 
                                        duration: 4.5 + (agent.id % 2.5), 
                                        repeat: Infinity, 
                                        ease: "easeInOut", 
                                        delay: agent.id * 0.08 
                                    } 
                            }}
                        >
                            {agent.id === 25 ? (
                                <Bot className="w-4 h-4 text-emerald-400" />
                            ) : (
                                <span className="w-4 h-4 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[8.5px] font-sans font-bold shrink-0">
                                    {toArabicNumerals(agent.id.toString().padStart(2, '0'))}
                                </span>
                            )}
                            <span className="truncate max-w-[110px]">{agent.name.split(' ').slice(1).join(' ')}</span>

                            {/* HOVER TOOLTIP OVERLAY */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: agent.position.y > 50 ? -10 : 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: agent.position.y > 50 ? -10 : 10 }}
                                        transition={{ duration: 0.2 }}
                                        className={cn(
                                            "absolute w-[280px] p-5 rounded-2xl bg-slate-950/98 border shadow-2xl backdrop-blur-xl z-50 text-right cursor-default",
                                            agent.position.y > 50 ? "bottom-[130%]" : "top-[130%]",
                                            agent.position.x > 50 ? "left-0" : "right-0",
                                            agent.category === 'data' ? "border-violet-500/40 shadow-violet-950/20" :
                                            agent.category === 'access' ? "border-cyan-500/40 shadow-cyan-950/20" :
                                            agent.category === 'closing' ? "border-blue-500/40 shadow-blue-950/20" :
                                            "border-emerald-500/40 shadow-emerald-950/20"
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-slate-900">
                                            <Cpu className="w-4 h-4 text-emerald-400" />
                                            <h4 className="text-xs md:text-sm font-black text-white">{agent.name}</h4>
                                        </div>
                                        
                                        <div className="space-y-3.5 text-[9.5px] md:text-xs leading-relaxed font-bold">
                                            <div>
                                                <span className="block text-slate-500 text-[8px] md:text-[9px] font-bold">مهمة العمل:</span>
                                                <p className="text-slate-300 font-semibold">{agent.desc}</p>
                                            </div>
                                            <div>
                                                <span className="block text-slate-500 text-[8px] md:text-[9px] font-bold">الفائدة المستهدفة:</span>
                                                <p className="text-slate-300 font-semibold">✓ {agent.benefit}</p>
                                            </div>
                                            <div className="bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-xl flex items-center justify-between">
                                                <span className="text-emerald-400 font-black font-sans">{agent.kpi}</span>
                                                <span className="text-slate-400 font-black">الـ KPI المرتبط:</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* MOBILE ONLY COLLAPSIBLE ACCORDIONS VIEW */}
            <div className="lg:hidden w-full space-y-4">
                {/* Central mini status board */}
                <LiveDashboardPanel className="w-full" />

                {/* 4 Accordions for categories */}
                <div className="space-y-3 mt-6">
                    <h4 className="text-xs font-black text-slate-400 text-center tracking-wide mb-2">توزيع عمل الـ ٢٥ وكيلاً بالتفصيل</h4>
                    
                    {categories.map((cat) => {
                        const isExpanded = expandedCategory === cat.id;
                        const catAgents = agents.filter(a => a.category === cat.id);

                        return (
                            <div 
                                key={cat.id} 
                                className={cn(
                                    "border rounded-2xl overflow-hidden transition-all duration-300 bg-slate-950/40 backdrop-blur-sm",
                                    isExpanded ? "border-slate-800" : "border-slate-900/60"
                                )}
                            >
                                {/* Accordion Header */}
                                <button
                                    onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                                    className="w-full flex items-center justify-between p-4 focus:outline-none"
                                >
                                    <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-300", isExpanded ? "transform rotate-180 text-white" : "")} />
                                    <span className={cn("text-xs font-bold", cat.color)}>{cat.title}</span>
                                </button>

                                {/* Accordion Content */}
                                <AnimatePresence initial={false}>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                        >
                                            <div className="px-4 pb-4.5 space-y-3.5 border-t border-slate-900/80 pt-4 bg-slate-950/20">
                                                {catAgents.map((agent) => (
                                                    <div 
                                                        key={agent.id} 
                                                        className={cn(
                                                            "p-3.5 rounded-xl border text-right",
                                                            agent.category === 'data' ? "border-violet-500/10 bg-violet-950/5" :
                                                            agent.category === 'access' ? "border-cyan-500/10 bg-cyan-950/5" :
                                                            agent.category === 'closing' ? "border-blue-500/10 bg-blue-950/5" :
                                                            "border-emerald-500/10 bg-emerald-950/5"
                                                        )}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className={cn(
                                                                "text-[8px] px-2 py-0.5 rounded-md border bg-slate-950 font-bold",
                                                                agent.category === 'data' ? "border-violet-500/20 text-violet-400" :
                                                                agent.category === 'access' ? "border-cyan-500/20 text-cyan-400" :
                                                                agent.category === 'closing' ? "border-blue-500/20 text-blue-400" :
                                                                "border-emerald-500/20 text-emerald-400"
                                                            )}>
                                                                {agent.kpi}
                                                            </span>
                                                            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                                                                {agent.id === 25 ? <Bot className="w-3.5 h-3.5 text-emerald-400" /> : null}
                                                                {agent.name}
                                                            </h5>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">{agent.desc}</p>
                                                        <div className="mt-2 text-[9px] text-slate-400 leading-normal pt-1.5 border-t border-slate-900/60 font-semibold">
                                                            <span className="text-slate-500">الفائدة:</span> {agent.benefit}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};
