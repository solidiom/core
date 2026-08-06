/**
 * Styled Resizable Panels — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/resizable-panels.css"`
 */
import { PanelGroup, Panel, Handle } from "@solidiom/resizable-panels"

export { PanelGroup, Panel, Handle }

const BASE_CLASS = "solidiom-resizable-panels"

export interface StyledResizablePanelsProps
  extends Omit<Parameters<typeof PanelGroup>[0], "class"> {
  class?: string
}

export function StyledResizablePanels(props: StyledResizablePanelsProps) {
  const className = () =>
    [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <PanelGroup {...props} class={className()} />
}