import * as Listbox from "@solidiom/listbox"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { label: string; items: string[] }> = {
  en: {
    label: "Fruits",
    items: ["Apple", "Banana", "Cherry", "Date", "Elderberry"],
  },
  es: {
    label: "Frutas",
    items: ["Manzana", "Plátano", "Cereza", "Dátil", "Sabadilla"],
  },
}

export interface ListboxExampleProps {
  locale: Locale
}

/** Canonical executable source for the Listbox documentation example. */
export function ListboxExample(props: ListboxExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="listbox-example"
      data-listbox-example
    >
      <Listbox.Root
        selectionMode="single"
        defaultValue={[]}
        aria-label={copy().label}
      >
        {copy().items.map((item) => (
          <Listbox.Item value={item.toLowerCase()}>{item}</Listbox.Item>
        ))}
      </Listbox.Root>
    </div>
  )
}
