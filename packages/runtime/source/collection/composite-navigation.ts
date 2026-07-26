/**
 * Composite navigation — resolves arrow keys, Home/End/PageUp/PageDown
 * into next/previous item navigation within a collection.
 *
 * Per §9.2: handles orientation (horizontal/vertical/both), RTL direction flip,
 * and wrap-around behavior. Operates on the enabled items subset.
 */

import type { CollectionItem } from "./collection"

/** Navigation intent produced from a keyboard event. */
export type NavigationIntent = "next" | "previous" | "first" | "last" | "pageUp" | "pageDown"

/** Options for resolving a keyboard event into a navigation intent. */
export interface NavigationOptions {
  orientation: "horizontal" | "vertical" | "both"
  direction: "ltr" | "rtl"
  /** Whether navigation wraps from last to first and vice versa. */
  loop?: boolean
  /** Number of items to skip for PageUp/PageDown. Default: 5. */
  pageSize?: number
}

/**
 * Resolves a keyboard event key into a navigation intent, or undefined
 * if the key is not a navigation key for the given orientation/direction.
 */
export function resolveNavigationIntent(
  key: string,
  options: NavigationOptions,
): NavigationIntent | undefined {
  const { orientation, direction } = options

  // Home/End always apply
  if (key === "Home") return "first"
  if (key === "End") return "last"
  if (key === "PageUp") return "pageUp"
  if (key === "PageDown") return "pageDown"

  const isHorizontal = orientation === "horizontal" || orientation === "both"
  const isVertical = orientation === "vertical" || orientation === "both"
  const isRtl = direction === "rtl"

  if (key === "ArrowDown" && isVertical) return "next"
  if (key === "ArrowUp" && isVertical) return "previous"

  if (key === "ArrowRight" && isHorizontal) {
    return isRtl ? "previous" : "next"
  }
  if (key === "ArrowLeft" && isHorizontal) {
    return isRtl ? "next" : "previous"
  }

  return undefined
}

/**
 * Given the current active item ID and a navigation intent, returns
 * the next item to activate from the enabled items list.
 *
 * Returns undefined if navigation cannot proceed (e.g. at boundary without loop).
 */
export function resolveNextItem(
  enabledItems: CollectionItem[],
  currentId: string | undefined,
  intent: NavigationIntent,
  options: Pick<NavigationOptions, "loop" | "pageSize"> = {},
): CollectionItem | undefined {
  const { loop = false, pageSize = 5 } = options

  if (enabledItems.length === 0) return undefined

  if (intent === "first") return enabledItems[0]
  if (intent === "last") return enabledItems[enabledItems.length - 1]

  const currentIndex = currentId ? enabledItems.findIndex((item) => item.id === currentId) : -1

  if (intent === "next") {
    if (currentIndex === -1) return enabledItems[0]
    const nextIndex = currentIndex + 1
    if (nextIndex >= enabledItems.length) {
      return loop ? enabledItems[0] : undefined
    }
    return enabledItems[nextIndex]
  }

  if (intent === "previous") {
    if (currentIndex === -1) return enabledItems[enabledItems.length - 1]
    const prevIndex = currentIndex - 1
    if (prevIndex < 0) {
      return loop ? enabledItems[enabledItems.length - 1] : undefined
    }
    return enabledItems[prevIndex]
  }

  if (intent === "pageDown") {
    if (currentIndex === -1) return enabledItems[0]
    const targetIndex = Math.min(currentIndex + pageSize, enabledItems.length - 1)
    return enabledItems[targetIndex]
  }

  if (intent === "pageUp") {
    if (currentIndex === -1) return enabledItems[enabledItems.length - 1]
    const targetIndex = Math.max(currentIndex - pageSize, 0)
    return enabledItems[targetIndex]
  }

  return undefined
}
