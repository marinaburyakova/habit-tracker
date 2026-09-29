'use client'

import styles from './StreakDial.module.css'

type StreakDialProps = {
  value: number
  label: string
  progress?: number
  max?: number
  size?: number
}

export default function StreakDial({
  value,
  label,
  progress = 0,
  max = 30,
  size = 280,
}: StreakDialProps) {
  const SEGMENTS = 60
  const OUTER_RADIUS = size / 2 - 4
  const INNER_RADIUS_SEGMENT = OUTER_RADIUS - 14
  const INNER_CIRCLE_RADIUS = INNER_RADIUS_SEGMENT - 14

  const center = size / 2
  const filled = Math.round((Math.min(progress, max) / max) * SEGMENTS)

  const segments = Array.from({ length: SEGMENTS }, (_, i) => {
    const angle = (i / SEGMENTS) * 360 - 90
    const rad = (angle * Math.PI) / 180

    const x1 = center + INNER_RADIUS_SEGMENT * Math.cos(rad)
    const y1 = center + INNER_RADIUS_SEGMENT * Math.sin(rad)
    const x2 = center + OUTER_RADIUS * Math.cos(rad)
    const y2 = center + OUTER_RADIUS * Math.sin(rad)

    return { x1, y1, x2, y2, filled: i < filled, key: i }
  })

  return (
    <div className={styles.wrapper} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={styles.svg}
        aria-hidden
      >
        <defs>
          {/* Градиент для обводки внутреннего круга */}
          <linearGradient id="dialRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FD93FF" />
            <stop offset="100%" stopColor="#725CF8" />
          </linearGradient>

          {/* Внутренний градиент круга */}
        

          {/* Тень под внутренним кругом */}
          <filter id="dialShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
            <feOffset dx="0" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.15" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Внутренний круг с тенью */}
        <circle
          cx={center}
          cy={center}
          r={INNER_CIRCLE_RADIUS}
          fill="url(#dialInnerGradient)"
          filter="url(#dialShadow)"
        />

        {/* Обводка внутреннего круга — градиент */}
        <circle
          cx={center}
          cy={center}
          r={INNER_CIRCLE_RADIUS}
          fill="none"
          stroke="url(#dialRingGradient)"
          strokeWidth="5.5"
        />

        {/* Сегменты (штрихи) */}
        {segments.map((s) => (
          <line
            key={s.key}
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            stroke={s.filled ? 'url(#dialRingGradient)' : 'var(--dial-track)'}
            strokeWidth={3}
            strokeLinecap="round"
            className={styles.segment}
          />
        ))}
      </svg>

      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  )
}