/**
 * Styled Toolbar — CSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/toolbar.css"`
 */
import * as Toolbar from "@solidiom/toolbar"

export { Toolbar }

const BASE_CLASS = "solidiom-toolbar"

export interface StyledToolbarProps extends Omit<Parameters<typeof Toolbar.Root>[0], "class"> {
  class?: string
}

export function StyledToolbar(props: StyledToolbarProps) {
  const className = () => [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <Toolbar.Root {...props} class={className()} />
}
