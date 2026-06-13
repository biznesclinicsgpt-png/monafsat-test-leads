import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { GlowOrb } from './GlowOrb';
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
    ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/utils';

type TriangleInfoItem = {
    id: string;
    kind: 'node' | 'edge';
    title: string;
    label: string;
    description: string;
    short: string;
    bullets: string[];
    color: 'emerald' | 'cyan' | 'violet' | 'blue';
    icon: React.ReactNode;
    connected?: string[];
};

const colorClasses = {
    emerald: {
        text: 'text-emerald-300',
        border: 'border-emerald-500/45',
        bg: 'bg-emerald-500/10',
        shadow: 'shadow-[0_0_36px_rgba(16,185,129,0.22)]',
        stroke: '#34d399',
    },
    cyan: {
        text: 'text-cyan-300',
        border: 'border-cyan-500/45',
        bg: 'bg-cyan-500/10',
        shadow: 'shadow-[0_0_36px_rgba(6,182,212,0.20)]',
        stroke: '#22d3ee',
    },
    violet: {
        text: 'text-teal-300',
        border: 'border-teal-500/45',
        bg: 'bg-teal-500/10',
        shadow: 'shadow-[0_0_36px_rgba(20,184,166,0.22)]',
        stroke: '#2dd4bf',
    },
    blue: {
        text: 'text-blue-300',
        border: 'border-blue-500/45',
        bg: 'bg-blue-500/10',
        shadow: 'shadow-[0_0_36px_rgba(59,130,246,0.20)]',
        stroke: '#60a5fa',
    },
};

const ClientSalesInteractiveTriangle = () => {
    const nodes: TriangleInfoItem[] = [
        {
            id: 'sales',
            kind: 'node',
            title: 'فريق مبيعات العميل',
            label: 'الدائرة = دور الطرف',
            description: 'يتعامل مع المحادثات النشطة ويحوّلها إلى اجتماعات، عروض، تفاوض، وصفقات.',
            short: 'قلب المنظومة الذي يستقبل فرصًا أجهز ويركز على التحويل بدل البحث والمطاردة.',
            bullets: [
                'يستلم محادثات وفرص أكثر جاهزية',
                'يرد بناءً على سياق واضح وتوصية مناسبة',
                'يركز على التحويل بدل البحث والمطاردة',
            ],
            color: 'emerald',
            icon: <Briefcase className="h-7 w-7" />,
        },
        {
            id: 'ninja',
            kind: 'node',
            title: 'نظام النينجا الذكي',
            label: 'الدائرة = دور الطرف',
            description: 'محرك الذكاء والأتمتة الذي ينجز الجزء البارد والتشغيلي من رحلة الوصول.',
            short: 'ينجز التحليل والبيانات والرسائل والمتابعة الأولية قبل وصول الفرصة لفريقك.',
            bullets: [
                'يحلل السوق والقطاعات',
                'يستخرج الحسابات وصناع القرار',
                'يجهز البيانات والرسائل والقنوات',
                'يرصد الردود ويصنف المحادثات النشطة',
            ],
            color: 'blue',
            icon: <BrainCircuit className="h-6 w-6" />,
        },
        {
            id: 'monafsat',
            kind: 'node',
            title: 'فريق منافسات',
            label: 'الدائرة = دور الطرف',
            description: 'كادر موازٍ يفتح فرصًا مباشرة من السوق السعودي بمدخل مختلف.',
            short: 'يفتح مصدرًا موازيًا للفرص حتى لا يعتمد فريقك على قناة واحدة فقط.',
            bullets: [
                'يرصد فرصًا واحتياجات من السوق',
                'يفتح مدخلًا موازيًا غير معتمد فقط على الحملات',
                'يضيف تدفق فرص مباشر لفريق العميل',
            ],
            color: 'cyan',
            icon: <Target className="h-6 w-6" />,
        },
        {
            id: 'advisory',
            kind: 'node',
            title: 'الفريق الاستشاري والقيادي',
            label: 'الدائرة = دور الطرف',
            description: 'يقود الخطة، يطوّر الأداء، ويضمن أن القمع يتحسن أسبوعيًا.',
            short: 'يربط الهدف بالتنفيذ ويرفع قدرة الفريق على الرد والتأهيل والإغلاق.',
            bullets: [
                'يحدد المستهدف والقطاعات وصناع القرار',
                'يدرب الفريق على الردود والاعتراضات',
                'يراجع النتائج ويقود التحسين الأسبوعي',
            ],
            color: 'violet',
            icon: <Users className="h-6 w-6" />,
        },
    ];

    const edges: TriangleInfoItem[] = [
        {
            id: 'sales-ninja',
            kind: 'edge',
            title: 'جهد أقل + فرص أجهز',
            label: 'الضلع = ناتج التعاون',
            description: 'النظام ينجز البحث، البيانات، الرسائل، والوصول الأولي، وفريق المبيعات يستلم محادثات نشطة أكثر جاهزية للتحويل.',
            short: 'النظام ينجز الشغل البارد… وفريقك يركز على المحادثات النشطة الأقرب للاجتماع.',
            bullets: ['تقليل عبء البحث البارد', 'رفع جودة المحادثات', 'تسريع الحجز والتأهيل', 'وضوح الخطوة التالية لكل فرصة'],
            color: 'emerald',
            icon: <Zap className="h-5 w-5" />,
            connected: ['sales', 'ninja'],
        },
        {
            id: 'sales-monafsat',
            kind: 'edge',
            title: 'فرص مباشرة تدعم خط المبيعات',
            label: 'الضلع = ناتج التعاون',
            description: 'فريق منافسات يفتح مدخلًا موازيًا للفرص من السوق، وفريق العميل يستقبل فرصًا يمكن تحويلها إلى اجتماعات وعروض.',
            short: 'فريقك لا ينتظر فقط نتائج الحملات… بل يستقبل فرصًا مباشرة يفتحها منافسات.',
            bullets: ['مصدر فرص إضافي', 'تنويع قنوات الوصول', 'فرص أقرب لاحتياج السوق', 'خط مبيعات أقوى لفريق المبيعات'],
            color: 'cyan',
            icon: <TrendingUp className="h-5 w-5" />,
            connected: ['sales', 'monafsat'],
        },
        {
            id: 'sales-advisory',
            kind: 'edge',
            title: 'فريق أقوى وتحويل أعلى',
            label: 'الضلع = ناتج التعاون',
            description: 'الفريق الاستشاري يرفع جودة ردود فريق المبيعات، تأهيله، تعامله مع الاعتراضات، وطريقة تحويل المحادثة إلى اجتماع أو عرض.',
            short: 'تدريب ومتابعة وتحليل يرفع قدرة فريقك على تحويل الفرص إلى نتائج.',
            bullets: ['ردود أكثر احترافية', 'اجتماعات مؤهلة أكثر', 'معالجة اعتراضات أفضل', 'تحسن مستمر في الأداء'],
            color: 'violet',
            icon: <Activity className="h-5 w-5" />,
            connected: ['sales', 'advisory'],
        },
        {
            id: 'ninja-monafsat',
            kind: 'edge',
            title: 'تغذية مزدوجة للفرص',
            label: 'الضلع = ناتج التعاون',
            description: 'النينجا يشغل الوصول الذكي، ومنافسات يفتح فرصًا مباشرة من السوق، فيتكون تدفق فرص أقوى وأكثر تنوعًا.',
            short: 'وصول ذكي + فرص مباشرة من السوق = تدفق فرص أسرع وأقوى.',
            bullets: ['مصادر فرص أكثر', 'سرعة أعلى في الوصول', 'قمع مبيعات أغنى', 'فرص أكثر جاهزية للتأهيل'],
            color: 'blue',
            icon: <Sparkles className="h-5 w-5" />,
            connected: ['ninja', 'monafsat'],
        },
        {
            id: 'ninja-advisory',
            kind: 'edge',
            title: 'استراتيجية أوضح + تنفيذ أذكى',
            label: 'الضلع = ناتج التعاون',
            description: 'الفريق الاستشاري يحدد أين نتحرك وكيف نقيس، والنينجا يحول ذلك إلى بيانات ورسائل وقنوات وتشغيل فعلي.',
            short: 'من الخطة إلى التنفيذ الذكي: استهداف أدق، رسائل أفضل، وتشغيل أسرع.',
            bullets: ['استهداف أدق', 'رسائل أكثر ملاءمة', 'قرارات أسرع', 'تحسين مبني على البيانات'],
            color: 'violet',
            icon: <BrainCircuit className="h-5 w-5" />,
            connected: ['ninja', 'advisory'],
        },
        {
            id: 'monafsat-advisory',
            kind: 'edge',
            title: 'فهم السوق + فرص أكثر ملاءمة',
            label: 'الضلع = ناتج التعاون',
            description: 'الفريق الاستشاري يحدد الأولويات، وفريق منافسات يرصد ويحرك الفرص وفق هذه الأولويات داخل السوق السعودي.',
            short: 'الاستراتيجية توجه السوق، ومنافسات تغذيها بفرص أقرب للواقع.',
            bullets: ['قطاعات أكثر دقة', 'فرص أقرب للاحتياج الحقيقي', 'تقليل الهدر في الفرص الضعيفة', 'توجيه أفضل لموارد العميل'],
            color: 'cyan',
            icon: <Target className="h-5 w-5" />,
            connected: ['monafsat', 'advisory'],
        },
    ];

    const allItems = [...nodes, ...edges];
    const [activeId, setActiveId] = useState('sales');
    const [mobileMode, setMobileMode] = useState<'nodes' | 'edges'>('nodes');
    const svgRef = useRef<SVGSVGElement>(null);
    const svgInView = useInView(svgRef, { once: true, amount: 0.3 });
    const active = allItems.find((item) => item.id === activeId) ?? nodes[0];

    const isNodeActive = (id: string) => active.id === id || active.connected?.includes(id);
    const isEdgeActive = (id: string) => active.id === id;

    const nodePositions = {
        sales: { top: '56%', left: '50%' },
        advisory: { top: '12%', left: '50%' },
        monafsat: { top: '78%', left: '18%' },
        ninja: { top: '78%', left: '82%' },
    };

    const edgePaths = [
        { id: 'sales-ninja', d: 'M 50 56 L 82 78' },
        { id: 'sales-monafsat', d: 'M 50 56 L 18 78' },
        { id: 'sales-advisory', d: 'M 50 56 L 50 12' },
        { id: 'ninja-monafsat', d: 'M 82 78 L 18 78' },
        { id: 'ninja-advisory', d: 'M 82 78 L 50 12' },
        { id: 'monafsat-advisory', d: 'M 18 78 L 50 12' },
    ];

    return (
        <section className="relative overflow-hidden bg-[#050505] py-16 md:py-20" id="ninja-growth-triangle">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[14%] right-[12%] h-[420px] w-[420px] rounded-full bg-emerald-500/[0.045] blur-[120px]" />
                <div className="absolute bottom-[12%] left-[10%] h-[460px] w-[460px] rounded-full bg-cyan-500/[0.04] blur-[130px]" />
                <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/[0.025] blur-[150px]" />
            </div>

            <div className="container relative z-10 mx-auto max-w-7xl px-4">
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="mx-auto mb-10 max-w-4xl text-center md:mb-12"
                >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300">
                        <Users className="h-4 w-4" />
                        فريقك في المركز
                    </div>
                    <h2 className="text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
                        3 محركات تغذي فريق مبيعاتك
                    </h2>
                    <p className="mx-auto mt-5 max-w-3xl text-base font-medium leading-relaxed text-slate-400 md:text-lg">
                        لا نطلب من فريقك أن يبدأ من القوائم الباردة. ننجز عنه التحليل، البيانات، الرسائل، الوصول، والمتابعة الأولية… ثم نغذيه بمحادثات نشطة وفرص أقرب للاجتماع والعرض والإغلاق.
                    </p>
                </motion.div>

                <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative mx-auto w-full max-w-4xl"
                    >
                        <div className="relative mx-auto aspect-[1.28/1] min-h-[420px] rounded-[28px] border border-slate-900/80 bg-slate-950/25 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.35)] md:min-h-[560px]">
                            <svg ref={svgRef} className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                                <defs>
                                    <linearGradient id="client-triangle-main" x1="10%" y1="10%" x2="90%" y2="90%">
                                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.72" />
                                        <stop offset="48%" stopColor="#22d3ee" stopOpacity="0.62" />
                                        <stop offset="100%" stopColor="#34d399" stopOpacity="0.70" />
                                    </linearGradient>
                                    <filter id="client-triangle-glow" x="-30%" y="-30%" width="160%" height="160%">
                                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>

                                {edgePaths.map((edge) => {
                                    const item = edges.find((entry) => entry.id === edge.id);
                                    const activeEdge = isEdgeActive(edge.id);
                                    const relatedNode = active.kind === 'node' && item?.connected?.includes(active.id);
                                    return (
                                        <g key={edge.id}>
                                            <path
                                                d={edge.d}
                                                stroke="rgba(148,163,184,0.12)"
                                                strokeWidth="1.1"
                                                fill="none"
                                            />
                                            <motion.path
                                                d={edge.d}
                                                stroke={activeEdge ? colorClasses[item?.color ?? 'emerald'].stroke : 'url(#client-triangle-main)'}
                                                strokeWidth={activeEdge ? 2.5 : relatedNode ? 1.8 : 1.15}
                                                fill="none"
                                                strokeLinecap="round"
                                                style={{
                                                    filter: activeEdge ? 'url(#client-triangle-glow)' : 'none',
                                                    opacity: activeEdge ? 1 : relatedNode ? 0.72 : 0.35,
                                                }}
                                                initial={{ pathLength: 0 }}
                                                animate={svgInView
                                                    ? activeEdge
                                                        ? { pathLength: 1, strokeDashoffset: -42 }
                                                        : { pathLength: 1, strokeDashoffset: 0 }
                                                    : { pathLength: 0 }
                                                }
                                                transition={svgInView && activeEdge
                                                    ? { pathLength: { duration: 0.9, ease: 'easeOut' }, strokeDashoffset: { repeat: Infinity, duration: 3.2, ease: 'linear' } }
                                                    : { pathLength: { duration: 1.0, delay: 0.15, ease: 'easeOut' } }
                                                }
                                                strokeDasharray={activeEdge ? '6 7' : 'none'}
                                            />
                                            <path
                                                d={edge.d}
                                                stroke="transparent"
                                                strokeWidth="8"
                                                fill="none"
                                                className="cursor-pointer"
                                                onMouseEnter={() => setActiveId(edge.id)}
                                                onClick={() => setActiveId(edge.id)}
                                            />
                                        </g>
                                    );
                                })}
                            </svg>

                            <div className="absolute left-1/2 top-[52%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/15 bg-emerald-500/[0.025] blur-[2px] md:h-72 md:w-72" />
                            <div className="absolute left-1/2 top-[52%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.035] md:h-44 md:w-44" />

                            {nodes.map((node) => {
                                const position = nodePositions[node.id as keyof typeof nodePositions];
                                const activeNode = isNodeActive(node.id);
                                const palette = colorClasses[node.color];
                                const isCenter = node.id === 'sales';
                                return (
                                    <motion.button
                                        key={node.id}
                                        type="button"
                                        className={cn(
                                            'absolute z-20 text-center outline-none',
                                            isCenter ? 'h-24 w-24 md:h-32 md:w-32' : 'h-16 w-16 md:h-20 md:w-20'
                                        )}
                                        style={position}
                                        transformTemplate={(_, generated) => `translate(-50%, -50%) ${generated}`}
                                        initial={{ opacity: 0, scale: 0.7 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.45, delay: isCenter ? 0.1 : 0.35, ease: [0.16,1,0.3,1] }}
                                        onMouseEnter={() => setActiveId(node.id)}
                                        onFocus={() => setActiveId(node.id)}
                                        onClick={() => setActiveId(node.id)}
                                    >
                                        <motion.div
                                            animate={isCenter ? {
                                                scale: activeNode ? 1.06 : [1, 1.025, 1],
                                            } : {
                                                scale: activeNode ? 1.05 : 1,
                                            }}
                                            transition={isCenter ? {
                                                scale: activeNode ? { duration: 0.25 } : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                                            } : {
                                                scale: { duration: 0.2 },
                                            }}
                                            className={cn(
                                                'flex h-full w-full items-center justify-center rounded-full border bg-slate-950/95 text-white transition-all duration-300',
                                                isCenter ? 'h-24 w-24 md:h-32 md:w-32' : 'h-16 w-16 md:h-20 md:w-20',
                                                activeNode ? `${palette.border} ${palette.bg} ${palette.shadow}` : 'border-slate-800/80 shadow-[0_0_18px_rgba(15,23,42,0.6)]'
                                            )}
                                        >
                                            <div className={cn('transition-colors', activeNode ? palette.text : 'text-slate-400')}>
                                                {node.icon}
                                            </div>
                                        </motion.div>
                                        <span
                                            className={cn(
                                                'pointer-events-none absolute left-1/2 block -translate-x-1/2 whitespace-nowrap text-[11px] font-extrabold md:text-sm',
                                                'top-full mt-3',
                                                activeNode ? palette.text : 'text-slate-300'
                                            )}
                                        >
                                            {node.title}
                                        </span>
                                        {isCenter && (
                                            <span className="pointer-events-none absolute left-1/2 top-[calc(100%+2.25rem)] block -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-slate-500 md:text-xs">
                                                محادثات ← اجتماعات ← عروض ← صفقات
                                            </span>
                                        )}
                                    </motion.button>
                                );
                            })}

                            <div className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-slate-800 bg-slate-950/85 px-4 py-2 text-xs font-bold text-slate-400 backdrop-blur md:flex">
                                <span>الدائرة = دور الطرف</span>
                                <span className="h-1 w-1 rounded-full bg-slate-700" />
                                <span>الضلع = ناتج التعاون</span>
                            </div>
                        </div>

                        <div className="mt-5 flex justify-center gap-2 lg:hidden">
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMode('nodes');
                                    setActiveId('sales');
                                }}
                                className={cn(
                                    'rounded-full border px-4 py-2 text-xs font-bold transition-colors',
                                    mobileMode === 'nodes' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-400'
                                )}
                            >
                                الأطراف
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMode('edges');
                                    setActiveId('sales-ninja');
                                }}
                                className={cn(
                                    'rounded-full border px-4 py-2 text-xs font-bold transition-colors',
                                    mobileMode === 'edges' ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' : 'border-slate-800 bg-slate-950 text-slate-400'
                                )}
                            >
                                التفاعلات
                            </button>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2 lg:hidden">
                            {(mobileMode === 'nodes' ? nodes : edges).map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveId(item.id)}
                                    className={cn(
                                        'rounded-2xl border px-3 py-3 text-right text-[11px] font-bold transition-colors',
                                        active.id === item.id
                                            ? `${colorClasses[item.color].border} ${colorClasses[item.color].bg} ${colorClasses[item.color].text}`
                                            : 'border-slate-900 bg-slate-950/60 text-slate-400'
                                    )}
                                >
                                    {item.title}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    <motion.aside
                        initial={{ opacity: 0, x: -18 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.1 }}
                        className="lg:sticky lg:top-24"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.22 }}
                                className={cn(
                                    'rounded-[24px] border bg-slate-950/70 p-6 text-right shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur md:p-7',
                                    colorClasses[active.color].border
                                )}
                            >
                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div className={cn('rounded-2xl border p-3', colorClasses[active.color].border, colorClasses[active.color].bg, colorClasses[active.color].text)}>
                                        {active.icon}
                                    </div>
                                    <div>
                                        <div className={cn('mb-2 inline-flex rounded-full border px-3 py-1 text-[11px] font-bold', colorClasses[active.color].border, colorClasses[active.color].bg, colorClasses[active.color].text)}>
                                            {active.label}
                                        </div>
                                        <h3 className="text-2xl font-black leading-tight text-white">
                                            {active.title}
                                        </h3>
                                    </div>
                                </div>
                                <p className={cn('mb-4 text-sm font-extrabold leading-relaxed', colorClasses[active.color].text)}>
                                    {active.short}
                                </p>
                                <p className="mb-6 text-sm font-medium leading-relaxed text-slate-400">
                                    {active.description}
                                </p>
                                <div className="space-y-3">
                                    {active.bullets.map((bullet) => (
                                        <div key={bullet} className="flex items-start gap-3 rounded-2xl border border-slate-900/80 bg-slate-950/65 px-4 py-3 text-sm font-bold text-slate-200">
                                            <Check className={cn('mt-0.5 h-4 w-4 shrink-0', colorClasses[active.color].text)} />
                                            <span>{bullet}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.aside>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto mt-8 max-w-4xl rounded-[24px] border border-emerald-500/20 bg-emerald-500/[0.055] px-5 py-5 text-center text-base font-extrabold leading-relaxed text-emerald-100 md:text-lg"
                >
                    نحن لا نزيد العبء على فريق المبيعات… نحن ننقله من البحث والمطاردة إلى التعامل مع محادثات نشطة قابلة للتحويل.
                </motion.div>
            </div>
        </section>
    );
};

export const GrowthTriangleSection = ({ clientSalesCenter = false }: { clientSalesCenter?: boolean }) => {
    if (clientSalesCenter) {
        return <ClientSalesInteractiveTriangle />;
    }

    const [activeNode, setActiveNode] = useState<string | null>(null);
    const centerNodeLabel = clientSalesCenter ? 'فريق مبيعات العميل' : 'نظام النينجا الذكي';
    const rightNodeLabel = clientSalesCenter ? 'نظام النينجا الذكي' : 'فريقكم البيعي';

    const journeySteps = [
        {
            title: "رصد الاحتياج والفرص",
            desc: "رصد المشاريع والفرص المناسبة بالسوق السعودي.",
            icon: <Eye className="w-4 h-4 text-cyan-400" />
        },
        {
            title: "تجهيز وتدريب فريقكم",
            desc: "تطوير الأداء ورفع كفاءة مبيعاتكم فوراً.",
            icon: <Users className="w-4 h-4 text-teal-400" />
        },
        {
            title: "الوصول وتحريك الاهتمام",
            desc: "فتح المحادثات وبدء التواصل الفعال مع المستهدفين.",
            icon: <Target className="w-4 h-4 text-cyan-400" />
        },
        {
            title: "التنفيذ والإغلاق",
            desc: "تقديم العروض، التفاوض، وحسم التعاقد بنجاح.",
            icon: <Briefcase className="w-4 h-4 text-blue-400" />
        },
        {
            title: "التحسين المستمر والنمو",
            desc: "مراجعة النتائج لضمان تكرار النجاحات بيقين.",
            icon: <RefreshCw className="w-4 h-4 text-emerald-400" />
        }
    ];

    const outcomes = [
        {
            title: "وصول أسرع للسوق السعودي",
            desc: "استهداف مباشر وسريع لصناع القرار وتجاوز عقبات الدخول.",
            icon: <Zap className="w-4 h-4" />
        },
        {
            title: "فريق مبيعات أقوى وأكثر مهارة",
            desc: "تمكين فريقكم بأدلة عمل ومنهجيات تفاوضية احترافية.",
            icon: <Users className="w-4 h-4" />
        },
        {
            title: "صفقات أعلى جودة وأقرب للحسم",
            desc: "رصد دقيق للاحتياجات وتلبية متطلبات السوق الفعلية.",
            icon: <TrendingUp className="w-4 h-4" />
        },
        {
            title: "زيادة نسب التحويل والإيرادات",
            desc: "إدارة ذكية ومتابعة منظمة تمنع ضياع الفرص المتاحة.",
            icon: <Activity className="w-4 h-4" />
        },
        {
            title: "ميزة تنافسية مستدامة وصعبة",
            desc: "منظومة نمو متكاملة يصعب على المنافسين محاكاتها.",
            icon: <ShieldCheck className="w-4 h-4" />
        }
    ];

    return (
        <div className="py-28 bg-[#050505] relative overflow-hidden" id="ninja-growth-triangle">
            {/* Background Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-cyan-500/5 blur-[130px] rounded-full" />
                <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-teal-500/5 blur-[130px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/[0.015] blur-[150px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {!clientSalesCenter && (
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white mb-6 backdrop-blur-sm">
                                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                                <span className="font-semibold text-xs text-slate-300">محرك الإيرادات الحقيقي</span>
                            </div>
                        )}
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                            {clientSalesCenter ? '3 محركات حول مستهدف واحد' : 'مثلث النمو والمبيعات المتكامل'}
                        </h2>
                        <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed mb-4">
                            لا نعتمد على الوصول للسوق فقط… بل نبني معكم منظومة متكاملة تجمع بين <span className="text-teal-400 font-bold">تطوير فريقكم البيعي</span>، <span className="text-cyan-400 font-bold">تشغيل السوق وتحريك الفرص</span>، و <span className="text-emerald-400 font-bold">نظام النينجا الذكي</span>.
                        </p>
                        <div className="inline-block bg-emerald-500/10 border border-emerald-500/25 px-5 py-2.5 rounded-2xl text-base font-extrabold text-emerald-400">
                            النتيجة: فريق أقوى + فرص أكثر + متابعة أذكى + إغلاق أعلى.
                        </div>
                    </motion.div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Left Column (col-span-3): هدفنا معك & كيف نعمل معاً */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        {/* هدفنا معك */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-950/40 border border-slate-900/60 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-colors"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] blur-2xl rounded-full" />
                            <div className="flex items-center gap-2.5 mb-3 text-emerald-400">
                                <Sparkles className="w-4 h-4" />
                                <h3 className="text-sm font-bold text-white">هدفنا معك</h3>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                تمكين فريقكم وتطويره لزيادة تحويل الفرص ومضاعفة المبيعات الفعلية.
                            </p>
                        </motion.div>

                        {/* كيف نعمل معاً؟ */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-950/40 border border-slate-900/60 p-5 rounded-2xl relative overflow-hidden flex-1"
                        >
                            <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-cyan-400" />
                                كيف نعمل معاً؟
                            </h3>
                            
                            <div className="relative pr-6">
                                {/* Vertical connector line */}
                                <div className="absolute right-[11px] top-4 bottom-4 w-px border-r border-dashed border-slate-800/80" />
                                
                                {/* Steps */}
                                <div className="space-y-6 relative">
                                    {journeySteps.map((step, idx) => (
                                        <div key={idx} className="flex gap-3.5 items-start relative group">
                                            {/* Icon / Marker */}
                                            <div className="absolute right-[-23px] top-0.5 w-6 h-6 rounded-full bg-slate-950 border border-slate-800/80 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:border-cyan-500/40 group-hover:text-cyan-400 transition-colors z-10">
                                                {step.icon}
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                                                    {step.title}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                                                    {step.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Middle Column (col-span-6): Interactive Triangle Layout */}
                    <div className="lg:col-span-6 flex items-center justify-center relative min-h-[480px] lg:min-h-0">
                        
                        {/* DESKTOP INTERACTIVE TRIANGLE VISUAL */}
                        <div className="relative w-full aspect-[600/520] max-w-[600px] mx-auto hidden lg:block select-none font-sans">
                            
                            {/* SVG Connecting Glow Lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="teal-cyan-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
                                    </linearGradient>
                                    <linearGradient id="cyan-blue-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
                                    </linearGradient>
                                    <linearGradient id="blue-teal-grad" x1="100%" y1="100%" x2="0%" y2="0%">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.7" />
                                    </linearGradient>
                                    
                                    <linearGradient id="emerald-teal-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.7" />
                                    </linearGradient>
                                    <linearGradient id="emerald-cyan-grad" x1="100%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
                                    </linearGradient>
                                    <linearGradient id="emerald-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
                                    </linearGradient>
                                    
                                    <filter id="glow-teal" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="5" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                    <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="5" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                    <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="5" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                    <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="6" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>

                                {/* Base static subtle triangle */}
                                <path d="M 50 14 L 26 74 L 74 74 Z" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1.5" fill="none" />
                                <path d="M 50 52 L 50 14" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" fill="none" />
                                <path d="M 50 52 L 26 74" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" fill="none" />
                                <path d="M 50 52 L 74 74" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" fill="none" />

                                {/* Interactive Glowing Outer Lines */}
                                {/* Top to Left */}
                                <motion.path
                                    d="M 50 14 L 26 74"
                                    stroke="url(#teal-cyan-grad)"
                                    strokeWidth={activeNode === 'coaching' || activeNode === 'access' ? "3" : "1.5"}
                                    fill="none"
                                    animate={activeNode === 'coaching' || activeNode === 'access' ? { strokeDashoffset: -50 } : { strokeDashoffset: 0 }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                    style={{ 
                                        strokeDasharray: activeNode === 'coaching' || activeNode === 'access' ? "6 8" : "none",
                                        filter: activeNode === 'coaching' || activeNode === 'access' ? 'url(#glow-cyan)' : 'none',
                                        opacity: activeNode === null || activeNode === 'coaching' || activeNode === 'access' ? 1 : 0.2
                                    }}
                                />
                                {/* Left to Right */}
                                <motion.path
                                    d="M 26 74 L 74 74"
                                    stroke="url(#cyan-blue-grad)"
                                    strokeWidth={activeNode === 'access' || activeNode === 'sales' ? "3" : "1.5"}
                                    fill="none"
                                    animate={activeNode === 'access' || activeNode === 'sales' ? { strokeDashoffset: -50 } : { strokeDashoffset: 0 }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                    style={{ 
                                        strokeDasharray: activeNode === 'access' || activeNode === 'sales' ? "6 8" : "none",
                                        filter: activeNode === 'access' || activeNode === 'sales' ? 'url(#glow-blue)' : 'none',
                                        opacity: activeNode === null || activeNode === 'access' || activeNode === 'sales' ? 1 : 0.2
                                    }}
                                />
                                {/* Right to Top */}
                                <motion.path
                                    d="M 74 74 L 50 14"
                                    stroke="url(#blue-teal-grad)"
                                    strokeWidth={activeNode === 'sales' || activeNode === 'coaching' ? "3" : "1.5"}
                                    fill="none"
                                    animate={activeNode === 'sales' || activeNode === 'coaching' ? { strokeDashoffset: -50 } : { strokeDashoffset: 0 }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                    style={{ 
                                        strokeDasharray: activeNode === 'sales' || activeNode === 'coaching' ? "6 8" : "none",
                                        filter: activeNode === 'sales' || activeNode === 'coaching' ? 'url(#glow-teal)' : 'none',
                                        opacity: activeNode === null || activeNode === 'sales' || activeNode === 'coaching' ? 1 : 0.2
                                    }}
                                />

                                {/* Inner Spokes connecting to center */}
                                <motion.path
                                    d="M 50 52 L 50 14"
                                    stroke="url(#emerald-teal-grad)"
                                    strokeWidth={activeNode === 'ninja' || activeNode === 'coaching' ? "2.5" : "1"}
                                    fill="none"
                                    style={{ 
                                        filter: activeNode === 'ninja' || activeNode === 'coaching' ? 'url(#glow-teal)' : 'none',
                                        opacity: activeNode === null || activeNode === 'ninja' || activeNode === 'coaching' ? 1 : 0.15
                                    }}
                                />
                                <motion.path
                                    d="M 50 52 L 26 74"
                                    stroke="url(#emerald-cyan-grad)"
                                    strokeWidth={activeNode === 'ninja' || activeNode === 'access' ? "2.5" : "1"}
                                    fill="none"
                                    style={{ 
                                        filter: activeNode === 'ninja' || activeNode === 'access' ? 'url(#glow-teal)' : 'none',
                                        opacity: activeNode === null || activeNode === 'ninja' || activeNode === 'access' ? 1 : 0.15
                                    }}
                                />
                                <motion.path
                                    d="M 50 52 L 74 74"
                                    stroke="url(#emerald-blue-grad)"
                                    strokeWidth={activeNode === 'ninja' || activeNode === 'sales' ? "2.5" : "1"}
                                    fill="none"
                                    style={{ 
                                        filter: activeNode === 'ninja' || activeNode === 'sales' ? 'url(#glow-teal)' : 'none',
                                        opacity: activeNode === null || activeNode === 'ninja' || activeNode === 'sales' ? 1 : 0.15
                                    }}
                                />

                                {/* Moving Data Particles from Center AI to other nodes */}
                                {activeNode === 'ninja' && (
                                    <>
                                        {/* To Top */}
                                        <motion.circle cx={50} cy={52} r={1.5} fill="#10b981" animate={{ cy: [52, 14], opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0 }} />
                                        <motion.circle cx={50} cy={52} r={1.5} fill="#10b981" animate={{ cy: [52, 14], opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }} />
                                        
                                        {/* To Left */}
                                        <motion.circle cx={50} cy={52} r={1.5} fill="#10b981" animate={{ cx: [50, 26], cy: [52, 74], opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
                                        <motion.circle cx={50} cy={52} r={1.5} fill="#10b981" animate={{ cx: [50, 26], cy: [52, 74], opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.9 }} />

                                        {/* To Right */}
                                        <motion.circle cx={50} cy={52} r={1.5} fill="#10b981" animate={{ cx: [50, 74], cy: [52, 74], opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
                                        <motion.circle cx={50} cy={52} r={1.5} fill="#10b981" animate={{ cx: [50, 74], cy: [52, 74], opacity: [0, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 1.1 }} />
                                    </>
                                )}
                            </svg>

                            {/* NODES (HTML Absolutely Positioned elements matching SVG percentages) */}

                            {/* Node 1: Top (الفريق الاستشاري والقيادي) */}
                            <motion.div 
                                className="absolute top-[14%] left-[50%] z-20 text-center"
                                style={{ x: "-50%", y: "-50%" }}
                                onMouseEnter={() => setActiveNode('coaching')}
                                onMouseLeave={() => setActiveNode(null)}
                                animate={{ y: activeNode === 'coaching' ? "-56%" : ["-50%", "-55%", "-50%"] }}
                                transition={{ 
                                    y: activeNode === 'coaching' 
                                        ? { duration: 0.2 } 
                                        : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 } 
                                }}
                            >
                                <div className="absolute -top-10 left-1/2 whitespace-nowrap text-center" style={{ transform: 'translateX(-50%)' }}>
                                    <span className="block text-xs font-bold text-teal-400">الفريق الاستشاري والقيادي</span>
                                </div>
                                <div className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center border bg-[#060b0b]/95 cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(20,184,166,0.1)]",
                                    activeNode === 'coaching' 
                                        ? "border-teal-500 shadow-[0_0_25px_rgba(20,184,166,0.35)] scale-105" 
                                        : "border-teal-500/30 hover:border-teal-500/70"
                                )}>
                                    <Users className="w-6 h-6 text-teal-400" />
                                </div>
                            </motion.div>

                            {/* Node 2: Left (فريق منافسات) */}
                            <motion.div 
                                className="absolute top-[74%] left-[26%] z-20"
                                style={{ x: "-50%", y: "-50%" }}
                                onMouseEnter={() => setActiveNode('access')}
                                onMouseLeave={() => setActiveNode(null)}
                                animate={{ y: activeNode === 'access' ? "-56%" : ["-50%", "-55%", "-50%"] }}
                                transition={{ 
                                    y: activeNode === 'access' 
                                        ? { duration: 0.2 } 
                                        : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 } 
                                }}
                            >
                                <div className="absolute -top-10 right-6 whitespace-nowrap text-right">
                                    <span className="block text-xs font-bold text-cyan-400">فريق منافسات</span>
                                </div>
                                <div className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center border bg-[#060a0c]/95 cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.1)]",
                                    activeNode === 'access' 
                                        ? "border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.35)] scale-105" 
                                        : "border-cyan-500/30 hover:border-cyan-500/70"
                                )}>
                                    <Target className="w-6 h-6 text-cyan-400" />
                                </div>
                            </motion.div>

                            {/* Node 3: Right */}
                            <motion.div 
                                className="absolute top-[74%] left-[74%] z-20"
                                style={{ x: "-50%", y: "-50%" }}
                                onMouseEnter={() => setActiveNode('sales')}
                                onMouseLeave={() => setActiveNode(null)}
                                animate={{ y: activeNode === 'sales' ? "-56%" : ["-50%", "-55%", "-50%"] }}
                                transition={{ 
                                    y: activeNode === 'sales' 
                                        ? { duration: 0.2 } 
                                        : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2.4 } 
                                }}
                            >
                                <div className="absolute -top-10 left-6 whitespace-nowrap text-left">
                                    <span className="block text-xs font-bold text-blue-400">{rightNodeLabel}</span>
                                </div>
                                <div className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center border bg-[#050810]/95 cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.1)]",
                                    activeNode === 'sales' 
                                        ? "border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.35)] scale-105" 
                                        : "border-blue-500/30 hover:border-blue-500/70"
                                )}>
                                    {clientSalesCenter ? (
                                        <BrainCircuit className="w-6 h-6 text-blue-400" />
                                    ) : (
                                        <Briefcase className="w-6 h-6 text-blue-400" />
                                    )}
                                </div>
                            </motion.div>

                            {/* Node 4: Center Core */}
                            <motion.div 
                                className="absolute top-[52%] left-[50%] z-30"
                                style={{ x: "-50%", y: "-50%" }}
                                onMouseEnter={() => setActiveNode('ninja')}
                                onMouseLeave={() => setActiveNode(null)}
                                animate={{ 
                                    y: activeNode === 'ninja' ? "-54%" : ["-50%", "-53%", "-50%"],
                                    scale: activeNode === 'ninja' ? 1.05 : [1, 1.02, 1]
                                }}
                                transition={{ 
                                    duration: 5, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                            >
                                {/* Pulsing Central GlowOrb */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60 z-0">
                                    <GlowOrb color="emerald" size="sm" />
                                </div>
                                <div className={cn(
                                    "w-20 h-20 rounded-full flex items-center justify-center border bg-[#060a08]/95 cursor-pointer transition-all duration-500 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative z-10",
                                    activeNode === 'ninja' 
                                        ? "border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.45)]" 
                                        : "border-emerald-500/35 hover:border-emerald-400/70"
                                )}>
                                    {/* Pulse effect rings */}
                                    <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-pulse pointer-events-none" />
                                    {clientSalesCenter ? (
                                        <Briefcase className={cn(
                                            "w-8 h-8 transition-colors duration-300",
                                            activeNode === 'ninja' ? "text-emerald-400" : "text-emerald-500"
                                        )} />
                                    ) : (
                                        <BrainCircuit className={cn(
                                        "w-8 h-8 transition-colors duration-300",
                                        activeNode === 'ninja' ? "text-emerald-400" : "text-emerald-500"
                                        )} />
                                    )}
                                </div>
                                <div className="absolute -bottom-10 left-1/2 whitespace-nowrap text-center z-10" style={{ transform: 'translateX(-50%)' }}>
                                    <span className="block text-[11px] font-extrabold text-emerald-400">{centerNodeLabel}</span>
                                </div>
                            </motion.div>

                            {/* FLOATING DETAIL CARDS (SHOWN ONLY ON HOVER FOR EXTREME MINIMALISM) */}

                            {/* Coaching details checklist */}
                            <AnimatePresence>
                                {activeNode === 'coaching' && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-[8%] left-[60%] w-[25%] max-w-[200px] p-3.5 rounded-xl bg-slate-950/95 border border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.25)] backdrop-blur-md z-50 text-right cursor-default"
                                        onMouseEnter={() => setActiveNode('coaching')}
                                        onMouseLeave={() => setActiveNode(null)}
                                    >
                                        <h4 className="text-[10px] font-bold text-white mb-2 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-teal-400" />
                                            تطوير وقيادة المبيعات
                                        </h4>
                                        <ul className="space-y-1.5 text-[9px] leading-tight">
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-teal-400 shrink-0 mt-0.5" />
                                                <span>تدريب وتطوير فريقكم البيعي</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-teal-400 shrink-0 mt-0.5" />
                                                <span>بناء آليات المتابعة وتجاوز العقبات</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-teal-400 shrink-0 mt-0.5" />
                                                <span>متابعة وتقييم مستمر للأداء</span>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Access details checklist */}
                            <AnimatePresence>
                                {activeNode === 'access' && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-[72%] left-[0%] w-[24%] max-w-[170px] p-3.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md z-50 text-right cursor-default"
                                        onMouseEnter={() => setActiveNode('access')}
                                        onMouseLeave={() => setActiveNode(null)}
                                    >
                                        <h4 className="text-[10px] font-bold text-white mb-2 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-cyan-400" />
                                            محرك الوصول للسوق
                                        </h4>
                                        <ul className="space-y-1.5 text-[9px] leading-tight">
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-cyan-400 shrink-0 mt-0.5" />
                                                <span>الوصول المباشر لصناع القرار</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-cyan-400 shrink-0 mt-0.5" />
                                                <span>رصد الفرص والمشاريع الجديدة</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-cyan-400 shrink-0 mt-0.5" />
                                                <span>تشغيل حملات الوصول المستمر</span>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Sales details checklist */}
                            <AnimatePresence>
                                {activeNode === 'sales' && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-[72%] left-[76%] w-[24%] max-w-[170px] p-3.5 rounded-xl bg-slate-950/95 border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.25)] backdrop-blur-md z-50 text-right cursor-default"
                                        onMouseEnter={() => setActiveNode('sales')}
                                        onMouseLeave={() => setActiveNode(null)}
                                    >
                                        <h4 className="text-[10px] font-bold text-white mb-2 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-blue-400" />
                                            {clientSalesCenter ? 'نظام النينجا الذكي' : 'فريق المبيعات الداخلي'}
                                        </h4>
                                        <ul className="space-y-1.5 text-[9px] leading-tight">
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-blue-400 shrink-0 mt-0.5" />
                                                <span>{clientSalesCenter ? 'إثراء البيانات والبحث الذكي للفرص' : 'إدارة الاجتماعات وتقديم العروض'}</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-blue-400 shrink-0 mt-0.5" />
                                                <span>{clientSalesCenter ? 'أتمتة المتابعة الأولية وتصنيف الردود' : 'التفاوض وإتمام صفقات الإغلاق'}</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-blue-400 shrink-0 mt-0.5" />
                                                <span>{clientSalesCenter ? 'تجهيز المحادثات النشطة قبل وصولها للفريق' : 'تحويل الفرص المتاحة لإيرادات'}</span>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Central Ninja interactive detailed hover popover */}
                            <AnimatePresence>
                                {activeNode === 'ninja' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                        className="absolute top-[34%] left-[18%] w-[35%] max-w-[210px] p-3 rounded-xl bg-slate-950/95 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)] backdrop-blur-md z-50 text-right cursor-default"
                                        onMouseEnter={() => setActiveNode('ninja')}
                                        onMouseLeave={() => setActiveNode(null)}
                                    >
                                        <h4 className="text-[10px] font-bold text-emerald-400 mb-2 flex items-center gap-1.5 justify-start">
                                            <Bot className="w-3.5 h-3.5" />
                                            {clientSalesCenter ? 'فريق مبيعات العميل' : 'نظام النينجا الذكي'}
                                        </h4>
                                        <ul className="space-y-1.5 text-[8.5px] text-slate-300 leading-tight">
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0 mt-0.5" />
                                                <span>{clientSalesCenter ? 'استلام المحادثات النشطة الجاهزة' : 'إثراء البيانات والبحث الذكي للفرص'}</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0 mt-0.5" />
                                                <span>{clientSalesCenter ? 'تأكيد الاحتياج وحجز الاجتماعات' : 'أتمتة المحادثات ورصد الاهتمام'}</span>
                                            </li>
                                            <li className="flex items-start gap-1">
                                                <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0 mt-0.5" />
                                                <span>{clientSalesCenter ? 'إرسال العروض ومتابعة التفاوض' : 'إدارة علاقات العملاء وسير الفرص'}</span>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Goal pill at bottom of triangle */}
                            <div className="absolute bottom-[2%] left-0 w-full text-center">
                                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold shadow-md backdrop-blur-sm">
                                    <Users className="w-4 h-4 text-emerald-400" />
                                    <span>ثلاثة أضلاع... هدف واحد: نموك ونجاحك في السوق السعودي</span>
                                </div>
                            </div>
                        </div>

                        {/* MOBILE ONLY LAYOUT (STACKED LIST OF NODE FORCES) */}
                        <div className="lg:hidden w-full space-y-6 z-10 px-2 select-none font-sans">
                            <div className="text-center py-2">
                                <span className="text-xs font-bold text-slate-500">أضلاع المنظومة الأربعة</span>
                            </div>

                            {/* 1. نظام النينجا الذكي */}
                            <div className="bg-[#060a08]/90 border border-emerald-500/25 p-5 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25">
                                    <BrainCircuit className="w-4 h-4 text-emerald-400" />
                                </div>
                                <h3 className="text-sm font-bold text-emerald-400 mb-1">نظام النينجا الذكي</h3>
                                <p className="text-[10px] text-slate-400 mb-4 font-medium">الذكاء الاصطناعي والأتمتة - القلب الذكي للمنظومة</p>
                                <ul className="grid grid-cols-1 gap-2 text-xs text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span>إثراء البيانات والبحث الذكي للفرص</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span>أتمتة المحادثات الأولية وتصنيف العملاء</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span>إدارة علاقات العملاء وسير الفرص</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Arrow */}
                            <div className="flex justify-center text-slate-800 -my-2">
                                <ChevronDown className="w-5 h-5" />
                            </div>

                            {/* 2. فريق منافسات */}
                            <div className="bg-[#060a0c]/90 border border-cyan-500/25 p-5 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/25">
                                    <Target className="w-4 h-4 text-cyan-400" />
                                </div>
                                <h3 className="text-sm font-bold text-cyan-400 mb-1">فريق منافسات</h3>
                                <p className="text-[10px] text-slate-400 mb-4 font-medium">الوصول وتحريك السوق والفرص</p>
                                <ul className="grid grid-cols-1 gap-2 text-xs text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                        <span>الوصول المباشر لصناع القرار</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                        <span>رصد الفرص والمشاريع الجديدة</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                        <span>تشغيل حملات الوصول المستمر</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Arrow */}
                            <div className="flex justify-center text-slate-800 -my-2">
                                <ChevronDown className="w-5 h-5" />
                            </div>

                            {/* 3. الفريق الاستشاري والقيادي */}
                            <div className="bg-[#060b0b]/90 border border-teal-500/25 p-5 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center border border-teal-500/25">
                                    <Users className="w-4 h-4 text-teal-400" />
                                </div>
                                <h3 className="text-sm font-bold text-teal-400 mb-1">الفريق الاستشاري والقيادي</h3>
                                <p className="text-[10px] text-slate-400 mb-4 font-medium">تطوير وقيادة المبيعات</p>
                                <ul className="grid grid-cols-1 gap-2 text-xs text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                                        <span>تدريب وتطوير فريقكم البيعي</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                                        <span>بناء آليات المتابعة وتجاوز العقبات</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                                        <span>متابعة وتقييم مستمر للأداء</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Arrow */}
                            <div className="flex justify-center text-slate-800 -my-2">
                                <ChevronDown className="w-5 h-5" />
                            </div>

                            {/* 4. فريقكم البيعي */}
                            <div className="bg-[#050810]/90 border border-blue-500/25 p-5 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/25">
                                    <Briefcase className="w-4 h-4 text-blue-400" />
                                </div>
                                <h3 className="text-sm font-bold text-blue-400 mb-1">فريقكم البيعي</h3>
                                <p className="text-[10px] text-slate-400 mb-4 font-medium">التنفيذ والإغلاق وإتمام التعاقد</p>
                                <ul className="grid grid-cols-1 gap-2 text-xs text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                        <span>إدارة الاجتماعات وتقديم العروض</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                        <span>التفاوض وإتمام صفقات الإغلاق</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                        <span>تحويل الفرص المتاحة لإيرادات فعلية</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="text-center pt-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-semibold shadow-md">
                                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>هدف واحد: نموك ونجاحك في السوق السعودي</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (col-span-3): النتيجة النهائية */}
                    <div className="lg:col-span-3">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-slate-950/40 border border-slate-900/60 p-5 rounded-2xl relative overflow-hidden h-full flex flex-col justify-start"
                        >
                            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/[0.03] blur-2xl rounded-full" />
                            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-400" />
                                النتيجة النهائية للمنظومة
                            </h3>
                            
                            <div className="space-y-5">
                                {outcomes.map((item, idx) => (
                                    <div key={idx} className="flex gap-3.5 items-start group">
                                        <div className="w-7 h-7 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center text-blue-400 group-hover:border-blue-500/50 group-hover:bg-blue-950/20 transition-all shrink-0 mt-0.5">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-200 group-hover:text-blue-300 transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                </div>

                {/* Closing Line Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mt-20 max-w-4xl mx-auto text-center"
                >
                    <div className="relative p-6 md:p-8 rounded-3xl bg-slate-950/30 border border-slate-900/80 overflow-hidden animate-pulse-slow">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.015] via-transparent to-teal-500/[0.015]" />
                        <h3 className="text-lg md:text-xl font-extrabold text-slate-200 leading-relaxed max-w-3xl mx-auto">
                            "لا نوفر لكم فرصًا فقط… بل نساعدكم على بناء فريق مبيعات أقوى قادر على تحويل الفرص إلى نمو حقيقي ومستدام."
                        </h3>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
