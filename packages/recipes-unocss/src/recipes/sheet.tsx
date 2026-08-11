/**
 * Styled Sheet — UnoCSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-unocss/styles/sheet.css"`
 */
import * as Sheet from "@solidiom/sheet"

export { Sheet }

const BASE_CLASS = "solidiom-sheet"

export interface StyledSheetProps extends Omit<Parameters<typeof Sheet.Root>[0], "class"> {
  class?: string
}

export function StyledSheet(props: StyledSheetProps) {
  const className = () => [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <Sheet.Root {...props} class={className()} />
}
