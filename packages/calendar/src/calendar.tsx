/**
 * @solidiom/calendar — Headless calendar primitive with month navigation and date selection.
 *
 * Parts: Root, Header, PrevButton, Title, NextButton, Grid, Cell.
 * Supports keyboard navigation, disabled dates, today highlighting, configurable week start.
 */

import { type Accessor, createSignal, createMemo } from "solid-js"
import { type JSX } from "@solidjs/web"
import { createControllableValue, createChangeDetails, applySemanticAttrs } from "@solidiom/runtime"
import {
  CalendarContext,
  useCalendarContext,
  type DateValue,
  type CalendarDateMathPort,
} from "./calendar-context"

// ─── Default Gregorian Implementation ──────────────────────────────────────────

function daysInMonthCount(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/** Default Gregorian date math implementation. No external dependencies. */
export const gregorianDateMath: CalendarDateMathPort = {
  getMonthGrid({ date, weekStartsOn = 0 }) {
    const totalDays = daysInMonthCount(date.year, date.month)
    const startDay = new Date(date.year, date.month - 1, 1).getDay()
    const offset = (startDay - weekStartsOn + 7) % 7
    const weeks: number[][] = []
    let day = 1 - offset
    for (let w = 0; w < 6; w++) {
      const row: number[] = []
      for (let d = 0; d < 7; d++) {
        row.push(day < 1 || day > totalDays ? 0 : day)
        day++
      }
      if (row.every((d) => d === 0) && w >= 4) break
      weeks.push(row)
    }
    return { weeks, daysInMonth: totalDays }
  },
  addMonths(date, months) {
    let m = date.month + months
    let y = date.year
    while (m > 12) {
      m -= 12
      y++
    }
    while (m < 1) {
      m += 12
      y--
    }
    return { year: y, month: m, day: Math.min(date.day, daysInMonthCount(y, m)) }
  },
  isSameDay(a, b) {
    return a.year === b.year && a.month === b.month && a.day === b.day
  },
  isInRange(date, start, end) {
    const v = date.year * 10000 + date.month * 100 + date.day
    return (
      v >= start.year * 10000 + start.month * 100 + start.day &&
      v <= end.year * 10000 + end.month * 100 + end.day
    )
  },
}

/** Adjusts a date by a number of days, crossing month boundaries. */
function adjustDay(date: DateValue, days: number): DateValue {
  const d = new Date(date.year, date.month - 1, date.day + days)
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
}

// ─── Root ──────────────────────────────────────────────────────────────────────

/** Props for the Calendar Root component. */
export interface CalendarRootProps {
  dateMath?: CalendarDateMathPort
  value?: Accessor<DateValue | undefined>
  defaultValue?: DateValue
  onValueChange?: (date: DateValue) => void
  isDateDisabled?: (date: DateValue) => boolean
  weekStartsOn?: number
  class?: string
  children: JSX.Element
}

/** Calendar Root — manages month state, date selection, and focused date. */
export function Root(props: CalendarRootProps) {
  const dateMath = props.dateMath ?? gregorianDateMath
  const weekStartsOn = props.weekStartsOn ?? 0
  const today: DateValue = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  }
  const initial = props.defaultValue ?? today
  const [focusedMonth, setFocusedMonth] = createSignal<DateValue>({
    year: initial.year,
    month: initial.month,
    day: 1,
  })
  const [focusedDate, setFocusedDate] = createSignal<DateValue>(initial)

  const { value: selectedDate, requestChange } = createControllableValue<
    DateValue | undefined,
    "select"
  >({
    value: props.value as Accessor<DateValue | undefined>,
    defaultValue: props.defaultValue,
    onChange: (next) => {
      if (next) props.onValueChange?.(next)
    },
    equals: (a, b) => {
      if (!a && !b) return true
      if (!a || !b) return false
      return dateMath.isSameDay(a, b)
    },
  })

  const navigateMonth = (delta: number) => {
    const next = dateMath.addMonths(focusedMonth(), delta)
    setFocusedMonth(next)
    setFocusedDate({ ...next, day: 1 })
  }

  const contextValue = {
    focusedMonth,
    focusedDate,
    selectedDate: selectedDate as Accessor<DateValue | undefined>,
    prevMonth: () => navigateMonth(-1),
    nextMonth: () => navigateMonth(1),
    selectDate: (date: DateValue) => {
      if (props.isDateDisabled?.(date)) return
      requestChange(date, createChangeDetails("select"))
      setFocusedDate(date)
    },
    setFocusedDate: (date: DateValue) => {
      setFocusedDate(date)
      if (date.month !== focusedMonth().month || date.year !== focusedMonth().year) {
        setFocusedMonth({ year: date.year, month: date.month, day: 1 })
      }
    },
    isDateDisabled: (date: DateValue) => props.isDateDisabled?.(date) ?? false,
    isToday: (date: DateValue) => dateMath.isSameDay(date, today),
    dateMath,
    weekStartsOn,
  }

  return (
    <CalendarContext value={contextValue}>
      <div
        role="application"
        aria-label="Calendar"
        class={props.class}
        {...applySemanticAttrs({ scope: "calendar", part: "root" })}
      >
        {props.children}
      </div>
    </CalendarContext>
  )
}

// ─── Header ────────────────────────────────────────────────────────────────────

/** Props for the Calendar Header. */
export interface CalendarHeaderProps {
  children: JSX.Element
}

/** Calendar Header — container for navigation controls. */
export function Header(props: CalendarHeaderProps) {
  return <div {...applySemanticAttrs({ scope: "calendar", part: "header" })}>{props.children}</div>
}

// ─── PrevButton ────────────────────────────────────────────────────────────────

/** Props for Calendar PrevButton. */
export interface CalendarPrevButtonProps {
  children?: JSX.Element
}

/** Calendar PrevButton — navigates to the previous month. */
export function PrevButton(props: CalendarPrevButtonProps) {
  const ctx = useCalendarContext()
  return (
    <button
      type="button"
      aria-label="Previous month"
      onClick={() => ctx.prevMonth()}
      {...applySemanticAttrs({ scope: "calendar", part: "prev-button" })}
    >
      {props.children ?? "←"}
    </button>
  )
}

// ─── Title ─────────────────────────────────────────────────────────────────────

/** Props for Calendar Title. */
export interface CalendarTitleProps {
  children?: JSX.Element
}

/** Calendar Title — displays current month/year with aria-live. */
export function Title(props: CalendarTitleProps) {
  const ctx = useCalendarContext()
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const label = createMemo(() => {
    const m = ctx.focusedMonth()
    return `${MONTHS[m.month - 1]} ${m.year}`
  })
  return (
    <div
      aria-live="polite"
      role="heading"
      aria-level={2}
      {...applySemanticAttrs({ scope: "calendar", part: "title" })}
    >
      {props.children ?? label()}
    </div>
  )
}

// ─── NextButton ────────────────────────────────────────────────────────────────

/** Props for Calendar NextButton. */
export interface CalendarNextButtonProps {
  children?: JSX.Element
}

/** Calendar NextButton — navigates to the next month. */
export function NextButton(props: CalendarNextButtonProps) {
  const ctx = useCalendarContext()
  return (
    <button
      type="button"
      aria-label="Next month"
      onClick={() => ctx.nextMonth()}
      {...applySemanticAttrs({ scope: "calendar", part: "next-button" })}
    >
      {props.children ?? "→"}
    </button>
  )
}

// ─── Grid ──────────────────────────────────────────────────────────────────────

/** Props for Calendar Grid. */
export interface CalendarGridProps {
  children?: (weeks: number[][]) => JSX.Element
}

/**
 * Calendar Grid — renders month grid with keyboard navigation.
 *
 * Keys: Arrow Left/Right/Up/Down (±1/±7 days), PageUp/Down (±month),
 * Home/End (first/last day), Enter/Space (select).
 */
export function Grid(props: CalendarGridProps) {
  const ctx = useCalendarContext()
  const grid = createMemo(() =>
    ctx.dateMath.getMonthGrid({ date: ctx.focusedMonth(), weekStartsOn: ctx.weekStartsOn }),
  )

  const handleKeyDown = (event: KeyboardEvent) => {
    const focused = ctx.focusedDate()
    let next: DateValue | undefined
    switch (event.key) {
      case "ArrowLeft":
        next = adjustDay(focused, -1)
        break
      case "ArrowRight":
        next = adjustDay(focused, 1)
        break
      case "ArrowUp":
        next = adjustDay(focused, -7)
        break
      case "ArrowDown":
        next = adjustDay(focused, 7)
        break
      case "PageUp":
        next = ctx.dateMath.addMonths(focused, -1)
        break
      case "PageDown":
        next = ctx.dateMath.addMonths(focused, 1)
        break
      case "Home":
        next = { ...focused, day: 1 }
        break
      case "End":
        next = { ...focused, day: grid().daysInMonth }
        break
      case "Enter":
      case " ":
        event.preventDefault()
        ctx.selectDate(focused)
        return
      default:
        return
    }
    event.preventDefault()
    if (next) ctx.setFocusedDate(next)
  }

  return (
    <table
      role="grid"
      aria-label="Calendar grid"
      onKeyDown={handleKeyDown}
      {...applySemanticAttrs({ scope: "calendar", part: "grid" })}
    >
      <tbody>{props.children ? props.children(grid().weeks) : null}</tbody>
    </table>
  )
}

// ─── Cell ──────────────────────────────────────────────────────────────────────

/** Props for Calendar Cell. */
export interface CalendarCellProps {
  day: number
  children?: JSX.Element
}

/** Calendar Cell — single day with selection, focus, today, and disabled states. */
export function Cell(props: CalendarCellProps) {
  const ctx = useCalendarContext()
  const date = (): DateValue => ({ ...ctx.focusedMonth(), day: props.day })
  const isSelected = () => {
    const sel = ctx.selectedDate()
    return sel ? ctx.dateMath.isSameDay(sel, date()) : false
  }
  const isFocused = () => ctx.dateMath.isSameDay(ctx.focusedDate(), date())
  const isDisabled = () => ctx.isDateDisabled(date())
  const isTodayCell = () => ctx.isToday(date())

  return (
    <td
      role="gridcell"
      tabindex={isFocused() ? 0 : -1}
      aria-selected={isSelected() ? "true" : undefined}
      aria-disabled={isDisabled() ? "true" : undefined}
      data-today={isTodayCell() ? "" : undefined}
      onClick={() => {
        if (!isDisabled()) ctx.selectDate(date())
      }}
      {...applySemanticAttrs({
        scope: "calendar",
        part: "cell",
        disabled: isDisabled(),
        selected: isSelected(),
        highlighted: isTodayCell(),
      })}
    >
      {props.children ?? props.day}
    </td>
  )
}
