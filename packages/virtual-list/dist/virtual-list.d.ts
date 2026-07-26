/**
 * VirtualList primitive — viewport-windowed list with pluggable virtualization.
 *
 * Only renders visible items plus overscan. Supports fixed-height fallback or
 * a custom VirtualizationPort adapter (e.g. TanStack Virtual).
 *
 * Parts: Root (scroll container), Item (positioned child).
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
import { type VirtualItem, type VirtualizationPort } from "./virtual-list-context";
export interface CreateVirtualizerOptions {
    /** Total number of items in the list. */
    totalCount: Accessor<number>;
    /** Fixed item height (px), or function for variable heights. */
    itemSize: number | ((index: number) => number);
    /** Number of extra items rendered above/below viewport. Default: 3. */
    overscan?: number;
    /** Controlled scroll offset. */
    scrollOffset?: Accessor<number>;
    /** Callback when scroll offset changes (for controlled mode). */
    onScrollOffsetChange?: (offset: number) => void;
    /** Container height in pixels. */
    containerSize?: Accessor<number>;
    /** Custom virtualization port. Uses fixed-height fallback if omitted. */
    port?: VirtualizationPort;
}
export interface VirtualizerState {
    virtualItems: Accessor<VirtualItem[]>;
    totalSize: Accessor<number>;
    scrollOffset: Accessor<number>;
    containerSize: Accessor<number>;
    setScrollOffset: (offset: number) => void;
    scrollToIndex: (index: number) => void;
}
/**
 * Creates virtualizer state for use outside the component tree.
 * Returns computed virtual items, total size, and imperative methods.
 */
export declare function createVirtualizer(options: CreateVirtualizerOptions): VirtualizerState;
export interface VirtualListRootProps {
    /** Total number of items. */
    totalCount: number;
    /** Fixed item height (px), or function for variable heights. */
    itemSize: number | ((index: number) => number);
    /** Extra items rendered beyond viewport. Default: 3. */
    overscan?: number;
    /** Controlled scroll offset. */
    scrollOffset?: Accessor<number>;
    /** Callback when scroll offset changes. */
    onScrollOffsetChange?: (offset: number) => void;
    /** Custom virtualization port. */
    port?: VirtualizationPort;
    /** Height of the scroll container (CSS value). */
    height: string;
    /** Custom class on the scroll container. */
    class?: string;
    /** Custom styles on the scroll container. */
    style?: JSX.CSSProperties | string;
    /** Render function receiving virtual items. */
    children: (items: Accessor<VirtualItem[]>) => JSX.Element;
    ref?: (el: HTMLDivElement) => void;
}
export declare function Root(props: VirtualListRootProps): JSX.Element;
export interface VirtualListItemProps {
    /** The virtual item descriptor. */
    item: VirtualItem;
    children: JSX.Element;
    class?: string;
    style?: JSX.CSSProperties | string;
}
/** Positioned list item rendered at the correct offset within the scroll container. */
export declare function Item(props: VirtualListItemProps): JSX.Element;
//# sourceMappingURL=virtual-list.d.ts.map