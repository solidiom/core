import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createRoot, createSignal, flush } from "solid-js"
import { createScrollAnchor } from "./scroll-anchor"

/**
 * Creates a mock scroll container with configurable geometry.
 * Uses a plain object cast to HTMLElement since tests run in Node (no DOM).
 */
function createMockContainer(opts: {
  scrollTop?: number
  scrollHeight?: number
  clientHeight?: number
} = {}): HTMLElement {
  const listeners: Record<string, Array<() => void>> = {}
  const el = {
    scrollTop: opts.scrollTop ?? 0,
    scrollHeight: opts.scrollHeight ?? 1000,
    clientHeight: opts.clientHeight ?? 500,
    scrollTo: vi.fn(),
    addEventListener: vi.fn((event: string, handler: () => void, _opts?: unknown) => {
      if (!listeners[event]) listeners[event] = []
      listeners[event].push(handler)
    }),
    removeEventListener: vi.fn((event: string, handler: () => void) => {
      const arr = listeners[event]
      if (arr) {
        const idx = arr.indexOf(handler)
        if (idx !== -1) arr.splice(idx, 1)
      }
    }),
  }
  return el as unknown as HTMLElement
}

describe("createScrollAnchor", () => {
  let mockObserve: ReturnType<typeof vi.fn>
  let mockDisconnect: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockObserve = vi.fn()
    mockDisconnect = vi.fn()
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(public cb: () => void) {}
        observe = mockObserve
        unobserve = vi.fn()
        disconnect = mockDisconnect
      },
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  describe("isAtBottom detection", () => {
    it("is true when scrolled to bottom", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 500,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        anchor.updateScrollState()
        flush()
        expect(anchor.isAtBottom()).toBe(true)
        dispose()
      })
    })

    it("is true when within bottomThreshold of bottom", () => {
      createRoot((dispose) => {
        // scrollHeight(1000) - scrollTop(460) - clientHeight(500) = 40 <= 50
        const container = createMockContainer({
          scrollTop: 460,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
          bottomThreshold: 50,
        })

        anchor.updateScrollState()
        flush()
        expect(anchor.isAtBottom()).toBe(true)
        dispose()
      })
    })

    it("is false when scrolled up past threshold", () => {
      createRoot((dispose) => {
        // scrollHeight(1000) - scrollTop(400) - clientHeight(500) = 100 > 50
        const container = createMockContainer({
          scrollTop: 400,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
          bottomThreshold: 50,
        })

        anchor.updateScrollState()
        flush()
        expect(anchor.isAtBottom()).toBe(false)
        dispose()
      })
    })
  })

  describe("bottomThreshold configuration", () => {
    it("uses custom bottomThreshold", () => {
      createRoot((dispose) => {
        // scrollHeight(1000) - scrollTop(400) - clientHeight(500) = 100 <= 100
        const container = createMockContainer({
          scrollTop: 400,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
          bottomThreshold: 100,
        })

        anchor.updateScrollState()
        flush()
        expect(anchor.isAtBottom()).toBe(true)
        dispose()
      })
    })

    it("defaults to 50px threshold", () => {
      createRoot((dispose) => {
        // scrollHeight(1000) - scrollTop(449) - clientHeight(500) = 51 > 50 (default)
        const container = createMockContainer({
          scrollTop: 449,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        anchor.updateScrollState()
        flush()
        expect(anchor.isAtBottom()).toBe(false)
        dispose()
      })
    })
  })

  describe("notifyNewContent", () => {
    it("auto-scrolls when at bottom", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 500,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        anchor.updateScrollState()
        flush()
        expect(anchor.isAtBottom()).toBe(true)

        anchor.notifyNewContent()
        flush()
        expect(container.scrollTo).toHaveBeenCalledWith({
          top: 1000,
          behavior: "smooth",
        })
        dispose()
      })
    })

    it("increments newContentCount when scrolled up", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 0,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        anchor.updateScrollState()
        flush()
        expect(anchor.isAtBottom()).toBe(false)

        anchor.notifyNewContent()
        flush()
        expect(anchor.newContentCount()).toBe(1)
        dispose()
      })
    })

    it("sets hasNewContent to true when content added while scrolled up", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 0,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        anchor.updateScrollState()
        flush()
        expect(anchor.hasNewContent()).toBe(false)

        anchor.notifyNewContent()
        flush()
        expect(anchor.hasNewContent()).toBe(true)
        dispose()
      })
    })

    it("accumulates count across multiple calls", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 0,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        anchor.updateScrollState()
        flush()

        anchor.notifyNewContent()
        anchor.notifyNewContent()
        anchor.notifyNewContent()
        flush()

        expect(anchor.newContentCount()).toBe(3)
        expect(anchor.hasNewContent()).toBe(true)
        dispose()
      })
    })
  })

  describe("dismissNewContent", () => {
    it("resets hasNewContent and newContentCount", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 0,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        anchor.updateScrollState()
        flush()
        anchor.notifyNewContent()
        anchor.notifyNewContent()
        flush()

        expect(anchor.hasNewContent()).toBe(true)
        expect(anchor.newContentCount()).toBe(2)

        anchor.dismissNewContent()
        flush()

        expect(anchor.hasNewContent()).toBe(false)
        expect(anchor.newContentCount()).toBe(0)
        dispose()
      })
    })

    it("scrolls to bottom after dismissing", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 0,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        anchor.updateScrollState()
        flush()
        anchor.notifyNewContent()
        flush()
        anchor.dismissNewContent()
        flush()

        expect(container.scrollTo).toHaveBeenCalledWith({
          top: 1000,
          behavior: "smooth",
        })
        dispose()
      })
    })
  })

  describe("scrollToBottom", () => {
    it("scrolls to bottom of container", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 0,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        anchor.scrollToBottom()
        flush()

        expect(container.scrollTo).toHaveBeenCalledWith({
          top: 1000,
          behavior: "smooth",
        })
        dispose()
      })
    })

    it("updates isAtBottom to true after scrolling", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 0,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        anchor.updateScrollState()
        flush()
        expect(anchor.isAtBottom()).toBe(false)

        anchor.scrollToBottom()
        flush()
        expect(anchor.isAtBottom()).toBe(true)
        dispose()
      })
    })

    it("accepts a custom scroll behavior override", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 0,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
          scrollBehavior: "smooth",
        })

        anchor.scrollToBottom("instant")
        flush()

        expect(container.scrollTo).toHaveBeenCalledWith({
          top: 1000,
          behavior: "instant",
        })
        dispose()
      })
    })

    it("uses scrollBehavior accessor when provided", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 0,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
          scrollBehavior: () => "instant",
        })

        anchor.scrollToBottom()
        flush()

        expect(container.scrollTo).toHaveBeenCalledWith({
          top: 1000,
          behavior: "instant",
        })
        dispose()
      })
    })
  })

  describe("onScrollStateChange callback", () => {
    it("fires when transitioning from at-bottom to scrolled-up", () => {
      createRoot((dispose) => {
        const onScrollStateChange = vi.fn()
        const container = createMockContainer({
          scrollTop: 500,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
          onScrollStateChange,
        })

        // Start at bottom
        anchor.updateScrollState()
        flush()
        expect(anchor.isAtBottom()).toBe(true)
        onScrollStateChange.mockClear()

        // Scroll up
        ;(container as unknown as { scrollTop: number }).scrollTop = 0
        anchor.updateScrollState()
        flush()

        expect(onScrollStateChange).toHaveBeenCalledWith(false)
        dispose()
      })
    })

    it("fires when transitioning from scrolled-up to at-bottom", () => {
      createRoot((dispose) => {
        const onScrollStateChange = vi.fn()
        const container = createMockContainer({
          scrollTop: 0,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
          onScrollStateChange,
        })

        // Start scrolled up
        anchor.updateScrollState()
        flush()
        expect(anchor.isAtBottom()).toBe(false)
        onScrollStateChange.mockClear()

        // Scroll to bottom
        ;(container as unknown as { scrollTop: number }).scrollTop = 500
        anchor.updateScrollState()
        flush()

        expect(onScrollStateChange).toHaveBeenCalledWith(true)
        dispose()
      })
    })

    it("does not fire when state remains the same", () => {
      createRoot((dispose) => {
        const onScrollStateChange = vi.fn()
        const container = createMockContainer({
          scrollTop: 500,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
          onScrollStateChange,
        })

        anchor.updateScrollState()
        flush()
        onScrollStateChange.mockClear()

        // Still at bottom
        anchor.updateScrollState()
        flush()
        expect(onScrollStateChange).not.toHaveBeenCalled()
        dispose()
      })
    })
  })

  describe("onNewContentWhileScrolledUp callback", () => {
    it("fires when new content added while scrolled up", () => {
      createRoot((dispose) => {
        const onNewContentWhileScrolledUp = vi.fn()
        const container = createMockContainer({
          scrollTop: 0,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
          onNewContentWhileScrolledUp,
        })

        anchor.updateScrollState()
        flush()
        anchor.notifyNewContent()
        flush()

        expect(onNewContentWhileScrolledUp).toHaveBeenCalledTimes(1)
        dispose()
      })
    })

    it("does not fire when at bottom", () => {
      createRoot((dispose) => {
        const onNewContentWhileScrolledUp = vi.fn()
        const container = createMockContainer({
          scrollTop: 500,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
          onNewContentWhileScrolledUp,
        })

        anchor.updateScrollState()
        flush()
        anchor.notifyNewContent()
        flush()

        expect(onNewContentWhileScrolledUp).not.toHaveBeenCalled()
        dispose()
      })
    })
  })

  describe("enabled option", () => {
    it("disables auto-scroll when enabled is false", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 500,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const [enabled] = createSignal(false, { ownedWrite: true })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
          enabled,
        })

        anchor.updateScrollState()
        flush()
        expect(anchor.isAtBottom()).toBe(true)

        anchor.notifyNewContent()
        flush()
        // Should NOT auto-scroll even though at bottom
        expect(container.scrollTo).not.toHaveBeenCalled()
        // Should still track as new content
        expect(anchor.hasNewContent()).toBe(true)
        expect(anchor.newContentCount()).toBe(1)
        dispose()
      })
    })

    it("still tracks state when disabled", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 0,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const [enabled] = createSignal(false, { ownedWrite: true })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
          enabled,
        })

        anchor.updateScrollState()
        flush()
        expect(anchor.isAtBottom()).toBe(false)
        dispose()
      })
    })
  })

  describe("attach", () => {
    it("adds a passive scroll event listener", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 500,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        anchor.attach()
        flush()

        expect(container.addEventListener).toHaveBeenCalledWith(
          "scroll",
          expect.any(Function),
          { passive: true },
        )
        dispose()
      })
    })

    it("returns a cleanup function that removes listener", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 500,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        const cleanup = anchor.attach()
        cleanup()

        expect(container.removeEventListener).toHaveBeenCalledWith(
          "scroll",
          expect.any(Function),
        )
        dispose()
      })
    })

    it("sets up ResizeObserver on the container", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 500,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        anchor.attach()
        flush()

        expect(mockObserve).toHaveBeenCalledWith(container)
        dispose()
      })
    })

    it("disconnects ResizeObserver on cleanup", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 500,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        const cleanup = anchor.attach()
        cleanup()

        expect(mockDisconnect).toHaveBeenCalled()
        dispose()
      })
    })

    it("updates scroll state on initial attach", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 0,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        // Default is true before any attach/update
        expect(anchor.isAtBottom()).toBe(true)

        anchor.attach()
        flush()

        // After attach, should reflect actual scroll position
        expect(anchor.isAtBottom()).toBe(false)
        dispose()
      })
    })

    it("auto-cleans up within reactive owner", () => {
      const container = createMockContainer({
        scrollTop: 500,
        scrollHeight: 1000,
        clientHeight: 500,
      })

      createRoot((dispose) => {
        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })
        anchor.attach()
        flush()
        dispose()
      })

      expect(container.removeEventListener).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
      )
      expect(mockDisconnect).toHaveBeenCalled()
    })
  })

  describe("SSR safety", () => {
    it("does not throw when container is undefined", () => {
      createRoot((dispose) => {
        const anchor = createScrollAnchor({
          scrollContainer: () => undefined,
        })

        expect(() => anchor.updateScrollState()).not.toThrow()
        expect(() => anchor.scrollToBottom()).not.toThrow()
        expect(() => anchor.notifyNewContent()).not.toThrow()
        expect(() => anchor.dismissNewContent()).not.toThrow()
        dispose()
      })
    })

    it("attach returns a no-op cleanup when container is undefined", () => {
      createRoot((dispose) => {
        const anchor = createScrollAnchor({
          scrollContainer: () => undefined,
        })

        const cleanup = anchor.attach()
        expect(cleanup).toBeInstanceOf(Function)
        expect(() => cleanup()).not.toThrow()
        dispose()
      })
    })

    it("signals retain default values when container is undefined", () => {
      createRoot((dispose) => {
        const anchor = createScrollAnchor({
          scrollContainer: () => undefined,
        })

        expect(anchor.isAtBottom()).toBe(true)
        expect(anchor.hasNewContent()).toBe(false)
        expect(anchor.newContentCount()).toBe(0)
        dispose()
      })
    })
  })

  describe("scrolling back to bottom clears new content", () => {
    it("clears hasNewContent and count when user scrolls back to bottom", () => {
      createRoot((dispose) => {
        const container = createMockContainer({
          scrollTop: 0,
          scrollHeight: 1000,
          clientHeight: 500,
        })

        const anchor = createScrollAnchor({
          scrollContainer: () => container,
        })

        anchor.updateScrollState()
        flush()
        anchor.notifyNewContent()
        anchor.notifyNewContent()
        flush()

        expect(anchor.hasNewContent()).toBe(true)
        expect(anchor.newContentCount()).toBe(2)

        // User scrolls back to bottom
        ;(container as unknown as { scrollTop: number }).scrollTop = 500
        anchor.updateScrollState()
        flush()

        expect(anchor.isAtBottom()).toBe(true)
        expect(anchor.hasNewContent()).toBe(false)
        expect(anchor.newContentCount()).toBe(0)
        dispose()
      })
    })
  })
})
