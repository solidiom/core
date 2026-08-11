/**
 * Controllable value — the common controlled/uncontrolled pattern for Solidiom primitives.
 *
 * Implements §9.1: controlled value accessor, default value, internal uncontrolled signal,
 * equality comparison, change reason, original event, disabled/readOnly guards.
 */
import { type Accessor } from "solid-js"
import type { ChangeDetails } from "../events/change-details"
/** Options for creating a controllable value. */
export interface ControllableValueOptions<T, Reason extends string> {
  /** Controlled value accessor. When provided, the value is externally owned. */
  value?: Accessor<T | undefined>
  /** Initial value used when uncontrolled. Can be a static value or factory. */
  defaultValue: T | (() => T)
  /** Called when a change is requested (both controlled and uncontrolled modes). */
  onChange?: (next: T, details: ChangeDetails<Reason>) => void
  /** Custom equality. `false` disables equality checks (always updates). */
  equals?: false | ((prev: T, next: T) => boolean)
  /** When true, change requests are suppressed. */
  disabled?: Accessor<boolean>
  /** When true, change requests are suppressed. */
  readOnly?: Accessor<boolean>
}
/** The returned controllable value interface. */
export interface ControllableValue<T, Reason extends string> {
  /** Current value (reactive accessor). */
  value: Accessor<T>
  /** Request a state transition with reason and optional original event. */
  requestChange: (next: T, details: ChangeDetails<Reason>) => void
}
/**
 * Creates a controllable value following §9.1.
 *
 * - If `options.value` is provided and returns non-undefined, the value is controlled.
 * - Otherwise an internal signal holds uncontrolled state.
 * - `requestChange` respects disabled/readOnly guards and equality checks.
 */
export declare function createControllableValue<T, Reason extends string>(
  options: ControllableValueOptions<T, Reason>,
): ControllableValue<T, Reason>
//# sourceMappingURL=controllable-value.d.ts.map
