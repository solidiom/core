import { describe, it, expect } from "vitest"
import { createCarouselPhysicsDouble, type CarouselPhysicsCapability } from "./carousel-physics"

describe("createCarouselPhysicsDouble", () => {
  const double = createCarouselPhysicsDouble()
  const geometry = { slideCount: 5, slideWidth: 300, gap: 20, containerWidth: 400 }

  it("satisfies CarouselPhysicsCapability shape", () => {
    const cap: CarouselPhysicsCapability = double
    expect(cap.compute).toBeTypeOf("function")
    expect(cap.nearestSnap).toBeTypeOf("function")
    expect(cap.destroy).toBeTypeOf("function")
  })

  it("computes snap points", () => {
    const result = double.compute(geometry, 0)
    expect(result.snapPoints).toEqual([0, 320, 640, 960, 1280])
  })

  it("returns correct scroll position for selected index", () => {
    const result = double.compute(geometry, 2)
    expect(result.scrollPosition).toBe(640)
    expect(result.selectedIndex).toBe(2)
  })

  it("reports canScrollPrev/canScrollNext", () => {
    expect(double.compute(geometry, 0).canScrollPrev).toBe(false)
    expect(double.compute(geometry, 0).canScrollNext).toBe(true)
    expect(double.compute(geometry, 4).canScrollPrev).toBe(true)
    expect(double.compute(geometry, 4).canScrollNext).toBe(false)
  })

  it("clamps selected index to bounds", () => {
    expect(double.compute(geometry, -1).selectedIndex).toBe(0)
    expect(double.compute(geometry, 99).selectedIndex).toBe(4)
  })

  it("finds nearest snap index", () => {
    expect(double.nearestSnap(geometry, 0)).toBe(0)
    expect(double.nearestSnap(geometry, 300)).toBe(1) // closer to 320 than 0
    expect(double.nearestSnap(geometry, 500)).toBe(2) // closer to 640 than 320
    expect(double.nearestSnap(geometry, 600)).toBe(2) // closer to 640
  })

  it("produces identical output for identical input", () => {
    expect(double.compute(geometry, 1)).toEqual(double.compute(geometry, 1))
  })
})
