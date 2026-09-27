import type { Habit } from '@/lib/habits'
import Button from './Button'
import WeekGrid from './WeekGrid'
import MotivationBadge from './MotivationBadge'
import styles from './HabitItem.module.css'

type HabitItemProps = {
  habit: Habit
  done: boolean
  streak: number
  days: string[]
  today: string
  doneDates: Set<string>
  onToggle: (habitId: string, date: string) => void
  onDelete: (habitId: string) => void
}

export default function HabitItem({
  habit,
  done,
  streak,
  days,
  today,
  doneDates,
  onToggle,
  onDelete,
}: HabitItemProps) {
  return (
    <li
      className={`${styles.item} ${done ? styles.done : ''}`}
      style={{ '--habit-color': habit.color } as React.CSSProperties}
    >
      <div className={styles.row}>
        <div className={styles.info}>
          <div className={styles.name}>{habit.name}</div>
          <div className={styles.streak}>
            Streak: {streak} {streak === 1 ? 'day' : 'days'}
          </div>
        </div>

        <div className={styles.actions}>
          <Button onClick={() => onToggle(habit.id, today)}>
            {done ? 'Undo' : 'Done'}
          </Button>
          <Button
            onClick={() => onDelete(habit.id)}
            variant="danger"
            ariaLabel={`Delete ${habit.name}`}
          >
            ×
          </Button>
        </div>
      </div>

      <MotivationBadge streak={streak} />

      <WeekGrid
        habitId={habit.id}
        days={days}
        today={today}
        doneDates={doneDates}
        color={habit.color}
        onToggle={onToggle}
      />
    </li>
  )
}