/**
 * @solidiom/adapter-date-internationalized — Date math adapter using @internationalized/date.
 *
 * Implements DateMathCapability@1. Returns primitive-representable values only —
 * never CalendarDate classes (§23 #11, #64).
 */

// Engine import proves adapter-engine relationship
import type { CalendarDate as _CD } from "@internationalized/date"

export type { DateMathCapability, DateValue, MonthGrid, DateMathInput } from "./capability"
export { createInternationalizedDateAdapter } from "./adapter"
