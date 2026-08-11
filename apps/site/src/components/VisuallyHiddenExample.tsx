import * as VisuallyHidden from "@solidiom/visually-hidden"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    buttonLabel: string
    icon: string
    heading: string
    items: string[]
  }
> = {
  en: {
    buttonLabel: "Close dialog",
    icon: "\u00d7",
    heading: "Related Articles",
    items: ["Article one", "Article two"],
  },
  es: {
    buttonLabel: "Cerrar diálogo",
    icon: "\u00d7",
    heading: "Artículos relacionados",
    items: ["Artículo uno", "Artículo dos"],
  },
}

export interface VisuallyHiddenExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Visually Hidden documentation example.
 * Demonstrates screen-reader-only content alongside visible UI elements.
 */
export function VisuallyHiddenExample(props: VisuallyHiddenExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="visually-hidden-example"
      data-visually-hidden-example
    >
      <div class="visually-hidden-example__demo">
        <button class="visually-hidden-example__button">
          <VisuallyHidden.Root>{copy().buttonLabel}</VisuallyHidden.Root>
          <span aria-hidden="true">{copy().icon}</span>
        </button>
      </div>
      <div class="visually-hidden-example__notice">
        <span data-scope="visually-hidden" data-part="root">
          {copy().buttonLabel}
        </span>
      </div>
      <article class="visually-hidden-example__article">
        <VisuallyHidden.Root>
          <h2>{copy().heading}</h2>
        </VisuallyHidden.Root>
        <ul class="visually-hidden-example__list">
          {copy().items.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      </article>
    </div>
  )
}
