import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

type UIState = {
  theme: Theme
  hasOnboarded: boolean
  selectedHabitId: string | null
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  completeOnboarding: () => void
  resetOnboarding: () => void
  selectHabit: (id: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      hasOnboarded: false,
      selectedHabitId: null,

      setTheme: (theme) => set({ theme }),

      toggleTheme: () =>
        set({ theme: get().theme === 'light' ? 'dark' : 'light' }),

      completeOnboarding: () => set({ hasOnboarded: true }),

      resetOnboarding: () => set({ hasOnboarded: false }),

      selectHabit: (id) => set({ selectedHabitId: id }),
    }),
    {
      name: 'habit-tracker:ui',
      skipHydration: true,
    }
  )
)