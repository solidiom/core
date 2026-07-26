/**
 * Accordion primitive — expand/collapse panels with single or multiple mode,
 * keyboard navigation (Arrow Up/Down, Home/End, Enter/Space to toggle).
 *
 * Parts: Root, Item, Trigger, Content.
 */

import { type Accessor, onCleanup, Show } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createControllableValue,
  createCollection,
  createStableId,
  createChangeDetails,
  applySemanticAttrs,
  resolveNavigationIntent,
  resolveNextItem,
  type ChangeDetails,
  type CollectionItem,
} from "@solidiom/runtime"
import {
  AccordionContext,
  AccordionItemContext,
  useAccordionContext,
  useAccordionItemContext,
  type AccordionContextValue,
  type AccordionItemContextValue,
  type AccordionReason,
} from "./accordion-context"

// ─── Root ──────────────────────────────────────────────────────────────────────

/** Props for the accordion root container. */
export interface AccordionRootProps {
  /** Expand mode: "single" allows one open item, "multiple" allows many. */
  type?: "single" | "multiple"
  /** Controlled expanded value(s). */
  value?: Accessor<string[]>
  /** Default expanded value(s) for uncontrolled mode. */
  defaultValue?: string[]
  /** Called when expanded items change. */
  onValueChange?: (value: string[], details: ChangeDetails<AccordionReason>) => void
  /** Whether all items can be collapsed in single mode. Default: false. */
  collapsible?: boolean
  /** Disabled state for all items. */
  disabled?: Accessor<boolean>
  children: JSX.Element
}

/** Root container that provides accordion state context. */
export function Root(props: AccordionRootProps) {
  const multiple = (props.type ?? "single") === "multiple"
  const collapsible = props.collapsible ?? false

  const { value, requestChange } = createControllableValue<string[], AccordionReason>({
    value: props.value,
    defaultValue: props.defaultValue ?? [],
    onChange: props.onValueChange,
    equals: (a, b) => a.length === b.length && a.every((v, i) => v === b[i]),
  })

  const collection = createCollection({ orientation: () => "vertical" })

  const requestValueChange = (next: string[], details: ChangeDetails<AccordionReason>): void => {
    requestChange(next, details)
  }

  const ctx: AccordionContextValue = {
    value,
    requestValueChange,
    multiple,
    disabled: props.disabled ?? (() => false),
    collection,
    collapsible,
  }

  return (
    <AccordionContext value={ctx}>
      <div
        {...applySemanticAttrs({
          scope: "accordion",
          part: "root",
        })}
      >
        {props.children}
      </div>
    </AccordionContext>
  )
}

// ─── Item ──────────────────────────────────────────────────────────────────────

/** Props for an individual accordion item. */
export interface AccordionItemProps {
  /** Unique value identifying this item. */
  value: string
  /** Whether this item is disabled. */
  disabled?: boolean
  children: JSX.Element
}

/** Wraps a single collapsible section (trigger + content pair). */
export function Item(props: AccordionItemProps) {
  const ctx = useAccordionContext()
  const baseId = createStableId("accordion-item")

  const isExpanded = (): boolean => ctx.value().includes(props.value)
  const isDisabled = (): boolean => props.disabled ?? ctx.disabled()

  const itemCtx: AccordionItemContextValue = {
    value: props.value,
    disabled: isDisabled,
    isExpanded,
    triggerId: `${baseId}-trigger`,
    contentId: `${baseId}-content`,
  }

  return (
    <AccordionItemContext value={itemCtx}>
      <div
        {...applySemanticAttrs({
          scope: "accordion",
          part: "item",
          state: isExpanded() ? "open" : "closed",
          disabled: isDisabled(),
        })}
      >
        {props.children}
      </div>
    </AccordionItemContext>
  )
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

/** Props for the accordion item trigger button. */
export interface AccordionTriggerProps {
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
}

/** Button that toggles its parent item's expanded state. */
export function Trigger(props: AccordionTriggerProps) {
  const ctx = useAccordionContext()
  const itemCtx = useAccordionItemContext()
  const itemId = createStableId("accordion-trigger-item")

  const collectionItem: CollectionItem = {
    id: itemId,
    disabled: itemCtx.disabled,
    textValue: () => itemCtx.value,
  }

  const cleanup = ctx.collection.registerItem(collectionItem)
  onCleanup(cleanup)

  const toggle = () => {
    if (itemCtx.disabled()) return
    const current = ctx.value()
    const expanded = current.includes(itemCtx.value)

    if (expanded) {
      // Collapse
      if (!ctx.multiple && !ctx.collapsible) return
      const next = current.filter((v) => v !== itemCtx.value)
      ctx.requestValueChange(next, createChangeDetails("trigger-click"))
    } else {
      // Expand
      const next = ctx.multiple ? [...current, itemCtx.value] : [itemCtx.value]
      ctx.requestValueChange(next, createChangeDetails("trigger-click"))
    }
  }

  const handleClick = () => {
    toggle()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (itemCtx.disabled()) return

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggle()
      return
    }

    const intent = resolveNavigationIntent(e.key, {
      orientation: "vertical",
      direction: "ltr",
    })

    if (intent) {
      e.preventDefault()
      const next = resolveNextItem(ctx.collection.enabledItems(), itemId, intent, { loop: true })
      if (next?.ref) {
        ;(next.ref as HTMLElement).focus()
      }
    }
  }

  return (
    <button
      id={itemCtx.triggerId}
      aria-expanded={itemCtx.isExpanded() ? "true" : "false"}
      aria-controls={itemCtx.contentId}
      disabled={itemCtx.disabled()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      ref={(el: HTMLButtonElement) => {
        collectionItem.ref = el
        props.ref?.(el)
      }}
      {...applySemanticAttrs({
        scope: "accordion",
        part: "trigger",
        state: itemCtx.isExpanded() ? "open" : "closed",
        disabled: itemCtx.disabled(),
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Content ───────────────────────────────────────────────────────────────────

/** Props for the accordion item content region. */
export interface AccordionContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

/** Collapsible content region for an accordion item. */
export function Content(props: AccordionContentProps) {
  const itemCtx = useAccordionItemContext()

  return (
    <Show when={itemCtx.isExpanded()}>
      <div
        id={itemCtx.contentId}
        role="region"
        aria-labelledby={itemCtx.triggerId}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "accordion",
          part: "content",
          state: "open",
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}
