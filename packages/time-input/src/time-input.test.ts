/**
 * Node-mode unit tests for TimeInput primitive.
 *
 * Tests semantic attributes, runtime utility availability, and pure logic.
 * Reactive behavior (segmented editing, spin button) requires a reactive owner
 * and is tested in browser-mode component tests.
 */

import { describe, it, expect } from "vitest"
import { applySemanticAttrs, createTimeMath, getHiddenInputProps } from "@solidiom/runtime"
import { Root, Segment, Separator } from "./index"

describe("time-input", () => {
  // ─── Exports ─────────────────────────────────────────────────────────

  it("exports a Root component", () => {
    expect(Root).toBeDefined()
    expect(typeof Root).toBe("function")
  })

  it("exports a Segment component", () => {
    expect(Segment).toBeDefined()
    expect(typeof Segment).toBe("function")
  })

  it("exports a Separator component", () => {
    expect(Separator).toBeDefined()
    expect(typeof Separator).toBe("function")
  })

  // ─── Semantic Attributes ─────────────────────────────────────────────

  describe("semantic attributes", () => {
    it("emits correct semantic attributes for root", () => {
      const attrs = applySemanticAttrs({ scope: "time-input", part: "root" })
      expect(attrs["data-scope"]).toBe("time-input")
      expect(attrs["data-part"]).toBe("root")
    })

    it("emits disabled state on root", () => {
      const attrs = applySemanticAttrs({
        scope: "time-input",
        part: "root",
        disabled: true,
      })
      expect(attrs["data-disabled"]).toBe("")
    })

    it("emits readonly state on root", () => {
      const attrs = applySemanticAttrs({
        scope: "time-input",
        part: "root",
        readonly: true,
      })
      expect(attrs["data-readonly"]).toBe("")
    })

    it("emits required state on root", () => {
      const attrs = applySemanticAttrs({
        scope: "time-input",
        part: "root",
        required: true,
      })
      expect(attrs["data-required"]).toBe("")
    })

    it("emits invalid state on root", () => {
      const attrs = applySemanticAttrs({
        scope: "time-input",
        part: "root",
        invalid: true,
      })
      expect(attrs["data-invalid"]).toBe("")
    })

    it("emits correct semantic attributes for segment", () => {
      const attrs = applySemanticAttrs({ scope: "time-input", part: "segment" })
      expect(attrs["data-scope"]).toBe("time-input")
      expect(attrs["data-part"]).toBe("segment")
    })

    it("emits highlighted state on focused segment", () => {
      const attrs = applySemanticAttrs({
        scope: "time-input",
        part: "segment",
        highlighted: true,
      })
      expect(attrs["data-highlighted"]).toBe("")
    })

    it("emits disabled state on segment", () => {
      const attrs = applySemanticAttrs({
        scope: "time-input",
        part: "segment",
        disabled: true,
      })
      expect(attrs["data-disabled"]).toBe("")
    })

    it("emits readonly state on segment", () => {
      const attrs = applySemanticAttrs({
        scope: "time-input",
        part: "segment",
        readonly: true,
      })
      expect(attrs["data-readonly"]).toBe("")
    })

    it("emits correct semantic attributes for separator", () => {
      const attrs = applySemanticAttrs({ scope: "time-input", part: "separator" })
      expect(attrs["data-scope"]).toBe("time-input")
      expect(attrs["data-part"]).toBe("separator")
    })

    it("omits state flags when not set", () => {
      const attrs = applySemanticAttrs({
        scope: "time-input",
        part: "root",
        disabled: false,
        readonly: false,
        required: false,
        invalid: false,
      })
      expect(attrs["data-disabled"]).toBeUndefined()
      expect(attrs["data-readonly"]).toBeUndefined()
      expect(attrs["data-required"]).toBeUndefined()
      expect(attrs["data-invalid"]).toBeUndefined()
    })
  })

  // ─── TimeMath (pure utility — no signals) ────────────────────────────

  describe("time-math integration", () => {
    it("createTimeMath is available from runtime", () => {
      expect(createTimeMath).toBeDefined()
      expect(typeof createTimeMath).toBe("function")
    })

    it("creates time values correctly", () => {
      const tm = createTimeMath()
      const time = tm.createTime(14, 30, 15)
      expect(time.hour).toBe(14)
      expect(time.minute).toBe(30)
      expect(time.second).toBe(15)
      expect(time.millisecond).toBe(0)
    })

    it("toSegments returns correct 12-hour segments", () => {
      const tm = createTimeMath()
      const time = tm.createTime(14, 30, 0)
      const segments = tm.toSegments(time, "12")
      expect(segments.hour).toBe("2")
      expect(segments.minute).toBe("30")
      expect(segments.second).toBe("00")
      expect(segments.period).toBe("PM")
    })

    it("toSegments returns correct 24-hour segments", () => {
      const tm = createTimeMath()
      const time = tm.createTime(14, 30, 0)
      const segments = tm.toSegments(time, "24")
      expect(segments.hour).toBe("14")
      expect(segments.minute).toBe("30")
      expect(segments.period).toBeUndefined()
    })

    it("toSegments handles midnight correctly in 12-hour cycle", () => {
      const tm = createTimeMath()
      const time = tm.createTime(0, 0, 0)
      const segments = tm.toSegments(time, "12")
      expect(segments.hour).toBe("12")
      expect(segments.period).toBe("AM")
    })

    it("toSegments handles noon correctly in 12-hour cycle", () => {
      const tm = createTimeMath()
      const time = tm.createTime(12, 0, 0)
      const segments = tm.toSegments(time, "12")
      expect(segments.hour).toBe("12")
      expect(segments.period).toBe("PM")
    })

    it("fromSegments reconstructs time from 12-hour segments", () => {
      const tm = createTimeMath()
      const time = tm.fromSegments(
        { hour: "2", minute: "30", second: "00", millisecond: "0", period: "PM" },
        "12",
      )
      expect(time.hour).toBe(14)
      expect(time.minute).toBe(30)
    })

    it("fromSegments reconstructs time from 24-hour segments", () => {
      const tm = createTimeMath()
      const time = tm.fromSegments(
        { hour: "14", minute: "30", second: "45", millisecond: "0" },
        "24",
      )
      expect(time.hour).toBe(14)
      expect(time.minute).toBe(30)
      expect(time.second).toBe(45)
    })

    it("cycle wraps hour correctly", () => {
      const tm = createTimeMath()
      const time = tm.createTime(23, 0, 0)
      const cycled = tm.cycle(time, "hour", 1)
      expect(cycled.hour).toBe(0)
    })

    it("cycle wraps minute correctly", () => {
      const tm = createTimeMath()
      const time = tm.createTime(10, 59, 0)
      const cycled = tm.cycle(time, "minute", 1)
      expect(cycled.minute).toBe(0)
    })

    it("togglePeriod switches AM to PM", () => {
      const tm = createTimeMath()
      const time = tm.createTime(9, 0, 0)
      const toggled = tm.togglePeriod(time)
      expect(toggled.hour).toBe(21)
    })

    it("togglePeriod switches PM to AM", () => {
      const tm = createTimeMath()
      const time = tm.createTime(21, 0, 0)
      const toggled = tm.togglePeriod(time)
      expect(toggled.hour).toBe(9)
    })

    it("clamp restricts time to min/max range", () => {
      const tm = createTimeMath()
      const time = tm.createTime(22, 0, 0)
      const min = tm.createTime(8, 0, 0)
      const max = tm.createTime(17, 0, 0)
      const clamped = tm.clamp(time, min, max)
      expect(clamped.hour).toBe(17)
      expect(clamped.minute).toBe(0)
    })

    it("toISOString formats correctly", () => {
      const tm = createTimeMath()
      const time = tm.createTime(9, 5, 3)
      expect(tm.toISOString(time)).toBe("09:05:03")
    })

    it("compare returns correct ordering", () => {
      const tm = createTimeMath()
      const a = tm.createTime(9, 0, 0)
      const b = tm.createTime(10, 0, 0)
      expect(tm.compare(a, b)).toBe(-1)
      expect(tm.compare(b, a)).toBe(1)
      expect(tm.compare(a, a)).toBe(0)
    })
  })

  // ─── Runtime utility availability ───────────────────────────────────

  describe("runtime utilities", () => {
    it("createSegmentedEditing is available from runtime", async () => {
      const { createSegmentedEditing } = await import("@solidiom/runtime")
      expect(createSegmentedEditing).toBeDefined()
      expect(typeof createSegmentedEditing).toBe("function")
    })

    it("createSpinButton is available from runtime", async () => {
      const { createSpinButton } = await import("@solidiom/runtime")
      expect(createSpinButton).toBeDefined()
      expect(typeof createSpinButton).toBe("function")
    })

    it("createSpinButton generates ARIA props", async () => {
      const { createSpinButton } = await import("@solidiom/runtime")
      const spin = createSpinButton({
        defaultValue: 10,
        min: 0,
        max: 23,
        step: 1,
      })
      const ariaProps = spin.spinButtonProps()
      expect(ariaProps.role).toBe("spinbutton")
      expect(ariaProps["aria-valuemin"]).toBe(0)
      expect(ariaProps["aria-valuemax"]).toBe(23)
      expect(ariaProps["aria-valuenow"]).toBe(10)
    })
  })

  // ─── Hidden input for form participation ─────────────────────────────

  describe("hidden input", () => {
    it("getHiddenInputProps generates form-ready props", () => {
      const props = getHiddenInputProps({
        name: "time",
        value: () => "14:30:00",
        required: () => true,
        disabled: () => false,
      })
      expect(props).toHaveLength(1)
      expect(props[0]!.type).toBe("hidden")
      expect(props[0]!.name).toBe("time")
      expect(props[0]!.value).toBe("14:30:00")
      expect(props[0]!.required).toBe(true)
      expect(props[0]!.disabled).toBe(false)
      expect(props[0]!["aria-hidden"]).toBe("true")
    })

    it("getHiddenInputProps handles disabled state", () => {
      const props = getHiddenInputProps({
        name: "time",
        value: () => "08:00:00",
        disabled: () => true,
      })
      expect(props[0]!.disabled).toBe(true)
    })

    it("getHiddenInputProps includes visually hidden style", () => {
      const props = getHiddenInputProps({
        name: "time",
        value: () => "12:00:00",
      })
      expect(props[0]!.style).toContain("position:absolute")
      expect(props[0]!.style).toContain("clip:rect(0,0,0,0)")
    })
  })
})
