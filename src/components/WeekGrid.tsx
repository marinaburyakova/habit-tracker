import styles from './WeekGrid.module.css'

type WeekGridProps = {
  habitId: string
  days: string[]
  today: string
  doneDates: Set<string>
  color: string
  onToggle: (habitId: string, date: string) => void
}

export default function WeekGrid({
  habitId,
  days,
  today,
  doneDates,
  color,
  onToggle,
}: WeekGridProps) {
  return (
    <div className={styles.grid}>
      {days.map((day) => {
        const isDone = doneDates.has(day)
        const isToday = day === today

        return (
          <button
            key={day}
            type="button"
            onClick={() => onToggle(habitId, day)}
            className={`${styles.day} ${isDone ? styles.done : ''} ${isToday ? styles.today : ''}`}
            style={{ '--habit-color': color } as React.CSSProperties}
            aria-label={`Toggle ${day}`}
            aria-pressed={isDone}
            title={day}
          >
            {day.slice(8)}
          </button>
        )
      })}
    </div>
  )
}