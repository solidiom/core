/**
 * @solidiom/adapter-positioning-minimal — Minimal purpose-built positioning adapter.
 *
 * Implements PositioningCapability@1 without any external engine dependency.
 * ~200 lines. Proves adapter swap invariance (§23 #70): primitives produce
 * identical DOM regardless of which positioning adapter is active.
 *
 * Supports: placement, offset, basic viewport collision (flip).
 * Does not support: shift, arrow, auto placement, size middleware.
 */

export { createMinimalPositioning } from "./minimal-adapter"
export type {
  PositioningCapability,
  PositioningInput,
  PositioningResult,
  Placement,
  MinimalPositioningOptions,
} from "./minimal-adapter"
