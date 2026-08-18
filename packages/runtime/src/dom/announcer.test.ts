import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createRoot, flush } from "solid-js"
import { createAnnouncer } from "./announcer"

describe("createAnnouncer", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("uses polite as default politeness", () => {
    createRoot((dispose) => {
      const announcer = createAnnouncer()
      announcer.announce("hello")
      flush()
      expect(announcer.politeMessage()).toBe("hello")
      expect(announcer.assertiveMessage()).toBe("")
      dispose()
    })
  })

  it("announces with polite politeness sets politeMessage", () => {
    createRoot((dispose) => {
      const announcer = createAnnouncer()
      announcer.announce("update available", "polite")
      flush()
      expect(announcer.politeMessage()).toBe("update available")
      expect(announcer.assertiveMessage()).toBe("")
      dispose()
    })
  })

  it("announces with assertive politeness sets assertiveMessage", () => {
    createRoot((dispose) => {
      const announcer = createAnnouncer()
      announcer.announce("error occurred", "assertive")
      flush()
      expect(announcer.assertiveMessage()).toBe("error occurred")
      expect(announcer.politeMessage()).toBe("")
      dispose()
    })
  })

  it("clears message after clearDelay timeout", () => {
    createRoot((dispose) => {
      const announcer = createAnnouncer({ clearDelay: 3000 })
      announcer.announce("temporary")
      flush()
      expect(announcer.politeMessage()).toBe("temporary")

      vi.advanceTimersByTime(2999)
      flush()
      expect(announcer.politeMessage()).toBe("temporary")

      vi.advanceTimersByTime(1)
      flush()
      expect(announcer.politeMessage()).toBe("")
      dispose()
    })
  })

  it("deduplicates identical consecutive messages by appending zero-width space", () => {
    createRoot((dispose) => {
      const announcer = createAnnouncer({ deduplicate: true })
      announcer.announce("same")
      flush()
      expect(announcer.politeMessage()).toBe("same")

      announcer.announce("same")
      flush()
      expect(announcer.politeMessage()).toBe("same\u200B")
      dispose()
    })
  })

  it("does not deduplicate when deduplicate is disabled", () => {
    createRoot((dispose) => {
      const announcer = createAnnouncer({ deduplicate: false })
      announcer.announce("same")
      flush()
      expect(announcer.politeMessage()).toBe("same")

      announcer.announce("same")
      flush()
      expect(announcer.politeMessage()).toBe("same")
      dispose()
    })
  })

  it("drops oldest messages when maxQueue is exceeded", () => {
    createRoot((dispose) => {
      const announcer = createAnnouncer({ maxQueue: 2, clearDelay: 5000 })

      announcer.announce("first")
      flush()
      announcer.announce("second")
      flush()
      announcer.announce("third")
      flush()

      // The third message should be the current one
      expect(announcer.politeMessage()).toBe("third")

      // The oldest timer (for "first") was cleared, so only 2 timers remain
      // After 5000ms, the remaining timers clear
      vi.advanceTimersByTime(5000)
      flush()
      expect(announcer.politeMessage()).toBe("")
      dispose()
    })
  })

  it("clear() resets both channels", () => {
    createRoot((dispose) => {
      const announcer = createAnnouncer()
      announcer.announce("polite msg", "polite")
      flush()
      announcer.announce("assertive msg", "assertive")
      flush()

      expect(announcer.politeMessage()).toBe("polite msg")
      expect(announcer.assertiveMessage()).toBe("assertive msg")

      announcer.clear()
      flush()

      expect(announcer.politeMessage()).toBe("")
      expect(announcer.assertiveMessage()).toBe("")
      dispose()
    })
  })

  it("politeRegionProps returns correct aria attributes", () => {
    createRoot((dispose) => {
      const announcer = createAnnouncer()
      const props = announcer.politeRegionProps()

      expect(props.role).toBe("status")
      expect(props["aria-live"]).toBe("polite")
      expect(props["aria-atomic"]).toBe("true")
      expect(props.style).toContain("position:absolute")
      expect(props.style).toContain("clip:rect(0,0,0,0)")
      dispose()
    })
  })

  it("assertiveRegionProps returns correct aria attributes", () => {
    createRoot((dispose) => {
      const announcer = createAnnouncer()
      const props = announcer.assertiveRegionProps()

      expect(props.role).toBe("alert")
      expect(props["aria-live"]).toBe("assertive")
      expect(props["aria-atomic"]).toBe("true")
      expect(props.style).toContain("position:absolute")
      expect(props.style).toContain("clip:rect(0,0,0,0)")
      dispose()
    })
  })

  it("destroy cleans up timers", () => {
    createRoot((dispose) => {
      const announcer = createAnnouncer({ clearDelay: 5000 })
      announcer.announce("pending")
      flush()
      expect(announcer.politeMessage()).toBe("pending")

      announcer.destroy()
      flush()

      // Advancing timers should not cause errors or further state changes
      vi.advanceTimersByTime(10000)
      flush()
      expect(announcer.politeMessage()).toBe("")
      dispose()
    })
  })

  it("auto-cleans up with reactive owner", () => {
    let politeMsg: () => string
    createRoot((dispose) => {
      const announcer = createAnnouncer({ clearDelay: 5000 })
      politeMsg = announcer.politeMessage
      announcer.announce("owner scoped")
      flush()
      expect(announcer.politeMessage()).toBe("owner scoped")
      dispose()
    })
    // After owner disposal, timers are cleaned up — advancing should not throw
    vi.advanceTimersByTime(10000)
    // onCleanup calls destroy() which resets the message
    expect(politeMsg!()).toBe("")
  })

  it("uses default clearDelay of 7000ms", () => {
    createRoot((dispose) => {
      const announcer = createAnnouncer()
      announcer.announce("test")
      flush()

      vi.advanceTimersByTime(6999)
      flush()
      expect(announcer.politeMessage()).toBe("test")

      vi.advanceTimersByTime(1)
      flush()
      expect(announcer.politeMessage()).toBe("")
      dispose()
    })
  })

  it("handles different messages on same channel without dedup", () => {
    createRoot((dispose) => {
      const announcer = createAnnouncer()
      announcer.announce("first")
      flush()
      expect(announcer.politeMessage()).toBe("first")

      announcer.announce("second")
      flush()
      expect(announcer.politeMessage()).toBe("second")
      dispose()
    })
  })
})
