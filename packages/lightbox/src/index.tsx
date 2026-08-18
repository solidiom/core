/**
 * @solidiom/lightbox — Image and media overlay viewer with navigation controls.
 *
 * Parts: Root, Backdrop, Content, Image, CloseButton, NextButton, PrevButton, Counter.
 * Keyboard: Escape closes, ArrowRight next, ArrowLeft prev.
 */

import { createContext, useContext, createSignal, Show, type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  applySemanticAttrs,
  createDisclosureState,
  createChangeDetails,
  type DisclosureReason,
  type ChangeDetails,
} from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface LightboxItem {
  src: string
  alt?: string
}

export interface LightboxRootProps {
  /** Controlled open state. */
  open?: Accessor<boolean>
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean
  /** Called when open state change is requested. */
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Items to display in the lightbox. */
  items?: LightboxItem[]
  /** Default starting index. */
  defaultIndex?: number
  /** Whether navigation loops. */
  loop?: boolean
  children: JSX.Element
}

export interface LightboxBackdropProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

export interface LightboxContentProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
  ref?: (el: HTMLDivElement) => void
}

export interface LightboxImageProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

export interface LightboxCloseButtonProps {
  class?: string
  children?: JSX.Element
}

export interface LightboxNextButtonProps {
  class?: string
  children?: JSX.Element
}

export interface LightboxPrevButtonProps {
  class?: string
  children?: JSX.Element
}

export interface LightboxCounterProps {
  class?: string
  children?: JSX.Element
}

// ─── Context ────────────────────────────────────────────────────────────────

interface LightboxContextValue {
  open: Accessor<boolean>
  requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void
  currentIndex: Accessor<number>
  totalItems: Accessor<number>
  items: Accessor<LightboxItem[]>
  goNext: () => void
  goPrev: () => void
  loop: boolean
}

const LightboxContext = createContext<LightboxContextValue>()

function useLightboxContext(): LightboxContextValue {
  const ctx = useContext(LightboxContext)
  if (!ctx) throw new Error("Lightbox parts must be used within Lightbox.Root")
  return ctx
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: LightboxRootProps) {
  const { open, requestOpenChange } = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
  })

  const items = () => props.items ?? []
  const loop = props.loop ?? false

  const [currentIndex, setCurrentIndex] = createSignal(props.defaultIndex ?? 0)

  const goNext = () => {
    const total = items().length
    if (total === 0) return
    setCurrentIndex((prev) => {
      if (prev >= total - 1) return loop ? 0 : prev
      return prev + 1
    })
  }

  const goPrev = () => {
    const total = items().length
    if (total === 0) return
    setCurrentIndex((prev) => {
      if (prev <= 0) return loop ? total - 1 : prev
      return prev - 1
    })
  }

  const ctx: LightboxContextValue = {
    open,
    requestOpenChange,
    currentIndex,
    totalItems: () => items().length,
    items,
    goNext,
    goPrev,
    loop,
  }

  return (
    <LightboxContext value={ctx}>
      <div
        {...applySemanticAttrs({
          scope: "lightbox",
          part: "root",
          state: open() ? "open" : "closed",
        })}
      >
        {props.children}
      </div>
    </LightboxContext>
  )
}

export function Backdrop(props: LightboxBackdropProps) {
  const ctx = useLightboxContext()

  const handleClick = () => {
    ctx.requestOpenChange(false, createChangeDetails("pointer-outside"))
  }

  return (
    <Show when={ctx.open()}>
      <div
        aria-hidden="true"
        class={props.class}
        style={props.style}
        onClick={handleClick}
        {...applySemanticAttrs({ scope: "lightbox", part: "backdrop" })}
      >
        {props.children}
      </div>
    </Show>
  )
}

export function Content(props: LightboxContentProps) {
  const ctx = useLightboxContext()

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Escape":
        ctx.requestOpenChange(false, createChangeDetails("escape-key"))
        break
      case "ArrowRight":
        ctx.goNext()
        break
      case "ArrowLeft":
        ctx.goPrev()
        break
    }
  }

  return (
    <Show when={ctx.open()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Lightbox"
        tabindex={0}
        class={props.class}
        style={props.style}
        onKeyDown={handleKeyDown}
        ref={props.ref}
        {...applySemanticAttrs({ scope: "lightbox", part: "content", state: "open" })}
      >
        {props.children}
      </div>
    </Show>
  )
}

export function Image(props: LightboxImageProps) {
  const ctx = useLightboxContext()
  const currentItem = () => ctx.items()[ctx.currentIndex()]

  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "lightbox", part: "image" })}
    >
      {props.children ?? (
        <Show when={currentItem()}>
          {(item) => <img src={item().src} alt={item().alt ?? ""} />}
        </Show>
      )}
    </div>
  )
}

export function CloseButton(props: LightboxCloseButtonProps) {
  const ctx = useLightboxContext()

  const handleClick = () => {
    ctx.requestOpenChange(false, createChangeDetails("close"))
  }

  return (
    <button
      type="button"
      aria-label="Close lightbox"
      class={props.class}
      onClick={handleClick}
      {...applySemanticAttrs({ scope: "lightbox", part: "close-button" })}
    >
      {props.children ?? "×"}
    </button>
  )
}

export function NextButton(props: LightboxNextButtonProps) {
  const ctx = useLightboxContext()

  return (
    <button
      type="button"
      aria-label="Next image"
      class={props.class}
      onClick={() => ctx.goNext()}
      disabled={!ctx.loop && ctx.currentIndex() >= ctx.totalItems() - 1}
      {...applySemanticAttrs({ scope: "lightbox", part: "next-button" })}
    >
      {props.children ?? "→"}
    </button>
  )
}

export function PrevButton(props: LightboxPrevButtonProps) {
  const ctx = useLightboxContext()

  return (
    <button
      type="button"
      aria-label="Previous image"
      class={props.class}
      onClick={() => ctx.goPrev()}
      disabled={!ctx.loop && ctx.currentIndex() <= 0}
      {...applySemanticAttrs({ scope: "lightbox", part: "prev-button" })}
    >
      {props.children ?? "←"}
    </button>
  )
}

export function Counter(props: LightboxCounterProps) {
  const ctx = useLightboxContext()

  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      class={props.class}
      {...applySemanticAttrs({ scope: "lightbox", part: "counter" })}
    >
      {props.children ?? `${ctx.currentIndex() + 1} / ${ctx.totalItems()}`}
    </span>
  )
}
