
import React from 'react';
import {
    Radar,
    RadarChart as RechartsRadar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Funnel,
    FunnelChart as RechartsFunnel,
    Tooltip,
    LabelList
} from 'recharts';

interface Scores {
    icpScore: number;
    crmScore: number;
    outboundScore: number;
    teamScore: number;
    mindsetScore: number;
}

export const RadarChart = ({ scores }: { scores: Scores }) => {
    const data = [
        { subject: 'ICP & Offer', A: scores.icpScore, fullMark: 100 },
        { subject: 'Data & CRM', A: scores.crmScore, fullMark: 100 },
        { subject: 'Outbound', A: scores.outboundScore, fullMark: 100 },
        { subject: 'Team', A: scores.teamScore, fullMark: 100 },
        { subject: 'Mindset', A: scores.mindsetScore, fullMark: 100 },
    ];

    return (
        <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsRadar outerRadius="75%" data={data}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 'bold' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Ninja Score"
                        dataKey="A"
                        stroke="#10b981"
                        strokeWidth={4}
                        fill="#10b981"
                        fillOpacity={0.4}
                        isAnimationActive={true}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            borderColor: '#334155',
                            borderRadius: '12px',
                            color: '#fff',
                            backdropFilter: 'blur(10px)'
                        }}
                        itemStyle={{ color: '#10b981' }}
                    />
                </RechartsRadar>
            </ResponsiveContainer>
        </div>
    );
};

export const FunnelChart = ({ kpis, leads, won }: { kpis: any, leads: number, won: number }) => {
    // Calculate intermediate stages roughly if not explicit
    const meetings = Math.round(leads * (kpis.leadToMeeting / 100));
    const proposals = Math.round(meetings * (kpis.meetingToProposal / 100));

    // Fallback if KPIs are 0
    const data = [
        { value: leads || 100, name: 'عملاء محتملين', fill: '#94a3b8' },
        { value: meetings || 50, name: 'اجتماعات', fill: '#38bdf8' },
        { value: proposals || 20, name: 'عروض أسعار', fill: '#f59e0b' },
        { value: won || 5, name: 'إغلاق (Won)', fill: '#10b981' }
    ];

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsFunnel>
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            borderColor: '#334155',
                            borderRadius: '12px',
                            color: '#fff',
                            backdropFilter: 'blur(10px)'
                        }}
                    />
                    <Funnel
                        dataKey="value"
                        data={data}
                        isAnimationActive
                    >
                        <LabelList
                            position="right"
                            fill="#cbd5e1"
                            stroke="none"
                            dataKey="name"
                            style={{ fontSize: 14, fontWeight: 'bold' }}
                        />
                        <LabelList
                            position="left"
                            fill="#ffffff"
                            stroke="none"
                            dataKey="value"
                            style={{ fontSize: 14, fontWeight: 'bold' }}
                        />
                    </Funnel>
                </RechartsFunnel>
            </ResponsiveContainer>
        </div>
    );
};
