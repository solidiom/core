import * as Toggle from "@solidiom/toggle"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    bold: string
    italic: string
    code: string
  }
> = {
  en: {
    bold: "B",
    italic: "I",
    code: "</>",
  },
  es: {
    bold: "N",
    italic: "C",
    code: "</>",
  },
}

export interface ToggleExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Toggle documentation example.
 * Demonstrates toggle buttons in pressed and unpressed states.
 */
export function ToggleExample(props: ToggleExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="toggle-example"
      data-toggle-example
    >
      <div class="toggle-example__row">
        <Toggle.Root defaultPressed>{copy().bold}</Toggle.Root>
        <Toggle.Root>{copy().italic}</Toggle.Root>
        <Toggle.Root>{copy().code}</Toggle.Root>
      </div>
    </div>
  )
}
