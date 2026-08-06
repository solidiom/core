/**
 * Styled Combobox — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/combobox.css"`
 */
import * as Combobox from "@solidiom/combobox"

export { Combobox }

const BASE_CLASS = "solidiom-combobox"

export interface StyledComboboxProps
  extends Omit<Parameters<typeof Combobox.Root>[0], "class"> {
  class?: string
}

export function StyledCombobox(props: StyledComboboxProps) {
  const className = () =>
    [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <Combobox.Root {...props} class={className()} />
}