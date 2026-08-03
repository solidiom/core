import * as Popover from "@solidiom/popover"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { trigger: string; content: string }> = {
  en: {
    trigger: "More info",
    content: "This is additional context shown in a popover. Press Escape to close.",
  },
  es: {
    trigger: "Más información",
    content: "Este es contexto adicional mostrado en un popover. Presiona Escape para cerrar.",
  },
}

export interface PopoverExampleProps {
  locale: Locale
}

/** Canonical executable source for the Popover documentation example. */
export function PopoverExample(props: PopoverExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div ref={(el) => el.setAttribute("data-hydrated", "true")} class="popover-example">
      <Popover.Root>
        <Popover.Trigger>{copy().trigger}</Popover.Trigger>
        <Popover.Content>
          <p>{copy().content}</p>
          <Popover.Close>×</Popover.Close>
        </Popover.Content>
      </Popover.Root>
    </div>
  )
}
