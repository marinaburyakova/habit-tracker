import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from './ui'

describe('ui store', () => {
  // Сбрасываем Zustand-стор в исходное состояние перед каждым тестом
  beforeEach(() => {
    useUIStore.setState({
      theme: 'light',
      hasOnboarded: false,
      selectedHabitId: null,
    })
  })

  it('должен иметь дефолтные значения по умолчанию', () => {
    const state = useUIStore.getState()
    expect(state.theme).toBe('light')
    expect(state.hasOnboarded).toBe(false)
    expect(state.selectedHabitId).toBeNull()
  })

  it('setTheme должен менять тему оформления', () => {
    useUIStore.getState().setTheme('dark')
    expect(useUIStore.getState().theme).toBe('dark')

    useUIStore.getState().setTheme('light')
    expect(useUIStore.getState().theme).toBe('light')
  })

  it('toggleTheme должен переключать тему между light и dark', () => {
    // light -> dark
    useUIStore.getState().toggleTheme()
    expect(useUIStore.getState().theme).toBe('dark')

    // dark -> light
    useUIStore.getState().toggleTheme()
    expect(useUIStore.getState().theme).toBe('light')
  })

  it('completeOnboarding и resetOnboarding должны управлять статусом онбординга', () => {
    // Завершаем онбординг
    useUIStore.getState().completeOnboarding()
    expect(useUIStore.getState().hasOnboarded).toBe(true)

    // Сбрасываем онбординг
    useUIStore.getState().resetOnboarding()
    expect(useUIStore.getState().hasOnboarded).toBe(false)
  })

  it('selectHabit должен устанавливать id выбранной привычки', () => {
    const testId = 'habit-123'
    useUIStore.getState().selectHabit(testId)
    expect(useUIStore.getState().selectedHabitId).toBe(testId)
  })
})
