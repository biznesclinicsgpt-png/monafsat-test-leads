import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { DashboardTheme } from '../../DashboardTheme';

export const RevenueChart = ({ data }: { data: any[] }) => {
    return (
        <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={DashboardTheme.Colors.Brand.Primary} stopOpacity={0.1} />
                            <stop offset="95%" stopColor={DashboardTheme.Colors.Brand.Primary} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={DashboardTheme.Colors.Neutrals.Border} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: DashboardTheme.Colors.Neutrals.TextSecondary, fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: DashboardTheme.Colors.Neutrals.TextSecondary, fontSize: 12 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={DashboardTheme.Colors.Brand.Primary}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        isAnimationActive={false} // Animation controlled by Remotion timeframe ideally, but keeping simple for now
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export const TrafficPieChart = ({ data }: { data: any[] }) => {
    const COLORS = [
        DashboardTheme.Colors.Brand.Primary,
        DashboardTheme.Colors.Gold.Primary,
        DashboardTheme.Colors.Ninja.Accent,
        DashboardTheme.Colors.Neutrals.TextSecondary
    ];

    const total = data.reduce((a, b) => a + b.value, 0).toLocaleString();

    return (
        <div style={{ height: 300, width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        isAnimationActive={false}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* Legend Center Text */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                }}
            >
                <div style={{ fontSize: 24, fontWeight: 'bold', color: DashboardTheme.Colors.Neutrals.TextPrimary }}>
                    {total}
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: DashboardTheme.Colors.Neutrals.TextSecondary }}>
                    Total Visits
                </div>
            </div>
        </div>
    );
};
