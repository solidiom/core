/**
 * Styled Input — Tailwind recipe wrapper, using twMerge for class composition.
 */
import { twMerge } from "tailwind-merge"
import * as Input from "@solidiom/input"

const BASE_CLASSES =
  "block w-full min-h-[2.25rem] px-3 py-1.5 text-sm leading-5 border border-solid rounded-md outline-none transition-colors bg-background text-foreground border-border"
const FOCUS_CLASSES =
  "focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
const INVALID_CLASSES = "invalid:border-destructive"
const DISABLED_CLASSES = "disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
const READONLY_CLASSES = "readonly:bg-muted readonly:cursor-not-allowed"

const TEXTAREA_CLASSES = "resize-vertical min-h-[3rem]"

export interface StyledInputProps extends Omit<Parameters<typeof Input.Root>[0], "class"> {
  class?: string
}

export function StyledInput(props: StyledInputProps) {
  const className = () =>
    twMerge(
      `${BASE_CLASSES} ${FOCUS_CLASSES} ${INVALID_CLASSES} ${DISABLED_CLASSES} ${READONLY_CLASSES}`,
      props.class,
    )

  return <Input.Root {...props} class={className()} />
}

export interface StyledTextareaProps extends Omit<Parameters<typeof Input.Textarea>[0], "class"> {
  class?: string
}

export function StyledTextarea(props: StyledTextareaProps) {
  const className = () =>
    twMerge(
      `${BASE_CLASSES} ${TEXTAREA_CLASSES} ${FOCUS_CLASSES} ${INVALID_CLASSES} ${DISABLED_CLASSES} ${READONLY_CLASSES}`,
      props.class,
    )

  return <Input.Textarea {...props} class={className()} />
}
