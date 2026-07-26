import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import { gregorianDateMath } from "./calendar"

describe("Calendar", () => {
  it("emits correct semantic attributes for root", () => {
    const attrs = applySemanticAttrs({ scope: "calendar", part: "root" })
    expect(attrs["data-scope"]).toBe("calendar")
    expect(attrs["data-part"]).toBe("root")
  })

  describe("gregorianDateMath.daysInMonth", () => {
    it("returns correct days via getMonthGrid", () => {
      // January 2024 has 31 days
      const jan = gregorianDateMath.getMonthGrid({ date: { year: 2024, month: 1, day: 1 } })
      expect(jan.daysInMonth).toBe(31)

      // February 2024 (leap year) has 29 days
      const feb = gregorianDateMath.getMonthGrid({ date: { year: 2024, month: 2, day: 1 } })
      expect(feb.daysInMonth).toBe(29)

      // February 2023 (non-leap) has 28 days
      const feb23 = gregorianDateMath.getMonthGrid({ date: { year: 2023, month: 2, day: 1 } })
      expect(feb23.daysInMonth).toBe(28)
    })
  })

  describe("gregorianDateMath.addMonths", () => {
    it("adds months correctly within the same year", () => {
      const result = gregorianDateMath.addMonths({ year: 2024, month: 3, day: 15 }, 2)
      expect(result).toEqual({ year: 2024, month: 5, day: 15 })
    })

    it("wraps to next year when adding past December", () => {
      const result = gregorianDateMath.addMonths({ year: 2024, month: 11, day: 10 }, 3)
      expect(result).toEqual({ year: 2025, month: 2, day: 10 })
    })

    it("clamps day when target month has fewer days", () => {
      // March 31 + (-1) => Feb 29 in leap year
      const result = gregorianDateMath.addMonths({ year: 2024, month: 3, day: 31 }, -1)
      expect(result).toEqual({ year: 2024, month: 2, day: 29 })
    })
  })

  describe("gregorianDateMath.isSameDay", () => {
    it("returns true for identical dates", () => {
      expect(
        gregorianDateMath.isSameDay(
          { year: 2024, month: 6, day: 15 },
          { year: 2024, month: 6, day: 15 },
        ),
      ).toBe(true)
    })

    it("returns false for different dates", () => {
      expect(
        gregorianDateMath.isSameDay(
          { year: 2024, month: 6, day: 15 },
          { year: 2024, month: 6, day: 16 },
        ),
      ).toBe(false)
    })
  })
})
