/**
 * @solidiom/calendar — Headless calendar primitive.
 *
 * Parts: Root, Header, PrevButton, Title, NextButton, Grid, Cell.
 * Supports month navigation, keyboard nav, date selection, disabled dates, today highlighting.
 *
 * @example
 * ```tsx
 * import * as Calendar from "@solidiom/calendar"
 *
 * <Calendar.Root onValueChange={(d) => console.log(d)}>
 *   <Calendar.Header>
 *     <Calendar.PrevButton />
 *     <Calendar.Title />
 *     <Calendar.NextButton />
 *   </Calendar.Header>
 *   <Calendar.Grid>
 *     {(weeks) => weeks.map((week) => (
 *       <tr>{week.map((day) => day > 0 ? <Calendar.Cell day={day} /> : <td />)}</tr>
 *     ))}
 *   </Calendar.Grid>
 * </Calendar.Root>
 * ```
 */

export {
  Root,
  Header,
  PrevButton,
  Title,
  NextButton,
  Grid,
  Cell,
  gregorianDateMath,
} from "./calendar"
export type {
  CalendarRootProps,
  CalendarHeaderProps,
  CalendarPrevButtonProps,
  CalendarTitleProps,
  CalendarNextButtonProps,
  CalendarGridProps,
  CalendarCellProps,
} from "./calendar"
export {
  useCalendarContext,
  type CalendarContextValue,
  type DateValue,
  type CalendarDateMathPort,
} from "./calendar-context"
