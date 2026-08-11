/**
 * Roving focus — manages tabindex across a collection so only the active item
 * is tabbable (tabindex=0) and all others are removed from tab order (tabindex=-1).
 *
 * Per §9.2: the active item receives focus on arrow-key navigation.
 * Supports both roving tabindex and aria-activedescendant modes.
 */
import { type Accessor } from "solid-js"
import type { CollectionItem } from "./collection"
/** Options for creating a roving focus manager. */
export interface RovingFocusOptions {
  /** The initial active item ID. If unset, first enabled item becomes active on first focus. */
  defaultActiveId?: string
  /** Controlled active item ID. */
  activeId?: Accessor<string | undefined>
  /** Called when active item changes. */
  onActiveIdChange?: (id: string) => void
  /** Whether to use aria-activedescendant mode instead of roving tabindex. */
  virtual?: boolean
}
/** The roving focus manager instance. */
export interface RovingFocus {
  /** Current active item ID. */
  activeId: Accessor<string | undefined>
  /** Set the active item and optionally focus it. */
  setActiveId: (id: string, focus?: boolean) => void
  /** Get the tabindex value for an item. */
  getTabIndex: (itemId: string) => 0 | -1
  /** Handle focus entering the collection (activates current or first item). */
  onFocusIn: (enabledItems: CollectionItem[]) => void
}
/**
 * Creates a roving focus manager for a collection.
 *
 * In roving tabindex mode: active item gets tabindex=0, others get tabindex=-1.
 * In virtual mode: the container is tabbable and uses aria-activedescendant.
 */
export declare function createRovingFocus(options?: RovingFocusOptions): RovingFocus
//# sourceMappingURL=roving-focus.d.ts.map
