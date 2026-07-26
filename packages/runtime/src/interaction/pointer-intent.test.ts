import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createPointerIntent } from "./pointer-intent"

describe("createPointerIntent", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("confirms after delay when pointer stays on trigger", () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const intent = createPointerIntent({
      delay: 100,
      onIntentConfirm: onConfirm,
      onIntentCancel: onCancel,
    })

    intent.handleTriggerEnter()
    expect(onConfirm).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
  })

  it("confirms immediately when pointer moves from trigger to content", () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const intent = createPointerIntent({
      delay: 150,
      onIntentConfirm: onConfirm,
      onIntentCancel: onCancel,
    })

    intent.handleTriggerEnter()
    vi.advanceTimersByTime(50) // not yet confirmed
    intent.handleTriggerLeave()
    intent.handleContentEnter()

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
  })

  it("cancels when pointer leaves trigger without reaching content", () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const intent = createPointerIntent({
      delay: 100,
      onIntentConfirm: onConfirm,
      onIntentCancel: onCancel,
    })

    intent.handleTriggerEnter()
    vi.advanceTimersByTime(50)
    intent.handleTriggerLeave()

    // Grace period passes without entering content
    vi.advanceTimersByTime(100)
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("cancels when pointer leaves content", () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const intent = createPointerIntent({
      delay: 100,
      onIntentConfirm: onConfirm,
      onIntentCancel: onCancel,
    })

    // Open via trigger → content
    intent.handleTriggerEnter()
    vi.advanceTimersByTime(100)
    expect(onConfirm).toHaveBeenCalledTimes(1)

    intent.handleTriggerLeave()
    intent.handleContentEnter()
    intent.handleContentLeave()

    vi.advanceTimersByTime(100)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it("re-entry on trigger resets leave timer", () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const intent = createPointerIntent({
      delay: 100,
      onIntentConfirm: onConfirm,
      onIntentCancel: onCancel,
    })

    // Confirm first
    intent.handleTriggerEnter()
    vi.advanceTimersByTime(100)

    // Leave trigger
    intent.handleTriggerLeave()
    vi.advanceTimersByTime(50) // halfway through leave timer

    // Re-enter trigger before cancel fires
    intent.handleTriggerEnter()
    vi.advanceTimersByTime(100)

    expect(onCancel).not.toHaveBeenCalled()
  })

  it("cancel() clears all state", () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const intent = createPointerIntent({
      delay: 100,
      onIntentConfirm: onConfirm,
      onIntentCancel: onCancel,
    })

    intent.handleTriggerEnter()
    intent.cancel()
    vi.advanceTimersByTime(200)

    expect(onConfirm).not.toHaveBeenCalled()
    expect(onCancel).not.toHaveBeenCalled()
  })

  it("uses default delay of 150ms", () => {
    const onConfirm = vi.fn()
    const intent = createPointerIntent({ onIntentConfirm: onConfirm, onIntentCancel: vi.fn() })

    intent.handleTriggerEnter()
    vi.advanceTimersByTime(149)
    expect(onConfirm).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
