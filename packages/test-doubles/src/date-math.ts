/**
 * Deterministic date math test double — implements DateMathCapability@1.
 *
 * Returns primitive-representable values (no CalendarDate classes per §23 #11, #64).
 * Zero engine dependencies. Deterministic for fixed input.
 */

/** A date represented as primitive values (year, month, day). */
export interface DateValue {
  year: number
  /** 1-based month (1=January, 12=December). */
  month: number
  /** 1-based day of month. */
  day: number
}

/** A month grid for calendar display. */
export interface MonthGrid {
  /** Year of this month. */
  year: number
  /** 1-based month. */
  month: number
  /** Weeks as arrays of day numbers (0 = empty cell). */
  weeks: number[][]
  /** Total days in this month. */
  daysInMonth: number
}

/** Input for date math operations. */
export interface DateMathInput {
  /** The reference date. */
  date: DateValue
  /** First day of week (0=Sunday, 1=Monday). */
  weekStartsOn?: number
}

/** DateMathCapability@1 port shape. */
export interface DateMathCapability {
  /** Get the month grid for calendar display. */
  getMonthGrid(input: DateMathInput): MonthGrid
  /** Add months to a date. */
  addMonths(date: DateValue, months: number): DateValue
  /** Check if two dates are the same day. */
  isSameDay(a: DateValue, b: DateValue): boolean
  /** Check if a date is within a range (inclusive). */
  isInRange(date: DateValue, start: DateValue, end: DateValue): boolean
  destroy(): void
}

/**
 * Deterministic date math double.
 *
 * Uses basic arithmetic — no timezone, locale, or calendar system awareness.
 */
export function createDateMathDouble(): DateMathCapability {
  const daysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate()
  }

  const dayOfWeek = (year: number, month: number, day: number): number => {
    return new Date(year, month - 1, day).getDay()
  }

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
    const maxDay = daysInMonth(year, month)
    day = Math.min(day, maxDay)
    return { year, month, day }
  }

  const isSameDay = (a: DateValue, b: DateValue): boolean => {
    return a.year === b.year && a.month === b.month && a.day === b.day
  }

  const isInRange = (date: DateValue, start: DateValue, end: DateValue): boolean => {
    const toNum = (d: DateValue) => d.year * 10000 + d.month * 100 + d.day
    const n = toNum(date)
    return n >= toNum(start) && n <= toNum(end)
  }

  const destroy = (): void => {}

  return { getMonthGrid, addMonths, isSameDay, isInRange, destroy }
}
