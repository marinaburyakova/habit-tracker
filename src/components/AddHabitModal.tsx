'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './AddHabitModal.module.css'

type AddHabitModalProps = {
  open: boolean
  onClose: () => void
  onAdd: (name: string) => void
}

export default function AddHabitModal({
  open,
  onClose,
  onAdd,
}: AddHabitModalProps) {
  return (
    <div
      className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}
      onClick={onClose}
      aria-hidden={!open}
    >
      <div
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Add habit"
      >
        {/* key — сбрасывает состояние при каждом открытии */}
        {open && <AddHabitForm onClose={onClose} onAdd={onAdd} />}
      </div>
    </div>
  )
}

function AddHabitForm({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (name: string) => void
}) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // focus — это синхронизация с DOM (внешняя система), эффект оправдан
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed)
    onClose()
  }

  return (
    <>
      <div className={styles.handle} aria-hidden />
      <h2 className={styles.title}>New habit</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Read 30 minutes"
          className={styles.input}
          maxLength={60}
        />

        <button type="submit" className={styles.submit} disabled={!name.trim()}>
          Add habit
        </button>
      </form>
    </>
  )
}