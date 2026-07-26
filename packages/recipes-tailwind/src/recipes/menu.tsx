/**
 * Styled Menu — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/menu.css"`
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
