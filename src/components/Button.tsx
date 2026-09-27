import styles from './Button.module.css'

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'ghost' | 'danger'
  disabled?: boolean
  ariaLabel?: string
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${styles.button} ${styles[variant]}`}
    >
      {children}
    </button>
  )
}