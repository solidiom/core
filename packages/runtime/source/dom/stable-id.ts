import { createUniqueId } from "solid-js"

/**
 * Stable ID generation — hydration-aware IDs for ARIA relationships.
 *
 * Solid assigns matching IDs to components during server rendering and hydration.
 * Calls outside a component owner (for example, standalone utilities and tests)
 * use a local fallback while preserving uniqueness.
 */

let counter = 0

/**
 * Creates a stable, unique ID with an optional prefix for debuggability.
 *
 * Call this while initializing a component to receive Solid's hydration-aware ID.
 * The fallback supports non-component callers where Solid has no owner ID.
 */
export function createStableId(prefix = "solidiom"): string {
  try {
    return `${prefix}-${createUniqueId()}`
  } catch {
    return `${prefix}-${++counter}`
  }
}

/**
 * Resets the ID counter. Used in SSR to synchronize server/client sequences.
 * @internal — not part of the public API; used by framework integration.
 */
export function resetIdCounter(): void {
  counter = 0
}
