/**
 * VirtualList primitive — viewport-windowed list with pluggable virtualization.
 *
 * Only renders visible items plus overscan. Supports fixed-height fallback or
 * a custom VirtualizationPort adapter (e.g. TanStack Virtual).
 *
 * Parts: Root (scroll container), Item (positioned child).
 */

import { type Accessor, createSignal, createMemo, onSettled } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"
import {
  VirtualListContext,
  type VirtualConfig,
  type VirtualItem,
  type VirtualizationPort,
  type VirtualListContextValue,
} from "./virtual-list-context"

// ─── Default Fixed-Height Port ─────────────────────────────────────────────────

function createDefaultPort(): VirtualizationPort {
  return {
    getVirtualItems(config: VirtualConfig): VirtualItem[] {
      const { totalCount, itemSize, overscan = 3, scrollOffset, containerSize } = config
      if (typeof itemSize !== "number") {
        throw new Error("[solidiom] Default virtualization port requires a fixed numeric itemSize")
      }
      const startIndex = Math.max(0, Math.floor(scrollOffset / itemSize) - overscan)
      const visibleCount = Math.ceil(containerSize / itemSize)
      const endIndex = Math.min(totalCount - 1, startIndex + visibleCount + overscan * 2)

      const items: VirtualItem[] = []
      for (let i = startIndex; i <= endIndex; i++) {
        items.push({ index: i, start: i * itemSize, size: itemSize, end: (i + 1) * itemSize })
      }
      return items
    },

    getTotalSize(config: VirtualConfig): number {
      const { totalCount, itemSize } = config
      if (typeof itemSize !== "number") {
        throw new Error("[solidiom] Default virtualization port requires a fixed numeric itemSize")
      }
      return totalCount * itemSize
    },

    scrollToIndex(index: number, config: VirtualConfig): void {
      // No-op in fallback; actual scroll handled externally via scrollOffset.
      void index
      void config
    },
  }
}

// ─── createVirtualizer ─────────────────────────────────────────────────────────

export interface CreateVirtualizerOptions {
  /** Total number of items in the list. */
  totalCount: Accessor<number>
  /** Fixed item height (px), or function for variable heights. */
  itemSize: number | ((index: number) => number)
  /** Number of extra items rendered above/below viewport. Default: 3. */
  overscan?: number
  /** Controlled scroll offset. */
  scrollOffset?: Accessor<number>
  /** Callback when scroll offset changes (for controlled mode). */
  onScrollOffsetChange?: (offset: number) => void
  /** Container height in pixels. */
  containerSize?: Accessor<number>
  /** Custom virtualization port. Uses fixed-height fallback if omitted. */
  port?: VirtualizationPort
}

export interface VirtualizerState {
  virtualItems: Accessor<VirtualItem[]>
  totalSize: Accessor<number>
  scrollOffset: Accessor<number>
  containerSize: Accessor<number>
  setScrollOffset: (offset: number) => void
  scrollToIndex: (index: number) => void
}

/**
 * Creates virtualizer state for use outside the component tree.
 * Returns computed virtual items, total size, and imperative methods.
 */
export function createVirtualizer(options: CreateVirtualizerOptions): VirtualizerState {
  const port = options.port ?? createDefaultPort()
  const overscan = options.overscan ?? 3

  const [internalOffset, setInternalOffset] = createSignal(0)
  const [internalContainerSize, _setInternalContainerSize] = createSignal(0)

  const scrollOffset = () => options.scrollOffset?.() ?? internalOffset()
  const containerSize = () => options.containerSize?.() ?? internalContainerSize()

  const setScrollOffset = (offset: number) => {
    if (options.onScrollOffsetChange) {
      options.onScrollOffsetChange(offset)
    } else {
      setInternalOffset(offset)
    }
  }

  const config = (): VirtualConfig => ({
    totalCount: options.totalCount(),
    itemSize: options.itemSize,
    overscan,
    scrollOffset: scrollOffset(),
    containerSize: containerSize(),
  })

  const virtualItems = createMemo(() => port.getVirtualItems(config()))
  const totalSize = createMemo(() => port.getTotalSize(config()))

  const scrollToIndex = (index: number) => {
    port.scrollToIndex(index, config())
    // For fixed-height fallback, scroll directly
    if (typeof options.itemSize === "number") {
      setScrollOffset(index * options.itemSize)
    }
  }

  return {
    virtualItems,
    totalSize,
    scrollOffset,
    containerSize,
    setScrollOffset,
    scrollToIndex,
  }
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export interface VirtualListRootProps {
  /** Total number of items. */
  totalCount: number
  /** Fixed item height (px), or function for variable heights. */
  itemSize: number | ((index: number) => number)
  /** Extra items rendered beyond viewport. Default: 3. */
  overscan?: number
  /** Controlled scroll offset. */
  scrollOffset?: Accessor<number>
  /** Callback when scroll offset changes. */
  onScrollOffsetChange?: (offset: number) => void
  /** Custom virtualization port. */
  port?: VirtualizationPort
  /** Height of the scroll container (CSS value). */
  height: string
  /** Custom class on the scroll container. */
  class?: string
  /** Custom styles on the scroll container. */
  style?: JSX.CSSProperties | string
  /** Render function receiving virtual items. */
  children: (items: Accessor<VirtualItem[]>) => JSX.Element
  ref?: (el: HTMLDivElement) => void
}

export function Root(props: VirtualListRootProps) {
  const port = props.port ?? createDefaultPort()
  const overscan = props.overscan ?? 3

  const [internalOffset, setInternalOffset] = createSignal(0)
  const [containerSize, setContainerSize] = createSignal(0)

  const scrollOffset = () => props.scrollOffset?.() ?? internalOffset()

  const setScrollOffset = (offset: number) => {
    if (props.onScrollOffsetChange) {
      props.onScrollOffsetChange(offset)
    } else {
      setInternalOffset(offset)
    }
  }

  const config = (): VirtualConfig => ({
    totalCount: props.totalCount,
    itemSize: props.itemSize,
    overscan,
    scrollOffset: scrollOffset(),
    containerSize: containerSize(),
  })

  const virtualItems = createMemo(() => port.getVirtualItems(config()))
  const totalSize = createMemo(() => port.getTotalSize(config()))

  const scrollToIndex = (index: number) => {
    port.scrollToIndex(index, config())
    if (typeof props.itemSize === "number") {
      setScrollOffset(index * props.itemSize)
    }
  }

  const ctx: VirtualListContextValue = {
    virtualItems,
    totalSize,
    scrollOffset,
    containerSize,
    setScrollOffset,
    scrollToIndex,
  }

  let rootEl: HTMLDivElement | undefined

  const handleScroll = () => {
    if (rootEl) {
      setScrollOffset(rootEl.scrollTop)
    }
  }

  onSettled(() => {
    if (rootEl) {
      setContainerSize(rootEl.clientHeight)
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerSize(entry.contentRect.height)
        }
      })
      observer.observe(rootEl)
      return () => observer.disconnect()
    }
  })

  return (
    <VirtualListContext value={ctx}>
      <div
        role="list"
        ref={(el: HTMLDivElement) => {
          rootEl = el
          props.ref?.(el)
        }}
        onScroll={handleScroll}
        class={props.class}
        style={`overflow:auto;height:${props.height};position:relative;${typeof props.style === "string" ? props.style : ""}`}
        {...applySemanticAttrs({ scope: "virtual-list", part: "root" })}
      >
        <div style={`height:${totalSize()}px;width:100%;position:relative;`} aria-hidden="true" />
        {props.children(virtualItems)}
      </div>
    </VirtualListContext>
  )
}

// ─── Item ──────────────────────────────────────────────────────────────────────

export interface VirtualListItemProps {
  /** The virtual item descriptor. */
  item: VirtualItem
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

/** Positioned list item rendered at the correct offset within the scroll container. */
export function Item(props: VirtualListItemProps) {
  return (
    <div
      role="listitem"
      class={props.class}
      style={`position:absolute;top:0;left:0;width:100%;height:${props.item.size}px;transform:translateY(${props.item.start}px);${typeof props.style === "string" ? props.style : ""}`}
      {...applySemanticAttrs({ scope: "virtual-list", part: "item" })}
    >
      {props.children}
    </div>
  )
}
