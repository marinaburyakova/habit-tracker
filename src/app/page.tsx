import OnboardingGate from '@/components/OnboardingGate'
import MainScreen from '@/components/MainScreen'

export default function Home() {
  return (
    <OnboardingGate>
      <MainScreen />
    </OnboardingGate>
  )
}
