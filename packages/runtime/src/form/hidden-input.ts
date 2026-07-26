/**
 * Hidden input — synchronizes primitive value to a hidden `<input>` for
 * native form participation.
 *
 * Per §9.5: form-capable primitives participate in native forms via
 * hidden inputs without requiring a form engine. Supports name, value,
 * required, disabled, and native reset handling.
 */

/** Options for a hidden input. */
export interface HiddenInputOptions {
  /** Form field name. */
  name: string
  /** Current value to synchronize. */
  value: () => string | string[]
  /** Whether the field is required. */
  required?: () => boolean
  /** Whether the field is disabled. */
  disabled?: () => boolean
  /** Reference to the form element (for reset detection). */
  form?: () => HTMLFormElement | undefined
}

/** Props to spread on a hidden `<input>` element. */
export interface HiddenInputProps {
  type: "hidden"
  name: string
  value: string
  required: boolean
  disabled: boolean
  "aria-hidden": "true"
  tabIndex: -1
  style: string
}

/**
 * Generates props for a hidden input that participates in native form submission.
 *
 * For multi-value fields (e.g. multi-select), returns an array of prop objects
 * (one hidden input per value).
 */
export function getHiddenInputProps(options: HiddenInputOptions): HiddenInputProps[] {
  const { name, value, required, disabled } = options
  const currentValue = value()
  const isRequired = required?.() ?? false
  const isDisabled = disabled?.() ?? false

  const baseStyle =
    "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0"

  const values = Array.isArray(currentValue) ? currentValue : [currentValue]

  return values.map((v) => ({
    type: "hidden" as const,
    name,
    value: v,
    required: isRequired,
    disabled: isDisabled,
    "aria-hidden": "true" as const,
    tabIndex: -1,
    style: baseStyle,
  }))
}
