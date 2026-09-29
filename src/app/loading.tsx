import styles from './loading.module.css'

export default function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.dial} />
      <div className={styles.card} />
      <div className={styles.card} />
      <div className={styles.card} />
    </div>
  )
}