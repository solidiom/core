/**
 * Tree context — shared state between Tree parts.
 */
import { type Accessor } from "solid-js";
import type { ChangeDetails, Typeahead } from "@solidiom/runtime";
/** Reason for a tree state change. */
export type TreeReason = "item-click" | "keyboard" | "programmatic";
/** Selection mode for the tree. */
export type SelectionMode = "single" | "multiple";
export interface TreeContextValue {
    /** Set of currently expanded item IDs. */
    expandedIds: Accessor<Set<string>>;
    /** Request expansion state change. */
    requestExpandedChange: (ids: Set<string>, details: ChangeDetails<TreeReason>) => void;
    /** Set of currently selected item IDs. */
    selectedIds: Accessor<Set<string>>;
    /** Request selection state change. */
    requestSelectedChange: (ids: Set<string>, details: ChangeDetails<TreeReason>) => void;
    /** Selection mode. */
    selectionMode: SelectionMode;
    /** Typeahead instance for character navigation. */
    typeahead: Typeahead;
    /** Generated base ID. */
    baseId: string;
    /** Register a visible tree item for focus management. Returns cleanup. */
    registerItem: (item: TreeItemEntry) => () => void;
    /** All registered visible items in DOM order. */
    visibleItems: Accessor<TreeItemEntry[]>;
    /** Currently focused item ID. */
    focusedId: Accessor<string | null>;
    /** Set focus to an item by ID. */
    setFocusedId: (id: string | null) => void;
}
/** Registration entry for a tree item. */
export interface TreeItemEntry {
    id: string;
    depth: number;
    parentId: string | null;
    textValue: string;
    disabled: boolean;
    ref?: HTMLElement;
}
export declare const TreeContext: import("solid-js").Context<TreeContextValue>;
/** Access the tree context. Throws if used outside Root. */
export declare function useTreeContext(): TreeContextValue;
/** Context for parent item ID propagation to nested branches. */
export interface TreeBranchContextValue {
    parentId: string;
    depth: number;
}
export declare const TreeBranchContext: import("solid-js").Context<TreeBranchContextValue>;
/** Access the current branch nesting context. */
export declare function useTreeBranchContext(): TreeBranchContextValue;
//# sourceMappingURL=tree-context.d.ts.map