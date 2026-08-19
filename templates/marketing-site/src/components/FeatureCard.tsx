import type { JSX } from "@solidjs/web"
import * as Card from "@solidiom/card"

export function FeatureCard(props: {
  title: string
  description: string
  icon?: string
}): JSX.Element {
  return (
    <Card.Root class="max-w-sm">
      <Card.Header>
        {props.icon && <div class="text-2xl">{props.icon}</div>}
        <Card.Title>{props.title}</Card.Title>
      </Card.Header>
      <Card.Content>
        <p class="text-sm text-gray-500">{props.description}</p>
      </Card.Content>
    </Card.Root>
  )
}
