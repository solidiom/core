/**
 * @solidiom/meter — Scalar measurement display using the native HTML meter element.
 *
 * Parts: Root.
 *
 * Exposes `data-value` (normalized 0–1) and `data-status` ("safe" | "caution" | "danger")
 * via semantic attributes to enable CSS/Tailwind/UnoCSS styling hooks.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"
import { deriveMeterStatus } from "./derive-status"

export type { MeterStatus } from "./derive-status"
export { deriveMeterStatus } from "./derive-status"

export interface MeterProps {
  /** Current value. Must be between min and max. */
  value: number
  /** Minimum bound. Defaults to 0. */
  min?: number
  /** Maximum bound. Defaults to 1. */
  max?: number
  /** Low threshold — values at or below this are considered "danger" when optimum is high. */
  low?: number
  /** High threshold — values at or above this are considered "danger" when optimum is low. */
  high?: number
  /** The optimum value — determines which end of the range is "safe". */
  optimum?: number
  class?: string
  children?: JSX.Element
}

/**
 * Meter — displays a scalar measurement within a known range.
 * Uses the native `<meter>` element for built-in accessibility semantics.
 */
export function Root(props: MeterProps) {
  const min = () => props.min ?? 0
  const max = () => props.max ?? 1
  const normalized = () => {
    const range = max() - min()
    if (range <= 0) return 0
    return (props.value - min()) / range
  }
  const status = () => deriveMeterStatus(props.value, props.low, props.high, props.optimum)

  return (
    <meter
      value={props.value}
      min={min()}
      max={max()}
      low={props.low}
      high={props.high}
      optimum={props.optimum}
      class={props.class}
      data-value={normalized().toFixed(2)}
      data-status={status()}
      {...applySemanticAttrs({ scope: "meter", part: "root", state: status() })}
    >
      {props.children}
    </meter>
  )
}
