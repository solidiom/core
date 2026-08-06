/**
 * Styled Radio Group — Tailwind recipe wrapper.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/radio-group.css"`
 */
import * as RadioGroup from "@solidiom/radio-group"

export { RadioGroup }

const BASE_CLASS = "solidiom-radio-group"

export interface StyledRadioGroupProps
  extends Omit<Parameters<typeof RadioGroup.Root>[0], "class"> {
  class?: string
}

export function StyledRadioGroup(props: StyledRadioGroupProps) {
  const className = () =>
    [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <RadioGroup.Root {...props} class={className()} />
}
