/**
 * Popover context — shared state between Popover parts.
 */
import { type Accessor } from "solid-js"
import type { ChangeDetails, DisclosureReason, PresencePhase } from "@solidiom/runtime"
/** Positioning adapter port injected by the consumer. */
export interface PositioningPort {
  /** Compute and apply position styles to the content element. */
  update: (reference: HTMLElement, floating: HTMLElement) => void | (() => void)
}
export interface PopoverContextValue {
  /** Whether the popover is open. */
  open: Accessor<boolean>
  /** Request open state change. */
  requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Generated trigger ID. */
  triggerId: string
  /** Generated content ID. */
  contentId: string
  /** Presence phase for animation. */
  phase: Accessor<PresencePhase>
  /** Whether content should be mounted in the DOM. */
  present: Accessor<boolean>
  /** Whether the popover is modal. */
  modal: boolean
  /** Optional positioning adapter. */
  positioning?: PositioningPort
  /** Reference element for positioning (anchor or trigger). */
  anchorRef: Accessor<HTMLElement | undefined>
  /** Set the anchor reference element. */
  setAnchorRef: (el: HTMLElement | undefined) => void
  /** Set the trigger reference element. */
  setTriggerRef: (el: HTMLElement | undefined) => void
  /** Trigger reference for focus restoration. */
  triggerRef: Accessor<HTMLElement | undefined>
}
export declare const PopoverContext: import("solid-js").Context<PopoverContextValue>
/** Access the popover context. Throws if used outside Root. */
export declare function usePopoverContext(): PopoverContextValue
//# sourceMappingURL=popover-context.d.ts.map
