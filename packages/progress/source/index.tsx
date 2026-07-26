/**
 * @solidiom/progress — Headless progress indicator primitive.
 *
 * Parts: Root, Indicator.
 *
 * Supports determinate (value 0–100) and indeterminate (value=null) modes.
 * Emits semantic data attributes and ARIA progressbar role.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

export interface ProgressRootProps {
  /** Current value (0–max). Pass `null` for indeterminate. */
  value: number | null
  /** Maximum value. Defaults to 100. */
  max?: number
  /** Accessible label for the progress bar. */
  "aria-label"?: string
  /** ID of an element that labels this progress bar. */
  "aria-labelledby"?: string
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * Progress root — renders a `div` with `role="progressbar"` and ARIA value attributes.
 *
 * Emits `data-scope="progress"`, `data-part="root"`, `data-state="loading"|"complete"`.
 */
export function Root(props: ProgressRootProps) {
  const max = () => props.max ?? 100
  const percentage = () => (props.value != null ? Math.round((props.value / max()) * 100) : null)
  const state = () => {
    if (props.value == null) return "loading"
    return props.value >= max() ? "complete" : "loading"
  }

  return (
    <div
      role="progressbar"
      aria-valuenow={props.value ?? undefined}
      aria-valuemin={0}
      aria-valuemax={max()}
      aria-label={props["aria-label"]}
      aria-labelledby={props["aria-labelledby"]}
      class={props.class}
      style={props.style}
      data-value={props.value ?? undefined}
      data-max={max()}
      data-percent={percentage() ?? undefined}
      {...applySemanticAttrs({
        scope: "progress",
        part: "root",
        state: state(),
      })}
    >
      {props.children}
    </div>
  )
}

export interface ProgressIndicatorProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * Progress indicator — the visual fill element.
 *
 * Consumers typically style this with `width: var(--progress-value)%` or read
 * `data-value` from the parent root. The indicator receives its own semantic attrs.
 */
export function Indicator(props: ProgressIndicatorProps) {
  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({ scope: "progress", part: "indicator" })}
    >
      {props.children}
    </div>
  )
}
