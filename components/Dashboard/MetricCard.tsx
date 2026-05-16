import React from 'react';
import { DashboardTheme } from '../../lib/theme';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string;
    trend: number;
    trendLabel?: string;
    icon: any;
}

export const MetricCard = ({ label, value, trend, trendLabel, icon: Icon }: MetricCardProps) => {
    const isPositive = trend >= 0;

    return (
        <div
            className="bg-white rounded-xl p-6 transition-all duration-200 hover:-translate-y-1"
            style={{
                boxShadow: DashboardTheme.Layout.Shadows.card,
                fontFamily: DashboardTheme.Typography.FontFamily.Sans
            }}
        >
            <div className="flex justify-between items-start mb-4">
                <div
                    className="p-3 rounded-lg"
                    style={{
                        backgroundColor: DashboardTheme.Colors.Brand.Surface,
                        color: DashboardTheme.Colors.Brand.Dark
                    }}
                >
                    <Icon size={24} />
                </div>
                {trend !== 0 && (
                    <div
                        className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full
              ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}
            `}
                    >
                        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-sm font-medium mb-1" style={{ color: DashboardTheme.Colors.Neutrals.TextSecondary }}>
                    {label}
                </h3>
                <div className="text-2xl font-bold" style={{ color: DashboardTheme.Colors.Neutrals.TextPrimary }}>
                    {value}
                </div>
                {trendLabel && (
                    <div className="text-xs mt-1" style={{ color: DashboardTheme.Colors.Neutrals.TextMuted }}>
                        {trendLabel}
                    </div>
                )}
            </div>
        </div>
    );
};
