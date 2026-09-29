'use client'

import styles from './HabitSummary.module.css'

type HabitSummaryProps = {
  total: number
  done: number
}

export default function HabitSummary({ total, done }: HabitSummaryProps) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className={styles.wrapper}>
      <div className={styles.pill}>
        <span className={styles.pillValue}>{total}</span>
        <span className={styles.pillLabel}>
          {total === 1 ? 'habit' : 'habits'}
        </span>
      </div>

      <div className={`${styles.pill} ${styles.pillDone}`}>
        <span className={styles.pillValue}>{done}</span>
        <span className={styles.pillLabel}>done today</span>
      </div>

      <div className={styles.progress}>
        <div
          className={styles.progressFill}
          style={{ width: `${percent}%` }}
          aria-hidden
        />
        <span className={styles.progressText}>{percent}%</span>
      </div>
    </div>
  )
}