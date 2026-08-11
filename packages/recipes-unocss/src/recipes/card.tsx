/**
 * Styled Card — UnoCSS recipe wrapper.
 * Import the stylesheet separately: `import "@solidiom/recipes-unocss/styles/card.css"`
 */
import * as Card from "@solidiom/card"

export { Card }

const BASE_CLASS = "solidiom-card"

export interface StyledCardProps extends Omit<Parameters<typeof Card.Root>[0], "class"> {
  class?: string
}

export function StyledCard(props: StyledCardProps) {
  const className = () => [BASE_CLASS, props.class].filter(Boolean).join(" ")

  return <Card.Root {...props} class={className()} />
}
