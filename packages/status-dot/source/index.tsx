/**
 * @solidiom/status-dot — Presence indicator dot.
 *
 * Parts: Root.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RootProps {
  class?: string
  style?: JSX.CSSProperties | string
  /** Status value. Default: "online". */
  status?: "online" | "offline" | "busy" | "away" | "idle"
  /** Whether to show a pulse animation. */
  pulse?: boolean
  /** Size variant. */
  size?: "sm" | "md" | "lg"
  /** Accessible label for screen readers. */
  label?: string
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: RootProps) {
  const status = () => props.status ?? "online"

  return (
    <span
      class={props.class}
      style={props.style}
      aria-label={props.label}
      role={props.label ? "img" : undefined}
      data-pulse={props.pulse ? "" : undefined}
      data-size={props.size}
      {...applySemanticAttrs({ scope: "status-dot", part: "root", state: status() })}
    />
  )
}
