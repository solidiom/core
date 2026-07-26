/**
 * Deterministic positioning test double — implements PositioningCapability@1.
 *
 * Returns fixed coordinates based on input placement. Zero engine dependencies.
 * Produces identical output for identical input regardless of environment.
 */
/** Placement values supported by the positioning capability. */
export type Placement = "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end";
/** The result of a positioning computation. */
export interface PositioningResult {
    x: number;
    y: number;
    placement: Placement;
    arrowX?: number;
    arrowY?: number;
}
/** Input for a positioning computation. */
export interface PositioningInput {
    referenceRect: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    floatingRect: {
        width: number;
        height: number;
    };
    placement: Placement;
    offset?: number;
}
/** PositioningCapability@1 port shape. */
export interface PositioningCapability {
    compute(input: PositioningInput): PositioningResult;
    destroy(): void;
}
/**
 * Deterministic positioning double.
 *
 * Positions the floating element relative to the reference using simple
 * arithmetic — no viewport, scroll, or collision awareness.
 */
export declare function createPositioningDouble(): PositioningCapability;
//# sourceMappingURL=positioning.d.ts.map