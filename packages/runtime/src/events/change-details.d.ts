/**
 * Change details — explains why a state transition was requested.
 *
 * Every controllable value emits a reason with each change request.
 * The original DOM event is included only when one exists.
 * Engine-specific events are never exposed (§10.2).
 */
/** Describes the cause and context of a state change request. */
export interface ChangeDetails<Reason extends string = string> {
    /** Why the transition was requested. */
    reason: Reason;
    /** The originating DOM event, if any. */
    originalEvent?: Event;
}
/** Creates a change-details object. */
export declare function createChangeDetails<Reason extends string>(reason: Reason, originalEvent?: Event): ChangeDetails<Reason>;
//# sourceMappingURL=change-details.d.ts.map