import * as HoverCard from "@solidiom/hover-card"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    trigger: string
    title: string
    description: string
  }
> = {
  en: {
    trigger: "@solidiom",
    title: "Solidiom",
    description: "A modern UI component library built with SolidJS.",
  },
  es: {
    trigger: "@solidiom",
    title: "Solidiom",
    description: "Una biblioteca moderna de componentes UI construida con SolidJS.",
  },
}

export interface HoverCardExampleProps {
  locale: Locale
}

/** Canonical executable source for the Hover Card documentation example. */
export function HoverCardExample(props: HoverCardExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="hover-card-example"
      data-hover-card-example
    >
      <HoverCard.Root>
        <HoverCard.Trigger>
          <span style={{ "text-decoration": "underline", cursor: "pointer" }}>
            {copy().trigger}
          </span>
        </HoverCard.Trigger>
        <HoverCard.Content>
          <div class="hover-card-example__content">
            <div class="hover-card-example__title">{copy().title}</div>
            <div class="hover-card-example__description">{copy().description}</div>
          </div>
        </HoverCard.Content>
      </HoverCard.Root>
    </div>
  )
}
