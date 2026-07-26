/**
 * Dialog context — shared state between Dialog parts.
 */

import { createContext, useContext, type Accessor } from "solid-js"
import type { ChangeDetails, DisclosureReason, PresencePhase } from "@solidiom/runtime"

export interface DialogContextValue {
  open: Accessor<boolean>
  requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void
  contentId: string
  titleId: string
  descriptionId: string
  triggerId: string
  phase: Accessor<PresencePhase>
  present: Accessor<boolean>
  modal: boolean
}

export const DialogContext = createContext<DialogContextValue>()

export function useDialogContext(): DialogContextValue {
  const ctx = useContext(DialogContext)
  if (!ctx) {
    throw new Error("[solidiom] Dialog parts must be used within Dialog.Root")
  }
  return ctx
}
