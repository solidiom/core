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
import { type JSX } from "@solidjs/web"
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
export declare function Root(props: FieldRootProps): JSX.Element
export interface FieldLabelProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}
/**
 * Field label — renders a `<label>` linked to the control via `for`.
 */
export declare function Label(props: FieldLabelProps): JSX.Element
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
export declare function Control(props: FieldControlProps): JSX.Element
export interface FieldDescriptionProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}
/**
 * Field description — helper text linked via aria-describedby when valid.
 */
export declare function Description(props: FieldDescriptionProps): JSX.Element
export interface FieldErrorProps {
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}
/**
 * Field error — error message linked via aria-describedby when invalid.
 */
export declare function Error(props: FieldErrorProps): JSX.Element
//# sourceMappingURL=index.d.ts.map
