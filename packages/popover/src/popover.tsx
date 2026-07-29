/**
 * Popover primitive — dismissable floating panel with focus trapping,
 * outside-click/escape dismissal, positioning port, and presence phases.
 *
 * Parts: Root, Trigger, Content, Close, Anchor.
 */

import { type Accessor, createSignal, createEffect, Show } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createDisclosureState,
  createStableId,
  createPresence,
  applySemanticAttrs,
  getLayerStack,
  setupDismissableLayer,
  activateFocusScope,
  createChangeDetails,
  type ChangeDetails,
  type DisclosureReason,
} from "@solidiom/runtime"
import {
  PopoverContext,
  usePopoverContext,
  type PopoverContextValue,
  type PositioningPort,
} from "./popover-context"

// ─── Root ──────────────────────────────────────────────────────────────────────

/** Props for the popover root provider. */
export interface PopoverRootProps {
  /** Controlled open state. */
  open?: Accessor<boolean>
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean
  /** Called when open state change is requested. */
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Whether the popover is modal (traps focus). Default: false. */
  modal?: boolean
  /** Positioning adapter for floating placement. */
  positioning?: PositioningPort
  children: JSX.Element
}

/** Root provider that manages popover open state and context. */
export function Root(props: PopoverRootProps) {
  const modal = props.modal ?? false
  const baseId = createStableId("popover")

  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
  })

  const presence = createPresence({ open })

  const [anchorRef, setAnchorRef] = createSignal<HTMLElement | undefined>(undefined)
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement | undefined>(undefined)

  const ctx: PopoverContextValue = {
    open,
    requestOpenChange,
    triggerId: `${baseId}-trigger`,
    contentId: `${baseId}-content`,
    phase: presence.phase,
    present: presence.present,
    modal,
    positioning: props.positioning,
    anchorRef: () => anchorRef() ?? triggerRef(),
    setAnchorRef,
    setTriggerRef,
    triggerRef,
  }

  return <PopoverContext value={ctx}>{props.children}</PopoverContext>
}

// ─── Anchor ────────────────────────────────────────────────────────────────────

/** Props for the popover anchor element. */
export interface PopoverAnchorProps {
  children: JSX.Element
  ref?: (el: HTMLElement) => void
}

/** Optional anchor element that overrides the trigger as positioning reference. */
export function Anchor(props: PopoverAnchorProps) {
  const ctx = usePopoverContext()

  return (
    <div
      ref={(el: HTMLDivElement) => {
        ctx.setAnchorRef(el)
        props.ref?.(el)
      }}
      {...applySemanticAttrs({
        scope: "popover",
        part: "anchor",
      })}
    >
      {props.children}
    </div>
  )
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

/** Props for the popover trigger button. */
export interface PopoverTriggerProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLButtonElement) => void
}

/** Button that toggles the popover open state. */
export function Trigger(props: PopoverTriggerProps) {
  const ctx = usePopoverContext()

  const handleClick = () => {
    ctx.requestOpenChange(!ctx.open(), createChangeDetails("trigger"))
  }

  return (
    <button
      id={ctx.triggerId}
      aria-haspopup="dialog"
      aria-expanded={ctx.open() ? "true" : undefined}
      aria-controls={ctx.open() ? ctx.contentId : undefined}
      onClick={handleClick}
      class={props.class}
      style={props.style}
      ref={(el: HTMLButtonElement) => {
        ctx.setTriggerRef(el)
        props.ref?.(el)
      }}
      {...applySemanticAttrs({
        scope: "popover",
        part: "trigger",
        state: ctx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </button>
  )
}

// ─── Content ───────────────────────────────────────────────────────────────────

/** Props for the popover content panel. */
export interface PopoverContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLDivElement) => void
  /** Disable focus trapping. Default: true (trapping enabled when modal). */
  trapFocus?: boolean
}

/** Floating content panel with dismiss behavior and optional focus trapping. */
export function Content(props: PopoverContentProps) {
  const ctx = usePopoverContext()
  const shouldTrapFocus = () => props.trapFocus ?? ctx.modal

  const [contentEl, setContentEl] = createSignal<HTMLDivElement | undefined>(undefined)

  createEffect(
    () => (ctx.present() ? contentEl() : undefined),
    (el) => {
      if (!el) return
      const doc = el.ownerDocument

      // Register layer
      const stack = getLayerStack(doc)
      const removeLayer = stack.push({
        id: ctx.contentId,
        element: el,
        modal: ctx.modal,
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

      // Focus scope (only when trapping)
      const deactivateFocus = shouldTrapFocus()
        ? activateFocusScope({
            element: () => el,
            restoreTarget: () => ctx.triggerRef() as HTMLElement | undefined,
          })
        : () => {}

      // Positioning
      let cleanupPositioning: (() => void) | undefined
      const reference = ctx.anchorRef()
      if (ctx.positioning && reference && el) {
        const result = ctx.positioning.update(reference, el)
        if (typeof result === "function") {
          cleanupPositioning = result
        }
      }

      return () => {
        cleanupPositioning?.()
        deactivateFocus()
        removeDismissable()
        removeLayer()
      }
    },
  )

  return (
    <Show when={ctx.present()}>
      <div
        id={ctx.contentId}
        role="dialog"
        aria-modal={ctx.modal ? "true" : undefined}
        ref={(el: HTMLDivElement) => {
          setContentEl(el)
          props.ref?.(el)
        }}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "popover",
          part: "content",
          state: ctx.open() ? "open" : "closed",
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}

// ─── Close ─────────────────────────────────────────────────────────────────────

/** Props for the popover close button. */
export interface PopoverCloseProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLButtonElement) => void
}

/** Button that closes the popover. */
export function Close(props: PopoverCloseProps) {
  const ctx = usePopoverContext()

  const handleClick = () => {
    ctx.requestOpenChange(false, createChangeDetails("close"))
  }

  return (
    <button
      onClick={handleClick}
      class={props.class}
      style={props.style}
      ref={props.ref}
      {...applySemanticAttrs({ scope: "popover", part: "close" })}
    >
      {props.children}
    </button>
  )
}
