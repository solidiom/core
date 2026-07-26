/**
 * @solidiom/collapsible — Headless collapsible primitive with disclosure state.
 *
 * Parts: Root, Trigger, Content.
 */

import { type Accessor, createContext, useContext, Show } from "solid-js"
import { type JSX } from "@solidjs/web"
import { createDisclosureState, createStableId, applySemanticAttrs } from "@solidiom/runtime"

interface CollapsibleContextValue {
  open: Accessor<boolean>
  toggle: () => void
  disabled: () => boolean
  triggerId: string
  contentId: string
}

const CollapsibleContext = createContext<CollapsibleContextValue>()

function useCollapsibleContext(): CollapsibleContextValue {
  const ctx = useContext(CollapsibleContext)
  if (!ctx) throw new Error("Collapsible parts must be used within Root")
  return ctx
}

export interface CollapsibleRootProps {
  open?: Accessor<boolean>
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  children: JSX.Element
}

export function Root(props: CollapsibleRootProps) {
  const baseId = createStableId("collapsible")
  const disabled = () => props.disabled ?? false

  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: (v, _d) => props.onOpenChange?.(v),
    disabled,
  })

  const toggle = () => {
    if (disabled()) return
    requestOpenChange(!open(), { reason: "trigger" } as any)
  }

  const ctx: CollapsibleContextValue = {
    open,
    toggle,
    disabled,
    triggerId: `${baseId}-trigger`,
    contentId: `${baseId}-content`,
  }

  return (
    <CollapsibleContext value={ctx}>
      <div
        {...applySemanticAttrs({
          scope: "collapsible",
          part: "root",
          state: open() ? "open" : "closed",
          disabled: props.disabled,
        })}
      >
        {props.children}
      </div>
    </CollapsibleContext>
  )
}

export interface CollapsibleTriggerProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export function Trigger(props: CollapsibleTriggerProps) {
  const ctx = useCollapsibleContext()

  return (
    <button
      id={ctx.triggerId}
      aria-expanded={ctx.open() ? "true" : "false"}
      aria-controls={ctx.contentId}
      aria-disabled={ctx.disabled() ? "true" : undefined}
      onClick={() => ctx.toggle()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "collapsible",
        part: "trigger",
        state: ctx.open() ? "open" : "closed",
        disabled: ctx.disabled(),
      })}
    >
      {props.children}
    </button>
  )
}

export interface CollapsibleContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export function Content(props: CollapsibleContentProps) {
  const ctx = useCollapsibleContext()

  return (
    <Show when={ctx.open()}>
      <div
        id={ctx.contentId}
        role="region"
        aria-labelledby={ctx.triggerId}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({ scope: "collapsible", part: "content", state: "open" })}
      >
        {props.children}
      </div>
    </Show>
  )
}
