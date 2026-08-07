import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    heading1: string
    paragraph1: string
    heading2: string
    list1: string
    list2: string
    list3: string
    paragraph2: string
  }
> = {
  en: {
    heading1: "Rendered Content",
    paragraph1:
      "The prose recipe styles nested semantic HTML when markup comes from Markdown or a rich-text editor.",
    heading2: "Usage",
    list1: "Apply one scope attribute to the container.",
    list2: 'Choose <code>sm</code>, <code>base</code>, or <code>lg</code> with <code>data-size</code>.',
    list3: "Import the stylesheet for your styling profile.",
    paragraph2: 'Solid renders the content; the <a href="https://www.solidjs.com">stylesheet</a> handles its presentation.',
  },
  es: {
    heading1: "Contenido renderizado",
    paragraph1:
      "La receta prose estila HTML semántico anidado cuando la marca proviene de Markdown o un editor de texto enriquecido.",
    heading2: "Uso",
    list1: "Aplique un atributo de scope al contenedor.",
    list2: 'Elija <code>sm</code>, <code>base</code>, o <code>lg</code> con <code>data-size</code>.',
    list3: "Importe la hoja de estilos para su perfil de estilo.",
    paragraph2: 'Solid renderiza el contenido; la <a href="https://www.solidjs.com">hoja de estilos</a> maneja su presentación.',
  },
}

export interface ProseExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the prose recipe demonstration.
 * Uses data-* attribute scoping — descendant elements are styled by the stylesheet.
 */
export function ProseExample(props: ProseExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="prose-example"
      data-prose-example
    >
      <article data-scope="prose" data-size="lg">
        <h1>{copy().heading1}</h1>
        <p>{copy().paragraph1}</p>
        <h2>{copy().heading2}</h2>
        <ul>
          <li innerHTML={copy().list1}></li>
          <li innerHTML={copy().list2}></li>
          <li innerHTML={copy().list3}></li>
        </ul>
        <div innerHTML={copy().paragraph2}></div>
      </article>
    </div>
  )
}
