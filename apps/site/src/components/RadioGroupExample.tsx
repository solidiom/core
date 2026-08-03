import * as RadioGroup from "@solidiom/radio-group"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { label: string; items: Array<{ value: string; label: string }> }> = {
  en: {
    label: "Favorite color",
    items: [
      { value: "red", label: "Red" },
      { value: "blue", label: "Blue" },
      { value: "green", label: "Green" },
    ],
  },
  es: {
    label: "Color favorito",
    items: [
      { value: "red", label: "Rojo" },
      { value: "blue", label: "Azul" },
      { value: "green", label: "Verde" },
    ],
  },
}

export interface RadioGroupExampleProps {
  locale: Locale
}

/** Canonical executable source for the Radio Group documentation example. */
export function RadioGroupExample(props: RadioGroupExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div ref={(el) => el.setAttribute("data-hydrated", "true")} class="radio-group-example">
      <RadioGroup.Root aria-label={copy().label}>
        {copy().items.map((item) => (
          <RadioGroup.Item value={item.value}>
            <RadioGroup.Indicator />
            {item.label}
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  )
}
