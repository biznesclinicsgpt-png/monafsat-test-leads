import {
    AbsoluteFill,
    interpolate,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    spring,
    Audio,
    staticFile
} from 'remotion';
import { DashboardTheme } from './DashboardTheme';
import { MetricCard } from './components/Dashboard/MetricCard';
import { RevenueChart, TrafficPieChart } from './components/Dashboard/Charts';
import { DollarSign, Users, TrendingUp, Briefcase, MousePointer, Filter } from 'lucide-react';
import { loadFont } from '@remotion/google-fonts/Cairo';
import { Cursor } from './Cursor';

const { fontFamily } = loadFont();

// --- Intro Scene (High Energy 3D) ---
const IntroScene = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({ frame, fps, config: { stiffness: 200, damping: 10 } });
    const rotateX = interpolate(frame, [0, 30], [90, 0], { extrapolateRight: 'clamp' });
    const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: DashboardTheme.Colors.Neutrals.Bg, justifyContent: 'center', alignItems: 'center', perspective: 1000 }}>
            <div style={{ textAlign: 'center', transform: `scale(${scale}) rotateX(${rotateX}deg)`, opacity }}>
                <h1 style={{ fontFamily, fontSize: 80, fontWeight: 800, color: DashboardTheme.Colors.Brand.Dark, marginBottom: 20 }}>
                    Introducing
                </h1>
                <h1 style={{ fontFamily, fontSize: 120, fontWeight: 900, color: DashboardTheme.Colors.Brand.Primary, textShadow: '0 10px 30px rgba(91, 181, 199, 0.3)' }}>
                    MANAFETH
                </h1>
                <h2 style={{ fontFamily, fontSize: 40, fontWeight: 600, color: DashboardTheme.Colors.Neutrals.TextSecondary, marginTop: 20 }}>
                    The Ultimate Provider CRM
                </h2>
            </div>
        </AbsoluteFill>
    );
};

// --- Metrics Scene (Rapid Fire) ---
const MetricsScene = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const metrics = [
        { label: 'Total Revenue', value: '$124,500', trend: 12.5, trendLabel: 'vs last month', icon: DollarSign },
        { label: 'New Leads', value: '1,240', trend: 8.2, trendLabel: 'vs last month', icon: Users },
        { label: 'Conversion Rate', value: '3.2%', trend: -1.1, trendLabel: 'vs last month', icon: TrendingUp },
        { label: 'Active Deals', value: '45', trend: 5.4, trendLabel: 'vs last month', icon: Briefcase },
    ];

    return (
        <AbsoluteFill style={{ backgroundColor: DashboardTheme.Colors.Neutrals.Bg, padding: 100 }}>
            <h2 style={{ fontFamily, fontSize: 50, fontWeight: 700, marginBottom: 40, color: DashboardTheme.Colors.Neutrals.TextPrimary }}>
                Real-Time KPI Tracking
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30, width: '100%' }}>
                {metrics.map((metric, index) => {
                    // Staggered heavy impact entry
                    const delay = index * 4;
                    const entrance = spring({
                        frame: frame - delay,
                        fps,
                        config: { stiffness: 300, damping: 15, mass: 0.5 }
                    });

                    const y = interpolate(entrance, [0, 1], [100, 0]);
                    const opacity = interpolate(frame - delay, [0, 5], [0, 1]);

                    return (
                        <div key={index} style={{ transform: `translateY(${y}px) scale(${entrance})`, opacity }}>
                            <MetricCard {...metric} />
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

// --- Charts Scene (Interactive) ---
const ChartsScene = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Fake Cursor Movement
    const cursorX = interpolate(frame, [20, 50, 80], [1400, 900, 400], { extrapolateRight: 'clamp' });
    const cursorY = interpolate(frame, [20, 50, 80], [800, 500, 600], { extrapolateRight: 'clamp' });
    const click = frame > 45 && frame < 55;

    // Charts slide in
    const revenueData = [
        { name: 'Jan', value: 4000 }, { name: 'Feb', value: 3000 }, { name: 'Mar', value: 2000 },
        { name: 'Apr', value: 2780 }, { name: 'May', value: 1890 }, { name: 'Jun', value: 2390 },
        { name: 'Jul', value: 3490 },
    ];
    const trafficData = [
        { name: 'Direct', value: 400 }, { name: 'Organic', value: 300 },
        { name: 'Referral', value: 300 }, { name: 'Social', value: 200 },
    ];

    const slideIn = spring({ frame, fps, config: { stiffness: 100 } });
    const containerX = interpolate(slideIn, [0, 1], [-50, 0]);

    // Hover effect on charts when cursor is near (simulated)
    const hoverScale = frame > 40 && frame < 70 ? 1.02 : 1;

    return (
        <AbsoluteFill style={{ backgroundColor: DashboardTheme.Colors.Neutrals.Bg, padding: 60, flexDirection: 'row', gap: 40 }}>
            <Cursor x={cursorX} y={cursorY} click={click} />

            {/* Revenue Chart */}
            <div style={{ flex: 2, backgroundColor: 'white', borderRadius: 24, padding: 30, boxShadow: DashboardTheme.Layout.Shadows.lg, opacity: slideIn, transform: `translateX(${containerX}px) scale(${hoverScale})`, transition: 'transform 0.2s' }}>
                <h3 style={{ fontFamily, fontSize: 24, fontWeight: 700, marginBottom: 20, color: DashboardTheme.Colors.Neutrals.TextPrimary }}>Variable Revenue Streams</h3>
                <div style={{ height: '85%', width: '100%' }}>
                    <RevenueChart data={revenueData} />
                </div>
            </div>

            {/* Traffic Pie */}
            <div style={{ flex: 1, backgroundColor: 'white', borderRadius: 24, padding: 30, boxShadow: DashboardTheme.Layout.Shadows.lg, opacity: slideIn, transform: `translateY(${containerX * -0.5}px)` }}>
                <h3 style={{ fontFamily, fontSize: 24, fontWeight: 700, marginBottom: 20, color: DashboardTheme.Colors.Neutrals.TextPrimary }}>Deep Analytics</h3>
                <div style={{ height: '85%', width: '100%' }}>
                    <TrafficPieChart data={trafficData} />
                </div>
            </div>
        </AbsoluteFill>
    );
};

// --- Table Scene (Filtering & Speed) ---
const TableScene = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Table rows staggering
    const rows = Array.from({ length: 8 }).map((_, i) => i);

    // Cursor clicking filter
    const cursorX = interpolate(frame, [0, 20], [1800, 1600], { extrapolateRight: 'clamp' });
    const cursorY = interpolate(frame, [0, 20], [100, 150], { extrapolateRight: 'clamp' });
    const click = frame > 20 && frame < 30;

    // Filter menu appearing
    const filterScale = spring({ frame: frame - 25, fps, config: { stiffness: 200 } });
    const showFilter = frame > 25;

    return (
        <AbsoluteFill style={{ backgroundColor: DashboardTheme.Colors.Neutrals.Bg, padding: 80 }}>
            <Cursor x={cursorX} y={cursorY} click={click} />

            <div style={{ backgroundColor: 'white', borderRadius: 24, padding: 40, height: '100%', boxShadow: DashboardTheme.Layout.Shadows.card, overflow: 'hidden', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
                    <h2 style={{ fontFamily, fontSize: 30, fontWeight: 700, color: DashboardTheme.Colors.Neutrals.TextPrimary }}>Recent Leads</h2>
                    <div style={{ padding: 10, borderRadius: 8, border: `1px solid ${DashboardTheme.Colors.Neutrals.Border}`, display: 'flex', gap: 10, alignItems: 'center' }}>
                        <Filter size={20} /> <span style={{ fontFamily, fontSize: 16 }}>Filter</span>
                    </div>
                </div>

                {/* Filter Dropdown Simulation */}
                {showFilter && (
                    <div style={{ position: 'absolute', right: 120, top: 90, backgroundColor: 'white', padding: 20, borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', zIndex: 10, transform: `scale(${filterScale})` }}>
                        <div style={{ padding: 10, borderBottom: '1px solid #eee', fontFamily }}>Status: Active</div>
                        <div style={{ padding: 10, borderBottom: '1px solid #eee', fontFamily }}>Value: &gt; $10k</div>
                        <div style={{ padding: 10, fontFamily, color: DashboardTheme.Colors.Brand.Primary, fontWeight: 'bold' }}>Apply Filter</div>
                    </div>
                )}

                {/* Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                    {rows.map((r, i) => {
                        const y = interpolate(frame - (i * 2), [0, 20], [50, 0], { extrapolateRight: 'clamp' });
                        const op = interpolate(frame - (i * 2), [0, 10], [0, 1], { extrapolateRight: 'clamp' });
                        // Filter effect: shuffle rows after click
                        const shuffleY = frame > 40 ? interpolate(frame - 40 - (i * 3), [0, 20], [0, -10], { extrapolateRight: 'clamp' }) : 0;

                        return (
                            <div key={i} style={{ height: 60, backgroundColor: DashboardTheme.Colors.Neutrals.Bg, borderRadius: 8, transform: `translateY(${y + shuffleY}px)`, opacity: op, display: 'flex', alignItems: 'center', padding: '0 20px' }}>
                                <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#cbd5e1', marginRight: 20 }}></div>
                                <div style={{ width: '30%', height: 16, backgroundColor: '#e2e8f0', borderRadius: 4 }}></div>
                                <div style={{ width: '20%', marginLeft: 'auto', height: 16, backgroundColor: '#e2e8f0', borderRadius: 4 }}></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AbsoluteFill>
    );
}

const OutroScene = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const scale = spring({ frame, fps, config: { stiffness: 100 } });

    return (
        <AbsoluteFill style={{ backgroundColor: DashboardTheme.Colors.Brand.Primary, justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', transform: `scale(${scale})` }}>
                <h1 style={{ fontFamily, fontSize: 100, fontWeight: 800, color: 'white', marginBottom: 20 }}>
                    Ready to Grow?
                </h1>
                <div style={{ fontFamily, fontSize: 40, fontWeight: 600, color: DashboardTheme.Colors.Brand.Primary, backgroundColor: 'white', padding: '15px 40px', borderRadius: 9999, display: 'inline-block', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
                    Get Started Today
                </div>
            </div>
        </AbsoluteFill>
    );
}

export const DashboardPromo = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: DashboardTheme.Colors.Neutrals.Bg }}>
            <Audio src={staticFile("energetic-bgm.mp3")} volume={0.5} />

            <Sequence from={0} durationInFrames={70}>
                <IntroScene />
            </Sequence>
            <Sequence from={60} durationInFrames={90}> {/* Overlap for speed */}
                <MetricsScene />
            </Sequence>
            <Sequence from={140} durationInFrames={110}>
                <ChartsScene />
            </Sequence>
            <Sequence from={240} durationInFrames={100}>
                <TableScene />
            </Sequence>
            <Sequence from={330} durationInFrames={120}>
                <OutroScene />
            </Sequence>
        </AbsoluteFill>
    );
};
