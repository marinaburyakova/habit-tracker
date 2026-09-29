'use client'

import styles from './error.module.css'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.emoji} aria-hidden>😕</div>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.description}>
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button type="button" className={styles.button} onClick={reset}>
        Try again
      </button>
    </div>
  )
}