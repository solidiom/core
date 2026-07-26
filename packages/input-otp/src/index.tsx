/**
 * @solidiom/input-otp — A one-time password input with individual character slots.
 *
 * Parts: Root, Group, Slot.
 */

import { createSignal, createContext, useContext, type Accessor } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs, createStableId } from "@solidiom/runtime"

// ─── Context ─────────────────────────────────────────────────────────────────

interface InputOTPContextValue {
  /** Current OTP value. */
  value: Accessor<string>
  /** Total character count. */
  maxLength: number
  /** Currently focused slot index. */
  activeIndex: Accessor<number>
  /** Whether the input is focused. */
  isFocused: Accessor<boolean>
  /** Pattern regex for validation. */
  pattern: RegExp | undefined
  /** Whether the input is disabled. */
  disabled: boolean | undefined
  /** Focus the hidden input. */
  focus: () => void
}

const InputOTPContext = createContext<InputOTPContextValue>()

function useInputOTPContext(): InputOTPContextValue {
  const ctx = useContext(InputOTPContext)
  if (!ctx) {
    throw new Error("[solidiom] InputOTP.Group/Slot must be used within InputOTP.Root")
  }
  return ctx
}

// ─── Root ────────────────────────────────────────────────────────────────────

export interface InputOTPRootProps {
  /** Total number of characters. */
  maxLength: number
  /** Controlled value. */
  value?: Accessor<string | undefined>
  /** Default value (uncontrolled). */
  defaultValue?: string
  /** Called when value changes. */
  onValueChange?: (value: string) => void
  /** Called when all slots are filled. */
  onComplete?: (value: string) => void
  /** Whether the input is disabled. */
  disabled?: boolean
  /** Regex pattern for allowed characters (e.g. "^[0-9]*$"). */
  pattern?: string
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * InputOTP root — manages a hidden input and exposes slot-level reactivity.
 *
 * Emits `data-scope="input-otp"`, `data-part="root"`.
 */
export function Root(props: InputOTPRootProps) {
  let inputRef: HTMLInputElement | undefined
  const inputId = createStableId("otp-input")

  const [internalValue, setInternalValue] = createSignal(props.defaultValue ?? "")
  const [isFocused, setIsFocused] = createSignal(false)

  const value = () => {
    if (props.value !== undefined) {
      return props.value() ?? ""
    }
    return internalValue()
  }

  const activeIndex = () => {
    const len = value().length
    return Math.min(len, props.maxLength - 1)
  }

  const patternRegex = props.pattern ? new RegExp(props.pattern) : undefined

  const setValue = (next: string) => {
    const truncated = next.slice(0, props.maxLength)

    // Validate each character
    if (patternRegex) {
      const valid = truncated.split("").every((ch) => patternRegex.test(ch))
      if (!valid) return
    }

    if (props.value === undefined) {
      setInternalValue(truncated)
    }
    props.onValueChange?.(truncated)

    if (truncated.length === props.maxLength) {
      props.onComplete?.(truncated)
    }
  }

  const handleInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement
    setValue(target.value)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (props.disabled) {
      e.preventDefault()
      return
    }
    // Allow navigation keys
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      return
    }
  }

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault()
    if (props.disabled) return
    const pasted = e.clipboardData?.getData("text/plain") ?? ""
    setValue(pasted)
  }

  const focus = () => {
    inputRef?.focus()
  }

  return (
    <InputOTPContext
      value={{
        value,
        maxLength: props.maxLength,
        activeIndex,
        isFocused,
        pattern: patternRegex,
        disabled: props.disabled,
        focus,
      }}
    >
      <div
        class={props.class}
        style={props.style}
        onClick={focus}
        {...applySemanticAttrs({
          scope: "input-otp",
          part: "root",
          disabled: props.disabled,
        })}
      >
        {/* Hidden input drives the actual value */}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          inputmode="numeric"
          autocomplete="one-time-code"
          maxlength={props.maxLength}
          value={value()}
          disabled={props.disabled}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="One-time password"
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: "0",
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            "white-space": "nowrap",
            "border-width": "0",
          }}
        />
        {props.children}
      </div>
    </InputOTPContext>
  )
}

// ─── Group ───────────────────────────────────────────────────────────────────

export interface InputOTPGroupProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

/**
 * InputOTP group — visual grouping of slots (e.g. 3-3 grouping for 6 digits).
 *
 * Emits `data-scope="input-otp"`, `data-part="group"`.
 */
export function Group(props: InputOTPGroupProps) {
  return (
    <div
      class={props.class}
      style={props.style}
      role="group"
      {...applySemanticAttrs({
        scope: "input-otp",
        part: "group",
      })}
    >
      {props.children}
    </div>
  )
}

// ─── Slot ────────────────────────────────────────────────────────────────────

export interface InputOTPSlotProps {
  /** Zero-based index of this slot. */
  index: number
  class?: string
  style?: JSX.CSSProperties | string
}

/**
 * InputOTP slot — displays a single character from the OTP value.
 *
 * Emits `data-scope="input-otp"`, `data-part="slot"`, `data-state="active"|"inactive"`,
 * `data-filled` when the slot has a character.
 */
export function Slot(props: InputOTPSlotProps) {
  const ctx = useInputOTPContext()

  const char = () => ctx.value()[props.index] ?? ""
  const isActive = () => ctx.isFocused() && ctx.activeIndex() === props.index
  const isFilled = () => char() !== ""

  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "input-otp",
        part: "slot",
        state: isActive() ? "active" : "inactive",
      })}
      {...(isFilled() ? { "data-filled": "" } : {})}
    >
      {char()}
    </div>
  )
}
