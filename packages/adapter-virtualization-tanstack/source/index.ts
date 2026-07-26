/**
 * @solidiom/adapter-virtualization-tanstack — TanStack Virtual adapter.
 * Implements VirtualizationCapability@1 by delegating to @tanstack/virtual-core.
 *
 * The adapter owns the windowing algorithm (range calculation, overscan, variable
 * sizing). The primitive owns DOM (scroll container, absolute positioning, focus,
 * ARIA). Per §0.2: adapters return capability snapshots, not component props.
 */

import {
  Virtualizer,
  type VirtualizerOptions,
  type VirtualItem,
  elementScroll,
  observeElementOffset,
  observeElementRect,
} from "@tanstack/virtual-core"

// ─── Capability interface ─────────────────────────────────────────────────────

export interface VirtualizationInput {
  /** Total number of items in the list. */
  totalCount: number
  /** Fixed item size in px (used when estimateSize is not provided). */
  itemSize: number
  /** Viewport height in px. */
  viewportHeight: number
  /** Current scroll offset in px. */
  scrollOffset: number
  /** Extra items rendered outside the viewport on each side. Default: 3. */
  overscan?: number
}

export interface VirtualizationItem {
  index: number
  start: number
  end: number
  size: number
}

export interface VirtualizationResult {
  items: VirtualizationItem[]
  totalSize: number
  startIndex: number
  endIndex: number
}

export interface VirtualizationCapability {
  compute(input: VirtualizationInput): VirtualizationResult
  destroy(): void
}

// ─── Standalone adapter (no DOM element) ──────────────────────────────────────

/**
 * Creates a TanStack Virtual adapter that computes visible item ranges.
 * This is a stateless adapter: each `compute()` call creates a fresh Virtualizer
 * snapshot. For stateful scroll tracking, use `createTanStackVirtualScroller()`.
 */
export function createTanStackVirtualAdapter(): VirtualizationCapability {
  function compute(input: VirtualizationInput): VirtualizationResult {
    const { totalCount, itemSize, viewportHeight, scrollOffset, overscan = 3 } = input

    // Create a minimal virtualizer for range computation.
    // TanStack Virtual's core API requires scrollElement callbacks;
    // we supply stubs since we drive offset externally.
    const virtualizer = new Virtualizer<HTMLElement, HTMLElement>({
      count: totalCount,
      getScrollElement: () => null,
      estimateSize: () => itemSize,
      overscan,
      scrollToFn: () => {},
      observeElementRect,
      observeElementOffset,
      scrollRect: { width: 0, height: viewportHeight },
      scrollOffset,
    } as unknown as VirtualizerOptions<HTMLElement, HTMLElement>)

    // Force measurement with the provided offset.
    virtualizer.measure()

    const virtualItems: VirtualItem[] = virtualizer.getVirtualItems()
    const totalSize = virtualizer.getTotalSize()

    const items: VirtualizationItem[] = virtualItems.map((vi) => ({
      index: vi.index,
      start: vi.start,
      end: vi.end,
      size: vi.size,
    }))

    const startIndex = items.length > 0 ? items[0]!.index : 0
    const endIndex = items.length > 0 ? items[items.length - 1]!.index : 0

    return { items, totalSize, startIndex, endIndex }
  }

  return { compute, destroy: () => {} }
}

// ─── DOM-connected scroller (for primitives that provide a scroll element) ────

export interface ScrollerOptions {
  /** Total item count. */
  count: number
  /** Estimate item size in px. */
  estimateSize: (index: number) => number
  /** Overscan count. Default: 3. */
  overscan?: number
  /** The scroll container element. */
  getScrollElement: () => HTMLElement | null
  /** Horizontal mode. Default: false (vertical). */
  horizontal?: boolean
}

export interface ScrollerInstance {
  /** Get currently visible virtual items. */
  getVirtualItems(): VirtualizationItem[]
  /** Get total computed size. */
  getTotalSize(): number
  /** Scroll to a specific index. */
  scrollToIndex(index: number, options?: { align?: "start" | "center" | "end" | "auto" }): void
  /** Update item count. */
  setCount(count: number): void
  /** Cleanup listeners and observers. */
  destroy(): void
}

/**
 * Creates a DOM-connected TanStack Virtual scroller.
 * Use this when the primitive owns a real scroll container.
 */
export function createTanStackVirtualScroller(options: ScrollerOptions): ScrollerInstance {
  const virtualizer = new Virtualizer<HTMLElement, HTMLElement>({
    count: options.count,
    getScrollElement: options.getScrollElement,
    estimateSize: options.estimateSize,
    overscan: options.overscan ?? 3,
    horizontal: options.horizontal ?? false,
    observeElementRect,
    observeElementOffset,
    scrollToFn: elementScroll,
  })

  return {
    getVirtualItems(): VirtualizationItem[] {
      return virtualizer.getVirtualItems().map((vi) => ({
        index: vi.index,
        start: vi.start,
        end: vi.end,
        size: vi.size,
      }))
    },

    getTotalSize(): number {
      return virtualizer.getTotalSize()
    },

    scrollToIndex(index: number, opts?: { align?: "start" | "center" | "end" | "auto" }): void {
      virtualizer.scrollToIndex(index, opts)
    },

    setCount(count: number): void {
      virtualizer.setOptions({ ...virtualizer.options, count })
      virtualizer.measure()
    },

    destroy(): void {
      // TanStack Virtual v3 relies on GC for cleanup; no public teardown API.
      // Setting scrollElement to null detaches internal observers.
      virtualizer.scrollElement = null
    },
  }
}
