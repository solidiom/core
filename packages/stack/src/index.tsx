/**
 * @solidiom/stack — Flex layout primitive with configurable gap, direction, and alignment.
 *
 * Parts: Root.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface StackRootProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse"
  gap?: string | number
  align?: "start" | "center" | "end" | "stretch" | "baseline"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  wrap?: boolean | "wrap" | "nowrap" | "wrap-reverse"
  inline?: boolean
  as?: string
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function mapAlign(value: StackRootProps["align"]): string | undefined {
  if (!value) return undefined
  switch (value) {
    case "start": return "flex-start"
    case "end": return "flex-end"
    case "center": return "center"
    case "stretch": return "stretch"
    case "baseline": return "baseline"
  }
}

function mapJustify(value: StackRootProps["justify"]): string | undefined {
  if (!value) return undefined
  switch (value) {
    case "start": return "flex-start"
    case "end": return "flex-end"
    case "center": return "center"
    case "between": return "space-between"
    case "around": return "space-around"
    case "evenly": return "space-evenly"
  }
}

function mapWrap(value: StackRootProps["wrap"]): "wrap" | "nowrap" | "wrap-reverse" | undefined {
  if (value === undefined) return undefined
  if (value === true) return "wrap"
  if (value === false) return "nowrap"
  return value
}

function normalizeGap(gap: string | number | undefined): string | undefined {
  if (gap === undefined) return undefined
  return typeof gap === "number" ? `${gap}px` : gap
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: StackRootProps) {
  const Tag = (props.as || "div") as keyof JSX.IntrinsicElements

  const styles = (): JSX.CSSProperties => ({
    display: props.inline ? "inline-flex" : "flex",
    "flex-direction": props.direction || "column",
    gap: normalizeGap(props.gap),
    "align-items": mapAlign(props.align),
    "justify-content": mapJustify(props.justify),
    "flex-wrap": mapWrap(props.wrap),
    ...(typeof props.style === "object" ? props.style : {}),
  })

  return (
    <Tag
      class={props.class}
      style={typeof props.style === "string" ? props.style : styles()}
      {...applySemanticAttrs({ scope: "stack", part: "root" })}
    >
      {props.children}
    </Tag>
  )
}
