/**
 * Direction — RTL/LTR text direction propagation.
 *
 * Per §9.5: direction propagates through the component tree.
 * Primitives read direction to flip keyboard navigation and layout.
 */
import { type Accessor } from "solid-js"
/** Text direction values. */
export type Direction = "ltr" | "rtl"
/** Options for resolving direction. */
export interface DirectionOptions {
  /** Explicit direction override. */
  direction?: Accessor<Direction | undefined>
  /** Element to read `dir` attribute from (fallback). */
  element?: () => Element | undefined
}
/**
 * Resolves the current text direction.
 *
 * Priority: explicit prop > element's computed dir > "ltr" default.
 */
export declare function resolveDirection(options?: DirectionOptions): Accessor<Direction>
//# sourceMappingURL=direction.d.ts.map
