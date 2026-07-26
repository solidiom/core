/**
 * Date-picker context — shared state, port interfaces, and default date math.
 */

import { createContext, useContext, type Accessor } from "solid-js"
import type { ChangeDetails, DisclosureReason, PresencePhase } from "@solidiom/runtime"

// ─── Port Interfaces ───────────────────────────────────────────────────────────

/** A calendar date value (year/month/day). */
export interface DateValue {
  year: number
  month: number
  day: number
}

/**
 * Adapter port for date math operations.
 * Consumers inject an implementation (e.g. @solidiom/adapter-date-internationalized).
 * A fallback is provided for basic Gregorian calendar math.
 */
export interface CalendarDateMathPort {
  getMonthGrid(input: { date: DateValue; weekStartsOn?: number }): {
    weeks: number[][]
    daysInMonth: number
  }
  addMonths(date: DateValue, months: number): DateValue
  isSameDay(a: DateValue, b: DateValue): boolean
  isInRange(date: DateValue, start: DateValue, end: DateValue): boolean
}

// ─── Default Date Math (Gregorian) ─────────────────────────────────────────────

/** Returns the number of days in a given month. */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/** Creates a Gregorian fallback port when no adapter is provided. */
export function createDefaultDateMath(): CalendarDateMathPort {
  return {
    getMonthGrid(input) {
      const { date, weekStartsOn = 0 } = input
      const daysInMonth = getDaysInMonth(date.year, date.month)
      const firstDayOfWeek = new Date(date.year, date.month - 1, 1).getDay()
      const offset = (firstDayOfWeek - weekStartsOn + 7) % 7

      const weeks: number[][] = []
      let currentWeek: number[] = new Array(offset).fill(0) as number[]

      for (let day = 1; day <= daysInMonth; day++) {
        currentWeek.push(day)
        if (currentWeek.length === 7) {
          weeks.push(currentWeek)
          currentWeek = []
        }
      }
      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) currentWeek.push(0)
        weeks.push(currentWeek)
      }

      return { weeks, daysInMonth }
    },

    addMonths(date, months) {
      const d = new Date(date.year, date.month - 1 + months, 1)
      return { year: d.getFullYear(), month: d.getMonth() + 1, day: 1 }
    },

    isSameDay(a, b) {
      return a.year === b.year && a.month === b.month && a.day === b.day
    },

    isInRange(date, start, end) {
      const d = new Date(date.year, date.month - 1, date.day).getTime()
      const s = new Date(start.year, start.month - 1, start.day).getTime()
      const e = new Date(end.year, end.month - 1, end.day).getTime()
      return d >= s && d <= e
    },
  }
}

/** Formats a DateValue as YYYY-MM-DD. */
export function defaultFormatDate(date: DateValue): string {
  const y = String(date.year)
  const m = String(date.month).padStart(2, "0")
  const d = String(date.day).padStart(2, "0")
  return `${y}-${m}-${d}`
}

/** Returns today's date as a DateValue. */
export function today(): DateValue {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }
}

// ─── Context Value ─────────────────────────────────────────────────────────────

export interface DatePickerContextValue {
  open: Accessor<boolean>
  requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void
  value: Accessor<DateValue | undefined>
  setValue: (date: DateValue | undefined) => void
  focusedDate: Accessor<DateValue>
  setFocusedDate: (date: DateValue) => void
  viewingMonth: Accessor<DateValue>
  setViewingMonth: (date: DateValue) => void
  dateMath: CalendarDateMathPort
  isDateDisabled: (date: DateValue) => boolean
  formatDate: (date: DateValue) => string
  contentId: string
  triggerId: string
  inputId: string
  phase: Accessor<PresencePhase>
  present: Accessor<boolean>
}

export const DatePickerContext = createContext<DatePickerContextValue>()

/** Access date-picker context from descendant parts. */
export function useDatePickerContext(): DatePickerContextValue {
  const ctx = useContext(DatePickerContext)
  if (!ctx) {
    throw new Error("[solidiom] DatePicker parts must be used within DatePicker.Root")
  }
  return ctx
}
