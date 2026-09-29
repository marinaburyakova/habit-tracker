import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.description}>
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className={styles.button}>
        Go home
      </Link>
    </div>
  )
}