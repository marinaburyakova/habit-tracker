// src/lib/habits.ts

export type Habit = {
  id: string
  name: string
  color: string
  createdAt: string
}

export type HabitCompletion = {
  habitId: string
  date: string
}

export type Motivation = {
  text: string
  emoji: string
}

// ─────────────────────────────────────────
// Даты (всё в UTC, чтобы не зависеть от TZ)
// ─────────────────────────────────────────

export function formatDate(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getToday(): string {
  return formatDate(new Date())
}

export function parseDate(str: string): Date {
  const date = new Date(str)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: "${str}". Expected format YYYY-MM-DD.`)
  }
  return date
}

export function daysBetween(a: string, b: string): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000
  const timeA = parseDate(a).getTime()
  const timeB = parseDate(b).getTime()
  return Math.round((timeB - timeA) / MS_PER_DAY)
}

export function isConsecutive(a: string, b: string): boolean {
  return daysBetween(a, b) === 1
}

export function getDaysBetween(from: string, to: string): string[] {
  const result: string[] = []
  const current = parseDate(from)
  const end = parseDate(to)

  while (current <= end) {
    result.push(formatDate(current))
    current.setUTCDate(current.getUTCDate() + 1)
  }

  return result
}

// ─────────────────────────────────────────
// Привычки
// ─────────────────────────────────────────

export function createHabit(name: string, color: string): Habit {
  return {
    id: crypto.randomUUID(),
    name,
    color,
    createdAt: getToday(),
  }
}

// ─────────────────────────────────────────
// Отметки (CRUD)
// ─────────────────────────────────────────

export function isCompleted(
  completions: HabitCompletion[],
  habitId: string,
  date: string
): boolean {
  return completions.some(
    (c) => c.habitId === habitId && c.date === date
  )
}

export function addCompletion(
  completions: HabitCompletion[],
  habitId: string,
  date: string
): HabitCompletion[] {
  if (isCompleted(completions, habitId, date)) {
    return completions
  }
  return [...completions, { habitId, date }]
}

export function removeCompletion(
  completions: HabitCompletion[],
  habitId: string,
  date: string
): HabitCompletion[] {
  const isSame = (c: HabitCompletion) =>
    c.habitId === habitId && c.date === date
  return completions.filter((c) => !isSame(c))
}

export function toggleCompletion(
  completions: HabitCompletion[],
  habitId: string,
  date: string
): HabitCompletion[] {
  return isCompleted(completions, habitId, date)
    ? removeCompletion(completions, habitId, date)
    : addCompletion(completions, habitId, date)
}

// ─────────────────────────────────────────
// Аналитика
// ─────────────────────────────────────────

export function getCompletionsForHabit(
  completions: HabitCompletion[],
  habitId: string
): string[] {
  return completions
    .filter((c) => c.habitId === habitId)
    .map((c) => c.date)
}

export function isCompletedToday(
  completions: HabitCompletion[],
  habitId: string,
  today: string = getToday()
): boolean {
  return isCompleted(completions, habitId, today)
}

/**
 * Мягкий streak: серия считается живой,
 * если последняя отметка — сегодня ИЛИ вчера.
 */
export function calculateStreak(
  completions: HabitCompletion[],
  habitId: string,
  today: string = getToday()
): number {
  const dates = getCompletionsForHabit(completions, habitId)
  if (dates.length === 0) return 0

  const sorted = [...new Set(dates)].sort()
  const last = sorted[sorted.length - 1]

  const isActive = last === today || isConsecutive(last, today)
  if (!isActive) return 0

  let streak = 1
  for (let i = sorted.length - 2; i >= 0; i--) {
    if (isConsecutive(sorted[i], sorted[i + 1])) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export function longestStreak(
  completions: HabitCompletion[],
  habitId: string
): number {
  const dates = getCompletionsForHabit(completions, habitId)
  if (dates.length === 0) return 0

  const sorted = [...new Set(dates)].sort()

  let best = 1
  let current = 1

  for (let i = 1; i < sorted.length; i++) {
    if (isConsecutive(sorted[i - 1], sorted[i])) {
      current++
      if (current > best) best = current
    } else {
      current = 1
    }
  }

  return best
}

/**
 * Процент выполнения за последние `days` дней (0–100).
 * Включая сегодня.
 */
export function getCompletionRate(
  completions: HabitCompletion[],
  habitId: string,
  days: number,
  today: string = getToday()
): number {
  if (days <= 0) return 0

  const todayDate = parseDate(today)
  const fromDate = new Date(todayDate)
  fromDate.setUTCDate(fromDate.getUTCDate() - (days - 1))

  const range = getDaysBetween(formatDate(fromDate), today)
  const dates = new Set(getCompletionsForHabit(completions, habitId))

  const done = range.filter((d) => dates.has(d)).length

  return Math.round((done / days) * 100)
}

/*Оставляет привычки, у которых id не совпадает с удаляемым*/
export function removeHabit(
  habits: Habit[],
  habitId: string
): Habit[] {
  return habits.filter((h) => h.id !== habitId)
}
/*Убирает все отметки указанной привычки*/
export function removeCompletionsForHabit(
  completions: HabitCompletion[],
  habitId: string
): HabitCompletion[] {
  return completions.filter((c) => c.habitId !== habitId)
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function getMotivation(streak: number): Motivation | null {
  if (streak >= 30) return { text: 'A month! Incredible!', emoji: '👑' }
  if (streak >= 14) return { text: 'Two weeks! Legendary!', emoji: '💎' }
  if (streak >= 7) return { text: 'Bingo! One full week!', emoji: '🏆' }
  if (streak >= 5) return { text: 'Five days — impressive!', emoji: '🎯' }
  if (streak >= 3) return { text: "You're on fire!", emoji: '🔥' }
  if (streak >= 2) return { text: 'Two days in a row!', emoji: '✨' }
  if (streak >= 1) return { text: 'Day one. Keep going!', emoji: '🌱' }
  return null
}