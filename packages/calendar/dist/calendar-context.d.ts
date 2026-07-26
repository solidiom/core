/**
 * @solidiom/calendar — Calendar context.
 *
 * Provides shared calendar state, navigation, and selection to all calendar parts.
 */
import { type Accessor } from "solid-js";
/** A date value with year, month (1-12), and day (1-31). */
export interface DateValue {
    year: number;
    month: number;
    day: number;
}
/** Port interface for date math operations. */
export interface CalendarDateMathPort {
    /** Generates a month grid of week rows with day numbers (0 for empty cells). */
    getMonthGrid(input: {
        date: DateValue;
        weekStartsOn?: number;
    }): {
        weeks: number[][];
        daysInMonth: number;
    };
    /** Adds months to a date, clamping day if needed. */
    addMonths(date: DateValue, months: number): DateValue;
    /** Checks if two dates represent the same day. */
    isSameDay(a: DateValue, b: DateValue): boolean;
    /** Checks if a date falls within a range (inclusive). */
    isInRange(date: DateValue, start: DateValue, end: DateValue): boolean;
}
/** Context shape shared among all calendar parts. */
export interface CalendarContextValue {
    /** The currently displayed month (for grid rendering). */
    focusedMonth: Accessor<DateValue>;
    /** The currently focused date (for keyboard navigation). */
    focusedDate: Accessor<DateValue>;
    /** The selected date(s). */
    selectedDate: Accessor<DateValue | undefined>;
    /** Navigate to previous month. */
    prevMonth: () => void;
    /** Navigate to next month. */
    nextMonth: () => void;
    /** Select a date. */
    selectDate: (date: DateValue) => void;
    /** Set focused date (for keyboard nav). */
    setFocusedDate: (date: DateValue) => void;
    /** Check if a date is disabled. */
    isDateDisabled: (date: DateValue) => boolean;
    /** Check if a date is today. */
    isToday: (date: DateValue) => boolean;
    /** The date math port. */
    dateMath: CalendarDateMathPort;
    /** Week start day (0=Sun, 1=Mon). */
    weekStartsOn: number;
}
declare const CalendarContext: import("solid-js").Context<CalendarContextValue>;
/**
 * Provides calendar context to descendant parts.
 *
 * @internal Used by Root to supply context.
 */
export { CalendarContext };
/**
 * Consumes the calendar context. Throws if used outside a CalendarRoot.
 */
export declare function useCalendarContext(): CalendarContextValue;
//# sourceMappingURL=calendar-context.d.ts.map