'use client'

import { useSyncExternalStore } from 'react'
import { useUIStore } from '@/stores/ui'
import styles from './ThemeToggle.module.css'

const emptySubscribe = () => () => {}

export default function ThemeToggle() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const theme = useUIStore((s) => s.theme)
  const toggleTheme = useUIStore((s) => s.toggleTheme)

  if (!mounted) {
    return <div className={styles.placeholder} aria-hidden />
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}