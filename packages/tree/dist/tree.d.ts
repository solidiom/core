/**
 * Tree primitive — expand/collapse tree items with keyboard navigation,
 * single/multiple selection, typeahead, and ARIA tree semantics.
 *
 * Parts: Root, Item, Branch, ItemIndicator.
 */
import { type Accessor } from "solid-js";
import { type JSX } from "@solidjs/web";
import { type ChangeDetails } from "@solidiom/runtime";
import { type TreeReason, type SelectionMode } from "./tree-context";
export interface TreeRootProps {
    /** Controlled expanded IDs. */
    expandedIds?: Accessor<Set<string>>;
    /** Default expanded IDs for uncontrolled mode. */
    defaultExpandedIds?: Set<string>;
    /** Called when expanded IDs change. */
    onExpandedChange?: (ids: Set<string>, details: ChangeDetails<TreeReason>) => void;
    /** Controlled selected IDs. */
    selectedIds?: Accessor<Set<string>>;
    /** Default selected IDs for uncontrolled mode. */
    defaultSelectedIds?: Set<string>;
    /** Called when selected IDs change. */
    onSelectedChange?: (ids: Set<string>, details: ChangeDetails<TreeReason>) => void;
    /** Selection mode: "single" (default) or "multiple". */
    selectionMode?: SelectionMode;
    children: JSX.Element;
    class?: string;
    ref?: (el: HTMLDivElement) => void;
}
/** Root container providing tree state and keyboard navigation. */
export declare function Root(props: TreeRootProps): JSX.Element;
/** Props for a tree item. */
export interface TreeItemProps {
    /** Unique ID for this item. */
    id: string;
    /** Text value for typeahead matching. */
    textValue?: string;
    /** Whether this item is disabled. */
    disabled?: boolean;
    children: JSX.Element;
    class?: string;
    ref?: (el: HTMLDivElement) => void;
}
/** A single tree item that can be selected, expanded, and navigated. */
export declare function Item(props: TreeItemProps): JSX.Element;
/** Props for a tree branch (group of nested items). */
export interface TreeBranchProps {
    children: JSX.Element;
    class?: string;
}
/** Container for nested tree items, shown when parent is expanded. */
export declare function Branch(props: TreeBranchProps): JSX.Element;
/** Props for the tree item expand/collapse indicator. */
export interface TreeItemIndicatorProps {
    children?: JSX.Element;
    class?: string;
}
/** Visual indicator for the expansion state of a tree item. */
export declare function ItemIndicator(props: TreeItemIndicatorProps): JSX.Element;
//# sourceMappingURL=tree.d.ts.map