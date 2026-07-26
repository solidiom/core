/**
 * Tooltip primitive — hover/focus tooltip with configurable open/close delays,
 * escape dismissal, positioning port, and presence phases.
 *
 * Parts: Root, Trigger, Content.
 */

import { type Accessor, Show, createSignal, onCleanup, onSettled } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  createDisclosureState,
  createStableId,
  createPresence,
  applySemanticAttrs,
  createChangeDetails,
  type ChangeDetails,
  type DisclosureReason,
} from "@solidiom/runtime"
import {
  TooltipContext,
  useTooltipContext,
  type TooltipContextValue,
  type PositioningPort,
} from "./tooltip-context"

// ─── Root ──────────────────────────────────────────────────────────────────────

/** Props for the tooltip root provider. */
export interface TooltipRootProps {
  /** Controlled open state. */
  open?: Accessor<boolean>
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean
  /** Called when open state change is requested. */
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Delay in ms before opening on hover. Default: 700. */
  openDelay?: number
  /** Delay in ms before closing on mouseleave. Default: 300. */
  closeDelay?: number
  /** Positioning adapter for floating placement. */
  positioning?: PositioningPort
  children: JSX.Element
}

/** Root provider that manages tooltip open state and context. */
export function Root(props: TooltipRootProps) {
  const baseId = createStableId("tooltip")

  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
  })

  const presence = createPresence({ open })
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement | undefined>(undefined)

  const ctx: TooltipContextValue = {
    open,
    requestOpenChange,
    triggerId: `${baseId}-trigger`,
    contentId: `${baseId}-content`,
    phase: presence.phase,
    present: presence.present,
    positioning: props.positioning,
    triggerRef,
    setTriggerRef,
  }

  // Expose delays as stable values for child components via closure
  const openDelay = props.openDelay ?? 700
  const closeDelay = props.closeDelay ?? 300

  return (
    <TooltipDelayContext open={openDelay} close={closeDelay}>
      <TooltipContext value={ctx}>{props.children}</TooltipContext>
    </TooltipDelayContext>
  )
}

// ─── Internal delay context (avoids prop drilling) ─────────────────────────────

import { createContext as createCtx, useContext as useCtx } from "solid-js"

interface DelayValues {
  open: number
  close: number
}
const DelayContext = createCtx<DelayValues>({ open: 700, close: 300 })

function TooltipDelayContext(props: DelayValues & { children: JSX.Element }) {
  return (
    <DelayContext value={{ open: props.open, close: props.close }}>{props.children}</DelayContext>
  )
}

function useDelayContext(): DelayValues {
  return useCtx(DelayContext)!
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

/** Props for the tooltip trigger element. */
export interface TooltipTriggerProps {
  children: JSX.Element
  ref?: (el: HTMLElement) => void
}

/** Element that activates the tooltip on hover/focus. */
export function Trigger(props: TooltipTriggerProps) {
  const ctx = useTooltipContext()
  const delays = useDelayContext()
  let openTimer: ReturnType<typeof setTimeout> | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined

  const clearTimers = () => {
    if (openTimer !== undefined) {
      clearTimeout(openTimer)
      openTimer = undefined
    }
    if (closeTimer !== undefined) {
      clearTimeout(closeTimer)
      closeTimer = undefined
    }
  }

  const scheduleOpen = () => {
    clearTimers()
    openTimer = setTimeout(() => {
      ctx.requestOpenChange(true, createChangeDetails("trigger"))
    }, delays.open)
  }

  const scheduleClose = () => {
    clearTimers()
    closeTimer = setTimeout(() => {
      ctx.requestOpenChange(false, createChangeDetails("trigger"))
    }, delays.close)
  }

  const handleMouseEnter = () => scheduleOpen()
  const handleMouseLeave = () => scheduleClose()
  const handleFocus = () => {
    clearTimers()
    ctx.requestOpenChange(true, createChangeDetails("trigger"))
  }
  const handleBlur = () => {
    clearTimers()
    ctx.requestOpenChange(false, createChangeDetails("trigger"))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && ctx.open()) {
      clearTimers()
      ctx.requestOpenChange(false, createChangeDetails("escape-key"))
    }
  }

  onCleanup(clearTimers)

  return (
    <span
      id={ctx.triggerId}
      aria-describedby={ctx.open() ? ctx.contentId : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      ref={(el: HTMLSpanElement) => {
        ctx.setTriggerRef(el)
        props.ref?.(el)
      }}
      {...applySemanticAttrs({
        scope: "tooltip",
        part: "trigger",
        state: ctx.open() ? "open" : "closed",
      })}
    >
      {props.children}
    </span>
  )
}

// ─── Content ───────────────────────────────────────────────────────────────────

/** Props for the tooltip content element. */
export interface TooltipContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLDivElement) => void
}

/** Tooltip content panel with positioning and presence. */
export function Content(props: TooltipContentProps) {
  const ctx = useTooltipContext()
  const delays = useDelayContext()
  let contentEl: HTMLDivElement | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined

  const handleMouseEnter = () => {
    if (closeTimer !== undefined) {
      clearTimeout(closeTimer)
      closeTimer = undefined
    }
  }

  const handleMouseLeave = () => {
    closeTimer = setTimeout(() => {
      ctx.requestOpenChange(false, createChangeDetails("trigger"))
    }, delays.close)
  }

  onSettled(() => {
    if (!contentEl) return

    // Positioning
    let cleanupPositioning: (() => void) | undefined
    const reference = ctx.triggerRef()
    if (ctx.positioning && reference && contentEl) {
      const result = ctx.positioning.update(reference, contentEl)
      if (typeof result === "function") {
        cleanupPositioning = result
      }
    }

    return () => {
      cleanupPositioning?.()
      if (closeTimer !== undefined) clearTimeout(closeTimer)
    }
  })

  return (
    <Show when={ctx.present()}>
      <div
        id={ctx.contentId}
        role="tooltip"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={(el: HTMLDivElement) => {
          contentEl = el
          props.ref?.(el)
        }}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "tooltip",
          part: "content",
          state: ctx.open() ? "open" : "closed",
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}
