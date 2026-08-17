/**
 * @solidiom/menubar — Desktop-style horizontal menu bar with dropdown submenus.
 *
 * Parts: Root, Menu, Trigger, Content, Item, Separator, SubMenu, SubTrigger, SubContent.
 * Uses createCollection, createRovingFocus, createDisclosureState.
 * Keyboard: ArrowLeft/Right between menubar triggers, ArrowDown opens, Escape closes,
 * ArrowRight on SubTrigger opens sub.
 */

import {
  createContext,
  useContext,
  createSignal,
  Show,
  onMount,
  onCleanup,
  type Accessor,
} from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  applySemanticAttrs,
  createCollection,
  createRovingFocus,
  createDisclosureState,
  createChangeDetails,
  createStableId,
  type DisclosureReason,
  type ChangeDetails,
} from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface MenubarRootProps {
  class?: string
  children: JSX.Element
}

export interface MenubarMenuProps {
  children: JSX.Element
}

export interface MenubarTriggerProps {
  class?: string
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
}

export interface MenubarContentProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
  ref?: (el: HTMLDivElement) => void
}

export interface MenubarItemProps {
  class?: string
  children: JSX.Element
  disabled?: boolean
  onSelect?: () => void
}

export interface MenubarSeparatorProps {
  class?: string
}

export interface MenubarSubMenuProps {
  children: JSX.Element
}

export interface MenubarSubTriggerProps {
  class?: string
  children: JSX.Element
}

export interface MenubarSubContentProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

// ─── Contexts ───────────────────────────────────────────────────────────────

interface MenubarRootContextValue {
  collection: ReturnType<typeof createCollection>
  rovingFocus: ReturnType<typeof createRovingFocus>
  activeMenuId: Accessor<string | undefined>
  setActiveMenuId: (id: string | undefined) => void
}

const MenubarRootContext = createContext<MenubarRootContextValue>()

function useMenubarRootContext(): MenubarRootContextValue {
  const ctx = useContext(MenubarRootContext)
  if (!ctx) throw new Error("Menubar parts must be used within Menubar.Root")
  return ctx
}

interface MenubarMenuContextValue {
  menuId: string
  open: Accessor<boolean>
  requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void
  triggerId: string
  contentId: string
}

const MenubarMenuContext = createContext<MenubarMenuContextValue>()

function useMenubarMenuContext(): MenubarMenuContextValue {
  const ctx = useContext(MenubarMenuContext)
  if (!ctx) throw new Error("Menubar.Trigger/Content must be used within Menubar.Menu")
  return ctx
}

interface MenubarSubMenuContextValue {
  open: Accessor<boolean>
  requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void
  subTriggerId: string
  subContentId: string
}

const MenubarSubMenuContext = createContext<MenubarSubMenuContextValue>()

function useMenubarSubMenuContext(): MenubarSubMenuContextValue {
  const ctx = useContext(MenubarSubMenuContext)
  if (!ctx) throw new Error("SubTrigger/SubContent must be used within Menubar.SubMenu")
  return ctx
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: MenubarRootProps) {
  const collection = createCollection({ orientation: () => "horizontal" })
  const rovingFocus = createRovingFocus()
  const [activeMenuId, setActiveMenuId] = createSignal<string | undefined>(undefined)

  const ctx: MenubarRootContextValue = {
    collection,
    rovingFocus,
    activeMenuId,
    setActiveMenuId,
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const items = collection.enabledItems()
    if (items.length === 0) return

    const currentId = rovingFocus.activeId()
    const currentIdx = items.findIndex((item) => item.id === currentId)

    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault()
        const nextIdx = (currentIdx + 1) % items.length
        const nextItem = items[nextIdx]
        if (nextItem) {
          rovingFocus.setActiveId(nextItem.id)
          ;(nextItem.ref as HTMLElement)?.focus()
          // If a menu was open, open the next one
          if (activeMenuId()) {
            setActiveMenuId(nextItem.id)
          }
        }
        break
      }
      case "ArrowLeft": {
        e.preventDefault()
        const prevIdx = (currentIdx - 1 + items.length) % items.length
        const prevItem = items[prevIdx]
        if (prevItem) {
          rovingFocus.setActiveId(prevItem.id)
          ;(prevItem.ref as HTMLElement)?.focus()
          if (activeMenuId()) {
            setActiveMenuId(prevItem.id)
          }
        }
        break
      }
    }
  }

  return (
    <MenubarRootContext value={ctx}>
      <div
        role="menubar"
        class={props.class}
        onKeyDown={handleKeyDown}
        {...applySemanticAttrs({ scope: "menubar", part: "root", orientation: "horizontal" })}
      >
        {props.children}
      </div>
    </MenubarRootContext>
  )
}

export function Menu(props: MenubarMenuProps) {
  const rootCtx = useMenubarRootContext()
  const menuId = createStableId("menubar-menu")
  const triggerId = `${menuId}-trigger`
  const contentId = `${menuId}-content`

  const open = () => rootCtx.activeMenuId() === menuId

  const requestOpenChange = (next: boolean, details: ChangeDetails<DisclosureReason>) => {
    rootCtx.setActiveMenuId(next ? menuId : undefined)
  }

  const ctx: MenubarMenuContextValue = {
    menuId,
    open,
    requestOpenChange,
    triggerId,
    contentId,
  }

  return (
    <MenubarMenuContext value={ctx}>
      <div {...applySemanticAttrs({ scope: "menubar", part: "menu" })}>
        {props.children}
      </div>
    </MenubarMenuContext>
  )
}

export function Trigger(props: MenubarTriggerProps) {
  const rootCtx = useMenubarRootContext()
  const menuCtx = useMenubarMenuContext()
  let buttonRef: HTMLButtonElement | undefined

  onMount(() => {
    if (buttonRef) {
      const cleanup = rootCtx.collection.registerItem({
        id: menuCtx.menuId,
        ref: buttonRef,
        disabled: () => false,
        textValue: () => buttonRef?.textContent ?? "",
      })
      onCleanup(cleanup)
    }
  })

  const handleClick = () => {
    menuCtx.requestOpenChange(!menuCtx.open(), createChangeDetails("trigger"))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      menuCtx.requestOpenChange(true, createChangeDetails("trigger"))
    }
  }

  return (
    <button
      id={menuCtx.triggerId}
      role="menuitem"
      type="button"
      class={props.class}
      aria-haspopup="menu"
      aria-expanded={menuCtx.open() ? "true" : undefined}
      aria-controls={menuCtx.open() ? menuCtx.contentId : undefined}
      tabindex={rootCtx.rovingFocus.getTabIndex(menuCtx.menuId)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      ref={(el: HTMLButtonElement) => {
        buttonRef = el
        props.ref?.(el)
      }}
      {...applySemanticAttrs({
        scope: "menubar",
        part: "trigger",
        state: menuCtx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </button>
  )
}

export function Content(props: MenubarContentProps) {
  const menuCtx = useMenubarMenuContext()

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      menuCtx.requestOpenChange(false, createChangeDetails("escape-key"))
    }
  }

  return (
    <Show when={menuCtx.open()}>
      <div
        id={menuCtx.contentId}
        role="menu"
        aria-labelledby={menuCtx.triggerId}
        class={props.class}
        style={props.style}
        onKeyDown={handleKeyDown}
        ref={props.ref}
        {...applySemanticAttrs({
          scope: "menubar",
          part: "content",
          state: "open",
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}

export function Item(props: MenubarItemProps) {
  const handleClick = () => {
    if (!props.disabled) {
      props.onSelect?.()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !props.disabled) {
      e.preventDefault()
      props.onSelect?.()
    }
  }

  return (
    <div
      role="menuitem"
      class={props.class}
      tabindex={-1}
      aria-disabled={props.disabled ? "true" : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...applySemanticAttrs({
        scope: "menubar",
        part: "item",
        disabled: props.disabled,
      })}
    >
      {props.children}
    </div>
  )
}

export function Separator(props: MenubarSeparatorProps) {
  return (
    <div
      role="separator"
      class={props.class}
      {...applySemanticAttrs({ scope: "menubar", part: "separator" })}
    />
  )
}

export function SubMenu(props: MenubarSubMenuProps) {
  const subId = createStableId("menubar-sub")
  const subTriggerId = `${subId}-trigger`
  const subContentId = `${subId}-content`

  const { open, requestOpenChange } = createDisclosureState()

  const ctx: MenubarSubMenuContextValue = {
    open,
    requestOpenChange,
    subTriggerId,
    subContentId,
  }

  return (
    <MenubarSubMenuContext value={ctx}>
      <div {...applySemanticAttrs({ scope: "menubar", part: "sub-menu" })}>
        {props.children}
      </div>
    </MenubarSubMenuContext>
  )
}

export function SubTrigger(props: MenubarSubTriggerProps) {
  const subCtx = useMenubarSubMenuContext()

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      subCtx.requestOpenChange(true, createChangeDetails("trigger"))
    }
  }

  const handlePointerEnter = () => {
    subCtx.requestOpenChange(true, createChangeDetails("trigger"))
  }

  return (
    <div
      id={subCtx.subTriggerId}
      role="menuitem"
      class={props.class}
      tabindex={-1}
      aria-haspopup="menu"
      aria-expanded={subCtx.open() ? "true" : undefined}
      aria-controls={subCtx.open() ? subCtx.subContentId : undefined}
      onKeyDown={handleKeyDown}
      onPointerEnter={handlePointerEnter}
      {...applySemanticAttrs({
        scope: "menubar",
        part: "sub-trigger",
        state: subCtx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </div>
  )
}

export function SubContent(props: MenubarSubContentProps) {
  const subCtx = useMenubarSubMenuContext()

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "ArrowLeft") {
      e.preventDefault()
      subCtx.requestOpenChange(false, createChangeDetails("escape-key"))
    }
  }

  return (
    <Show when={subCtx.open()}>
      <div
        id={subCtx.subContentId}
        role="menu"
        aria-labelledby={subCtx.subTriggerId}
        class={props.class}
        style={props.style}
        onKeyDown={handleKeyDown}
        {...applySemanticAttrs({
          scope: "menubar",
          part: "sub-content",
          state: "open",
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}
