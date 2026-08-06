/**
 * Styled Toolbar — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/toolbar.css"`
 */
import * as Toolbar from "@solidiom/toolbar"

export { Toolbar }

const BASE_CLASS = "solidiom-toolbar"

export interface StyledToolbarProps
  extends Omit<Parameters<typeof Toolbar.Root>[0], "class"> {
  class?: string
}

export function StyledToolbar(props: StyledToolbarProps) {
  const className = () =>
    [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <Toolbar.Root {...props} class={className()} />
}