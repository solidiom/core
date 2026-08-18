/**
 * @solidiom/grid — CSS Grid layout primitive with responsive columns and gap.
 *
 * Parts: Root, Item.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GridRootProps {
  columns?: number | string
  rows?: number | string
  gap?: string | number
  rowGap?: string | number
  columnGap?: string | number
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "stretch"
  areas?: string
  inline?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

export interface GridItemProps {
  column?: string | number
  row?: string | number
  area?: string
  colSpan?: number
  rowSpan?: number
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function normalizeGap(gap: string | number | undefined): string | undefined {
  if (gap === undefined) return undefined
  return typeof gap === "number" ? `${gap}px` : gap
}

function normalizeTemplate(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === "number" ? `repeat(${value}, 1fr)` : value
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: GridRootProps) {
  const styles = (): JSX.CSSProperties => ({
    display: props.inline ? "inline-grid" : "grid",
    "grid-template-columns": normalizeTemplate(props.columns),
    "grid-template-rows": normalizeTemplate(props.rows),
    gap: normalizeGap(props.gap),
    "row-gap": normalizeGap(props.rowGap),
    "column-gap": normalizeGap(props.columnGap),
    "align-items": props.align,
    "justify-items": props.justify,
    "grid-template-areas": props.areas,
    ...(typeof props.style === "object" ? props.style : {}),
  })

  return (
    <div
      class={props.class}
      style={typeof props.style === "string" ? props.style : styles()}
      {...applySemanticAttrs({ scope: "grid", part: "root" })}
    >
      {props.children}
    </div>
  )
}

export function Item(props: GridItemProps) {
  const styles = (): JSX.CSSProperties => ({
    "grid-column": props.colSpan
      ? `span ${props.colSpan}`
      : props.column !== undefined
        ? String(props.column)
        : undefined,
    "grid-row": props.rowSpan
      ? `span ${props.rowSpan}`
      : props.row !== undefined
        ? String(props.row)
        : undefined,
    "grid-area": props.area,
    ...(typeof props.style === "object" ? props.style : {}),
  })

  return (
    <div
      class={props.class}
      style={typeof props.style === "string" ? props.style : styles()}
      {...applySemanticAttrs({ scope: "grid", part: "item" })}
    >
      {props.children}
    </div>
  )
}
