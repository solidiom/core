import * as Select from "@solidiom/select"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { label: string; items: string[] }> = {
  en: { label: "Choose a framework", items: ["React", "Solid", "Vue", "Svelte"] },
  es: { label: "Elige un framework", items: ["React", "Solid", "Vue", "Svelte"] },
}

export interface SelectExampleProps {
  locale: Locale
}

/** Canonical executable source for the Select documentation example. */
export function SelectExample(props: SelectExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div ref={(el) => el.setAttribute("data-hydrated", "true")} class="select-example">
      <Select.Root>
        <Select.Trigger aria-label={copy().label}>
          <Select.Value placeholder={copy().label} />
        </Select.Trigger>
        <Select.Content>
          {copy().items.map((item) => (
            <Select.Item value={item.toLowerCase()}>{item}</Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  )
}
