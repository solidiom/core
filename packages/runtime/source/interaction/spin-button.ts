/**
 * SpinButton — WAI-ARIA spinbutton interaction pattern for numeric stepping.
 *
 * Implements controlled/uncontrolled numeric value management with
 * increment, decrement, page stepping, home/end, keyboard handling,
 * long-press acceleration, text commit, and ARIA prop generation.
 *
 * Used by: NumberInput, Stepper (future).
 */

import { createSignal, type Accessor, onCleanup, getOwner } from "solid-js"

/** Reason describing why a spin button value change was requested. */
export type SpinButtonReason =
  "increment" | "decrement" | "page-increment" | "page-decrement" | "home" | "end" | "direct"

/** Options for creating a spin button. */
export interface SpinButtonOptions {
  /** Current value (controlled). */
  value?: Accessor<number>
  /** Default value (uncontrolled). */
  defaultValue?: number
  /** Minimum value. Default: -Infinity. */
  min?: number | Accessor<number>
  /** Maximum value. Default: Infinity. */
  max?: number | Accessor<number>
  /** Step size for increment/decrement. Default: 1. */
  step?: number | Accessor<number>
  /** Step size for Page Up/Page Down. Default: 10 * step. */
  pageStep?: number | Accessor<number>
  /** Called when value changes. */
  onChange?: (value: number, details: { reason: SpinButtonReason; event?: Event }) => void
  /** Whether the spinbutton is disabled. */
  disabled?: Accessor<boolean>
  /** Whether the spinbutton is read-only. */
  readOnly?: Accessor<boolean>
  /** Whether to wrap around at min/max boundaries. Default: false. */
  wrap?: boolean
  /** Delay (ms) before long-press acceleration starts. Default: 400. */
  longPressDelay?: number
  /** Interval (ms) between increments during long-press. Default: 60. */
  longPressInterval?: number
  /** Format the value to a display string. */
  formatValue?: (value: number) => string
  /** Parse a display string back to a number. Return NaN if invalid. */
  parseValue?: (text: string) => number
}

/** ARIA props to spread on the spinbutton element. */
export interface SpinButtonAriaProps {
  role: "spinbutton"
  "aria-valuemin"?: number
  "aria-valuemax"?: number
  "aria-valuenow": number
  "aria-valuetext"?: string
  "aria-disabled"?: "true"
  "aria-readonly"?: "true"
}

/** The returned spin button instance. */
export interface SpinButton {
  /** Current value (reactive). */
  value: Accessor<number>
  /** Formatted display value (reactive). */
  displayValue: Accessor<string>
  /** Whether the value is at the minimum. */
  isAtMin: Accessor<boolean>
  /** Whether the value is at the maximum. */
  isAtMax: Accessor<boolean>
  /** Increment by step. */
  increment: (event?: Event) => void
  /** Decrement by step. */
  decrement: (event?: Event) => void
  /** Increment by page step. */
  pageIncrement: (event?: Event) => void
  /** Decrement by page step. */
  pageDecrement: (event?: Event) => void
  /** Set to minimum value. */
  setToMin: (event?: Event) => void
  /** Set to maximum value. */
  setToMax: (event?: Event) => void
  /** Set a specific value directly. */
  setValue: (value: number, event?: Event) => void
  /** Commit a text input (parse and validate). Returns whether commit was successful. */
  commitText: (text: string, event?: Event) => boolean
  /** Get ARIA props to spread on the spinbutton element. */
  spinButtonProps: () => SpinButtonAriaProps
  /** Handle keyboard events on the spinbutton element. */
  handleKeyDown: (event: KeyboardEvent) => void
  /** Start long-press increment (call on pointerdown on increment button). */
  startLongPress: (direction: "increment" | "decrement", event?: Event) => void
  /** Stop long-press (call on pointerup/pointerleave). */
  stopLongPress: () => void
}

/**
 * Resolves a value that may be a static number or a reactive accessor.
 */
function resolveNumber(value: number | Accessor<number> | undefined, fallback: number): number {
  if (value === undefined) return fallback
  if (typeof value === "function") return (value as Accessor<number>)()
  return value
}

/**
 * Creates a spin button interaction primitive following WAI-ARIA spinbutton pattern.
 *
 * Supports controlled and uncontrolled modes, min/max clamping, wrap-around,
 * step snapping, keyboard handling, long-press acceleration, text commit,
 * and ARIA prop generation.
 *
 * @param options - Configuration for the spin button.
 * @returns A SpinButton instance with reactive value, actions, and ARIA props.
 */
export function createSpinButton(options: SpinButtonOptions): SpinButton {
  const resolvedDefault = options.defaultValue ?? 0

  const [internal, setInternal] = createSignal<number>(resolvedDefault, {
    ownedWrite: true,
  })

  const isControlled = (): boolean => {
    return options.value !== undefined
  }

  const value: Accessor<number> = (): number => {
    if (isControlled()) {
      return options.value!()
    }
    return internal()
  }

  const getMin = (): number => resolveNumber(options.min, -Infinity)
  const getMax = (): number => resolveNumber(options.max, Infinity)
  const getStep = (): number => resolveNumber(options.step, 1)
  const getPageStep = (): number => resolveNumber(options.pageStep, 10 * getStep())

  /**
   * Clamps a value to [min, max]. If wrap is enabled, wraps at boundaries.
   */
  function clamp(val: number, direction?: "increment" | "decrement"): number {
    const min = getMin()
    const max = getMax()

    if (options.wrap && direction) {
      if (direction === "increment" && val > max) return min
      if (direction === "decrement" && val < min) return max
    }

    return Math.min(Math.max(val, min), max)
  }

  /**
   * Snaps a value to the nearest step from min (if min is finite).
   */
  function snapToStep(val: number): number {
    const step = getStep()
    const min = getMin()
    if (!Number.isFinite(min)) return val
    const remainder = (val - min) % step
    if (Math.abs(remainder) < 1e-10) return val
    // Snap to nearest step
    if (Math.abs(remainder) < step / 2) {
      return val - remainder
    }
    return val - remainder + (remainder > 0 ? step : -step)
  }

  /**
   * Updates the value with guards and notification.
   */
  function updateValue(next: number, reason: SpinButtonReason, event?: Event): void {
    if (options.disabled?.()) return
    if (options.readOnly?.()) return

    const current = value()
    if (next === current) return

    if (!isControlled()) {
      setInternal(next)
    }

    options.onChange?.(next, { reason, event })
  }

  const displayValue: Accessor<string> = (): string => {
    const val = value()
    if (options.formatValue) {
      return options.formatValue(val)
    }
    return String(val)
  }

  const isAtMin: Accessor<boolean> = (): boolean => {
    const min = getMin()
    return Number.isFinite(min) && value() <= min
  }

  const isAtMax: Accessor<boolean> = (): boolean => {
    const max = getMax()
    return Number.isFinite(max) && value() >= max
  }

  function increment(event?: Event): void {
    const next = clamp(value() + getStep(), "increment")
    updateValue(next, "increment", event)
  }

  function decrement(event?: Event): void {
    const next = clamp(value() - getStep(), "decrement")
    updateValue(next, "decrement", event)
  }

  function pageIncrement(event?: Event): void {
    const next = clamp(value() + getPageStep(), "increment")
    updateValue(next, "page-increment", event)
  }

  function pageDecrement(event?: Event): void {
    const next = clamp(value() - getPageStep(), "decrement")
    updateValue(next, "page-decrement", event)
  }

  function setToMin(event?: Event): void {
    const min = getMin()
    if (!Number.isFinite(min)) return
    updateValue(min, "home", event)
  }

  function setToMax(event?: Event): void {
    const max = getMax()
    if (!Number.isFinite(max)) return
    updateValue(max, "end", event)
  }

  function setValue(val: number, event?: Event): void {
    const clamped = clamp(val)
    updateValue(clamped, "direct", event)
  }

  function commitText(text: string, event?: Event): boolean {
    const parser = options.parseValue ?? parseFloat
    const parsed = parser(text)
    if (Number.isNaN(parsed)) return false
    const clamped = clamp(parsed)
    const snapped = snapToStep(clamped)
    updateValue(snapped, "direct", event)
    return true
  }

  function spinButtonProps(): SpinButtonAriaProps {
    const min = getMin()
    const max = getMax()
    const val = value()

    const props: SpinButtonAriaProps = {
      role: "spinbutton",
      "aria-valuenow": val,
    }

    if (Number.isFinite(min)) {
      props["aria-valuemin"] = min
    }

    if (Number.isFinite(max)) {
      props["aria-valuemax"] = max
    }

    if (options.formatValue) {
      const formatted = options.formatValue(val)
      if (formatted !== String(val)) {
        props["aria-valuetext"] = formatted
      }
    }

    if (options.disabled?.()) {
      props["aria-disabled"] = "true"
    }

    if (options.readOnly?.()) {
      props["aria-readonly"] = "true"
    }

    return props
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (options.disabled?.()) return
    if (options.readOnly?.()) return

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault()
        increment(event)
        break
      case "ArrowDown":
        event.preventDefault()
        decrement(event)
        break
      case "PageUp":
        event.preventDefault()
        pageIncrement(event)
        break
      case "PageDown":
        event.preventDefault()
        pageDecrement(event)
        break
      case "Home": {
        const min = getMin()
        if (Number.isFinite(min)) {
          event.preventDefault()
          setToMin(event)
        }
        break
      }
      case "End": {
        const max = getMax()
        if (Number.isFinite(max)) {
          event.preventDefault()
          setToMax(event)
        }
        break
      }
    }
  }

  // Long-press state
  let longPressDelayTimer: ReturnType<typeof setTimeout> | undefined
  let longPressIntervalTimer: ReturnType<typeof setInterval> | undefined

  function stopLongPress(): void {
    if (longPressDelayTimer !== undefined) {
      clearTimeout(longPressDelayTimer)
      longPressDelayTimer = undefined
    }
    if (longPressIntervalTimer !== undefined) {
      clearInterval(longPressIntervalTimer)
      longPressIntervalTimer = undefined
    }
  }

  function startLongPress(direction: "increment" | "decrement", event?: Event): void {
    stopLongPress()

    const delay = options.longPressDelay ?? 400
    const interval = options.longPressInterval ?? 60
    const action = direction === "increment" ? increment : decrement

    // Perform the first action immediately
    action(event)

    longPressDelayTimer = setTimeout(() => {
      longPressDelayTimer = undefined
      longPressIntervalTimer = setInterval(() => {
        action(event)
      }, interval)
    }, delay)
  }

  // Cleanup timers on owner disposal
  if (getOwner()) {
    onCleanup(stopLongPress)
  }

  return {
    value,
    displayValue,
    isAtMin,
    isAtMax,
    increment,
    decrement,
    pageIncrement,
    pageDecrement,
    setToMin,
    setToMax,
    setValue,
    commitText,
    spinButtonProps,
    handleKeyDown,
    startLongPress,
    stopLongPress,
  }
}
