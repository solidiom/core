import * as Tooltip from "@solidiom/tooltip"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    trigger: string
    content: string
  }
> = {
  en: {
    trigger: "Hover me",
    content: "Tooltip content",
  },
  es: {
    trigger: "Pase el cursor",
    content: "Contenido del tooltip",
  },
}

export interface TooltipExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Tooltip documentation example.
 * Demonstrates a hover-triggered tooltip.
 */
export function TooltipExample(props: TooltipExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="tooltip-example"
      data-tooltip-example
    >
      <Tooltip.Root>
        <Tooltip.Trigger>
          <button type="button">{copy().trigger}</button>
        </Tooltip.Trigger>
        <Tooltip.Content>{copy().content}</Tooltip.Content>
      </Tooltip.Root>
    </div>
  )
}
