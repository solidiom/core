/**
 * Styled Field — UnoCSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-unocss/styles/field.css"`
 */
import * as Field from "@solidiom/field"

export { Field }

const BASE_CLASS = "solidiom-field"

export interface StyledFieldProps extends Omit<Parameters<typeof Field.Root>[0], "class"> {
  class?: string
}

export function StyledField(props: StyledFieldProps) {
  const className = () => [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <Field.Root {...props} class={className()} />
}
