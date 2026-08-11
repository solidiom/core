/**
 * Styled Progress — Tailwind recipe wrapper, using twMerge for class composition.
 */
import { twMerge } from "tailwind-merge"
import * as Progress from "@solidiom/progress"

export { Progress }

const ROOT_CLASSES = "relative flex w-full h-2 overflow-hidden rounded-full bg-secondary"

export interface StyledProgressProps extends Omit<Parameters<typeof Progress.Root>[0], "class"> {
  class?: string
}

export function StyledProgress(props: StyledProgressProps) {
  const className = () => twMerge(ROOT_CLASSES, props.class)

  return <Progress.Root {...props} class={className()} />
}
