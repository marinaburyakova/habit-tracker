'use client'

import { useEffect, useRef } from 'react'
import styles from './ConfirmDialog.module.css'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      onCancel={(e) => {
        e.preventDefault()
        onCancel()
      }}
      onClick={(e) => {
<<<<<<< HEAD
        // клик по backdrop — закрыть
=======
        // Клик по backdrop (вне .content) — закрыть
>>>>>>> bd87b9c1badc72757f5b2135981fde4c88ba3a43
        if (e.target === ref.current) onCancel()
      }}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.actions}>
<<<<<<< HEAD
          <button type="button" className={styles.cancel} onClick={onCancel}>
=======
          <button
            type="button"
            className={styles.cancel}
            onClick={onCancel}
          >
>>>>>>> bd87b9c1badc72757f5b2135981fde4c88ba3a43
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`${styles.confirm} ${variant === 'danger' ? styles.danger : ''}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}