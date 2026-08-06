/**
 * Styled Spinner — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/spinner.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Spinner from "@solidiom/spinner"

export function StyledSpinner(props: {
  label?: string
  children?: JSX.Element
}) {
  return (
    <Spinner.Root label={props.label}>
      {props.children}
    </Spinner.Root>
  )
}