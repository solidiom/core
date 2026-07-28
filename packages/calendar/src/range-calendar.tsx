/**
 * @solidiom/calendar — RangeCalendar primitive.
 *
 * Headless range-selection calendar with start/end/restart semantics.
 *
 * Parts: Root, Header, PrevButton, Title, NextButton, Grid, Cell.
 * Value contract: { start: DateValue; end?: DateValue }
 *
 * Selection cycle:
 * - First click sets `start` (end is cleared).
 * - Second click sets `end` (range complete).
 * - Third click restarts the cycle (new start).
 *
 * Reuses shared grid, date-math, focus, locale, RTL, and disabled-date internals
 * from the Calendar package.
 */

import { type Accessor, createSignal, createMemo } from "solid-js"
import { type JSX } from "@solidjs/web"
import { createControllableValue, createChangeDetails, applySemanticAttrs } from "@solidiom/runtime"
import { type DateValue, type CalendarDateMathPort } from "./calendar-context"
import { gregorianDateMath } from "./calendar"
import {
  RangeCalendarContext,
  useRangeCalendarContext,
  type RangeValue,
} from "./range-calendar-context"

/** Adjusts a date by a number of days, crossing month boundaries. */
function adjustDay(date: DateValue, days: number): DateValue {
  const d = new Date(date.year, date.month - 1, date.day + days)
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
}

/** Normalizes a range so start <= end. */
function normalizeRange(a: DateValue, b: DateValue): RangeValue {
  const av = a.year * 10000 + a.month * 100 + a.day
  const bv = b.year * 10000 + b.month * 100 + b.day
  return av <= bv ? { start: a, end: b } : { start: b, end: a }
}

// ─── Root ──────────────────────────────────────────────────────────────────────

/** Props for the RangeCalendar Root component. */
export interface RangeCalendarRootProps {
  dateMath?: CalendarDateMathPort
  value?: Accessor<RangeValue | undefined>
  defaultValue?: RangeValue
  onValueChange?: (range: RangeValue) => void
  isDateDisabled?: (date: DateValue) => boolean
  weekStartsOn?: number
  dir?: "ltr" | "rtl"
  class?: string
  children: JSX.Element
}

/** RangeCalendar Root — manages range selection state, month navigation, and focus. */
export function RangeRoot(props: RangeCalendarRootProps) {
  const dateMath = props.dateMath ?? gregorianDateMath
  const weekStartsOn = props.weekStartsOn ?? 0
  const dir = () => props.dir ?? "ltr"
  const today: DateValue = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  }
  const initial = props.defaultValue?.start ?? today
  const [focusedMonth, setFocusedMonth] = createSignal<DateValue>({
    year: initial.year,
    month: initial.month,
    day: 1,
  })
  const [focusedDate, setFocusedDate] = createSignal<DateValue>(initial)
  const [isSelecting, setIsSelecting] = createSignal(false)
  const [pendingStart, setPendingStart] = createSignal<DateValue | undefined>(undefined)
  const [highlightedEnd, setHighlightedEnd] = createSignal<DateValue | undefined>(undefined)

  const { value: rangeValue, requestChange } = createControllableValue<
    RangeValue | undefined,
    "select"
  >({
    value: props.value as Accessor<RangeValue | undefined>,
    defaultValue: props.defaultValue,
    onChange: (next) => {
      if (next && next.end) props.onValueChange?.(next)
    },
    equals: (a, b) => {
      if (!a && !b) return true
      if (!a || !b) return false
      return (
        dateMath.isSameDay(a.start, b.start) &&
        ((!a.end && !b.end) || (!!a.end && !!b.end && dateMath.isSameDay(a.end, b.end)))
      )
    },
  })

  const navigateMonth = (delta: number) => {
    const next = dateMath.addMonths(focusedMonth(), delta)
    setFocusedMonth(next)
    setFocusedDate({ ...next, day: 1 })
  }

  const selectDate = (date: DateValue) => {
    if (props.isDateDisabled?.(date)) return

    if (!isSelecting()) {
      // Start a new range selection
      setPendingStart(date)
      setIsSelecting(true)
      setHighlightedEnd(undefined)
      // Set partial range (start only)
      requestChange({ start: date }, createChangeDetails("select"))
      setFocusedDate(date)
    } else {
      // Complete the range
      const start = pendingStart()!
      const range = normalizeRange(start, date)
      setIsSelecting(false)
      setPendingStart(undefined)
      setHighlightedEnd(undefined)
      requestChange(range, createChangeDetails("select"))
      setFocusedDate(date)
    }
  }

  const isInRange = (date: DateValue): boolean => {
    const range = rangeValue()
    if (!range) return false

    // During selection, show preview range
    if (isSelecting()) {
      const start = pendingStart()
      const end = highlightedEnd()
      if (start && end) {
        const normalized = normalizeRange(start, end)
        return dateMath.isInRange(date, normalized.start, normalized.end!)
      }
      return start ? dateMath.isSameDay(date, start) : false
    }

    // Completed range
    if (range.end) {
      return dateMath.isInRange(date, range.start, range.end)
    }
    return dateMath.isSameDay(date, range.start)
  }

  const isRangeStart = (date: DateValue): boolean => {
    const range = rangeValue()
    if (!range) return false
    if (isSelecting()) {
      const start = pendingStart()
      const end = highlightedEnd()
      if (start && end) {
        const normalized = normalizeRange(start, end)
        return dateMath.isSameDay(date, normalized.start)
      }
      return start ? dateMath.isSameDay(date, start) : false
    }
    return dateMath.isSameDay(date, range.start)
  }

  const isRangeEnd = (date: DateValue): boolean => {
    const range = rangeValue()
    if (!range?.end && !isSelecting()) return false
    if (isSelecting()) {
      const start = pendingStart()
      const end = highlightedEnd()
      if (start && end) {
        const normalized = normalizeRange(start, end)
        return normalized.end ? dateMath.isSameDay(date, normalized.end) : false
      }
      return false
    }
    return range?.end ? dateMath.isSameDay(date, range.end) : false
  }

  const contextValue = {
    focusedMonth,
    focusedDate,
    rangeValue: rangeValue as Accessor<RangeValue | undefined>,
    highlightedEnd,
    isSelecting,
    prevMonth: () => navigateMonth(-1),
    nextMonth: () => navigateMonth(1),
    selectDate,
    setHighlightedEnd,
    setFocusedDate: (date: DateValue) => {
      setFocusedDate(date)
      if (date.month !== focusedMonth().month || date.year !== focusedMonth().year) {
        setFocusedMonth({ year: date.year, month: date.month, day: 1 })
      }
    },
    isDateDisabled: (date: DateValue) => props.isDateDisabled?.(date) ?? false,
    isToday: (date: DateValue) => dateMath.isSameDay(date, today),
    isInRange,
    isRangeStart,
    isRangeEnd,
    dateMath,
    weekStartsOn,
    dir,
  }

  return (
    <RangeCalendarContext value={contextValue}>
      <div
        role="application"
        aria-label="Range Calendar"
        dir={dir()}
        class={props.class}
        {...applySemanticAttrs({ scope: "range-calendar", part: "root" })}
      >
        {props.children}
      </div>
    </RangeCalendarContext>
  )
}

// ─── Header ────────────────────────────────────────────────────────────────────

/** Props for the RangeCalendar Header. */
export interface RangeCalendarHeaderProps {
  children: JSX.Element
}

/** RangeCalendar Header — container for navigation controls. */
export function RangeHeader(props: RangeCalendarHeaderProps) {
  return (
    <div {...applySemanticAttrs({ scope: "range-calendar", part: "header" })}>{props.children}</div>
  )
}

// ─── PrevButton ────────────────────────────────────────────────────────────────

/** Props for RangeCalendar PrevButton. */
export interface RangeCalendarPrevButtonProps {
  children?: JSX.Element
}

/** RangeCalendar PrevButton — navigates to the previous month. */
export function RangePrevButton(props: RangeCalendarPrevButtonProps) {
  const ctx = useRangeCalendarContext()
  return (
    <button
      type="button"
      aria-label="Previous month"
      onClick={() => ctx.prevMonth()}
      {...applySemanticAttrs({ scope: "range-calendar", part: "prev-button" })}
    >
      {props.children ?? "←"}
    </button>
  )
}

// ─── Title ─────────────────────────────────────────────────────────────────────

/** Props for RangeCalendar Title. */
export interface RangeCalendarTitleProps {
  children?: JSX.Element
}

/** RangeCalendar Title — displays current month/year with aria-live. */
export function RangeTitle(props: RangeCalendarTitleProps) {
  const ctx = useRangeCalendarContext()
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
      {...applySemanticAttrs({ scope: "range-calendar", part: "title" })}
    >
      {props.children ?? label()}
    </div>
  )
}

// ─── NextButton ────────────────────────────────────────────────────────────────

/** Props for RangeCalendar NextButton. */
export interface RangeCalendarNextButtonProps {
  children?: JSX.Element
}

/** RangeCalendar NextButton — navigates to the next month. */
export function RangeNextButton(props: RangeCalendarNextButtonProps) {
  const ctx = useRangeCalendarContext()
  return (
    <button
      type="button"
      aria-label="Next month"
      onClick={() => ctx.nextMonth()}
      {...applySemanticAttrs({ scope: "range-calendar", part: "next-button" })}
    >
      {props.children ?? "→"}
    </button>
  )
}

// ─── Grid ──────────────────────────────────────────────────────────────────────

/** Props for RangeCalendar Grid. */
export interface RangeCalendarGridProps {
  children?: (weeks: number[][]) => JSX.Element
}

/**
 * RangeCalendar Grid — renders month grid with keyboard navigation.
 *
 * Keys: Arrow Left/Right/Up/Down (±1/±7 days), PageUp/Down (±month),
 * Home/End (first/last day), Enter/Space (select range boundary).
 * RTL: Left/Right arrows are reversed when dir="rtl".
 */
export function RangeGrid(props: RangeCalendarGridProps) {
  const ctx = useRangeCalendarContext()
  const grid = createMemo(() =>
    ctx.dateMath.getMonthGrid({ date: ctx.focusedMonth(), weekStartsOn: ctx.weekStartsOn }),
  )

  const handleKeyDown = (event: KeyboardEvent) => {
    const focused = ctx.focusedDate()
    const isRtl = ctx.dir() === "rtl"
    let next: DateValue | undefined
    switch (event.key) {
      case "ArrowLeft":
        next = adjustDay(focused, isRtl ? 1 : -1)
        break
      case "ArrowRight":
        next = adjustDay(focused, isRtl ? -1 : 1)
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
    if (next) {
      ctx.setFocusedDate(next)
      // Update highlight preview during selection
      if (ctx.isSelecting()) {
        ctx.setHighlightedEnd(next)
      }
    }
  }

  return (
    <table
      role="grid"
      aria-label="Range calendar grid"
      onKeyDown={handleKeyDown}
      {...applySemanticAttrs({ scope: "range-calendar", part: "grid" })}
    >
      <tbody>{props.children ? props.children(grid().weeks) : null}</tbody>
    </table>
  )
}

// ─── Cell ──────────────────────────────────────────────────────────────────────

/** Props for RangeCalendar Cell. */
export interface RangeCalendarCellProps {
  day: number
  children?: JSX.Element
}

/**
 * RangeCalendar Cell — single day with range selection states.
 *
 * Semantic attributes: data-in-range, data-range-start, data-range-end,
 * data-selected, data-disabled, data-highlighted (today).
 */
export function RangeCell(props: RangeCalendarCellProps) {
  const ctx = useRangeCalendarContext()
  const date = (): DateValue => ({ ...ctx.focusedMonth(), day: props.day })
  const inRange = () => ctx.isInRange(date())
  const isStart = () => ctx.isRangeStart(date())
  const isEnd = () => ctx.isRangeEnd(date())
  const isFocused = () => ctx.dateMath.isSameDay(ctx.focusedDate(), date())
  const isDisabled = () => ctx.isDateDisabled(date())
  const isTodayCell = () => ctx.isToday(date())
  const isSelected = () => isStart() || isEnd()

  return (
    <td
      role="gridcell"
      tabindex={isFocused() ? 0 : -1}
      aria-selected={isSelected() ? "true" : undefined}
      aria-disabled={isDisabled() ? "true" : undefined}
      data-in-range={inRange() ? "" : undefined}
      data-range-start={isStart() ? "" : undefined}
      data-range-end={isEnd() ? "" : undefined}
      data-today={isTodayCell() ? "" : undefined}
      onClick={() => {
        if (!isDisabled()) ctx.selectDate(date())
      }}
      onMouseEnter={() => {
        if (ctx.isSelecting() && !isDisabled()) {
          ctx.setHighlightedEnd(date())
        }
      }}
      {...applySemanticAttrs({
        scope: "range-calendar",
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
