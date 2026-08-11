/**
 * Styled Resizable Panels — UnoCSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-unocss/styles/resizable-panels.css"`
 */
import { PanelGroup, Panel, Handle } from "@solidiom/resizable-panels"

export { PanelGroup, Panel, Handle }

const BASE_CLASS = "solidiom-resizable-panels"

export interface StyledResizablePanelsProps extends Omit<
  Parameters<typeof PanelGroup>[0],
  "class"
> {
  class?: string
}

export function StyledResizablePanels(props: StyledResizablePanelsProps) {
  const className = () => [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <PanelGroup {...props} class={className()} />
}
