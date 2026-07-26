/**
 * Select context — shared state between Select parts.
 */

import { createContext, useContext, type Accessor } from "solid-js"
import type {
  ChangeDetails,
  DisclosureReason,
  Collection,
  RovingFocus,
  Typeahead,
} from "@solidiom/runtime"

export interface SelectContextValue {
  /** Whether the listbox is open. */
  open: Accessor<boolean>
  /** Request open state change. */
  requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Currently selected value(s). */
  value: Accessor<string | string[]>
  /** Request value change. */
  requestValueChange: (next: string | string[], details: ChangeDetails<SelectReason>) => void
  /** Whether multiple selection is enabled. */
  multiple: boolean
  /** Whether the select is disabled. */
  disabled: Accessor<boolean>
  /** Collection instance. */
  collection: Collection
  /** Roving focus instance. */
  rovingFocus: RovingFocus
  /** Typeahead instance. */
  typeahead: Typeahead
  /** Generated IDs. */
  triggerId: string
  listboxId: string
  labelId: string
  /** Form field name. */
  name?: string
}

export type SelectReason = "item-click" | "keyboard" | "programmatic"

export const SelectContext = createContext<SelectContextValue>()

export function useSelectContext(): SelectContextValue {
  const ctx = useContext(SelectContext)
  if (!ctx) {
    throw new Error("[solidiom] Select parts must be used within Select.Root")
  }
  return ctx
}
