/**
 * Floating UI positioning adapter — wraps @floating-ui/dom's computePosition
 * behind the PositioningCapability@1 interface.
 *
 * Per §14.4: emits no classes, ARIA, data-* attributes, or roles.
 * Returns numeric x/y coordinates and resolved placement only.
 */
import type { PositioningCapability } from "./capability";
/** Options for the Floating UI adapter. */
export interface FloatingUIPositioningOptions {
    /** Whether to enable flip middleware. Default: true. */
    flip?: boolean;
    /** Whether to enable shift middleware. Default: true. */
    shift?: boolean;
    /** Arrow element for arrow positioning. */
    arrowElement?: HTMLElement;
    /** Boundary element for collision detection. */
    boundary?: Element;
}
/**
 * Creates a Floating UI positioning adapter implementing PositioningCapability@1.
 *
 * This adapter wraps `computePosition` from @floating-ui/dom.
 * It performs async computation but exposes a sync interface by caching results.
 *
 * For the synchronous test-double-compatible interface, use the
 * compute method which returns the last computed result or a default.
 */
export declare function createFloatingUIPositioning(options?: FloatingUIPositioningOptions): PositioningCapability;
//# sourceMappingURL=floating-ui-adapter.d.ts.map