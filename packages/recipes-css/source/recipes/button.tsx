/**
 * Styled Button — CSS recipe wrapper with CVA variants.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/button.css"`
 */
import { type JSX } from "@solidjs/web"
import { cva, type VariantProps } from "class-variance-authority"
import * as Button from "@solidiom/button"

export const buttonVariants = cva("solidiom-btn", {
  variants: {
    variant: {
      default: "solidiom-btn--default",
      destructive: "solidiom-btn--destructive",
      outline: "solidiom-btn--outline",
      secondary: "solidiom-btn--secondary",
      ghost: "solidiom-btn--ghost",
      link: "solidiom-btn--link",
    },
    size: {
      default: "solidiom-btn--md",
      sm: "solidiom-btn--sm",
      lg: "solidiom-btn--lg",
      icon: "solidiom-btn--icon",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export type ButtonVariantProps = VariantProps<typeof buttonVariants>

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
