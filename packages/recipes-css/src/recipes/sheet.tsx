/**
 * Styled Sheet — CSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/sheet.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Sheet from "@solidiom/sheet"

export { Sheet }

const BASE_CLASS = "solidiom-sheet"

export function StyledSheet(props: {
  children: JSX.Element
  open?: () => boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: any) => void
  side?: "top" | "right" | "bottom" | "left"
  class?: string
}) {
  const className = () => [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return (
    <Sheet.Root
      open={props.open}
      defaultOpen={props.defaultOpen}
      onOpenChange={props.onOpenChange}
      side={props.side}
      class={className()}
    >
      {props.children}
    </Sheet.Root>
  )
}
