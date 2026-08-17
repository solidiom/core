/**
 * @solidiom/mega-menu — Expanded navigation dropdown with rich multi-column content.
 *
 * Headless primitive providing accessible behavior without styling opinions.
 *
 * Parts: Root, List, Item, Trigger, Content, Link, Group, GroupLabel.
 *
 * Uses createDisclosureState for open/close per item, createPointerIntent for
 * diagonal grace period, createCollection for item registration, and
 * createRovingFocus for keyboard navigation between triggers.
 */

import { type Accessor, createContext, createSignal, Show, useContext } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createPointerIntent,
  createCollection,
  createRovingFocus,
  createStableId,
  resolveNextItem,
  applySemanticAttrs,
  type Collection,
  type CollectionItem,
  type RovingFocus,
  type PointerIntent,
} from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface MegaMenuRootProps {
  /** Controlled active item value. */
  value?: string
  /** Default active item value (uncontrolled). */
  defaultValue?: string
  /** Called when the active item changes. */
  onValueChange?: (value: string) => void
  /** Hover delay in ms before opening. Default: 200. */
  delayDuration?: number
  /** Disable all menu interactions. */
  disabled?: boolean
  children?: JSX.Element
}

export interface MegaMenuItemProps {
  /** Unique identifier for this item. */
  value: string
  /** Disable this item. */
  disabled?: boolean
  children?: JSX.Element
}

export interface MegaMenuTriggerProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLButtonElement) => void
}

export interface MegaMenuContentProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLDivElement) => void
}

export interface MegaMenuLinkProps {
  href: string
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  active?: boolean
}

export interface MegaMenuGroupProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface MegaMenuGroupLabelProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface MegaMenuListProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

// ─── Contexts ───────────────────────────────────────────────────────────────────

interface RootContextValue {
  activeValue: Accessor<string | undefined>
  setActiveValue: (value: string | undefined) => void
  delayDuration: number
  disabled: Accessor<boolean>
  collection: Collection
  rovingFocus: RovingFocus
  rootId: string
}

const RootContext = createContext<RootContextValue>()

function useRootContext(): RootContextValue {
  const ctx = useContext(RootContext)
  if (!ctx) {
    throw new Error("[solidiom] MegaMenu parts must be used within MegaMenu.Root")
  }
  return ctx
}

interface ItemContextValue {
  value: string
  disabled: Accessor<boolean>
  open: Accessor<boolean>
  requestOpen: (next: boolean) => void
  triggerId: string
  contentId: string
  pointerIntent: PointerIntent
  triggerEl: Accessor<HTMLButtonElement | undefined>
  setTriggerEl: (el: HTMLButtonElement | undefined) => void
}

const ItemContext = createContext<ItemContextValue>()

function useItemContext(): ItemContextValue {
  const ctx = useContext(ItemContext)
  if (!ctx) {
    throw new Error("[solidiom] MegaMenu.Trigger/Content must be used within MegaMenu.Item")
  }
  return ctx
}

// ─── Root ───────────────────────────────────────────────────────────────────────

/**
 * Root container for the mega menu navigation.
 *
 * Wraps a `<nav>` element and provides collection/roving focus for items.
 */
export function Root(props: MegaMenuRootProps) {
  const rootId = createStableId("mega-menu")
  const delayDuration = props.delayDuration ?? 200
  const disabled = () => props.disabled ?? false

  // Track active (open) item value — only one open at a time
  const [internalValue, setInternalValue] = createSignal<string | undefined>(props.defaultValue)

  const activeValue = (): string | undefined => {
    if (props.value !== undefined) return props.value
    return internalValue()
  }

  const setActiveValue = (value: string | undefined) => {
    if (props.value === undefined) {
      setInternalValue(value)
    }
    if (value !== undefined) {
      props.onValueChange?.(value)
    }
  }

  const collection = createCollection({
    orientation: () => "horizontal",
  })

  const rovingFocus = createRovingFocus({
    onActiveIdChange: (id) => {
      // Focus the trigger element when roving focus changes
      const item = collection.getItem(id)
      if (item?.ref) {
        ;(item.ref as HTMLElement).focus()
      }
    },
  })

  const ctx: RootContextValue = {
    activeValue,
    setActiveValue,
    delayDuration,
    disabled,
    collection,
    rovingFocus,
    rootId,
  }

  return (
    <RootContext value={ctx}>
      <nav
        {...applySemanticAttrs({
          scope: "mega-menu",
          part: "root",
          disabled: disabled(),
        })}
      >
        {props.children}
      </nav>
    </RootContext>
  )
}

// ─── List ───────────────────────────────────────────────────────────────────────

/**
 * Horizontal list of menu items. Renders a `<ul>` with role="menubar".
 */
export function List(props: MegaMenuListProps) {
  const ctx = useRootContext()

  const handleKeyDown = (e: KeyboardEvent) => {
    if (ctx.disabled()) return

    const enabledItems = ctx.collection.enabledItems()
    const currentId = ctx.rovingFocus.activeId()

    if (e.key === "ArrowRight") {
      e.preventDefault()
      const next = resolveNextItem(enabledItems, currentId, "next", { loop: true })
      if (next) {
        ctx.rovingFocus.setActiveId(next.id)
        // Close any open item and open the new one if something was open
        if (ctx.activeValue() !== undefined) {
          ctx.setActiveValue(next.id)
        }
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      const prev = resolveNextItem(enabledItems, currentId, "previous", { loop: true })
      if (prev) {
        ctx.rovingFocus.setActiveId(prev.id)
        if (ctx.activeValue() !== undefined) {
          ctx.setActiveValue(prev.id)
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      // Open the currently focused item
      if (currentId) {
        ctx.setActiveValue(currentId)
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      ctx.setActiveValue(undefined)
    } else if (e.key === "Home") {
      e.preventDefault()
      const first = resolveNextItem(enabledItems, currentId, "first")
      if (first) ctx.rovingFocus.setActiveId(first.id)
    } else if (e.key === "End") {
      e.preventDefault()
      const last = resolveNextItem(enabledItems, currentId, "last")
      if (last) ctx.rovingFocus.setActiveId(last.id)
    }
  }

  const handleFocusIn = () => {
    ctx.rovingFocus.onFocusIn(ctx.collection.enabledItems())
  }

  return (
    <ul
      role="menubar"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      onFocusIn={handleFocusIn}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "mega-menu",
        part: "list",
        orientation: "horizontal",
        disabled: ctx.disabled(),
      })}
    >
      {props.children}
    </ul>
  )
}

// ─── Item ───────────────────────────────────────────────────────────────────────

/**
 * Individual menu item containing a trigger + content pair.
 * Manages its own disclosure state and pointer intent for hover open.
 */
export function Item(props: MegaMenuItemProps) {
  const rootCtx = useRootContext()
  const itemId = props.value
  const disabled = () => (props.disabled ?? false) || rootCtx.disabled()
  const triggerId = `${rootCtx.rootId}-trigger-${itemId}`
  const contentId = `${rootCtx.rootId}-content-${itemId}`

  const [triggerEl, setTriggerEl] = createSignal<HTMLButtonElement | undefined>()

  // Register item in the collection
  const collectionItem: CollectionItem = {
    id: itemId,
    disabled,
    textValue: () => itemId,
    get ref() {
      return triggerEl()
    },
  }
  rootCtx.collection.registerItem(collectionItem)

  // Item is open when it's the active value
  const open = () => rootCtx.activeValue() === itemId

  const requestOpen = (next: boolean) => {
    if (disabled()) return
    if (next) {
      rootCtx.setActiveValue(itemId)
    } else {
      // Only close if this item is currently open
      if (rootCtx.activeValue() === itemId) {
        rootCtx.setActiveValue(undefined)
      }
    }
  }

  // Pointer intent for hover open with diagonal grace period
  const pointerIntent = createPointerIntent({
    delay: rootCtx.delayDuration,
    onIntentConfirm: () => {
      if (!disabled()) {
        requestOpen(true)
      }
    },
    onIntentCancel: () => {
      requestOpen(false)
    },
  })

  const ctx: ItemContextValue = {
    value: itemId,
    disabled,
    open,
    requestOpen,
    triggerId,
    contentId,
    pointerIntent,
    triggerEl,
    setTriggerEl,
  }

  return (
    <ItemContext value={ctx}>
      <li
        role="none"
        {...applySemanticAttrs({
          scope: "mega-menu",
          part: "item",
          state: open() ? "open" : "closed",
          disabled: disabled(),
        })}
      >
        {props.children}
      </li>
    </ItemContext>
  )
}

// ─── Trigger ────────────────────────────────────────────────────────────────────

/**
 * Menu item trigger button. Opens/closes the associated content panel.
 * Supports hover intent and keyboard interactions.
 */
export function Trigger(props: MegaMenuTriggerProps) {
  const rootCtx = useRootContext()
  const itemCtx = useItemContext()

  const handleClick = () => {
    if (itemCtx.disabled()) return
    itemCtx.requestOpen(!itemCtx.open())
    rootCtx.rovingFocus.setActiveId(itemCtx.value, false)
  }

  const handlePointerEnter = () => {
    if (itemCtx.disabled()) return
    itemCtx.pointerIntent.handleTriggerEnter()
  }

  const handlePointerLeave = () => {
    if (itemCtx.disabled()) return
    itemCtx.pointerIntent.handleTriggerLeave()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (itemCtx.disabled()) return

    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      itemCtx.requestOpen(true)
    } else if (e.key === "Escape") {
      e.preventDefault()
      itemCtx.requestOpen(false)
    }
  }

  return (
    <button
      id={itemCtx.triggerId}
      role="menuitem"
      aria-haspopup="true"
      aria-expanded={itemCtx.open() ? "true" : "false"}
      aria-controls={itemCtx.contentId}
      disabled={itemCtx.disabled()}
      tabindex={rootCtx.rovingFocus.getTabIndex(itemCtx.value)}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      ref={(el: HTMLButtonElement) => {
        itemCtx.setTriggerEl(el)
        props.ref?.(el)
      }}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "mega-menu",
        part: "trigger",
        state: itemCtx.open() ? "open" : "closed",
        disabled: itemCtx.disabled(),
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Content ────────────────────────────────────────────────────────────────────

/**
 * Expanded dropdown panel for a menu item.
 * Shows/hides based on item disclosure state with pointer intent grace period.
 */
export function Content(props: MegaMenuContentProps) {
  const itemCtx = useItemContext()

  const handlePointerEnter = () => {
    itemCtx.pointerIntent.handleContentEnter()
  }

  const handlePointerLeave = () => {
    itemCtx.pointerIntent.handleContentLeave()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      itemCtx.requestOpen(false)
      // Return focus to trigger
      itemCtx.triggerEl()?.focus()
    }
  }

  return (
    <Show when={itemCtx.open()}>
      <div
        id={itemCtx.contentId}
        role="menu"
        aria-labelledby={itemCtx.triggerId}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
        ref={props.ref}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "mega-menu",
          part: "content",
          state: itemCtx.open() ? "open" : "closed",
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}

// ─── Link ───────────────────────────────────────────────────────────────────────

/**
 * Navigation link within a mega menu content panel.
 */
export function Link(props: MegaMenuLinkProps) {
  return (
    <a
      href={props.href}
      role="menuitem"
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "mega-menu",
        part: "link",
        highlighted: props.active,
      })}
    >
      {props.children}
    </a>
  )
}

// ─── Group ──────────────────────────────────────────────────────────────────────

/**
 * Groups related links within a mega menu content panel.
 */
export function Group(props: MegaMenuGroupProps) {
  return (
    <div
      role="group"
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "mega-menu",
        part: "group",
      })}
    >
      {props.children}
    </div>
  )
}

// ─── GroupLabel ──────────────────────────────────────────────────────────────────

/**
 * Heading label for a group of links within a content panel.
 */
export function GroupLabel(props: MegaMenuGroupLabelProps) {
  return (
    <span
      role="presentation"
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "mega-menu",
        part: "group-label",
      })}
    >
      {props.children}
    </span>
  )
}
