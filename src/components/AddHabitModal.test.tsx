import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddHabitModal from './AddHabitModal'

describe('AddHabitModal', () => {
  it('вызывает onAdd с введённым именем', async () => {
    const onAdd = vi.fn()
    const onClose = vi.fn()
    render(<AddHabitModal open onAdd={onAdd} onClose={onClose} />)

    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText(/read 30 minutes/i), 'Meditate')
    await user.click(screen.getByRole('button', { name: /add habit/i }))

    expect(onAdd).toHaveBeenCalledWith('Meditate')
  })

  it('не вызывает onAdd при пустом имени', async () => {
    const onAdd = vi.fn()
    render(<AddHabitModal open onAdd={onAdd} onClose={() => {}} />)

    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: /add habit/i })
    await user.click(button)

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('не рендерит форму когда open = false', () => {
    render(<AddHabitModal open={false} onAdd={() => {}} onClose={() => {}} />)
    expect(screen.queryByPlaceholderText(/read 30 minutes/i)).not.toBeInTheDocument()
  })
})