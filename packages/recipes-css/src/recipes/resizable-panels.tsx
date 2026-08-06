/**
 * Styled Resizable Panels — CSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/resizable-panels.css"`
 */
import { PanelGroup } from "@solidiom/resizable-panels"

export interface StyledResizablePanelsProps
  extends Omit<Parameters<typeof PanelGroup>[0], "class"> {
  class?: string
}

export function StyledResizablePanels(props: StyledResizablePanelsProps) {
  const BASE_CLASS = "solidiom-resizable-panels"
  const className = () =>
    [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <PanelGroup {...props} class={className()} />
}
