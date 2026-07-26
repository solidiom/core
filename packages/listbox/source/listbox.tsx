/**
 * Listbox primitive — single/multiple selection list with keyboard navigation,
 * roving focus, typeahead, and disabled item support.
 *
 * Parts: Root, Item.
 */

import { type Accessor, onCleanup } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createControllableValue,
  createCollection,
  createRovingFocus,
  createTypeahead,
  createStableId,
  createChangeDetails,
  applySemanticAttrs,
  resolveNavigationIntent,
  resolveNextItem,
  type ChangeDetails,
  type CollectionItem,
} from "@solidiom/runtime"
import {
  ListboxContext,
  useListboxContext,
  type ListboxContextValue,
  type ListboxSelectionMode,
  type ListboxReason,
} from "./listbox-context"

// ─── Root ──────────────────────────────────────────────────────────────────────

/** Props for the listbox root element. */
export interface ListboxRootProps {
  /** Controlled value. */
  value?: Accessor<string[]>
  /** Default value (uncontrolled). */
  defaultValue?: string[]
  /** Called when value change is requested. */
  onValueChange?: (value: string[], details: ChangeDetails<ListboxReason>) => void
  /** Selection mode. Default: "single". */
  selectionMode?: ListboxSelectionMode
  /** Disabled state. */
  disabled?: Accessor<boolean>
  /** Orientation for keyboard navigation. Default: "vertical". */
  orientation?: "horizontal" | "vertical"
  /** Whether navigation loops. Default: true. */
  loop?: boolean
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLDivElement) => void
}

/** Root listbox element with keyboard navigation and selection management. */
export function Root(props: ListboxRootProps) {
  const selectionMode = props.selectionMode ?? "single"
  const orientation = props.orientation ?? "vertical"
  const loop = props.loop ?? true
  const baseId = createStableId("listbox")

  const { value, requestChange: requestValueChange } = createControllableValue<
    string[],
    ListboxReason
  >({
    value: props.value,
    defaultValue: props.defaultValue ?? [],
    onChange: props.onValueChange,
  })

  const collection = createCollection()
  const rovingFocus = createRovingFocus()
  const typeahead = createTypeahead({
    onMatch: (item) => {
      rovingFocus.setActiveId(item.id)
    },
  })

  const ctx: ListboxContextValue = {
    value,
    requestValueChange,
    selectionMode,
    collection,
    rovingFocus,
    typeahead,
    listboxId: `${baseId}-list`,
    disabled: props.disabled ?? (() => false),
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (ctx.disabled()) return

    const intent = resolveNavigationIntent(e.key, {
      orientation,
      direction: collection.direction(),
    })

    if (intent) {
      e.preventDefault()
      const next = resolveNextItem(collection.enabledItems(), rovingFocus.activeId(), intent, {
        loop,
      })
      if (next) rovingFocus.setActiveId(next.id)
      return
    }

    // Home/End
    if (e.key === "Home") {
      e.preventDefault()
      const items = collection.enabledItems()
      if (items.length > 0) rovingFocus.setActiveId(items[0]!.id)
      return
    }
    if (e.key === "End") {
      e.preventDefault()
      const items = collection.enabledItems()
      if (items.length > 0) rovingFocus.setActiveId(items[items.length - 1]!.id)
      return
    }

    // Space/Enter selects
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      const activeId = rovingFocus.activeId()
      if (activeId) selectItem(ctx, activeId)
      return
    }

    // Typeahead
    typeahead.handle(e.key, collection.items(), rovingFocus.activeId())
  }

  return (
    <ListboxContext value={ctx}>
      <div
        id={ctx.listboxId}
        role="listbox"
        aria-multiselectable={selectionMode === "multiple" ? "true" : undefined}
        aria-disabled={ctx.disabled() ? "true" : undefined}
        aria-orientation={orientation}
        tabindex={ctx.disabled() ? undefined : 0}
        onKeyDown={handleKeyDown}
        ref={props.ref}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "listbox",
          part: "root",
          disabled: ctx.disabled(),
        })}
      >
        {props.children}
      </div>
    </ListboxContext>
  )
}

// ─── Item ──────────────────────────────────────────────────────────────────────

/** Props for a listbox item. */
export interface ListboxItemProps {
  /** Unique value for this item. */
  value: string
  /** Text for typeahead matching. Defaults to value. */
  textValue?: string
  /** Disabled state. */
  disabled?: boolean
  children: JSX.Element
}

/** Individual listbox item with selection and roving focus support. */
export function Item(props: ListboxItemProps) {
  const ctx = useListboxContext()
  const itemId = createStableId("listbox-item")

  const item: CollectionItem = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? props.value,
  }

  const cleanup = ctx.collection.registerItem(item)
  onCleanup(cleanup)

  const isSelected = (): boolean => ctx.value().includes(props.value)
  const isHighlighted = () => ctx.rovingFocus.activeId() === itemId

  const handleClick = () => {
    if (props.disabled || ctx.disabled()) return
    selectItem(ctx, itemId)
  }

  const handlePointerMove = () => {
    if (props.disabled || ctx.disabled()) return
    ctx.rovingFocus.setActiveId(itemId)
  }

  return (
    <div
      id={itemId}
      role="option"
      aria-selected={isSelected() ? "true" : "false"}
      aria-disabled={props.disabled ? "true" : undefined}
      tabindex={isHighlighted() ? 0 : -1}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      {...applySemanticAttrs({
        scope: "listbox",
        part: "item",
        state: isSelected() ? "checked" : "unchecked",
        disabled: props.disabled,
        highlighted: isHighlighted(),
        selected: isSelected(),
      })}
    >
      {props.children}
    </div>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function selectItem(ctx: ListboxContextValue, itemId: string): void {
  const item = ctx.collection.getItem(itemId)
  if (!item) return
  const itemValue = item.textValue()

  if (ctx.selectionMode === "multiple") {
    const current = ctx.value()
    const next = current.includes(itemValue)
      ? current.filter((v) => v !== itemValue)
      : [...current, itemValue]
    ctx.requestValueChange(next, createChangeDetails("item-click"))
  } else {
    ctx.requestValueChange([itemValue], createChangeDetails("item-click"))
  }
}
