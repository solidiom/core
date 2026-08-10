import * as ScrollArea from "@solidiom/scroll-area"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { items: string[] }> = {
  en: { items: Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`) },
  es: { items: Array.from({ length: 20 }, (_, i) => `Elemento ${i + 1}`) },
}

export interface ScrollAreaExampleProps {
  locale: Locale
}

/** Canonical executable source for the Scroll Area documentation example. */
export function ScrollAreaExample(props: ScrollAreaExampleProps) {
  const copy = () => COPY[props.locale]
  return (
    <div
      ref={(el) => el.setAttribute("data-hydrated", "true")}
      class="scroll-area-example"
      data-scroll-area-example
    >
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport>
          {copy().items.map((item) => (
            <div class="scroll-area-example__item">{item}</div>
          ))}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  )
}
