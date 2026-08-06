/**
 * Styled Command Palette — UnoCSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-unocss/styles/command-palette.css"`
 */
import * as CommandPalette from "@solidiom/command-palette"

export { CommandPalette }

const BASE_CLASS = "solidiom-command-palette"

export interface StyledCommandPaletteProps
  extends Omit<Parameters<typeof CommandPalette.Root>[0], "class"> {
  class?: string
}

export function StyledCommandPalette(props: StyledCommandPaletteProps) {
  const className = () =>
    [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <CommandPalette.Root {...props} class={className()} />
}