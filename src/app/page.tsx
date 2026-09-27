import HabitTrackerClient from '@/components/HabitTrackerClient'

export default function Home() {
  return (
    <main style={{ padding: 40, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 40, marginBottom: 30 }}>Habit Tracker</h1>
      <HabitTrackerClient />
    </main>
  )
}