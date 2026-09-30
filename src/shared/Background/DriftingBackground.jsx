import React, { useMemo } from 'react'
import './DriftingBackground.scss'

const random = (min, max) => Math.random() * (max - min) + min

const COLORS = ['var(--color2)', 'var(--color3)', 'var(--color4)', 'var(--color1)']

export const DriftingBackground = () => {
    const drifters = useMemo(() => (
        Array.from({ length: 18 }).map((_, i) => ({
            id: i,
            top: random(-5, 92),
            size: random(22, 58),
            scale: random(0.5, 1.15),
            duration: random(22, 44),
            delay: random(-44, 0),
            bobDuration: random(3, 6),
            bobDelay: random(-6, 0),
            yStart: random(-14, 14),
            yEnd: random(-14, 14),
            rStart: random(-30, 30),
            rEnd: random(-30, 30),
            color: COLORS[i % COLORS.length],
            opacity: random(0.08, 0.2),
        }))
    ), [])

    return (
        <div className="drifting-bg" aria-hidden="true">
            {drifters.map(d => (
                <div
                    key={d.id}
                    className="drifter-container"
                    style={{
                        top: `${d.top}vh`,
                        animationDuration: `${d.duration}s`,
                        animationDelay: `${d.delay}s`,
                        '--y-start': `${d.yStart}vh`,
                        '--y-end': `${d.yEnd}vh`,
                        '--r-start': `${d.rStart}deg`,
                        '--r-end': `${d.rEnd}deg`,
                    }}
                >
                    <div
                        className="drifter-triangle"
                        style={{
                            width: `${d.size}px`,
                            height: `${d.size}px`,
                            backgroundColor: d.color,
                            opacity: d.opacity,
                            '--s': d.scale,
                            animationDuration: `${d.bobDuration}s`,
                            animationDelay: `${d.bobDelay}s`,
                        }}
                    />
                </div>
            ))}
        </div>
    )
}
