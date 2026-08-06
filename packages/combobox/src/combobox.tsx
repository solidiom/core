/**
 * Combobox primitive — autocomplete input with filterable listbox,
 * keyboard navigation, active descendant pattern, and dismissable layer.
 *
 * Parts: Root, Input, Content (listbox), Item, ItemText.
 */

import { type Accessor, Show, createSignal, createEffect, onCleanup } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createDisclosureState,
  createControllableValue,
  createCollection,
  createStableId,
  createChangeDetails,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  resolveNavigationIntent,
  resolveNextItem,
  type ChangeDetails,
  type DisclosureReason,
  type CollectionItem,
} from "@solidiom/runtime"
import {
  ComboboxContext,
  useComboboxContext,
  type ComboboxContextValue,
  type ComboboxReason,
} from "./combobox-context"

// ─── Root ──────────────────────────────────────────────────────────────────────

export interface ComboboxRootProps {
  /** Controlled open state. */
  open?: Accessor<boolean>
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Controlled input text value. */
  inputValue?: Accessor<string>
  defaultInputValue?: string
  onInputValueChange?: (value: string) => void
  /** Controlled selected value. */
  selectedValue?: Accessor<string | undefined>
  defaultSelectedValue?: string
  onSelectedValueChange?: (value: string, details: ChangeDetails<ComboboxReason>) => void
  children: JSX.Element
  class?: string
}

/** Root provider — composes disclosure state, input value, and collection. */
export function Root(props: ComboboxRootProps) {
  const baseId = createStableId("combobox")

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

  const { value: selectedValue, requestChange: requestSelectedChange } = createControllableValue<
    string,
    ComboboxReason
  >({
    value: props.selectedValue as Accessor<string | undefined>,
    defaultValue: props.defaultSelectedValue ?? "",
    onChange: props.onSelectedValueChange,
  })

  const [highlightedId, setHighlightedId] = createSignal<string | null>(null)
  const collection = createCollection()

  const setInputValue = (next: string) => {
    requestInputChange(next, createChangeDetails("input"))
  }

  const ctx: ComboboxContextValue = {
    open,
    requestOpenChange,
    inputValue,
    setInputValue,
    selectedValue,
    requestSelectedChange,
    highlightedId,
    setHighlightedId,
    collection,
    inputId: `${baseId}-input`,
    listboxId: `${baseId}-listbox`,
    labelId: `${baseId}-label`,
  }

  return (
    <ComboboxContext value={ctx}>
      <div
        {...applySemanticAttrs({
          scope: "combobox",
          part: "root",
          state: open() ? "open" : "closed",
        })}
      >
        {props.children}
      </div>
    </ComboboxContext>
  )
}

// ─── Input ─────────────────────────────────────────────────────────────────────

export interface ComboboxInputProps {
  /** Placeholder text when empty. */
  placeholder?: string
  /** Called on each input change to trigger filtering. */
  onFilter?: (value: string) => void
  ref?: (el: HTMLInputElement) => void
  class?: string
  style?: JSX.CSSProperties | string
}

/** Text input with aria-autocomplete, triggers open on focus/type. */
export function Input(props: ComboboxInputProps) {
  const ctx = useComboboxContext()

  const handleInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement
    ctx.setInputValue(target.value)
    props.onFilter?.(target.value)

    if (!ctx.open()) {
      ctx.requestOpenChange(true, createChangeDetails("trigger"))
    }
  }

  const handleFocus = () => {
    if (!ctx.open()) {
      ctx.requestOpenChange(true, createChangeDetails("trigger"))
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      ctx.requestOpenChange(false, createChangeDetails("escape" as DisclosureReason))
      return
    }

    if (!ctx.open()) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault()
        ctx.requestOpenChange(true, createChangeDetails("trigger"))
      }
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
        const item = ctx.collection.getItem(activeId)
        if (item) {
          ctx.requestSelectedChange(item.textValue(), createChangeDetails("keyboard"))
          ctx.setInputValue(item.textValue())
          ctx.requestOpenChange(false, createChangeDetails("trigger"))
        }
      }
    }
  }

  return (
    <input
      id={ctx.inputId}
      type="text"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={ctx.open() ? "true" : "false"}
      aria-controls={ctx.listboxId}
      aria-activedescendant={ctx.highlightedId() ?? undefined}
      value={ctx.inputValue()}
      placeholder={props.placeholder}
      onInput={handleInput}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      ref={props.ref}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "combobox", part: "input" })}
    />
  )
}

// ─── Content (Listbox) ─────────────────────────────────────────────────────────

export interface ComboboxContentProps {
  children: JSX.Element
  ref?: (el: HTMLDivElement) => void
  class?: string
  style?: JSX.CSSProperties | string
}

/** Listbox container — registers dismissable layer for outside click/escape. */
export function Content(props: ComboboxContentProps) {
  const ctx = useComboboxContext()
  const [contentEl, setContentEl] = createSignal<HTMLDivElement | undefined>(undefined)

  createEffect(
    () => (ctx.open() ? contentEl() : undefined),
    (el) => {
      if (!el) return
      const doc = el.ownerDocument
      const stack = getLayerStack(doc)
      const removeLayer = stack.push({ id: ctx.listboxId, element: el, modal: false })

      const removeDismissable = setupDismissableLayer({
        document: doc,
        layerId: ctx.listboxId,
        element: () => el,
        excludeElements: () => {
          const input = doc.getElementById(ctx.inputId)
          return input ? [input] : []
        },
        onDismiss: (reason) => {
          ctx.requestOpenChange(false, createChangeDetails(reason))
        },
      })

      return () => {
        removeDismissable()
        removeLayer()
      }
    },
  )

  return (
    <Show when={ctx.open()}>
      <div
        id={ctx.listboxId}
        role="listbox"
        ref={(el: HTMLDivElement) => {
          setContentEl(el)
          props.ref?.(el)
        }}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({ scope: "combobox", part: "content", state: "open" })}
      >
        {props.children}
      </div>
    </Show>
  )
}

// ─── Item ──────────────────────────────────────────────────────────────────────

export interface ComboboxItemProps {
  /** Unique value for this item. */
  value: string
  /** Text value for matching. Defaults to value. */
  textValue?: string
  /** Disabled state. */
  disabled?: boolean
  children: JSX.Element
}

/** Individual option — registers in collection, highlights on hover. */
export function Item(props: ComboboxItemProps) {
  const ctx = useComboboxContext()
  const itemId = createStableId("combobox-item")

  const item: CollectionItem = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? props.value,
  }

  const cleanup = ctx.collection.registerItem(item)
  onCleanup(cleanup)

  const isSelected = () => ctx.selectedValue() === props.value
  const isHighlighted = () => ctx.highlightedId() === itemId

  const handleClick = () => {
    if (props.disabled) return
    const text = props.textValue ?? props.value
    ctx.requestSelectedChange(text, createChangeDetails("item-click"))
    ctx.setInputValue(text)
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
      aria-selected={isSelected() ? "true" : "false"}
      aria-disabled={props.disabled ? "true" : undefined}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      {...applySemanticAttrs({
        scope: "combobox",
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

// ─── ItemText ──────────────────────────────────────────────────────────────────

export interface ComboboxItemTextProps {
  children: JSX.Element
}

/** Display text within an item. */
export function ItemText(props: ComboboxItemTextProps) {
  return (
    <span {...applySemanticAttrs({ scope: "combobox", part: "item-text" })}>{props.children}</span>
  )
}
