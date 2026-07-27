/**
 * @solidiom/scroll-area — Custom-styled scrollbar with native scrolling performance.
 *
 * Parts: Root, Viewport, Scrollbar, Thumb.
 */

import { createSignal, createContext, useContext, onSettled, type Accessor } from "solid-js"
import { type JSX, Show } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

// ─── Context ─────────────────────────────────────────────────────────────────

interface ScrollAreaContextValue {
  viewportRef: Accessor<HTMLDivElement | undefined>
  setViewportRef: (el: HTMLDivElement | undefined) => void
  scrollHeight: Accessor<number>
  scrollWidth: Accessor<number>
  viewportHeight: Accessor<number>
  viewportWidth: Accessor<number>
  scrollTop: Accessor<number>
  scrollLeft: Accessor<number>
  type: "auto" | "always" | "hover" | "scroll"
  isHovered: Accessor<boolean>
  isScrolling: Accessor<boolean>
  scrollHideDelay: number
  /** Update scroll measurements from viewport. */
  updateMeasurements: () => void
  /** Update scroll position from viewport. */
  updateScrollPosition: () => void
  /** Mark scrolling state. */
  notifyScrollStart: () => void
}

const ScrollAreaContext = createContext<ScrollAreaContextValue>()

function useScrollAreaContext(): ScrollAreaContextValue {
  const ctx = useContext(ScrollAreaContext)
  if (!ctx) {
    throw new Error("[solidiom] ScrollArea parts must be used within ScrollArea.Root")
  }
  return ctx
}

// ─── Root ────────────────────────────────────────────────────────────────────

export interface ScrollAreaRootProps {
  /** Scrollbar visibility: "auto" | "always" | "hover" | "scroll". Default "hover". */
  type?: "auto" | "always" | "hover" | "scroll"
  /** Hide delay in ms for hover/scroll modes. Default 600. */
  scrollHideDelay?: number
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * ScrollArea root — wraps viewport and scrollbars.
 *
 * Emits `data-scope="scroll-area"`, `data-part="root"`.
 */
export function Root(props: ScrollAreaRootProps) {
  const type = props.type ?? "hover"
  const scrollHideDelay = props.scrollHideDelay ?? 600

  const [viewportRef, setViewportRef] = createSignal<HTMLDivElement | undefined>(undefined)
  const [scrollHeight, setScrollHeight] = createSignal(0)
  const [scrollWidth, setScrollWidth] = createSignal(0)
  const [viewportHeight, setViewportHeight] = createSignal(0)
  const [viewportWidth, setViewportWidth] = createSignal(0)
  const [scrollTop, setScrollTop] = createSignal(0)
  const [scrollLeft, setScrollLeft] = createSignal(0)
  const [isHovered, setIsHovered] = createSignal(false)
  const [isScrolling, setIsScrolling] = createSignal(false)

  let scrollTimer: ReturnType<typeof setTimeout> | undefined

  const updateMeasurements = () => {
    const el = viewportRef()
    if (!el) return
    setScrollHeight(el.scrollHeight)
    setScrollWidth(el.scrollWidth)
    setViewportHeight(el.clientHeight)
    setViewportWidth(el.clientWidth)
  }

  const updateScrollPosition = () => {
    const el = viewportRef()
    if (!el) return
    setScrollTop(el.scrollTop)
    setScrollLeft(el.scrollLeft)
  }

  const notifyScrollStart = () => {
    setIsScrolling(true)
    if (scrollTimer !== undefined) clearTimeout(scrollTimer)
    scrollTimer = setTimeout(() => {
      setIsScrolling(false)
    }, scrollHideDelay)
  }

  return (
    <ScrollAreaContext
      value={{
        viewportRef,
        setViewportRef,
        scrollHeight,
        scrollWidth,
        viewportHeight,
        viewportWidth,
        scrollTop,
        scrollLeft,
        type,
        isHovered,
        isScrolling,
        scrollHideDelay,
        updateMeasurements,
        updateScrollPosition,
        notifyScrollStart,
      }}
    >
      <div
        class={props.class}
        style={{
          position: "relative",
          overflow: "hidden",
          ...(typeof props.style === "object" ? props.style : {}),
        }}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        {...applySemanticAttrs({
          scope: "scroll-area",
          part: "root",
        })}
      >
        {props.children}
      </div>
    </ScrollAreaContext>
  )
}

// ─── Viewport ────────────────────────────────────────────────────────────────

export interface ScrollAreaViewportProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * ScrollArea viewport — the scrollable container. Hides native scrollbars.
 *
 * Emits `data-scope="scroll-area"`, `data-part="viewport"`.
 */
export function Viewport(props: ScrollAreaViewportProps) {
  const ctx = useScrollAreaContext()
  let ref: HTMLDivElement | undefined

  onSettled(() => {
    if (!ref) return
    ctx.setViewportRef(ref)
    ctx.updateMeasurements()

    const observer = new ResizeObserver(() => ctx.updateMeasurements())
    observer.observe(ref)
    return () => {
      observer.disconnect()
      ctx.setViewportRef(undefined)
    }
  })

  const handleScroll = () => {
    ctx.updateScrollPosition()
    ctx.notifyScrollStart()
  }

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      class={props.class}
      style={{
        "overflow-x": "scroll",
        "overflow-y": "scroll",
        "scrollbar-width": "none",
        ...(typeof props.style === "object" ? props.style : {}),
      }}
      {...applySemanticAttrs({
        scope: "scroll-area",
        part: "viewport",
      })}
    >
      {props.children}
    </div>
  )
}

// ─── Scrollbar ───────────────────────────────────────────────────────────────

export interface ScrollAreaScrollbarProps {
  /** Scrollbar orientation. */
  orientation?: "vertical" | "horizontal"
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * ScrollArea scrollbar — the track for the scroll thumb.
 *
 * Emits `data-scope="scroll-area"`, `data-part="scrollbar"`, `data-orientation`.
 */
export function Scrollbar(props: ScrollAreaScrollbarProps) {
  const ctx = useScrollAreaContext()
  const orientation = () => props.orientation ?? "vertical"

  const isVisible = () => {
    if (ctx.type === "always") return true
    if (ctx.type === "hover") return ctx.isHovered()
    if (ctx.type === "scroll") return ctx.isScrolling()
    // "auto" — show when content overflows
    if (orientation() === "vertical") {
      return ctx.scrollHeight() > ctx.viewportHeight()
    }
    return ctx.scrollWidth() > ctx.viewportWidth()
  }

  return (
    <Show when={isVisible()}>
      <div
        class={props.class}
        style={{
          position: "absolute",
          ...(orientation() === "vertical"
            ? { top: "0", right: "0", bottom: "0", width: "8px" }
            : { bottom: "0", left: "0", right: "0", height: "8px" }),
          ...(typeof props.style === "object" ? props.style : {}),
        }}
        {...applySemanticAttrs({
          scope: "scroll-area",
          part: "scrollbar",
          orientation: orientation(),
        })}
      >
        {props.children}
      </div>
    </Show>
  )
}

// ─── Thumb ───────────────────────────────────────────────────────────────────

export interface ScrollAreaThumbProps {
  class?: string
  style?: JSX.CSSProperties | string
}

/**
 * ScrollArea thumb — the draggable scroll indicator.
 *
 * Emits `data-scope="scroll-area"`, `data-part="thumb"`.
 */
export function Thumb(props: ScrollAreaThumbProps) {
  const ctx = useScrollAreaContext()

  const thumbSize = () => {
    const vh = ctx.viewportHeight()
    const sh = ctx.scrollHeight()
    if (sh === 0) return 100
    return Math.max((vh / sh) * 100, 10)
  }

  const thumbOffset = () => {
    const sh = ctx.scrollHeight()
    const vh = ctx.viewportHeight()
    const st = ctx.scrollTop()
    if (sh <= vh) return 0
    return (st / (sh - vh)) * (100 - thumbSize())
  }

  return (
    <div
      class={props.class}
      style={{
        position: "absolute",
        "border-radius": "9999px",
        background: "rgba(0, 0, 0, 0.3)",
        width: "100%",
        height: `${thumbSize()}%`,
        top: `${thumbOffset()}%`,
        transition: "opacity 150ms",
        ...(typeof props.style === "object" ? props.style : {}),
      }}
      {...applySemanticAttrs({
        scope: "scroll-area",
        part: "thumb",
      })}
    />
  )
}
