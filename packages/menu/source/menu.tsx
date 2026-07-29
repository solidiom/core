/**
 * Menu primitive — trigger + dismissable menu panel with keyboard navigation,
 * typeahead, focus trapping, and context menu support.
 *
 * Parts: Root, Trigger, Content, Item, Separator.
 */

import {
  type Accessor,
  Show,
  createSignal,
  createEffect,
  createContext,
  useContext,
  onCleanup,
  untrack,
} from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createDisclosureState,
  createCollection,
  createRovingFocus,
  createTypeahead,
  createStableId,
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
import { MenuContext, useMenuContext, type MenuContextValue } from "./menu-context"

interface MenuCollectionItem extends CollectionItem {
  activate?: () => void
}

// ─── Root ──────────────────────────────────────────────────────────────────────

/** Props for the menu root provider. */
export interface MenuRootProps {
  /** Controlled open state. */
  open?: Accessor<boolean>
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean
  /** Called when open state change is requested. */
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  children: JSX.Element
}

/** Root provider that manages menu open state and context. */
export function Root(props: MenuRootProps) {
  const baseId = createStableId("menu")
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement | undefined>(undefined)

  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
  })

  const collection = createCollection()
  const rovingFocus = createRovingFocus()
  const typeahead = createTypeahead({
    onMatch: (item) => {
      rovingFocus.setActiveId(item.id)
    },
  })

  const activateItem = (itemId: string) => {
    const item = collection.getItem(itemId) as MenuCollectionItem | undefined
    if (!item || item.disabled()) return
    item.activate?.()
    requestOpenChange(false, createChangeDetails("trigger"))
  }

  const ctx: MenuContextValue = {
    open,
    requestOpenChange,
    collection,
    rovingFocus,
    typeahead,
    triggerId: `${baseId}-trigger`,
    contentId: `${baseId}-content`,
    activateItem,
    triggerRef,
    setTriggerRef,
  }

  return <MenuContext value={ctx}>{props.children}</MenuContext>
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

/** Props for the menu trigger button. */
export interface MenuTriggerProps {
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
  /** Enable context menu (right-click) activation. */
  contextMenu?: boolean
}

/** Button that toggles the menu open state. */
export function Trigger(props: MenuTriggerProps) {
  const ctx = useMenuContext()

  const handleClick = () => {
    if (props.contextMenu) return
    ctx.requestOpenChange(!ctx.open(), createChangeDetails("trigger"))
  }

  const handleContextMenu = (e: MouseEvent) => {
    if (!props.contextMenu) return
    e.preventDefault()
    ctx.requestOpenChange(true, createChangeDetails("trigger"))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (props.contextMenu) return
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (!ctx.open()) {
        ctx.requestOpenChange(true, createChangeDetails("trigger"))
      }
    }
  }

  return (
    <button
      id={ctx.triggerId}
      aria-haspopup="menu"
      aria-expanded={ctx.open() ? "true" : undefined}
      aria-controls={ctx.open() ? ctx.contentId : undefined}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      ref={(el: HTMLButtonElement) => {
        ctx.setTriggerRef(el)
        props.ref?.(el)
      }}
      {...applySemanticAttrs({
        scope: "menu",
        part: "trigger",
        state: ctx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Content ───────────────────────────────────────────────────────────────────

/** Props for the menu content panel. */
export interface MenuContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLDivElement) => void
}

/** Menu content panel with dismiss behavior, focus trapping, and keyboard navigation. */
export function Content(props: MenuContentProps) {
  const ctx = useMenuContext()
  const [contentEl, setContentEl] = createSignal<HTMLDivElement | undefined>(undefined)

  createEffect(
    () => (ctx.open() ? contentEl() : undefined),
    (el) => {
      if (!el) return
      const doc = el.ownerDocument

      // Register layer
      const stack = getLayerStack(doc)
      const removeLayer = stack.push({
        id: ctx.contentId,
        element: el,
        modal: true,
      })

      // Dismissable layer
      const removeDismissable = setupDismissableLayer({
        document: doc,
        layerId: ctx.contentId,
        element: () => el,
        excludeElements: () => {
          const trigger = doc.getElementById(ctx.triggerId)
          return trigger ? [trigger] : []
        },
        onDismiss: (reason) => {
          ctx.requestOpenChange(false, createChangeDetails(reason))
        },
      })

      // Focus trapping
      const deactivateFocus = activateFocusScope({
        element: () => el,
        restoreTarget: () => ctx.triggerRef() as HTMLElement | undefined,
      })

      // Focus first enabled item
      const items = untrack(() => ctx.collection.enabledItems())
      if (items.length > 0) {
        ctx.rovingFocus.setActiveId(items[0]!.id)
      }

      return () => {
        deactivateFocus()
        removeDismissable()
        removeLayer()
      }
    },
  )

  const handleKeyDown = (e: KeyboardEvent) => {
    const intent = resolveNavigationIntent(e.key, {
      orientation: "vertical",
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

    // Home/End
    if (e.key === "Home") {
      e.preventDefault()
      const items = ctx.collection.enabledItems()
      if (items.length > 0) ctx.rovingFocus.setActiveId(items[0]!.id)
      return
    }
    if (e.key === "End") {
      e.preventDefault()
      const items = ctx.collection.enabledItems()
      if (items.length > 0) ctx.rovingFocus.setActiveId(items[items.length - 1]!.id)
      return
    }

    // Enter/Space activates item
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const activeId = ctx.rovingFocus.activeId()
      if (activeId) ctx.activateItem(activeId)
      return
    }

    // Typeahead
    ctx.typeahead.handle(e.key, ctx.collection.items(), ctx.rovingFocus.activeId())
  }

  return (
    <Show when={ctx.open()}>
      <div
        id={ctx.contentId}
        role="menu"
        aria-labelledby={ctx.triggerId}
        tabindex={0}
        onKeyDown={handleKeyDown}
        ref={(el: HTMLDivElement) => {
          setContentEl(el)
          props.ref?.(el)
        }}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "menu",
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

/** Props for a menu item. */
export interface MenuItemProps {
  /** Text for typeahead matching. */
  textValue?: string
  /** Disabled state. */
  disabled?: boolean
  /** Called when the item is activated. */
  onSelect?: () => void
  children: JSX.Element
}

/** Individual menu item with keyboard activation and disabled state support. */
export function Item(props: MenuItemProps) {
  const ctx = useMenuContext()
  const itemId = createStableId("menu-item")

  const item: MenuCollectionItem = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? "",
    activate: () => props.onSelect?.(),
  }

  const cleanup = ctx.collection.registerItem(item)
  onCleanup(cleanup)

  const isHighlighted = () => ctx.rovingFocus.activeId() === itemId

  const handleClick = () => {
    if (props.disabled) return
    props.onSelect?.()
    ctx.requestOpenChange(false, createChangeDetails("trigger"))
  }

  const handlePointerMove = () => {
    if (props.disabled) return
    ctx.rovingFocus.setActiveId(itemId)
  }

  return (
    <div
      id={itemId}
      role="menuitem"
      tabindex={isHighlighted() ? 0 : -1}
      aria-disabled={props.disabled ? "true" : undefined}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      {...applySemanticAttrs({
        scope: "menu",
        part: "item",
        disabled: props.disabled,
        highlighted: isHighlighted(),
      })}
    >
      {props.children}
    </div>
  )
}

// ─── Separator ─────────────────────────────────────────────────────────────────

/** Props for a menu separator. */
export interface MenuSeparatorProps {
  class?: string
}

/** Visual separator between menu items. */
export function Separator(props: MenuSeparatorProps) {
  return (
    <div
      role="separator"
      class={props.class}
      {...applySemanticAttrs({ scope: "menu", part: "separator" })}
    />
  )
}

// ─── CheckboxItem ──────────────────────────────────────────────────────────────

/** Props for a menu checkbox item. */
export interface MenuCheckboxItemProps {
  /** Whether the item is checked. */
  checked?: boolean
  /** Called when checked state changes. */
  onCheckedChange?: (checked: boolean) => void
  /** Text for typeahead matching. */
  textValue?: string
  /** Disabled state. */
  disabled?: boolean
  children: JSX.Element
}

/** Menu item that toggles a boolean checked state (role=menuitemcheckbox). */
export function CheckboxItem(props: MenuCheckboxItemProps) {
  const ctx = useMenuContext()
  const itemId = createStableId("menu-checkbox")

  const item: MenuCollectionItem = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? "",
    activate: () => {
      if (props.disabled) return
      props.onCheckedChange?.(!props.checked)
    },
  }

  const cleanup = ctx.collection.registerItem(item)
  onCleanup(cleanup)

  const isHighlighted = () => ctx.rovingFocus.activeId() === itemId

  const handleClick = () => {
    if (props.disabled) return
    props.onCheckedChange?.(!props.checked)
    // Don't close the menu for checkbox items
  }

  const handlePointerMove = () => {
    if (props.disabled) return
    ctx.rovingFocus.setActiveId(itemId)
  }

  return (
    <div
      id={itemId}
      role="menuitemcheckbox"
      aria-checked={props.checked ? "true" : "false"}
      tabindex={isHighlighted() ? 0 : -1}
      aria-disabled={props.disabled ? "true" : undefined}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      {...applySemanticAttrs({
        scope: "menu",
        part: "checkbox-item",
        state: props.checked ? "checked" : "unchecked",
        disabled: props.disabled,
        highlighted: isHighlighted(),
      })}
    >
      {props.children}
    </div>
  )
}

// ─── RadioGroup ────────────────────────────────────────────────────────────────

/** Props for a menu radio group. */
export interface MenuRadioGroupProps {
  /** Current selected value. */
  value?: string
  /** Called when the selected value changes. */
  onValueChange?: (value: string) => void
  children: JSX.Element
}

const MenuRadioGroupContext = createContext<{
  value: string | undefined
  onValueChange: ((value: string) => void) | undefined
}>()

/** Groups radio items within a menu for single-selection. */
export function RadioGroup(props: MenuRadioGroupProps) {
  return (
    <MenuRadioGroupContext value={{ value: props.value, onValueChange: props.onValueChange }}>
      <div role="group" {...applySemanticAttrs({ scope: "menu", part: "radio-group" })}>
        {props.children}
      </div>
    </MenuRadioGroupContext>
  )
}

// ─── RadioItem ─────────────────────────────────────────────────────────────────

/** Props for a menu radio item. */
export interface MenuRadioItemProps {
  /** The value this item represents. */
  value: string
  /** Text for typeahead matching. */
  textValue?: string
  /** Disabled state. */
  disabled?: boolean
  children: JSX.Element
}

/** Menu item that acts as a radio button within a RadioGroup (role=menuitemradio). */
export function RadioItem(props: MenuRadioItemProps) {
  const ctx = useMenuContext()
  const radioCtx = useContext(MenuRadioGroupContext)
  const itemId = createStableId("menu-radio")

  const isChecked = () => radioCtx?.value === props.value

  const item: MenuCollectionItem = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? "",
    activate: () => {
      if (props.disabled) return
      radioCtx?.onValueChange?.(props.value)
    },
  }

  const cleanup = ctx.collection.registerItem(item)
  onCleanup(cleanup)

  const isHighlighted = () => ctx.rovingFocus.activeId() === itemId

  const handleClick = () => {
    if (props.disabled) return
    radioCtx?.onValueChange?.(props.value)
    // Don't close the menu for radio items
  }

  const handlePointerMove = () => {
    if (props.disabled) return
    ctx.rovingFocus.setActiveId(itemId)
  }

  return (
    <div
      id={itemId}
      role="menuitemradio"
      aria-checked={isChecked() ? "true" : "false"}
      tabindex={isHighlighted() ? 0 : -1}
      aria-disabled={props.disabled ? "true" : undefined}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      {...applySemanticAttrs({
        scope: "menu",
        part: "radio-item",
        state: isChecked() ? "checked" : "unchecked",
        disabled: props.disabled,
        highlighted: isHighlighted(),
      })}
    >
      {props.children}
    </div>
  )
}

// ─── Label ─────────────────────────────────────────────────────────────────────

/** Props for a menu label (non-interactive group heading). */
export interface MenuLabelProps {
  class?: string
  children: JSX.Element
}

/** Non-interactive label/heading for a group of menu items. */
export function Label(props: MenuLabelProps) {
  return (
    <div class={props.class} {...applySemanticAttrs({ scope: "menu", part: "label" })}>
      {props.children}
    </div>
  )
}

// ─── Sub ───────────────────────────────────────────────────────────────────────

/** Props for a sub-menu container. */
export interface MenuSubProps {
  children: JSX.Element
}

const MenuSubContext = createContext<{
  open: Accessor<boolean>
  setOpen: (open: boolean) => void
  subContentId: string
  subTriggerId: string
}>()

/** Sub-menu provider — manages open state for a nested menu. */
export function Sub(props: MenuSubProps) {
  const [open, setOpen] = createSignal(false)
  const subContentId = createStableId("menu-sub-content")
  const subTriggerId = createStableId("menu-sub-trigger")

  return (
    <MenuSubContext value={{ open, setOpen, subContentId, subTriggerId }}>
      {props.children}
    </MenuSubContext>
  )
}

// ─── SubTrigger ────────────────────────────────────────────────────────────────

/** Props for a sub-menu trigger. */
export interface MenuSubTriggerProps {
  /** Text for typeahead matching. */
  textValue?: string
  /** Disabled state. */
  disabled?: boolean
  children: JSX.Element
}

/** Menu item that opens a sub-menu on hover/ArrowRight. */
export function SubTrigger(props: MenuSubTriggerProps) {
  const ctx = useMenuContext()
  const subCtx = useContext(MenuSubContext)
  const itemId = createStableId("menu-sub-trigger-item")

  const item: MenuCollectionItem = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.textValue ?? "",
    activate: () => {
      if (props.disabled) return
      subCtx?.setOpen(true)
    },
  }

  const cleanup = ctx.collection.registerItem(item)
  onCleanup(cleanup)

  const isHighlighted = () => ctx.rovingFocus.activeId() === itemId

  const handlePointerEnter = () => {
    if (props.disabled) return
    ctx.rovingFocus.setActiveId(itemId)
    subCtx?.setOpen(true)
  }

  const handlePointerLeave = () => {
    subCtx?.setOpen(false)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      subCtx?.setOpen(true)
    }
  }

  return (
    <div
      id={subCtx?.subTriggerId ?? itemId}
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={subCtx?.open() ? "true" : undefined}
      aria-controls={subCtx?.open() ? subCtx.subContentId : undefined}
      tabindex={isHighlighted() ? 0 : -1}
      aria-disabled={props.disabled ? "true" : undefined}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      {...applySemanticAttrs({
        scope: "menu",
        part: "sub-trigger",
        state: subCtx?.open() ? "open" : "closed",
        disabled: props.disabled,
        highlighted: isHighlighted(),
      })}
    >
      {props.children}
    </div>
  )
}

// ─── SubContent ────────────────────────────────────────────────────────────────

/** Props for a sub-menu content panel. */
export interface MenuSubContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

/** Sub-menu content panel — rendered when the SubTrigger is activated. */
export function SubContent(props: MenuSubContentProps) {
  const subCtx = useContext(MenuSubContext)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "Escape") {
      e.preventDefault()
      e.stopPropagation()
      subCtx?.setOpen(false)
    }
  }

  return (
    <Show when={subCtx?.open()}>
      <div
        id={subCtx?.subContentId}
        role="menu"
        onKeyDown={handleKeyDown}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "menu",
          part: "sub-content",
          state: "open",
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}
