/**
 * Tree primitive — expand/collapse tree items with keyboard navigation,
 * single/multiple selection, typeahead, and ARIA tree semantics.
 *
 * Parts: Root, Item, Branch, ItemIndicator.
 */

import { type Accessor, createSignal, onCleanup, Show } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createControllableValue,
  createTypeahead,
  createStableId,
  createChangeDetails,
  applySemanticAttrs,
  type ChangeDetails,
} from "@solidiom/runtime"
import {
  TreeContext,
  TreeBranchContext,
  useTreeContext,
  useTreeBranchContext,
  type TreeContextValue,
  type TreeItemEntry,
  type TreeReason,
  type SelectionMode,
} from "./tree-context"

// ─── Root ──────────────────────────────────────────────────────────────────────/** Props for the tree root container. */
export interface TreeRootProps {
  /** Controlled expanded IDs. */
  expandedIds?: Accessor<Set<string>>
  /** Default expanded IDs for uncontrolled mode. */
  defaultExpandedIds?: Set<string>
  /** Called when expanded IDs change. */
  onExpandedChange?: (ids: Set<string>, details: ChangeDetails<TreeReason>) => void
  /** Controlled selected IDs. */
  selectedIds?: Accessor<Set<string>>
  /** Default selected IDs for uncontrolled mode. */
  defaultSelectedIds?: Set<string>
  /** Called when selected IDs change. */
  onSelectedChange?: (ids: Set<string>, details: ChangeDetails<TreeReason>) => void
  /** Selection mode: "single" (default) or "multiple". */
  selectionMode?: SelectionMode
  children: JSX.Element
  class?: string
  ref?: (el: HTMLDivElement) => void
}

/** Root container providing tree state and keyboard navigation. */
export function Root(props: TreeRootProps) {
  const selectionMode = props.selectionMode ?? "single"
  const baseId = createStableId("tree")

  const { value: expandedIds, requestChange: requestExpandedChange } = createControllableValue<
    Set<string>,
    TreeReason
  >({
    value: props.expandedIds,
    defaultValue: props.defaultExpandedIds ?? new Set(),
    onChange: props.onExpandedChange,
    equals: (a, b) => a.size === b.size && [...a].every((id) => b.has(id)),
  })

  const { value: selectedIds, requestChange: requestSelectedChange } = createControllableValue<
    Set<string>,
    TreeReason
  >({
    value: props.selectedIds,
    defaultValue: props.defaultSelectedIds ?? new Set(),
    onChange: props.onSelectedChange,
    equals: (a, b) => a.size === b.size && [...a].every((id) => b.has(id)),
  })

  const [items, setItems] = createSignal<TreeItemEntry[]>([])
  const [focusedId, setFocusedId] = createSignal<string | null>(null)

  const registerItem = (entry: TreeItemEntry): (() => void) => {
    setItems((prev) => [...prev, entry])
    return () => setItems((prev) => prev.filter((i) => i.id !== entry.id))
  }

  const typeahead = createTypeahead({
    onMatch: (matched) => {
      setFocusedId(matched.id)
      const item = items().find((i) => i.id === matched.id)
      item?.ref?.focus()
    },
  })

  const ctx: TreeContextValue = {
    expandedIds,
    requestExpandedChange,
    selectedIds,
    requestSelectedChange,
    selectionMode,
    typeahead,
    baseId,
    registerItem,
    visibleItems: items,
    focusedId,
    setFocusedId,
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const visible = items().filter((i) => !i.disabled)
    const currentId = focusedId()
    const currentIdx = visible.findIndex((i) => i.id === currentId)

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault()
        const nextIdx = currentIdx < visible.length - 1 ? currentIdx + 1 : 0
        const nextItem = visible[nextIdx]!
        setFocusedId(nextItem.id)
        nextItem.ref?.focus()
        break
      }
      case "ArrowUp": {
        e.preventDefault()
        const prevIdx = currentIdx > 0 ? currentIdx - 1 : visible.length - 1
        const prevItem = visible[prevIdx]!
        setFocusedId(prevItem.id)
        prevItem.ref?.focus()
        break
      }
      case "ArrowRight": {
        e.preventDefault()
        if (!currentId) break
        const expanded = expandedIds()
        if (!expanded.has(currentId)) {
          // Expand the item
          const next = new Set(expanded)
          next.add(currentId)
          requestExpandedChange(next, createChangeDetails("keyboard"))
        } else {
          // Move to first child
          const children = visible.filter((i) => i.parentId === currentId)
          if (children.length > 0) {
            const firstChild = children[0]!
            setFocusedId(firstChild.id)
            firstChild.ref?.focus()
          }
        }
        break
      }
      case "ArrowLeft": {
        e.preventDefault()
        if (!currentId) break
        const expanded = expandedIds()
        if (expanded.has(currentId)) {
          // Collapse the item
          const next = new Set(expanded)
          next.delete(currentId)
          requestExpandedChange(next, createChangeDetails("keyboard"))
        } else {
          // Move to parent
          const current = visible.find((i) => i.id === currentId)
          if (current?.parentId) {
            const parent = visible.find((i) => i.id === current.parentId)
            if (parent) {
              setFocusedId(parent.id)
              parent.ref?.focus()
            }
          }
        }
        break
      }
      case "Home": {
        e.preventDefault()
        if (visible.length > 0) {
          const first = visible[0]!
          setFocusedId(first.id)
          first.ref?.focus()
        }
        break
      }
      case "End": {
        e.preventDefault()
        if (visible.length > 0) {
          const last = visible[visible.length - 1]!
          setFocusedId(last.id)
          last.ref?.focus()
        }
        break
      }
      case "Enter":
      case " ": {
        e.preventDefault()
        if (currentId) {
          selectItem(ctx, currentId)
        }
        break
      }
      default: {
        // Typeahead
        const collectionItems = visible.map((i) => ({
          id: i.id,
          disabled: () => i.disabled,
          textValue: () => i.textValue,
        }))
        typeahead.handle(e.key, collectionItems, currentId ?? undefined)
      }
    }
  }

  return (
    <TreeContext value={ctx}>
      <TreeBranchContext value={{ parentId: "", depth: 0 }}>
        <div
          role="tree"
          aria-multiselectable={selectionMode === "multiple" ? "true" : undefined}
          tabindex={0}
          onKeyDown={handleKeyDown}
          class={props.class}
          ref={props.ref}
          {...applySemanticAttrs({
            scope: "tree",
            part: "root",
          })}
        >
          {props.children}
        </div>
      </TreeBranchContext>
    </TreeContext>
  )
}

// ─── Item ──────────────────────────────────────────────────────────────────────

/** Props for a tree item. */
export interface TreeItemProps {
  /** Unique ID for this item. */
  id: string
  /** Text value for typeahead matching. */
  textValue?: string
  /** Whether this item is disabled. */
  disabled?: boolean
  children: JSX.Element
  class?: string
  ref?: (el: HTMLDivElement) => void
}

/** A single tree item that can be selected, expanded, and navigated. */
export function Item(props: TreeItemProps) {
  const ctx = useTreeContext()
  const branchCtx = useTreeBranchContext()
  const itemId = props.id

  const entry: TreeItemEntry = {
    id: itemId,
    depth: branchCtx.depth,
    parentId: branchCtx.parentId || null,
    textValue: props.textValue ?? itemId,
    disabled: props.disabled ?? false,
  }

  const cleanup = ctx.registerItem(entry)
  onCleanup(cleanup)

  const isSelected = () => ctx.selectedIds().has(itemId)
  const isExpanded = () => ctx.expandedIds().has(itemId)
  const isFocused = () => ctx.focusedId() === itemId

  const handleClick = () => {
    if (props.disabled) return
    ctx.setFocusedId(itemId)
    selectItem(ctx, itemId)
  }

  return (
    <TreeBranchContext value={{ parentId: itemId, depth: branchCtx.depth + 1 }}>
      <div
        id={itemId}
        role="treeitem"
        aria-expanded={isExpanded() ? "true" : "false"}
        aria-selected={isSelected() ? "true" : "false"}
        aria-disabled={props.disabled ? "true" : undefined}
        aria-level={branchCtx.depth + 1}
        tabindex={isFocused() ? 0 : -1}
        onClick={handleClick}
        class={props.class}
        ref={(el: HTMLDivElement) => {
          entry.ref = el
          props.ref?.(el)
        }}
        {...applySemanticAttrs({
          scope: "tree",
          part: "item",
          state: isSelected() ? "selected" : "unselected",
          disabled: props.disabled,
        })}
      >
        {props.children}
      </div>
    </TreeBranchContext>
  )
}

// ─── Branch ────────────────────────────────────────────────────────────────────

/** Props for a tree branch (group of nested items). */
export interface TreeBranchProps {
  children: JSX.Element
  class?: string
}

/** Container for nested tree items, shown when parent is expanded. */
export function Branch(props: TreeBranchProps) {
  const ctx = useTreeContext()
  const branchCtx = useTreeBranchContext()
  const parentId = branchCtx.parentId

  const isExpanded = () => ctx.expandedIds().has(parentId)

  return (
    <Show when={isExpanded()}>
      <div
        role="group"
        class={props.class}
        {...applySemanticAttrs({
          scope: "tree",
          part: "branch",
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}

// ─── ItemIndicator ─────────────────────────────────────────────────────────────

/** Props for the tree item expand/collapse indicator. */
export interface TreeItemIndicatorProps {
  children?: JSX.Element
  class?: string
}

/** Visual indicator for the expansion state of a tree item. */
export function ItemIndicator(props: TreeItemIndicatorProps) {
  const branchCtx = useTreeBranchContext()
  const ctx = useTreeContext()
  const parentId = branchCtx.parentId

  const isExpanded = () => ctx.expandedIds().has(parentId)

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    const expanded = ctx.expandedIds()
    const next = new Set(expanded)
    if (next.has(parentId)) {
      next.delete(parentId)
    } else {
      next.add(parentId)
    }
    ctx.requestExpandedChange(next, createChangeDetails("item-click"))
  }

  return (
    <span
      aria-hidden="true"
      onClick={handleClick}
      class={props.class}
      {...applySemanticAttrs({
        scope: "tree",
        part: "item-indicator",
        state: isExpanded() ? "open" : "closed",
      })}
    >
      {props.children}
    </span>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Toggle selection for an item respecting selection mode. */
function selectItem(ctx: TreeContextValue, itemId: string): void {
  const current = ctx.selectedIds()
  if (ctx.selectionMode === "multiple") {
    const next = new Set(current)
    if (next.has(itemId)) next.delete(itemId)
    else next.add(itemId)
    ctx.requestSelectedChange(next, createChangeDetails("item-click"))
  } else {
    ctx.requestSelectedChange(new Set([itemId]), createChangeDetails("item-click"))
  }
  // Toggle expand on selection
  const expanded = ctx.expandedIds()
  const nextExpanded = new Set(expanded)
  if (nextExpanded.has(itemId)) nextExpanded.delete(itemId)
  else nextExpanded.add(itemId)
  ctx.requestExpandedChange(nextExpanded, createChangeDetails("item-click"))
}
