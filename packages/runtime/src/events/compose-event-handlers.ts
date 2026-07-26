/**
 * Event handler composition — chains multiple event handlers with short-circuit on preventDefault.
 *
 * Primitives compose internal handlers with user-provided handlers. If an earlier handler
 * calls `event.preventDefault()`, subsequent handlers are skipped.
 */

/** Any DOM event handler — a plain function, a Solid bound tuple, or undefined. */
type EventHandler<E extends Event> =
  ((event: E) => void) | readonly [handler: (data: any, event: E) => void, data: any] | undefined

/**
 * Composes multiple event handlers into a single handler.
 *
 * Handlers run in order. If any handler calls `event.preventDefault()`,
 * subsequent handlers are not invoked.
 *
 * Returns undefined when no handlers are provided.
 */
export function composeEventHandlers<E extends Event>(
  ...handlers: EventHandler<E>[]
): ((event: E) => void) | undefined {
  const filtered = handlers.filter((h): h is NonNullable<typeof h> => h != null)
  if (filtered.length === 0) return undefined

  return (event: E) => {
    for (const handler of filtered) {
      if (event.defaultPrevented) break

      if (typeof handler === "function") {
        handler(event)
      } else {
        // Solid's bound event handler tuple: [handler, data]
        handler[0](handler[1], event)
      }
    }
  }
}
