/**
 * HoverCard primitive — content preview on hover, with configurable open/close
 * delays and a positioning port for anchoring content to the trigger.
 *
 * Parts: Root, Trigger, Content.
 */

import { Show, createSignal, createEffect, onCleanup } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs, createStableId } from "@solidiom/runtime"
import {
  HoverCardContext,
  useHoverCardContext,
  type HoverCardContextValue,
  type PositioningPort,
} from "./hover-card-context"

// ─── Root ──────────────────────────────────────────────────────────────────────

export interface HoverCardRootProps {
  /** Delay in ms before opening. Default 700. */
  openDelay?: number
  /** Delay in ms before closing. Default 300. */
  closeDelay?: number
  /** Positioning adapter for floating placement. */
  positioning?: PositioningPort
  children: JSX.Element
}

export function Root(props: HoverCardRootProps) {
  const openDelay = () => props.openDelay ?? 700
  const closeDelay = () => props.closeDelay ?? 300
  const [open, setOpen] = createSignal(false)
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement | undefined>(undefined)

  let openTimer: ReturnType<typeof setTimeout> | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined

  const baseId = createStableId("hover-card")
  const triggerId = `${baseId}-trigger`
  const contentId = `${baseId}-content`

  function clearTimers() {
    if (openTimer !== undefined) {
      clearTimeout(openTimer)
      openTimer = undefined
    }
    if (closeTimer !== undefined) {
      clearTimeout(closeTimer)
      closeTimer = undefined
    }
  }

  function scheduleOpen() {
    clearTimers()
    openTimer = setTimeout(() => setOpen(true), openDelay())
  }

  function scheduleClose() {
    clearTimers()
    closeTimer = setTimeout(() => setOpen(false), closeDelay())
  }

  onCleanup(clearTimers)

  const ctx: HoverCardContextValue = {
    open,
    onTriggerEnter: scheduleOpen,
    onTriggerLeave: scheduleClose,
    onContentEnter: () => clearTimers(),
    onContentLeave: scheduleClose,
    contentId,
    triggerId,
    positioning: props.positioning,
    triggerRef,
    setTriggerRef,
  }

  return <HoverCardContext value={ctx}>{props.children}</HoverCardContext>
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

export interface HoverCardTriggerProps {
  href?: string
  children: JSX.Element
  class?: string
}

export function Trigger(props: HoverCardTriggerProps) {
  const ctx = useHoverCardContext()

  const attrs = () =>
    applySemanticAttrs({
      scope: "hover-card",
      part: "trigger",
      state: ctx.open() ? "open" : "closed",
    })

  const setRef = (el: HTMLElement) => ctx.setTriggerRef(el)

  if (props.href !== undefined) {
    return (
      <a
        id={ctx.triggerId}
        href={props.href}
        class={props.class}
        aria-describedby={ctx.open() ? ctx.contentId : undefined}
        onPointerEnter={() => ctx.onTriggerEnter()}
        onPointerLeave={() => ctx.onTriggerLeave()}
        ref={setRef}
        {...attrs()}
      >
        {props.children}
      </a>
    )
  }

  return (
    <span
      id={ctx.triggerId}
      class={props.class}
      aria-describedby={ctx.open() ? ctx.contentId : undefined}
      onPointerEnter={() => ctx.onTriggerEnter()}
      onPointerLeave={() => ctx.onTriggerLeave()}
      ref={setRef}
      {...attrs()}
    >
      {props.children}
    </span>
  )
}

// ─── Content ───────────────────────────────────────────────────────────────────

export interface HoverCardContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export function Content(props: HoverCardContentProps) {
  const ctx = useHoverCardContext()
  const [contentEl, setContentEl] = createSignal<HTMLDivElement | undefined>(undefined)

  createEffect(
    () => (ctx.open() ? [contentEl(), ctx.triggerRef()] : [undefined, undefined]),
    ([el, reference]) => {
      if (!ctx.positioning || !el || !reference) return

      const result = ctx.positioning.update(reference, el)
      return typeof result === "function" ? result : undefined
    },
  )

  return (
    <Show when={ctx.open()}>
      <div
        id={ctx.contentId}
        role="dialog"
        ref={setContentEl}
        class={props.class}
        style={props.style}
        onPointerEnter={() => ctx.onContentEnter()}
        onPointerLeave={() => ctx.onContentLeave()}
        {...applySemanticAttrs({
          scope: "hover-card",
          part: "content",
          state: "open",
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}
