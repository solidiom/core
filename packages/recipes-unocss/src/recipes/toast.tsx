/**
 * Styled Toast — UnoCSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-unocss/styles/toast.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Toast from "@solidiom/toast"

export function StyledToast(props: { toastId: string; children: JSX.Element }) {
  return <Toast.Root toastId={props.toastId}>{props.children}</Toast.Root>
}
