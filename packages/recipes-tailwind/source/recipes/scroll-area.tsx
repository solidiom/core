/**
 * Styled Scroll Area — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/scroll-area.css"`
 */
import * as ScrollArea from "@solidiom/scroll-area"

export { ScrollArea }

const BASE_CLASS = "solidiom-scroll-area"

export interface StyledScrollAreaProps
  extends Omit<Parameters<typeof ScrollArea.Root>[0], "class"> {
  class?: string
}

export function StyledScrollArea(props: StyledScrollAreaProps) {
  const className = () =>
    [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <ScrollArea.Root {...props} class={className()} />
}