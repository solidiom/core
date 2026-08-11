import * as Meter from "@solidiom/meter"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    diskUsage: string
    rating: string
  }
> = {
  en: {
    diskUsage: "Disk usage",
    rating: "Rating",
  },
  es: {
    diskUsage: "Uso de disco",
    rating: "Calificación",
  },
}

export interface MeterExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Meter documentation example.
 * Demonstrates gauge meters with safe, caution, and danger states.
 */
export function MeterExample(props: MeterExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="meter-example"
      data-meter-example
    >
      <div class="meter-example__row">
        <Meter.Root
          value={0.35}
          min={0}
          max={1}
          low={0.5}
          high={0.8}
          optimum={0}
          aria-label={copy().diskUsage}
        />
      </div>
      <div class="meter-example__row">
        <Meter.Root value={3} min={0} max={5} optimum={5} aria-label={copy().rating} />
      </div>
    </div>
  )
}
