'use client'

import { useState } from 'react'
import Button from './Button'
import styles from './AddHabitForm.module.css'

type AddHabitFormProps = {
  onAdd: (name: string) => void
}

export default function AddHabitForm({ onAdd }: AddHabitFormProps) {
  const [name, setName] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmed = name.trim()
    if (trimmed.length === 0) return

    onAdd(trimmed)
    setName('')
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New habit…"
        className={styles.input}
      />
      <Button type="submit">Add</Button>
    </form>
  )
}