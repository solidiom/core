/**
 * @solidiom/avatar-group — Stacked avatars with overflow indicator.
 *
 * Parts: Root, Overflow.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"
import { children as resolveChildren } from "solid-js"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RootProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  /** Maximum number of visible avatars before overflow indicator. */
  max?: number
  /** Overlap amount (negative margin). Defaults to "-0.5rem". */
  spacing?: string
}

export interface OverflowProps {
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: RootProps) {
  const resolved = resolveChildren(() => props.children)

  const visibleChildren = () => {
    const all = resolved.toArray()
    if (props.max !== undefined && props.max < all.length) {
      return all.slice(0, props.max)
    }
    return all
  }

  const overflowCount = () => {
    const all = resolved.toArray()
    if (props.max !== undefined && props.max < all.length) {
      return all.length - props.max
    }
    return 0
  }

  const spacing = () => props.spacing ?? "-0.5rem"

  return (
    <div
      class={props.class}
      style={{
        display: "flex",
        "align-items": "center",
        ...(typeof props.style === "object" ? props.style : {}),
      }}
      {...applySemanticAttrs({ scope: "avatar-group", part: "root" })}
    >
      {visibleChildren()}
      {overflowCount() > 0 && <Overflow>+{overflowCount()}</Overflow>}
    </div>
  )
}

export function Overflow(props: OverflowProps) {
  return (
    <span
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "avatar-group", part: "overflow" })}
    >
      {props.children}
    </span>
  )
}
