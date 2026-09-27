import { getMotivation } from '@/lib/habits'
import styles from './MotivationBadge.module.css'

type MotivationBadgeProps = {
  streak: number
}

export default function MotivationBadge({ streak }: MotivationBadgeProps) {
  const motivation = getMotivation(streak)
  if (!motivation) return null

  return (
    <div className={styles.badge} key={streak}>
      <span className={styles.emoji}>{motivation.emoji}</span>
      <span className={styles.text}>{motivation.text}</span>
    </div>
  )
}