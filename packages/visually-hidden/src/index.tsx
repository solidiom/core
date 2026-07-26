/**
 * @solidiom/visually-hidden — Hides content visually while keeping it accessible to screen readers.
 *
 * Parts: Root.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

/** Standard visually-hidden CSS properties. */
const visuallyHiddenStyles: JSX.CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  "white-space": "nowrap",
  "border-width": "0",
}

export interface VisuallyHiddenProps {
  children: JSX.Element
  class?: string
}

/**
 * Visually hides content while keeping it in the accessibility tree.
 * Useful for screen-reader-only labels, descriptions, and announcements.
 */
export function Root(props: VisuallyHiddenProps) {
  return (
    <span
      class={props.class}
      style={visuallyHiddenStyles}
      {...applySemanticAttrs({ scope: "visually-hidden", part: "root" })}
    >
      {props.children}
    </span>
  )
}
