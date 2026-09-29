
export function formatDayKey(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

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