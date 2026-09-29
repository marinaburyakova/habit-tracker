<<<<<<< HEAD
import OnboardingGate from '@/components/OnboardingGate'
import MainScreen from '@/components/MainScreen'

export default function Home() {
  return (
    <OnboardingGate>
      <MainScreen />
    </OnboardingGate>
=======
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
>>>>>>> bd87b9c1badc72757f5b2135981fde4c88ba3a43
  )
}