/**
 * Styled Button — Tailwind recipe wrapper with CVA variants.
 * Import stylesheet: `import "@solidiom/recipes-tailwind/styles/button.css"`
 */
import { type JSX } from "@solidjs/web"
import { cva, type VariantProps } from "class-variance-authority"
import * as Button from "@solidiom/button"

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

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
