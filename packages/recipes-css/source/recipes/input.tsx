/**
 * Styled Input — CSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/input.css"`
 */
import * as Input from "@solidiom/input"

const BASE_CLASS = "solidiom-input"

export interface StyledInputProps extends Omit<Parameters<typeof Input.Root>[0], "class"> {
  class?: string
}

export function StyledInput(props: StyledInputProps) {
  const className = () => [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <Input.Root {...props} class={className()} />
}

export interface StyledTextareaProps extends Omit<Parameters<typeof Input.Textarea>[0], "class"> {
  class?: string
}

export function StyledTextarea(props: StyledTextareaProps) {
  const className = () =>
    [BASE_CLASS, BASE_CLASS + "--textarea", props.class].filter(Boolean).join(" ")

  return <Input.Textarea {...props} class={className()} />
}
