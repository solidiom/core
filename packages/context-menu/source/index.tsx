/**
 * @solidiom/context-menu — Right-click triggered menu.
 * Parts: Root, Trigger, Content, Item, CheckboxItem, RadioGroup, RadioItem, Separator, Label.
 */

import {
  type Accessor,
  Show,
  createSignal,
  createEffect,
  createContext,
  useContext,
  onCleanup,
} from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createCollection,
  createRovingFocus,
  createTypeahead,
  createStableId,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  resolveNavigationIntent,
  resolveNextItem,
  type CollectionItem,
} from "@solidiom/runtime"

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ContextMenuCollectionItem extends CollectionItem {
  activate?: () => void
}

export interface ContextMenuRootProps {
  children: JSX.Element
}

export interface ContextMenuTriggerProps {
  children: JSX.Element
  class?: string
}

export interface ContextMenuContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface ContextMenuItemProps {
  textValue?: string
  disabled?: boolean
  onSelect?: () => void
  children: JSX.Element
}

export interface ContextMenuCheckboxItemProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  textValue?: string
  disabled?: boolean
  children: JSX.Element
}

export interface ContextMenuRadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  children: JSX.Element
}

export interface ContextMenuRadioItemProps {
  value: string
  textValue?: string
  disabled?: boolean
  children: JSX.Element
}

export interface ContextMenuSeparatorProps {
  class?: string
}

export interface ContextMenuLabelProps {
  class?: string
  children: JSX.Element
}

// ─── Context ───────────────────────────────────────────────────────────────────

interface ContextMenuContextValue {
  open: Accessor<boolean>
  setOpen: (open: boolean) => void
  collection: ReturnType<typeof createCollection>
  rovingFocus: ReturnType<typeof createRovingFocus>
  typeahead: ReturnType<typeof createTypeahead>
  triggerId: string
  contentId: string
}

const ContextMenuContext = createContext<ContextMenuContextValue>()

function useContextMenuContext(): ContextMenuContextValue {
  const ctx = useContext(ContextMenuContext)
  if (!ctx) throw new Error("ContextMenu parts must be used within ContextMenu.Root")
  return ctx
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export function Root(props: ContextMenuRootProps) {
  const baseId = createStableId("context-menu")
  const [open, setOpen] = createSignal(false)

  const collection = createCollection()
  const rovingFocus = createRovingFocus()
  const typeahead = createTypeahead({
    onMatch: (item) => {
      rovingFocus.setActiveId(item.id)
    },
  })

  const ctx: ContextMenuContextValue = {
    open,
    setOpen,
    collection,
    rovingFocus,
    typeahead,
    triggerId: `${baseId}-trigger`,
    contentId: `${baseId}-content`,
  }

  return <ContextMenuContext value={ctx}>{props.children}</ContextMenuContext>
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

export function Trigger(props: ContextMenuTriggerProps) {
  const ctx = useContextMenuContext()

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    ctx.setOpen(true)
  }

  return (
    <span
      id={ctx.triggerId}
      class={props.class}
      onContextMenu={handleContextMenu}
      {...applySemanticAttrs({
        scope: "context-menu",
        part: "trigger",
        state: ctx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </span>
  )
}

// ─── Content ───────────────────────────────────────────────────────────────────

export function Content(props: ContextMenuContentProps) {
  const ctx = useContextMenuContext()
  const [contentEl, setContentEl] = createSignal<HTMLDivElement | undefined>(undefined)

  createEffect(
    () => (ctx.open() ? contentEl() : undefined),
    (el) => {
      if (!el) return
      const doc = el.ownerDocument

      const stack = getLayerStack(doc)
      const removeLayer = stack.push({
        id: ctx.contentId,
        element: el,
        modal: true,
      })

      const removeDismissable = setupDismissableLayer({
        document: doc,
        layerId: ctx.contentId,
        element: () => el,
        excludeElements: () => {
          const trigger = doc.getElementById(ctx.triggerId)
          return trigger ? [trigger] : []
        },
        onDismiss: () => {
          ctx.setOpen(false)
        },
      })

      const items = ctx.collection.enabledItems()
      if (items.length > 0) {
        ctx.rovingFocus.setActiveId(items[0]!.id)
      }

      return () => {
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

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const activeId = ctx.rovingFocus.activeId()
      if (activeId) {
        const item = ctx.collection.getItem(activeId) as ContextMenuCollectionItem | undefined
        if (item && !item.disabled()) {
          item.activate?.()
          ctx.setOpen(false)
        }
      }
      return
    }

    if (e.key === "Escape") {
      e.preventDefault()
      ctx.setOpen(false)
      return
    }

    ctx.typeahead.handle(e.key, ctx.collection.items(), ctx.rovingFocus.activeId())
  }

  return (
    <Show when={ctx.open()}>
      <div
        id={ctx.contentId}
        role="menu"
        tabindex={0}
        onKeyDown={handleKeyDown}
        ref={(el: HTMLDivElement) => {
          setContentEl(el)
        }}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "context-menu",
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

export function Item(props: ContextMenuItemProps) {
  const ctx = useContextMenuContext()
  const itemId = createStableId("context-menu-item")

  const item: ContextMenuCollectionItem = {
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
    ctx.setOpen(false)
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
        scope: "context-menu",
        part: "item",
        disabled: props.disabled,
        highlighted: isHighlighted(),
      })}
    >
      {props.children}
    </div>
  )
}

// ─── CheckboxItem ──────────────────────────────────────────────────────────────

export function CheckboxItem(props: ContextMenuCheckboxItemProps) {
  const ctx = useContextMenuContext()
  const itemId = createStableId("context-menu-checkbox")

  const item: ContextMenuCollectionItem = {
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
        scope: "context-menu",
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

const ContextMenuRadioGroupContext = createContext<{
  value: string | undefined
  onValueChange: ((value: string) => void) | undefined
}>()

export function RadioGroup(props: ContextMenuRadioGroupProps) {
  return (
    <ContextMenuRadioGroupContext
      value={{ value: props.value, onValueChange: props.onValueChange }}
    >
      <div role="group" {...applySemanticAttrs({ scope: "context-menu", part: "radio-group" })}>
        {props.children}
      </div>
    </ContextMenuRadioGroupContext>
  )
}

// ─── RadioItem ─────────────────────────────────────────────────────────────────

export function RadioItem(props: ContextMenuRadioItemProps) {
  const ctx = useContextMenuContext()
  const radioCtx = useContext(ContextMenuRadioGroupContext)
  const itemId = createStableId("context-menu-radio")

  const isChecked = () => radioCtx?.value === props.value

  const item: ContextMenuCollectionItem = {
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
        scope: "context-menu",
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

// ─── Separator ─────────────────────────────────────────────────────────────────

export function Separator(props: ContextMenuSeparatorProps) {
  return (
    <div
      role="separator"
      class={props.class}
      {...applySemanticAttrs({ scope: "context-menu", part: "separator" })}
    />
  )
}

// ─── Label ─────────────────────────────────────────────────────────────────────

export function Label(props: ContextMenuLabelProps) {
  return (
    <div class={props.class} {...applySemanticAttrs({ scope: "context-menu", part: "label" })}>
      {props.children}
    </div>
  )
}
