/**
 * @solidiom/field — Form field composition primitive.
 *
 * Parts: Root, Label, Control, Description, Error.
 *
 * Provides automatic ARIA relationship wiring between label, control,
 * description, and error elements. Wraps `createFormControl` from
 * `@solidiom/runtime` to generate coordinated IDs and props.
 *
 * Usage:
 * ```tsx
 * <Field.Root>
 *   <Field.Label>Email</Field.Label>
 *   <Field.Control>
 *     {(controlProps) => <Input.Root {...controlProps()} />}
 *   </Field.Control>
 *   <Field.Description>We'll never share your email.</Field.Description>
 *   <Field.Error>Email is required.</Field.Error>
 * </Field.Root>
 * ```
 */

import { type Accessor, createContext, useContext } from "solid-js"
import { type JSX } from "@solidjs/web"
import { createFormControl, applySemanticAttrs, type FormControl } from "@solidiom/runtime"
import { Show } from "solid-js"

// ─── Context ─────────────────────────────────────────────────────────────────

interface FieldContextValue {
  formControl: FormControl
  invalid: Accessor<boolean>
  disabled: Accessor<boolean>
  required: Accessor<boolean>
  readOnly: Accessor<boolean>
}

const FieldContext = createContext<FieldContextValue>()

function useField(): FieldContextValue {
  const ctx = useContext(FieldContext)
  if (!ctx) throw new globalThis.Error("[solidiom] Field sub-parts must be used within <Field.Root>")
  return ctx
}

// ─── Root ────────────────────────────────────────────────────────────────────

export interface FieldRootProps {
  /** Explicit ID for the field control. Auto-generated if omitted. */
  id?: string
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
  invalid?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * Field root — provides ARIA context to child parts.
 *
 * Emits `data-scope="field"`, `data-part="root"`, plus state flags.
 */
export function Root(props: FieldRootProps) {
  const disabled = () => props.disabled ?? false
  const required = () => props.required ?? false
  const readOnly = () => props.readOnly ?? false
  const invalid = () => props.invalid ?? false

  const formControl = createFormControl({
    id: props.id,
    disabled,
    required,
    readOnly,
    invalid,
  })

  return (
    <FieldContext value={{ formControl, invalid, disabled, required, readOnly }}>
      <div
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({
          scope: "field",
          part: "root",
          disabled: disabled(),
          required: required(),
          invalid: invalid(),
          readonly: readOnly(),
        })}
      >
        {props.children}
      </div>
    </FieldContext>
  )
}

// ─── Label ───────────────────────────────────────────────────────────────────

export interface FieldLabelProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * Field label — renders a `<label>` linked to the control via `for`.
 */
export function Label(props: FieldLabelProps) {
  const { formControl, disabled, required, invalid } = useField()

  return (
    <label
      {...formControl.labelProps()}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "field",
        part: "label",
        disabled: disabled(),
        required: required(),
        invalid: invalid(),
      })}
    >
      {props.children}
    </label>
  )
}

// ─── Control ─────────────────────────────────────────────────────────────────

export interface FieldControlProps {
  /**
   * Render callback receiving a function that returns ARIA props to spread
   * on the form control element.
   */
  children: (controlProps: () => Record<string, string | boolean | undefined>) => JSX.Element
}

/**
 * Field control — passes ARIA props (id, aria-labelledby, aria-describedby,
 * aria-invalid, aria-required, aria-disabled) to the consumer's control element.
 */
export function Control(props: FieldControlProps) {
  const { formControl } = useField()
  return <>{props.children(formControl.controlProps)}</>
}

// ─── Description ─────────────────────────────────────────────────────────────

export interface FieldDescriptionProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * Field description — helper text linked via aria-describedby when valid.
 */
export function Description(props: FieldDescriptionProps) {
  const { formControl, invalid } = useField()

  return (
    <Show when={!invalid()}>
      <span
        id={formControl.descriptionId}
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({ scope: "field", part: "description" })}
      >
        {props.children}
      </span>
    </Show>
  )
}

// ─── Error ───────────────────────────────────────────────────────────────────

export interface FieldErrorProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * Field error — error message linked via aria-describedby when invalid.
 */
export function Error(props: FieldErrorProps) {
  const { formControl, invalid } = useField()

  return (
    <Show when={invalid()}>
      <span
        id={formControl.errorId}
        role="alert"
        aria-live="assertive"
        class={props.class}
        style={props.style}
        {...applySemanticAttrs({ scope: "field", part: "error" })}
      >
        {props.children}
      </span>
    </Show>
  )
}
