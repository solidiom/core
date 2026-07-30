/**
 * Styled Button — Tailwind recipe wrapper, using generated variant classes.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/button.css"`
 */
import { type JSX } from "@solidjs/web"
import * as Button from "@solidiom/button"
import { buttonVariants, type ButtonVariantProps } from "./button.variants"

export { buttonVariants, type ButtonVariantProps }

export interface StyledButtonProps extends ButtonVariantProps {
  children: JSX.Element
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  class?: string
}

export function StyledButton(props: StyledButtonProps) {
  const className = () =>
    [buttonVariants({ variant: props.variant, size: props.size }), props.class]
      .filter(Boolean)
      .join(" ")

  return (
    <Button.Root
      disabled={props.disabled}
      loading={props.loading}
      onClick={props.onClick}
      type={props.type}
      class={className()}
    >
      {props.children}
    </Button.Root>
  )
}
