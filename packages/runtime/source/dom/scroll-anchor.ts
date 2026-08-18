/**
 * Scroll anchor — reactive scroll position management for chat-style auto-scroll behavior.
 *
 * Monitors a scroll container and provides reactive signals for "at bottom" state,
 * auto-scroll on new content, and new-content indicators. Uses passive scroll listeners
 * and ResizeObserver for performance. SSR-safe: no-ops when container is undefined.
 */

import { createSignal, onCleanup, getOwner, type Accessor } from "solid-js"

/**
 * Options for configuring scroll anchor behavior.
 */
export interface ScrollAnchorOptions {
  /** Reference to the scroll container element. */
  scrollContainer: () => HTMLElement | undefined
  /** Threshold (px) from bottom to consider "at bottom". Default: 50. */
  bottomThreshold?: number
  /** Scroll behavior for auto-scroll. Default: 'smooth'. */
  scrollBehavior?: ScrollBehavior | Accessor<ScrollBehavior>
  /** Called when scroll state changes (at bottom vs scrolled up). */
  onScrollStateChange?: (isAtBottom: boolean) => void
  /** Called when new content appears while user is scrolled up. */
  onNewContentWhileScrolledUp?: () => void
  /** Whether auto-scroll is enabled. Default: true. */
  enabled?: Accessor<boolean>
}

/**
 * The scroll anchor instance returned by createScrollAnchor.
 */
export interface ScrollAnchor {
  /** Whether the user is currently at/near the bottom (reactive). */
  isAtBottom: Accessor<boolean>
  /** Whether new content has appeared while user was scrolled up (reactive). */
  hasNewContent: Accessor<boolean>
  /** Number of new items since user scrolled up (reactive). */
  newContentCount: Accessor<number>
  /** Scroll to the bottom of the container. */
  scrollToBottom: (behavior?: ScrollBehavior) => void
  /** Notify that new content was added (triggers auto-scroll if at bottom). */
  notifyNewContent: () => void
  /** Dismiss the "new content" indicator and scroll to bottom. */
  dismissNewContent: () => void
  /** Attach scroll listener to the container. Returns cleanup function. */
  attach: () => () => void
  /** Manually update the scroll state (call after container resize). */
  updateScrollState: () => void
}

/**
 * Creates a reactive scroll anchor for chat-style auto-scroll behavior.
 *
 * Monitors a scrollable container and tracks whether the user is "at the bottom."
 * When new content is added and the user is at the bottom, auto-scrolls to keep up.
 * When the user has scrolled up, tracks new content count and provides indicators.
 *
 * @param options - Configuration for container, thresholds, and callbacks.
 * @returns A `ScrollAnchor` object with reactive state and control methods.
 */
export function createScrollAnchor(options: ScrollAnchorOptions): ScrollAnchor {
  const {
    scrollContainer,
    bottomThreshold = 50,
    scrollBehavior = "smooth",
    onScrollStateChange,
    onNewContentWhileScrolledUp,
    enabled,
  } = options

  const [isAtBottom, setIsAtBottom] = createSignal(true, { ownedWrite: true })
  const [hasNewContent, setHasNewContent] = createSignal(false, { ownedWrite: true })
  const [newContentCount, setNewContentCount] = createSignal(0, { ownedWrite: true })

  function resolveScrollBehavior(override?: ScrollBehavior): ScrollBehavior {
    if (override !== undefined) return override
    return typeof scrollBehavior === "function" ? scrollBehavior() : scrollBehavior
  }

  function isEnabled(): boolean {
    return enabled ? enabled() : true
  }

  function computeIsAtBottom(container: HTMLElement): boolean {
    const { scrollTop, scrollHeight, clientHeight } = container
    return scrollHeight - scrollTop - clientHeight <= bottomThreshold
  }

  function updateScrollState(): void {
    const container = scrollContainer()
    if (!container) return

    const atBottom = computeIsAtBottom(container)
    const prev = isAtBottom()
    setIsAtBottom(atBottom)

    if (atBottom !== prev) {
      onScrollStateChange?.(atBottom)
    }

    // If user scrolled back to bottom, clear new content indicator
    if (atBottom && hasNewContent()) {
      setHasNewContent(false)
      setNewContentCount(0)
    }
  }

  function scrollToBottom(behavior?: ScrollBehavior): void {
    const container = scrollContainer()
    if (!container) return

    container.scrollTo({
      top: container.scrollHeight,
      behavior: resolveScrollBehavior(behavior),
    })
    setIsAtBottom(true)
  }

  function notifyNewContent(): void {
    const container = scrollContainer()
    if (!container) return

    const atBottom = computeIsAtBottom(container)

    if (atBottom && isEnabled()) {
      scrollToBottom()
    } else {
      setNewContentCount((c) => c + 1)
      setHasNewContent(true)
      onNewContentWhileScrolledUp?.()
    }
  }

  function dismissNewContent(): void {
    setHasNewContent(false)
    setNewContentCount(0)
    scrollToBottom()
  }

  function attach(): () => void {
    const container = scrollContainer()
    if (!container) return () => {}

    const handleScroll = (): void => {
      updateScrollState()
    }

    container.addEventListener("scroll", handleScroll, { passive: true })

    let observer: ResizeObserver | undefined
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        updateScrollState()
      })
      observer.observe(container)
    }

    // Initial state check
    updateScrollState()

    const cleanup = (): void => {
      container.removeEventListener("scroll", handleScroll)
      observer?.disconnect()
    }

    // Auto-cleanup with owner if available
    if (getOwner()) {
      onCleanup(cleanup)
    }

    return cleanup
  }

  return {
    isAtBottom,
    hasNewContent,
    newContentCount,
    scrollToBottom,
    notifyNewContent,
    dismissNewContent,
    attach,
    updateScrollState,
  }
}
