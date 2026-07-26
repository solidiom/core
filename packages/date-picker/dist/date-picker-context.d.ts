/**
 * Date-picker context — shared state, port interfaces, and default date math.
 */
import { type Accessor } from "solid-js";
import type { ChangeDetails, DisclosureReason, PresencePhase } from "@solidiom/runtime";
/** A calendar date value (year/month/day). */
export interface DateValue {
    year: number;
    month: number;
    day: number;
}
/**
 * Adapter port for date math operations.
 * Consumers inject an implementation (e.g. @solidiom/adapter-date-internationalized).
 * A fallback is provided for basic Gregorian calendar math.
 */
export interface CalendarDateMathPort {
    getMonthGrid(input: {
        date: DateValue;
        weekStartsOn?: number;
    }): {
        weeks: number[][];
        daysInMonth: number;
    };
    addMonths(date: DateValue, months: number): DateValue;
    isSameDay(a: DateValue, b: DateValue): boolean;
    isInRange(date: DateValue, start: DateValue, end: DateValue): boolean;
}
/** Returns the number of days in a given month. */
export declare function getDaysInMonth(year: number, month: number): number;
/** Creates a Gregorian fallback port when no adapter is provided. */
export declare function createDefaultDateMath(): CalendarDateMathPort;
/** Formats a DateValue as YYYY-MM-DD. */
export declare function defaultFormatDate(date: DateValue): string;
/** Returns today's date as a DateValue. */
export declare function today(): DateValue;
export interface DatePickerContextValue {
    open: Accessor<boolean>;
    requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void;
    value: Accessor<DateValue | undefined>;
    setValue: (date: DateValue | undefined) => void;
    focusedDate: Accessor<DateValue>;
    setFocusedDate: (date: DateValue) => void;
    viewingMonth: Accessor<DateValue>;
    setViewingMonth: (date: DateValue) => void;
    dateMath: CalendarDateMathPort;
    isDateDisabled: (date: DateValue) => boolean;
    formatDate: (date: DateValue) => string;
    contentId: string;
    triggerId: string;
    inputId: string;
    phase: Accessor<PresencePhase>;
    present: Accessor<boolean>;
}
export declare const DatePickerContext: import("solid-js").Context<DatePickerContextValue>;
/** Access date-picker context from descendant parts. */
export declare function useDatePickerContext(): DatePickerContextValue;
//# sourceMappingURL=date-picker-context.d.ts.map