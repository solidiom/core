/**
 * Form control — manages ARIA relationships (label, description, error)
 * and field state (required, disabled, readOnly, invalid) for form primitives.
 *
 * Per §9.5: primitives own native form behavior without a form engine.
 */
import { type Accessor } from "solid-js"
/** Field state for a form control. */
export interface FormControlState {
  /** Whether the field is required. */
  required: Accessor<boolean>
  /** Whether the field is disabled. */
  disabled: Accessor<boolean>
  /** Whether the field is read-only. */
  readOnly: Accessor<boolean>
  /** Whether the field is currently invalid. */
  invalid: Accessor<boolean>
}
/** Options for creating a form control. */
export interface FormControlOptions {
  /** Explicit ID for the control element. Auto-generated if omitted. */
  id?: string
  required?: Accessor<boolean>
  disabled?: Accessor<boolean>
  readOnly?: Accessor<boolean>
  invalid?: Accessor<boolean>
}
/** Generated IDs and ARIA props for a form control. */
export interface FormControl {
  /** ID for the control element itself. */
  controlId: string
  /** ID for the label element. */
  labelId: string
  /** ID for the description element. */
  descriptionId: string
  /** ID for the error message element. */
  errorId: string
  /** Field state accessors. */
  state: FormControlState
  /** ARIA attributes to spread on the control element. */
  controlProps: () => Record<string, string | boolean | undefined>
  /** ARIA attributes to spread on the label element. */
  labelProps: () => Record<string, string>
}
/**
 * Creates a form control with stable ARIA relationship IDs and field state.
 *
 * Generates coordinated IDs for label, description, and error elements.
 * Returns props objects to spread on the respective elements.
 */
export declare function createFormControl(options?: FormControlOptions): FormControl
//# sourceMappingURL=form-control.d.ts.map
