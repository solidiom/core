/**
 * @solidiom/adapter-virtualization-tanstack — TanStack Virtual adapter.
 * Implements VirtualizationCapability@1 by delegating to @tanstack/virtual-core.
 *
 * The adapter owns the windowing algorithm (range calculation, overscan, variable
 * sizing). The primitive owns DOM (scroll container, absolute positioning, focus,
 * ARIA). Per §0.2: adapters return capability snapshots, not component props.
 */
export interface VirtualizationInput {
    /** Total number of items in the list. */
    totalCount: number;
    /** Fixed item size in px (used when estimateSize is not provided). */
    itemSize: number;
    /** Viewport height in px. */
    viewportHeight: number;
    /** Current scroll offset in px. */
    scrollOffset: number;
    /** Extra items rendered outside the viewport on each side. Default: 3. */
    overscan?: number;
}
export interface VirtualizationItem {
    index: number;
    start: number;
    end: number;
    size: number;
}
export interface VirtualizationResult {
    items: VirtualizationItem[];
    totalSize: number;
    startIndex: number;
    endIndex: number;
}
export interface VirtualizationCapability {
    compute(input: VirtualizationInput): VirtualizationResult;
    destroy(): void;
}
/**
 * Creates a TanStack Virtual adapter that computes visible item ranges.
 * This is a stateless adapter: each `compute()` call creates a fresh Virtualizer
 * snapshot. For stateful scroll tracking, use `createTanStackVirtualScroller()`.
 */
export declare function createTanStackVirtualAdapter(): VirtualizationCapability;
export interface ScrollerOptions {
    /** Total item count. */
    count: number;
    /** Estimate item size in px. */
    estimateSize: (index: number) => number;
    /** Overscan count. Default: 3. */
    overscan?: number;
    /** The scroll container element. */
    getScrollElement: () => HTMLElement | null;
    /** Horizontal mode. Default: false (vertical). */
    horizontal?: boolean;
}
export interface ScrollerInstance {
    /** Get currently visible virtual items. */
    getVirtualItems(): VirtualizationItem[];
    /** Get total computed size. */
    getTotalSize(): number;
    /** Scroll to a specific index. */
    scrollToIndex(index: number, options?: {
        align?: "start" | "center" | "end" | "auto";
    }): void;
    /** Update item count. */
    setCount(count: number): void;
    /** Cleanup listeners and observers. */
    destroy(): void;
}
/**
 * Creates a DOM-connected TanStack Virtual scroller.
 * Use this when the primitive owns a real scroll container.
 */
export declare function createTanStackVirtualScroller(options: ScrollerOptions): ScrollerInstance;
//# sourceMappingURL=index.d.ts.map