/** DateMathCapability@1 port shape (same as test-doubles). */

export interface DateValue {
  year: number
  month: number
  day: number
}
export interface MonthGrid {
  year: number
  month: number
  weeks: number[][]
  daysInMonth: number
}
export interface DateMathInput {
  date: DateValue
  weekStartsOn?: number
}

export interface DateMathCapability {
  getMonthGrid(input: DateMathInput): MonthGrid
  addMonths(date: DateValue, months: number): DateValue
  isSameDay(a: DateValue, b: DateValue): boolean
  isInRange(date: DateValue, start: DateValue, end: DateValue): boolean
  destroy(): void
}
