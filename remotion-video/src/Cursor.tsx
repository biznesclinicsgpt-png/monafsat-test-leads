import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const Cursor = ({ x, y, click }: { x: number, y: number, click?: boolean }) => {
    const frame = useCurrentFrame();

    // Simple click animation (scale down and up)
    const scale = click ? interpolate(frame % 10, [0, 5, 10], [1, 0.8, 1], { extrapolateRight: 'clamp' }) : 1;

    return (
        <div
            style={{
                position: 'absolute',
                left: x,
                top: y,
                pointerEvents: 'none',
                zIndex: 1000,
                transform: `scale(${scale})`,
            }}
        >
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }}
            >
                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" fill="white" />
            </svg>
        </div>
    );
};
