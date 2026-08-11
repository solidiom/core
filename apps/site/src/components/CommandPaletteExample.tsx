import * as CommandPalette from "@solidiom/command-palette"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    placeholder: string
    recent: string
    actions: string
    save: string
    undo: string
    redo: string
    settings: string
    noResults: string
  }
> = {
  en: {
    placeholder: "Type a command or search...",
    recent: "Recent",
    actions: "Actions",
    save: "Save",
    undo: "Undo",
    redo: "Redo",
    settings: "Settings",
    noResults: "No results found.",
  },
  es: {
    placeholder: "Escriba un comando o busque...",
    recent: "Recientes",
    actions: "Acciones",
    save: "Guardar",
    undo: "Deshacer",
    redo: "Rehacer",
    settings: "Configuración",
    noResults: "No se encontraron resultados.",
  },
}

export interface CommandPaletteExampleProps {
  locale: Locale
}

/** Canonical executable source for the Command Palette documentation example. */
export function CommandPaletteExample(props: CommandPaletteExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(el) => el.setAttribute("data-hydrated", "true")}
      class="command-palette-example"
      data-command-palette-example
    >
      <CommandPalette.Root defaultOpen={true}>
        <CommandPalette.Input placeholder={copy().placeholder} />
        <CommandPalette.List>
          <CommandPalette.Group heading={copy().recent}>
            <CommandPalette.Item value="save">{copy().save}</CommandPalette.Item>
            <CommandPalette.Item value="undo">{copy().undo}</CommandPalette.Item>
            <CommandPalette.Item value="redo">{copy().redo}</CommandPalette.Item>
          </CommandPalette.Group>
          <CommandPalette.Group heading={copy().actions}>
            <CommandPalette.Item value="settings">{copy().settings}</CommandPalette.Item>
          </CommandPalette.Group>
          <CommandPalette.Empty>{copy().noResults}</CommandPalette.Empty>
        </CommandPalette.List>
      </CommandPalette.Root>
    </div>
  )
}
