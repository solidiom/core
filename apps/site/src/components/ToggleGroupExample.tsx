import * as ToggleGroup from "@solidiom/toggle-group"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    normal: string
    bold: string
    italic: string
  }
> = {
  en: {
    normal: "A",
    bold: "B",
    italic: "I",
  },
  es: {
    normal: "N",
    bold: "N",
    italic: "C",
  },
}

export interface ToggleGroupExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Toggle Group documentation example.
 */
export function ToggleGroupExample(props: ToggleGroupExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="toggle-group-example"
      data-toggle-group-example
    >
      <ToggleGroup.Root type="single" defaultValue={["normal"]}>
        <ToggleGroup.Item value="normal">{copy().normal}</ToggleGroup.Item>
        <ToggleGroup.Item value="bold">{copy().bold}</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">{copy().italic}</ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  )
}
