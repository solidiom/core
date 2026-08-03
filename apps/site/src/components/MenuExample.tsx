import * as Menu from "@solidiom/menu"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { trigger: string; items: string[] }> = {
  en: { trigger: "Actions", items: ["Edit", "Duplicate", "Archive", "Delete"] },
  es: { trigger: "Acciones", items: ["Editar", "Duplicar", "Archivar", "Eliminar"] },
}

export interface MenuExampleProps {
  locale: Locale
}

/** Canonical executable source for the Menu documentation example. */
export function MenuExample(props: MenuExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div ref={(el) => el.setAttribute("data-hydrated", "true")} class="menu-example">
      <Menu.Root>
        <Menu.Trigger>{copy().trigger}</Menu.Trigger>
        <Menu.Content aria-label={copy().trigger}>
          {copy().items.map((item) => (
            <Menu.Item>{item}</Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Root>
    </div>
  )
}
