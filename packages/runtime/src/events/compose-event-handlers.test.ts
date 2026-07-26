import { describe, it, expect, vi } from "vitest"
import { composeEventHandlers } from "./compose-event-handlers"

describe("composeEventHandlers", () => {
  it("returns undefined when no handlers provided", () => {
    expect(composeEventHandlers()).toBeUndefined()
  })

  it("returns undefined when all handlers are undefined", () => {
    expect(composeEventHandlers(undefined, undefined)).toBeUndefined()
  })

  it("calls all handlers in order", () => {
    const order: number[] = []
    const h1 = vi.fn(() => order.push(1))
    const h2 = vi.fn(() => order.push(2))
    const composed = composeEventHandlers(h1, h2)!
    composed(new Event("click"))
    expect(order).toEqual([1, 2])
  })

  it("stops after preventDefault", () => {
    const h1 = vi.fn((e: Event) => e.preventDefault())
    const h2 = vi.fn()
    const composed = composeEventHandlers(h1, h2)!
    const event = new Event("click", { cancelable: true })
    composed(event)
    expect(h1).toHaveBeenCalled()
    expect(h2).not.toHaveBeenCalled()
  })

  it("skips undefined handlers in the middle", () => {
    const h1 = vi.fn()
    const h2 = vi.fn()
    const composed = composeEventHandlers(h1, undefined, h2)!
    composed(new Event("click"))
    expect(h1).toHaveBeenCalled()
    expect(h2).toHaveBeenCalled()
  })

  it("supports Solid bound tuple handlers", () => {
    const handler = vi.fn((_data: string, _event: Event) => {})
    const tuple: [typeof handler, string] = [handler, "bound-data"]
    const composed = composeEventHandlers(tuple)!
    const event = new Event("click")
    composed(event)
    expect(handler).toHaveBeenCalledWith("bound-data", event)
  })
})
