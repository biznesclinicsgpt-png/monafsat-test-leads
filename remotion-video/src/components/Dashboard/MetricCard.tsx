import React from 'react';
import { DashboardTheme } from '../../DashboardTheme';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string;
    trend: number;
    trendLabel?: string;
    icon: any;
    opacity?: number;
    scale?: number;
}

export const MetricCard = ({ label, value, trend, trendLabel, icon: Icon, opacity = 1, scale = 1 }: MetricCardProps) => {
    const isPositive = trend >= 0;

    return (
        <div
            style={{
                backgroundColor: 'white',
                borderRadius: DashboardTheme.Layout.BorderRadius.lg,
                padding: 24,
                boxShadow: DashboardTheme.Layout.Shadows.card,
                fontFamily: DashboardTheme.Typography.FontFamily.Sans,
                opacity,
                transform: `scale(${scale})`,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                width: '100%',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div
                    style={{
                        padding: 12,
                        borderRadius: DashboardTheme.Layout.BorderRadius.md,
                        backgroundColor: DashboardTheme.Colors.Brand.Surface,
                        color: DashboardTheme.Colors.Brand.Dark,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Icon size={24} />
                </div>
                {trend !== 0 && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            padding: '4px 8px',
                            borderRadius: 9999,
                            backgroundColor: isPositive ? '#ecfdf5' : '#fef2f2',
                            color: isPositive ? '#059669' : '#dc2626',
                        }}
                    >
                        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>

            <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: 4, color: DashboardTheme.Colors.Neutrals.TextSecondary }}>
                    {label}
                </h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: DashboardTheme.Colors.Neutrals.TextPrimary }}>
                    {value}
                </div>
                {trendLabel && (
                    <div style={{ fontSize: '0.75rem', marginTop: 4, color: DashboardTheme.Colors.Neutrals.TextMuted }}>
                        {trendLabel}
                    </div>
                )}
            </div>
        </div>
    );
};
