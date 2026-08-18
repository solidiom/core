/**
 * @solidiom/chart — Data visualization wrapper with accessible fallback table.
 *
 * Parts: Root, Canvas, FallbackTable, Legend, Title, Description.
 * Integration shell — actual charting is done by external adapter libraries.
 * Canvas exposes ref for external libraries to render into.
 */

import { createContext, useContext, For, type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs, createStableId } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  label: string
  value: number
}

export type ChartType = "bar" | "line" | "pie" | "area"

export interface ChartRootProps {
  /** Data points for the chart. */
  data?: ChartDataPoint[]
  /** Type of chart visualization. */
  type?: ChartType
  class?: string
  children: JSX.Element
}

export interface ChartCanvasProps {
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLDivElement) => void
  children?: JSX.Element
}

export interface ChartFallbackTableProps {
  class?: string
  /** Visually hidden by default for screen readers. */
  visuallyHidden?: boolean
  children?: JSX.Element
}

export interface ChartLegendProps {
  class?: string
  children?: JSX.Element
}

export interface ChartTitleProps {
  class?: string
  children: JSX.Element
}

export interface ChartDescriptionProps {
  class?: string
  children: JSX.Element
}

// ─── Context ────────────────────────────────────────────────────────────────

interface ChartContextValue {
  data: Accessor<ChartDataPoint[]>
  type: Accessor<ChartType>
  titleId: string
  descriptionId: string
}

const ChartContext = createContext<ChartContextValue>()

function useChartContext(): ChartContextValue {
  const ctx = useContext(ChartContext)
  if (!ctx) throw new Error("Chart parts must be used within Chart.Root")
  return ctx
}

// ─── Components ─────────────────────────────────────────────────────────────

export function Root(props: ChartRootProps) {
  const titleId = createStableId("chart-title")
  const descriptionId = createStableId("chart-desc")

  const data = () => props.data ?? []
  const type = () => props.type ?? "bar"

  const ctx: ChartContextValue = {
    data,
    type,
    titleId,
    descriptionId,
  }

  return (
    <ChartContext value={ctx}>
      <div
        role="figure"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        class={props.class}
        data-type={type()}
        {...applySemanticAttrs({ scope: "chart", part: "root" })}
      >
        {props.children}
      </div>
    </ChartContext>
  )
}

export function Canvas(props: ChartCanvasProps) {
  useChartContext()

  return (
    <div
      class={props.class}
      style={props.style}
      ref={props.ref}
      aria-hidden="true"
      {...applySemanticAttrs({ scope: "chart", part: "canvas" })}
    >
      {props.children}
    </div>
  )
}

export function FallbackTable(props: ChartFallbackTableProps) {
  const ctx = useChartContext()
  const visuallyHidden = () => props.visuallyHidden ?? true

  const hiddenStyle: JSX.CSSProperties = {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    "white-space": "nowrap",
    "border-width": "0",
  }

  return (
    <div
      class={props.class}
      style={visuallyHidden() ? hiddenStyle : undefined}
      {...applySemanticAttrs({ scope: "chart", part: "fallback-table" })}
    >
      {props.children ?? (
        <table>
          <caption>Chart data</caption>
          <thead>
            <tr>
              <th scope="col">Label</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <For each={ctx.data()}>
              {(point) => (
                <tr>
                  <td>{point.label}</td>
                  <td>{point.value}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      )}
    </div>
  )
}

export function Legend(props: ChartLegendProps) {
  useChartContext()

  return (
    <div class={props.class} {...applySemanticAttrs({ scope: "chart", part: "legend" })}>
      {props.children}
    </div>
  )
}

export function Title(props: ChartTitleProps) {
  const ctx = useChartContext()

  return (
    <div
      id={ctx.titleId}
      class={props.class}
      {...applySemanticAttrs({ scope: "chart", part: "title" })}
    >
      {props.children}
    </div>
  )
}

export function Description(props: ChartDescriptionProps) {
  const ctx = useChartContext()

  return (
    <div
      id={ctx.descriptionId}
      class={props.class}
      {...applySemanticAttrs({ scope: "chart", part: "description" })}
    >
      {props.children}
    </div>
  )
}
