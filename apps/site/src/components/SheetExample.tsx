import * as Sheet from "@solidiom/sheet"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { trigger: string; title: string; content: string; close: string }> = {
  en: {
    trigger: "Open panel",
    title: "Navigation",
    content: "Side panel content with trapped focus. Press Escape to close.",
    close: "Close",
  },
  es: {
    trigger: "Abrir panel",
    title: "Navegación",
    content: "Contenido del panel lateral con foco atrapado. Presiona Escape para cerrar.",
    close: "Cerrar",
  },
}

export interface SheetExampleProps {
  locale: Locale
}

/** Canonical executable source for the Sheet documentation example. */
export function SheetExample(props: SheetExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div ref={(el) => el.setAttribute("data-hydrated", "true")} class="sheet-example">
      <Sheet.Root>
        <Sheet.Trigger>{copy().trigger}</Sheet.Trigger>
        <Sheet.Content>
          <Sheet.Title>{copy().title}</Sheet.Title>
          <Sheet.Description>{copy().content}</Sheet.Description>
          <Sheet.Close>{copy().close}</Sheet.Close>
        </Sheet.Content>
      </Sheet.Root>
    </div>
  )
}
