/**
 * Owner-scoped cleanup — ties disposal of listeners, observers, timers,
 * and engine handles to the current reactive owner's lifetime.
 *
 * Per §8.2: cleanup is tied to the current owner. When the owner disposes
 * (component unmounts), all registered cleanups run automatically.
 */

import { onCleanup, getOwner } from "solid-js"

/**
 * Registers a cleanup function on the current reactive owner.
 *
 * Returns `true` if registration succeeded (an owner exists),
 * `false` if no owner is available (e.g. called outside a reactive context).
 * In the false case, the caller is responsible for manual cleanup.
 */
export function onOwnerCleanup(cleanup: () => void): boolean {
  if (getOwner()) {
    onCleanup(cleanup)
    return true
  }
  return false
}

/**
 * Creates a disposable resource tied to the current owner.
 *
 * Calls `setup()` immediately and registers `teardown()` on the owner.
 * If no owner exists, still calls setup but returns a manual dispose function.
 */
export function createDisposable(setup: () => void, teardown: () => void): () => void {
  setup()
  const registered = onOwnerCleanup(teardown)
  return registered ? () => {} : teardown
}
