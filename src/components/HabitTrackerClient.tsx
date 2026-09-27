'use client'

import { useState } from 'react'
import {
  createHabit,
  toggleCompletion,
  removeHabit,
  removeCompletionsForHabit,
  type Habit,
  type HabitCompletion,
} from '@/lib/habits'
import AddHabitForm from '@/components/AddHabitForm'
import HabitList from '@/components/HabitList'

const HABIT_COLORS = ['#FD6F00', '#4EA8DE', '#7C3AED', '#10B981', '#EF4444']

export default function HabitTrackerClient() {
  const [habits, setHabits] = useState<Habit[]>([
    createHabit('Read 30 minutes', '#FD6F00'),
    createHabit('Drink 2L water', '#4EA8DE'),
    createHabit('Workout', '#7C3AED'),
  ])
  const [completions, setCompletions] = useState<HabitCompletion[]>([])

  function handleAdd(name: string) {
    setHabits((prev) => {
      const isDuplicate = prev.some(
        (h) => h.name.toLowerCase() === name.toLowerCase()
      )
      if (isDuplicate) return prev

      const color = HABIT_COLORS[prev.length % HABIT_COLORS.length]
      return [...prev, createHabit(name, color)]
    })
  }

  function handleToggle(habitId: string, date: string) {
    setCompletions((prev) => toggleCompletion(prev, habitId, date))
  }

  function handleDelete(habitId: string) {
    const habit = habits.find((h) => h.id === habitId)
    if (!habit) return

    const confirmed = confirm(`Delete "${habit.name}"?`)
    if (!confirmed) return

    setHabits((prev) => removeHabit(prev, habitId))
    setCompletions((prev) => removeCompletionsForHabit(prev, habitId))
  }

  return (
    <>
      <AddHabitForm onAdd={handleAdd} />
      <HabitList
        habits={habits}
        completions={completions}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </>
  )
}