/**
 * Resizable panels primitive — drag-to-resize panel layout with keyboard support,
 * collapse behavior, and ARIA separator semantics.
 *
 * Parts: PanelGroup, Panel, Handle.
 */
import { type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import { type ChangeDetails } from "@solidiom/runtime"
import { type PanelResizeReason } from "./panels-context"
/** Props for the resizable panel group container. */
export interface PanelGroupProps {
  /** Layout direction. Default: "horizontal". */
  direction?: "horizontal" | "vertical"
  /** Controlled panel sizes as percentages. */
  sizes?: Accessor<number[]>
  /** Default sizes for uncontrolled mode. */
  defaultSizes?: number[]
  /** Called when panel sizes change. */
  onSizesChange?: (sizes: number[], details: ChangeDetails<PanelResizeReason>) => void
  children: JSX.Element
  class?: string
}
/** Root container that manages panel layout and resize state. */
export declare function PanelGroup(props: PanelGroupProps): JSX.Element
/** Props for an individual resizable panel. */
export interface PanelProps {
  /** Unique order index for this panel within the group. */
  order: number
  /** Size constraints for this panel. */
  minSize?: number
  maxSize?: number
  defaultSize?: number
  /** Whether the panel can collapse to 0 below minSize. */
  collapsible?: boolean
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLDivElement) => void
}
/** A single resizable panel within a PanelGroup. */
export declare function Panel(props: PanelProps): JSX.Element
/** Props for a resize handle between panels. */
export interface HandleProps {
  /** The index of the handle (separates panel[index] and panel[index+1]). */
  index: number
  /** Whether this handle is disabled. */
  disabled?: boolean
  children?: JSX.Element
  class?: string
  ref?: (el: HTMLDivElement) => void
}
/** Drag handle (separator) between two adjacent panels. */
export declare function Handle(props: HandleProps): JSX.Element
//# sourceMappingURL=panels.d.ts.map
