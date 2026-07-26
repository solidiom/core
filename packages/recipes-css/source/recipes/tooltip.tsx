/**
 * Styled Tooltip — CSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/tooltip.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Tooltip from "@solidiom/tooltip"

export function StyledTooltip(props: { trigger: JSX.Element; content: JSX.Element }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>{props.trigger}</Tooltip.Trigger>
      <Tooltip.Content>{props.content}</Tooltip.Content>
    </Tooltip.Root>
  )
}
