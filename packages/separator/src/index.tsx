/**
 * @solidiom/separator — Headless separator primitive for horizontal or vertical dividers.
 *
 * Parts: Root.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

export interface RootProps {
  /** Orientation of the separator. */
  orientation?: "horizontal" | "vertical"
  /** When true, the separator is purely decorative (role="none"). */
  decorative?: boolean
  class?: string
  style?: JSX.CSSProperties | string
}

/**
 * Separator root element.
 *
 * Renders with `role="separator"` by default for accessibility.
 * When `decorative` is true, renders with `role="none"` to hide from
 * the accessibility tree.
 */
export function Root(props: RootProps) {
  const orientation = () => props.orientation ?? "horizontal"
  const role = () => (props.decorative ? "none" : "separator")

  return (
    <div
      role={role()}
      aria-orientation={props.decorative ? undefined : orientation()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "separator", part: "root", orientation: orientation() })}
    />
  )
}
