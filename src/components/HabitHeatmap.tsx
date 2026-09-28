'use client'

import { useMemo } from 'react'
import {
  getCompletionsForHabit,
  getDaysBetween,
  type HabitCompletion,
} from '@/lib/habits'
import { formatDayKey, parseDayKey} from '@/lib/date-utils'
import styles from './HabitHeatmap.module.css'

type HabitHeatmapProps = {
  completions: HabitCompletion[]
  habitId: string
  today: string
  color: string
}

export default function HabitHeatmap({
  completions,
  habitId,
  today,
  color,
}: HabitHeatmapProps) {
  const days = useMemo(() => {
    const base = parseDayKey(today)
    const start = new Date(base)
    start.setUTCDate(start.getUTCDate() - 29)
    return getDaysBetween(formatDayKey(start), today)
  }, [today])

  const doneSet = useMemo(
    () => new Set(getCompletionsForHabit(completions, habitId)),
    [completions, habitId]
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Last 30 days</div>
      <div
        className={styles.grid}
        style={{ '--habit-color': color } as React.CSSProperties}
      >
        {days.map((day) => {
          const done = doneSet.has(day)
          const isToday = day === today
          return (
            <div
              key={day}
              className={[
                styles.cell,
                done && styles.cellDone,
                isToday && styles.cellToday,
              ]
                .filter(Boolean)
                .join(' ')}
              title={day}
              aria-label={`${day}${done ? ', done' : ''}`}
            />
          )
        })}
      </div>
    </div>
  )
}