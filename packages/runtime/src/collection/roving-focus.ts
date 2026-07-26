/**
 * Roving focus — manages tabindex across a collection so only the active item
 * is tabbable (tabindex=0) and all others are removed from tab order (tabindex=-1).
 *
 * Per §9.2: the active item receives focus on arrow-key navigation.
 * Supports both roving tabindex and aria-activedescendant modes.
 */

import { createSignal, type Accessor } from "solid-js"
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
export function createRovingFocus(options: RovingFocusOptions = {}): RovingFocus {
  const isControlled = () => options.activeId !== undefined && options.activeId() !== undefined

  const [internal, setInternal] = createSignal<string | undefined>(options.defaultActiveId, {
    ownedWrite: true,
  })

  const activeId: Accessor<string | undefined> = () => {
    if (isControlled()) return options.activeId!()
    return internal()
  }

  const setActiveId = (id: string, focus = true): void => {
    if (!isControlled()) {
      setInternal(id)
    }
    options.onActiveIdChange?.(id)

    if (focus && !options.virtual) {
      // In roving tabindex mode, focus the element directly
      // The caller is responsible for providing the DOM element
      // This is handled at the primitive level via ref lookup
    }
  }

  const getTabIndex = (itemId: string): 0 | -1 => {
    if (options.virtual) return -1
    return activeId() === itemId ? 0 : -1
  }

  const onFocusIn = (enabledItems: CollectionItem[]): void => {
    // If no active item, activate the first enabled item
    if (!activeId() && enabledItems.length > 0) {
      const first = enabledItems[0]!
      setActiveId(first.id, false)
    }
  }

  return { activeId, setActiveId, getTabIndex, onFocusIn }
}
