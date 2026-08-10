import * as Input from "@solidiom/input"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    textPlaceholder: string
    emailPlaceholder: string
    disabledLabel: string
  }
> = {
  en: {
    textPlaceholder: "Enter your name",
    emailPlaceholder: "you@example.com",
    disabledLabel: "Disabled input",
  },
  es: {
    textPlaceholder: "Ingrese su nombre",
    emailPlaceholder: "usted@ejemplo.com",
    disabledLabel: "Campo deshabilitado",
  },
}

export interface InputExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Input documentation example.
 * Demonstrates text, email, and disabled input states.
 */
export function InputExample(props: InputExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="input-example"
      data-input-example
    >
      <div class="input-example__row">
        <Input.Root type="text" placeholder={copy().textPlaceholder} />
      </div>
      <div class="input-example__row">
        <Input.Root type="email" placeholder={copy().emailPlaceholder} />
      </div>
      <div class="input-example__row">
        <Input.Root type="text" placeholder={copy().disabledLabel} disabled />
      </div>
    </div>
  )
}
