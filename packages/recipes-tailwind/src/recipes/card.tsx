/**
 * Styled Card — Tailwind recipe wrapper, using twMerge for class composition.
 */
import { twMerge } from "tailwind-merge"
import * as Card from "@solidiom/card"

export { Card }

const ROOT_CLASSES = "border border-solid border-border rounded-radius bg-popover p-4"

export interface StyledCardProps
  extends Omit<Parameters<typeof Card.Root>[0], "class"> {
  class?: string
}

export function StyledCard(props: StyledCardProps) {
  const className = () =>
    twMerge(ROOT_CLASSES, props.class)

  return <Card.Root {...props} class={className()} />
}