/**
 * Styled Field — Tailwind recipe wrapper, using twMerge for class composition.
 */
import { twMerge } from "tailwind-merge"
import * as Field from "@solidiom/field"

export { Field }

const ROOT_CLASSES = "flex flex-col gap-1 disabled:opacity-50"

export interface StyledFieldProps
  extends Omit<Parameters<typeof Field.Root>[0], "class"> {
  class?: string
}

export function StyledField(props: StyledFieldProps) {
  const className = () =>
    twMerge(ROOT_CLASSES, props.class)

  return <Field.Root {...props} class={className()} />
}