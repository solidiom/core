/**
 * @solidiom/banner — Dismissible notification bar primitive.
 *
 * Parts: Root, Content, Close.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs, createDisclosureState } from "@solidiom/runtime"
import { createMemo, type Accessor } from "solid-js"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RootProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  /** Visual variant. */
  variant?: "info" | "success" | "warning" | "error"
  /** Whether the banner can be dismissed. */
  dismissible?: boolean
  /** Controlled open state. */
  open?: Accessor<boolean | undefined>
  /** Default open state for uncontrolled usage. */
  defaultOpen?: boolean
  /** Callback when dismiss state changes. */
  onDismiss?: () => void
}

export interface ContentProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

export interface CloseProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

// ─── Context ────────────────────────────────────────────────────────────────

import { createContext, useContext } from "solid-js"

interface BannerContext {
  dismiss: () => void
}

const BannerCtx = createContext<BannerContext>()

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: RootProps) {
  const disclosure = createDisclosureState({
    open: props.open,
    defaultOpen: props.defaultOpen ?? true,
    onOpenChange(next) {
      if (!next) {
        props.onDismiss?.()
      }
    },
  })

  const state = createMemo(() => (disclosure.open() ? "visible" : "dismissed"))
  const role = () => (props.variant === "error" || props.variant === "warning" ? "alert" : "status")

  const context: BannerContext = {
    dismiss: () => disclosure.requestOpenChange(false, { reason: "close" }),
  }

  return (
    <BannerCtx value={context}>
      <div
        role={role()}
        class={props.class}
        style={props.style}
        data-variant={props.variant}
        hidden={!disclosure.open() || undefined}
        {...applySemanticAttrs({ scope: "banner", part: "root", state: state() })}
      >
        {props.children}
      </div>
    </BannerCtx>
  )
}

export function Content(props: ContentProps) {
  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "banner", part: "content" })}
    >
      {props.children}
    </div>
  )
}

export function Close(props: CloseProps) {
  const context = useContext(BannerCtx)

  return (
    <button
      type="button"
      class={props.class}
      style={props.style}
      onClick={() => context?.dismiss()}
      aria-label="Dismiss"
      {...applySemanticAttrs({ scope: "banner", part: "close" })}
    >
      {props.children ?? "×"}
    </button>
  )
}
