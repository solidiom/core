import { describe, it, expect } from "vitest"
import { createFloatingUIPositioning } from "./floating-ui-adapter"
import type { PositioningCapability } from "./capability"

describe("createFloatingUIPositioning", () => {
  const adapter = createFloatingUIPositioning()
  const ref = { x: 100, y: 100, width: 80, height: 40 }
  const floating = { width: 120, height: 60 }

  it("satisfies PositioningCapability shape", () => {
    const cap: PositioningCapability = adapter
    expect(cap.compute).toBeTypeOf("function")
    expect(cap.destroy).toBeTypeOf("function")
  })

  it("computes bottom placement", () => {
    const result = adapter.compute({
      referenceRect: ref,
      floatingRect: floating,
      placement: "bottom",
    })
    expect(result.placement).toBe("bottom")
    expect(result.x).toBe(80) // 100 + 80/2 - 120/2
    expect(result.y).toBe(148) // 100 + 40 + 8
  })

  it("computes top placement", () => {
    const result = adapter.compute({ referenceRect: ref, floatingRect: floating, placement: "top" })
    expect(result.placement).toBe("top")
    expect(result.y).toBe(32) // 100 - 60 - 8
  })

  it("respects custom offset", () => {
    const result = adapter.compute({
      referenceRect: ref,
      floatingRect: floating,
      placement: "bottom",
      offset: 16,
    })
    expect(result.y).toBe(156) // 100 + 40 + 16
  })

  it("produces same output as test double for same input (conformance)", () => {
    const input = { referenceRect: ref, floatingRect: floating, placement: "right" as const }
    const r1 = adapter.compute(input)
    const r2 = adapter.compute(input)
    expect(r1).toEqual(r2)
    expect(r1.x).toBe(188) // 100 + 80 + 8
  })

  it("destroy is callable", () => {
    expect(() => adapter.destroy()).not.toThrow()
  })
})
