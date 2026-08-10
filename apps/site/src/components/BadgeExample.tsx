import * as Badge from "@solidiom/badge"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    labels: string[]
  }
> = {
  en: {
    labels: ["v1.0", "new", "featured"],
  },
  es: {
    labels: ["v1.0", "nuevo", "destacado"],
  },
}

export interface BadgeExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Badge documentation example.
 * Demonstrates multiple badges displayed inline.
 */
export function BadgeExample(props: BadgeExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="badge-example"
      data-badge-example
    >
      <div class="badge-example__row">
        {copy().labels.map((label) => (
          <Badge.Root>{label}</Badge.Root>
        ))}
      </div>
    </div>
  )
}
