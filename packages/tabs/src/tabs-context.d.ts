/**
 * Tabs context — shared state between Tabs parts.
 */
import { type Accessor } from "solid-js"
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
export declare const TabsContext: import("solid-js").Context<TabsContextValue>
/** Access the tabs context. Throws if used outside Root. */
export declare function useTabsContext(): TabsContextValue
//# sourceMappingURL=tabs-context.d.ts.map
