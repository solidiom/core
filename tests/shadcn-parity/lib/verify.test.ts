import { describe, it, expect } from "vitest"
import { assertToken, pixelVerdict } from "./verify"

describe("pixelVerdict", () => {
  it("skips when sharp is unavailable (diff === null)", () => {
    expect(pixelVerdict(null, 5)).toBe("skip")
  })
  it("passes when diff is within tolerance", () => {
    expect(pixelVerdict(0, 5)).toBe("pass")
    expect(pixelVerdict(5, 5)).toBe("pass")
    expect(pixelVerdict(1.2, 5)).toBe("pass")
  })
  it("fails when diff exceeds tolerance (including Infinity)", () => {
    expect(pixelVerdict(5.01, 5)).toBe("fail")
    expect(pixelVerdict(Infinity, 5)).toBe("fail")
  })
})

describe("assertToken", () => {
  it("passes an exact match", () => {
    expect(assertToken("0.5rem", "0.5rem")).toEqual({
      pass: true,
      expected: "0.5rem",
      actual: "0.5rem",
    })
  })
  it("passes a relational >= assertion", () => {
    expect(assertToken(">=40", "48")).toEqual({ pass: true, expected: ">=40", actual: "48" })
    expect(assertToken(">=40", "32")).toEqual({ pass: false, expected: ">=40", actual: "32" })
  })
  it("passes a relational <= assertion", () => {
    expect(assertToken("<=10", "8")).toEqual({ pass: true, expected: "<=10", actual: "8" })
    expect(assertToken("<=10", "12")).toEqual({ pass: false, expected: "<=10", actual: "12" })
  })
  it("fails a non-matching exact value", () => {
    expect(assertToken("0.5rem", "8px")).toEqual({ pass: false, expected: "0.5rem", actual: "8px" })
  })
})
