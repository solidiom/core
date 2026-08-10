import * as Kbd from "@solidiom/kbd"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    shortcut: string[]
    label: string
  }
> = {
  en: {
    shortcut: ["⌘", "K"],
    label: "to open command palette",
  },
  es: {
    shortcut: ["⌘", "K"],
    label: "para abrir la paleta de comandos",
  },
}

export interface KbdExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Kbd documentation example.
 * Shows keyboard shortcut keys displayed inline with a label.
 */
export function KbdExample(props: KbdExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="kbd-example"
      data-kbd-example
    >
      <div class="kbd-example__row">
        {copy().shortcut.map((key) => (
          <Kbd.Root>{key}</Kbd.Root>
        ))}
        <span class="kbd-example__label">{copy().label}</span>
      </div>
    </div>
  )
}
