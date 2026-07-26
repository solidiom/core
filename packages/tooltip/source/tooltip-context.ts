/**
 * Tooltip context — shared state between Tooltip parts.
 */

import { createContext, useContext, type Accessor } from "solid-js"
import type { ChangeDetails, DisclosureReason, PresencePhase } from "@solidiom/runtime"

/** Positioning adapter port injected by the consumer. */
export interface PositioningPort {
  /** Compute and apply position styles to the content element. */
  update: (reference: HTMLElement, floating: HTMLElement) => void | (() => void)
}

export interface TooltipContextValue {
  /** Whether the tooltip is open. */
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
  /** Optional positioning adapter. */
  positioning?: PositioningPort
  /** Trigger reference for positioning. */
  triggerRef: Accessor<HTMLElement | undefined>
  /** Set the trigger reference element. */
  setTriggerRef: (el: HTMLElement | undefined) => void
}

export const TooltipContext = createContext<TooltipContextValue>()

/** Access the tooltip context. Throws if used outside Root. */
export function useTooltipContext(): TooltipContextValue {
  const ctx = useContext(TooltipContext)
  if (!ctx) {
    throw new Error("[solidiom] Tooltip parts must be used within Tooltip.Root")
  }
  return ctx
}
