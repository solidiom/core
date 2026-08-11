/**
 * @solidiom/input — Headless text input and textarea primitives.
 *
 * Parts: Root, Textarea.
 *
 * Provides semantic data attributes for styling hooks, validation state
 * integration, and native form participation. Designed to compose with
 * the Field primitive for label/description/error wiring.
 */
import { type JSX } from "@solidjs/web"
export interface InputRootProps {
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
/**
 * Text input primitive with semantic attributes and validation state.
 *
 * Emits `data-scope="input"`, `data-part="root"`, plus state flags
 * (`data-disabled`, `data-invalid`, `data-readonly`, `data-required`).
 */
export declare function Root(props: InputRootProps): JSX.Element
export interface TextareaProps {
  /** Current value (controlled). */
  value?: string
  /** Default value (uncontrolled). */
  defaultValue?: string
  /** Called when the value changes. */
  onValueChange?: (value: string) => void
  /** Textarea placeholder text. */
  placeholder?: string
  /** Form field name. */
  name?: string
  /** Element id for label association. */
  id?: string
  /** Number of visible text rows. */
  rows?: number
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  /** Native input event handler. */
  onInput?: JSX.EventHandler<HTMLTextAreaElement, InputEvent>
  /** Native blur event handler. */
  onBlur?: JSX.EventHandler<HTMLTextAreaElement, FocusEvent>
  /** Native focus event handler. */
  onFocus?: JSX.EventHandler<HTMLTextAreaElement, FocusEvent>
}
/**
 * Textarea primitive with semantic attributes and validation state.
 *
 * Emits `data-scope="input"`, `data-part="textarea"`, plus state flags.
 */
export declare function Textarea(props: TextareaProps): JSX.Element
//# sourceMappingURL=index.d.ts.map
