'use client'

import { useMemo } from 'react'
import {
  getDaysBetween,
  getCompletionsForHabit,
  getToday,
  isCompletedToday,
  calculateStreak,
  parseDate,
  formatDate,
  type Habit,
  type HabitCompletion,
} from '@/lib/habits'
import HabitItem from './HabitItem'

type HabitListProps = {
  habits: Habit[]
  completions: HabitCompletion[]
  onToggle: (habitId: string, date: string) => void
  onDelete: (habitId: string) => void
}

export default function HabitList({
  habits,
  completions,
  onToggle,
  onDelete,
}: HabitListProps) {
  const today = getToday()

  const days = useMemo(() => {
    const endDate = parseDate(today)
    const startDate = new Date(endDate)
    startDate.setUTCDate(startDate.getUTCDate() - 6)
    return getDaysBetween(formatDate(startDate), today)
  }, [today])

  if (habits.length === 0) {
    return (
      <p style={{ textAlign: 'center', opacity: 0.5, padding: 40 }}>
        No habits yet. Add your first one above.
      </p>
    )
  }

  return (
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16,  width: '100%',}}>
      {habits.map((habit) => {
        const done = isCompletedToday(completions, habit.id, today)
        const streak = calculateStreak(completions, habit.id, today)
        const doneDates = new Set(getCompletionsForHabit(completions, habit.id))

        return (
          <HabitItem
            key={habit.id}
            habit={habit}
            done={done}
            streak={streak}
            days={days}
            today={today}
            doneDates={doneDates}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        )
      })}
    </ul>
  )
}