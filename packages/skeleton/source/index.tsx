/**
 * @solidiom/skeleton — Headless skeleton loading placeholder primitive.
 *
 * Parts: Root.
 *
 * Renders a decorative placeholder div with pulse animation support.
 * Marked aria-hidden since it conveys no semantic content.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

export interface SkeletonRootProps {
  /** Shape variant. Defaults to "text". */
  variant?: "text" | "circular" | "rectangular"
  /** Explicit width. */
  width?: string | number
  /** Explicit height. */
  height?: string | number
  class?: string
  style?: JSX.CSSProperties | string
}

/**
 * Skeleton root — renders a `div` placeholder for loading states.
 *
 * Emits `data-scope="skeleton"`, `data-part="root"`, `data-variant`.
 * Marked `aria-hidden="true"` as it is purely decorative.
 */
export function Root(props: SkeletonRootProps) {
  const variant = () => props.variant ?? "text"

  const computedStyle = (): JSX.CSSProperties | string => {
    const w = props.width
    const h = props.height
    if (!w && !h) return props.style ?? {}
    const base: JSX.CSSProperties = typeof props.style === "object" ? (props.style ?? {}) : {}
    return {
      ...base,
      ...(w != null ? { width: typeof w === "number" ? `${w}px` : w } : {}),
      ...(h != null ? { height: typeof h === "number" ? `${h}px` : h } : {}),
    }
  }

  return (
    <div
      aria-hidden="true"
      class={props.class}
      style={computedStyle()}
      data-variant={variant()}
      {...applySemanticAttrs({ scope: "skeleton", part: "root" })}
    />
  )
}
