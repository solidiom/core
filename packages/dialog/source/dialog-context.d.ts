/**
 * Dialog context — shared state between Dialog parts.
 */
import { type Accessor } from "solid-js"
import type { ChangeDetails, DisclosureReason, PresencePhase } from "@solidiom/runtime"
export interface DialogContextValue {
  open: Accessor<boolean>
  requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void
  contentId: string
  titleId: string
  descriptionId: string
  triggerId: string
  /**
   * The live Trigger DOM node, set directly by `Trigger`'s ref.
   *
   * `Content`'s focus restoration on close prefers this over an
   * `getElementById(triggerId)` lookup: `triggerId` comes from
   * `createStableId`, whose counter is shared with every other stable ID on
   * the page (nav, drawer, etc.) and is scoped to the current JS module
   * instance. On a partially hydrated page — an Astro island hydrating only
   * some components — the server-rendered `id` attribute in the DOM and the
   * client's recomputed `triggerId` can land on different counter values,
   * so the lookup silently fails and returns no element. A direct element
   * reference has no such server/client coordination requirement.
   */
  triggerEl: Accessor<HTMLElement | undefined>
  setTriggerEl: (el: HTMLElement | undefined) => void
  phase: Accessor<PresencePhase>
  present: Accessor<boolean>
  modal: boolean
}
export declare const DialogContext: import("solid-js").Context<DialogContextValue>
export declare function useDialogContext(): DialogContextValue
//# sourceMappingURL=dialog-context.d.ts.map
