/**
 * Styled Menu — UnoCSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-unocss/styles/menu.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Menu from "@solidiom/menu"

export function StyledMenu(props: { trigger: JSX.Element; children: JSX.Element }) {
  return (
    <Menu.Root>
      <Menu.Trigger>{props.trigger}</Menu.Trigger>
      <Menu.Content>{props.children}</Menu.Content>
    </Menu.Root>
  )
}
