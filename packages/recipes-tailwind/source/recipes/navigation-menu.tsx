/**
 * Styled Navigation Menu — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/navigation-menu.css"`
 */
import * as NavigationMenu from "@solidiom/navigation-menu"

export { NavigationMenu }

const BASE_CLASS = "solidiom-navigation-menu"

export interface StyledNavigationMenuProps
  extends Omit<Parameters<typeof NavigationMenu.Root>[0], "class"> {
  class?: string
}

export function StyledNavigationMenu(props: StyledNavigationMenuProps) {
  const className = () =>
    [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <NavigationMenu.Root {...props} class={className()} />
}