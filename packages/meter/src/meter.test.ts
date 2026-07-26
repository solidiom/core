/**
 * Unit tests for Meter utility functions (node-mode).
 */

import { describe, it, expect } from "vitest"
import { deriveMeterStatus } from "./derive-status"

describe("deriveMeterStatus", () => {
  it("returns safe when no thresholds are provided", () => {
    expect(deriveMeterStatus(50)).toBe("safe")
  })

  describe("optimum is high (higher values are better)", () => {
    it("returns safe when value >= high", () => {
      expect(deriveMeterStatus(80, 25, 75, 100)).toBe("safe")
    })

    it("returns caution when value is between low and high", () => {
      expect(deriveMeterStatus(50, 25, 75, 100)).toBe("caution")
    })

    it("returns danger when value < low", () => {
      expect(deriveMeterStatus(10, 25, 75, 100)).toBe("danger")
    })

    it("returns safe when value equals high exactly", () => {
      expect(deriveMeterStatus(75, 25, 75, 100)).toBe("safe")
    })
  })

  describe("optimum is low (lower values are better)", () => {
    it("returns safe when value <= low", () => {
      expect(deriveMeterStatus(10, 25, 75, 0)).toBe("safe")
    })

    it("returns caution when value is between low and high", () => {
      expect(deriveMeterStatus(50, 25, 75, 0)).toBe("caution")
    })

    it("returns danger when value > high", () => {
      expect(deriveMeterStatus(90, 25, 75, 0)).toBe("danger")
    })

    it("returns safe when value equals low exactly", () => {
      expect(deriveMeterStatus(25, 25, 75, 0)).toBe("safe")
    })
  })

  describe("optimum is in the middle", () => {
    it("returns safe when value is between low and high", () => {
      expect(deriveMeterStatus(50, 25, 75, 50)).toBe("safe")
    })

    it("returns caution when value is below low", () => {
      expect(deriveMeterStatus(10, 25, 75, 50)).toBe("caution")
    })

    it("returns caution when value is above high", () => {
      expect(deriveMeterStatus(90, 25, 75, 50)).toBe("caution")
    })
  })

  describe("partial thresholds", () => {
    it("returns safe with only low (value above)", () => {
      expect(deriveMeterStatus(50, 25, undefined, undefined)).toBe("safe")
    })

    it("returns caution with only low (value below)", () => {
      expect(deriveMeterStatus(10, 25, undefined, undefined)).toBe("caution")
    })

    it("returns safe with only high (value below)", () => {
      expect(deriveMeterStatus(50, undefined, 75, undefined)).toBe("safe")
    })

    it("returns caution with only high (value above)", () => {
      expect(deriveMeterStatus(90, undefined, 75, undefined)).toBe("caution")
    })
  })
})
