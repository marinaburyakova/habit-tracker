'use client'

import Image from 'next/image'
import styles from './AchievementCard.module.css'

type AchievementCardProps = {
  title: string
  days: number
  points: number
  unlocked?: boolean
  icon?: string
}

export default function AchievementCard({
  title,
  days,
  points,
  unlocked = false,
  icon = '/onboarding/1.png',
}: AchievementCardProps) {
  return (
    <div className={`${styles.card} ${unlocked ? styles.unlocked : ''}`}>
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.days}>{days} days</div>
        <div className={styles.points}>{points} points</div>
      </div>

      <div className={styles.badge}>
        <div className={styles.hexagon}>
          <Image
            src={icon}
            alt=""
            width={44}
            height={44}
            className={styles.badgeIcon}
          />
        </div>
      </div>
    </div>
  )
}