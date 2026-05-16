import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { DashboardTheme } from '../../lib/theme';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div
                className="bg-white p-3 rounded-lg border shadow-lg"
                style={{
                    borderColor: DashboardTheme.Colors.Neutrals.Border,
                    fontFamily: DashboardTheme.Typography.FontFamily.Sans
                }}
            >
                <p className="text-sm font-semibold mb-1" style={{ color: DashboardTheme.Colors.Neutrals.TextPrimary }}>{label}</p>
                <p className="text-sm" style={{ color: DashboardTheme.Colors.Brand.Primary }}>
                    {`${payload[0].name}: ${payload[0].value}`}
                </p>
            </div>
        );
    }
    return null;
};

export const RevenueChart = ({ data }: { data: any[] }) => {
    return (
        <div className="h-[300px] w-full">
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
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: DashboardTheme.Colors.Brand.Primary, strokeWidth: 1, strokeDasharray: '3 3' }} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={DashboardTheme.Colors.Brand.Primary}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        name="Revenue"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export const LeadsBarChart = ({ data }: { data: any[] }) => {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={DashboardTheme.Colors.Neutrals.Border} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: DashboardTheme.Colors.Neutrals.TextSecondary, fontSize: 12 }}
                        dy={10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: DashboardTheme.Colors.Neutrals.Bg }} />
                    <Bar
                        dataKey="value"
                        fill={DashboardTheme.Colors.Gold.Primary}
                        radius={[4, 4, 0, 0]}
                        name="Leads"
                    />
                </BarChart>
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

    return (
        <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-2xl font-bold" style={{ color: DashboardTheme.Colors.Neutrals.TextPrimary }}>
                    {data.reduce((a, b) => a + b.value, 0).toLocaleString()}
                </div>
                <div className="text-xs font-medium" style={{ color: DashboardTheme.Colors.Neutrals.TextSecondary }}>
                    Total Visits
                </div>
            </div>
        </div>
    );
};
