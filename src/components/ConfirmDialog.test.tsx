import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmDialog from './ConfirmDialog'

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement
  ) {
    this.open = true
  })
  HTMLDialogElement.prototype.close = vi.fn(function (
    this: HTMLDialogElement
  ) {
    this.open = false
  })
})

describe('ConfirmDialog', () => {
  it('вызывает onConfirm при клике по Delete', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        open
        title="Delete?"
        confirmLabel="Delete"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /delete/i }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('вызывает onCancel при клике по Cancel', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        open
        title="Delete?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('не вызывает showModal когда open = false', () => {
    const showModalSpy = vi.spyOn(
      HTMLDialogElement.prototype,
      'showModal'
    )
    render(
      <ConfirmDialog
        open={false}
        title="Delete?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    expect(showModalSpy).not.toHaveBeenCalled()
  })
})