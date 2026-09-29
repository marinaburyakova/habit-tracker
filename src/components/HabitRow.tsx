'use client';

import styles from './HabitRow.module.css';

type HabitRowProps = {
  name: string;
  subtitle?: string;
  done: boolean;
  isSelected?: boolean;
  onToggle: () => void;
  onSelect?: () => void;
  onDelete?: () => void;
};

export default function HabitRow({
  name,
  subtitle,
  done,
  isSelected = false,
  onToggle,
  onSelect,
  onDelete,
}: HabitRowProps) {
  return (
    <div className={`${styles.row} ${isSelected ? styles.selected : ''}`}>
      <button
        type="button"
        className={`${styles.check} ${done ? styles.checkDone : ''}`}
        onClick={() => {
          onToggle();
          onSelect?.();
        }}
        aria-label={done ? `Mark ${name} as not done` : `Mark ${name} as done`}
        aria-pressed={done}
      >
        {done && (
          <svg viewBox="0 0 24 24" fill="none" className={styles.checkIcon}>
            <polyline
              points="20 6 9 17 4 12"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>

      {onDelete && (
        <button
          type="button"
          className={styles.delete}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label={`Delete ${name}`}
        >
          ×
        </button>
      )}
    </div>
  );
}
