/**
 * Tabs context — shared state between Tabs parts.
 */

import { createContext, useContext, type Accessor } from "solid-js"
import type { ChangeDetails, Collection, RovingFocus } from "@solidiom/runtime"

/** Reason for a tab value change. */
export type TabsReason = "trigger-click" | "keyboard"

/** Activation mode: automatic activates on focus, manual requires Enter/Space. */
export type ActivationMode = "automatic" | "manual"

export interface TabsContextValue {
  /** Currently active tab value. */
  value: Accessor<string>
  /** Request active tab change. */
  requestValueChange: (next: string, details: ChangeDetails<TabsReason>) => void
  /** Orientation for keyboard navigation. */
  orientation: Accessor<"horizontal" | "vertical">
  /** Activation mode. */
  activationMode: ActivationMode
  /** Collection of tab triggers. */
  collection: Collection
  /** Roving focus for tab triggers. */
  rovingFocus: RovingFocus
  /** Generated base ID for aria relationships. */
  baseId: string
}

export const TabsContext = createContext<TabsContextValue>()

/** Access the tabs context. Throws if used outside Root. */
export function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext)
  if (!ctx) {
    throw new Error("[solidiom] Tabs parts must be used within Tabs.Root")
  }
  return ctx
}
