/**
 * Styled Alert — UnoCSS recipe wrapper.
 * The stylesheet keys entirely off the primitive's own `data-state`, so no wrapper
 * class is needed. Import the stylesheet separately:
 * `import "@solidiom/recipes-unocss/styles/alert.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Alert from "@solidiom/alert"
import type { AlertType } from "@solidiom/alert"

export type AlertVariant = AlertType

export function StyledAlert(props: {
  children: JSX.Element
  variant?: AlertVariant
  assertiveness?: "assertive" | "polite"
}) {
  return (
    <Alert.Root type={props.variant ?? "info"} assertiveness={props.assertiveness}>
      {props.children}
    </Alert.Root>
  )
}

export { Alert }
