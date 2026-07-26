/** @solidiom/hover-card — Content preview on hover. Parts: Root, Trigger, Content. */

import { type Accessor, Show, createSignal, onCleanup, createContext, useContext } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs, createStableId } from "@solidiom/runtime"

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface HoverCardRootProps {
  /** Delay in ms before opening. Default 700. */
  openDelay?: number
  /** Delay in ms before closing. Default 300. */
  closeDelay?: number
  children: JSX.Element
}

export interface HoverCardTriggerProps {
  href?: string
  children: JSX.Element
  class?: string
}

export interface HoverCardContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

// ─── Context ───────────────────────────────────────────────────────────────────

interface HoverCardContextValue {
  open: Accessor<boolean>
  onTriggerEnter: () => void
  onTriggerLeave: () => void
  onContentEnter: () => void
  onContentLeave: () => void
  contentId: string
  triggerId: string
}

const HoverCardContext = createContext<HoverCardContextValue>()

function useHoverCardContext(): HoverCardContextValue {
  const ctx = useContext(HoverCardContext)
  if (!ctx) throw new Error("HoverCard parts must be used within HoverCard.Root")
  return ctx
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export function Root(props: HoverCardRootProps) {
  const openDelay = () => props.openDelay ?? 700
  const closeDelay = () => props.closeDelay ?? 300
  const [open, setOpen] = createSignal(false)

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
  }

  return <HoverCardContext value={ctx}>{props.children}</HoverCardContext>
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

export function Trigger(props: HoverCardTriggerProps) {
  const ctx = useHoverCardContext()

  const attrs = () =>
    applySemanticAttrs({
      scope: "hover-card",
      part: "trigger",
      state: ctx.open() ? "open" : "closed",
    })

  if (props.href !== undefined) {
    return (
      <a
        id={ctx.triggerId}
        href={props.href}
        class={props.class}
        onPointerEnter={() => ctx.onTriggerEnter()}
        onPointerLeave={() => ctx.onTriggerLeave()}
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
      onPointerEnter={() => ctx.onTriggerEnter()}
      onPointerLeave={() => ctx.onTriggerLeave()}
      {...attrs()}
    >
      {props.children}
    </span>
  )
}

// ─── Content ───────────────────────────────────────────────────────────────────

export function Content(props: HoverCardContentProps) {
  const ctx = useHoverCardContext()

  return (
    <Show when={ctx.open()}>
      <div
        id={ctx.contentId}
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
