import * as Label from "@solidiom/label"
import * as Input from "@solidiom/input"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    username: string
    email: string
    placeholder: string
  }
> = {
  en: {
    username: "Username",
    email: "Email",
    placeholder: "Enter your email",
  },
  es: {
    username: "Nombre de usuario",
    email: "Correo electrónico",
    placeholder: "Ingrese su correo",
  },
}

export interface LabelExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Label documentation example.
 * Demonstrates linked labels with required and invalid states.
 */
export function LabelExample(props: LabelExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="label-example"
      data-label-example
    >
      <div class="label-example__row">
        <Label.Root htmlFor="label-demo-username" required>
          {copy().username}
        </Label.Root>
        <Input.Root id="label-demo-username" type="text" required />
      </div>
      <div class="label-example__row">
        <Label.Root htmlFor="label-demo-email" invalid>
          {copy().email}
        </Label.Root>
        <Input.Root id="label-demo-email" type="email" placeholder={copy().placeholder} invalid />
      </div>
    </div>
  )
}
