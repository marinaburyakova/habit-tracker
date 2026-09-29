import {
  Crown,
  Gem,
  Trophy,
  Target,
  Flame,
  Sparkles,
  Sprout,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Habit = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
};

export type HabitCompletion = {
  habitId: string;
  date: string;
};

export type Motivation = {
  text: string;
  icon: LucideIcon;
};

/**
 * Форматирует Date в строку `YYYY-MM-DD` по UTC.
 *
 * Использует UTC-методы (`getUTCFullYear`, `getUTCMonth`, `getUTCDate`),
 * а не локальные, чтобы результат не зависел от TZ окружения. Иначе на
 * сервере в UTC и на клиенте в Москве одна и та же дата дала бы разные
 * строки — рассинхрон и баги в аналитике привычек.
 *
 * @param date - Любая Date
 * @returns Строка вида `'2026-09-28'` в UTC
 *
 * @example
 * formatDate(new Date('2026-09-28T14:30:00Z'))  // '2026-09-28'
 * formatDate(new Date('2026-09-28T23:00:00Z'))  // '2026-09-28'
 */
export function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Возвращает сегодняшнюю дату в формате `YYYY-MM-DD` (UTC).
 *
 * Обёртка над `formatDate(new Date())`. Используется как дефолтное
 * значение для функций, которым нужен «сегодняшний день».
 *
 * @returns Строка вида `'2026-09-28'` в UTC
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * Парсит строку даты в Date и проверяет валидность.
 *
 * В отличие от `new Date(str)`, который на мусоре возвращает
 * `Invalid Date` (без исключения), эта функция **бросает ошибку**.
 * Это защищает от тихого распространения `NaN` по вычислениям.
 *
 * @param str - Строка в формате `YYYY-MM-DD` (или любой, которую понимает Date)
 * @returns Валидный Date
 * @throws Error если строка не парсится
 *
 * @example
 * parseDate('2026-09-28')  // Date
 * parseDate('abc')         // throws Error: Invalid date: "abc"
 */
export function parseDate(str: string): Date {
  const date = new Date(str);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: "${str}". Expected format YYYY-MM-DD.`);
  }
  return date;
}

/**
 * Считает количество дней между двумя датами.
 *
 * Округляет до целого — на случай перехода на летнее время, когда
 * разница в миллисекундах не кратна 24 часам. Результат положительный,
 * если `b` позже `a`, отрицательный — если раньше.
 *
 * @param a - Начальная дата `YYYY-MM-DD`
 * @param b - Конечная дата `YYYY-MM-DD`
 * @returns Число дней (может быть отрицательным)
 *
 * @example
 * daysBetween('2026-09-28', '2026-09-30')  // 2
 * daysBetween('2026-09-30', '2026-09-28')  // -2
 */
export function daysBetween(a: string, b: string): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const timeA = parseDate(a).getTime();
  const timeB = parseDate(b).getTime();
  return Math.round((timeB - timeA) / MS_PER_DAY);
}

/**
 * Проверяет, что `b` — следующий день после `a`.
 *
 * Используется для построения серий (streak): две отметки идут подряд,
 * если разница ровно 1 день.
 *
 * @param a - Предыдущая дата `YYYY-MM-DD`
 * @param b - Следующая дата `YYYY-MM-DD`
 * @returns `true` если `b` ровно на день позже `a`
 *
 * @example
 * isConsecutive('2026-09-28', '2026-09-29')  // true
 * isConsecutive('2026-09-28', '2026-09-30')  // false
 */
export function isConsecutive(a: string, b: string): boolean {
  return daysBetween(a, b) === 1;
}

/**
 * Возвращает массив всех дат в диапазоне `[from, to]` включительно.
 *
 * Шагает по дню через `setUTCDate`, чтобы не зависеть от TZ.
 * Если `from > to` — вернёт пустой массив.
 *
 * @param from - Начальная дата `YYYY-MM-DD` (включительно)
 * @param to - Конечная дата `YYYY-MM-DD` (включительно)
 * @returns Массив строк `YYYY-MM-DD` в порядке возрастания
 *
 * @example
 * getDaysBetween('2026-09-28', '2026-10-01')
 * // ['2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01']
 */
export function getDaysBetween(from: string, to: string): string[] {
  const result: string[] = [];
  const current = parseDate(from);
  const end = parseDate(to);

  while (current <= end) {
    result.push(formatDate(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return result;
}

// ─────────────────────────────────────────
// Привычки
// ─────────────────────────────────────────

/**
 * Создаёт новую привычку с уникальным id.
 *
 * `id` генерируется через `crypto.randomUUID()` — не требует
 * библиотек, доступен в браузере и Node 19+. `createdAt` —
 * сегодняшняя дата в UTC.
 *
 * @param name - Название привычки
 * @param color - Цвет (hex, css-переменная или имя)
 * @returns Новый объект Habit
 *
 * @example
 * createHabit('Read', '#3b82f6')
 * // { id: '...', name: 'Read', color: '#3b82f6', createdAt: '2026-09-28' }
 */
export function createHabit(name: string, color: string): Habit {
  return {
    id: crypto.randomUUID(),
    name,
    color,
    createdAt: getToday(),
  };
}

// ─────────────────────────────────────────
// Отметки (CRUD)
// ─────────────────────────────────────────

/**
 * Проверяет, отмечена ли привычка на указанную дату.
 *
 * @param completions - Все отметки
 * @param habitId - id привычки
 * @param date - Дата `YYYY-MM-DD`
 * @returns `true` если отметка существует
 */
export function isCompleted(
  completions: HabitCompletion[],
  habitId: string,
  date: string
): boolean {
  return completions.some((c) => c.habitId === habitId && c.date === date);
}

/**
 * Добавляет отметку, если её ещё нет (идемпотентно).
 *
 * Если отметка уже существует — возвращает **тот же** массив,
 * не создавая новый. Это позволяет React не перерендеривать лишний раз.
 *
 * @param completions - Текущие отметки
 * @param habitId - id привычки
 * @param date - Дата `YYYY-MM-DD`
 * @returns Новый массив с добавленной отметкой (или исходный, если уже есть)
 */
export function addCompletion(
  completions: HabitCompletion[],
  habitId: string,
  date: string
): HabitCompletion[] {
  if (isCompleted(completions, habitId, date)) {
    return completions;
  }
  return [...completions, { habitId, date }];
}

/**
 * Удаляет отметку привычки на указанную дату.
 *
 * Если отметки нет — возвращает новый массив **без изменений**
 * (не мутирует исходный). Иммутабельность важна для React.
 *
 * @param completions - Текущие отметки
 * @param habitId - id привычки
 * @param date - Дата `YYYY-MM-DD`
 * @returns Новый массив без указанной отметки
 */
export function removeCompletion(
  completions: HabitCompletion[],
  habitId: string,
  date: string
): HabitCompletion[] {
  const isSame = (c: HabitCompletion) =>
    c.habitId === habitId && c.date === date;
  return completions.filter((c) => !isSame(c));
}

/**
 * Переключает отметку: ставит, если нет; снимает, если есть.
 *
 * Удобно для клика по дню в UI. Делегирует в `addCompletion`
 * или `removeCompletion` в зависимости от текущего состояния.
 *
 * @param completions - Текущие отметки
 * @param habitId - id привычки
 * @param date - Дата `YYYY-MM-DD`
 * @returns Новый массив с переключённой отметкой
 */
export function toggleCompletion(
  completions: HabitCompletion[],
  habitId: string,
  date: string
): HabitCompletion[] {
  return isCompleted(completions, habitId, date)
    ? removeCompletion(completions, habitId, date)
    : addCompletion(completions, habitId, date);
}

// ─────────────────────────────────────────
// Аналитика
// ─────────────────────────────────────────

/**
 * Возвращает все даты, когда привычка была отмечена.
 *
 * @param completions - Все отметки
 * @param habitId - id привычки
 * @returns Массив дат `YYYY-MM-DD` (в порядке добавления, не сортированный)
 */
export function getCompletionsForHabit(
  completions: HabitCompletion[],
  habitId: string
): string[] {
  return completions.filter((c) => c.habitId === habitId).map((c) => c.date);
}

/**
 * Проверяет, отмечена ли привычка сегодня.
 *
 * @param completions - Все отметки
 * @param habitId - id привычки
 * @param today - Сегодняшняя дата (по умолчанию — `getToday()`)
 * @returns `true` если отмечена сегодня
 */
export function isCompletedToday(
  completions: HabitCompletion[],
  habitId: string,
  today: string = getToday()
): boolean {
  return isCompleted(completions, habitId, today);
}

/**
 * Считает текущую серию (streak) — сколько дней подряд привычка
 * отмечалась **до сегодня**.
 *
 * «Мягкий» streak: серия считается живой, если последняя отметка —
 * сегодня ИЛИ вчера. Это даёт пользователю день «на отметку», не
 * обнуляя серию сразу после полуночи.
 *
 * Алгоритм:
 * 1. Берём уникальные даты, сортируем.
 * 2. Если последняя не сегодня и не вчера — серия мертва, возвращаем 0.
 * 3. Иначе идём назад и считаем подряд идущие дни.
 *
 * @param completions - Все отметки
 * @param habitId - id привычки
 * @param today - Сегодняшняя дата (по умолчанию — `getToday()`)
 * @returns Длина текущей серии (0, если серия прервана)
 *
 * @example
 * // Отметки: 25, 26, 27, 28 сентября; today = 28
 * calculateStreak(...)  // 4
 *
 * // Отметки: 25, 26, 27 сентября; today = 28
 * calculateStreak(...)  // 3 (последняя — вчера, серия жива)
 *
 * // Отметки: 25, 26 сентября; today = 28
 * calculateStreak(...)  // 0 (пропущен 27-й)
 */
export function calculateStreak(
  completions: HabitCompletion[],
  habitId: string,
  today: string = getToday()
): number {
  const dates = getCompletionsForHabit(completions, habitId);
  if (dates.length === 0) return 0;

  const sorted = [...new Set(dates)].sort();
  const last = sorted[sorted.length - 1];

  const isActive = last === today || isConsecutive(last, today);
  if (!isActive) return 0;

  let streak = 1;
  for (let i = sorted.length - 2; i >= 0; i--) {
    if (isConsecutive(sorted[i], sorted[i + 1])) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Считает самую длинную серию (streak) за всё время.
 *
 * В отличие от `calculateStreak`, не зависит от `today` — ищет
 * максимальную последовательность подряд идущих дней в истории.
 *
 * @param completions - Все отметки
 * @param habitId - id привычки
 * @returns Длина самой длинной серии (0, если отметок нет)
 *
 * @example
 * // Отметки: 1, 2, 3, 10, 11, 12, 13, 20 сентября
 * longestStreak(...)  // 4 (10–13)
 */
export function longestStreak(
  completions: HabitCompletion[],
  habitId: string
): number {
  const dates = getCompletionsForHabit(completions, habitId);
  if (dates.length === 0) return 0;

  const sorted = [...new Set(dates)].sort();

  let best = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (isConsecutive(sorted[i - 1], sorted[i])) {
      current++;
      if (current > best) best = current;
    } else {
      current = 1;
    }
  }

  return best;
}

/**
 * Считает процент выполнения за последние `days` дней (0–100).
 *
 * Включает сегодня. Например, `days = 7` — проверяет 7 дней:
 * сегодня и 6 предыдущих. Округляет до целого.
 *
 * @param completions - Все отметки
 * @param habitId - id привычки
 * @param days - Количество дней (включая сегодня)
 * @param today - Сегодняшняя дата (по умолчанию — `getToday()`)
 * @returns Процент от 0 до 100
 *
 * @example
 * // 5 отметок за последние 7 дней
 * getCompletionRate(..., days=7)  // 71
 */
export function getCompletionRate(
  completions: HabitCompletion[],
  habitId: string,
  days: number,
  today: string = getToday()
): number {
  if (days <= 0) return 0;

  const todayDate = parseDate(today);
  const fromDate = new Date(todayDate);
  fromDate.setUTCDate(fromDate.getUTCDate() - (days - 1));

  const range = getDaysBetween(formatDate(fromDate), today);
  const dates = new Set(getCompletionsForHabit(completions, habitId));

  const done = range.filter((d) => dates.has(d)).length;

  return Math.round((done / days) * 100);
}

/**
 * Удаляет привычку из списка по id.
 *
 * Иммутабельно: возвращает новый массив. Отметки привычки
 * **не трогает** — для них отдельная `removeCompletionsForHabit`.
 *
 * @param habits - Текущий список привычек
 * @param habitId - id удаляемой привычки
 * @returns Новый массив без удалённой привычки
 */
export function removeHabit(habits: Habit[], habitId: string): Habit[] {
  return habits.filter((h) => h.id !== habitId);
}

/**
 * Удаляет все отметки указанной привычки.
 *
 * Вызывается **вместе** с `removeHabit`, чтобы не оставлять
 * «осиротевшие» отметки в хранилище.
 *
 * @param completions - Все отметки
 * @param habitId - id привычки
 * @returns Новый массив без отметок удалённой привычки
 */
export function removeCompletionsForHabit(
  completions: HabitCompletion[],
  habitId: string
): HabitCompletion[] {
  return completions.filter((c) => c.habitId !== habitId);
}

/**
 * Возвращает сегодняшнюю дату в ISO-формате `YYYY-MM-DD`.
 *
 * В отличие от `getToday()` использует **локальную** дату через
 * `toISOString().slice(0, 10)`. Внимание: `toISOString` даёт UTC,
 * поэтому на границе суток результат может отличаться от локального
 * «сегодня». Для консистентности с `getToday()` лучше использовать её.
 *
 * @returns Строка `YYYY-MM-DD` (по UTC)
 * @deprecated Используй `getToday()` — он явно работает в UTC и согласован с остальными функциями.
 */
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Возвращает мотивационное сообщение по длине серии.
 *
 * Чем длиннее streak, тем «круче» текст и иконка. Возвращает
 * `null` при streak = 0 — нечего мотивировать.
 *
 * @param streak - Длина текущей серии
 * @returns Объект `{ text, icon }` или `null`
 *
 * @example
 * getMotivation(0)   // null
 * getMotivation(1)   // { text: 'Day one. Keep going!',  icon: Sprout }
 * getMotivation(30)  // { text: 'A month! Incredible!', icon: Crown }
 */
export function getMotivation(streak: number): Motivation | null {
  if (streak >= 30) return { text: 'A month! Incredible!', icon: Crown };
  if (streak >= 14) return { text: 'Two weeks! Legendary!', icon: Gem };
  if (streak >= 7) return { text: 'Bingo! One full week!', icon: Trophy };
  if (streak >= 5) return { text: 'Five days — impressive!', icon: Target };
  if (streak >= 3) return { text: "You're on fire!", icon: Flame };
  if (streak >= 2) return { text: 'Two days in a row!', icon: Sparkles };
  if (streak >= 1) return { text: 'Day one. Keep going!', icon: Sprout };
  return null;
}
