import {
    AbsoluteFill,
    interpolate,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    spring,
    Audio,
    staticFile,
    Img,
    Easing
} from 'remotion';
import { DashboardTheme } from './DashboardTheme';
import { loadFont } from '@remotion/google-fonts/Cairo';

const { fontFamily } = loadFont();

// ─── Easing helpers ──────────────────────────────────────────────────────────

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// ─── Animated Mouse Cursor ────────────────────────────────────────────────────
// Animates between a series of *waypoints* over time (keyframes per scene)

const SmartCursor = ({
    waypoints,       // [ { frame, x, y } ]
    clickFrames = [] // frames at which "click" animation happens
}: {
    waypoints: { frame: number; x: number; y: number }[];
    clickFrames?: number[];
}) => {
    const frame = useCurrentFrame();

    // Interpolate X & Y through all waypoints
    const waypointFrames = waypoints.map(w => w.frame);
    const waypointX = waypoints.map(w => w.x);
    const waypointY = waypoints.map(w => w.y);

    const x = interpolate(frame, waypointFrames, waypointX, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) });
    const y = interpolate(frame, waypointFrames, waypointY, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) });

    // Click scale pulse
    const nearClick = clickFrames.some(cf => frame >= cf && frame < cf + 12);
    const clickPulse = nearClick ? 0.75 : 1;
    const scale = interpolate(frame % 12, [0, 4, 12], [1, clickPulse, 1], { extrapolateRight: 'clamp' });

    return (
        <div style={{ position: 'absolute', left: x, top: y, zIndex: 9999, pointerEvents: 'none', transform: `scale(${scale})` }}>
            <svg width="34" height="40" viewBox="0 0 34 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L13 30L18 18L30 13L2 2Z" fill="white" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M18 18L28 38" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
            </svg>
            {nearClick && (
                <div style={{ position: 'absolute', top: -10, left: -10, width: 50, height: 50, borderRadius: '50%', border: `2px solid ${DashboardTheme.Colors.Brand.Primary}`, animation: 'none', opacity: interpolate(frame % 12, [0, 6, 12], [0, 0.8, 0]) }} />
            )}
        </div>
    );
};

// ─── Browser Frame Wrapper ────────────────────────────────────────────────────

const BrowserFrame = ({ children, opacity = 1, scale = 1, rotateX = 0, rotateY = 0, shadow = '0 40px 80px rgba(0,0,0,0.4)' }: any) => (
    <div style={{ transform: `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, opacity, borderRadius: 14, overflow: 'hidden', boxShadow: shadow, width: '100%', height: '100%' }}>
        {/* Chrome-style top bar */}
        <div style={{ height: 44, background: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
            <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#FFBD2E' }} />
            <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#28C840' }} />
            <div style={{ flex: 1, margin: '0 12px', height: 26, background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 11, color: '#64748b', fontFamily }}>
                🔒 monafsat.com/app/provider/...
            </div>
        </div>
        <div style={{ width: '100%', height: 'calc(100% - 44px)', position: 'relative', overflow: 'hidden' }}>
            {children}
        </div>
    </div>
);

// ─── Page Screenshot ─────────────────────────────────────────────────────────

const PageShot = ({ file, scrollY = 0 }: { file: string; scrollY?: number }) => (
    <Img
        src={staticFile(`monafsat/${file}.png`)}
        style={{ width: '100%', transform: `translateY(${scrollY}px)`, display: 'block' }}
    />
);

// ─── Label Chip ──────────────────────────────────────────────────────────────

const Label = ({ text, sub, frame, startAt }: { text: string; sub?: string; frame: number; startAt: number }) => {
    const s = spring({ frame: frame - startAt, fps: 30, config: { stiffness: 180, damping: 14 } });
    const y = interpolate(s, [0, 1], [30, 0]);
    const op = interpolate(frame - startAt, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
    return (
        <div style={{ position: 'absolute', bottom: 60, left: 80, opacity: op, transform: `translateY(${y}px)` }}>
            <div style={{ background: DashboardTheme.Colors.Brand.Primary, color: 'white', fontFamily, fontWeight: 800, fontSize: 48, padding: '14px 36px', borderRadius: 16, display: 'inline-block', letterSpacing: '-0.5px', boxShadow: '0 10px 30px rgba(91,181,199,0.4)' }}>{text}</div>
            {sub && <div style={{ marginTop: 10, fontFamily, fontSize: 22, color: 'white', fontWeight: 500, paddingLeft: 6, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>{sub}</div>}
        </div>
    );
};

// ─── Scene Transition Wipe ───────────────────────────────────────────────────

const Wipe = ({ frame, startAt, color = DashboardTheme.Colors.Brand.Primary }: { frame: number; startAt: number; color?: string }) => {
    const w = interpolate(frame, [startAt, startAt + 8], [0, 1920], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    return <div style={{ position: 'absolute', top: 0, left: 0, width: w, height: '100%', background: color, zIndex: 100 }} />;
};


// ════════════════════════════════════════════════════
//   SCENE 1 — INTRO  (0–60f, 2s)
// ════════════════════════════════════════════════════

const IntroScene = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const logoScale = spring({ frame, fps, config: { stiffness: 200, damping: 12 } });
    const taglineOp = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' });
    const taglineY = interpolate(frame, [20, 35], [20, 0], { extrapolateRight: 'clamp' });
    const subtitleOp = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${DashboardTheme.Colors.Brand.Dark} 0%, ${DashboardTheme.Colors.Brand.Primary} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ transform: `scale(${logoScale})`, textAlign: 'center' }}>
                <div style={{ fontFamily, fontSize: 130, fontWeight: 900, color: 'white', letterSpacing: '-3px', textShadow: '0 8px 30px rgba(0,0,0,0.25)' }}>
                    منافسات
                </div>
            </div>
            <div style={{ opacity: taglineOp, transform: `translateY(${taglineY}px)`, fontFamily, fontSize: 38, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginTop: 10 }}>
                Provider Dashboard  —  Full Walkthrough
            </div>
            <div style={{ opacity: subtitleOp, fontFamily, fontSize: 22, fontWeight: 400, color: 'rgba(255,255,255,0.65)', marginTop: 14 }}>
                Dashboard · Contacts · Conversations · Opportunities · Automation
            </div>
        </AbsoluteFill>
    );
};

// ════════════════════════════════════════════════════
//   SCENE 2 — DASHBOARD  (60–180f, 4s)
// ════════════════════════════════════════════════════

const DashboardScene = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const s = spring({ frame, fps, config: { stiffness: 120, damping: 18 } });
    const rotateX = interpolate(s, [0, 1], [25, 0]);
    const scaleVal = interpolate(s, [0, 1], [0.82, 1]);
    const op = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

    // Simulate scroll down mid-scene
    const scrollY = interpolate(frame, [50, 100, 110], [0, -600, -600], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    // Cursor: enters from top-right, hovers over a chart area
    const cWaypoints = [
        { frame: 0, x: 1800, y: 200 },
        { frame: 30, x: 1200, y: 500 },
        { frame: 55, x: 800, y: 550 },
        { frame: 80, x: 900, y: 400 },
        { frame: 100, x: 1600, y: 700 },
    ];

    return (
        <AbsoluteFill style={{ background: '#0f172a', perspective: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SmartCursor waypoints={cWaypoints} clickFrames={[55, 100]} />
            <div style={{ transform: `scale(${scaleVal}) rotateX(${rotateX}deg)`, opacity: op, width: '90%', height: '82%' }}>
                <BrowserFrame>
                    <PageShot file="dashboard" scrollY={scrollY} />
                </BrowserFrame>
            </div>
            <Label text="Dashboard" sub="Real-time business overview" frame={frame} startAt={5} />
        </AbsoluteFill>
    );
};

// ════════════════════════════════════════════════════
//   SCENE 3 — CONTACTS  (180–300f, 4s)
// ════════════════════════════════════════════════════

const ContactsScene = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const s = spring({ frame, fps, config: { stiffness: 160, damping: 16 } });
    const slideX = interpolate(s, [0, 1], [120, 0]);
    const op = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

    const scrollY = interpolate(frame, [40, 90, 100], [0, -400, -400], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    // Cursor: scans a list, clicks a contact
    const cWaypoints = [
        { frame: 0, x: 1900, y: 600 },
        { frame: 15, x: 400, y: 300 },
        { frame: 40, x: 400, y: 350 },
        { frame: 55, x: 400, y: 450 },
        { frame: 80, x: 400, y: 550 },
        { frame: 100, x: 800, y: 550 },
    ];

    return (
        <AbsoluteFill style={{ background: '#0f172a', perspective: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SmartCursor waypoints={cWaypoints} clickFrames={[40, 80]} />
            <div style={{ transform: `translateX(${slideX}px)`, opacity: op, width: '90%', height: '82%' }}>
                <BrowserFrame>
                    <PageShot file="contacts" scrollY={scrollY} />
                </BrowserFrame>
            </div>
            <Label text="Contacts" sub="Manage all your client relationships" frame={frame} startAt={5} />
        </AbsoluteFill>
    );
};

// ════════════════════════════════════════════════════
//   SCENE 4 — CONVERSATIONS  (300–420f, 4s)
// ════════════════════════════════════════════════════

const ConversationsScene = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const s = spring({ frame, fps, config: { stiffness: 160, damping: 16 } });
    const rotateY = interpolate(s, [0, 1], [-20, 0]);
    const scaleVal = interpolate(s, [0, 1], [0.88, 1]);
    const op = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

    const scrollY = interpolate(frame, [45, 95], [0, -500], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    // Cursor: dramatic crossing motion, clicking a lead row
    const cWaypoints = [
        { frame: 0, x: 0, y: 300 },
        { frame: 20, x: 1000, y: 400 },
        { frame: 40, x: 700, y: 500 },
        { frame: 60, x: 700, y: 600 },
        { frame: 90, x: 1400, y: 300 },
    ];

    return (
        <AbsoluteFill style={{ background: '#0f172a', perspective: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SmartCursor waypoints={cWaypoints} clickFrames={[40, 60]} />
            <div style={{ transform: `scale(${scaleVal}) rotateY(${rotateY}deg)`, opacity: op, width: '90%', height: '82%' }}>
                <BrowserFrame>
                    <PageShot file="conversations" scrollY={scrollY} />
                </BrowserFrame>
            </div>
            <Label text="Conversations" sub="Engage leads with AI Agents" frame={frame} startAt={5} />
        </AbsoluteFill>
    );
};

// ════════════════════════════════════════════════════
//   SCENE 5 — OPPORTUNITIES  (420–540f, 4s)
// ════════════════════════════════════════════════════

const OpportunitiesScene = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const s = spring({ frame, fps, config: { stiffness: 140, damping: 14 } });
    const y = interpolate(s, [0, 1], [-80, 0]);
    const op = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

    const scrollY = interpolate(frame, [40, 95], [0, -450], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    const cWaypoints = [
        { frame: 0, x: 1600, y: 100 },
        { frame: 25, x: 900, y: 400 },
        { frame: 50, x: 600, y: 500 },
        { frame: 70, x: 1000, y: 600 },
        { frame: 100, x: 1600, y: 600 },
    ];

    return (
        <AbsoluteFill style={{ background: '#0f172a', perspective: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SmartCursor waypoints={cWaypoints} clickFrames={[50, 70]} />
            <div style={{ transform: `translateY(${y}px)`, opacity: op, width: '90%', height: '82%' }}>
                <BrowserFrame>
                    <PageShot file="opportunities" scrollY={scrollY} />
                </BrowserFrame>
            </div>
            <Label text="Opportunities" sub="Close more deals, faster" frame={frame} startAt={5} />
        </AbsoluteFill>
    );
};

// ════════════════════════════════════════════════════
//   SCENE 6 — AUTOMATION  (540–660f, 4s)
// ════════════════════════════════════════════════════

const AutomationScene = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const s = spring({ frame, fps, config: { stiffness: 150, damping: 15 } });
    const rotateX = interpolate(s, [0, 1], [-18, 0]);
    const scaleVal = interpolate(s, [0, 1], [0.86, 1]);
    const op = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

    const scrollY = interpolate(frame, [40, 95], [0, -400], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    const cWaypoints = [
        { frame: 0, x: 960, y: 0 },
        { frame: 20, x: 960, y: 540 },
        { frame: 45, x: 600, y: 450 },
        { frame: 65, x: 1300, y: 450 },
        { frame: 90, x: 960, y: 700 },
    ];

    return (
        <AbsoluteFill style={{ background: '#0f172a', perspective: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SmartCursor waypoints={cWaypoints} clickFrames={[45, 65]} />
            <div style={{ transform: `scale(${scaleVal}) rotateX(${rotateX}deg)`, opacity: op, width: '90%', height: '82%' }}>
                <BrowserFrame>
                    <PageShot file="automation" scrollY={scrollY} />
                </BrowserFrame>
            </div>
            <Label text="Automation" sub="Visual workflow builder" frame={frame} startAt={5} />
        </AbsoluteFill>
    );
};

// ════════════════════════════════════════════════════
//   SCENE 7 — OUTRO  (660–750f, 3s)
// ════════════════════════════════════════════════════

const OutroScene = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const s = spring({ frame, fps, config: { stiffness: 90, damping: 12 } });
    const op = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${DashboardTheme.Colors.Brand.Dark} 0%, ${DashboardTheme.Colors.Brand.Primary} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 30 }}>
            <div style={{ transform: `scale(${s})`, opacity: op, textAlign: 'center' }}>
                <div style={{ fontFamily, fontSize: 90, fontWeight: 900, color: 'white', textShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                    One Platform.
                </div>
                <div style={{ fontFamily, fontSize: 90, fontWeight: 900, color: 'rgba(255,255,255,0.85)' }}>
                    Everything You Need.
                </div>
                <div style={{ marginTop: 40, display: 'inline-block', background: 'white', color: DashboardTheme.Colors.Brand.Primary, fontFamily, fontWeight: 800, fontSize: 36, padding: '18px 52px', borderRadius: 9999, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
                    monafsat.com
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ════════════════════════════════════════════════════
//   ROOT  (total: 750 frames = 25 seconds)
// ════════════════════════════════════════════════════

export const MonafsatPromo = () => {
    return (
        <AbsoluteFill>
            <Audio src={staticFile("energetic-bgm.mp3")} volume={0.45} />

            {/* Intro  0 – 59 */}
            <Sequence from={0} durationInFrames={60}>
                <IntroScene />
            </Sequence>

            {/* Dashboard  60 – 179 */}
            <Sequence from={60} durationInFrames={120}>
                <DashboardScene />
            </Sequence>

            {/* Contacts  180 – 299 */}
            <Sequence from={180} durationInFrames={120}>
                <ContactsScene />
            </Sequence>

            {/* Conversations  300 – 419 */}
            <Sequence from={300} durationInFrames={120}>
                <ConversationsScene />
            </Sequence>

            {/* Opportunities  420 – 539 */}
            <Sequence from={420} durationInFrames={120}>
                <OpportunitiesScene />
            </Sequence>

            {/* Automation  540 – 659 */}
            <Sequence from={540} durationInFrames={120}>
                <AutomationScene />
            </Sequence>

            {/* Outro  660 – 749 */}
            <Sequence from={660} durationInFrames={90}>
                <OutroScene />
            </Sequence>
        </AbsoluteFill>
    );
};
