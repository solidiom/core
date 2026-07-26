/**
 * Tree context — shared state between Tree parts.
 */

import { createContext, useContext, type Accessor } from "solid-js"
import type { ChangeDetails, Typeahead } from "@solidiom/runtime"

/** Reason for a tree state change. */
export type TreeReason = "item-click" | "keyboard" | "programmatic"

/** Selection mode for the tree. */
export type SelectionMode = "single" | "multiple"

export interface TreeContextValue {
  /** Set of currently expanded item IDs. */
  expandedIds: Accessor<Set<string>>
  /** Request expansion state change. */
  requestExpandedChange: (ids: Set<string>, details: ChangeDetails<TreeReason>) => void
  /** Set of currently selected item IDs. */
  selectedIds: Accessor<Set<string>>
  /** Request selection state change. */
  requestSelectedChange: (ids: Set<string>, details: ChangeDetails<TreeReason>) => void
  /** Selection mode. */
  selectionMode: SelectionMode
  /** Typeahead instance for character navigation. */
  typeahead: Typeahead
  /** Generated base ID. */
  baseId: string
  /** Register a visible tree item for focus management. Returns cleanup. */
  registerItem: (item: TreeItemEntry) => () => void
  /** All registered visible items in DOM order. */
  visibleItems: Accessor<TreeItemEntry[]>
  /** Currently focused item ID. */
  focusedId: Accessor<string | null>
  /** Set focus to an item by ID. */
  setFocusedId: (id: string | null) => void
}

/** Registration entry for a tree item. */
export interface TreeItemEntry {
  id: string
  depth: number
  parentId: string | null
  textValue: string
  disabled: boolean
  ref?: HTMLElement
}

export const TreeContext = createContext<TreeContextValue>()

/** Access the tree context. Throws if used outside Root. */
export function useTreeContext(): TreeContextValue {
  const ctx = useContext(TreeContext)
  if (!ctx) {
    throw new Error("[solidiom] Tree parts must be used within Tree.Root")
  }
  return ctx
}

/** Context for parent item ID propagation to nested branches. */
export interface TreeBranchContextValue {
  parentId: string
  depth: number
}

export const TreeBranchContext = createContext<TreeBranchContextValue>({
  parentId: "",
  depth: 0,
})

/** Access the current branch nesting context. */
export function useTreeBranchContext(): TreeBranchContextValue {
  return useContext(TreeBranchContext)!
}
