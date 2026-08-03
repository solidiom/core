import * as NavigationMenu from "@solidiom/navigation-menu"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  { label: string; items: Array<{ value: string; trigger: string; link: string }> }
> = {
  en: {
    label: "Main navigation",
    items: [
      { value: "products", trigger: "Products", link: "All products" },
      { value: "docs", trigger: "Documentation", link: "Getting started" },
    ],
  },
  es: {
    label: "Navegación principal",
    items: [
      { value: "products", trigger: "Productos", link: "Todos los productos" },
      { value: "docs", trigger: "Documentación", link: "Primeros pasos" },
    ],
  },
}

export interface NavigationMenuExampleProps {
  locale: Locale
}

/** Canonical executable source for the Navigation Menu documentation example. */
export function NavigationMenuExample(props: NavigationMenuExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div ref={(el) => el.setAttribute("data-hydrated", "true")} class="navigation-menu-example">
      <NavigationMenu.Root aria-label={copy().label}>
        <NavigationMenu.List>
          {copy().items.map((item) => (
            <NavigationMenu.Item value={item.value}>
              <NavigationMenu.Trigger>{item.trigger}</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <NavigationMenu.Link href="#">{item.link}</NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  )
}
