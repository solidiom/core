/**
 * Tooltip primitive — hover/focus tooltip with configurable open/close delays,
 * escape dismissal, positioning port, and presence phases.
 *
 * Parts: Root, Trigger, Content.
 */
import { type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import { type ChangeDetails, type DisclosureReason } from "@solidiom/runtime"
import { type PositioningPort } from "./tooltip-context"
/** Props for the tooltip root provider. */
export interface TooltipRootProps {
  /** Controlled open state. */
  open?: Accessor<boolean>
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean
  /** Called when open state change is requested. */
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Delay in ms before opening on hover. Default: 700. */
  openDelay?: number
  /** Delay in ms before closing on mouseleave. Default: 300. */
  closeDelay?: number
  /** Positioning adapter for floating placement. */
  positioning?: PositioningPort
  children: JSX.Element
}
/** Root provider that manages tooltip open state and context. */
export declare function Root(props: TooltipRootProps): JSX.Element
/** Props for the tooltip trigger element. */
export interface TooltipTriggerProps {
  children: JSX.Element
  ref?: (el: HTMLElement) => void
}
/** Element that activates the tooltip on hover/focus. */
export declare function Trigger(props: TooltipTriggerProps): JSX.Element
/** Props for the tooltip content element. */
export interface TooltipContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLDivElement) => void
}
/** Tooltip content panel with positioning and presence. */
export declare function Content(props: TooltipContentProps): JSX.Element
//# sourceMappingURL=tooltip.d.ts.map
