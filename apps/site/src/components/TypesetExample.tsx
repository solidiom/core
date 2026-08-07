import type { Element } from "solid-js"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    heading: string
    lead: string
    paragraph: string
    blockquote: string
    muted: string
  }
> = {
  en: {
    heading: "Typography Scale",
    lead: "Typography belongs on semantic HTML, not in a runtime component.",
    paragraph:
      "Apply the granular typeset entries directly to native elements when you control the markup.",
    blockquote: "Behavior first. Styling stays opt-in.",
    muted: "No primitive runtime required.",
  },
  es: {
    heading: "Escala tipográfica",
    lead: "La tipografía pertenece al HTML semántico, no a un componente de ejecución.",
    paragraph:
      "Aplique las entradas granulares de typeset directamente a los elementos nativos cuando controle la marca.",
    blockquote: "Comportamiento primero. El estilo sigue siendo opcional.",
    muted: "No se requiere tiempo de ejecución del primitivo.",
  },
}

export interface TypesetExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the typeset recipe demonstration.
 * Uses data-* attribute scoping — no runtime component required.
 */
export function TypesetExample(props: TypesetExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="typeset-example"
      data-typeset-example
    >
      <h1 data-scope="typeset" data-part="heading-1">
        {copy().heading}
      </h1>
      <p data-scope="typeset" data-part="lead">
        {copy().lead}
      </p>
      <p data-scope="typeset" data-part="paragraph">
        {copy().paragraph}
      </p>
      <blockquote data-scope="typeset" data-part="blockquote">
        {copy().blockquote}
      </blockquote>
      <p data-scope="typeset" data-part="muted">
        {copy().muted}
      </p>
    </div>
  )
}
