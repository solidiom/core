/**
 * Styled Resizable Panels — CSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/resizable-panels.css"`
 */
import { type JSX } from "@solidjs/web"
import { PanelGroup } from "@solidiom/resizable-panels"

const BASE_CLASS = "solidiom-resizable-panels"

export function StyledResizablePanels(props: {
  children: JSX.Element
  direction?: "horizontal" | "vertical"
  sizes?: () => number[]
  defaultSizes?: number[]
  onSizesChange?: (sizes: number[], details: any) => void
  class?: string
}) {
  const className = () => [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return (
    <PanelGroup
      direction={props.direction}
      sizes={props.sizes}
      defaultSizes={props.defaultSizes}
      onSizesChange={props.onSizesChange}
      class={className()}
    >
      {props.children}
    </PanelGroup>
  )
}
