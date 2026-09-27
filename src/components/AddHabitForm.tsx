

import { useState } from 'react'
import Button from './Button'

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
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, marginBottom: 30 }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New habit…"
        style={{
          flex: 1,
          padding: '12px 16px',
          borderRadius: 8,
          border: '1px solid #333',
          background: '#1a1a1a',
          color: '#fff',
          fontSize: 16,
        }}
      />
      <Button type="submit">Add</Button>
    </form>
  )
}