import { describe, it, expect } from 'vitest';
import {
  formatDayKey,
  parseDayKey,
  shiftMonth,
  getMonthGrid,
  getRollingWindow,
  getDayLabel,
  getMonthLabel,
  MS_PER_DAY,
} from './date-utils';

describe('date-utils', () => {
  it('должен содержать правильное количество миллисекунд в сутках', () => {
    expect(MS_PER_DAY).toBe(24 * 60 * 60 * 1000);
  });

  it('formatDayKey должен форматировать дату в UTC строку YYYY-MM-DD', () => {
    const date = new Date(Date.UTC(2026, 8, 29)); // 29 сентября 2026
    expect(formatDayKey(date)).toBe('2026-09-29');
  });

  it('parseDayKey должен создавать корректный объект Date в UTC', () => {
    const date = parseDayKey('2026-09-29');
    expect(date.getUTCFullYear()).toBe(2026);
    expect(date.getUTCMonth()).toBe(8); // Сентябрь (0-индексируемый)
    expect(date.getUTCDate()).toBe(29);
  });

  it('shiftMonth должен корректно сдвигать месяцы вперед и назад', () => {
    // Вперед на 1 месяц внутри одного года
    expect(shiftMonth(2026, 1, 1)).toEqual({ year: 2026, month: 2 });
    // Назад через границу года
    expect(shiftMonth(2026, 1, -1)).toEqual({ year: 2025, month: 12 });
    // Вперед на год (12 месяцев)
    expect(shiftMonth(2026, 5, 12)).toEqual({ year: 2027, month: 5 });
  });

  it('getMonthGrid должен генерировать ровно 42 дня, начиная с понедельника', () => {
    // Сентябрь 2026 начинается во вторник (01.09), сетка должна начаться с понедельника (31.08)
    const grid = getMonthGrid(2026, 9);
    expect(grid).toHaveLength(42);
    expect(grid[0]).toBe('2026-08-31'); // Понедельник
    expect(grid[41]).toBe('2026-10-11'); // Конец сетки
  });

  it('getRollingWindow должен генерировать плавающее окно вокруг даты', () => {
    const window = getRollingWindow('2026-09-29', 1, 2);
    expect(window).toEqual([
      '2026-09-28', // -1 день
      '2026-09-29', // Базовый день
      '2026-09-30', // +1 день
      '2026-10-01', // +2 дня
    ]);
  });

  it('getDayLabel должен возвращать понятные метки для дней', () => {
    const today = '2026-09-29';

    expect(getDayLabel('2026-09-29', today)).toBe('Today');
    expect(getDayLabel('2026-09-30', today)).toBe('Tomorrow');
    expect(getDayLabel('2026-09-28', today)).toBe('Mon 28 Sept');
  });

  it('getMonthLabel должен форматировать название месяца и год', () => {
    expect(getMonthLabel(2026, 9)).toBe('September 2026');
    expect(getMonthLabel(2027, 1)).toBe('January 2027');
  });
});
