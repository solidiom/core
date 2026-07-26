/**
 * @solidiom/badge — Headless badge primitive for inline status labels.
 *
 * Parts: Root.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"
export interface BadgeProps {
  children: JSX.Element
  class?: string
}

export function Root(props: BadgeProps) {
  return (
    <span class={props.class} {...applySemanticAttrs({ scope: "badge", part: "root" })}>
      {props.children}
    </span>
  )
}
