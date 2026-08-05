/**
 * Styled Spinner — CSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/spinner.css"`
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