
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
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsRadar outerRadius="80%" data={data}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Ninja Score"
                        dataKey="A"
                        stroke="#10b981"
                        strokeWidth={3}
                        fill="#10b981"
                        fillOpacity={0.4}
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
        { value: leads, name: 'عملاء محتملين', fill: '#94a3b8' },
        { value: meetings, name: 'اجتماعات', fill: '#38bdf8' },
        { value: proposals, name: 'عروض أسعار', fill: '#f59e0b' },
        { value: won, name: 'إغلاق (Won)', fill: '#10b981' }
    ];

    return (
        <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsFunnel>
                    <Tooltip />
                    <Funnel
                        dataKey="value"
                        data={data}
                        isAnimationActive
                    >
                        <LabelList position="right" fill="#64748b" stroke="none" dataKey="name" />
                    </Funnel>
                </RechartsFunnel>
            </ResponsiveContainer>
        </div>
    );
};
