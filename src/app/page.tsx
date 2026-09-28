import HabitTrackerClient from '@/components/HabitTrackerClient'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Habit Tracker</h1>
      </header>
      <HabitTrackerClient />
    </div>
  )
}