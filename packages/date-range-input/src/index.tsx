/**
 * @solidiom/date-range-input — Date range selection with start/end text fields and calendar picker.
 *
 * Parts: Root, StartInput, EndInput, Separator, Trigger.
 *
 * Provides semantic data attributes for styling hooks, validation state
 * integration, and native form participation. Designed to compose with
 * a calendar popover primitive for date picking.
 */

import { createSignal, createContext, useContext, type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs, createStableId } from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DateRange {
  start: string
  end: string
}

export interface DateRangeInputRootProps {
  /** Controlled start date (ISO format). */
  startDate?: string
  /** Controlled end date (ISO format). */
  endDate?: string
  /** Default start date (uncontrolled). */
  defaultStartDate?: string
  /** Default end date (uncontrolled). */
  defaultEndDate?: string
  /** Called when the date range changes. */
  onRangeChange?: (range: DateRange) => void
  /** Minimum allowed date (ISO format). */
  min?: string
  /** Maximum allowed date (ISO format). */
  max?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  /** Form field name prefix. Hidden inputs use name-start and name-end. */
  name?: string
  /** Element id for the root container. */
  id?: string
  /** Display format hint (default 'YYYY-MM-DD'). */
  format?: string
  /** Placeholder text for start and end inputs. */
  placeholder?: { start?: string; end?: string }
  children?: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
}

// ─── Context ────────────────────────────────────────────────────────────────

interface DateRangeInputContextValue {
  startDate: Accessor<string>
  endDate: Accessor<string>
  setStartDate: (value: string) => void
  setEndDate: (value: string) => void
  disabled: Accessor<boolean | undefined>
  readOnly: Accessor<boolean | undefined>
  required: Accessor<boolean | undefined>
  invalid: Accessor<boolean | undefined>
  min: Accessor<string | undefined>
  max: Accessor<string | undefined>
  format: Accessor<string>
  placeholder: Accessor<{ start?: string; end?: string }>
  startId: string
  endId: string
  isValid: Accessor<boolean>
}

const DateRangeInputContext = createContext<DateRangeInputContextValue>()

function useDateRangeInputContext(): DateRangeInputContextValue {
  const ctx = useContext(DateRangeInputContext)
  if (!ctx) {
    throw new Error("[date-range-input] Parts must be used within a Root.")
  }
  return ctx
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Validates an ISO date string (YYYY-MM-DD). */
function isValidISODate(value: string): boolean {
  if (!value) return true // empty is valid (not filled)
  const match = /^\d{4}-\d{2}-\d{2}$/.exec(value)
  if (!match) return false
  const date = new Date(value + "T00:00:00")
  return !isNaN(date.getTime())
}

/** Check if a date string is within min/max bounds. */
function isWithinBounds(value: string, min?: string, max?: string): boolean {
  if (!value) return true
  if (min && value < min) return false
  if (max && value > max) return false
  return true
}

/** Validates that start <= end. */
function isRangeValid(start: string, end: string): boolean {
  if (!start || !end) return true
  return start <= end
}

// ─── Root ───────────────────────────────────────────────────────────────────

/**
 * Root container for the date range input.
 *
 * Provides context with range state, validation, and form participation.
 * Emits `data-scope="date-range-input"`, `data-part="root"`, plus state flags.
 */
export function Root(props: DateRangeInputRootProps) {
  const startId = createStableId("date-range-start")
  const endId = createStableId("date-range-end")

  // Internal signals for uncontrolled mode
  const [internalStart, setInternalStart] = createSignal(props.defaultStartDate ?? "")
  const [internalEnd, setInternalEnd] = createSignal(props.defaultEndDate ?? "")

  const startDate = () => props.startDate ?? internalStart()
  const endDate = () => props.endDate ?? internalEnd()

  const isValid = () => {
    const s = startDate()
    const e = endDate()
    if (!isValidISODate(s) || !isValidISODate(e)) return false
    if (!isWithinBounds(s, props.min, props.max)) return false
    if (!isWithinBounds(e, props.min, props.max)) return false
    if (!isRangeValid(s, e)) return false
    return true
  }

  const setStartDate = (value: string) => {
    if (props.readOnly || props.disabled) return
    if (props.startDate === undefined) {
      setInternalStart(value)
    }
    props.onRangeChange?.({ start: value, end: endDate() })
  }

  const setEndDate = (value: string) => {
    if (props.readOnly || props.disabled) return
    if (props.endDate === undefined) {
      setInternalEnd(value)
    }
    props.onRangeChange?.({ start: startDate(), end: value })
  }

  const contextValue: DateRangeInputContextValue = {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    disabled: () => props.disabled,
    readOnly: () => props.readOnly,
    required: () => props.required,
    invalid: () => props.invalid,
    min: () => props.min,
    max: () => props.max,
    format: () => props.format ?? "YYYY-MM-DD",
    placeholder: () => props.placeholder ?? {},
    startId,
    endId,
    isValid,
  }

  const computedInvalid = () => props.invalid || !isValid()
  const dataState = () => (computedInvalid() ? "invalid" : "valid")
  const hasValue = () => !!startDate() || !!endDate()

  return (
    <DateRangeInputContext value={contextValue}>
      <div
        id={props.id}
        class={props.class}
        style={props.style}
        role="group"
        aria-disabled={props.disabled ? "true" : undefined}
        aria-invalid={computedInvalid() ? "true" : undefined}
        aria-required={props.required ? "true" : undefined}
        data-has-value={hasValue() ? "" : undefined}
        {...applySemanticAttrs({
          scope: "date-range-input",
          part: "root",
          state: dataState(),
          disabled: props.disabled,
          readonly: props.readOnly,
          required: props.required,
          invalid: computedInvalid(),
        })}
      >
        {props.children}
        {/* Hidden inputs for form participation */}
        {props.name && (
          <>
            <input type="hidden" name={`${props.name}-start`} value={startDate()} />
            <input type="hidden" name={`${props.name}-end`} value={endDate()} />
          </>
        )}
      </div>
    </DateRangeInputContext>
  )
}

// ─── StartInput ─────────────────────────────────────────────────────────────

export interface DateRangeInputFieldProps {
  class?: string
  style?: JSX.CSSProperties | string
  /** Native blur event handler. */
  onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>
  /** Native focus event handler. */
  onFocus?: JSX.EventHandler<HTMLInputElement, FocusEvent>
}

/**
 * Text input for the start date.
 *
 * Parses date strings on blur and validates against format and bounds.
 * Emits `data-scope="date-range-input"`, `data-part="start-input"`.
 */
export function StartInput(props: DateRangeInputFieldProps) {
  const ctx = useDateRangeInputContext()
  const [localInvalid, setLocalInvalid] = createSignal(false)

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    ctx.setStartDate(e.currentTarget.value)
  }

  const handleBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
    const value = e.currentTarget.value
    if (value && !isValidISODate(value)) {
      setLocalInvalid(true)
    } else if (value && !isWithinBounds(value, ctx.min(), ctx.max())) {
      setLocalInvalid(true)
    } else if (value && ctx.endDate() && !isRangeValid(value, ctx.endDate())) {
      setLocalInvalid(true)
    } else {
      setLocalInvalid(false)
    }
    if (props.onBlur) {
      ;(props.onBlur as (e: FocusEvent & { currentTarget: HTMLInputElement }) => void)(e)
    }
  }

  const isInvalid = () => ctx.invalid() || localInvalid()
  const dataState = () => (isInvalid() ? "invalid" : "valid")
  const hasValue = () => !!ctx.startDate()

  return (
    <input
      id={ctx.startId}
      type="text"
      value={ctx.startDate()}
      placeholder={ctx.placeholder().start ?? ctx.format()}
      disabled={ctx.disabled()}
      readonly={ctx.readOnly()}
      required={ctx.required()}
      aria-invalid={isInvalid() ? "true" : undefined}
      aria-required={ctx.required() ? "true" : undefined}
      aria-disabled={ctx.disabled() ? "true" : undefined}
      aria-label="Start date"
      class={props.class}
      style={props.style}
      data-has-value={hasValue() ? "" : undefined}
      onInput={handleInput}
      onBlur={handleBlur}
      onFocus={props.onFocus}
      {...applySemanticAttrs({
        scope: "date-range-input",
        part: "start-input",
        state: dataState(),
        disabled: ctx.disabled(),
        readonly: ctx.readOnly(),
        required: ctx.required(),
        invalid: isInvalid(),
        placeholder: !hasValue(),
      })}
    />
  )
}

// ─── EndInput ───────────────────────────────────────────────────────────────

/**
 * Text input for the end date.
 *
 * Parses date strings on blur and validates against format and bounds.
 * Emits `data-scope="date-range-input"`, `data-part="end-input"`.
 */
export function EndInput(props: DateRangeInputFieldProps) {
  const ctx = useDateRangeInputContext()
  const [localInvalid, setLocalInvalid] = createSignal(false)

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    ctx.setEndDate(e.currentTarget.value)
  }

  const handleBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
    const value = e.currentTarget.value
    if (value && !isValidISODate(value)) {
      setLocalInvalid(true)
    } else if (value && !isWithinBounds(value, ctx.min(), ctx.max())) {
      setLocalInvalid(true)
    } else if (value && ctx.startDate() && !isRangeValid(ctx.startDate(), value)) {
      setLocalInvalid(true)
    } else {
      setLocalInvalid(false)
    }
    if (props.onBlur) {
      ;(props.onBlur as (e: FocusEvent & { currentTarget: HTMLInputElement }) => void)(e)
    }
  }

  const isInvalid = () => ctx.invalid() || localInvalid()
  const dataState = () => (isInvalid() ? "invalid" : "valid")
  const hasValue = () => !!ctx.endDate()

  return (
    <input
      id={ctx.endId}
      type="text"
      value={ctx.endDate()}
      placeholder={ctx.placeholder().end ?? ctx.format()}
      disabled={ctx.disabled()}
      readonly={ctx.readOnly()}
      required={ctx.required()}
      aria-invalid={isInvalid() ? "true" : undefined}
      aria-required={ctx.required() ? "true" : undefined}
      aria-disabled={ctx.disabled() ? "true" : undefined}
      aria-label="End date"
      class={props.class}
      style={props.style}
      data-has-value={hasValue() ? "" : undefined}
      onInput={handleInput}
      onBlur={handleBlur}
      onFocus={props.onFocus}
      {...applySemanticAttrs({
        scope: "date-range-input",
        part: "end-input",
        state: dataState(),
        disabled: ctx.disabled(),
        readonly: ctx.readOnly(),
        required: ctx.required(),
        invalid: isInvalid(),
        placeholder: !hasValue(),
      })}
    />
  )
}

// ─── Separator ──────────────────────────────────────────────────────────────

export interface DateRangeInputSeparatorProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * Visual separator between start and end date inputs.
 *
 * Renders " – " by default if no children are provided.
 * Emits `data-scope="date-range-input"`, `data-part="separator"`.
 */
export function Separator(props: DateRangeInputSeparatorProps) {
  const ctx = useDateRangeInputContext()

  return (
    <span
      aria-hidden="true"
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "date-range-input",
        part: "separator",
        disabled: ctx.disabled(),
      })}
    >
      {props.children ?? " – "}
    </span>
  )
}

// ─── Trigger ────────────────────────────────────────────────────────────────

export interface DateRangeInputTriggerProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
  /** Click handler for opening a calendar popover. */
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>
  /** Accessible label for the trigger button. */
  "aria-label"?: string
}

/**
 * Button trigger for opening a calendar picker popover.
 *
 * Designed for composition — attach your popover logic via onClick.
 * Emits `data-scope="date-range-input"`, `data-part="trigger"`.
 */
export function Trigger(props: DateRangeInputTriggerProps) {
  const ctx = useDateRangeInputContext()

  return (
    <button
      type="button"
      disabled={ctx.disabled()}
      aria-label={props["aria-label"] ?? "Open date picker"}
      aria-disabled={ctx.disabled() ? "true" : undefined}
      class={props.class}
      style={props.style}
      onClick={props.onClick}
      {...applySemanticAttrs({
        scope: "date-range-input",
        part: "trigger",
        disabled: ctx.disabled(),
        readonly: ctx.readOnly(),
      })}
    >
      {props.children}
    </button>
  )
}
