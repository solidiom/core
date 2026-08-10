import * as Separator from "@solidiom/separator"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    above: string
    below: string
  }
> = {
  en: {
    above: "Content above the divider.",
    below: "Content below the divider.",
  },
  es: {
    above: "Contenido por encima del separador.",
    below: "Contenido por debajo del separador.",
  },
}

export interface SeparatorExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Separator documentation example.
 * Shows a horizontal divider between two content blocks.
 */
export function SeparatorExample(props: SeparatorExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="separator-example"
      data-separator-example
    >
      <p class="separator-example__text">{copy().above}</p>
      <Separator.Root />
      <p class="separator-example__text">{copy().below}</p>
    </div>
  )
}
