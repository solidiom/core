/**
 * Tabs primitive — tab selection with keyboard navigation, roving focus,
 * automatic/manual activation, and horizontal/vertical orientation.
 *
 * Parts: Root, List, Trigger, Content.
 */

import { type Accessor, onCleanup, Show } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createControllableValue,
  createCollection,
  createRovingFocus,
  createStableId,
  createChangeDetails,
  applySemanticAttrs,
  resolveNavigationIntent,
  resolveNextItem,
  type ChangeDetails,
  type CollectionItem,
} from "@solidiom/runtime"
import {
  TabsContext,
  useTabsContext,
  type TabsContextValue,
  type TabsReason,
  type ActivationMode,
} from "./tabs-context"

// ─── Root ──────────────────────────────────────────────────────────────────────

/** Props for the tabs root container. */
export interface TabsRootProps {
  /** Controlled active tab value. */
  value?: Accessor<string>
  /** Default active tab for uncontrolled mode. */
  defaultValue?: string
  /** Called when active tab changes. */
  onValueChange?: (value: string, details: ChangeDetails<TabsReason>) => void
  /** Orientation: "horizontal" (default) or "vertical". */
  orientation?: "horizontal" | "vertical"
  /** Activation mode: "automatic" (default) activates on focus, "manual" on Enter/Space. */
  activationMode?: ActivationMode
  children: JSX.Element
}

/** Root container that provides tabs state context. */
export function Root(props: TabsRootProps) {
  const orientation = props.orientation ?? "horizontal"
  const activationMode = props.activationMode ?? "automatic"
  const baseId = createStableId("tabs")

  const { value, requestChange } = createControllableValue<string, TabsReason>({
    value: props.value,
    defaultValue: props.defaultValue ?? "",
    onChange: props.onValueChange,
  })

  const collection = createCollection({
    orientation: () => (orientation === "horizontal" ? "horizontal" : "vertical"),
  })

  const rovingFocus = createRovingFocus()

  const ctx: TabsContextValue = {
    value,
    requestValueChange: requestChange,
    orientation: () => orientation,
    activationMode,
    collection,
    rovingFocus,
    baseId,
  }

  return (
    <TabsContext value={ctx}>
      <div
        {...applySemanticAttrs({
          scope: "tabs",
          part: "root",
          orientation,
        })}
      >
        {props.children}
      </div>
    </TabsContext>
  )
}

// ─── List ──────────────────────────────────────────────────────────────────────

/** Props for the tab list container. */
export interface TabsListProps {
  children: JSX.Element
  class?: string
  ref?: (el: HTMLDivElement) => void
}

/** Container for tab triggers with tablist role. */
export function List(props: TabsListProps) {
  const ctx = useTabsContext()

  const handleKeyDown = (e: KeyboardEvent) => {
    const intent = resolveNavigationIntent(e.key, {
      orientation: ctx.orientation(),
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
      if (next) {
        ctx.rovingFocus.setActiveId(next.id)
        if (next.ref) {
          ;(next.ref as HTMLElement).focus()
        }
        // Automatic activation: select on focus
        if (ctx.activationMode === "automatic") {
          ctx.requestValueChange(next.textValue(), createChangeDetails("keyboard"))
        }
      }
      return
    }

    // Manual activation: Enter/Space selects focused tab
    if (ctx.activationMode === "manual" && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault()
      const activeId = ctx.rovingFocus.activeId()
      if (activeId) {
        const item = ctx.collection.getItem(activeId)
        if (item) {
          ctx.requestValueChange(item.textValue(), createChangeDetails("keyboard"))
        }
      }
    }
  }

  return (
    <div
      role="tablist"
      aria-orientation={ctx.orientation()}
      onKeyDown={handleKeyDown}
      class={props.class}
      ref={props.ref}
      {...applySemanticAttrs({
        scope: "tabs",
        part: "list",
        orientation: ctx.orientation(),
      })}
    >
      {props.children}
    </div>
  )
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

/** Props for an individual tab trigger button. */
export interface TabsTriggerProps {
  /** Value identifying this tab. Must match a Content's value. */
  value: string
  /** Whether this tab trigger is disabled. */
  disabled?: boolean
  children: JSX.Element
  ref?: (el: HTMLButtonElement) => void
}

/** Tab button that activates its corresponding content panel. */
export function Trigger(props: TabsTriggerProps) {
  const ctx = useTabsContext()
  const itemId = createStableId("tabs-trigger")

  const collectionItem: CollectionItem = {
    id: itemId,
    disabled: () => props.disabled ?? false,
    textValue: () => props.value,
  }

  const cleanup = ctx.collection.registerItem(collectionItem)
  onCleanup(cleanup)

  const isSelected = () => ctx.value() === props.value
  const panelId = () => `${ctx.baseId}-content-${props.value}`

  const handleClick = () => {
    if (props.disabled) return
    ctx.rovingFocus.setActiveId(itemId, false)
    ctx.requestValueChange(props.value, createChangeDetails("trigger-click"))
  }

  const handleFocus = () => {
    ctx.rovingFocus.setActiveId(itemId, false)
  }

  return (
    <button
      id={`${ctx.baseId}-trigger-${props.value}`}
      role="tab"
      aria-selected={isSelected() ? "true" : "false"}
      aria-controls={panelId()}
      disabled={props.disabled}
      tabindex={ctx.rovingFocus.getTabIndex(itemId)}
      onClick={handleClick}
      onFocus={handleFocus}
      ref={(el: HTMLButtonElement) => {
        collectionItem.ref = el
        props.ref?.(el)
      }}
      {...applySemanticAttrs({
        scope: "tabs",
        part: "trigger",
        state: isSelected() ? "active" : "inactive",
        disabled: props.disabled,
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Content ───────────────────────────────────────────────────────────────────

/** Props for a tab content panel. */
export interface TabsContentProps {
  /** Value identifying this panel. Must match a Trigger's value. */
  value: string
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

/** Tab panel content that is shown when its corresponding trigger is active. */
export function Content(props: TabsContentProps) {
  const ctx = useTabsContext()

  const isSelected = () => ctx.value() === props.value
  const triggerId = () => `${ctx.baseId}-trigger-${props.value}`

  return (
    <Show when={isSelected()}>
      <div
        id={`${ctx.baseId}-content-${props.value}`}
        role="tabpanel"
        aria-labelledby={triggerId()}
        tabindex={0}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "tabs",
          part: "content",
          state: "active",
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}
