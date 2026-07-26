/**
 * Virtual-list context — shared state between VirtualList parts.
 */

import { createContext, useContext, type Accessor } from "solid-js"

// ─── Port Interfaces ───────────────────────────────────────────────────────────

/** Configuration passed to the virtualization port for computing visible items. */
export interface VirtualConfig {
  totalCount: number
  itemSize: number | ((index: number) => number)
  overscan?: number
  scrollOffset: number
  containerSize: number
}

/** A single virtual item with layout coordinates. */
export interface VirtualItem {
  index: number
  start: number
  size: number
  end: number
}

/**
 * Adapter port for virtualization engines (e.g. TanStack Virtual).
 * Consumers inject a custom implementation; a built-in fallback handles
 * fixed-height lists when no port is provided.
 */
export interface VirtualizationPort {
  getVirtualItems(config: VirtualConfig): VirtualItem[]
  getTotalSize(config: VirtualConfig): number
  scrollToIndex(index: number, config: VirtualConfig): void
}

// ─── Context Value ─────────────────────────────────────────────────────────────

export interface VirtualListContextValue {
  virtualItems: Accessor<VirtualItem[]>
  totalSize: Accessor<number>
  scrollOffset: Accessor<number>
  containerSize: Accessor<number>
  setScrollOffset: (offset: number) => void
  scrollToIndex: (index: number) => void
}

export const VirtualListContext = createContext<VirtualListContextValue>()

/** Access virtual-list context from descendant parts. */
export function useVirtualListContext(): VirtualListContextValue {
  const ctx = useContext(VirtualListContext)
  if (!ctx) {
    throw new Error("[solidiom] VirtualList parts must be used within VirtualList.Root")
  }
  return ctx
}
