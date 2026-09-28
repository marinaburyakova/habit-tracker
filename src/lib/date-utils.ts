/**
 * Утилиты для работы с датами в календаре и heatmap.
 * Все вычисления — в UTC. Форматирование — через Intl с явной TZ.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** YYYY-MM-DD из Date (UTC) */
export function formatDayKey(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Date (UTC полночь) из YYYY-MM-DD */
export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

/** Сдвиг месяца: shiftMonth(2026, 1, +1) → { year: 2026, month: 2 } */
export function shiftMonth(
  year: number,
  month: number,
  delta: number
): { year: number; month: number } {
  const total = year * 12 + (month - 1) + delta
  return {
    year: Math.floor(total / 12),
    month: (total % 12) + 1,
  }
}

/**
 * Сетка месяца: 42 дня (6 недель × 7), начиная с понедельника
 * недели, где начинается месяц.
 */
export function getMonthGrid(year: number, month: number): string[] {
  const first = new Date(Date.UTC(year, month - 1, 1))
  const jsDay = first.getUTCDay()                 // 0 = Sun
  const daysBack = (jsDay + 6) % 7                // сдвиг до пн

  const start = new Date(first)
  start.setUTCDate(start.getUTCDate() - daysBack)

  const result: string[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setUTCDate(d.getUTCDate() + i)
    result.push(formatDayKey(d))
  }
  return result
}

/** Плавающее окно вокруг today: [today - back, today + forward] */
export function getRollingWindow(
  today: string,
  back: number,
  forward: number
): string[] {
  const base = parseDayKey(today)
  const result: string[] = []
  for (let i = -back; i <= forward; i++) {
    const d = new Date(base)
    d.setUTCDate(d.getUTCDate() + i)
    result.push(formatDayKey(d))
  }
  return result
}

/** Метка дня: "Today", "Tomorrow" или "Mon, 28 Sep" */
export function getDayLabel(dayKey: string, today: string): string {
  if (dayKey === today) return 'Today'

  const tomorrow = new Date(parseDayKey(today))
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  if (dayKey === formatDayKey(tomorrow)) return 'Tomorrow'

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(parseDayKey(dayKey))
}

/** Подпись месяца: "September 2026" */
export function getMonthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    month: 'long',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, 1)))
}

export { MS_PER_DAY }