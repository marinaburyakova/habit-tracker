'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { useHabitsStore } from '@/stores/habits'
import AddHabitForm from '@/components/AddHabitForm'
import HabitList from '@/components/HabitList'

const emptySubscribe = () => () => {}

export default function HabitTrackerClient() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,   // клиент
    () => false   // сервер
  )

  const habits = useHabitsStore((s) => s.habits)
  const completions = useHabitsStore((s) => s.completions)
  const addHabit = useHabitsStore((s) => s.addHabit)
  const toggle = useHabitsStore((s) => s.toggle)
  const deleteHabit = useHabitsStore((s) => s.deleteHabit)

  // rehydrate — не setState, а обновление Zustand-стора. React не ругается.
  useEffect(() => {
    useHabitsStore.persist.rehydrate()
  }, [])

  if (!mounted) {
    return (
      <p style={{ textAlign: 'center', opacity: 0.5, padding: 40 }}>
        Loading…
      </p>
    )
  }

  return (
    <>
      <AddHabitForm onAdd={addHabit} />
      <HabitList
        habits={habits}
        completions={completions}
        onToggle={toggle}
        onDelete={deleteHabit}
      />
    </>
  )
}