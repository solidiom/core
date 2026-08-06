/**
 * Presence — separates semantic visibility from DOM retention.
 *
 * Per §9.4: a closed overlay can remain mounted for an exit animation
 * without remaining semantically modal or focus-trapped.
 *
 * Phase transitions: exited → entering → entered → exiting → exited
 */
import { type Accessor } from "solid-js";
/** The current phase of a presence lifecycle. */
export type PresencePhase = "entering" | "entered" | "exiting" | "exited";
/** The presence state returned by createPresence. */
export interface PresenceState {
    /** Whether the element is semantically open. */
    open: Accessor<boolean>;
    /** Whether the element should be present in the DOM (mounted). */
    present: Accessor<boolean>;
    /** Current animation/transition phase. */
    phase: Accessor<PresencePhase>;
    /** Signal that an enter animation has completed. */
    onEntered: () => void;
    /** Signal that an exit animation has completed. */
    onExited: () => void;
}
/** Options for creating a presence state. */
export interface PresenceOptions {
    /** Whether the element is semantically open. */
    open: Accessor<boolean>;
    /**
     * Whether to animate transitions. When false, phase jumps directly
     * to "entered"/"exited" without intermediate states.
     */
    animated?: boolean;
}
/**
 * Creates a presence state machine that coordinates semantic open state
 * with DOM mounting and animation phases.
 *
 * When `animated` is false (default):
 * - open=true → phase="entered", present=true
 * - open=false → phase="exited", present=false
 *
 * When `animated` is true:
 * - open=true → phase="entering", present=true (call onEntered when done)
 * - open=false → phase="exiting", present=true (call onExited when done)
 * - onExited → phase="exited", present=false
 */
export declare function createPresence(options: PresenceOptions): PresenceState;
//# sourceMappingURL=presence.d.ts.map