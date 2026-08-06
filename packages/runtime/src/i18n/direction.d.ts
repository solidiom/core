/**
 * Direction — RTL/LTR text direction propagation.
 *
 * Per §9.5: direction propagates through the component tree.
 * Primitives read direction to flip keyboard navigation and layout.
 *
 * Solid 2 rule: context IS the provider. Consumers write:
 *   <DirectionContext value="rtl">…</DirectionContext>
 * Primitives read via useContext(DirectionContext) with "ltr" default.
 */
import { type Accessor } from "solid-js";
/** Text direction values. */
export type Direction = "ltr" | "rtl";
/**
 * DirectionContext — Solid 2 context for RTL/LTR propagation.
 *
 * Usage:
 * ```tsx
 * import { DirectionContext } from "@solidiom/runtime"
 *
 * // Provider (context IS the provider in Solid 2):
 * <DirectionContext value="rtl">
 *   <App />
 * </DirectionContext>
 *
 * // Consumer (inside a primitive):
 * const dir = useDirection() // "rtl"
 * ```
 */
export declare const DirectionContext: import("solid-js").Context<Direction>;
/**
 * Reads the current text direction from DirectionContext.
 * Returns "ltr" if no provider is found.
 */
export declare function useDirection(): Direction;
/** Options for resolving direction. */
export interface DirectionOptions {
    /** Explicit direction override. */
    direction?: Accessor<Direction | undefined>;
    /** Element to read `dir` attribute from (fallback). */
    element?: () => Element | undefined;
}
/**
 * Resolves the current text direction.
 *
 * Priority: explicit prop > element's computed dir > "ltr" default.
 */
export declare function resolveDirection(options?: DirectionOptions): Accessor<Direction>;
//# sourceMappingURL=direction.d.ts.map