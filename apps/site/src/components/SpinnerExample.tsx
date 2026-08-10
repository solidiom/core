import * as Spinner from "@solidiom/spinner"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    loading: string
  }
> = {
  en: {
    loading: "Loading...",
  },
  es: {
    loading: "Cargando...",
  },
}

export interface SpinnerExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Spinner documentation example.
 * Demonstrates loading spinners in different sizes.
 */
export function SpinnerExample(props: SpinnerExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="spinner-example"
      data-spinner-example
    >
      <div class="spinner-example__row">
        <Spinner.Root label={copy().loading} />
      </div>
    </div>
  )
}
