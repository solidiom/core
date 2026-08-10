import * as Field from "@solidiom/field"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { label: string; description: string; error: string; placeholder: string }> = {
  en: { label: "Email", description: "We'll never share your email.", error: "Please enter a valid email address.", placeholder: "you@example.com" },
  es: { label: "Correo electrónico", description: "Nunca compartiremos su correo.", error: "Ingrese una dirección de correo válida.", placeholder: "usted@ejemplo.com" },
}

export interface FieldExampleProps {
  locale: Locale
}

/** Canonical executable source for the Field documentation example. */
export function FieldExample(props: FieldExampleProps) {
  const copy = () => COPY[props.locale]
  return (
    <div
      ref={(el) => el.setAttribute("data-hydrated", "true")}
      class="field-example"
      data-field-example
    >
      <Field.Root required>
        <Field.Label>{copy().label}</Field.Label>
        <Field.Description>{copy().description}</Field.Description>
        <Field.Control>
          {(cp) => <input type="email" {...cp()} placeholder={copy().placeholder} />}
        </Field.Control>
      </Field.Root>
    </div>
  )
}
