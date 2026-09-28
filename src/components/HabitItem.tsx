'use client'

import { useState } from 'react'
import type { Habit, HabitCompletion } from '@/lib/habits'
import { getToday } from '@/lib/habits'
import Button from './Button'
import MotivationBadge from './MotivationBadge'
import HabitStats from './HabitStats'
import HabitCalendar from './HabitCalendar'
import ConfirmDialog from './ConfirmDialog'
import styles from './HabitItem.module.css'

type HabitItemProps = {
  habit: Habit
  done: boolean
  streak: number
  longest: number
  rate: number
  completions: HabitCompletion[]
  onToggle: (habitId: string) => void
  onDelete: (habitId: string) => void
}

export default function HabitItem({
  habit,
  done,
  streak,
  longest,
  rate,
  completions,
  onToggle,
  onDelete,
}: HabitItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const today = getToday()

  function handleConfirmDelete() {
    setConfirmOpen(false)
    onDelete(habit.id)
  }

  return (
    <>
      <li
        className={`${styles.item} ${done ? styles.itemDone : ''}`}
        style={{ '--habit-color': habit.color } as React.CSSProperties}
      >
        <div
          className={styles.main}
          onClick={() => onToggle(habit.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onToggle(habit.id)
            }
          }}
          aria-label={done ? `Mark ${habit.name} as not done` : `Mark ${habit.name} as done`}
          aria-pressed={done}
        >
          <div className={styles.checkButton}>
            {done ? (
              <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <span className={styles.checkPlaceholder} />
            )}
          </div>

          <div className={styles.info}>
            <div className={styles.name}>{habit.name}</div>
            {done || streak > 0 || longest > 0 ? (
              <HabitStats streak={streak} longest={longest} rate={rate} />
            ) : (
              <span className={styles.hint}>Tap to mark done</span>
            )}
            <MotivationBadge streak={streak} />
          </div>

          <div
            className={styles.deleteWrapper}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Button
              onClick={() => setConfirmOpen(true)}
              variant="danger"
              ariaLabel={`Delete ${habit.name}`}
            >
              ×
            </Button>
          </div>
        </div>

        <button
          type="button"
          className={styles.expandButton}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? 'Hide details ▴' : 'Show details ▾'}
        </button>

        {expanded && (
          <div className={styles.details}>
            <HabitCalendar
              completions={completions}
              habitId={habit.id}
              today={today}
              color={habit.color}
            />
          </div>
        )}
      </li>

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete "${habit.name}"?`}
        description="Все отметки этой привычки будут удалены. Это действие нельзя отменить."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}