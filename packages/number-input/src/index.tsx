/**
 * @solidiom/number-input — Headless number input primitive with increment/decrement
 * controls, locale-aware formatting, and WAI-ARIA spinbutton pattern.
 *
 * Parts: Root, Input, IncrementButton, DecrementButton.
 */

import { type Accessor, createContext, createSignal, useContext } from "solid-js"
import { type JSX } from "@solidjs/web"
import {
  applySemanticAttrs,
  createSpinButton,
  createNumberFormatter,
  type SpinButton,
  type NumberFormatter,
} from "@solidiom/runtime"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface NumberInputRootProps {
  /** Current value (controlled). */
  value?: number
  /** Default value (uncontrolled). */
  defaultValue?: number
  /** Called when the value changes. */
  onValueChange?: (value: number, details: { reason: string }) => void
  /** Minimum allowed value. */
  min?: number
  /** Maximum allowed value. */
  max?: number
  /** Step size for increment/decrement. */
  step?: number
  /** Whether the input is disabled. */
  disabled?: boolean
  /** Whether the input is read-only. */
  readOnly?: boolean
  /** Whether the input is required. */
  required?: boolean
  /** Whether the input is in an invalid state. */
  invalid?: boolean
  /** Form field name. */
  name?: string
  /** Element id for label association. */
  id?: string
  /** BCP 47 locale string for number formatting. */
  locale?: string
  /** Intl.NumberFormat options for display formatting. */
  formatOptions?: Intl.NumberFormatOptions
  /** Whether mouse wheel adjusts the value when the input is focused. */
  allowMouseWheel?: boolean
  /** Whether to clamp the value to [min, max] on blur. Default: true. */
  clampValueOnBlur?: boolean
  /** Container CSS class. */
  class?: string
  /** Container inline styles. */
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

// ─── Context ────────────────────────────────────────────────────────────────

interface NumberInputContextValue {
  spinButton: SpinButton
  formatter: NumberFormatter
  disabled: Accessor<boolean>
  readOnly: Accessor<boolean>
  required: Accessor<boolean>
  invalid: Accessor<boolean>
  id: Accessor<string | undefined>
  name: Accessor<string | undefined>
  allowMouseWheel: Accessor<boolean>
  clampValueOnBlur: Accessor<boolean>
}

const NumberInputContext = createContext<NumberInputContextValue>()

function useNumberInputContext(): NumberInputContextValue {
  const ctx = useContext(NumberInputContext)
  if (!ctx) {
    throw new Error("[number-input] Parts must be used within a NumberInput.Root")
  }
  return ctx
}

// ─── Root ───────────────────────────────────────────────────────────────────

/**
 * Root — Container wrapping the number input and increment/decrement buttons.
 *
 * Creates a spinbutton instance and locale-aware number formatter,
 * providing them to child parts via context.
 */
export function Root(props: NumberInputRootProps) {
  const formatter = createNumberFormatter({
    locale: props.locale,
    formatOptions: props.formatOptions,
  })

  const spinButton = createSpinButton({
    value: props.value !== undefined ? (() => props.value!) : undefined,
    defaultValue: props.defaultValue,
    min: props.min,
    max: props.max,
    step: props.step,
    disabled: () => !!props.disabled,
    readOnly: () => !!props.readOnly,
    formatValue: (v) => formatter.format(v),
    parseValue: (text) => formatter.parse(text),
    onChange: (value, details) => {
      props.onValueChange?.(value, { reason: details.reason })
    },
  })

  const ctx: NumberInputContextValue = {
    spinButton,
    formatter,
    disabled: () => !!props.disabled,
    readOnly: () => !!props.readOnly,
    required: () => !!props.required,
    invalid: () => !!props.invalid,
    id: () => props.id,
    name: () => props.name,
    allowMouseWheel: () => !!props.allowMouseWheel,
    clampValueOnBlur: () => props.clampValueOnBlur !== false,
  }

  return (
    <NumberInputContext value={ctx}>
      <div
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "number-input",
          part: "root",
          disabled: props.disabled,
          readonly: props.readOnly,
          required: props.required,
          invalid: props.invalid,
        })}
      >
        {props.children}
      </div>
    </NumberInputContext>
  )
}

// ─── Input ──────────────────────────────────────────────────────────────────

export interface NumberInputInputProps {
  /** CSS class. */
  class?: string
  /** Inline styles. */
  style?: JSX.CSSProperties | string
  /** Placeholder text. */
  placeholder?: string
  /** Native blur event handler. */
  onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>
  /** Native focus event handler. */
  onFocus?: JSX.EventHandler<HTMLInputElement, FocusEvent>
}

/**
 * Input — The text input element for the number input.
 *
 * Displays the formatted value, handles keyboard interaction via the spinbutton,
 * commits text on blur, and supports mouse wheel when focused.
 */
export function Input(props: NumberInputInputProps) {
  const ctx = useNumberInputContext()
  const { spinButton } = ctx

  const [inputText, setInputText] = createSignal<string | null>(null)
  const [focused, setFocused] = createSignal(false)

  const displayValue = () => {
    const text = inputText()
    if (text !== null) return text
    return spinButton.displayValue()
  }

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setInputText(e.currentTarget.value)
  }

  const handleBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
    setFocused(false)
    const text = inputText()
    if (text !== null) {
      spinButton.commitText(text, e)
      setInputText(null)
    }
    if (props.onBlur) {
      ;(props.onBlur as (e: FocusEvent & { currentTarget: HTMLInputElement }) => void)(e)
    }
  }

  const handleFocus: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
    setFocused(true)
    if (props.onFocus) {
      ;(props.onFocus as (e: FocusEvent & { currentTarget: HTMLInputElement }) => void)(e)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    spinButton.handleKeyDown(e)
  }

  const handleWheel = (e: WheelEvent) => {
    if (!ctx.allowMouseWheel() || !focused()) return
    if (ctx.disabled() || ctx.readOnly()) return
    e.preventDefault()
    if (e.deltaY < 0) {
      spinButton.increment(e)
    } else if (e.deltaY > 0) {
      spinButton.decrement(e)
    }
  }

  return (
    <input
      id={ctx.id()}
      name={ctx.name()}
      type="text"
      inputmode="decimal"
      value={displayValue()}
      placeholder={props.placeholder}
      disabled={ctx.disabled()}
      readonly={ctx.readOnly()}
      required={ctx.required()}
      aria-invalid={ctx.invalid() ? "true" : undefined}
      class={props.class}
      style={props.style}
      onInput={handleInput}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      {...spinButton.spinButtonProps()}
      {...applySemanticAttrs({
        scope: "number-input",
        part: "input",
        disabled: ctx.disabled(),
        readonly: ctx.readOnly(),
        required: ctx.required(),
        invalid: ctx.invalid(),
      })}
    />
  )
}

// ─── IncrementButton ────────────────────────────────────────────────────────

export interface NumberInputButtonProps {
  /** CSS class. */
  class?: string
  /** Inline styles. */
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * IncrementButton — Button to increment the number input value.
 *
 * Supports click-to-increment and long-press acceleration.
 */
export function IncrementButton(props: NumberInputButtonProps) {
  const ctx = useNumberInputContext()
  const { spinButton } = ctx

  const handlePointerDown = (e: PointerEvent) => {
    if (ctx.disabled() || ctx.readOnly()) return
    spinButton.increment(e)
    spinButton.startLongPress("increment", e)
  }

  const handlePointerUp = () => {
    spinButton.stopLongPress()
  }

  const handlePointerLeave = () => {
    spinButton.stopLongPress()
  }

  return (
    <button
      type="button"
      tabindex={-1}
      disabled={ctx.disabled() || spinButton.isAtMax()}
      aria-label="Increment"
      class={props.class}
      style={props.style}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      {...applySemanticAttrs({
        scope: "number-input",
        part: "increment",
        disabled: ctx.disabled() || spinButton.isAtMax(),
      })}
    >
      {props.children}
    </button>
  )
}

// ─── DecrementButton ────────────────────────────────────────────────────────

/**
 * DecrementButton — Button to decrement the number input value.
 *
 * Supports click-to-decrement and long-press acceleration.
 */
export function DecrementButton(props: NumberInputButtonProps) {
  const ctx = useNumberInputContext()
  const { spinButton } = ctx

  const handlePointerDown = (e: PointerEvent) => {
    if (ctx.disabled() || ctx.readOnly()) return
    spinButton.decrement(e)
    spinButton.startLongPress("decrement", e)
  }

  const handlePointerUp = () => {
    spinButton.stopLongPress()
  }

  const handlePointerLeave = () => {
    spinButton.stopLongPress()
  }

  return (
    <button
      type="button"
      tabindex={-1}
      disabled={ctx.disabled() || spinButton.isAtMin()}
      aria-label="Decrement"
      class={props.class}
      style={props.style}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      {...applySemanticAttrs({
        scope: "number-input",
        part: "decrement",
        disabled: ctx.disabled() || spinButton.isAtMin(),
      })}
    >
      {props.children}
    </button>
  )
}
