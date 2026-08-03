import { createSignal } from "solid-js"
import * as Checkbox from "@solidiom/checkbox"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { label: string; description: string }> = {
  en: { label: "Accept terms", description: "Toggle with Space to check or uncheck." },
  es: { label: "Aceptar términos", description: "Alterna con Espacio para marcar o desmarcar." },
}

export interface CheckboxExampleProps {
  locale: Locale
}

/** Canonical executable source for the Checkbox documentation example. */
export function CheckboxExample(props: CheckboxExampleProps) {
  const copy = () => COPY[props.locale]
  const [checked, setChecked] = createSignal(false)

  return (
    <div ref={(el) => el.setAttribute("data-hydrated", "true")} class="checkbox-example">
      <Checkbox.Root checked={checked} onCheckedChange={setChecked} aria-label={copy().label}>
        <Checkbox.Indicator>{checked() ? "✓" : ""}</Checkbox.Indicator>
      </Checkbox.Root>
      <span>{copy().description}</span>
    </div>
  )
}
