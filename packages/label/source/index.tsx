/**
 * @solidiom/label — Accessible label primitive.
 *
 * Parts: Root.
 *
 * Renders a `<label>` element with semantic data attributes.
 * Links to form controls via `htmlFor`. Designed to compose with
 * the Field primitive for automatic ARIA wiring, or used standalone.
 */

import { type JSX } from "@solidjs/web"
import { applySemanticAttrs } from "@solidiom/runtime"

export interface LabelRootProps {
  /** The id of the form control this label is associated with. */
  htmlFor?: string
  /** Element id for external reference. */
  id?: string
  /** Whether the associated field is disabled (visual hint only). */
  disabled?: boolean
  /** Whether the associated field is required (visual hint only). */
  required?: boolean
  /** Whether the associated field is invalid (visual hint only). */
  invalid?: boolean
  class?: string
  style?: JSX.CSSProperties | string
  children: JSX.Element
}

/**
 * Label primitive — renders a native `<label>` with semantic attributes.
 *
 * Emits `data-scope="label"`, `data-part="root"`, plus state flags
 * that mirror the associated control's state for styling purposes.
 */
export function Root(props: LabelRootProps) {
  return (
    <label
      id={props.id}
      for={props.htmlFor}
      class={props.class}
      style={props.style}
      {...applySemanticAttrs({
        scope: "label",
        part: "root",
        disabled: props.disabled,
        required: props.required,
        invalid: props.invalid,
      })}
    >
      {props.children}
    </label>
  )
}
