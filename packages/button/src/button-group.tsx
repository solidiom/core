/**
 * ButtonGroup — A layout wrapper that handles grouped button styling.
 * Removes inner border-radiuses and handles overlapping borders via CSS selectors.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

export interface ButtonGroupProps {
  children: JSX.Element
  /** Orientation of the group layout. */
  orientation?: "horizontal" | "vertical"
  class?: string
}

export function ButtonGroup(props: ButtonGroupProps) {
  return (
    <div
      role="group"
      class={props.class}
      {...applySemanticAttrs({
        scope: "button",
        part: "group",
        orientation: props.orientation ?? "horizontal",
      })}
    >
      {props.children}
    </div>
  )
}
