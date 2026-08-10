import * as Slider from "@solidiom/slider"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { label: string }> = {
  en: { label: "Volume" },
  es: { label: "Volumen" },
}

export interface SliderExampleProps { locale: Locale }

/** Canonical executable source for the Slider documentation example. */
export function SliderExample(props: SliderExampleProps) {
  const copy = () => COPY[props.locale]
  return (
    <div ref={(el) => el.setAttribute("data-hydrated", "true")} class="slider-example" data-slider-example>
      <div class="slider-example__row">
        <Slider.Root defaultValue={[50]} min={0} max={100} step={1} aria-label={copy().label}>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb aria-label={copy().label} />
          </Slider.Track>
        </Slider.Root>
      </div>
    </div>
  )
}
