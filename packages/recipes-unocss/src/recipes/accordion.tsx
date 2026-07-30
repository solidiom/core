/**
 * Styled Accordion — UnoCSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-unocss/styles/accordion.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Accordion from "@solidiom/accordion"

export function StyledAccordion(props: { type?: "single" | "multiple"; children: JSX.Element }) {
  return <Accordion.Root type={props.type}>{props.children}</Accordion.Root>
}
