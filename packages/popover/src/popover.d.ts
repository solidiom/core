/**
 * Popover primitive — dismissable floating panel with focus trapping,
 * outside-click/escape dismissal, positioning port, and presence phases.
 *
 * Parts: Root, Trigger, Content, Close, Anchor.
 */
import { type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import { type ChangeDetails, type DisclosureReason } from "@solidiom/runtime"
import { type PositioningPort } from "./popover-context"
/** Props for the popover root provider. */
export interface PopoverRootProps {
  /** Controlled open state. */
  open?: Accessor<boolean>
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean
  /** Called when open state change is requested. */
  onOpenChange?: (open: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Whether the popover is modal (traps focus). Default: false. */
  modal?: boolean
  /** Positioning adapter for floating placement. */
  positioning?: PositioningPort
  children: JSX.Element
}
/** Root provider that manages popover open state and context. */
export declare function Root(props: PopoverRootProps): JSX.Element
/** Props for the popover anchor element. */
export interface PopoverAnchorProps {
  children: JSX.Element
  ref?: (el: HTMLElement) => void
}
/** Optional anchor element that overrides the trigger as positioning reference. */
export declare function Anchor(props: PopoverAnchorProps): JSX.Element
/** Props for the popover trigger button. */
export interface PopoverTriggerProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLButtonElement) => void
}
/** Button that toggles the popover open state. */
export declare function Trigger(props: PopoverTriggerProps): JSX.Element
/** Props for the popover content panel. */
export interface PopoverContentProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLDivElement) => void
  /** Disable focus trapping. Default: true (trapping enabled when modal). */
  trapFocus?: boolean
}
/** Floating content panel with dismiss behavior and optional focus trapping. */
export declare function Content(props: PopoverContentProps): JSX.Element
/** Props for the popover close button. */
export interface PopoverCloseProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLButtonElement) => void
}
/** Button that closes the popover. */
export declare function Close(props: PopoverCloseProps): JSX.Element
//# sourceMappingURL=popover.d.ts.map
