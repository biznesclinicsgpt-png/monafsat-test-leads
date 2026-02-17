import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { MessageCircle, Phone, Linkedin, Mail } from 'lucide-react';

// CountUp Component (Local to avoid circular dependency)
const CountUp = ({ to }: { to: number }) => {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const prevTo = useRef(0);

    useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(prevTo.current + (to - prevTo.current) * ease);
            node.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                prevTo.current = to;
            }
        };
        requestAnimationFrame(animate);
    }, [to]);

    return <span ref={nodeRef}>{to.toLocaleString()}</span>;
};

const STATS = [
    {
        id: 'whatsapp',
        icon: MessageCircle,
        value: 12000,
        label: 'واتساب رسمي / رسالة',
        color: 'emerald',
        colorHex: '#10b981',
        delay: 0
    },
    {
        id: 'calls',
        icon: Phone,
        value: 7200,
        label: 'اتصالات مباشرة / دقيقة',
        color: 'rose', // closer to the red/orange in reference
        colorHex: '#f43f5e',
        delay: 0.1
    },
    {
        id: 'linkedin',
        icon: Linkedin,
        value: 3000,
        label: 'لينكد إن / تفاعل',
        color: 'sky',
        colorHex: '#0ea5e9',
        delay: 0.2
    },
    {
        id: 'email',
        icon: Mail,
        value: 10000,
        label: 'تسلسل بريدي / إيميل',
        color: 'indigo',
        colorHex: '#6366f1',
        delay: 0.3
    },
];

export const GrowthStats = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 relative z-10 w-full">
            {STATS.map((stat, i) => (
                <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: stat.delay }}
                    className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                    <div className="flex justify-between items-start mb-6">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${stat.color}-50 text-${stat.color}-600`}>
                            نشط
                        </span>
                        <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-${stat.color}-500 group-hover:bg-${stat.color}-50 transition-colors`}>
                            <stat.icon size={20} />
                        </div>
                    </div>

                    <div className="text-center mb-4">
                        <div className="text-4xl font-black text-slate-900 mb-1 font-tajawal">
                            <CountUp to={stat.value} />
                        </div>
                        <div className="text-xs text-slate-400 font-medium font-tajawal">
                            {stat.label}
                        </div>
                    </div>

                    {/* Progress Bar Background */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-4">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.5 + stat.delay, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: stat.colorHex }}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
