/**
 * Stable ID generation — SSR-deterministic IDs for ARIA relationships.
 *
 * Per §8.6: IDs must be deterministic between server and client to avoid
 * hydration mismatches. Uses a monotonic counter scoped to the module.
 *
 * In production, Solid's rendering pass will call these in the same order
 * on server and client, producing matching IDs. For non-deterministic
 * environments (tests, dynamic insertion), uniqueness is guaranteed but
 * server/client parity requires component-tree-order stability.
 */

let counter = 0

/**
 * Creates a stable, unique ID with an optional prefix for debuggability.
 *
 * Must be called during component initialization to maintain server/client parity.
 * The prefix aids DOM inspection but has no semantic meaning.
 */
export function createStableId(prefix = "solidiom"): string {
  return `${prefix}-${++counter}`
}

/**
 * Resets the ID counter. Used in SSR to synchronize server/client sequences.
 * @internal — not part of the public API; used by framework integration.
 */
export function resetIdCounter(): void {
  counter = 0
}
