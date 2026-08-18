/**
 * @solidiom/aspect-ratio — Container that constrains children to a specified aspect ratio.
 *
 * Parts: Root.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AspectRatioRootProps {
  ratio?: number
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: AspectRatioRootProps) {
  const ratio = () => props.ratio ?? 1

  const containerStyles = (): JSX.CSSProperties => ({
    position: "relative",
    "aspect-ratio": `${ratio()}`,
    ...(typeof props.style === "object" ? props.style : {}),
  })

  const childStyles: JSX.CSSProperties = {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
  }

  return (
    <div
      class={props.class}
      style={typeof props.style === "string" ? props.style : containerStyles()}
      {...applySemanticAttrs({ scope: "aspect-ratio", part: "root" })}
    >
      <div style={childStyles}>{props.children}</div>
    </div>
  )
}
