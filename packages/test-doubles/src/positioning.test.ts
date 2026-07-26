import { describe, it, expect } from "vitest"
import { createPositioningDouble, type PositioningCapability } from "./positioning"

describe("createPositioningDouble", () => {
  const double = createPositioningDouble()
  const ref = { x: 100, y: 100, width: 80, height: 40 }
  const floating = { width: 120, height: 60 }

  it("satisfies PositioningCapability shape", () => {
    const cap: PositioningCapability = double
    expect(cap.compute).toBeTypeOf("function")
    expect(cap.destroy).toBeTypeOf("function")
  })

  it("positions bottom (default offset 8)", () => {
    const result = double.compute({
      referenceRect: ref,
      floatingRect: floating,
      placement: "bottom",
    })
    expect(result.x).toBe(100 + 80 / 2 - 120 / 2) // 80
    expect(result.y).toBe(100 + 40 + 8) // 148
    expect(result.placement).toBe("bottom")
  })

  it("positions top", () => {
    const result = double.compute({ referenceRect: ref, floatingRect: floating, placement: "top" })
    expect(result.y).toBe(100 - 60 - 8) // 32
  })

  it("positions right", () => {
    const result = double.compute({
      referenceRect: ref,
      floatingRect: floating,
      placement: "right",
    })
    expect(result.x).toBe(100 + 80 + 8) // 188
  })

  it("positions left", () => {
    const result = double.compute({ referenceRect: ref, floatingRect: floating, placement: "left" })
    expect(result.x).toBe(100 - 120 - 8) // -28
  })

  it("respects custom offset", () => {
    const result = double.compute({
      referenceRect: ref,
      floatingRect: floating,
      placement: "bottom",
      offset: 16,
    })
    expect(result.y).toBe(100 + 40 + 16) // 156
  })

  it("handles bottom-start alignment", () => {
    const result = double.compute({
      referenceRect: ref,
      floatingRect: floating,
      placement: "bottom-start",
    })
    expect(result.x).toBe(ref.x) // 100
  })

  it("handles bottom-end alignment", () => {
    const result = double.compute({
      referenceRect: ref,
      floatingRect: floating,
      placement: "bottom-end",
    })
    expect(result.x).toBe(ref.x + ref.width - floating.width) // 60
  })

  it("produces identical output for identical input (deterministic)", () => {
    const input = { referenceRect: ref, floatingRect: floating, placement: "top" as const }
    const r1 = double.compute(input)
    const r2 = double.compute(input)
    expect(r1).toEqual(r2)
  })
})
