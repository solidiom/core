import * as Collapsible from "@solidiom/collapsible"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { triggerOpen: string; triggerClose: string; content: string }> = {
  en: { triggerOpen: "Show details", triggerClose: "Hide details", content: "This is the collapsible content. It can contain any information you want to reveal or hide." },
  es: { triggerOpen: "Mostrar detalles", triggerClose: "Ocultar detalles", content: "Este es el contenido colapsable. Puede contener cualquier información que desee revelar u ocultar." },
}

export interface CollapsibleExampleProps { locale: Locale }

/** Canonical executable source for the Collapsible documentation example. */
export function CollapsibleExample(props: CollapsibleExampleProps) {
  const copy = () => COPY[props.locale]
  return (
    <div ref={(el) => el.setAttribute("data-hydrated", "true")} class="collapsible-example" data-collapsible-example>
      <Collapsible.Root defaultOpen={false}>
        <Collapsible.Trigger>{copy().triggerOpen}</Collapsible.Trigger>
        <Collapsible.Content>{copy().content}</Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}
