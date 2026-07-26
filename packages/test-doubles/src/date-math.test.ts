import { describe, it, expect } from "vitest"
import { createDateMathDouble, type DateMathCapability } from "./date-math"

describe("createDateMathDouble", () => {
  const double = createDateMathDouble()

  it("satisfies DateMathCapability shape", () => {
    const cap: DateMathCapability = double
    expect(cap.getMonthGrid).toBeTypeOf("function")
    expect(cap.addMonths).toBeTypeOf("function")
    expect(cap.isSameDay).toBeTypeOf("function")
    expect(cap.isInRange).toBeTypeOf("function")
    expect(cap.destroy).toBeTypeOf("function")
  })

  describe("getMonthGrid", () => {
    it("returns correct days in month", () => {
      const grid = double.getMonthGrid({ date: { year: 2024, month: 2, day: 1 } })
      expect(grid.daysInMonth).toBe(29) // 2024 is leap year
    })

    it("returns 6 weeks max for a month", () => {
      const grid = double.getMonthGrid({ date: { year: 2024, month: 6, day: 1 } })
      expect(grid.weeks.length).toBeGreaterThanOrEqual(4)
      expect(grid.weeks.length).toBeLessThanOrEqual(6)
      expect(grid.weeks[0]).toHaveLength(7)
    })

    it("respects weekStartsOn", () => {
      // January 2024 starts on Monday
      const sundayStart = double.getMonthGrid({
        date: { year: 2024, month: 1, day: 1 },
        weekStartsOn: 0,
      })
      const mondayStart = double.getMonthGrid({
        date: { year: 2024, month: 1, day: 1 },
        weekStartsOn: 1,
      })
      // With Sunday start, Monday=1 is offset by 1
      expect(sundayStart.weeks[0]!.filter((d) => d === 0).length).toBe(1)
      // With Monday start, Monday=1 has no offset
      expect(mondayStart.weeks[0]!.filter((d) => d === 0).length).toBe(0)
    })
  })

  describe("addMonths", () => {
    it("adds months forward", () => {
      expect(double.addMonths({ year: 2024, month: 1, day: 15 }, 3)).toEqual({
        year: 2024,
        month: 4,
        day: 15,
      })
    })

    it("wraps year forward", () => {
      expect(double.addMonths({ year: 2024, month: 11, day: 1 }, 3)).toEqual({
        year: 2025,
        month: 2,
        day: 1,
      })
    })

    it("subtracts months", () => {
      expect(double.addMonths({ year: 2024, month: 3, day: 15 }, -2)).toEqual({
        year: 2024,
        month: 1,
        day: 15,
      })
    })

    it("clamps day to month end", () => {
      expect(double.addMonths({ year: 2024, month: 1, day: 31 }, 1)).toEqual({
        year: 2024,
        month: 2,
        day: 29,
      })
    })
  })

  describe("isSameDay", () => {
    it("returns true for same date", () => {
      expect(
        double.isSameDay({ year: 2024, month: 6, day: 15 }, { year: 2024, month: 6, day: 15 }),
      ).toBe(true)
    })

    it("returns false for different day", () => {
      expect(
        double.isSameDay({ year: 2024, month: 6, day: 15 }, { year: 2024, month: 6, day: 16 }),
      ).toBe(false)
    })
  })

  describe("isInRange", () => {
    it("returns true for date in range", () => {
      const start = { year: 2024, month: 1, day: 1 }
      const end = { year: 2024, month: 12, day: 31 }
      expect(double.isInRange({ year: 2024, month: 6, day: 15 }, start, end)).toBe(true)
    })

    it("returns true for range boundaries", () => {
      const start = { year: 2024, month: 3, day: 1 }
      const end = { year: 2024, month: 3, day: 31 }
      expect(double.isInRange(start, start, end)).toBe(true)
      expect(double.isInRange(end, start, end)).toBe(true)
    })

    it("returns false for date outside range", () => {
      const start = { year: 2024, month: 3, day: 1 }
      const end = { year: 2024, month: 3, day: 31 }
      expect(double.isInRange({ year: 2024, month: 2, day: 28 }, start, end)).toBe(false)
    })
  })

  it("produces identical output for identical input", () => {
    const input = { date: { year: 2024, month: 7, day: 1 } }
    expect(double.getMonthGrid(input)).toEqual(double.getMonthGrid(input))
  })
})
