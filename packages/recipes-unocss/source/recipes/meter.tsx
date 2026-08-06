/**
 * Styled Meter — UnoCSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-unocss/styles/meter.css"`
 */
import * as Meter from "@solidiom/meter"

export { Meter }

const BASE_CLASS = "solidiom-meter"

export interface StyledMeterProps
  extends Omit<Parameters<typeof Meter.Root>[0], "class"> {
  class?: string
}

export function StyledMeter(props: StyledMeterProps) {
  const className = () =>
    [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <Meter.Root {...props} class={className()} />
}