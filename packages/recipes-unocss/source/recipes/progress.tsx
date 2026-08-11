/**
 * Styled Progress — UnoCSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-unocss/styles/progress.css"`
 */
import * as Progress from "@solidiom/progress"

export { Progress }

const BASE_CLASS = "solidiom-progress"

export interface StyledProgressProps extends Omit<Parameters<typeof Progress.Root>[0], "class"> {
  class?: string
}

export function StyledProgress(props: StyledProgressProps) {
  const className = () => [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <Progress.Root {...props} class={className()} />
}
