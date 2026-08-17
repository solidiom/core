import { describe, it, expect } from "vitest"
import { createTimeMath } from "./time-math"

describe("createTimeMath", () => {
  const tm = createTimeMath()

  // ─── Construction ──────────────────────────────────────────────────────

  describe("createTime", () => {
    it("constructs a valid TimeValue with all fields", () => {
      const t = tm.createTime(14, 30, 45, 123)
      expect(t).toEqual({ hour: 14, minute: 30, second: 45, millisecond: 123 })
    })

    it("defaults second and millisecond to 0", () => {
      const t = tm.createTime(9, 5)
      expect(t).toEqual({ hour: 9, minute: 5, second: 0, millisecond: 0 })
    })

    it("clamps hour to 0-23", () => {
      expect(tm.createTime(25, 0).hour).toBe(23)
      expect(tm.createTime(-1, 0).hour).toBe(0)
    })

    it("clamps minute to 0-59", () => {
      expect(tm.createTime(0, 60).minute).toBe(59)
      expect(tm.createTime(0, -5).minute).toBe(0)
    })

    it("clamps second to 0-59", () => {
      expect(tm.createTime(0, 0, 99).second).toBe(59)
    })

    it("clamps millisecond to 0-999", () => {
      expect(tm.createTime(0, 0, 0, 1500).millisecond).toBe(999)
    })
  })

  describe("fromMilliseconds", () => {
    it("converts 0 ms to midnight", () => {
      expect(tm.fromMilliseconds(0)).toEqual({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    })

    it("converts exact hours", () => {
      expect(tm.fromMilliseconds(3600000)).toEqual({ hour: 1, minute: 0, second: 0, millisecond: 0 })
    })

    it("converts mixed time", () => {
      // 14:30:45.123
      const ms = 14 * 3600000 + 30 * 60000 + 45 * 1000 + 123
      expect(tm.fromMilliseconds(ms)).toEqual({ hour: 14, minute: 30, second: 45, millisecond: 123 })
    })

    it("wraps values exceeding 24 hours", () => {
      const ms = 25 * 3600000 // 25 hours = 1:00
      expect(tm.fromMilliseconds(ms)).toEqual({ hour: 1, minute: 0, second: 0, millisecond: 0 })
    })

    it("wraps negative values", () => {
      const ms = -3600000 // -1 hour = 23:00
      expect(tm.fromMilliseconds(ms)).toEqual({ hour: 23, minute: 0, second: 0, millisecond: 0 })
    })
  })

  describe("fromDate", () => {
    it("extracts correct time from a Date", () => {
      const date = new Date(2024, 0, 1, 14, 30, 45, 123)
      expect(tm.fromDate(date)).toEqual({ hour: 14, minute: 30, second: 45, millisecond: 123 })
    })

    it("handles midnight", () => {
      const date = new Date(2024, 0, 1, 0, 0, 0, 0)
      expect(tm.fromDate(date)).toEqual({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    })
  })

  describe("parse", () => {
    it("parses HH:MM format", () => {
      expect(tm.parse("14:30")).toEqual({ hour: 14, minute: 30, second: 0, millisecond: 0 })
    })

    it("parses HH:MM:SS format", () => {
      expect(tm.parse("14:30:45")).toEqual({ hour: 14, minute: 30, second: 45, millisecond: 0 })
    })

    it("parses HH:MM:SS.mmm format", () => {
      expect(tm.parse("14:30:45.123")).toEqual({ hour: 14, minute: 30, second: 45, millisecond: 123 })
    })

    it("parses single-digit hours", () => {
      expect(tm.parse("9:05")).toEqual({ hour: 9, minute: 5, second: 0, millisecond: 0 })
    })

    it("parses 12h format with AM", () => {
      expect(tm.parse("9:30 AM")).toEqual({ hour: 9, minute: 30, second: 0, millisecond: 0 })
    })

    it("parses 12h format with PM", () => {
      expect(tm.parse("2:30 PM")).toEqual({ hour: 14, minute: 30, second: 0, millisecond: 0 })
    })

    it("parses 12 AM as midnight", () => {
      expect(tm.parse("12:00 AM")).toEqual({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    })

    it("parses 12 PM as noon", () => {
      expect(tm.parse("12:00 PM")).toEqual({ hour: 12, minute: 0, second: 0, millisecond: 0 })
    })

    it("parses 12h with seconds", () => {
      expect(tm.parse("1:30:45 PM")).toEqual({ hour: 13, minute: 30, second: 45, millisecond: 0 })
    })

    it("parses lowercase am/pm", () => {
      expect(tm.parse("3:00 pm")).toEqual({ hour: 15, minute: 0, second: 0, millisecond: 0 })
    })

    it("handles partial milliseconds (1 digit)", () => {
      expect(tm.parse("10:00:00.5")).toEqual({ hour: 10, minute: 0, second: 0, millisecond: 500 })
    })

    it("returns null for empty string", () => {
      expect(tm.parse("")).toBeNull()
    })

    it("returns null for invalid format", () => {
      expect(tm.parse("abc")).toBeNull()
      expect(tm.parse("25:00")).toBeNull()
      expect(tm.parse("12:60")).toBeNull()
      expect(tm.parse("12:00:60")).toBeNull()
      expect(tm.parse("13:00 AM")).toBeNull()
    })

    it("returns null for non-string input", () => {
      expect(tm.parse(null as unknown as string)).toBeNull()
      expect(tm.parse(undefined as unknown as string)).toBeNull()
    })
  })

  describe("now", () => {
    it("returns a valid TimeValue", () => {
      const t = tm.now()
      expect(t.hour).toBeGreaterThanOrEqual(0)
      expect(t.hour).toBeLessThanOrEqual(23)
      expect(t.minute).toBeGreaterThanOrEqual(0)
      expect(t.minute).toBeLessThanOrEqual(59)
      expect(t.second).toBeGreaterThanOrEqual(0)
      expect(t.second).toBeLessThanOrEqual(59)
      expect(t.millisecond).toBeGreaterThanOrEqual(0)
      expect(t.millisecond).toBeLessThanOrEqual(999)
    })
  })

  // ─── Conversion ────────────────────────────────────────────────────────

  describe("toMilliseconds", () => {
    it("converts midnight to 0", () => {
      expect(tm.toMilliseconds({ hour: 0, minute: 0, second: 0, millisecond: 0 })).toBe(0)
    })

    it("converts time correctly", () => {
      const ms = tm.toMilliseconds({ hour: 1, minute: 30, second: 0, millisecond: 500 })
      expect(ms).toBe(1 * 3600000 + 30 * 60000 + 500)
    })

    it("roundtrips with fromMilliseconds", () => {
      const original = { hour: 14, minute: 30, second: 45, millisecond: 123 }
      expect(tm.fromMilliseconds(tm.toMilliseconds(original))).toEqual(original)
    })
  })

  describe("toSeconds", () => {
    it("converts to total seconds", () => {
      expect(tm.toSeconds({ hour: 1, minute: 0, second: 30, millisecond: 0 })).toBe(3630)
    })
  })

  describe("toMinutes", () => {
    it("converts to rounded minutes", () => {
      expect(tm.toMinutes({ hour: 1, minute: 30, second: 0, millisecond: 0 })).toBe(90)
    })

    it("rounds to nearest minute", () => {
      // 1:30:31 → rounds to 91 minutes
      expect(tm.toMinutes({ hour: 1, minute: 30, second: 31, millisecond: 0 })).toBe(91)
    })
  })

  describe("toISOString", () => {
    it("formats without milliseconds when ms is 0", () => {
      expect(tm.toISOString({ hour: 14, minute: 30, second: 45, millisecond: 0 })).toBe("14:30:45")
    })

    it("formats with milliseconds when ms > 0", () => {
      expect(tm.toISOString({ hour: 14, minute: 30, second: 45, millisecond: 123 })).toBe("14:30:45.123")
    })

    it("pads single-digit values", () => {
      expect(tm.toISOString({ hour: 1, minute: 5, second: 9, millisecond: 0 })).toBe("01:05:09")
    })
  })

  describe("format", () => {
    it("formats in 24h cycle", () => {
      const t = tm.createTime(14, 30)
      expect(tm.format(t, { hourCycle: "24" })).toBe("14:30")
    })

    it("formats in 24h with seconds", () => {
      const t = tm.createTime(14, 30, 45)
      expect(tm.format(t, { hourCycle: "24", showSeconds: true })).toBe("14:30:45")
    })

    it("formats in 24h with milliseconds", () => {
      const t = tm.createTime(14, 30, 45, 123)
      expect(tm.format(t, { hourCycle: "24", showMilliseconds: true })).toBe("14:30:45.123")
    })

    it("formats in 12h cycle", () => {
      const t = tm.createTime(14, 30)
      expect(tm.format(t, { hourCycle: "12" })).toBe("2:30 PM")
    })

    it("formats midnight in 12h", () => {
      const t = tm.createTime(0, 0)
      expect(tm.format(t, { hourCycle: "12" })).toBe("12:00 AM")
    })

    it("formats noon in 12h", () => {
      const t = tm.createTime(12, 0)
      expect(tm.format(t, { hourCycle: "12" })).toBe("12:00 PM")
    })

    it("formats 12h with seconds", () => {
      const t = tm.createTime(14, 30, 45)
      expect(tm.format(t, { hourCycle: "12", showSeconds: true })).toBe("2:30:45 PM")
    })

    it("formats 12h with milliseconds", () => {
      const t = tm.createTime(14, 30, 45, 123)
      expect(tm.format(t, { hourCycle: "12", showMilliseconds: true })).toBe("2:30:45.123 PM")
    })
  })

  describe("get12Hour", () => {
    it("converts 0 (midnight) to 12", () => {
      expect(tm.get12Hour({ hour: 0, minute: 0, second: 0, millisecond: 0 })).toBe(12)
    })

    it("converts 1 to 1", () => {
      expect(tm.get12Hour({ hour: 1, minute: 0, second: 0, millisecond: 0 })).toBe(1)
    })

    it("converts 11 to 11", () => {
      expect(tm.get12Hour({ hour: 11, minute: 0, second: 0, millisecond: 0 })).toBe(11)
    })

    it("converts 12 (noon) to 12", () => {
      expect(tm.get12Hour({ hour: 12, minute: 0, second: 0, millisecond: 0 })).toBe(12)
    })

    it("converts 13 to 1", () => {
      expect(tm.get12Hour({ hour: 13, minute: 0, second: 0, millisecond: 0 })).toBe(1)
    })

    it("converts 23 to 11", () => {
      expect(tm.get12Hour({ hour: 23, minute: 0, second: 0, millisecond: 0 })).toBe(11)
    })
  })

  describe("getDayPeriod", () => {
    it("returns AM for hour 0", () => {
      expect(tm.getDayPeriod({ hour: 0, minute: 0, second: 0, millisecond: 0 })).toBe("AM")
    })

    it("returns AM for hour 11", () => {
      expect(tm.getDayPeriod({ hour: 11, minute: 59, second: 59, millisecond: 999 })).toBe("AM")
    })

    it("returns PM for hour 12", () => {
      expect(tm.getDayPeriod({ hour: 12, minute: 0, second: 0, millisecond: 0 })).toBe("PM")
    })

    it("returns PM for hour 23", () => {
      expect(tm.getDayPeriod({ hour: 23, minute: 0, second: 0, millisecond: 0 })).toBe("PM")
    })
  })

  // ─── Arithmetic ────────────────────────────────────────────────────────

  describe("addHours", () => {
    it("adds hours normally", () => {
      const t = tm.createTime(10, 0)
      expect(tm.addHours(t, 3)).toEqual({ hour: 13, minute: 0, second: 0, millisecond: 0 })
    })

    it("wraps forward past midnight", () => {
      const t = tm.createTime(23, 0)
      expect(tm.addHours(t, 2)).toEqual({ hour: 1, minute: 0, second: 0, millisecond: 0 })
    })

    it("wraps backward past midnight", () => {
      const t = tm.createTime(1, 0)
      expect(tm.addHours(t, -2)).toEqual({ hour: 23, minute: 0, second: 0, millisecond: 0 })
    })

    it("handles adding 24 hours (full cycle)", () => {
      const t = tm.createTime(14, 30)
      expect(tm.addHours(t, 24)).toEqual(t)
    })
  })

  describe("addMinutes", () => {
    it("adds minutes normally", () => {
      const t = tm.createTime(10, 20)
      expect(tm.addMinutes(t, 15)).toEqual({ hour: 10, minute: 35, second: 0, millisecond: 0 })
    })

    it("carries to hours", () => {
      const t = tm.createTime(10, 50)
      expect(tm.addMinutes(t, 20)).toEqual({ hour: 11, minute: 10, second: 0, millisecond: 0 })
    })

    it("wraps at day boundary", () => {
      const t = tm.createTime(23, 59)
      expect(tm.addMinutes(t, 2)).toEqual({ hour: 0, minute: 1, second: 0, millisecond: 0 })
    })

    it("subtracts minutes wrapping backward", () => {
      const t = tm.createTime(0, 10)
      expect(tm.addMinutes(t, -20)).toEqual({ hour: 23, minute: 50, second: 0, millisecond: 0 })
    })
  })

  describe("addSeconds", () => {
    it("adds seconds normally", () => {
      const t = tm.createTime(10, 0, 30)
      expect(tm.addSeconds(t, 15)).toEqual({ hour: 10, minute: 0, second: 45, millisecond: 0 })
    })

    it("carries through minutes and hours", () => {
      const t = tm.createTime(10, 59, 59)
      expect(tm.addSeconds(t, 2)).toEqual({ hour: 11, minute: 0, second: 1, millisecond: 0 })
    })

    it("wraps at day boundary", () => {
      const t = tm.createTime(23, 59, 59)
      expect(tm.addSeconds(t, 2)).toEqual({ hour: 0, minute: 0, second: 1, millisecond: 0 })
    })
  })

  describe("addMilliseconds", () => {
    it("adds milliseconds normally", () => {
      const t = tm.createTime(10, 0, 0, 500)
      expect(tm.addMilliseconds(t, 200)).toEqual({ hour: 10, minute: 0, second: 0, millisecond: 700 })
    })

    it("carries through seconds, minutes, hours", () => {
      const t = tm.createTime(23, 59, 59, 999)
      expect(tm.addMilliseconds(t, 2)).toEqual({ hour: 0, minute: 0, second: 0, millisecond: 1 })
    })

    it("subtracts milliseconds wrapping backward", () => {
      const t = tm.createTime(0, 0, 0, 0)
      expect(tm.addMilliseconds(t, -1)).toEqual({ hour: 23, minute: 59, second: 59, millisecond: 999 })
    })
  })

  describe("set", () => {
    it("sets hour clamped to valid range", () => {
      const t = tm.createTime(10, 30)
      expect(tm.set(t, "hour", 15).hour).toBe(15)
      expect(tm.set(t, "hour", 25).hour).toBe(23)
      expect(tm.set(t, "hour", -1).hour).toBe(0)
    })

    it("sets minute clamped to valid range", () => {
      const t = tm.createTime(10, 30)
      expect(tm.set(t, "minute", 45).minute).toBe(45)
      expect(tm.set(t, "minute", 60).minute).toBe(59)
    })

    it("sets second clamped to valid range", () => {
      const t = tm.createTime(10, 30, 20)
      expect(tm.set(t, "second", 59).second).toBe(59)
      expect(tm.set(t, "second", 99).second).toBe(59)
    })

    it("sets millisecond clamped to valid range", () => {
      const t = tm.createTime(10, 30, 0, 500)
      expect(tm.set(t, "millisecond", 999).millisecond).toBe(999)
      expect(tm.set(t, "millisecond", 1500).millisecond).toBe(999)
    })

    it("does not mutate original", () => {
      const t = tm.createTime(10, 30)
      const result = tm.set(t, "hour", 15)
      expect(t.hour).toBe(10)
      expect(result.hour).toBe(15)
    })
  })

  describe("cycle", () => {
    it("cycles hour up", () => {
      const t = tm.createTime(10, 0)
      expect(tm.cycle(t, "hour", 1).hour).toBe(11)
    })

    it("cycles hour down", () => {
      const t = tm.createTime(10, 0)
      expect(tm.cycle(t, "hour", -1).hour).toBe(9)
    })

    it("wraps hour up from 23 to 0", () => {
      const t = tm.createTime(23, 0)
      expect(tm.cycle(t, "hour", 1).hour).toBe(0)
    })

    it("wraps hour down from 0 to 23", () => {
      const t = tm.createTime(0, 0)
      expect(tm.cycle(t, "hour", -1).hour).toBe(23)
    })

    it("wraps minute up from 59 to 0", () => {
      const t = tm.createTime(10, 59)
      expect(tm.cycle(t, "minute", 1).minute).toBe(0)
    })

    it("wraps minute down from 0 to 59", () => {
      const t = tm.createTime(10, 0)
      expect(tm.cycle(t, "minute", -1).minute).toBe(59)
    })

    it("wraps second up from 59 to 0", () => {
      const t = tm.createTime(10, 0, 59)
      expect(tm.cycle(t, "second", 1).second).toBe(0)
    })

    it("wraps second down from 0 to 59", () => {
      const t = tm.createTime(10, 0, 0)
      expect(tm.cycle(t, "second", -1).second).toBe(59)
    })

    it("wraps millisecond up from 999 to 0", () => {
      const t = tm.createTime(10, 0, 0, 999)
      expect(tm.cycle(t, "millisecond", 1).millisecond).toBe(0)
    })

    it("wraps millisecond down from 0 to 999", () => {
      const t = tm.createTime(10, 0, 0, 0)
      expect(tm.cycle(t, "millisecond", -1).millisecond).toBe(999)
    })
  })

  // ─── Comparison ────────────────────────────────────────────────────────

  describe("isEqual", () => {
    it("returns true for identical times", () => {
      const a = tm.createTime(14, 30, 45, 123)
      const b = tm.createTime(14, 30, 45, 123)
      expect(tm.isEqual(a, b)).toBe(true)
    })

    it("returns false for different times", () => {
      const a = tm.createTime(14, 30)
      const b = tm.createTime(14, 31)
      expect(tm.isEqual(a, b)).toBe(false)
    })
  })

  describe("compare", () => {
    it("returns -1 when a < b", () => {
      const a = tm.createTime(10, 0)
      const b = tm.createTime(11, 0)
      expect(tm.compare(a, b)).toBe(-1)
    })

    it("returns 0 when equal", () => {
      const a = tm.createTime(10, 30)
      const b = tm.createTime(10, 30)
      expect(tm.compare(a, b)).toBe(0)
    })

    it("returns 1 when a > b", () => {
      const a = tm.createTime(15, 0)
      const b = tm.createTime(14, 59)
      expect(tm.compare(a, b)).toBe(1)
    })
  })

  describe("isBetween", () => {
    it("returns true when inside range", () => {
      const time = tm.createTime(12, 0)
      const min = tm.createTime(10, 0)
      const max = tm.createTime(14, 0)
      expect(tm.isBetween(time, min, max)).toBe(true)
    })

    it("returns true on boundary (inclusive)", () => {
      const time = tm.createTime(10, 0)
      const min = tm.createTime(10, 0)
      const max = tm.createTime(14, 0)
      expect(tm.isBetween(time, min, max)).toBe(true)
    })

    it("returns false when outside range", () => {
      const time = tm.createTime(9, 0)
      const min = tm.createTime(10, 0)
      const max = tm.createTime(14, 0)
      expect(tm.isBetween(time, min, max)).toBe(false)
    })
  })

  // ─── Clamping ──────────────────────────────────────────────────────────

  describe("clamp", () => {
    it("returns time unchanged when within range", () => {
      const time = tm.createTime(12, 0)
      const min = tm.createTime(10, 0)
      const max = tm.createTime(14, 0)
      expect(tm.clamp(time, min, max)).toEqual(time)
    })

    it("clamps to min when below", () => {
      const time = tm.createTime(8, 0)
      const min = tm.createTime(10, 0)
      const max = tm.createTime(14, 0)
      expect(tm.clamp(time, min, max)).toEqual(min)
    })

    it("clamps to max when above", () => {
      const time = tm.createTime(16, 0)
      const min = tm.createTime(10, 0)
      const max = tm.createTime(14, 0)
      expect(tm.clamp(time, min, max)).toEqual(max)
    })

    it("works with only min specified", () => {
      const time = tm.createTime(8, 0)
      const min = tm.createTime(10, 0)
      expect(tm.clamp(time, min)).toEqual(min)
    })

    it("works with only max specified", () => {
      const time = tm.createTime(16, 0)
      const max = tm.createTime(14, 0)
      expect(tm.clamp(time, undefined, max)).toEqual(max)
    })
  })

  // ─── 12h/24h conversion ────────────────────────────────────────────────

  describe("from12Hour", () => {
    it("converts 12 AM to hour 0", () => {
      expect(tm.from12Hour(12, 0, "AM")).toEqual({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    })

    it("converts 12 PM to hour 12", () => {
      expect(tm.from12Hour(12, 30, "PM")).toEqual({ hour: 12, minute: 30, second: 0, millisecond: 0 })
    })

    it("converts 1 AM to hour 1", () => {
      expect(tm.from12Hour(1, 0, "AM")).toEqual({ hour: 1, minute: 0, second: 0, millisecond: 0 })
    })

    it("converts 1 PM to hour 13", () => {
      expect(tm.from12Hour(1, 0, "PM")).toEqual({ hour: 13, minute: 0, second: 0, millisecond: 0 })
    })

    it("converts 11 PM to hour 23", () => {
      expect(tm.from12Hour(11, 59, "PM")).toEqual({ hour: 23, minute: 59, second: 0, millisecond: 0 })
    })

    it("accepts seconds parameter", () => {
      expect(tm.from12Hour(3, 30, "PM", 45)).toEqual({ hour: 15, minute: 30, second: 45, millisecond: 0 })
    })
  })

  describe("togglePeriod", () => {
    it("toggles AM to PM", () => {
      const t = tm.createTime(9, 30) // AM
      const toggled = tm.togglePeriod(t)
      expect(toggled.hour).toBe(21)
      expect(tm.getDayPeriod(toggled)).toBe("PM")
    })

    it("toggles PM to AM", () => {
      const t = tm.createTime(21, 30) // PM
      const toggled = tm.togglePeriod(t)
      expect(toggled.hour).toBe(9)
      expect(tm.getDayPeriod(toggled)).toBe("AM")
    })

    it("toggles midnight (0) to noon (12)", () => {
      const t = tm.createTime(0, 0)
      expect(tm.togglePeriod(t).hour).toBe(12)
    })

    it("toggles noon (12) to midnight (0)", () => {
      const t = tm.createTime(12, 0)
      expect(tm.togglePeriod(t).hour).toBe(0)
    })
  })

  // ─── Segments ──────────────────────────────────────────────────────────

  describe("toSegments", () => {
    it("converts to 24h segments with zero-padded values", () => {
      const t = tm.createTime(14, 30, 5, 9)
      const segs = tm.toSegments(t, "24")
      expect(segs).toEqual({
        hour: "14",
        minute: "30",
        second: "05",
        millisecond: "009",
      })
    })

    it("converts to 12h segments with period", () => {
      const t = tm.createTime(14, 30, 0, 0)
      const segs = tm.toSegments(t, "12")
      expect(segs).toEqual({
        hour: "2",
        minute: "30",
        second: "00",
        millisecond: "000",
        period: "PM",
      })
    })

    it("converts midnight to 12h segments", () => {
      const t = tm.createTime(0, 5, 0, 0)
      const segs = tm.toSegments(t, "12")
      expect(segs.hour).toBe("12")
      expect(segs.period).toBe("AM")
    })

    it("defaults to 24h when hourCycle is undefined", () => {
      const t = tm.createTime(14, 30)
      const segs = tm.toSegments(t)
      expect(segs.hour).toBe("14")
      expect(segs.period).toBeUndefined()
    })
  })

  describe("fromSegments", () => {
    it("constructs from 24h segments", () => {
      const segs = { hour: "14", minute: "30", second: "45", millisecond: "123" }
      expect(tm.fromSegments(segs, "24")).toEqual({ hour: 14, minute: 30, second: 45, millisecond: 123 })
    })

    it("constructs from 12h segments with AM", () => {
      const segs = { hour: "9", minute: "30", second: "00", millisecond: "000", period: "AM" }
      expect(tm.fromSegments(segs, "12")).toEqual({ hour: 9, minute: 30, second: 0, millisecond: 0 })
    })

    it("constructs from 12h segments with PM", () => {
      const segs = { hour: "2", minute: "30", second: "00", millisecond: "000", period: "PM" }
      expect(tm.fromSegments(segs, "12")).toEqual({ hour: 14, minute: 30, second: 0, millisecond: 0 })
    })

    it("roundtrips with toSegments (24h)", () => {
      const original = tm.createTime(14, 30, 45, 123)
      const segs = tm.toSegments(original, "24")
      expect(tm.fromSegments(segs, "24")).toEqual(original)
    })

    it("roundtrips with toSegments (12h)", () => {
      const original = tm.createTime(14, 30, 45, 0)
      const segs = tm.toSegments(original, "12")
      expect(tm.fromSegments(segs, "12")).toEqual(original)
    })

    it("roundtrips midnight through 12h segments", () => {
      const original = tm.createTime(0, 0, 0, 0)
      const segs = tm.toSegments(original, "12")
      expect(tm.fromSegments(segs, "12")).toEqual(original)
    })
  })

  // ─── Integration / edge cases ──────────────────────────────────────────

  describe("integration", () => {
    it("arithmetic preserves all fields", () => {
      const t = tm.createTime(14, 30, 45, 123)
      const result = tm.addHours(t, 1)
      expect(result).toEqual({ hour: 15, minute: 30, second: 45, millisecond: 123 })
    })

    it("chained arithmetic", () => {
      let t = tm.createTime(10, 0)
      t = tm.addHours(t, 2)
      t = tm.addMinutes(t, 45)
      t = tm.addSeconds(t, 30)
      expect(t).toEqual({ hour: 12, minute: 45, second: 30, millisecond: 0 })
    })

    it("parse → format roundtrip (24h)", () => {
      const parsed = tm.parse("14:30:45")!
      expect(tm.format(parsed, { hourCycle: "24", showSeconds: true })).toBe("14:30:45")
    })

    it("parse → format roundtrip (12h)", () => {
      const parsed = tm.parse("2:30 PM")!
      expect(tm.format(parsed, { hourCycle: "12" })).toBe("2:30 PM")
    })
  })
})
