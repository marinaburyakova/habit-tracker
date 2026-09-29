'use client'

import { useState, useMemo } from 'react'
import { getCompletionsForHabit, type HabitCompletion } from '@/lib/habits'
import {
  getMonthGrid,
  getMonthLabel,
  shiftMonth,
  parseDayKey,
} from '@/lib/date-utils'
import styles from './HabitCalendar.module.css'

type HabitCalendarProps = {
  completions: HabitCompletion[]
  habitId: string
  today: string
  color: string
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function HabitCalendar({
  completions,
  habitId,
  today,
  color,
}: HabitCalendarProps) {
  const [year, month] = today.split('-').map(Number)
  const [view, setView] = useState({ year, month })

  const days = getMonthGrid(view.year, view.month)
  const doneSet = new Set(getCompletionsForHabit(completions, habitId))
  const currentMonthKey = `${view.year}-${String(view.month).padStart(2, '0')}`
  const todayMonthKey = today.slice(0, 7)

  // Нельзя уйти в прошлый месяц
  const isCurrentMonth = currentMonthKey === todayMonthKey
  const canGoPrev = currentMonthKey > todayMonthKey

  function handlePrev() {
    if (!canGoPrev) return
    setView((v) => shiftMonth(v.year, v.month, -1))
  }
  function handleNext() {
    setView((v) => shiftMonth(v.year, v.month, +1))
  }
  function handleToday() {
    const [y, m] = today.split('-').map(Number)
    setView({ year: y, month: m })
  }

  // Фильтруем дни: если текущий месяц — только сегодня и будущее
  const visibleDays = useMemo(() => {
    if (!isCurrentMonth) return days
    return days.filter((d) => d >= today)
  }, [days, isCurrentMonth, today])

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canGoPrev}
          className={styles.nav}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className={styles.label}>{getMonthLabel(view.year, view.month)}</span>
        <button
          type="button"
          onClick={handleNext}
          className={styles.nav}
          aria-label="Next month"
        >
          ›
        </button>
        {!isCurrentMonth && (
          <button
            type="button"
            onClick={handleToday}
            className={styles.todayBtn}
          >
            Today
          </button>
        )}
      </div>

      {!isCurrentMonth && (
        <div className={styles.weekdays}>
          {WEEKDAYS.map((d) => (
            <span key={d} className={styles.weekday}>{d}</span>
          ))}
        </div>
      )}

      {isCurrentMonth ? (
        <div
          className={styles.gridUpcoming}
          style={{ '--habit-color': color } as React.CSSProperties}
        >
          {visibleDays.map((day) => {
            const done = doneSet.has(day)
            const isToday = day === today
            const dayNum = Number(day.slice(8, 10))
            const weekday = WEEKDAYS[(parseDayKey(day).getUTCDay() + 6) % 7]

            return (
              <div
                key={day}
                className={[
                  styles.upcomingDay,
                  done && styles.dayDone,
                  isToday && styles.dayToday,
                ]
                  .filter(Boolean)
                  .join(' ')}
                title={day}
              >
                <span className={styles.upcomingWeekday}>{weekday}</span>
                <span className={styles.upcomingNum}>{dayNum}</span>
              </div>
            )
          })}
        </div>
      ) : (
        <div
          className={styles.grid}
          style={{ '--habit-color': color } as React.CSSProperties}
        >
          {days.map((day) => {
            const done = doneSet.has(day)
            const isToday = day === today
            const isCurrent = day.slice(0, 7) === currentMonthKey
            const dayNum = Number(day.slice(8, 10))

            return (
              <div
                key={day}
                className={[
                  styles.day,
                  done && styles.dayDone,
                  isToday && styles.dayToday,
                  !isCurrent && styles.dayOutside,
                ]
                  .filter(Boolean)
                  .join(' ')}
                title={day}
              >
                {dayNum}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}