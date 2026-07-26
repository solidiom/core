/**
 * Controllable value — the common controlled/uncontrolled pattern for Solidiom primitives.
 *
 * Implements §9.1: controlled value accessor, default value, internal uncontrolled signal,
 * equality comparison, change reason, original event, disabled/readOnly guards.
 */

import { createSignal, type Accessor } from "solid-js"
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
export function createControllableValue<T, Reason extends string>(
  options: ControllableValueOptions<T, Reason>,
): ControllableValue<T, Reason> {
  const resolvedDefault =
    typeof options.defaultValue === "function"
      ? (options.defaultValue as () => T)()
      : options.defaultValue

  const equalsFn: ((prev: T, next: T) => boolean) | false =
    options.equals === undefined ? Object.is : options.equals

  const [internal, setInternal] = createSignal(resolvedDefault as Exclude<T, Function>, {
    equals: equalsFn === false ? false : equalsFn,
    ownedWrite: true,
  })

  const isControlled = (): boolean => {
    return options.value !== undefined && options.value() !== undefined
  }

  const value: Accessor<T> = () => {
    if (isControlled()) {
      return options.value!() as T
    }
    return internal()
  }

  const requestChange = (next: T, details: ChangeDetails<Reason>): void => {
    if (options.disabled?.()) return
    if (options.readOnly?.()) return

    // Equality check against current value
    if (equalsFn !== false) {
      const current = value()
      if (equalsFn(current, next)) return
    }

    // Update internal state when uncontrolled
    if (!isControlled()) {
      setInternal(() => next)
    }

    // Notify consumer
    options.onChange?.(next, details)
  }

  return { value, requestChange }
}
