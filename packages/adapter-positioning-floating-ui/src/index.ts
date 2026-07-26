/**
 * @solidiom/adapter-positioning-floating-ui — Floating UI positioning adapter.
 *
 * Implements PositioningCapability@1 using @floating-ui/dom.
 * Emits no classes, ARIA, data-* attributes, or roles (§14.4).
 * Returns numeric positioning snapshots only.
 */

export {
  createFloatingUIPositioning,
  type FloatingUIPositioningOptions,
} from "./floating-ui-adapter"

// Re-export the capability interface for type-checking
export type {
  PositioningCapability,
  PositioningInput,
  PositioningResult,
  Placement,
} from "./capability"
