import * as Drawer from "@solidiom/drawer"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { trigger: string; title: string; description: string; close: string }> = {
  en: {
    trigger: "Open drawer",
    title: "Drawer",
    description: "This is a drawer that slides in from the right side of the screen.",
    close: "Close",
  },
  es: {
    trigger: "Abrir cajón",
    title: "Cajón",
    description: "Este es un cajón que se desliza desde el lado derecho de la pantalla.",
    close: "Cerrar",
  },
}

export interface DrawerExampleProps {
  locale: Locale
}

/** Canonical executable source for the Drawer documentation example. */
export function DrawerExample(props: DrawerExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div ref={(el) => el.setAttribute("data-hydrated", "true")} class="drawer-example" data-drawer-example>
      <Drawer.Root>
        <Drawer.Trigger>
          <button type="button">{copy().trigger}</button>
        </Drawer.Trigger>
        <Drawer.Backdrop />
        <Drawer.Content>
          <Drawer.Title>{copy().title}</Drawer.Title>
          <Drawer.Description>{copy().description}</Drawer.Description>
          <Drawer.Close>
            <button type="button">{copy().close}</button>
          </Drawer.Close>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  )
}
