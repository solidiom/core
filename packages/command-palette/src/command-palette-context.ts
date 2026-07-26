/**
 * Command palette context — shared state between CommandPalette parts.
 */

import { createContext, useContext, type Accessor } from "solid-js"
import type { ChangeDetails, DisclosureReason, Collection } from "@solidiom/runtime"

export interface CommandPaletteContextValue {
  /** Whether the palette is open. */
  open: Accessor<boolean>
  /** Request open state change. */
  requestOpenChange: (next: boolean, details: ChangeDetails<DisclosureReason>) => void
  /** Current input filter value. */
  inputValue: Accessor<string>
  /** Set input filter value. */
  setInputValue: (next: string) => void
  /** Currently highlighted item id. */
  highlightedId: Accessor<string | null>
  /** Set highlighted item id. */
  setHighlightedId: (id: string | null) => void
  /** Collection instance for item registration. */
  collection: Collection
  /** Generated IDs. */
  inputId: string
  listId: string
  contentId: string
}

export const CommandPaletteContext = createContext<CommandPaletteContextValue>()

/** Retrieve command palette context. Throws if used outside CommandPalette.Root. */
export function useCommandPaletteContext(): CommandPaletteContextValue {
  const ctx = useContext(CommandPaletteContext)
  if (!ctx) {
    throw new Error("[solidiom] CommandPalette parts must be used within CommandPalette.Root")
  }
  return ctx
}
