/**
 * Styled Input — UnoCSS recipe wrapper, using BEM class names.
 */
import * as Input from "@solidiom/input"

const BASE_CLASS = "solidiom-input"
const TEXTAREA_MOD = "solidiom-input--textarea"

export interface StyledInputProps
  extends Omit<Parameters<typeof Input.Root>[0], "class"> {
  class?: string
}

export function StyledInput(props: StyledInputProps) {
  const className = () =>
    [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <Input.Root {...props} class={className()} />
}

export interface StyledTextareaProps
  extends Omit<Parameters<typeof Input.Textarea>[0], "class"> {
  class?: string
}

export function StyledTextarea(props: StyledTextareaProps) {
  const className = () =>
    [BASE_CLASS, TEXTAREA_MOD, props.class].filter(Boolean).join(" ")

  return <Input.Textarea {...props} class={className()} />
}