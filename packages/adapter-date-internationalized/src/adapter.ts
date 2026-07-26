/**
 * @internationalized/date adapter — wraps engine behind DateMathCapability@1.
 * Returns primitive DateValue objects, never CalendarDate instances.
 */

import type { DateMathCapability, DateValue, MonthGrid, DateMathInput } from "./capability"

/** Creates the @internationalized/date adapter. Synchronous arithmetic fallback. */
export function createInternationalizedDateAdapter(): DateMathCapability {
  const daysInMonth = (year: number, month: number): number => new Date(year, month, 0).getDate()
  const dayOfWeek = (year: number, month: number, day: number): number =>
    new Date(year, month - 1, day).getDay()

  const getMonthGrid = (input: DateMathInput): MonthGrid => {
    const { date, weekStartsOn = 0 } = input
    const { year, month } = date
    const total = daysInMonth(year, month)
    const firstDay = dayOfWeek(year, month, 1)
    const offset = (firstDay - weekStartsOn + 7) % 7
    const weeks: number[][] = []
    let week: number[] = new Array(offset).fill(0)
    for (let d = 1; d <= total; d++) {
      week.push(d)
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(0)
      weeks.push(week)
    }
    return { year, month, weeks, daysInMonth: total }
  }

  const addMonths = (date: DateValue, months: number): DateValue => {
    let { year, month, day } = date
    month += months
    while (month > 12) {
      month -= 12
      year++
    }
    while (month < 1) {
      month += 12
      year--
    }
    day = Math.min(day, daysInMonth(year, month))
    return { year, month, day }
  }

  const isSameDay = (a: DateValue, b: DateValue): boolean =>
    a.year === b.year && a.month === b.month && a.day === b.day

  const isInRange = (date: DateValue, start: DateValue, end: DateValue): boolean => {
    const n = (d: DateValue) => d.year * 10000 + d.month * 100 + d.day
    return n(date) >= n(start) && n(date) <= n(end)
  }

  return { getMonthGrid, addMonths, isSameDay, isInRange, destroy: () => {} }
}
