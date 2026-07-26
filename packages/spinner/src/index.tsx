/**
 * @solidiom/spinner — Loading spinner indicator primitive.
 *
 * Parts: Root.
 *
 * Renders a `<span>` with `role="status"` and a configurable `aria-label`.
 * Accepts optional children for custom spinner visuals.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

export interface SpinnerRootProps {
  /** Accessible label announced by screen readers. Defaults to "Loading". */
  label?: string
  class?: string
  style?: JSX.CSSProperties | string
  /** Optional custom spinner content. */
  children?: JSX.Element
}

/**
 * Spinner primitive — renders a `<span>` with role="status" and semantic attributes.
 *
 * Emits `data-scope="spinner"`, `data-part="root"`.
 */
export function Root(props: SpinnerRootProps) {
  return (
    <span
      role="status"
      aria-label={props.label ?? "Loading"}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "spinner", part: "root" })}
    >
      {props.children}
    </span>
  )
}
