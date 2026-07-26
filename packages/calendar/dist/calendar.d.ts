/**
 * @solidiom/calendar — Headless calendar primitive with month navigation and date selection.
 *
 * Parts: Root, Header, PrevButton, Title, NextButton, Grid, Cell.
 * Supports keyboard navigation, disabled dates, today highlighting, configurable week start.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
import { type DateValue, type CalendarDateMathPort } from "./calendar-context";
/** Default Gregorian date math implementation. No external dependencies. */
export declare const gregorianDateMath: CalendarDateMathPort;
/** Props for the Calendar Root component. */
export interface CalendarRootProps {
    dateMath?: CalendarDateMathPort;
    value?: Accessor<DateValue | undefined>;
    defaultValue?: DateValue;
    onValueChange?: (date: DateValue) => void;
    isDateDisabled?: (date: DateValue) => boolean;
    weekStartsOn?: number;
    class?: string;
    children: JSX.Element;
}
/** Calendar Root — manages month state, date selection, and focused date. */
export declare function Root(props: CalendarRootProps): JSX.Element;
/** Props for the Calendar Header. */
export interface CalendarHeaderProps {
    children: JSX.Element;
}
/** Calendar Header — container for navigation controls. */
export declare function Header(props: CalendarHeaderProps): JSX.Element;
/** Props for Calendar PrevButton. */
export interface CalendarPrevButtonProps {
    children?: JSX.Element;
}
/** Calendar PrevButton — navigates to the previous month. */
export declare function PrevButton(props: CalendarPrevButtonProps): JSX.Element;
/** Props for Calendar Title. */
export interface CalendarTitleProps {
    children?: JSX.Element;
}
/** Calendar Title — displays current month/year with aria-live. */
export declare function Title(props: CalendarTitleProps): JSX.Element;
/** Props for Calendar NextButton. */
export interface CalendarNextButtonProps {
    children?: JSX.Element;
}
/** Calendar NextButton — navigates to the next month. */
export declare function NextButton(props: CalendarNextButtonProps): JSX.Element;
/** Props for Calendar Grid. */
export interface CalendarGridProps {
    children?: (weeks: number[][]) => JSX.Element;
}
/**
 * Calendar Grid — renders month grid with keyboard navigation.
 *
 * Keys: Arrow Left/Right/Up/Down (±1/±7 days), PageUp/Down (±month),
 * Home/End (first/last day), Enter/Space (select).
 */
export declare function Grid(props: CalendarGridProps): JSX.Element;
/** Props for Calendar Cell. */
export interface CalendarCellProps {
    day: number;
    children?: JSX.Element;
}
/** Calendar Cell — single day with selection, focus, today, and disabled states. */
export declare function Cell(props: CalendarCellProps): JSX.Element;
//# sourceMappingURL=calendar.d.ts.map