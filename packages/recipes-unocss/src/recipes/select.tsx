/**
 * Styled Select — UnoCSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-unocss/styles/select.css"`
 */
import { type JSX } from "@solidjs/web"
import { type Accessor } from "solid-js"
import * as Select from "@solidiom/select"
import { type ChangeDetails } from "@solidiom/runtime"

export function StyledSelect(props: {
  trigger: JSX.Element
  children: JSX.Element
  value?: Accessor<string | string[] | undefined>
  onValueChange?: (value: string | string[], details: ChangeDetails<string>) => void
}) {
  return (
    <Select.Root value={props.value} onValueChange={props.onValueChange}>
      <Select.Trigger>{props.trigger}</Select.Trigger>
      <Select.Content>{props.children}</Select.Content>
    </Select.Root>
  )
}
