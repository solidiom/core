/**
 * @solidiom/kbd — Keyboard shortcut display element.
 *
 * Parts: Root.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

export interface KbdRootProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * Kbd root — renders a semantic `<kbd>` element for displaying keyboard shortcuts.
 */
export function Root(props: KbdRootProps) {
  return (
    <kbd
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "kbd", part: "root" })}
    >
      {props.children}
    </kbd>
  )
}
