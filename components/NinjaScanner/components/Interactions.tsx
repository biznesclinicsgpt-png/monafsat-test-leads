
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Divide } from 'lucide-react';

// --- Selection Card (Single Choice) ---
interface SelectionCardProps {
    icon?: any;
    title: string;
    description?: string;
    selected: boolean;
    onClick: () => void;
}

export const SelectionCard = ({ icon: Icon, title, description, selected, onClick }: SelectionCardProps) => (
    <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`
            relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300
            ${selected
                ? 'bg-brand-50 border-brand-500 shadow-xl shadow-brand-500/10'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-500/30 hover:shadow-lg'
            }
        `}
    >
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
                {Icon && (
                    <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors
                        ${selected ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}
                    `}>
                        <Icon size={24} />
                    </div>
                )}
                <div className="text-right">
                    <h3 className={`font-bold text-lg mb-1 ${selected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-200'}`}>
                        {title}
                    </h3>
                    {description && (
                        <p className={`text-sm ${selected ? 'text-brand-600/80' : 'text-slate-400'}`}>
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                ${selected ? 'border-brand-500 bg-brand-500' : 'border-slate-300 dark:border-slate-600'}
            `}>
                {selected && <CheckCircle size={14} className="text-white" />}
            </div>
        </div>
    </motion.div>
);

// --- Toggle Card (Multiple Choice / Boolean) ---
interface ToggleCardProps {
    icon?: any;
    label: string;
    value: boolean;
    onChange: (val: boolean) => void;
}

export const ToggleCard = ({ icon: Icon, label, value, onChange }: ToggleCardProps) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange(!value)}
        className={`
            flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
            ${value
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 shadow-lg shadow-emerald-500/10'
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-500/30'
            }
        `}
    >
        <div className="flex items-center gap-3">
            {Icon && (
                <div className={`${value ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <Icon size={20} />
                </div>
            )}
            <span className={`font-bold ${value ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}`}>
                {label}
            </span>
        </div>

        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${value ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
            <motion.div
                className="w-4 h-4 rounded-full bg-white shadow-sm"
                animate={{ x: value ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        </div>
    </motion.div>
);

// --- Visual Slider (Numeric) ---
interface VisualSliderProps {
    label: string;
    value: number;
    onChange: (val: number) => void;
    min: number;
    max: number;
    step?: number;
    suffix?: string;
    prefix?: string;
    icon?: any;
    colorClass?: string;
}

export const VisualSlider = ({ label, value, onChange, min, max, step = 1, suffix = '', prefix = '', icon: Icon, colorClass = "brand" }: VisualSliderProps) => {
    // Calculate percentage for background gradient
    const percentage = ((value - min) / (max - min)) * 100;

    // Tailwind color mapping
    const colors: any = {
        brand: { text: 'text-brand-600', bg: 'bg-brand-500', light: 'bg-brand-100', border: 'border-brand-200' },
        emerald: { text: 'text-emerald-600', bg: 'bg-emerald-500', light: 'bg-emerald-100', border: 'border-emerald-200' },
        rose: { text: 'text-rose-600', bg: 'bg-rose-500', light: 'bg-rose-100', border: 'border-rose-200' },
        blue: { text: 'text-blue-600', bg: 'bg-blue-500', light: 'bg-blue-100', border: 'border-blue-200' },
    };
    const c = colors[colorClass] || colors.brand;

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {Icon && <Icon size={20} className="text-slate-400" />}
                    <label className="font-bold text-slate-700 dark:text-slate-200">{label}</label>
                </div>
                <div className={`text-2xl font-black font-mono ${c.text}`}>
                    {prefix}{value.toLocaleString()}{suffix}
                </div>
            </div>

            <div className="relative h-6 flex items-center">
                {/* Track Background */}
                <div className="absolute w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${c.bg} transition-all duration-100`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Custom Input */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />

                {/* Thumb Visual (Moves with Value) */}
                <div
                    className={`absolute h-6 w-6 rounded-full bg-white border-4 ${c.border} shadow-lg pointer-events-none transition-all duration-100 flex items-center justify-center`}
                    style={{
                        left: `${percentage}%`,
                        transform: 'translateX(-50%)',
                        borderColor: 'currentColor' // Inherits text color set via Tailwind is hard, using inline style for dynamic left
                    }}
                >
                    <div className={`w-2 h-2 rounded-full ${c.bg}`}></div>
                </div>
            </div>

            <div className="flex justify-between text-xs text-slate-400 mt-3 font-mono">
                <span>{prefix}{min.toLocaleString()}</span>
                <span>{prefix}{max.toLocaleString()}+</span>
            </div>
        </div>
    );
};
