import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createRoot } from "solid-js"
import { observeElementSize, observeElementMutations } from "./observe-element"

// Minimal Element stand-in (observe-element only passes it to observer.observe/unobserve)
const makeEl = () => ({ tagName: "DIV" }) as unknown as Element

describe("observeElementSize", () => {
  let mockObserve: ReturnType<typeof vi.fn>
  let mockUnobserve: ReturnType<typeof vi.fn>
  let mockDisconnect: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockObserve = vi.fn()
    mockUnobserve = vi.fn()
    mockDisconnect = vi.fn()
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(public cb: ResizeObserverCallback) {}
        observe = mockObserve
        unobserve = mockUnobserve
        disconnect = mockDisconnect
      },
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("observes the element immediately", () => {
    const el = makeEl()
    observeElementSize(
      () => el,
      () => {},
    )
    expect(mockObserve).toHaveBeenCalledWith(el)
  })

  it("disconnects on dispose", () => {
    const el = makeEl()
    const dispose = observeElementSize(
      () => el,
      () => {},
    )
    dispose()
    expect(mockDisconnect).toHaveBeenCalled()
  })

  it("auto-cleans up with owner", () => {
    const el = makeEl()
    createRoot((dispose) => {
      observeElementSize(
        () => el,
        () => {},
      )
      expect(mockObserve).toHaveBeenCalled()
      dispose()
    })
    expect(mockDisconnect).toHaveBeenCalled()
  })

  it("returns no-op when ResizeObserver is unavailable", () => {
    vi.stubGlobal("ResizeObserver", undefined)
    const dispose = observeElementSize(
      () => makeEl(),
      () => {},
    )
    expect(dispose).toBeTypeOf("function")
    expect(() => dispose()).not.toThrow()
  })
})

describe("observeElementMutations", () => {
  let mockObserve: ReturnType<typeof vi.fn>
  let mockDisconnect: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockObserve = vi.fn()
    mockDisconnect = vi.fn()
    vi.stubGlobal(
      "MutationObserver",
      class {
        constructor(public cb: MutationCallback) {}
        observe = mockObserve
        disconnect = mockDisconnect
        takeRecords = vi.fn(() => [])
      },
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("observes with default options", () => {
    const el = makeEl()
    observeElementMutations(
      () => el,
      () => {},
    )
    expect(mockObserve).toHaveBeenCalledWith(el, { childList: true, subtree: true })
  })

  it("observes with custom options", () => {
    const el = makeEl()
    observeElementMutations(
      () => el,
      () => {},
      { attributes: true },
    )
    expect(mockObserve).toHaveBeenCalledWith(el, { attributes: true })
  })

  it("disconnects on dispose", () => {
    const el = makeEl()
    const dispose = observeElementMutations(
      () => el,
      () => {},
    )
    dispose()
    expect(mockDisconnect).toHaveBeenCalled()
  })

  it("returns no-op when MutationObserver is unavailable", () => {
    vi.stubGlobal("MutationObserver", undefined)
    const dispose = observeElementMutations(
      () => makeEl(),
      () => {},
    )
    expect(dispose).toBeTypeOf("function")
    expect(() => dispose()).not.toThrow()
  })
})
