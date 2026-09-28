'use client'

import {
  getToday,
  isCompletedToday,
  calculateStreak,
  longestStreak,
  getCompletionRate,
  type Habit,
  type HabitCompletion,
} from '@/lib/habits'
import HabitItem from './HabitItem'
import styles from './HabitList.module.css'

type HabitListProps = {
  habits: Habit[]
  completions: HabitCompletion[]
  onToggle: (habitId: string) => void
  onDelete: (habitId: string) => void
}

export default function HabitList({
  habits,
  completions,
  onToggle,
  onDelete,
}: HabitListProps) {
  const today = getToday()

  if (habits.length === 0) {
    return <p className={styles.empty}>No habits yet. Add your first one above.</p>
  }

  return (
    <ul className={styles.list}>
      {habits.map((habit) => {
        const done = isCompletedToday(completions, habit.id, today)
        const streak = calculateStreak(completions, habit.id, today)
        const longest = longestStreak(completions, habit.id)
        const rate = getCompletionRate(completions, habit.id, 30, today)

        return (
          <HabitItem
            key={habit.id}
            habit={habit}
            done={done}
            streak={streak}
            longest={longest}
            rate={rate}
            completions={completions}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        )
      })}
    </ul>
  )
}