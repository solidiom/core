/**
 * Minimal positioning adapter — purpose-built without engine dependencies.
 *
 * Implements the same PositioningCapability@1 interface as the Floating UI adapter.
 * Supports basic placement, offset, and optional flip (collision avoidance).
 */
export type Placement = "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end";
export interface PositioningResult {
    x: number;
    y: number;
    placement: Placement;
    arrowX?: number;
    arrowY?: number;
}
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
export interface PositioningCapability {
    compute(input: PositioningInput): PositioningResult;
    destroy(): void;
}
export interface MinimalPositioningOptions {
    /** Enable basic flip when floating overflows viewport. Default: false. */
    flip?: boolean;
    /** Viewport dimensions for flip calculation. */
    viewport?: {
        width: number;
        height: number;
    };
}
/**
 * Creates a minimal positioning adapter.
 * Zero external dependencies. Deterministic arithmetic positioning.
 */
export declare function createMinimalPositioning(options?: MinimalPositioningOptions): PositioningCapability;
//# sourceMappingURL=minimal-adapter.d.ts.map