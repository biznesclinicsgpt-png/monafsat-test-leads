/**
 * MonafsatSell.tsx
 * فيديو مبيعات منافسات — ٢٥ ثانية
 * 750 frames @ 30fps = 25s  |  1920×1080
 *
 * توزيع المشاهد:
 *  مشهد ١ — الافتتاحية       0–120    (4 ثوانٍ)
 *  مشهد ٢ — الرغبة والوعد   120–300   (6 ثوانٍ)
 *  مشهد ٣ — قوة المنصة      300–480   (6 ثوانٍ)
 *  مشهد ٤ — مزايا المنصة    480–630   (5 ثوانٍ)
 *  مشهد ٥ — الختام           630–750   (4 ثوانٍ)
 */

import {
    AbsoluteFill,
    Audio,
    interpolate,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    spring,
    Img,
    staticFile,
    Easing,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Cairo';

const { fontFamily } = loadFont();

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
    primary: '#5BB5C7',
    primaryDark: '#3C8DA0',
    emerald: '#10B981',
    gold: '#C5A065',
    dark: '#0A0A0F',
    navy: '#0F172A',
    card: '#1E293B',
    border: '#334155',
    muted: '#94A3B8',
    white: '#FFFFFF',
};

const appleEase = Easing.bezier(0.16, 1, 0.3, 1);
const sweepEase  = Easing.bezier(0.0, 0.0, 0.2, 1);

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 1 — افتتاحية العلامة التجارية  (0–120f = 4 ثوانٍ)
// ═══════════════════════════════════════════════════════════════════════════════

const SceneBrandOpening = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // اسم النظام — حركة نابضة
    const nameSpring  = spring({ frame, fps, config: { stiffness: 120, damping: 18 } });
    const nameScale   = interpolate(nameSpring, [0, 1], [0.72, 1]);
    const nameOpacity = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: 'clamp' });

    // الشارة — تنزل من الأعلى
    const badgeOp = interpolate(frame, [28, 50], [0, 1], { extrapolateRight: 'clamp' });
    const badgeY  = interpolate(frame, [28, 50], [-28, 0], { extrapolateRight: 'clamp', easing: appleEase });

    // الشعار الفرعي
    const tagOp = interpolate(frame, [54, 76], [0, 1], { extrapolateRight: 'clamp' });
    const tagY  = interpolate(frame, [54, 76], [26, 0], { extrapolateRight: 'clamp', easing: appleEase });

    // توهج
    const glowScale = interpolate(frame, [0, 120], [0.8, 1.2], { easing: Easing.ease });
    const glowOp    = interpolate(frame, [0, 120], [0.18, 0.42], { easing: Easing.ease });

    // خروج ناعم في آخر 18 إطار
    const exitOp = interpolate(frame, [102, 120], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    // نقطة نبض
    const dotPulse = 1 + 0.35 * Math.sin(frame / 5.5);

    return (
        <AbsoluteFill
            style={{
                background: `radial-gradient(ellipse at 50% 58%, #0c2233 0%, ${T.dark} 68%)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: exitOp,
            }}
        >
            {/* توهج خلفي */}
            <div style={{
                position: 'absolute', width: 780, height: 780, borderRadius: '50%',
                background: `radial-gradient(circle, ${T.primary}1e 0%, transparent 70%)`,
                transform: `scale(${glowScale})`, opacity: glowOp, pointerEvents: 'none',
            }} />

            {/* شارة */}
            <div style={{
                opacity: badgeOp, transform: `translateY(${badgeY}px)`,
                marginBottom: 56, display: 'flex', alignItems: 'center', gap: 12,
                background: `${T.emerald}15`, border: `1px solid ${T.emerald}30`,
                borderRadius: 9999, padding: '12px 34px',
            }}>
                <div style={{
                    width: 10, height: 10, borderRadius: '50%', background: T.emerald,
                    transform: `scale(${dotPulse})`, opacity: 0.65 + 0.35 * Math.sin(frame / 5.5),
                }} />
                <span style={{ fontFamily, fontSize: 20, fontWeight: 800, letterSpacing: '0.12em', color: T.emerald }}>
                    محرك الإيرادات — الجيل الثاني
                </span>
            </div>

            {/* الاسم الرئيسي */}
            <div style={{
                transform: `scale(${nameScale})`, opacity: nameOpacity,
                marginBottom: 48, textAlign: 'center', direction: 'rtl',
            }}>
                <div style={{
                    fontFamily, fontSize: 100, fontWeight: 900,
                    color: T.white, letterSpacing: '-2px', lineHeight: 1.05,
                    textShadow: `0 6px 52px ${T.primary}55`,
                }}>
                    🥷 نظام النينجا العربي
                </div>
            </div>

            {/* شعار فرعي */}
            <div style={{
                opacity: tagOp, transform: `translateY(${tagY}px)`,
                fontFamily, fontSize: 28, fontWeight: 500, color: T.muted, letterSpacing: '0.05em',
            }}>
                منصة النمو الذكية للمزودين
            </div>

            {/* خط أفقي يمتد */}
            <div style={{
                position: 'absolute', bottom: 110,
                width: `${interpolate(frame, [62, 92], [0, 340], { extrapolateRight: 'clamp' })}px`,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${T.primary}, transparent)`,
            }} />
        </AbsoluteFill>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 2 — الرغبة والوعد  (120–300f = 6 ثوانٍ  |  180 إطار)
// ═══════════════════════════════════════════════════════════════════════════════

const DesireWord = ({
    text, accentText, startAt, baseColor = T.white,
}: {
    text: string; accentText?: string; startAt: number; baseColor?: string;
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const s      = spring({ frame: frame - startAt, fps, config: { stiffness: 150, damping: 24 } });
    const opacity = interpolate(frame - startAt, [0, 16], [0, 1], { extrapolateRight: 'clamp' });
    const y      = interpolate(s, [0, 1], [80, 0]);
    const scaleV = interpolate(s, [0, 1], [0.84, 1]);

    return (
        <div style={{ opacity, transform: `translateY(${y}px) scale(${scaleV})`, display: 'flex', alignItems: 'baseline', gap: 22, lineHeight: 1.05 }}>
            <span style={{ fontFamily, fontSize: 110, fontWeight: 900, color: baseColor, letterSpacing: '-2px', textShadow: `0 4px 48px ${T.primary}33` }}>
                {text}
            </span>
            {accentText && (
                <span style={{
                    fontFamily, fontSize: 110, fontWeight: 900,
                    background: `linear-gradient(135deg, ${T.primary} 0%, ${T.emerald} 100%)`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    letterSpacing: '-2px', paddingBottom: 4,
                }}>
                    {accentText}
                </span>
            )}
        </div>
    );
};

const SceneDesire = () => {
    const frame = useCurrentFrame();

    // خط مسح يعبر الشاشة بالكامل
    const sweepX = interpolate(frame, [0, 180], [-220, 2140], { easing: sweepEase });

    const containerOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const exitOp      = interpolate(frame, [158, 178], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{
            background: T.dark, display: 'flex', flexDirection: 'column',
            alignItems: 'flex-start', justifyContent: 'center',
            paddingRight: 170, paddingLeft: 100, direction: 'rtl',
            opacity: Math.min(containerOp, exitOp),
        }}>
            {/* خط مسح */}
            <div style={{
                position: 'absolute', top: '50%', left: sweepX, width: 220, height: 2,
                background: `linear-gradient(90deg, transparent, ${T.primary}, transparent)`,
                opacity: 0.5, pointerEvents: 'none',
            }} />

            {/* الكلمات — مفصولة بـ 45 إطار لكل واحدة */}
            <DesireWord text="صفقات أكثر."                   startAt={0}  />
            <DesireWord text="جهد"        accentText="أقل." startAt={45} />
            <DesireWord text="مضمون."                        startAt={90} baseColor={T.primary} />

            {/* نص داعم يظهر بعد اكتمال الكلمات */}
            <div style={{
                opacity: interpolate(frame, [118, 142], [0, 1], { extrapolateRight: 'clamp' }),
                transform: `translateY(${interpolate(frame, [118, 142], [24, 0], { extrapolateRight: 'clamp' })}px)`,
                marginTop: 46, fontFamily, fontSize: 30, fontWeight: 400,
                color: T.muted, maxWidth: 820, lineHeight: 1.65, direction: 'rtl',
            }}>
                يحول البيانات الخام إلى فرص حقيقية باستخدام وكلاء الذكاء الاصطناعي
            </div>

            {/* شريط عمودي */}
            <div style={{
                position: 'absolute', right: 106, top: '13%',
                height: `${interpolate(frame, [6, 75], [0, 74], { extrapolateRight: 'clamp' })}%`,
                width: 4, background: `linear-gradient(180deg, ${T.primary}, ${T.emerald})`, borderRadius: 4,
            }} />
        </AbsoluteFill>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 3 — قوة المنصة  (300–480f = 6 ثوانٍ  |  180 إطار)
// ═══════════════════════════════════════════════════════════════════════════════

const StatCard = ({
    value, label, icon, color, startAt,
}: {
    value: string; label: string; icon: string; color: string; startAt: number;
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const s        = spring({ frame: frame - startAt, fps, config: { stiffness: 130, damping: 22 } });
    const opacity  = interpolate(frame - startAt, [0, 14], [0, 1], { extrapolateRight: 'clamp' });
    const y        = interpolate(s, [0, 1], [42, 0]);
    const scaleCard = interpolate(s, [0, 1], [0.86, 1]);

    return (
        <div style={{
            opacity, transform: `translateY(${y}px) scale(${scaleCard})`,
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 22, padding: '36px 44px',
            display: 'flex', flexDirection: 'column', gap: 14,
            width: 268, boxShadow: `0 20px 60px rgba(0,0,0,0.5), inset 0 0 0 1px ${color}1e`,
            direction: 'rtl',
        }}>
            <div style={{ fontSize: 40 }}>{icon}</div>
            <div style={{ fontFamily, fontSize: 62, fontWeight: 900, color, lineHeight: 1, letterSpacing: '-1px' }}>
                {value}
            </div>
            <div style={{ fontFamily, fontSize: 19, color: T.muted, fontWeight: 500, lineHeight: 1.4 }}>
                {label}
            </div>
        </div>
    );
};

const ScenePlatformPower = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // لوحة التحكم — دخول ثلاثي الأبعاد بطيء
    const dashSpring = spring({ frame, fps, config: { stiffness: 65, damping: 20 } });
    const dashScale  = interpolate(dashSpring, [0, 1], [0.78, 1]);
    const dashRotX   = interpolate(dashSpring, [0, 1], [28, 0]);
    const dashOp     = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: 'clamp' });

    // عنوان المشهد
    const headOp = interpolate(frame, [18, 42], [0, 1], { extrapolateRight: 'clamp' });
    const headY  = interpolate(frame, [18, 42], [28, 0], { extrapolateRight: 'clamp', easing: appleEase });

    // خروج ناعم
    const exitOp = interpolate(frame, [160, 180], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill style={{
            background: `radial-gradient(ellipse at 50% 0%, #0c1f2e 0%, ${T.dark} 72%)`,
            opacity: exitOp,
        }}>
            {/* عنوان */}
            <div style={{
                position: 'absolute', top: 58, left: 0, right: 0,
                textAlign: 'center', opacity: headOp, transform: `translateY(${headY}px)`,
            }}>
                <span style={{
                    fontFamily, fontSize: 23, fontWeight: 700,
                    color: T.primary, letterSpacing: '0.14em', direction: 'rtl',
                }}>
                    الآلة التي تصنع النمو
                </span>
            </div>

            {/* لقطة لوحة التحكم */}
            <div style={{
                position: 'absolute', top: 112, left: 80, right: 80, height: 455,
                transform: `perspective(1400px) rotateX(${dashRotX}deg) scale(${dashScale})`,
                opacity: dashOp, borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 40px 120px rgba(0,0,0,0.78), 0 0 0 1px rgba(255,255,255,0.05)',
            }}>
                {/* شريط متصفح */}
                <div style={{
                    height: 38, background: '#1e293b', display: 'flex',
                    alignItems: 'center', gap: 8, padding: '0 16px',
                    borderBottom: `1px solid ${T.border}`, flexShrink: 0,
                }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
                    <div style={{
                        flex: 1, margin: '0 12px', height: 22, background: T.navy,
                        borderRadius: 6, border: `1px solid ${T.border}`,
                        display: 'flex', alignItems: 'center', paddingLeft: 10,
                        fontFamily, fontSize: 11, color: T.muted,
                    }}>
                        🔒 monafsat.com/app/provider/dashboard
                    </div>
                </div>
                <Img
                    src={staticFile('monafsat/dashboard.png')}
                    style={{ width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'top' }}
                />
            </div>

            {/* بطاقات الإحصائيات — مفصولة بـ 28 إطار */}
            <div style={{
                position: 'absolute', bottom: 52, left: 0, right: 0,
                display: 'flex', justifyContent: 'center', gap: 30, direction: 'rtl',
            }}>
                <StatCard value="+١٢ ألف" label="رسالة واتساب / شهرياً"    icon="💬" color={T.emerald}  startAt={45} />
                <StatCard value="٧٢٠٠"    label="اتصال مباشر / شهرياً"     icon="📞" color="#f43f5e"    startAt={73} />
                <StatCard value="+١٠ ألف" label="بريد إلكتروني / شهرياً"   icon="✉️" color="#6366f1"    startAt={101} />
                <StatCard value="+١٤ ألف" label="سيناريو ذكاء اصطناعي"    icon="🤖" color={T.primary}  startAt={129} />
            </div>
        </AbsoluteFill>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 4 — مزايا المنصة  (480–630f = 5 ثوانٍ  |  150 إطار)
// ═══════════════════════════════════════════════════════════════════════════════

const FeatureCard = ({
    icon, title, sub, accent, startAt,
}: {
    icon: string; title: string; sub: string; accent: string; startAt: number;
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const s        = spring({ frame: frame - startAt, fps, config: { stiffness: 130, damping: 24 } });
    const opacity  = interpolate(frame - startAt, [0, 16], [0, 1], { extrapolateRight: 'clamp' });
    const y        = interpolate(s, [0, 1], [70, 0]);
    const scaleCard = interpolate(s, [0, 1], [0.84, 1]);

    return (
        <div style={{
            opacity, transform: `translateY(${y}px) scale(${scaleCard})`,
            background: `linear-gradient(145deg, ${T.card} 0%, #121e2c 100%)`,
            border: `1px solid ${accent}44`, borderRadius: 26,
            padding: '46px 50px', flex: 1, maxWidth: 510,
            display: 'flex', flexDirection: 'column', gap: 22,
            boxShadow: `0 26px 80px rgba(0,0,0,0.58), 0 0 60px ${accent}16`,
            direction: 'rtl',
        }}>
            <div style={{
                width: 74, height: 74, borderRadius: 20,
                background: `${accent}18`, border: `1px solid ${accent}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38,
            }}>
                {icon}
            </div>
            <div style={{ fontFamily, fontSize: 38, fontWeight: 800, color: T.white, lineHeight: 1.2 }}>
                {title}
            </div>
            <div style={{ fontFamily, fontSize: 23, color: T.muted, lineHeight: 1.6, fontWeight: 400 }}>
                {sub}
            </div>
            {/* شريط لهجة يمتد */}
            <div style={{
                marginTop: 'auto', height: 3, borderRadius: 3,
                background: `linear-gradient(90deg, ${accent}, transparent)`,
                width: `${interpolate(frame - startAt, [28, 65], [0, 100], { extrapolateRight: 'clamp' })}%`,
            }} />
        </div>
    );
};

const SceneFeatureStack = () => {
    const frame = useCurrentFrame();

    const headOp = interpolate(frame, [0, 26], [0, 1], { extrapolateRight: 'clamp' });
    const headY  = interpolate(frame, [0, 26], [28, 0], { extrapolateRight: 'clamp', easing: appleEase });

    // خروج
    const exitOp = interpolate(frame, [130, 150], [1, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill style={{
            background: T.dark, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 54, padding: '0 90px', direction: 'rtl',
            opacity: exitOp,
        }}>
            {/* عنوان */}
            <div style={{ opacity: headOp, transform: `translateY(${headY}px)`, textAlign: 'center' }}>
                <div style={{
                    fontFamily, fontSize: 23, fontWeight: 700,
                    color: T.primary, letterSpacing: '0.12em', marginBottom: 20,
                }}>
                    منصة واحدة — كل القنوات
                </div>
                <div style={{
                    fontFamily, fontSize: 68, fontWeight: 900,
                    color: T.white, letterSpacing: '-2px', lineHeight: 1.05,
                }}>
                    مبنية لإغلاق الصفقات.
                </div>
            </div>

            {/* البطاقات — مفصولة بـ 32 إطار */}
            <div style={{ display: 'flex', gap: 34, width: '100%', justifyContent: 'center' }}>
                <FeatureCard
                    icon="🤖" title="محادثات الذكاء الاصطناعي"
                    sub="وكلاء آليون يتحدثون مع عملائك على مدار الساعة"
                    accent={T.primary} startAt={22}
                />
                <FeatureCard
                    icon="🎯" title="فرص مؤهلة"
                    sub="١٥ فرصة شهرياً مضمونة — أو نواصل مجاناً"
                    accent={T.emerald} startAt={54}
                />
                <FeatureCard
                    icon="📊" title="لوحة تحكم مباشرة"
                    sub="تتبع كل اتصال، رسالة، وفرصة في لوحة واحدة"
                    accent={T.gold} startAt={86}
                />
            </div>
        </AbsoluteFill>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 5 — الختام  (630–750f = 4 ثوانٍ  |  120 إطار)
// ═══════════════════════════════════════════════════════════════════════════════

const SceneBrandClose = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const containerOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });

    // الاسم الرئيسي
    const titleS     = spring({ frame: frame - 8, fps, config: { stiffness: 110, damping: 20 } });
    const titleOp    = interpolate(frame, [8, 28], [0, 1], { extrapolateRight: 'clamp' });
    const titleY     = interpolate(titleS, [0, 1], [60, 0]);
    const titleScale = interpolate(titleS, [0, 1], [0.86, 1]);

    // خط فاصل
    const lineW = interpolate(frame, [34, 68], [0, 720], { extrapolateRight: 'clamp', easing: appleEase });

    // التعريف
    const defOp = interpolate(frame, [50, 76], [0, 1], { extrapolateRight: 'clamp' });
    const defY  = interpolate(frame, [50, 76], [36, 0], { extrapolateRight: 'clamp', easing: appleEase });

    // توهج
    const glowOp = interpolate(frame, [0, 50], [0, 0.55], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{
            background: `linear-gradient(155deg, #081e2a 0%, ${T.navy} 50%, ${T.dark} 100%)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', opacity: containerOp, direction: 'rtl', gap: 44,
        }}>
            {/* شبكة خلفية */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `
                    linear-gradient(${T.primary}07 1px, transparent 1px),
                    linear-gradient(90deg, ${T.primary}07 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px',
                maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
                pointerEvents: 'none',
            }} />

            {/* توهج مركزي */}
            <div style={{
                position: 'absolute', width: 1000, height: 1000, borderRadius: '50%',
                background: `radial-gradient(circle, ${T.primary}18 0%, transparent 65%)`,
                opacity: glowOp, pointerEvents: 'none',
            }} />

            {/* العنوان */}
            <div style={{
                opacity: titleOp, transform: `translateY(${titleY}px) scale(${titleScale})`,
                textAlign: 'center',
            }}>
                <div style={{ fontSize: 84, lineHeight: 1, marginBottom: 18 }}>🥷</div>
                <div style={{
                    fontFamily, fontSize: 106, fontWeight: 900,
                    letterSpacing: '-3px', lineHeight: 1.05,
                    background: `linear-gradient(135deg, ${T.white} 30%, ${T.primary} 100%)`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    filter: `drop-shadow(0 4px 42px ${T.primary}44)`,
                }}>
                    نظام النينجا العربي
                </div>
            </div>

            {/* خط فاصل */}
            <div style={{
                width: lineW, height: 2, borderRadius: 2,
                background: `linear-gradient(90deg, transparent, ${T.primary}, transparent)`,
            }} />

            {/* التعريف الكامل */}
            <div style={{
                opacity: defOp, transform: `translateY(${defY}px)`,
                textAlign: 'center', maxWidth: 1120, padding: '0 80px',
                display: 'flex', flexDirection: 'column', gap: 12,
            }}>
                <div style={{
                    fontFamily, fontSize: 40, fontWeight: 600,
                    color: T.muted, lineHeight: 1.7, direction: 'rtl',
                }}>
                    اول نظام في الوطن العربي لتوفير الفرص B2B
                </div>
                <div style={{
                    fontFamily, fontSize: 40, fontWeight: 600,
                    color: T.muted, lineHeight: 1.7, direction: 'rtl',
                }}>
                    بشكل{' '}
                    <span style={{ color: T.primary, fontWeight: 900 }}>ذكي</span>،{' '}
                    <span style={{ color: T.emerald, fontWeight: 900 }}>دقيق</span>{' '}
                    و{' '}
                    <span style={{
                        background: `linear-gradient(90deg, ${T.primary}, ${T.emerald})`,
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        fontWeight: 900,
                    }}>
                        الأسرع قبل المنافسين.
                    </span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT  (750 frames = 25 ثانية @ 30fps)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── مكوّن صوت الانتقال (Whoosh) ──────────────────────────────────────────
const SceneWhoosh = ({ volume = 0.72 }: { volume?: number }) => (
    <Audio src={staticFile('swoosh.mp3')} volume={volume} />
);

export const MonafsatSell = () => {
    return (
        <AbsoluteFill style={{ background: T.dark }}>

            {/* ══════════════════════════════════════════
                الطبقة الصوتية
            ══════════════════════════════════════════ */}

            {/* ١. موسيقى الخلفية — Evolution (165s)
                منحنى ديناميكي: الموسيقى تخفت عند كل مؤثر وترتفع بينها
                أقصى مستوى: 0.44 — يعطي مساحة للمؤثرات الصوتية */}
            <Audio
                src={staticFile('ninja-bgm.mp3')}
                startFrom={360}
                volume={(f) =>
                    interpolate(
                        f,
                        // إطارات التحكم (مرتبة تصاعدياً)
                        [  0,   25,  108,  125,  163,  175,  208,  220,  285,  310,  343,  450,  468,  480,  500,  582,  618,  640,  715,  750],
                        // مستويات الصوت المقابلة
                        [  0, 0.30, 0.22, 0.42, 0.22, 0.42, 0.18, 0.42, 0.25, 0.42, 0.36, 0.44, 0.25, 0.40, 0.34, 0.44, 0.28, 0.36, 0.36,    0],
                        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    )
                }
            />

            {/* ٢. Impact — في لحظة ظهور الاسم (إطار 0) */}
            <Sequence from={0} durationInFrames={36}>
                <Audio src={staticFile('impact.mp3')} volume={0.80} />
            </Sequence>

            {/* ٣. Whoosh — قبل كل انتقال بـ 10 إطارات */}
            <Sequence from={110} durationInFrames={21}>
                <SceneWhoosh />
            </Sequence>
            <Sequence from={290} durationInFrames={21}>
                <SceneWhoosh />
            </Sequence>
            <Sequence from={470} durationInFrames={21}>
                <SceneWhoosh />
            </Sequence>
            <Sequence from={620} durationInFrames={21}>
                <SceneWhoosh />
            </Sequence>

            {/* ══════════════════════════════════════════
                الأحداث الصوتية الدقيقة — مزامنة مع كل Animation
            ══════════════════════════════════════════ */}

            {/* ─── مشهد ١: الافتتاحية ─── */}
            {/* إطار 28 — الشارة "محرك الإيرادات" تنزل */}
            <Sequence from={28} durationInFrames={9}>
                <Audio src={staticFile('ui-pop.mp3')} volume={0.50} />
            </Sequence>
            {/* إطار 62 — الخط الأفقي يمتد */}
            <Sequence from={62} durationInFrames={14}>
                <Audio src={staticFile('line-draw.mp3')} volume={0.28} />
            </Sequence>

            {/* ─── مشهد ٢: الرغبة والوعد ─── */}
            {/* إطار 120 — كلمة "صفقات أكثر" تهبط */}
            <Sequence from={120} durationInFrames={17}>
                <Audio src={staticFile('word-hit.mp3')} volume={0.58} />
            </Sequence>
            {/* إطار 165 — كلمة "جهد أقل" تهبط */}
            <Sequence from={165} durationInFrames={17}>
                <Audio src={staticFile('word-hit.mp3')} volume={0.55} />
            </Sequence>
            {/* إطار 210 — كلمة "مضمون" تهبط (اللحظة الأقوى) */}
            <Sequence from={210} durationInFrames={17}>
                <Audio src={staticFile('word-hit.mp3')} volume={0.68} />
            </Sequence>

            {/* ─── مشهد ٣: قوة المنصة ─── */}
            {/* إطار 300 — لوحة التحكم تدور ثلاثياً */}
            <Sequence from={300} durationInFrames={23}>
                <Audio src={staticFile('screen-reveal.mp3')} volume={0.52} />
            </Sequence>
            {/* إطارات 345/373/401/429 — بطاقات الإحصاء تظهر */}
            <Sequence from={345} durationInFrames={9}>
                <Audio src={staticFile('ui-pop.mp3')} volume={0.46} />
            </Sequence>
            <Sequence from={373} durationInFrames={9}>
                <Audio src={staticFile('ui-pop.mp3')} volume={0.46} />
            </Sequence>
            <Sequence from={401} durationInFrames={9}>
                <Audio src={staticFile('ui-pop.mp3')} volume={0.46} />
            </Sequence>
            <Sequence from={429} durationInFrames={9}>
                <Audio src={staticFile('ui-pop.mp3')} volume={0.52} />
            </Sequence>

            {/* ─── مشهد ٤: مزايا المنصة ─── */}
            {/* إطارات 502/534/566 — البطاقات تهبط */}
            <Sequence from={502} durationInFrames={13}>
                <Audio src={staticFile('card-drop.mp3')} volume={0.55} />
            </Sequence>
            <Sequence from={534} durationInFrames={13}>
                <Audio src={staticFile('card-drop.mp3')} volume={0.55} />
            </Sequence>
            <Sequence from={566} durationInFrames={13}>
                <Audio src={staticFile('card-drop.mp3')} volume={0.58} />
            </Sequence>

            {/* ─── مشهد ٥: الختام ─── */}
            {/* إطار 638 — الاسم يعود بنعومة */}
            <Sequence from={638} durationInFrames={9}>
                <Audio src={staticFile('ui-pop.mp3')} volume={0.38} />
            </Sequence>
            {/* إطار 664 — الخط الفاصل يمتد */}
            <Sequence from={664} durationInFrames={14}>
                <Audio src={staticFile('line-draw.mp3')} volume={0.26} />
            </Sequence>

            {/* مشهد ١ — الافتتاحية       0–120    (4 ثوانٍ) */}
            <Sequence from={0} durationInFrames={120}>
                <SceneBrandOpening />
            </Sequence>

            {/* مشهد ٢ — الرغبة والوعد   120–300   (6 ثوانٍ) */}
            <Sequence from={120} durationInFrames={180}>
                <SceneDesire />
            </Sequence>

            {/* مشهد ٣ — قوة المنصة      300–480   (6 ثوانٍ) */}
            <Sequence from={300} durationInFrames={180}>
                <ScenePlatformPower />
            </Sequence>

            {/* مشهد ٤ — مزايا المنصة    480–630   (5 ثوانٍ) */}
            <Sequence from={480} durationInFrames={150}>
                <SceneFeatureStack />
            </Sequence>

            {/* مشهد ٥ — الختام           630–750   (4 ثوانٍ) */}
            <Sequence from={630} durationInFrames={120}>
                <SceneBrandClose />
            </Sequence>
        </AbsoluteFill>
    );
};
