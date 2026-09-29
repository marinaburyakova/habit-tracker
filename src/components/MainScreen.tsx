'use client'

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import {
  getToday,
  isCompletedToday,
  calculateStreak,
  longestStreak,
  getCompletionRate,
} from '@/lib/habits'
import { getRollingWindow } from '@/lib/date-utils'
import { useHabitsStore } from '@/stores/habits'
import { useUIStore } from '@/stores/ui'
import StreakDial from './StreakDial'
import HabitSummary from './HabitSummary'
import WeekStrip from './WeekStrip'
import AchievementCard from './AchievementCard'
import HabitRow from './HabitRow'
import ThemeToggle from './ThemeToggle'
import AddHabitModal from './AddHabitModal'
import ConfirmDialog from './ConfirmDialog'
import styles from './MainScreen.module.css'

const emptySubscribe = () => () => {}

function getGreeting(streak: number, doneToday: boolean): string {
  if (doneToday && streak === 1) return 'First day done'
  if (doneToday && streak === 2) return 'Two in a row!'
  if (doneToday && streak >= 3 && streak < 7) return 'On fire!'
  if (doneToday && streak >= 7 && streak < 14) return 'One week done!'
  if (doneToday && streak >= 14 && streak < 30) return 'Two weeks!'
  if (doneToday && streak >= 30) return 'A month!'
  if (doneToday) return 'Done. See you tomorrow'

  if (streak === 0) return "Let's start today"
  if (streak === 1) return 'Day one. Keep going!'
  if (streak === 2) return 'Two days in a row!'
  if (streak >= 3 && streak < 7) return "You're on fire!"
  if (streak >= 7 && streak < 14) return 'One full week!'
  if (streak >= 14 && streak < 30) return 'Two weeks! Legendary!'
  if (streak >= 30) return 'A month! Incredible!'

  return 'Keep going!'
}

export default function MainScreen() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const habits = useHabitsStore((s) => s.habits)
  const completions = useHabitsStore((s) => s.completions)
  const addHabit = useHabitsStore((s) => s.addHabit)
  const toggle = useHabitsStore((s) => s.toggle)
  const deleteHabit = useHabitsStore((s) => s.deleteHabit)

  const selectedHabitId = useUIStore((s) => s.selectedHabitId)
  const selectHabit = useUIStore((s) => s.selectHabit)

  const [addOpen, setAddOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    name: string
  } | null>(null)

  useEffect(() => {
    useHabitsStore.persist.rehydrate()
  }, [])

  const today = getToday()

  const selected = useMemo(() => {
    if (selectedHabitId) {
      const found = habits.find((h) => h.id === selectedHabitId)
      if (found) return found
    }
    return habits[0] ?? null
  }, [habits, selectedHabitId])

  const stats = useMemo(() => {
    if (!selected) {
      return { streak: 0, longest: 0, rate: 0, done: false }
    }
    return {
      streak: calculateStreak(completions, selected.id, today),
      longest: longestStreak(completions, selected.id),
      rate: getCompletionRate(completions, selected.id, 30, today),
      done: isCompletedToday(completions, selected.id, today),
    }
  }, [selected, completions, today])

  const doneToday = useMemo(
    () =>
      habits.filter((h) => isCompletedToday(completions, h.id, today)).length,
    [habits, completions, today]
  )

  const weekDays = useMemo(() => getRollingWindow(today, 3, 3), [today])

  const selectedDoneDates = useMemo(() => {
    if (!selected) return new Set<string>()
    return new Set(
      completions.filter((c) => c.habitId === selected.id).map((c) => c.date)
    )
  }, [selected, completions])

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteHabit(deleteTarget.id)
    setDeleteTarget(null)
  }

  if (!mounted) {
    return <div className={styles.placeholder} />
  }

  const nextMilestone =
    [7, 14, 30, 60, 100, 200].find((m) => m > stats.streak) ??
    stats.streak + 1

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          {selected ? (
            <>
              <div className={styles.greeting}>
                {getGreeting(stats.streak, stats.done)}
              </div>
              <div className={styles.habitName}>{selected.name}</div>
            </>
          ) : (
            <div className={styles.habitName}>No habits yet</div>
          )}
        </div>
        <ThemeToggle />
      </header>

      <section className={styles.dialSection}>
        <StreakDial
          value={stats.streak}
          label={stats.streak === 1 ? 'Day' : 'Days'}
          progress={stats.streak}
          max={Math.max(nextMilestone, 7)}
          size={260}
        />
      </section>

      <HabitSummary total={habits.length} done={doneToday} />

      {selected && (
        <section className={styles.weekSection}>
          <WeekStrip
            days={weekDays}
            today={today}
            doneDates={selectedDoneDates}
          />
        </section>
      )}

      {selected && (
        <AchievementCard
          title="Next Achievement:"
          days={nextMilestone}
          points={nextMilestone * 10}
          unlocked={false}
        />
      )}

      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <span className={styles.listTitle}>Your habits</span>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => setAddOpen(true)}
            aria-label="Add habit"
          >
            +
          </button>
        </div>

        <div className={styles.list}>
          {habits.length === 0 ? (
            <div className={styles.empty}>
              No habits yet. Tap + to add one.
            </div>
          ) : (
            habits.map((habit) => (
              <HabitRow
                key={habit.id}
                name={habit.name}
                subtitle={
                  isCompletedToday(completions, habit.id, today)
                    ? 'Done today'
                    : 'Tap to mark done'
                }
                done={isCompletedToday(completions, habit.id, today)}
                isSelected={selected?.id === habit.id}
                onToggle={() => toggle(habit.id)}
                onSelect={() => selectHabit(habit.id)}
                onDelete={() =>
                  setDeleteTarget({ id: habit.id, name: habit.name })
                }
              />
            ))
          )}
        </div>
      </section>

      <AddHabitModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(name) => {
          addHabit(name)
          setAddOpen(false)
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Delete "${deleteTarget?.name}"?`}
        description="All completions for this habit will be deleted. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}