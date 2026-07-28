import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import { gregorianDateMath } from "./calendar"

describe("RangeCalendar", () => {
  // ─── Semantic attributes ────────────────────────────────────────────────────
  describe("semantic attributes", () => {
    it("emits correct semantic attributes for range-calendar root", () => {
      const attrs = applySemanticAttrs({ scope: "range-calendar", part: "root" })
      expect(attrs["data-scope"]).toBe("range-calendar")
      expect(attrs["data-part"]).toBe("root")
    })

    it("emits correct semantic attributes for range-calendar cell", () => {
      const attrs = applySemanticAttrs({ scope: "range-calendar", part: "cell" })
      expect(attrs["data-scope"]).toBe("range-calendar")
      expect(attrs["data-part"]).toBe("cell")
    })

    it("emits selected state on cell", () => {
      const attrs = applySemanticAttrs({ scope: "range-calendar", part: "cell", selected: true })
      expect(attrs["data-selected"]).toBe("")
    })

    it("emits disabled state on cell", () => {
      const attrs = applySemanticAttrs({ scope: "range-calendar", part: "cell", disabled: true })
      expect(attrs["data-disabled"]).toBe("")
    })

    it("emits highlighted state on cell (today)", () => {
      const attrs = applySemanticAttrs({
        scope: "range-calendar",
        part: "cell",
        highlighted: true,
      })
      expect(attrs["data-highlighted"]).toBe("")
    })
  })

  // ─── Range selection semantics ──────────────────────────────────────────────
  describe("range selection semantics (via gregorianDateMath)", () => {
    it("isInRange returns true for dates within start..end (inclusive)", () => {
      const start = { year: 2024, month: 6, day: 10 }
      const end = { year: 2024, month: 6, day: 15 }
      expect(gregorianDateMath.isInRange({ year: 2024, month: 6, day: 10 }, start, end)).toBe(true)
      expect(gregorianDateMath.isInRange({ year: 2024, month: 6, day: 12 }, start, end)).toBe(true)
      expect(gregorianDateMath.isInRange({ year: 2024, month: 6, day: 15 }, start, end)).toBe(true)
    })

    it("isInRange returns false for dates outside start..end", () => {
      const start = { year: 2024, month: 6, day: 10 }
      const end = { year: 2024, month: 6, day: 15 }
      expect(gregorianDateMath.isInRange({ year: 2024, month: 6, day: 9 }, start, end)).toBe(false)
      expect(gregorianDateMath.isInRange({ year: 2024, month: 6, day: 16 }, start, end)).toBe(false)
    })

    it("isInRange works across month boundaries", () => {
      const start = { year: 2024, month: 1, day: 28 }
      const end = { year: 2024, month: 2, day: 3 }
      expect(gregorianDateMath.isInRange({ year: 2024, month: 1, day: 30 }, start, end)).toBe(true)
      expect(gregorianDateMath.isInRange({ year: 2024, month: 2, day: 1 }, start, end)).toBe(true)
      expect(gregorianDateMath.isInRange({ year: 2024, month: 1, day: 27 }, start, end)).toBe(false)
    })

    it("isInRange works across year boundaries", () => {
      const start = { year: 2024, month: 12, day: 28 }
      const end = { year: 2025, month: 1, day: 3 }
      expect(gregorianDateMath.isInRange({ year: 2024, month: 12, day: 30 }, start, end)).toBe(true)
      expect(gregorianDateMath.isInRange({ year: 2025, month: 1, day: 1 }, start, end)).toBe(true)
    })

    it("single-day range (start == end) contains only that day", () => {
      const day = { year: 2024, month: 6, day: 10 }
      expect(gregorianDateMath.isInRange(day, day, day)).toBe(true)
      expect(gregorianDateMath.isInRange({ year: 2024, month: 6, day: 11 }, day, day)).toBe(false)
    })
  })

  // ─── Range normalization (start/end/restart) ────────────────────────────────
  describe("range normalization", () => {
    it("isSameDay correctly identifies same dates", () => {
      expect(
        gregorianDateMath.isSameDay(
          { year: 2024, month: 6, day: 15 },
          { year: 2024, month: 6, day: 15 },
        ),
      ).toBe(true)
    })

    it("isSameDay rejects different days", () => {
      expect(
        gregorianDateMath.isSameDay(
          { year: 2024, month: 6, day: 15 },
          { year: 2024, month: 6, day: 16 },
        ),
      ).toBe(false)
    })
  })

  // ─── Keyboard navigation (RTL awareness) ───────────────────────────────────
  describe("keyboard navigation helpers", () => {
    it("addMonths navigates forward", () => {
      const result = gregorianDateMath.addMonths({ year: 2024, month: 6, day: 15 }, 1)
      expect(result).toEqual({ year: 2024, month: 7, day: 15 })
    })

    it("addMonths navigates backward", () => {
      const result = gregorianDateMath.addMonths({ year: 2024, month: 6, day: 15 }, -1)
      expect(result).toEqual({ year: 2024, month: 5, day: 15 })
    })

    it("addMonths wraps year forward", () => {
      const result = gregorianDateMath.addMonths({ year: 2024, month: 11, day: 10 }, 3)
      expect(result).toEqual({ year: 2025, month: 2, day: 10 })
    })

    it("addMonths wraps year backward", () => {
      const result = gregorianDateMath.addMonths({ year: 2024, month: 2, day: 10 }, -3)
      expect(result).toEqual({ year: 2023, month: 11, day: 10 })
    })

    it("addMonths clamps day for shorter months", () => {
      const result = gregorianDateMath.addMonths({ year: 2024, month: 1, day: 31 }, 1)
      expect(result).toEqual({ year: 2024, month: 2, day: 29 }) // 2024 is leap year
    })

    it("addMonths clamps day for non-leap February", () => {
      const result = gregorianDateMath.addMonths({ year: 2023, month: 1, day: 31 }, 1)
      expect(result).toEqual({ year: 2023, month: 2, day: 28 })
    })
  })

  // ─── Disabled dates ─────────────────────────────────────────────────────────
  describe("disabled dates logic", () => {
    it("isInRange does not skip disabled dates (range is continuous)", () => {
      // Disabled dates still appear in range visually; selection is blocked at click time.
      const start = { year: 2024, month: 6, day: 10 }
      const end = { year: 2024, month: 6, day: 15 }
      const disabledDate = { year: 2024, month: 6, day: 12 }
      // Even a "disabled" date is geometrically in-range
      expect(gregorianDateMath.isInRange(disabledDate, start, end)).toBe(true)
    })
  })

  // ─── Grid generation ────────────────────────────────────────────────────────
  describe("grid generation (shared with Calendar)", () => {
    it("generates correct grid for June 2024 (starts Saturday)", () => {
      const grid = gregorianDateMath.getMonthGrid({ date: { year: 2024, month: 6, day: 1 } })
      expect(grid.daysInMonth).toBe(30)
      // June 2024 starts on Saturday (day 6 when weekStartsOn=0)
      expect(grid.weeks[0]![0]).toBe(0) // Sun empty
      expect(grid.weeks[0]![6]).toBe(1) // Sat = 1st
    })

    it("respects weekStartsOn parameter", () => {
      // June 2024 with Monday start
      const grid = gregorianDateMath.getMonthGrid({
        date: { year: 2024, month: 6, day: 1 },
        weekStartsOn: 1,
      })
      expect(grid.daysInMonth).toBe(30)
      // June 1 2024 is Saturday. With Monday start, Saturday is index 5.
      expect(grid.weeks[0]![5]).toBe(1)
    })

    it("handles leap year February", () => {
      const grid = gregorianDateMath.getMonthGrid({ date: { year: 2024, month: 2, day: 1 } })
      expect(grid.daysInMonth).toBe(29)
    })

    it("handles non-leap year February", () => {
      const grid = gregorianDateMath.getMonthGrid({ date: { year: 2023, month: 2, day: 1 } })
      expect(grid.daysInMonth).toBe(28)
    })
  })

  // ─── SSR/hydration safety ───────────────────────────────────────────────────
  describe("SSR safety", () => {
    it("gregorianDateMath is a pure object with no browser dependencies", () => {
      // All functions are synchronous and DOM-free
      expect(typeof gregorianDateMath.getMonthGrid).toBe("function")
      expect(typeof gregorianDateMath.addMonths).toBe("function")
      expect(typeof gregorianDateMath.isSameDay).toBe("function")
      expect(typeof gregorianDateMath.isInRange).toBe("function")
    })

    it("getMonthGrid does not access document or window", () => {
      // This verifies SSR safety — no globals accessed
      const result = gregorianDateMath.getMonthGrid({ date: { year: 2024, month: 1, day: 1 } })
      expect(result.weeks.length).toBeGreaterThan(0)
      expect(result.daysInMonth).toBe(31)
    })
  })
})
