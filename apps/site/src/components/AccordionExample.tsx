import * as Accordion from "@solidiom/accordion"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { items: Array<{ trigger: string; content: string }> }> = {
  en: {
    items: [
      {
        trigger: "What is Solidiom?",
        content: "A component kit for SolidJS built on semantic HTML, accessible by default.",
      },
      {
        trigger: "Is it accessible?",
        content: "Yes, it follows the WAI-ARIA Authoring Practices for accordion patterns.",
      },
      {
        trigger: "How do I install it?",
        content: "Run pnpm add @solidiom/accordion and import the parts you need.",
      },
    ],
  },
  es: {
    items: [
      {
        trigger: "¿Qué es Solidiom?",
        content:
          "Un kit de componentes para SolidJS construido sobre HTML semántico, accesible por defecto.",
      },
      {
        trigger: "¿Es accesible?",
        content: "Sí, sigue las prácticas de autoría WAI-ARIA para patrones de acordeón.",
      },
      {
        trigger: "¿Cómo lo instalo?",
        content: "Ejecuta pnpm add @solidiom/accordion e importa las partes que necesites.",
      },
    ],
  },
}

export interface AccordionExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Accordion documentation example.
 * Demonstrates collapsible items with keyboard navigation (ArrowDown/Up,
 * Home/End, Space/Enter).
 */
export function AccordionExample(props: AccordionExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="accordion-example"
      data-accordion-example
    >
      <Accordion.Root type="single" collapsible defaultValue="item-0">
        {copy().items.map((item, index) => (
          <Accordion.Item value={`item-${index}`}>
            <Accordion.Trigger>{item.trigger}</Accordion.Trigger>
            <Accordion.Content>{item.content}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  )
}
