/**
 * PositioningCapability@1 — the port interface that adapters must satisfy.
 *
 * Identical to the interface defined in @solidiom/test-doubles.
 * Duplicated here to avoid a runtime dependency on test-doubles.
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
//# sourceMappingURL=capability.d.ts.map