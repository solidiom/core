import { describe, it, expect } from "vitest"
import { createVirtualizationDouble, type VirtualizationCapability } from "./virtualization"

describe("createVirtualizationDouble", () => {
  const double = createVirtualizationDouble()

  it("satisfies VirtualizationCapability shape", () => {
    const cap: VirtualizationCapability = double
    expect(cap.compute).toBeTypeOf("function")
    expect(cap.destroy).toBeTypeOf("function")
  })

  it("computes total size", () => {
    const result = double.compute({
      totalCount: 100,
      itemSize: 40,
      viewportHeight: 400,
      scrollOffset: 0,
    })
    expect(result.totalSize).toBe(4000)
  })

  it("returns visible items at offset 0", () => {
    const result = double.compute({
      totalCount: 100,
      itemSize: 40,
      viewportHeight: 400,
      scrollOffset: 0,
      overscan: 0,
    })
    expect(result.startIndex).toBe(0)
    expect(result.endIndex).toBe(9) // 400/40 - 1
    expect(result.items).toHaveLength(10)
  })

  it("includes overscan items", () => {
    const result = double.compute({
      totalCount: 100,
      itemSize: 40,
      viewportHeight: 400,
      scrollOffset: 200,
      overscan: 2,
    })
    // raw start = 5, raw end = 14. With overscan: start=3, end=16
    expect(result.startIndex).toBe(3)
    expect(result.endIndex).toBe(16)
  })

  it("clamps to bounds", () => {
    const result = double.compute({
      totalCount: 5,
      itemSize: 40,
      viewportHeight: 400,
      scrollOffset: 0,
      overscan: 10,
    })
    expect(result.startIndex).toBe(0)
    expect(result.endIndex).toBe(4)
  })

  it("items have correct start/end positions", () => {
    const result = double.compute({
      totalCount: 100,
      itemSize: 50,
      viewportHeight: 200,
      scrollOffset: 0,
      overscan: 0,
    })
    expect(result.items[0]).toEqual({ index: 0, start: 0, end: 50, size: 50 })
    expect(result.items[1]).toEqual({ index: 1, start: 50, end: 100, size: 50 })
  })

  it("produces identical output for identical input", () => {
    const input = { totalCount: 50, itemSize: 30, viewportHeight: 300, scrollOffset: 90 }
    expect(double.compute(input)).toEqual(double.compute(input))
  })
})
