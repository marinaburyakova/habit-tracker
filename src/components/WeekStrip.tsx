'use client'

import { parseDayKey } from '@/lib/date-utils'
import styles from './WeekStrip.module.css'

type WeekStripProps = {
  days: string[]
  today: string
  doneDates: Set<string>
  onSelect?: (day: string) => void
}

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function WeekStrip({
  days,
  today,
  doneDates,
  onSelect,
}: WeekStripProps) {
  return (
    <div className={styles.wrapper}>
      {days.map((day) => {
        const isDone = doneDates.has(day)
        const isToday = day === today
        const dayNum = Number(day.slice(8, 10))
        const weekday = WEEKDAY_SHORT[parseDayKey(day).getUTCDay()]

        return (
          <button
            key={day}
            type="button"
            className={[
              styles.day,
              isToday && styles.today,
              isDone && styles.done,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onSelect?.(day)}
            aria-label={`${weekday}, ${dayNum}${isDone ? ', done' : ''}`}
          >
            <span className={styles.num}>{dayNum}</span>
            <span className={styles.weekday}>{weekday.slice(0, 1)}</span>
          </button>
        )
      })}
    </div>
  )
}