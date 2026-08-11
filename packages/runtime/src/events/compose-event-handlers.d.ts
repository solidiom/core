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
export declare function composeEventHandlers<E extends Event>(
  ...handlers: EventHandler<E>[]
): ((event: E) => void) | undefined
export {}
//# sourceMappingURL=compose-event-handlers.d.ts.map
