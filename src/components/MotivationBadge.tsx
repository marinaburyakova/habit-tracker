import { getMotivation } from '@/lib/habits';
import styles from './MotivationBadge.module.css';

type MotivationBadgeProps = {
  streak: number;
};

export default function MotivationBadge({ streak }: MotivationBadgeProps) {
  const motivation = getMotivation(streak);
  if (!motivation) return null;
  const Icon = motivation.icon;
  return (
    <div className={styles.badge} key={streak}>
      <Icon className={styles.icon} size={20} aria-hidden />
      <span className={styles.text}>{motivation.text}</span>
    </div>
  );
}
