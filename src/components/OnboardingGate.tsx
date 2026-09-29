'use client'

import { useSyncExternalStore } from 'react'
import { useUIStore } from '@/stores/ui'
import Onboarding from './Onboarding'
import styles from './OnboardingGate.module.css'

const emptySubscribe = () => () => {}

export default function OnboardingGate({
  children,
}: {
  children: React.ReactNode
}) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const hasOnboarded = useUIStore((s) => s.hasOnboarded)

  if (!mounted) {
    return <div className={styles.placeholder} />
  }

  if (!hasOnboarded) {
    return <Onboarding />
  }

  return <>{children}</>
}