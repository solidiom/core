/**
 * Select primitive — trigger + listbox with single/multiple selection,
 * keyboard navigation, typeahead, hidden form control, positioning port.
 *
 * Parts: Root, Trigger, Content (listbox), Item, ItemText, ItemIndicator, Value, HiddenInput.
 */

import { type Accessor, Show, onCleanup, onSettled } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createDisclosureState,
  createControllableValue,
  createCollection,
  createRovingFocus,
  createTypeahead,
  createStableId,
  createChangeDetails,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  getHiddenInputProps,
  resolveNavigationIntent,
  resolveNextItem,
  type ChangeDetails,
  type DisclosureReason,
  type CollectionItem,
} from "@solidiom/runtime"
import {
  SelectContext,
  useSelectContext,
  type SelectContextValue,
  type SelectReason,
} from "./select-context"

// ─── Root ──────────────────────────────────────────────────────────────────────

export interface SelectRootProps {
  /** Controlled open state. */
  open?: Accessor<boolean>
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Controlled value. */
  value?: Accessor<string | string[] | undefined>
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[], details: ChangeDetails<SelectReason>) => void
  /** Multiple selection mode. */
  multiple?: boolean
  /** Disabled state. */
  disabled?: Accessor<boolean>
  /** Form field name for hidden input. */
  name?: string
  children: JSX.Element
}

export function Root(props: SelectRootProps) {
  const multiple = props.multiple ?? false
  const baseId = createStableId("select")

  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
    disabled: props.disabled,
  })

  const { value, requestChange: requestValueChange } = createControllableValue<
    string | string[],
    SelectReason
  >({
    value: props.value,
    defaultValue: props.defaultValue ?? (multiple ? [] : ""),
    onChange: props.onValueChange,
  })

  const collection = createCollection()
  const rovingFocus = createRovingFocus()
  const typeahead = createTypeahead({
    onMatch: (item) => {
      rovingFocus.setActiveId(item.id)
    },
  })

  const ctx: SelectContextValue = {
    open,
    requestOpenChange,
    value,
    requestValueChange,
    multiple,
    disabled: props.disabled ?? (() => false),
    collection,
    rovingFocus,
    typeahead,
    triggerId: `${baseId}-trigger`,
    listboxId: `${baseId}-listbox`,
    labelId: `${baseId}-label`,
    name: props.name,
  }

  return <SelectContext value={ctx}>{props.children}</SelectContext>
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

export interface SelectTriggerProps {
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
}

export function Trigger(props: SelectTriggerProps) {
  const ctx = useSelectContext()

  const handleClick = () => {
    if (ctx.disabled()) return
    ctx.requestOpenChange(!ctx.open(), createChangeDetails("trigger"))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (ctx.disabled()) return
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (!ctx.open()) {
        ctx.requestOpenChange(true, createChangeDetails("trigger"))
      }
    }
  }

  return (
    <button
      id={ctx.triggerId}
      role="combobox"
      aria-expanded={ctx.open() ? "true" : "false"}
      aria-haspopup="listbox"
      aria-controls={ctx.listboxId}
      aria-labelledby={ctx.labelId}
      disabled={ctx.disabled()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      ref={props.ref}
      {...applySemanticAttrs({
        scope: "select",
        part: "trigger",
        state: ctx.open() ? "open" : "closed",
        disabled: ctx.disabled(),
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Content (Listbox) ─────────────────────────────────────────────────────────

export interface SelectContentProps {
  children: JSX.Element
  ref?: (el: HTMLDivElement) => void
}

export function Content(props: SelectContentProps) {
  const ctx = useSelectContext()
  let contentEl: HTMLDivElement | undefined

  onSettled(() => {
    if (!contentEl) return
    const doc = contentEl.ownerDocument
    const stack = getLayerStack(doc)
    const removeLayer = stack.push({ id: ctx.listboxId, element: contentEl, modal: false })

    const removeDismissable = setupDismissableLayer({
      document: doc,
      layerId: ctx.listboxId,
      element: () => contentEl,
      excludeElements: () => {
        const trigger = doc.getElementById(ctx.triggerId)
        return trigger ? [trigger] : []
      },
      onDismiss: (reason) => {
        ctx.requestOpenChange(false, createChangeDetails(reason))
      },
    })

    return () => {
      removeDismissable()
      removeLayer()
    }
  })

  const handleKeyDown = (e: KeyboardEvent) => {
    const intent = resolveNavigationIntent(e.key, {
      orientation: ctx.collection.orientation(),
      direction: ctx.collection.direction(),
    })

    if (intent) {
      e.preventDefault()
      const next = resolveNextItem(
        ctx.collection.enabledItems(),
        ctx.rovingFocus.activeId(),
        intent,
        { loop: true },
      )
      if (next) ctx.rovingFocus.setActiveId(next.id)
      return
    }

    // Enter/Space selects active item
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const activeId = ctx.rovingFocus.activeId()
      if (activeId) selectItem(ctx, activeId)
      if (!ctx.multiple) {
        ctx.requestOpenChange(false, createChangeDetails("trigger"))
      }
      return
    }

    // Typeahead
    ctx.typeahead.handle(e.key, ctx.collection.items(), ctx.rovingFocus.activeId())
  }

  return (
    <Show when={ctx.open()}>
      <div
        id={ctx.listboxId}
        role="listbox"
        aria-multiselectable={ctx.multiple ? "true" : undefined}
        aria-labelledby={ctx.labelId}
        tabindex={0}
        onKeyDown={handleKeyDown}
        ref={(el: HTMLDivElement) => {
          contentEl = el
          props.ref?.(el)
        }}
        {...applySemanticAttrs({
          scope: "select",
          part: "content",
          state: "open",
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}

// ─── Item ──────────────────────────────────────────────────────────────────────

export interface SelectItemProps {
  /** Unique value for this item. */
  value: string
  /** Text for typeahead matching. Defaults to value. */
  textValue?: string
  /** Disabled state. */
  disabled?: boolean
  children: JSX.Element
}

export function Item(props: SelectItemProps) {
  const ctx = useSelectContext()
  const itemId = createStableId("select-item")

  const item: CollectionItem = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? props.value,
  }

  const cleanup = ctx.collection.registerItem(item)
  onCleanup(cleanup)

  const isSelected = (): boolean => {
    const v = ctx.value()
    if (Array.isArray(v)) return v.includes(props.value)
    return v === props.value
  }

  const isHighlighted = () => ctx.rovingFocus.activeId() === itemId

  const handleClick = () => {
    if (props.disabled) return
    selectItem(ctx, itemId)
    if (!ctx.multiple) {
      ctx.requestOpenChange(false, createChangeDetails("trigger"))
    }
  }

  return (
    <div
      id={itemId}
      role="option"
      aria-selected={isSelected() ? "true" : "false"}
      aria-disabled={props.disabled ? "true" : undefined}
      onClick={handleClick}
      {...applySemanticAttrs({
        scope: "select",
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

// ─── Value ─────────────────────────────────────────────────────────────────────

export interface SelectValueProps {
  /** Placeholder when no value is selected. */
  placeholder?: string
}

export function Value(props: SelectValueProps) {
  const ctx = useSelectContext()

  const displayValue = (): string => {
    const v = ctx.value()
    if (Array.isArray(v)) return v.length > 0 ? v.join(", ") : (props.placeholder ?? "")
    return v || (props.placeholder ?? "")
  }

  return (
    <span
      {...applySemanticAttrs({
        scope: "select",
        part: "value",
        placeholder:
          !ctx.value() || (Array.isArray(ctx.value()) && (ctx.value() as string[]).length === 0),
      })}
    >
      {displayValue()}
    </span>
  )
}

// ─── HiddenInput ───────────────────────────────────────────────────────────────

export function HiddenInput() {
  const ctx = useSelectContext()
  if (!ctx.name) return null

  const inputProps = () =>
    getHiddenInputProps({
      name: ctx.name!,
      value: () => {
        const v = ctx.value()
        return Array.isArray(v) ? v : [v]
      },
      disabled: ctx.disabled,
    })

  return (
    <>
      {inputProps().map((p) => (
        <input {...p} />
      ))}
    </>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function selectItem(ctx: SelectContextValue, itemId: string): void {
  const item = ctx.collection.getItem(itemId)
  if (!item) return
  const itemValue = item.textValue()

  if (ctx.multiple) {
    const current = ctx.value() as string[]
    const next = current.includes(itemValue)
      ? current.filter((v) => v !== itemValue)
      : [...current, itemValue]
    ctx.requestValueChange(next, createChangeDetails("item-click"))
  } else {
    ctx.requestValueChange(itemValue, createChangeDetails("item-click"))
  }
}

// ─── ScrollUpButton ────────────────────────────────────────────────────────────

/** Props for the select scroll up button. */
export interface SelectScrollUpButtonProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * ScrollUpButton — displays at the top of scrollable content to indicate
 * more items above. Scrolls the listbox up on pointer hover.
 */
export function ScrollUpButton(props: SelectScrollUpButtonProps) {
  const handlePointerDown = (e: PointerEvent) => {
    const listbox = (e.currentTarget as HTMLElement).parentElement
    if (!listbox) return
    listbox.scrollBy({ top: -50, behavior: "smooth" })
  }

  return (
    <div
      aria-hidden="true"
      onPointerDown={handlePointerDown}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "select", part: "scroll-up-button" })}
    >
      {props.children ?? "▲"}
    </div>
  )
}

// ─── ScrollDownButton ──────────────────────────────────────────────────────────

/** Props for the select scroll down button. */
export interface SelectScrollDownButtonProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * ScrollDownButton — displays at the bottom of scrollable content to indicate
 * more items below. Scrolls the listbox down on pointer hover.
 */
export function ScrollDownButton(props: SelectScrollDownButtonProps) {
  const handlePointerDown = (e: PointerEvent) => {
    const listbox = (e.currentTarget as HTMLElement).parentElement
    if (!listbox) return
    listbox.scrollBy({ top: 50, behavior: "smooth" })
  }

  return (
    <div
      aria-hidden="true"
      onPointerDown={handlePointerDown}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "select", part: "scroll-down-button" })}
    >
      {props.children ?? "▼"}
    </div>
  )
}
