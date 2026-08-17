/**
 * @solidiom/link — Styled anchor with href sanitization and external link support.
 *
 * Parts: Root.
 */

import { type JSX } from "@solidjs/web"
import { sanitizeHref, applySemanticAttrs } from "@solidiom/runtime"
import { createMemo, Show } from "solid-js"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RootProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  /** URL href value. Sanitized before rendering. */
  href: string
  /** Opens in a new tab with noopener noreferrer. */
  external?: boolean
  /** Disables the link (renders as span). */
  disabled?: boolean
  /** Click handler. */
  onClick?: JSX.EventHandlerUnion<HTMLAnchorElement, MouseEvent>
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: RootProps) {
  const safeHref = createMemo(() => sanitizeHref(props.href))
  const isUnsafe = createMemo(() => safeHref() === "#" && props.href !== "#")
  const shouldRenderSpan = createMemo(() => props.disabled || isUnsafe())

  return (
    <Show
      when={!shouldRenderSpan()}
      fallback={
        <span
          class={props.class}
          style={props.style}
          aria-disabled={props.disabled ? "true" : undefined}
          {...applySemanticAttrs({ scope: "link", part: "root", disabled: props.disabled })}
        >
          {props.children}
        </span>
      }
    >
      <a
        href={safeHref()}
        class={props.class}
        style={props.style}
        target={props.external ? "_blank" : undefined}
        rel={props.external ? "noopener noreferrer" : undefined}
        onClick={props.onClick}
        {...applySemanticAttrs({ scope: "link", part: "root" })}
      >
        {props.children}
      </a>
    </Show>
  )
}
