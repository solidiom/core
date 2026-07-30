/**
 * Styled Tabs — UnoCSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-unocss/styles/tabs.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Tabs from "@solidiom/tabs"

export function StyledTabs(props: {
  defaultValue?: string
  orientation?: "horizontal" | "vertical"
  children: JSX.Element
}) {
  return (
    <Tabs.Root defaultValue={props.defaultValue} orientation={props.orientation}>
      {props.children}
    </Tabs.Root>
  )
}
