/**
 * Listbox context — shared state between Listbox parts.
 */

import { createContext, useContext, type Accessor } from "solid-js"
import type { ChangeDetails, Collection, RovingFocus, Typeahead } from "@solidiom/runtime"

export type ListboxSelectionMode = "single" | "multiple"
export type ListboxReason = "item-click" | "keyboard" | "programmatic"

export interface ListboxContextValue {
  /** Currently selected value(s). */
  value: Accessor<string[]>
  /** Request value change. */
  requestValueChange: (next: string[], details: ChangeDetails<ListboxReason>) => void
  /** Selection mode. */
  selectionMode: ListboxSelectionMode
  /** Collection instance for item management. */
  collection: Collection
  /** Roving focus instance. */
  rovingFocus: RovingFocus
  /** Typeahead instance. */
  typeahead: Typeahead
  /** Generated listbox ID. */
  listboxId: string
  /** Whether the listbox is disabled. */
  disabled: Accessor<boolean>
}

export const ListboxContext = createContext<ListboxContextValue>()

/** Access the listbox context. Throws if used outside Root. */
export function useListboxContext(): ListboxContextValue {
  const ctx = useContext(ListboxContext)
  if (!ctx) {
    throw new Error("[solidiom] Listbox parts must be used within Listbox.Root")
  }
  return ctx
}
