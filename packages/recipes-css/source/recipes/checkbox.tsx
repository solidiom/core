/**
 * Styled Checkbox — CSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/checkbox.css"`
 */
import { type JSX } from "@solidjs/web"
import { type Accessor } from "solid-js"
import * as Checkbox from "@solidiom/checkbox"

export function StyledCheckbox(props: {
  checked?: Accessor<Checkbox.CheckedState | undefined>
  defaultChecked?: Checkbox.CheckedState
  onCheckedChange?: (checked: Checkbox.CheckedState) => void
  disabled?: boolean
  children?: JSX.Element
}) {
  return (
    <Checkbox.Root
      checked={props.checked}
      defaultChecked={props.defaultChecked}
      onCheckedChange={props.onCheckedChange}
      disabled={props.disabled}
    >
      <Checkbox.Indicator>{props.children ?? <CheckIcon />}</Checkbox.Indicator>
    </Checkbox.Root>
  )
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      width="12"
      height="12"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
