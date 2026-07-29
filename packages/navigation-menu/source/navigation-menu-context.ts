/**
 * Navigation menu context — shared state between NavigationMenu parts.
 */

import { createContext, useContext, type Accessor } from "solid-js"
import type { Collection, RovingFocus, PointerIntent } from "@solidiom/runtime"

/** Positioning adapter port injected by the consumer. */
export interface PositioningPort {
  /** Compute and apply position styles to the content element. */
  update: (reference: HTMLElement, floating: HTMLElement) => void | (() => void)
}

export interface NavigationMenuContextValue {
  /** Currently active (open) item value. */
  activeValue: Accessor<string>
  /** Request a value change (open a specific item's content). */
  setActiveValue: (value: string) => void
  /** Close all sub-menus. */
  close: () => void
  /** Collection of trigger items for roving focus. */
  collection: Collection
  /** Roving focus manager for the trigger list. */
  rovingFocus: RovingFocus
  /** Pointer intent tracker instance. */
  pointerIntent: PointerIntent
  /** Orientation of the navigation bar. */
  orientation: Accessor<"horizontal" | "vertical">
  /** Optional positioning adapter. */
  positioning?: PositioningPort
  /** Delay for pointer intent (ms). */
  delayDuration: number
}

export const NavigationMenuContext = createContext<NavigationMenuContextValue>()

/** Access the navigation menu context. Throws if used outside Root. */
export function useNavigationMenuContext(): NavigationMenuContextValue {
  const ctx = useContext(NavigationMenuContext)
  if (!ctx) {
    throw new Error("[solidiom] NavigationMenu parts must be used within NavigationMenu.Root")
  }
  return ctx
}

/** Item-level context for linking trigger to content. */
export interface NavigationMenuItemContextValue {
  /** Unique value identifying this item. */
  value: string
  /** Whether this item's content is open. */
  isOpen: Accessor<boolean>
  /** Generated trigger ID. */
  triggerId: string
  /** Generated content ID. */
  contentId: string
  /**
   * This item's trigger element, used as the positioning reference for its
   * Content panel and as the roving-focus target in the parent collection.
   *
   * Lives on item context rather than root context because a navigation bar
   * has one trigger/content pair per Item, unlike single-anchor primitives
   * (tooltip, hover-card, popover) which keep one trigger ref on the root.
   */
  triggerRef: Accessor<HTMLElement | undefined>
  /** Registers this item's trigger element. Called by Trigger. */
  setTriggerRef: (element: HTMLElement | undefined) => void
}

export const NavigationMenuItemContext = createContext<NavigationMenuItemContextValue>()

/** Access item context. Throws if used outside Item. */
export function useNavigationMenuItemContext(): NavigationMenuItemContextValue {
  const ctx = useContext(NavigationMenuItemContext)
  if (!ctx) {
    throw new Error(
      "[solidiom] NavigationMenu.Trigger/Content must be used within NavigationMenu.Item",
    )
  }
  return ctx
}
