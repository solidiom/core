import { describe, it, expect } from "vitest"
import { createMinimalPositioning, type PositioningCapability } from "./minimal-adapter"

describe("createMinimalPositioning", () => {
  const adapter = createMinimalPositioning()
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
    expect(result.x).toBe(80)
    expect(result.y).toBe(148)
    expect(result.placement).toBe("bottom")
  })

  it("computes top placement", () => {
    const result = adapter.compute({ referenceRect: ref, floatingRect: floating, placement: "top" })
    expect(result.y).toBe(32)
  })

  it("computes right placement", () => {
    const result = adapter.compute({
      referenceRect: ref,
      floatingRect: floating,
      placement: "right",
    })
    expect(result.x).toBe(188)
  })

  it("handles bottom-start alignment", () => {
    const result = adapter.compute({
      referenceRect: ref,
      floatingRect: floating,
      placement: "bottom-start",
    })
    expect(result.x).toBe(ref.x)
  })

  it("produces same output as Floating UI adapter (swap invariance)", () => {
    // Both adapters use the same arithmetic for synchronous compute
    const input = {
      referenceRect: ref,
      floatingRect: floating,
      placement: "bottom" as const,
      offset: 12,
    }
    const result = adapter.compute(input)
    expect(result.x).toBe(80) // same as Floating UI adapter
    expect(result.y).toBe(152) // 100 + 40 + 12
  })

  it("flips placement when flip is enabled and overflows viewport", () => {
    const flipAdapter = createMinimalPositioning({
      flip: true,
      viewport: { width: 800, height: 200 },
    })
    // Reference near bottom of viewport — bottom placement would overflow
    const nearBottom = { x: 100, y: 160, width: 80, height: 40 }
    const result = flipAdapter.compute({
      referenceRect: nearBottom,
      floatingRect: floating,
      placement: "bottom",
    })
    // Should flip to top
    expect(result.placement).toBe("top")
    expect(result.y).toBe(160 - 60 - 8) // 92
  })

  it("does not flip when within viewport", () => {
    const flipAdapter = createMinimalPositioning({
      flip: true,
      viewport: { width: 800, height: 600 },
    })
    const result = flipAdapter.compute({
      referenceRect: ref,
      floatingRect: floating,
      placement: "bottom",
    })
    expect(result.placement).toBe("bottom")
  })
})
