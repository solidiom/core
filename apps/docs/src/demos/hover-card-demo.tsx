import * as HoverCard from "@solidiom/hover-card"

export function HoverCardDemo() {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger href="#">Hover me</HoverCard.Trigger>
      <HoverCard.Content>Preview content on hover</HoverCard.Content>
    </HoverCard.Root>
  )
}

export const hoverCardDemoCode = `import * as HoverCard from "@solidiom/hover-card"

function HoverCardExample() {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger href="#">Hover me</HoverCard.Trigger>
      <HoverCard.Content>Preview content on hover</HoverCard.Content>
    </HoverCard.Root>
  )
}`
