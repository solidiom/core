import { describe, it, expect, vi } from "vitest"
import { composeRef } from "./compose-ref"

describe("composeRef", () => {
  // Use a plain object as a stand-in for an Element (compose-ref only passes it through)
  const makeEl = () => ({ tagName: "DIV" }) as unknown as HTMLElement

  it("calls all ref callbacks with the element", () => {
    const ref1 = vi.fn()
    const ref2 = vi.fn()
    const composed = composeRef(ref1, ref2)
    const el = makeEl()
    composed(el)
    expect(ref1).toHaveBeenCalledWith(el)
    expect(ref2).toHaveBeenCalledWith(el)
  })

  it("skips undefined refs", () => {
    const ref1 = vi.fn()
    const composed = composeRef(undefined, ref1, undefined)
    const el = makeEl()
    composed(el)
    expect(ref1).toHaveBeenCalledWith(el)
  })

  it("works with zero refs (no-op)", () => {
    const composed = composeRef()
    expect(() => composed(makeEl())).not.toThrow()
  })

  it("calls refs in order", () => {
    const order: number[] = []
    const composed = composeRef(
      () => order.push(1),
      () => order.push(2),
      () => order.push(3),
    )
    composed(makeEl())
    expect(order).toEqual([1, 2, 3])
  })
})
