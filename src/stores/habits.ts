import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createHabit,
  toggleCompletion,
  removeHabit,
  removeCompletionsForHabit,
  getToday,
  type Habit,
  type HabitCompletion,
} from '@/lib/habits'

const HABIT_COLORS = ['#FD6F00', '#4EA8DE', '#7C3AED', '#10B981', '#EF4444']

const DEFAULT_HABITS = [
  { name: 'Read 30 minutes', color: '#FD6F00' },
  { name: 'Drink 2L water', color: '#4EA8DE' },
  { name: 'Workout', color: '#7C3AED' },
].map((h) => createHabit(h.name, h.color))

type HabitsState = {
  habits: Habit[]
  completions: HabitCompletion[]
  addHabit: (name: string) => void
  toggle: (habitId: string) => void
  deleteHabit: (habitId: string) => void
}

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set, get) => ({
      habits: DEFAULT_HABITS,
      completions: [],

      addHabit: (name) => {
        const { habits } = get()
        const isDuplicate = habits.some(
          (h) => h.name.toLowerCase() === name.toLowerCase()
        )
        if (isDuplicate) return

        const color = HABIT_COLORS[habits.length % HABIT_COLORS.length]
        set({ habits: [...habits, createHabit(name, color)] })
      },

      toggle: (habitId) => {
        const today = getToday()
        set((s) => ({
          completions: toggleCompletion(s.completions, habitId, today),
        }))
      },

      deleteHabit: (habitId) => {
        set((s) => ({
          habits: removeHabit(s.habits, habitId),
          completions: removeCompletionsForHabit(s.completions, habitId),
        }))
      },
    }),
    {
      name: 'habit-tracker',
      skipHydration: true,   // ← не читать localStorage при создании стора
    }
  )
)