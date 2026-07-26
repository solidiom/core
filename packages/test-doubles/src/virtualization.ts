/**
 * Deterministic virtualization test double — implements VirtualizationCapability@1.
 *
 * Returns a fixed window of visible items based on scroll offset and item height.
 * Zero engine dependencies. Deterministic for fixed input.
 */

/** A virtual item with index and position. */
export interface VirtualItem {
  index: number
  start: number
  end: number
  size: number
}

/** Input for a virtualization computation. */
export interface VirtualizationInput {
  /** Total number of items in the list. */
  totalCount: number
  /** Fixed height per item (uniform sizing). */
  itemSize: number
  /** Viewport height. */
  viewportHeight: number
  /** Current scroll offset from top. */
  scrollOffset: number
  /** Number of items to render beyond the visible window. */
  overscan?: number
}

/** The result of a virtualization computation. */
export interface VirtualizationResult {
  /** Items to render. */
  items: VirtualItem[]
  /** Total scrollable height. */
  totalSize: number
  /** Index of the first visible item. */
  startIndex: number
  /** Index of the last visible item. */
  endIndex: number
}

/** VirtualizationCapability@1 port shape. */
export interface VirtualizationCapability {
  compute(input: VirtualizationInput): VirtualizationResult
  destroy(): void
}

/**
 * Deterministic virtualization double.
 *
 * Fixed-height items with simple arithmetic windowing.
 */
export function createVirtualizationDouble(): VirtualizationCapability {
  const compute = (input: VirtualizationInput): VirtualizationResult => {
    const { totalCount, itemSize, viewportHeight, scrollOffset, overscan = 3 } = input
    const totalSize = totalCount * itemSize

    const rawStart = Math.floor(scrollOffset / itemSize)
    const rawEnd = Math.ceil((scrollOffset + viewportHeight) / itemSize) - 1

    const startIndex = Math.max(0, rawStart - overscan)
    const endIndex = Math.min(totalCount - 1, rawEnd + overscan)

    const items: VirtualItem[] = []
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        start: i * itemSize,
        end: (i + 1) * itemSize,
        size: itemSize,
      })
    }

    return { items, totalSize, startIndex, endIndex }
  }

  const destroy = (): void => {}

  return { compute, destroy }
}
