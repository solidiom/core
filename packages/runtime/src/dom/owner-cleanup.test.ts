import { describe, it, expect, vi } from "vitest"
import { createRoot } from "solid-js"
import { onOwnerCleanup, createDisposable } from "./owner-cleanup"

describe("onOwnerCleanup", () => {
  it("registers cleanup within a reactive owner", () => {
    const cleanup = vi.fn()
    createRoot((dispose) => {
      const result = onOwnerCleanup(cleanup)
      expect(result).toBe(true)
      expect(cleanup).not.toHaveBeenCalled()
      dispose()
    })
    expect(cleanup).toHaveBeenCalledOnce()
  })

  it("returns false when no owner exists", () => {
    const cleanup = vi.fn()
    // Outside createRoot — no owner
    const result = onOwnerCleanup(cleanup)
    expect(result).toBe(false)
    expect(cleanup).not.toHaveBeenCalled()
  })
})

describe("createDisposable", () => {
  it("calls setup immediately and teardown on owner dispose", () => {
    const setup = vi.fn()
    const teardown = vi.fn()
    createRoot((dispose) => {
      const manualDispose = createDisposable(setup, teardown)
      expect(setup).toHaveBeenCalledOnce()
      expect(teardown).not.toHaveBeenCalled()
      // Manual dispose is a no-op when owner-registered
      expect(manualDispose).toBeTypeOf("function")
      dispose()
    })
    expect(teardown).toHaveBeenCalledOnce()
  })

  it("returns manual dispose when no owner exists", () => {
    const setup = vi.fn()
    const teardown = vi.fn()
    const manualDispose = createDisposable(setup, teardown)
    expect(setup).toHaveBeenCalledOnce()
    expect(teardown).not.toHaveBeenCalled()
    manualDispose()
    expect(teardown).toHaveBeenCalledOnce()
  })
})
