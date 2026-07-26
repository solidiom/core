/**
 * Styled Popover — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/popover.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Popover from "@solidiom/popover"

export function StyledPopover(props: { trigger: JSX.Element; children: JSX.Element }) {
  return (
    <Popover.Root>
      <Popover.Trigger>{props.trigger}</Popover.Trigger>
      <Popover.Content>{props.children}</Popover.Content>
    </Popover.Root>
  )
}
