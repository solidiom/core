import * as Progress from "@solidiom/progress"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    label: string
  }
> = {
  en: {
    label: "Upload progress",
  },
  es: {
    label: "Progreso de carga",
  },
}

export interface ProgressExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Progress documentation example.
 * Demonstrates determinate and indeterminate progress bars.
 */
export function ProgressExample(props: ProgressExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="progress-example"
      data-progress-example
    >
      <div class="progress-example__row">
        <Progress.Root value={65} aria-label={copy().label}>
          <Progress.Indicator />
        </Progress.Root>
      </div>
      <div class="progress-example__row">
        <Progress.Root value={null} aria-label={copy().label}>
          <Progress.Indicator />
        </Progress.Root>
      </div>
    </div>
  )
}
