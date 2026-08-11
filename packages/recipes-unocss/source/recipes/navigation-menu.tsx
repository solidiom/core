/**
 * Styled Navigation Menu — UnoCSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-unocss/styles/navigation-menu.css"`
 */
import * as NavigationMenu from "@solidiom/navigation-menu"

export { NavigationMenu }

const BASE_CLASS = "solidiom-navigation-menu"

export interface StyledNavigationMenuProps extends Omit<
  Parameters<typeof NavigationMenu.Root>[0],
  "class"
> {
  class?: string
}

export function StyledNavigationMenu(props: StyledNavigationMenuProps) {
  const className = () => [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <NavigationMenu.Root {...props} class={className()} />
}
