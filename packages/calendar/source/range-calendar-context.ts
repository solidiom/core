/**
 * @solidiom/calendar — RangeCalendar context.
 *
 * Provides shared range-selection state, navigation, and highlight tracking
 * to all RangeCalendar parts.
 */

import { createContext, useContext, type Accessor } from "solid-js"
import type { DateValue, CalendarDateMathPort } from "./calendar-context"

// ─── Types ─────────────────────────────────────────────────────────────────────

/** A range value with a start date and an optional end date. */
export interface RangeValue {
  start: DateValue
  end?: DateValue
}

/** Context shape shared among all RangeCalendar parts. */
export interface RangeCalendarContextValue {
  /** The currently displayed month (for grid rendering). */
  focusedMonth: Accessor<DateValue>
  /** The currently focused date (for keyboard navigation). */
  focusedDate: Accessor<DateValue>
  /** The current range selection. */
  rangeValue: Accessor<RangeValue | undefined>
  /**
   * The date currently being hovered/focused during an in-progress selection
   * (start chosen, end not yet committed). Used for visual highlight preview.
   */
  highlightedEnd: Accessor<DateValue | undefined>
  /** Whether a range selection is in progress (start chosen, awaiting end). */
  isSelecting: Accessor<boolean>
  /** Navigate to previous month. */
  prevMonth: () => void
  /** Navigate to next month. */
  nextMonth: () => void
  /** Handle a date click/select: start → end → restart cycle. */
  selectDate: (date: DateValue) => void
  /** Set the highlighted end (hover preview). */
  setHighlightedEnd: (date: DateValue | undefined) => void
  /** Set focused date (for keyboard nav). */
  setFocusedDate: (date: DateValue) => void
  /** Check if a date is disabled. */
  isDateDisabled: (date: DateValue) => boolean
  /** Check if a date is today. */
  isToday: (date: DateValue) => boolean
  /** Check if a date is within the current range (inclusive). */
  isInRange: (date: DateValue) => boolean
  /** Check if a date is the range start. */
  isRangeStart: (date: DateValue) => boolean
  /** Check if a date is the range end. */
  isRangeEnd: (date: DateValue) => boolean
  /** The date math port. */
  dateMath: CalendarDateMathPort
  /** Week start day (0=Sun, 1=Mon). */
  weekStartsOn: number
  /** Text direction for RTL support. */
  dir: Accessor<"ltr" | "rtl">
}

const RangeCalendarContext = createContext<RangeCalendarContextValue>()

/** @internal Used by RangeCalendar.Root to supply context. */
export { RangeCalendarContext }

/** Consumes the RangeCalendar context. Throws if used outside a RangeCalendar.Root. */
export function useRangeCalendarContext(): RangeCalendarContextValue {
  const ctx = useContext(RangeCalendarContext)
  if (!ctx) {
    throw new Error(
      "[solidiom/calendar] useRangeCalendarContext must be used within a RangeCalendar.Root",
    )
  }
  return ctx
}
