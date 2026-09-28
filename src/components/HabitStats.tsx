import styles from './HabitStats.module.css'

type HabitStatsProps = {
  streak: number
  longest: number
  rate: number
}

export default function HabitStats({ streak, longest, rate }: HabitStatsProps) {
  return (
    <div className={styles.stats}>
      {streak > 0 && (
        <span className={styles.stat}>
          <span className={styles.emoji}>🔥</span>
          {streak} {streak === 1 ? 'day' : 'days'}
        </span>
      )}
      {longest > 0 && (
        <>
          <span className={styles.sep}>·</span>
          <span className={styles.stat}>Best: {longest}</span>
        </>
      )}
      {rate > 0 && (
        <>
          <span className={styles.sep}>·</span>
          <span className={styles.stat}>30d: {rate}%</span>
        </>
      )}
      {streak === 0 && longest === 0 && (
        <span className={styles.empty}>Not started yet</span>
      )}
    </div>
  )
}