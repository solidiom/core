/**
 * Styled Button — CSS recipe wrapper, using generated variant classes.
 * Import the stylesheet separately: `import "@solidiom/recipes-css/styles/button.css"`
 */
import * as Button from "@solidiom/button"
import { buttonVariants, type ButtonVariantProps } from "./button.variants"

export { buttonVariants, type ButtonVariantProps }

export interface StyledButtonProps extends Button.ButtonProps, ButtonVariantProps {}

export function StyledButton(props: StyledButtonProps) {
  const { variant: _variant, size: _size, class: _class, ...buttonProps } = props
  const className = () =>
    [buttonVariants({ variant: props.variant, size: props.size }), props.class]
      .filter(Boolean)
      .join(" ")

  return <Button.Root {...buttonProps} class={className()} />
}
