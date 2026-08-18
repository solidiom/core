/**
 * @solidiom/input-group — Input wrapper with prefix/suffix addon slots.
 *
 * Parts: Root, Prefix, Suffix, Input.
 *
 * Provides a flex container structure for composing an input element
 * with leading/trailing addon slots (icons, labels, buttons).
 * Root shares disabled/invalid state via context so child parts
 * can inherit without explicit prop drilling.
 */

import { createContext, useContext } from "solid-js"
import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

// ─── Context ────────────────────────────────────────────────────────────────

interface InputGroupContextValue {
  disabled?: boolean
  invalid?: boolean
}

const InputGroupContext = createContext<InputGroupContextValue>()

// ─── Types ──────────────────────────────────────────────────────────────────

export interface InputGroupRootProps {
  disabled?: boolean
  invalid?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

export interface PrefixProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

export interface SuffixProps {
  class?: string
  style?: JSX.CSSProperties | string
  children?: JSX.Element
}

export interface InputProps {
  /** Current input value (controlled). */
  value?: string
  /** Default value (uncontrolled). */
  defaultValue?: string
  /** Called when the value changes. */
  onValueChange?: (value: string) => void
  /** Input placeholder text. */
  placeholder?: string
  /** HTML input type. */
  type?: "text" | "email" | "password" | "search" | "tel" | "url" | "number"
  /** Form field name. */
  name?: string
  /** Element id for label association. */
  id?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  /** Native input event handler. */
  onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>
  /** Native blur event handler. */
  onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>
  /** Native focus event handler. */
  onFocus?: JSX.EventHandler<HTMLInputElement, FocusEvent>
}

// ─── Components ─────────────────────────────────────────────────────────────

/**
 * InputGroup.Root — flex container wrapping prefix + input + suffix.
 *
 * Creates context sharing disabled/invalid state with child parts.
 * Emits `data-scope="input-group"`, `data-part="root"`, plus state flags.
 */
export function Root(props: InputGroupRootProps) {
  return (
    <InputGroupContext
      value={{
        get disabled() {
          return props.disabled
        },
        get invalid() {
          return props.invalid
        },
      }}
    >
      <div
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "input-group",
          part: "root",
          disabled: props.disabled,
          invalid: props.invalid,
        })}
      >
        {props.children}
      </div>
    </InputGroupContext>
  )
}

/**
 * InputGroup.Prefix — leading addon slot (icon, label, button).
 *
 * Emits `data-scope="input-group"`, `data-part="prefix"`.
 */
export function Prefix(props: PrefixProps) {
  const ctx = useContext(InputGroupContext)
  if (!ctx) throw new Error("InputGroup.Prefix must be used within InputGroup.Root")

  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "input-group",
        part: "prefix",
        disabled: ctx.disabled,
        invalid: ctx.invalid,
      })}
    >
      {props.children}
    </div>
  )
}

/**
 * InputGroup.Suffix — trailing addon slot (icon, label, button).
 *
 * Emits `data-scope="input-group"`, `data-part="suffix"`.
 */
export function Suffix(props: SuffixProps) {
  const ctx = useContext(InputGroupContext)
  if (!ctx) throw new Error("InputGroup.Suffix must be used within InputGroup.Root")

  return (
    <div
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "input-group",
        part: "suffix",
        disabled: ctx.disabled,
        invalid: ctx.invalid,
      })}
    >
      {props.children}
    </div>
  )
}

/**
 * InputGroup.Input — the actual input element.
 *
 * Inherits disabled/invalid from Root context if not explicitly set.
 * Emits `data-scope="input-group"`, `data-part="input"`, plus state flags.
 */
export function Input(props: InputProps) {
  const ctx = useContext(InputGroupContext)
  if (!ctx) throw new Error("InputGroup.Input must be used within InputGroup.Root")

  const isDisabled = () => props.disabled ?? ctx.disabled
  const isInvalid = () => props.invalid ?? ctx.invalid

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    props.onValueChange?.(e.currentTarget.value)
    if (props.onInput) {
      ;(props.onInput as (e: InputEvent & { currentTarget: HTMLInputElement }) => void)(e)
    }
  }

  return (
    <input
      id={props.id}
      type={props.type ?? "text"}
      name={props.name}
      value={props.value ?? props.defaultValue ?? ""}
      placeholder={props.placeholder}
      disabled={isDisabled()}
      readonly={props.readOnly}
      required={props.required}
      aria-invalid={isInvalid() ? "true" : undefined}
      aria-required={props.required ? "true" : undefined}
      aria-disabled={isDisabled() ? "true" : undefined}
      class={props.class}
      style={props.style}
      onInput={handleInput}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      {...applySemanticAttrs({
        scope: "input-group",
        part: "input",
        disabled: isDisabled(),
        readonly: props.readOnly,
        required: props.required,
        invalid: isInvalid(),
        placeholder: !props.value && !!props.placeholder,
      })}
    />
  )
}
