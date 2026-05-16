import {
    AbsoluteFill,
    interpolate,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';
import { Theme } from './theme';
import { loadFont } from '@remotion/google-fonts/Cairo';

const { fontFamily } = loadFont();

const Title = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 30], [0, 1], {
        extrapolateRight: 'clamp',
    });
    const scale = interpolate(frame, [0, 30], [0.8, 1], {
        extrapolateRight: 'clamp',
    });

    return (
        <div
            style={{
                fontFamily,
                color: Theme.Colors.Brand.DEFAULT,
                fontSize: 120,
                fontWeight: 'bold',
                textAlign: 'center',
                opacity,
                transform: `scale(${scale})`,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            BiznesClinics Design System
        </div>
    );
};

const ColorPalette = () => {
    const frame = useCurrentFrame();
    // const { fps } = useVideoConfig();

    const colors = [
        { name: 'Brand', value: Theme.Colors.Brand.DEFAULT },
        { name: 'Gold', value: Theme.Colors.Gold.DEFAULT },
        { name: 'Ninja', value: Theme.Colors.Ninja.Bg },
    ];

    return (
        <AbsoluteFill
            style={{
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 40,
                flexDirection: 'row',
            }}
        >
            {colors.map((color, index) => {
                const delay = index * 10;
                const scale = interpolate(frame, [delay, delay + 20], [0, 1], {
                    extrapolateRight: 'clamp',
                });
                const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
                    extrapolateRight: 'clamp',
                });

                return (
                    <div
                        key={color.name}
                        style={{
                            transform: `scale(${scale})`,
                            opacity,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 20,
                        }}
                    >
                        <div
                            style={{
                                width: 200,
                                height: 200,
                                backgroundColor: color.value,
                                borderRadius: Theme.Layout.BorderRadius.xl,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            }}
                        />
                        <div
                            style={{
                                fontFamily,
                                fontSize: 32,
                                fontWeight: 'bold',
                                color: Theme.Colors.Text.Primary,
                            }}
                        >
                            {color.name}
                        </div>
                        <div
                            style={{
                                fontFamily,
                                fontSize: 24,
                                color: Theme.Colors.Text.Secondary,
                            }}
                        >
                            {color.value}
                        </div>
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};

const TypographyShowcase = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const translateY = interpolate(frame, [0, 20], [50, 0], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
            <div style={{ opacity, transform: `translateY(${translateY}px)`, textAlign: 'center' }}>
                <h1 style={{ fontFamily, fontSize: 80, fontWeight: Theme.Typography.Weights.Black, color: Theme.Colors.Text.Primary, margin: 0 }}>
                    Cairo Font
                </h1>
                <div style={{ display: 'flex', gap: 60, marginTop: 60 }}>
                    {[
                        { weight: 'Regular', value: 400 },
                        { weight: 'Bold', value: 700 },
                        { weight: 'Black', value: 900 },
                    ].map((w, i) => (
                        <div key={w.weight} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ fontFamily, fontSize: 60, fontWeight: w.value, color: Theme.Colors.Brand.DEFAULT }}>
                                Aa
                            </div>
                            <div style={{ fontFamily, fontSize: 24, color: Theme.Colors.Text.Secondary }}>
                                {w.weight} - {w.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AbsoluteFill>
    )
}

const ComponentsShowcase = () => {
    const frame = useCurrentFrame();

    // Card Animation
    const cardScale = interpolate(frame, [0, 20], [0.8, 1], { extrapolateRight: 'clamp' });
    const cardOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

    // Button Animation
    const buttonScale = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });


    return (
        <AbsoluteFill style={{ backgroundColor: Theme.Colors.Background, justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
                width: 600,
                padding: 60,
                backgroundColor: 'white',
                borderRadius: Theme.Layout.BorderRadius.xl,
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                opacity: cardOpacity,
                transform: `scale(${cardScale})`,
                display: 'flex',
                flexDirection: 'column',
                gap: 30,
                border: `1px solid ${Theme.Colors.Ninja.Border}`
            }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: Theme.Colors.Brand.Light, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ fontSize: 40 }}>💎</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontFamily, fontSize: 40, fontWeight: 'bold', color: Theme.Colors.Text.Primary }}>
                        Design Components
                    </div>
                    <div style={{ fontFamily, fontSize: 24, color: Theme.Colors.Text.Secondary, lineHeight: 1.5 }}>
                        Clean, consistent, and beautiful UI elements powered by Tailwind tokens.
                    </div>
                </div>

                <div style={{
                    marginTop: 20,
                    padding: '20px 40px',
                    backgroundColor: Theme.Colors.Brand.DEFAULT,
                    color: 'white',
                    borderRadius: Theme.Layout.BorderRadius.md,
                    fontSize: 24,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontFamily,
                    transform: `scale(${buttonScale})`,
                    boxShadow: '0 5px 15px rgba(91, 181, 199, 0.4)'
                }}>
                    Primary Action
                </div>
            </div>
        </AbsoluteFill>
    )
}

export const DesignShowcase = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: 'white' }}>
            <Sequence from={0} durationInFrames={90}>
                <Title />
            </Sequence>
            <Sequence from={90} durationInFrames={120}>
                <ColorPalette />
            </Sequence>
            <Sequence from={210} durationInFrames={120}>
                <TypographyShowcase />
            </Sequence>
            <Sequence from={330} durationInFrames={150}>
                <ComponentsShowcase />
            </Sequence>
        </AbsoluteFill>
    );
};
