import { describe, it, expect } from "vitest"
import { applySemanticAttrs } from "@solidiom/runtime"
import { simpleSnapPhysics } from "./carousel"

describe("Carousel", () => {
  it("emits correct semantic attributes for root", () => {
    const attrs = applySemanticAttrs({ scope: "carousel", part: "root" })
    expect(attrs["data-scope"]).toBe("carousel")
    expect(attrs["data-part"]).toBe("root")
  })

  describe("simpleSnapPhysics.compute", () => {
    const geometry = { slideCount: 5, slideWidth: 300, gap: 16, containerWidth: 600 }

    it("computes scroll position for a given index", () => {
      const result = simpleSnapPhysics.compute(geometry, 2)
      expect(result.selectedIndex).toBe(2)
      expect(result.scrollPosition).toBe(2 * (300 + 16))
      expect(result.canScrollPrev).toBe(true)
      expect(result.canScrollNext).toBe(true)
    })

    it("reports cannot scroll prev at index 0", () => {
      const result = simpleSnapPhysics.compute(geometry, 0)
      expect(result.canScrollPrev).toBe(false)
      expect(result.canScrollNext).toBe(true)
    })

    it("reports cannot scroll next at last index", () => {
      const result = simpleSnapPhysics.compute(geometry, 4)
      expect(result.canScrollPrev).toBe(true)
      expect(result.canScrollNext).toBe(false)
    })

    it("generates correct snap points", () => {
      const result = simpleSnapPhysics.compute(geometry, 0)
      expect(result.snapPoints).toEqual([0, 316, 632, 948, 1264])
    })
  })

  describe("simpleSnapPhysics.nearestSnap", () => {
    const geometry = { slideCount: 5, slideWidth: 300, gap: 16, containerWidth: 600 }

    it("snaps to nearest index", () => {
      expect(simpleSnapPhysics.nearestSnap(geometry, 400)).toBe(1)
      expect(simpleSnapPhysics.nearestSnap(geometry, 0)).toBe(0)
      expect(simpleSnapPhysics.nearestSnap(geometry, 1300)).toBe(4)
    })

    it("clamps to valid range", () => {
      expect(simpleSnapPhysics.nearestSnap(geometry, 99999)).toBe(4)
      expect(simpleSnapPhysics.nearestSnap(geometry, -100)).toBe(0)
    })
  })
})
