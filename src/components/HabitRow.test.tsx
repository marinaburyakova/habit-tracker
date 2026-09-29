import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HabitRow from './HabitRow'

describe('HabitRow', () => {
  it('вызывает onToggle при клике по галочке', async () => {
    const onToggle = vi.fn()
    render(
      <HabitRow name="Read" done={false} onToggle={onToggle} />
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /mark read as done/i }))

    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('вызывает onSelect вместе с onToggle при клике по галочке', async () => {
    const onToggle = vi.fn()
    const onSelect = vi.fn()
    render(
      <HabitRow
        name="Read"
        done={false}
        onToggle={onToggle}
        onSelect={onSelect}
      />
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /mark read as done/i }))

    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('НЕ вызывает onToggle при клике по пустому полю строки', async () => {
    const onToggle = vi.fn()
    const onSelect = vi.fn()
    render(
      <HabitRow
        name="Read"
        done={false}
        onToggle={onToggle}
        onSelect={onSelect}
      />
    )

    const user = userEvent.setup()
    await user.click(screen.getByText('Read'))

    expect(onToggle).not.toHaveBeenCalled()
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('вызывает onDelete при клике по ×', async () => {
    const onDelete = vi.fn()
    render(
      <HabitRow name="Read" done={false} onToggle={() => {}} onDelete={onDelete} />
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /delete read/i }))

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('НЕ вызывает onToggle при клике по ×', async () => {
    const onToggle = vi.fn()
    const onDelete = vi.fn()
    render(
      <HabitRow
        name="Read"
        done={false}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /delete read/i }))

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onToggle).not.toHaveBeenCalled()
  })

  it('показывает галочку когда done = true', () => {
    render(<HabitRow name="Read" done={true} onToggle={() => {}} />)
    const button = screen.getByRole('button', { name: /mark read as not done/i })
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('aria-pressed = false когда done = false', () => {
    render(<HabitRow name="Read" done={false} onToggle={() => {}} />)
    const button = screen.getByRole('button', { name: /mark read as done/i })
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })
})