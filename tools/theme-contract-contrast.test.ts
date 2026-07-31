import { describe, expect, it } from "vitest"
import {
  contrastBetween,
  contrastRatio,
  parseColor,
  relativeLuminance,
} from "./theme-contract-contrast"

describe("parseColor", () => {
  it("parses 6-digit hex", () => {
    expect(parseColor("#111827")).toEqual({ r: 0x11, g: 0x18, b: 0x27 })
  })

  it("parses 3-digit hex by doubling each channel", () => {
    expect(parseColor("#fff")).toEqual({ r: 255, g: 255, b: 255 })
  })

  it("parses rgb() and rgba()", () => {
    expect(parseColor("rgb(17, 24, 39)")).toEqual({ r: 17, g: 24, b: 39 })
    expect(parseColor("rgba(17, 24, 39, 0.5)")).toEqual({ r: 17, g: 24, b: 39 })
  })

  it("returns undefined for an unsupported form", () => {
    expect(parseColor("hsl(222 47% 11%)")).toBeUndefined()
    expect(parseColor("var(--ui-primary)")).toBeUndefined()
  })
})

describe("relativeLuminance", () => {
  it("gives black 0 and white 1", () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 5)
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5)
  })
})

describe("contrastRatio", () => {
  it("gives black on white the maximum ratio of 21:1", () => {
    expect(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toBeCloseTo(21, 1)
  })

  it("gives an identical pair the minimum ratio of 1:1", () => {
    expect(contrastRatio({ r: 128, g: 128, b: 128 }, { r: 128, g: 128, b: 128 })).toBeCloseTo(1, 5)
  })

  it("is symmetric regardless of argument order", () => {
    const a = { r: 20, g: 30, b: 40 }
    const b = { r: 220, g: 210, b: 200 }
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10)
  })
})

describe("contrastBetween", () => {
  it("computes a ratio between two hex literals", () => {
    expect(contrastBetween("#111827", "#F8FAFC")).toBeGreaterThan(10)
  })

  it("returns undefined when either literal cannot be parsed", () => {
    expect(contrastBetween("var(--ui-primary)", "#FFFFFF")).toBeUndefined()
  })

  it("flags a genuinely low-contrast pair", () => {
    expect(contrastBetween("#888888", "#999999")).toBeLessThan(3)
  })
})
