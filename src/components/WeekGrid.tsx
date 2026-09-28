import styles from './WeekGrid.module.css'

type WeekGridProps = {
  habitId: string
  days: string[]
  today: string
  doneDates: Set<string>
  color: string
  onToggle: (habitId: string) => void
}

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeekday(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return WEEKDAY_SHORT[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
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
        const isFuture = day > today
        const isPast = day < today

        return (
          <div key={day} className={styles.cell}>
            <span
              className={`${styles.weekday} ${isToday ? styles.weekdayToday : ''}`}
            >
              {getWeekday(day)}
            </span>
            <button
              type="button"
              disabled={!isToday}
              onClick={() => isToday && onToggle(habitId)}
              className={[
                styles.day,
                isDone && styles.done,
                isToday && styles.today,
                isPast && styles.past,
                isFuture && styles.future,
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ '--habit-color': color } as React.CSSProperties}
              aria-label={
                isToday
                  ? isDone
                    ? 'Mark today as not done'
                    : 'Mark today as done'
                  : `${day}${isDone ? ', done' : ''}`
              }
              aria-pressed={isDone}
              title={
                isToday
                  ? isDone
                    ? 'Click to undo'
                    : 'Click to mark done'
                  : day
              }
            >
              {isToday && !isDone ? (
                <svg
                  className={styles.checkIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                day.slice(8)
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}