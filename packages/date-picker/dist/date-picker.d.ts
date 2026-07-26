/**
 * DatePicker primitive — input + calendar popup for date selection.
 *
 * Uses popover pattern with dismissable layer, focus trapping, and presence phases.
 * Requires a CalendarDateMathPort adapter (uses built-in Gregorian fallback otherwise).
 *
 * Parts: Root, Input, Trigger, Content, Calendar, Header, Grid, Cell.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
import { type DisclosureReason, type ChangeDetails } from "@solidiom/runtime";
import { type DateValue, type CalendarDateMathPort } from "./date-picker-context";
export interface DatePickerRootProps {
    value?: Accessor<DateValue | undefined>;
    defaultValue?: DateValue;
    onValueChange?: (value: DateValue | undefined) => void;
    open?: Accessor<boolean>;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void;
    isDateDisabled?: (date: DateValue) => boolean;
    formatDate?: (date: DateValue) => string;
    dateMath?: CalendarDateMathPort;
    children: JSX.Element;
}
export declare function Root(props: DatePickerRootProps): JSX.Element;
export interface DatePickerInputProps {
    placeholder?: string;
    class?: string;
    ref?: (el: HTMLInputElement) => void;
}
/** Read-only input displaying the formatted date value. */
export declare function Input(props: DatePickerInputProps): JSX.Element;
export interface DatePickerTriggerProps {
    children: JSX.Element;
    ref?: (el: HTMLButtonElement) => void;
}
/** Button that toggles the calendar popup. */
export declare function Trigger(props: DatePickerTriggerProps): JSX.Element;
export interface DatePickerContentProps {
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
    ref?: (el: HTMLDivElement) => void;
}
/** Popup container with dismissable layer and focus trapping. */
export declare function Content(props: DatePickerContentProps): JSX.Element;
export interface DatePickerCalendarProps {
    children: JSX.Element;
    class?: string;
}
/** Semantic wrapper for the calendar region. */
export declare function Calendar(props: DatePickerCalendarProps): JSX.Element;
export interface DatePickerHeaderProps {
    children?: JSX.Element;
    class?: string;
}
/** Header with prev/next month navigation and current month label. */
export declare function Header(props: DatePickerHeaderProps): JSX.Element;
export interface DatePickerGridProps {
    children: (weeks: Accessor<number[][]>) => JSX.Element;
    class?: string;
    weekStartsOn?: number;
}
/** Renders the month grid and provides weeks data to children. */
export declare function Grid(props: DatePickerGridProps): JSX.Element;
export interface DatePickerCellProps {
    day: number;
    class?: string;
}
/** A single day cell with selection, disabled state, and keyboard navigation. */
export declare function Cell(props: DatePickerCellProps): JSX.Element;
//# sourceMappingURL=date-picker.d.ts.map