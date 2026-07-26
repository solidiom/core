/**
 * Styled Switch — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/switch.css"`
 */
import { type Accessor } from "solid-js"
import * as Switch from "@solidiom/switch"

export function StyledSwitch(props: {
  checked?: Accessor<boolean | undefined>
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <Switch.Root
      checked={props.checked}
      defaultChecked={props.defaultChecked}
      onCheckedChange={props.onCheckedChange}
      disabled={props.disabled}
    >
      <Switch.Thumb />
    </Switch.Root>
  )
}
