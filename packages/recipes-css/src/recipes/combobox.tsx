/**
 * Styled Combobox — CSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/combobox.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Combobox from "@solidiom/combobox"

export { Combobox }

const BASE_CLASS = "solidiom-combobox"

export function StyledCombobox(props: {
  children: JSX.Element
  open?: () => boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: any) => void
  inputValue?: () => string
  defaultInputValue?: string
  onInputValueChange?: (value: string) => void
  selectedValue?: () => string | undefined
  defaultSelectedValue?: string
  onSelectedValueChange?: (value: string, details: any) => void
  placeholder?: string
  class?: string
}) {
  const className = () => [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return (
    <Combobox.Root
      open={props.open}
      defaultOpen={props.defaultOpen}
      onOpenChange={props.onOpenChange}
      inputValue={props.inputValue}
      defaultInputValue={props.defaultInputValue}
      onInputValueChange={props.onInputValueChange}
      selectedValue={props.selectedValue}
      defaultSelectedValue={props.defaultSelectedValue}
      onSelectedValueChange={props.onSelectedValueChange}
      class={className()}
    >
      {props.children}
    </Combobox.Root>
  )
}
