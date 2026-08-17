/**
 * @solidiom/message-scroller — Auto-scrolling container with new-content indicators.
 *
 * Parts: Root, ScrollArea, NewContentIndicator.
 *
 * Uses createScrollAnchor from runtime to manage auto-scroll behavior.
 * Exposes isAtBottom, hasNewContent, newContentCount via context.
 */

import { createContext, useContext, type Accessor, onMount, createSignal } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs, createScrollAnchor, type ScrollAnchor } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

interface MessageScrollerContextValue {
  scrollAnchor: ScrollAnchor
  scrollAreaRef: () => HTMLElement | undefined
  setScrollAreaRef: (el: HTMLElement) => void
  isAtBottom: Accessor<boolean>
  hasNewContent: Accessor<boolean>
  newContentCount: Accessor<number>
}

const MessageScrollerContext = createContext<MessageScrollerContextValue>()

function useMessageScrollerContext(): MessageScrollerContextValue {
  const ctx = useContext(MessageScrollerContext)
  if (!ctx) throw new Error("MessageScroller parts must be used within MessageScroller.Root")
  return ctx
}

// ─── Root ───────────────────────────────────────────────────────────────────

export interface MessageScrollerRootProps {
  /** Pixel threshold from bottom to consider "at bottom". Default: 50. */
  bottomThreshold?: number
  /** Scroll behavior for auto-scroll. Default: 'smooth'. */
  scrollBehavior?: ScrollBehavior
  /** Called when new content appears while scrolled up. */
  onNewContent?: () => void
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * MessageScroller.Root — container providing scroll anchor context.
 */
export function Root(props: MessageScrollerRootProps) {
  const [scrollAreaRef, setScrollAreaRef] = createSignal<HTMLElement | undefined>(undefined)

  const scrollAnchor = createScrollAnchor({
    scrollContainer: scrollAreaRef,
    bottomThreshold: props.bottomThreshold ?? 50,
    scrollBehavior: props.scrollBehavior ?? "smooth",
    onNewContentWhileScrolledUp: () => props.onNewContent?.(),
  })

  onMount(() => {
    scrollAnchor.attach()
  })

  const ctx: MessageScrollerContextValue = {
    scrollAnchor,
    scrollAreaRef,
    setScrollAreaRef,
    isAtBottom: scrollAnchor.isAtBottom,
    hasNewContent: scrollAnchor.hasNewContent,
    newContentCount: scrollAnchor.newContentCount,
  }

  return (
    <MessageScrollerContext value={ctx}>
      <div
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({ scope: "message-scroller", part: "root" })}
      >
        {props.children}
      </div>
    </MessageScrollerContext>
  )
}

// ─── ScrollArea ─────────────────────────────────────────────────────────────

export interface MessageScrollerScrollAreaProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/** MessageScroller.ScrollArea — the scrollable container using createScrollAnchor. */
export function ScrollArea(props: MessageScrollerScrollAreaProps) {
  const ctx = useMessageScrollerContext()

  return (
    <div
      ref={(el) => ctx.setScrollAreaRef(el)}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "message-scroller", part: "scroll-area" })}
    >
      {props.children}
    </div>
  )
}

// ─── NewContentIndicator ────────────────────────────────────────────────────

export interface MessageScrollerNewContentIndicatorProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/** MessageScroller.NewContentIndicator — "new messages" button, visible when hasNewContent. */
export function NewContentIndicator(props: MessageScrollerNewContentIndicatorProps) {
  const ctx = useMessageScrollerContext()

  return (
    <button
      type="button"
      aria-live="polite"
      hidden={!ctx.hasNewContent()}
      onClick={() => ctx.scrollAnchor.dismissNewContent()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "message-scroller",
        part: "new-content-indicator",
        state: ctx.hasNewContent() ? "visible" : "hidden",
      })}
    >
      {props.children ?? `${ctx.newContentCount()} new message${ctx.newContentCount() === 1 ? "" : "s"}`}
    </button>
  )
}
