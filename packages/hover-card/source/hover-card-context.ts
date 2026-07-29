/**
 * HoverCard context — shared state between HoverCard parts.
 */

import { createContext, useContext, type Accessor } from "solid-js"

/** Positioning adapter port injected by the consumer. */
export interface PositioningPort {
  /** Compute and apply position styles to the content element. */
  update: (reference: HTMLElement, floating: HTMLElement) => void | (() => void)
}

export interface HoverCardContextValue {
  /** Whether the hover card is open. */
  open: Accessor<boolean>
  /** Called when the trigger is entered (pointer/focus). */
  onTriggerEnter: () => void
  /** Called when the trigger is left. */
  onTriggerLeave: () => void
  /** Called when the content is entered (keeps it open). */
  onContentEnter: () => void
  /** Called when the content is left. */
  onContentLeave: () => void
  /** Generated content ID. */
  contentId: string
  /** Generated trigger ID. */
  triggerId: string
  /** Optional positioning adapter. */
  positioning?: PositioningPort
  /** Trigger reference for positioning. */
  triggerRef: Accessor<HTMLElement | undefined>
  /** Set the trigger reference element. */
  setTriggerRef: (el: HTMLElement | undefined) => void
}

export const HoverCardContext = createContext<HoverCardContextValue>()

/** Access the hover card context. Throws if used outside Root. */
export function useHoverCardContext(): HoverCardContextValue {
  const ctx = useContext(HoverCardContext)
  if (!ctx) {
    throw new Error("[solidiom] HoverCard parts must be used within HoverCard.Root")
  }
  return ctx
}
