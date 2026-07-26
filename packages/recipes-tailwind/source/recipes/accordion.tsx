/**
 * Styled Accordion — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/accordion.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Accordion from "@solidiom/accordion"

export function StyledAccordion(props: { type?: "single" | "multiple"; children: JSX.Element }) {
  return <Accordion.Root type={props.type}>{props.children}</Accordion.Root>
}
