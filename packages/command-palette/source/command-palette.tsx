/**
 * Command palette primitive — modal combobox overlay with filtering,
 * keyboard navigation, group support, empty state, focus trapping,
 * and dismissable layer.
 *
 * Parts: Root, Input, List (listbox), Group, Item, Empty.
 */

import { type Accessor, Show, createSignal, onCleanup, onSettled } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createDisclosureState,
  createControllableValue,
  createCollection,
  createStableId,
  createPresence,
  createChangeDetails,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  activateFocusScope,
  resolveNavigationIntent,
  resolveNextItem,
  type ChangeDetails,
  type DisclosureReason,
  type CollectionItem,
} from "@solidiom/runtime"
import {
  CommandPaletteContext,
  useCommandPaletteContext,
  type CommandPaletteContextValue,
} from "./command-palette-context"

// ─── Root ──────────────────────────────────────────────────────────────────────

export interface CommandPaletteRootProps {
  /** Controlled open state. */
  open?: Accessor<boolean>
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Controlled input value. */
  inputValue?: Accessor<string>
  defaultInputValue?: string
  onInputValueChange?: (value: string) => void
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

/**
 * Root provider — composes modal dialog state, input value, and collection.
 * Renders the portal/overlay wrapper and manages focus trapping + dismiss.
 */
export function Root(props: CommandPaletteRootProps) {
  const baseId = createStableId("cmd-palette")

  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
  })

  const { value: inputValue, requestChange: requestInputChange } = createControllableValue<
    string,
    "input"
  >({
    value: props.inputValue,
    defaultValue: props.defaultInputValue ?? "",
    onChange: (v) => props.onInputValueChange?.(v),
  })

  const [highlightedId, setHighlightedId] = createSignal<string | null>(null)
  const collection = createCollection()
  const presence = createPresence({ open })

  const setInputValue = (next: string) => {
    requestInputChange(next, createChangeDetails("input"))
  }

  const ctx: CommandPaletteContextValue = {
    open,
    requestOpenChange,
    inputValue,
    setInputValue,
    highlightedId,
    setHighlightedId,
    collection,
    inputId: `${baseId}-input`,
    listId: `${baseId}-list`,
    contentId: `${baseId}-content`,
  }

  let contentEl: HTMLDivElement | undefined

  onSettled(() => {
    if (!contentEl || !open()) return
    const doc = contentEl.ownerDocument

    const stack = getLayerStack(doc)
    const removeLayer = stack.push({ id: ctx.contentId, element: contentEl, modal: true })

    const removeDismissable = setupDismissableLayer({
      document: doc,
      layerId: ctx.contentId,
      element: () => contentEl,
      onDismiss: (reason) => {
        requestOpenChange(false, createChangeDetails(reason))
      },
    })

    const deactivateFocus = activateFocusScope({
      element: () => contentEl,
    })

    return () => {
      deactivateFocus()
      removeDismissable()
      removeLayer()
    }
  })

  return (
    <CommandPaletteContext value={ctx}>
      <Show when={presence.present()}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          id={ctx.contentId}
          class={props.class}
          style={props.style}
          ref={(el: HTMLDivElement) => {
            contentEl = el
          }}
          {...applySemanticAttrs({
            scope: "command-palette",
            part: "root",
            state: open() ? "open" : "closed",
          })}
        >
          {props.children}
        </div>
      </Show>
    </CommandPaletteContext>
  )
}

// ─── Input ─────────────────────────────────────────────────────────────────────

export interface CommandPaletteInputProps {
  /** Placeholder text. */
  placeholder?: string
  /** Called on each input change to trigger filtering. */
  onFilter?: (value: string) => void
  ref?: (el: HTMLInputElement) => void
  class?: string
  style?: JSX.CSSProperties | string
}

/** Filter input — triggers filtering callback and manages keyboard navigation. */
export function Input(props: CommandPaletteInputProps) {
  const ctx = useCommandPaletteContext()

  const handleInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement
    ctx.setInputValue(target.value)
    props.onFilter?.(target.value)
    // Reset highlight when filtering
    ctx.setHighlightedId(null)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      ctx.requestOpenChange(false, createChangeDetails("escape" as DisclosureReason))
      return
    }

    const intent = resolveNavigationIntent(e.key, {
      orientation: "vertical",
      direction: "ltr",
    })

    if (intent) {
      e.preventDefault()
      const items = ctx.collection.enabledItems()
      const next = resolveNextItem(items, ctx.highlightedId() ?? undefined, intent, { loop: true })
      if (next) ctx.setHighlightedId(next.id)
      return
    }

    if (e.key === "Enter") {
      e.preventDefault()
      const activeId = ctx.highlightedId()
      if (activeId) {
        const el = document.getElementById(activeId)
        el?.click()
      }
    }
  }

  return (
    <input
      id={ctx.inputId}
      type="text"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded="true"
      aria-controls={ctx.listId}
      aria-activedescendant={ctx.highlightedId() ?? undefined}
      value={ctx.inputValue()}
      placeholder={props.placeholder}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      ref={props.ref}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "command-palette", part: "input" })}
    />
  )
}

// ─── List ──────────────────────────────────────────────────────────────────────

export interface CommandPaletteListProps {
  children: JSX.Element
  ref?: (el: HTMLDivElement) => void
  class?: string
  style?: JSX.CSSProperties | string
}

/** Listbox container for items and groups. */
export function List(props: CommandPaletteListProps) {
  const ctx = useCommandPaletteContext()

  return (
    <div
      id={ctx.listId}
      role="listbox"
      ref={props.ref}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "command-palette", part: "list" })}
    >
      {props.children}
    </div>
  )
}

// ─── Group ─────────────────────────────────────────────────────────────────────

export interface CommandPaletteGroupProps {
  /** Group heading label. */
  heading?: string
  children: JSX.Element
  class?: string
}

/** Groups items under a heading. */
export function Group(props: CommandPaletteGroupProps) {
  const groupId = createStableId("cmd-group")

  return (
    <div
      role="group"
      aria-labelledby={props.heading ? `${groupId}-heading` : undefined}
      class={props.class}
      {...applySemanticAttrs({ scope: "command-palette", part: "group" })}
    >
      {props.heading && (
        <div
          id={`${groupId}-heading`}
          aria-hidden="true"
          {...applySemanticAttrs({ scope: "command-palette", part: "group-heading" })}
        >
          {props.heading}
        </div>
      )}
      {props.children}
    </div>
  )
}

// ─── Item ──────────────────────────────────────────────────────────────────────

export interface CommandPaletteItemProps {
  /** Unique value/identifier for this command. */
  value: string
  /** Text value for filtering. Defaults to value. */
  textValue?: string
  /** Disabled state. */
  disabled?: boolean
  /** Called when the command is executed (Enter or click). */
  onSelect?: () => void
  children: JSX.Element
  class?: string
}

/** Individual command item — registers in collection, triggers onSelect. */
export function Item(props: CommandPaletteItemProps) {
  const ctx = useCommandPaletteContext()
  const itemId = createStableId("cmd-item")

  const item: CollectionItem = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? props.value,
  }

  const cleanup = ctx.collection.registerItem(item)
  onCleanup(cleanup)

  const isHighlighted = () => ctx.highlightedId() === itemId

  const handleClick = () => {
    if (props.disabled) return
    props.onSelect?.()
    ctx.requestOpenChange(false, createChangeDetails("trigger"))
  }

  const handlePointerMove = () => {
    if (props.disabled) return
    ctx.setHighlightedId(itemId)
  }

  return (
    <div
      id={itemId}
      role="option"
      aria-disabled={props.disabled ? "true" : undefined}
      aria-selected={isHighlighted() ? "true" : "false"}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      class={props.class}
      {...applySemanticAttrs({
        scope: "command-palette",
        part: "item",
        disabled: props.disabled,
        highlighted: isHighlighted(),
      })}
    >
      {props.children}
    </div>
  )
}

// ─── Empty ─────────────────────────────────────────────────────────────────────

export interface CommandPaletteEmptyProps {
  children: JSX.Element
  class?: string
}

/** Rendered when no items match the filter. */
export function Empty(props: CommandPaletteEmptyProps) {
  return (
    <div
      role="presentation"
      class={props.class}
      {...applySemanticAttrs({ scope: "command-palette", part: "empty" })}
    >
      {props.children}
    </div>
  )
}
