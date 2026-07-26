/**
 * Deterministic date math test double — implements DateMathCapability@1.
 *
 * Returns primitive-representable values (no CalendarDate classes per §23 #11, #64).
 * Zero engine dependencies. Deterministic for fixed input.
 */
/** A date represented as primitive values (year, month, day). */
export interface DateValue {
    year: number;
    /** 1-based month (1=January, 12=December). */
    month: number;
    /** 1-based day of month. */
    day: number;
}
/** A month grid for calendar display. */
export interface MonthGrid {
    /** Year of this month. */
    year: number;
    /** 1-based month. */
    month: number;
    /** Weeks as arrays of day numbers (0 = empty cell). */
    weeks: number[][];
    /** Total days in this month. */
    daysInMonth: number;
}
/** Input for date math operations. */
export interface DateMathInput {
    /** The reference date. */
    date: DateValue;
    /** First day of week (0=Sunday, 1=Monday). */
    weekStartsOn?: number;
}
/** DateMathCapability@1 port shape. */
export interface DateMathCapability {
    /** Get the month grid for calendar display. */
    getMonthGrid(input: DateMathInput): MonthGrid;
    /** Add months to a date. */
    addMonths(date: DateValue, months: number): DateValue;
    /** Check if two dates are the same day. */
    isSameDay(a: DateValue, b: DateValue): boolean;
    /** Check if a date is within a range (inclusive). */
    isInRange(date: DateValue, start: DateValue, end: DateValue): boolean;
    destroy(): void;
}
/**
 * Deterministic date math double.
 *
 * Uses basic arithmetic — no timezone, locale, or calendar system awareness.
 */
export declare function createDateMathDouble(): DateMathCapability;
//# sourceMappingURL=date-math.d.ts.map