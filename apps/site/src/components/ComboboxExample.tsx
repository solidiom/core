import { createSignal, For } from "solid-js"
import * as Combobox from "@solidiom/combobox"
import type { Locale } from "../lib/locale"

interface FruitItem {
  value: string
  label: Record<Locale, string>
}

const ITEMS: FruitItem[] = [
  { value: "apple", label: { en: "Apple", es: "Manzana" } },
  { value: "banana", label: { en: "Banana", es: "Plátano" } },
  { value: "cherry", label: { en: "Cherry", es: "Cereza" } },
  { value: "mango", label: { en: "Mango", es: "Mango" } },
  { value: "orange", label: { en: "Orange", es: "Naranja" } },
  { value: "strawberry", label: { en: "Strawberry", es: "Fresa" } },
]

const COPY: Record<Locale, { placeholder: string; label: string }> = {
  en: { placeholder: "Search fruits…", label: "Fruit" },
  es: { placeholder: "Buscar frutas…", label: "Fruta" },
}

export interface ComboboxExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Combobox documentation example.
 * The matching content entry declares this file as its source so rendered code
 * and the live behavior do not drift apart.
 */
export function ComboboxExample(props: ComboboxExampleProps) {
  const [filter, setFilter] = createSignal("")

  const filteredItems = () => {
    const query = filter().toLowerCase()
    if (!query) return ITEMS
    return ITEMS.filter(
      (item) =>
        item.label[props.locale].toLowerCase().includes(query) ||
        item.value.toLowerCase().includes(query),
    )
  }

  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="combobox-example"
      data-combobox-example
    >
      <label class="combobox-example__label" id="combobox-example-label">
        {copy().label}
      </label>
      <Combobox.Root>
        <Combobox.Input
          placeholder={copy().placeholder}
          onFilter={setFilter}
          class="combobox-example__input"
        />
        <Combobox.Content class="combobox-example__content">
          <For each={filteredItems()}>
            {(item) => (
              <Combobox.Item value={item.value} textValue={item.label[props.locale]}>
                <Combobox.ItemText>{item.label[props.locale]}</Combobox.ItemText>
              </Combobox.Item>
            )}
          </For>
        </Combobox.Content>
      </Combobox.Root>
    </div>
  )
}
