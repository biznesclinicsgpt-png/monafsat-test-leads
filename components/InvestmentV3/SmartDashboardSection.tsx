import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Bot, 
    Activity, 
    Target, 
    Briefcase, 
    TrendingUp, 
    ShieldCheck, 
    Eye, 
    Sparkles, 
    RefreshCw,
    BrainCircuit,
    Zap,
    Check,
    MessageSquare,
    Phone,
    Mail,
    FileText,
    ActivityIcon,
    Cpu,
    ShieldAlert
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Agent {
    id: number;
    name: string;
    desc: string;
    benefit: string;
    impact: string;
    category: 'data' | 'access' | 'closing' | 'market';
    position: { x: number; y: number }; // Percentage position on desktop orbit layout
}

export const SmartDashboardSection = () => {
    const [activeNode, setActiveNode] = useState<number | null>(null);

    // List of features in the Left column
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

    // 25 AI Agents data grouped geometrically for orbital network layout
    const agents: Agent[] = [
        // TOP ROW (01 to 05) - Y: 7%
        { id: 1, name: "٠١ فهم النشاط التجاري", desc: "يفهم نشاطكم وخدماتكم الاستراتيجية بدقة لاستخلاص ميزتكم التنافسية.", benefit: "استيعاب كامل لهوية شركتكم التجارية.", impact: "تخصيص الرسائل لتطابق قيمتكم الحقيقية بالسوق.", category: "data", position: { x: 26, y: 7 } },
        { id: 2, name: "٠٢ تحليل السوق والقطاعات", desc: "يرصد حجم الطلب والقطاعات الأكثر احتياجاً لخدماتكم بالسوق السعودي.", benefit: "كشف الثغرات والفرص التجارية المتاحة.", impact: "توجيه جهود المبيعات للقطاع الأعلى عائداً ماليًا.", category: "data", position: { x: 38, y: 7 } },
        { id: 3, name: "٠٣ تحليل وتقييم الفرص", desc: "يقيم المشاريع والصفقات المطروحة لتحديد مدى ملاءمتها ومعدل ربحيتها.", benefit: "تصفية وتصنيف الصفقات الجديرة بالاهتمام.", impact: "تركيز موارد الشركة على الصفقات الأسهل حسمًا.", category: "data", position: { x: 50, y: 7 } },
        { id: 4, name: "٠٤ جلب البيانات الذكية", desc: "يبحث ويفلتر البيانات من بين ملايين السجلات والشركات بالمملكة.", benefit: "توفير قاعدة بيانات عملاء متكاملة ودقيقة.", impact: "اختصار شهور من التنقيب والبحث التقليدي.", category: "data", position: { x: 62, y: 7 } },
        { id: 5, name: "٠٥ تنظيف وتدقيق البيانات", desc: "يتحقق من دقة وصلاحية أرقام الهواتف والبريد الإلكتروني للجهات المستهدفة.", benefit: "تقليص الهدر والاتصالات بالجهات الخاطئة.", impact: "رفع دقة الوصول الفعلي للعملاء بنسبة 95٪.", category: "data", position: { x: 74, y: 7 } },

        // RIGHT COLUMN (06 to 13) - X: 90%
        { id: 6, name: "٠٦ تحديد صناع القرار", desc: "يحدد هوية ومناصب المدراء والتنفيذيين المسؤولين عن اتخاذ القرار مباشرة.", benefit: "تجاوز الموظفين والوصول للمسؤول فورًا.", impact: "تقليص فترة المبيعات وتسريع وقت التعاقد.", category: "access", position: { x: 90, y: 17 } },
        { id: 7, name: "٠٧ اختيار القناة الأنسب", desc: "يحدد قناة التواصل الفعالة لكل صانع قرار (واتساب، بريد إلكتروني، إلخ).", benefit: "تواصل شخصي ودافئ عبر القناة المفضلة للعميل.", impact: "مضاعفة معدلات الاستجابة والتجاوب الأولي.", category: "access", position: { x: 90, y: 25 } },
        { id: 8, name: "٠٨ تحديد احتمالية الرد", desc: "يحلل التجاوب التاريخي للمستهدفين لتوقع احتمالية رد العميل.", benefit: "ترتيب أولويات التواصل بذكاء وكفاءة.", impact: "توجيه الجهد البشري للعملاء الأكثر استعداداً للرد.", category: "access", position: { x: 90, y: 33 } },
        { id: 9, name: "٠٩ تخصيص الرسالة الأولى", desc: "يصيغ عروضًا ورسائل مخصصة تلائم طبيعة عمل واحتياج كل جهة.", benefit: "خلق انطباع احترافي وكسر الجليد مع العميل.", impact: "تحقيق نسب فتح واستجابة غير مسبوقة.", category: "access", position: { x: 90, y: 41 } },
        { id: 10, name: "١٠ بدء المحادثة الذكية", desc: "يطلق حملات الوصول الأولي وبدء المحادثات عبر قنوات الاتصال.", benefit: "تغطية واسعة لكافة مستهدفي السوق آلياً.", impact: "تدفق يومي للمهتمين دون الحاجة للتنقيب اليدوي.", category: "access", position: { x: 90, y: 49 } },
        { id: 11, name: "١١ المتابعة الذكية والجدولة", desc: "يتابع بانتظام واحترافية للحفاظ على حيوية المحادثات وحجز موعد.", benefit: "الحفاظ على اهتمام العميل ومنع نسيان أي فرصة.", impact: "تحويل الاهتمام الأولي إلى اجتماعات بيعية مؤكدة.", category: "access", position: { x: 90, y: 57 } },
        { id: 12, name: "١٢ تجهيز الاجتماع وتأهيله", desc: "يجمع ملفاً متكاملاً واحتياجات العميل الحقيقية قبل اللقاء البيعي.", benefit: "دخول الاجتماع بوعي كامل وقدرة إقناع عالية.", impact: "رفع احتمالية إغلاق الصفقة من أول لقاء.", category: "access", position: { x: 90, y: 65 } },
        { id: 13, name: "١٣ تحليل مسار الاجتماعات", desc: "يحلل ما تم بالاجتماع لتسجيل النقاط والاعتراضات والخطوات القادمة.", benefit: "فهم دقيق للعميل وتوثيق فوري لمتطلباته.", impact: "ضمان توجيه الخطوة القادمة لإرضاء العميل وحسم البيع.", category: "access", position: { x: 90, y: 73 } },

        // BOTTOM ROW (14 to 21) - Y: 93%
        { id: 14, name: "١٤ إدارة وتصنيف الفرص", desc: "يتابع حركة الصفقات داخل قمع المبيعات وتوجيهها للمرحلة الأنسب.", benefit: "رؤية شاملة وموثوقة لجميع صفقات الشركة النشطة.", impact: "الحفاظ على حيوية قمع المبيعات بشكل منتظم.", category: "closing", position: { x: 14, y: 93 } },
        { id: 15, name: "١٥ التنبؤ بفرص الإغلاق", desc: "يحلل سلوك العميل لتقييم مدى جاهزية الصفقة وتحديد موعد حسمها.", benefit: "تخطيط استراتيجي مالي دقيق لإيراداتكم.", impact: "توقع مستقبلي موثوق يخدم اتخاذ القرار.", category: "closing", position: { x: 25, y: 93 } },
        { id: 16, name: "١٦ تحسين وتعديل العروض", desc: "يقترح التعديلات المناسبة على العروض الفنية والمالية لجذب العميل.", benefit: "عروض أسعار مثالية تطابق رغبة وميزانية العميل.", impact: "التفوق على عروض المنافسين وحسم اختيار العميل.", category: "closing", position: { x: 36, y: 93 } },
        { id: 17, name: "١٧ دعم التفاوض وحسم السعر", desc: "يزود فريقكم بالردود المناسبة على الاعتراضات وتسهيل التفاوض.", benefit: "دعم الفريق البشري بنقاط قوة فنية وسعرية.", impact: "حماية هوامش الأرباح وإتمام الصفقات بقيمة ممتازة.", category: "closing", position: { x: 47, y: 93 } },
        { id: 18, name: "١٨ توقع وتحليل الإيرادات", desc: "يحلل البيانات التاريخية والنشطة للتنبؤ بالتدفقات المالية القادمة.", benefit: "قراءة مستقبلية دقيقة للملاءة المالية للشركة.", impact: "ثقة مطلقة في التخطيط لاستثمارات النمو والتوسع.", category: "closing", position: { x: 58, y: 93 } },
        { id: 19, name: "١٩ تحليل المكالمات الصوتية", desc: "يقيم التسجيلات الصوتية لتحسين نبرة البيع ومعالجة الاعتراضات.", benefit: "رصد فوري لأداء وجودة مبيعات الفريق البشري.", impact: "تطوير مستمر لمهارات التواصل والإقناع لدى فريقكم.", category: "closing", position: { x: 69, y: 93 } },
        { id: 20, name: "٢٠ تحليل محادثات واتساب", desc: "يقيس تفاعلية وسرعة الردود عبر الواتساب ويقترح الرد الأفضل.", benefit: "سرعة استجابة فائقة تحافظ على اهتمام العميل.", impact: "زيادة معدلات حسم رغبات العملاء السريعة.", category: "closing", position: { x: 80, y: 93 } },
        { id: 21, name: "٢١ تحليل التفاعل المهني", desc: "يراقب التفاعلات المهنية لصناع القرار عبر لينكدإن لبناء علاقات.", benefit: "فتح قنوات بيعية مبنية على الثقة والخبرة المهنية.", impact: "ترسيخ شركتكم كشريك استراتيجي في السوق السعودي.", category: "closing", position: { x: 89, y: 93 } },

        // LEFT COLUMN (22 to 25) - X: 10%
        { id: 22, name: "٢٢ مراقبة السوق والمنافسين", desc: "يرصد تحركات المنافسين، تغييرات أسعارهم، والخدمات الجديدة.", benefit: "رؤية مستمرة لحركة السوق والتطورات التنافسية.", impact: "الحفاظ على الصدارة وتعديل عروضكم استباقياً.", category: "market", position: { x: 10, y: 17 } },
        { id: 23, name: "٢٣ رصد فرص منافسات", desc: "يمسح ويفلتر المناقصات والمشاريع الحكومية والخاصة لحظة بلحظة.", benefit: "عدم تفويت أي مشروع أو مناقصة تناسب تخصصكم.", impact: "توسيع قنوات المبيعات والمشاريع الكبرى للشركة.", category: "market", position: { x: 10, y: 35 } },
        { id: 24, name: "٢٤ رصد واكتشاف الموردين", desc: "يبحث عن أفضل شركاء التنفيذ والموردين لدعم تسليم مشاريعكم.", benefit: "تقليص تكاليف التشغيل وزيادة هوامش الأرباح.", impact: "تقديم أسعار منافسة تعزز الفوز بالمزيد من الصفقات.", category: "market", position: { x: 10, y: 53 } },
        { id: 25, name: "٢٥ وكيل قيادة الإيرادات", desc: "الوكيل المحرك الرئيسي لتوجيه وتنسيق وتكامل عمل كافة الوكلاء.", benefit: "إدارة متناغمة لكامل المنظومة كعقل ذكي واحد.", impact: "أتمتة وتكامل شامل للنمو المستمر دون أي تعطل.", category: "market", position: { x: 10, y: 71 } },
    ];

    // Helper map to assign category classes
    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'data': return 'border-violet-500/20 hover:border-violet-500 text-violet-400 bg-violet-950/10 shadow-[0_0_10px_rgba(139,92,246,0.05)]';
            case 'access': return 'border-cyan-500/20 hover:border-cyan-500 text-cyan-400 bg-cyan-950/10 shadow-[0_0_10px_rgba(6,182,212,0.05)]';
            case 'closing': return 'border-blue-500/20 hover:border-blue-500 text-blue-400 bg-blue-950/10 shadow-[0_0_10px_rgba(59,130,246,0.05)]';
            case 'market': return 'border-emerald-500/20 hover:border-emerald-500 text-emerald-400 bg-emerald-950/10 shadow-[0_0_10px_rgba(16,185,129,0.05)]';
            default: return 'border-slate-800 text-slate-400 bg-slate-900/10';
        }
    };

    // Calculate nearest point on the dashboard boundary (X: [23, 77], Y: [16, 84])
    const getConnectPoints = (x: number, y: number) => {
        let destX = x;
        let destY = y;
        
        if (x < 23) destX = 23;
        else if (x > 77) destX = 77;
        
        if (y < 16) destY = 16;
        else if (y > 84) destY = 84;
        
        return { destX, destY };
    };

    return (
        <div className="py-28 bg-[#050505] relative overflow-hidden" id="ninja-command-center">
            {/* Background Neural Network Glow */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[30%] left-[20%] w-[500px] h-[500px] bg-emerald-500/[0.015] blur-[130px] rounded-full" />
                <div className="absolute bottom-[30%] right-[20%] w-[500px] h-[500px] bg-cyan-500/[0.015] blur-[130px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                
                {/* Header */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white mb-6 backdrop-blur-sm">
                            <Cpu className="w-4 h-4 text-cyan-400" />
                            <span className="font-semibold text-xs text-slate-300">٢٥ وكيل ذكي مترابطون معاً</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                            لوحة قيادة النينجا الذكية
                        </h2>
                        <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            فريق من ٢٥ وكيل ذكاء اصطناعي يعملون بتنسيق وتكامل تام 24/7 لتحليل السوق وتوليد الفرص وتحريك المبيعات ودعم الإغلاق.
                        </p>
                    </motion.div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* LEFT COLUMN: Features lists */}
                    <div className="lg:col-span-3 space-y-5 flex flex-col justify-start">
                        {features.map((feat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                className="bg-slate-950/40 border border-slate-900/60 p-4.5 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-colors"
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

                    {/* RIGHT COLUMN: The Orbit Neural Dashboard (Desktop & Mobile handles) */}
                    <div className="lg:col-span-9 flex items-center justify-center relative">
                        
                        {/* DESKTOP NEURAL ORBIT LAYOUT */}
                        <div className="relative w-full aspect-[900/680] hidden lg:block select-none">
                            
                            {/* SVG Network Connector Lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <filter id="glow-line" x="-10%" y="-10%" width="120%" height="120%">
                                        <feGaussianBlur stdDeviation="3" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>
                                
                                {agents.map((agent) => {
                                    const { destX, destY } = getConnectPoints(agent.position.x, agent.position.y);
                                    const isHovered = activeNode === agent.id;
                                    
                                    return (
                                        <g key={agent.id} className="transition-all duration-300">
                                            {/* Static Base Line */}
                                            <line 
                                                x1={`${agent.position.x}%`} 
                                                y1={`${agent.position.y}%`} 
                                                x2={`${destX}%`} 
                                                y2={`${destY}%`} 
                                                stroke={isHovered ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.025)"}
                                                strokeWidth={isHovered ? 1.8 : 0.8}
                                                className="transition-all duration-300"
                                            />
                                            {/* Glowing Active Animated Line */}
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
                                                </>
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>

                            {/* CENTRAL METRICS DASHBOARD PANEL */}
                            <div className="absolute left-[23%] top-[16%] w-[54%] h-[68%] bg-slate-950/70 border border-slate-900/80 rounded-3xl p-5 z-20 flex flex-col justify-between backdrop-blur-sm shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                                
                                {/* Dashboard Top Header */}
                                <div className="flex items-center justify-between border-b border-slate-900/80 pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                        <span className="text-[10px] font-bold text-slate-300">نظرة عامة ومتابعة حية</span>
                                    </div>
                                    <span className="text-[9px] text-slate-500 font-sans font-medium">اليوم: ٢٩ مايو ٢٠٢٦</span>
                                </div>

                                {/* Six Metrics Cards Grid */}
                                <div className="grid grid-cols-3 gap-2.5 my-3">
                                    {/* 1. الفرص الساخنة */}
                                    <div className="bg-slate-950/80 border border-slate-900/60 p-2 rounded-xl text-right">
                                        <span className="block text-[8px] text-slate-500 font-bold">الفرص الساخنة</span>
                                        <span className="block text-sm font-black text-white my-0.5">١٢</span>
                                        <span className="block text-[7px] text-amber-500 font-bold">🔥 +٣ اليوم</span>
                                    </div>
                                    {/* 2. صناع القرار */}
                                    <div className="bg-slate-950/80 border border-slate-900/60 p-2 rounded-xl text-right">
                                        <span className="block text-[8px] text-slate-500 font-bold">صناع القرار</span>
                                        <span className="block text-sm font-black text-white my-0.5">١٢٨</span>
                                        <span className="block text-[7px] text-cyan-400 font-bold">👤 +٢٤ اليوم</span>
                                    </div>
                                    {/* 3. محادثات نشطة */}
                                    <div className="bg-slate-950/80 border border-slate-900/60 p-2 rounded-xl text-right">
                                        <span className="block text-[8px] text-slate-500 font-bold">محادثات نشطة</span>
                                        <span className="block text-sm font-black text-white my-0.5">٣٤٧</span>
                                        <span className="block text-[7px] text-emerald-400 font-bold">💬 +٥٧ اليوم</span>
                                    </div>
                                    {/* 4. اجتماعات قادمة */}
                                    <div className="bg-slate-950/80 border border-slate-900/60 p-2 rounded-xl text-right">
                                        <span className="block text-[8px] text-slate-500 font-bold">اجتماعات قادمة</span>
                                        <span className="block text-sm font-black text-white my-0.5">١٨</span>
                                        <span className="block text-[7px] text-violet-400 font-bold">📅 +٥ اليوم</span>
                                    </div>
                                    {/* 5. تحت التفاوض */}
                                    <div className="bg-slate-950/80 border border-slate-900/60 p-2 rounded-xl text-right">
                                        <span className="block text-[8px] text-slate-500 font-bold">تحت التفاوض</span>
                                        <span className="block text-sm font-black text-white my-0.5">٧</span>
                                        <span className="block text-[7px] text-blue-400 font-bold">🤝 +٢ اليوم</span>
                                    </div>
                                    {/* 6. إيراد متوقع */}
                                    <div className="bg-slate-950/80 border border-slate-900/60 p-2 rounded-xl text-right">
                                        <span className="block text-[8px] text-slate-500 font-bold">إيراد متوقع</span>
                                        <span className="block text-xs font-black text-emerald-400 my-1">1.2M SAR</span>
                                        <span className="block text-[7px] text-emerald-500 font-bold">📈 +180K أسبوعياً</span>
                                    </div>
                                </div>

                                {/* Bottom charts grid: Line graph, Table, Donut & Channel */}
                                <div className="grid grid-cols-2 gap-3.5 items-stretch flex-1">
                                    {/* Left chart panel: SVG Line chart & channels */}
                                    <div className="bg-slate-950/80 border border-slate-900/60 p-2.5 rounded-xl flex flex-col justify-between">
                                        {/* Dynamic smooth Line Graph */}
                                        <div className="relative w-full h-16 bg-slate-950/20 rounded overflow-hidden">
                                            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                                                <defs>
                                                    <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                                <path d="M 0 35 Q 25 32 50 18 T 100 5 L 100 40 L 0 40 Z" fill="url(#glow-gradient)" />
                                                <motion.path 
                                                    d="M 0 35 Q 25 32 50 18 T 100 5" 
                                                    fill="none" 
                                                    stroke="#10b981" 
                                                    strokeWidth="1.2"
                                                    initial={{ pathLength: 0 }}
                                                    whileInView={{ pathLength: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                />
                                                <circle cx="100" cy="5" r="1" fill="#10b981" />
                                                <circle cx="100" cy="5" r="3" fill="#10b981" className="animate-ping opacity-45" />
                                            </svg>
                                            <span className="absolute top-0.5 right-1.5 text-[7px] text-slate-500 font-sans">توقعات الإيراد الربع سنوي</span>
                                        </div>
                                        {/* Top Channels */}
                                        <div className="space-y-1.5 mt-2">
                                            <span className="block text-[8px] text-slate-500 font-bold text-right mb-1">أعلى قنوات التواصل أداءً</span>
                                            {/* WhatsApp */}
                                            <div className="flex items-center gap-2 justify-between text-[8px]">
                                                <span className="text-slate-500 w-8 text-left font-sans">62%</span>
                                                <div className="flex-1 bg-slate-900 h-1 rounded-full overflow-hidden">
                                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '62%' }} />
                                                </div>
                                                <span className="text-emerald-400 font-bold w-12 text-right">واتساب</span>
                                            </div>
                                            {/* LinkedIn */}
                                            <div className="flex items-center gap-2 justify-between text-[8px]">
                                                <span className="text-slate-500 w-8 text-left font-sans">48%</span>
                                                <div className="flex-1 bg-slate-900 h-1 rounded-full overflow-hidden">
                                                    <div className="bg-blue-400 h-full rounded-full" style={{ width: '48%' }} />
                                                </div>
                                                <span className="text-blue-400 font-bold w-12 text-right">لينكدإن</span>
                                            </div>
                                            {/* Email */}
                                            <div className="flex items-center gap-2 justify-between text-[8px]">
                                                <span className="text-slate-500 w-8 text-left font-sans">35%</span>
                                                <div className="flex-1 bg-slate-900 h-1 rounded-full overflow-hidden">
                                                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: '35%' }} />
                                                </div>
                                                <span className="text-cyan-400 font-bold w-12 text-right">البريد</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right panel: Opportunities table and donut chart */}
                                    <div className="bg-slate-950/80 border border-slate-900/60 p-2.5 rounded-xl flex flex-col justify-between text-right">
                                        {/* Table mock */}
                                        <div className="space-y-1">
                                            <span className="block text-[8px] text-slate-500 font-bold mb-1">أعلى الفرص تقدماً</span>
                                            <div className="space-y-1 text-[7px] text-slate-300">
                                                <div className="flex justify-between border-b border-slate-900/60 pb-1 text-slate-500 font-bold">
                                                    <span>العميل</span>
                                                    <span>المرحلة</span>
                                                    <span>القيمة</span>
                                                </div>
                                                <div className="flex justify-between py-0.5">
                                                    <span className="text-slate-200">شركة تقنية</span>
                                                    <span className="text-blue-400">تفاوض</span>
                                                    <span className="text-emerald-400 font-sans">240K SAR</span>
                                                </div>
                                                <div className="flex justify-between py-0.5">
                                                    <span className="text-slate-200">مجموعة إنشاءات</span>
                                                    <span className="text-violet-400">اجتماع</span>
                                                    <span className="text-emerald-400 font-sans">180K SAR</span>
                                                </div>
                                                <div className="flex justify-between py-0.5">
                                                    <span className="text-slate-200">خدمات لوجستية</span>
                                                    <span className="text-cyan-400">عرض فني</span>
                                                    <span className="text-emerald-400 font-sans">150K SAR</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Donut chart */}
                                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-900/60">
                                            <div className="relative w-8 h-8 shrink-0">
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a78bfa" strokeWidth="4.5" strokeDasharray="38 100" strokeDashoffset="0" />
                                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22d3ee" strokeWidth="4.5" strokeDasharray="28 100" strokeDashoffset="-38" />
                                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="18 100" strokeDashoffset="-66" />
                                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.5" strokeDasharray="16 100" strokeDashoffset="-84" />
                                                </svg>
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-2 text-[7px] text-slate-400 leading-none">
                                                <div className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-violet-400" /> ٣٨٪ استكشاف</div>
                                                <div className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-cyan-400" /> ٢٨٪ تأهيل</div>
                                                <div className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-blue-500" /> ١٨٪ عروض</div>
                                                <div className="flex items-center gap-0.5"><span className="w-1 h-1 rounded-full bg-emerald-500" /> ١٦٪ حسم</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SATELITE OUTER AGENTS ROUNDED NETWORK ORBIT */}
                            {agents.map((agent) => {
                                const isHovered = activeNode === agent.id;
                                
                                return (
                                    <motion.div
                                        key={agent.id}
                                        className={cn(
                                            "absolute rounded-full border cursor-pointer flex items-center justify-center transition-all duration-300 z-30",
                                            agent.id === 25 ? "w-10 h-10" : "w-7.5 h-7.5", // Primary agent is slightly larger
                                            getCategoryStyles(agent.category)
                                        )}
                                        style={{ 
                                            left: `${agent.position.x}%`, 
                                            top: `${agent.position.y}%`,
                                            x: "-50%",
                                            y: "-50%",
                                            width: agent.id === 25 ? '38px' : '26px',
                                            height: agent.id === 25 ? '38px' : '26px',
                                        }}
                                        onMouseEnter={() => setActiveNode(agent.id)}
                                        onMouseLeave={() => setActiveNode(null)}
                                        animate={{ 
                                            y: isHovered 
                                                ? "-58%" 
                                                : [
                                                    "-50%", 
                                                    `-${50 + (Math.sin(agent.id) * 3)}%`, 
                                                    "-50%"
                                                ] 
                                        }}
                                        transition={{ 
                                            y: isHovered 
                                                ? { duration: 0.15 } 
                                                : { 
                                                    duration: 4 + (agent.id % 3), 
                                                    repeat: Infinity, 
                                                    ease: "easeInOut", 
                                                    delay: agent.id * 0.1 
                                                } 
                                        }}
                                    >
                                        {/* Icon or dot inside agent */}
                                        {agent.id === 25 ? (
                                            <Bot className={cn("w-4 h-4", isHovered ? "text-emerald-300" : "text-emerald-400")} />
                                        ) : (
                                            <span className="text-[7px] font-sans font-bold leading-none">{agent.id}</span>
                                        )}

                                        {/* Tiny label on hover/glowing */}
                                        <AnimatePresence>
                                            {isHovered && (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[8px] text-white z-40 shadow-md font-sans"
                                                >
                                                    {agent.name}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}

                            {/* DETAIL HOVER DIALOG OVERLAY (Directly over the Dashboard center on hover) */}
                            <AnimatePresence>
                                {activeNode !== null && (
                                    (() => {
                                        const agent = agents.find(a => a.id === activeNode);
                                        if (!agent) return null;
                                        
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-[26%] left-[28%] w-[44%] p-4 rounded-2xl bg-slate-950/98 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur-xl z-40 text-right cursor-default"
                                                onMouseEnter={() => setActiveNode(agent.id)}
                                                onMouseLeave={() => setActiveNode(null)}
                                            >
                                                <div className="flex items-center gap-2 mb-2 text-emerald-400 border-b border-slate-900 pb-1.5">
                                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                                    <h4 className="text-[11px] font-extrabold text-white">{agent.name}</h4>
                                                </div>
                                                <div className="space-y-2.5 text-[9px] leading-relaxed">
                                                    <div>
                                                        <span className="block text-slate-500 text-[8px] font-bold">مهام عمل الوكيل:</span>
                                                        <p className="text-slate-300 font-medium">{agent.desc}</p>
                                                    </div>
                                                    <div>
                                                        <span className="block text-slate-500 text-[8px] font-bold">الفائدة المحققة:</span>
                                                        <p className="text-slate-300 font-medium">✓ {agent.benefit}</p>
                                                    </div>
                                                    <div className="bg-emerald-500/5 p-1.5 rounded-lg border border-emerald-500/10">
                                                        <span className="block text-emerald-400 text-[8px] font-bold text-right">الأثر البيعي والإيرادات:</span>
                                                        <p className="text-slate-300 font-semibold text-right">📈 {agent.impact}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })()
                                )}
                            </AnimatePresence>
                        </div>

                        {/* MOBILE ONLY LAYOUT (STACKED LIST AND CATEGORIES OF THE 25 AGENTS) */}
                        <div className="lg:hidden w-full space-y-6 z-10 px-2 select-none">
                            
                            {/* Central Mini Dashboard */}
                            <div className="bg-slate-950/70 border border-slate-900/80 rounded-3xl p-5 shadow-lg text-right">
                                <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                        <span className="text-[10px] font-bold text-slate-300">لوحة التحكم والمقاييس اليومية</span>
                                    </div>
                                    <span className="text-[9px] text-slate-500 font-sans">٢٩ مايو ٢٠٢٦</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-950/80 border border-slate-900/60 p-3 rounded-xl">
                                        <span className="block text-[9px] text-slate-500 font-bold">الفرص الساخنة</span>
                                        <span className="block text-lg font-black text-white my-1">١٢</span>
                                        <span className="block text-[8px] text-amber-500 font-bold">🔥 +٣ اليوم</span>
                                    </div>
                                    <div className="bg-slate-950/80 border border-slate-900/60 p-3 rounded-xl">
                                        <span className="block text-[9px] text-slate-500 font-bold">صناع القرار</span>
                                        <span className="block text-lg font-black text-white my-1">١٢٨</span>
                                        <span className="block text-[8px] text-cyan-400 font-bold">👤 +٢٤ اليوم</span>
                                    </div>
                                    <div className="bg-slate-950/80 border border-slate-900/60 p-3 rounded-xl">
                                        <span className="block text-[9px] text-slate-500 font-bold">محادثات نشطة</span>
                                        <span className="block text-lg font-black text-white my-1">٣٤٧</span>
                                        <span className="block text-[8px] text-emerald-400 font-bold">💬 +٥٧ اليوم</span>
                                    </div>
                                    <div className="bg-slate-950/80 border border-slate-900/60 p-3 rounded-xl">
                                        <span className="block text-[9px] text-slate-500 font-bold">اجتماعات قادمة</span>
                                        <span className="block text-lg font-black text-white my-1">١٨</span>
                                        <span className="block text-[8px] text-violet-400 font-bold">📅 +٥ اليوم</span>
                                    </div>
                                    <div className="bg-slate-950/80 border border-slate-900/60 p-3 rounded-xl">
                                        <span className="block text-[9px] text-slate-500 font-bold">تحت التفاوض</span>
                                        <span className="block text-lg font-black text-white my-1">٧</span>
                                        <span className="block text-[8px] text-blue-400 font-bold">🤝 +٢ اليوم</span>
                                    </div>
                                    <div className="bg-slate-950/80 border border-slate-900/60 p-3 rounded-xl">
                                        <span className="block text-[9px] text-slate-500 font-bold">إيراد متوقع</span>
                                        <span className="block text-sm font-black text-emerald-400 my-1">1.2M SAR</span>
                                        <span className="block text-[8px] text-emerald-500 font-bold">📈 +180K أسبوعياً</span>
                                    </div>
                                </div>
                            </div>

                            {/* 25 AI Agents grouped list on mobile */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-400 text-center tracking-wider mb-2">توزيع عمل الوكلاء الـ ٢٥</h4>
                                
                                {/* Group 1 */}
                                <div className="bg-slate-950/30 border border-slate-900 p-4 rounded-xl">
                                    <span className="text-[10px] font-bold text-violet-400 block mb-3">١. مرحلة تحليل السوق وجمع البيانات</span>
                                    <div className="space-y-3">
                                        {agents.filter(a => a.category === 'data').map((a) => (
                                            <div key={a.id} className="border-r-2 border-violet-500/20 pr-3">
                                                <h5 className="text-xs font-bold text-slate-200">{a.name}</h5>
                                                <p className="text-[10px] text-slate-400 mt-1 leading-normal">{a.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Group 2 */}
                                <div className="bg-slate-950/30 border border-slate-900 p-4 rounded-xl">
                                    <span className="text-[10px] font-bold text-cyan-400 block mb-3">٢. مرحلة رصد صناع القرار وبدء التواصل</span>
                                    <div className="space-y-3">
                                        {agents.filter(a => a.category === 'access').map((a) => (
                                            <div key={a.id} className="border-r-2 border-cyan-500/20 pr-3">
                                                <h5 className="text-xs font-bold text-slate-200">{a.name}</h5>
                                                <p className="text-[10px] text-slate-400 mt-1 leading-normal">{a.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Group 3 */}
                                <div className="bg-slate-950/30 border border-slate-900 p-4 rounded-xl">
                                    <span className="text-[10px] font-bold text-blue-400 block mb-3">٣. مرحلة إدارة الفرص ودعم الإغلاق والتفاوض</span>
                                    <div className="space-y-3">
                                        {agents.filter(a => a.category === 'closing').map((a) => (
                                            <div key={a.id} className="border-r-2 border-blue-500/20 pr-3">
                                                <h5 className="text-xs font-bold text-slate-200">{a.name}</h5>
                                                <p className="text-[10px] text-slate-400 mt-1 leading-normal">{a.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Group 4 */}
                                <div className="bg-slate-950/30 border border-slate-900 p-4 rounded-xl">
                                    <span className="text-[10px] font-bold text-emerald-400 block mb-3">٤. مرحلة المراقبة الاستباقية للمستجدات والقيادة</span>
                                    <div className="space-y-3">
                                        {agents.filter(a => a.category === 'market').map((a) => (
                                            <div key={a.id} className="border-r-2 border-emerald-500/20 pr-3">
                                                <h5 className="text-xs font-bold text-slate-200">{a.name}</h5>
                                                <p className="text-[10px] text-slate-400 mt-1 leading-normal">{a.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Dashboard Footer Banner */}
                <div className="mt-20 max-w-4xl mx-auto text-center">
                    <div className="p-6 md:p-8 rounded-3xl bg-slate-950/30 border border-slate-900/80 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.01] via-transparent to-violet-500/[0.01]" />
                        <h4 className="text-xs font-bold text-slate-500 mb-2">تكامل الأداء الذكي والمبيعات</h4>
                        <h3 className="text-base md:text-xl font-bold text-slate-200 leading-relaxed max-w-2xl mx-auto">
                            كل وكيل يعمل بتخصص متكامل… ليوفر لشركتكم نمواً مستداماً، وفرصاً أكثر جودة، ووصولاً أسرع، لتحقيق إيرادات حقيقية ومستمرة.
                        </h3>
                    </div>
                </div>

            </div>
        </div>
    );
};
