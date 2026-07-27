/**
 * @solidiom/navigation-menu — A top-level navigation component with accessible dropdown sub-menus.
 *
 * Parts: Root, List, Item, Trigger, Content, Link.
 */

import { createSignal, onCleanup, type Accessor } from "solid-js"
import { type JSX, Show } from "@solidjs/web"
import {
  createCollection,
  createRovingFocus,
  createPointerIntent,
  createStableId,
  createPresence,
  applySemanticAttrs,
  resolveNavigationIntent,
  resolveNextItem,
  type NavigationIntent,
} from "@solidiom/runtime"
import {
  NavigationMenuContext,
  NavigationMenuItemContext,
  useNavigationMenuContext,
  useNavigationMenuItemContext,
  type PositioningPort,
} from "./navigation-menu-context"

export type { PositioningPort } from "./navigation-menu-context"

// ─── Root ────────────────────────────────────────────────────────────────────

export interface NavigationMenuRootProps {
  /** Default active item value (uncontrolled). */
  defaultValue?: string
  /** Controlled active value. */
  value?: Accessor<string | undefined>
  /** Called when active value changes. */
  onValueChange?: (value: string) => void
  /** Orientation of the navigation bar. Default "horizontal". */
  orientation?: "horizontal" | "vertical"
  /** Delay for pointer intent (ms). Default 200. */
  delayDuration?: number
  /** Optional positioning adapter for dropdown panels. */
  positioning?: PositioningPort
  /** Accessible label for the nav element. */
  "aria-label"?: string
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * NavigationMenu root — wraps the navigation in a `<nav>` element.
 *
 * Emits `data-scope="navigation-menu"`, `data-part="root"`.
 */
export function Root(props: NavigationMenuRootProps) {
  const orientation = () => props.orientation ?? "horizontal"
  const delayDuration = props.delayDuration ?? 200

  const [activeValue, setActiveValueRaw] = createSignal(props.defaultValue ?? "")

  const setActiveValue = (value: string) => {
    setActiveValueRaw(value)
    props.onValueChange?.(value)
  }

  const close = () => {
    setActiveValueRaw("")
    props.onValueChange?.("")
  }

  const collection = createCollection({
    orientation: () => (orientation() === "horizontal" ? "horizontal" : "vertical"),
  })

  const rovingFocus = createRovingFocus()

  const pointerIntent = createPointerIntent({
    delay: delayDuration,
    onIntentConfirm: () => {
      // Intent confirmed — value is already set by trigger enter
    },
    onIntentCancel: () => {
      close()
    },
  })

  const value = () => {
    if (props.value !== undefined) {
      return props.value() ?? ""
    }
    return activeValue()
  }

  return (
    <NavigationMenuContext
      value={{
        activeValue: value,
        setActiveValue,
        close,
        collection,
        rovingFocus,
        pointerIntent,
        orientation,
        positioning: props.positioning,
        delayDuration,
      }}
    >
      <nav
        aria-label={props["aria-label"] ?? "Main"}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "navigation-menu",
          part: "root",
          orientation: orientation(),
        })}
      >
        {props.children}
      </nav>
    </NavigationMenuContext>
  )
}

// ─── List ────────────────────────────────────────────────────────────────────

export interface NavigationMenuListProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * NavigationMenu list — the menubar container for trigger items.
 *
 * Emits `data-scope="navigation-menu"`, `data-part="list"`.
 */
export function List(props: NavigationMenuListProps) {
  const ctx = useNavigationMenuContext()

  const handleKeyDown = (e: KeyboardEvent) => {
    const items = ctx.collection.enabledItems()
    const activeId = ctx.rovingFocus.activeId()
    if (!items.length) return

    const intent: NavigationIntent | undefined = resolveNavigationIntent(e.key, {
      orientation: ctx.orientation(),
      direction: "ltr",
      loop: true,
    })

    if (!intent) return
    e.preventDefault()

    const nextItem = resolveNextItem(items, activeId, intent, { loop: true })
    if (nextItem) {
      ctx.rovingFocus.setActiveId(nextItem.id)
      ;(nextItem.ref as HTMLElement | undefined)?.focus()
    }
  }

  return (
    <ul
      role="menubar"
      aria-orientation={ctx.orientation()}
      onKeyDown={handleKeyDown}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "navigation-menu",
        part: "list",
        orientation: ctx.orientation(),
      })}
    >
      {props.children}
    </ul>
  )
}

// ─── Item ────────────────────────────────────────────────────────────────────

export interface NavigationMenuItemProps {
  /** Unique value for this navigation item. */
  value: string
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * NavigationMenu item — wraps a trigger and its content.
 *
 * Emits `data-scope="navigation-menu"`, `data-part="item"`.
 */
export function Item(props: NavigationMenuItemProps) {
  const ctx = useNavigationMenuContext()
  const triggerId = createStableId("nav-trigger")
  const contentId = createStableId("nav-content")

  const isOpen = () => ctx.activeValue() === props.value

  return (
    <NavigationMenuItemContext
      value={{
        value: props.value,
        isOpen,
        triggerId,
        contentId,
      }}
    >
      <li
        role="none"
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "navigation-menu",
          part: "item",
        })}
      >
        {props.children}
      </li>
    </NavigationMenuItemContext>
  )
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

export interface NavigationMenuTriggerProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * NavigationMenu trigger — button that opens the associated content panel.
 *
 * Emits `data-scope="navigation-menu"`, `data-part="trigger"`, `data-state="open"|"closed"`.
 */
export function Trigger(props: NavigationMenuTriggerProps) {
  const ctx = useNavigationMenuContext()
  const itemCtx = useNavigationMenuItemContext()
  let ref: HTMLButtonElement | undefined

  const itemId = itemCtx.value

  // Register item with collection
  const unregister = ctx.collection.registerItem({
    id: itemId,
    get ref() {
      return ref
    },
    disabled: () => false,
    textValue: () => itemId,
  })
  onCleanup(unregister)

  const handleClick = () => {
    if (itemCtx.isOpen()) {
      ctx.close()
    } else {
      ctx.setActiveValue(itemCtx.value)
    }
  }

  const handlePointerEnter = () => {
    ctx.pointerIntent.handleTriggerEnter()
    ctx.setActiveValue(itemCtx.value)
  }

  const handlePointerLeave = () => {
    ctx.pointerIntent.handleTriggerLeave()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      ctx.setActiveValue(itemCtx.value)
    }
  }

  return (
    <button
      ref={ref}
      id={itemCtx.triggerId}
      type="button"
      role="menuitem"
      aria-expanded={itemCtx.isOpen() ? "true" : undefined}
      aria-controls={itemCtx.contentId}
      aria-haspopup="menu"
      tabindex={ctx.rovingFocus.getTabIndex(itemId)}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "navigation-menu",
        part: "trigger",
        state: itemCtx.isOpen() ? "open" : "closed",
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Content ─────────────────────────────────────────────────────────────────

export interface NavigationMenuContentProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * NavigationMenu content — dropdown panel for a navigation item.
 *
 * Emits `data-scope="navigation-menu"`, `data-part="content"`, `data-state="open"|"closed"`.
 */
export function Content(props: NavigationMenuContentProps) {
  const ctx = useNavigationMenuContext()
  const itemCtx = useNavigationMenuItemContext()

  const presence = createPresence({ open: itemCtx.isOpen })

  const handlePointerEnter = () => {
    ctx.pointerIntent.handleContentEnter()
  }

  const handlePointerLeave = () => {
    ctx.pointerIntent.handleContentLeave()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      ctx.close()
      // Restore focus to trigger
      const triggerEl = document.getElementById(itemCtx.triggerId)
      triggerEl?.focus()
    }
  }

  return (
    <Show when={presence.present()}>
      <div
        id={itemCtx.contentId}
        role="menu"
        aria-labelledby={itemCtx.triggerId}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "navigation-menu",
          part: "content",
          state: itemCtx.isOpen() ? "open" : "closed",
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}

// ─── Link ────────────────────────────────────────────────────────────────────

export interface NavigationMenuLinkProps {
  /** Whether this link represents the current page. */
  active?: boolean
  /** Link href. */
  href?: string
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
  /** Called on click. */
  onClick?: (e: MouseEvent) => void
}

/**
 * NavigationMenu link — an accessible link inside a content panel.
 *
 * Emits `data-scope="navigation-menu"`, `data-part="link"`, `data-active` when active.
 */
export function Link(props: NavigationMenuLinkProps) {
  const ctx = useNavigationMenuContext()

  const handleClick = (e: MouseEvent) => {
    props.onClick?.(e)
    ctx.close()
  }

  return (
    <a
      role="menuitem"
      href={props.href}
      aria-current={props.active ? "page" : undefined}
      onClick={handleClick}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "navigation-menu",
        part: "link",
        ...(props.active ? { state: "active" } : {}),
      })}
    >
      {props.children}
    </a>
  )
}
