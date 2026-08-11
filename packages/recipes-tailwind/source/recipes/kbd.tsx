/**
 * Styled Kbd — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/kbd.css"`
 */
import * as Kbd from "@solidiom/kbd"

export { Kbd }

const BASE_CLASS = "solidiom-kbd"

export interface StyledKbdProps extends Omit<Parameters<typeof Kbd.Root>[0], "class"> {
  class?: string
}

export function StyledKbd(props: StyledKbdProps) {
  const className = () => [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <Kbd.Root {...props} class={className()} />
}
