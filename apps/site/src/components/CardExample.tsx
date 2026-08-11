import * as Card from "@solidiom/card"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    title: string
    description: string
    content: string
    footer: string
  }
> = {
  en: {
    title: "Get Started",
    description: "Learn how to integrate Solidiom into your project.",
    content:
      "Install the primitives you need and compose them with your own styling. No mandatory design system — bring your own CSS, Tailwind, or UnoCSS.",
    footer: "Documentation →",
  },
  es: {
    title: "Primeros pasos",
    description: "Aprenda cómo integrar Solidiom en su proyecto.",
    content:
      "Instale las primitivas que necesite y compléstelas con sus propios estilos. Ningún sistema de diseño obligatorio — use CSS, Tailwind, o UnoCSS.",
    footer: "Documentación →",
  },
}

export interface CardExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Card documentation example.
 * Demonstrates a card with header, title, description, content, and footer.
 */
export function CardExample(props: CardExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="card-example"
      data-card-example
    >
      <Card.Root>
        <Card.Header>
          <Card.Title>{copy().title}</Card.Title>
          <Card.Description>{copy().description}</Card.Description>
        </Card.Header>
        <Card.Content>{copy().content}</Card.Content>
        <Card.Footer>{copy().footer}</Card.Footer>
      </Card.Root>
    </div>
  )
}
