import React, { useState } from 'react';

interface InputGroupProps {
    label: string;
    id: string;
    type?: 'text' | 'number' | 'select' | 'toggle' | 'collapsible-multiselect';
    value: any;
    onChange: (value: any) => void;
    options?: any[];
    placeholder?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    options = [],
    placeholder
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Common wrapper styling
    const wrapperClass = "space-y-1.5";
    const labelClass = "block text-sm font-bold text-slate-600 dark:text-gray-300";
    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 focus:scale-[1.01] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all dark:text-white";

    if (type === 'toggle') {
        return (
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20">
                <label className={labelClass} htmlFor={id}>{label}</label>
                <button
                    onClick={() => onChange(!value)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-gray-600'}`}
                >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>
        );
    }

    if (type === 'select') {
        return (
            <div className={wrapperClass}>
                <label htmlFor={id} className={labelClass}>{label}</label>
                <div className="relative">
                    <select
                        id={id}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`${inputClass} appearance-none cursor-pointer`}
                    >
                        {options.map((opt: any, i) => (
                            <option key={i} value={typeof opt === 'object' ? opt.value : opt}>
                                {typeof opt === 'object' ? opt.label : opt}
                            </option>
                        ))}
                    </select>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        ▼
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'collapsible-multiselect') {
        return (
            <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-black/20">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-3 text-sm font-bold text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5"
                >
                    <span>{label}</span>
                    <span className="text-slate-400">{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                    <div className="p-3 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {options.map((opt: any, i) => {
                            const val = typeof opt === 'object' ? opt.value : opt;
                            const isSelected = (value as string[])?.includes(val);
                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        const current = (value as string[]) || [];
                                        if (isSelected) onChange(current.filter(x => x !== val));
                                        else onChange([...current, val]);
                                    }}
                                    className={`text-xs px-2 py-1.5 rounded-lg border transition-all text-right truncate ${isSelected
                                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                                            : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {typeof opt === 'object' ? opt.label : opt}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={wrapperClass}>
            <label htmlFor={id} className={labelClass}>{label}</label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                className={inputClass}
                placeholder={placeholder}
            />
        </div>
    );
};
