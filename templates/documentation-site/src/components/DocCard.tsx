import type { JSX } from "@solidjs/web"
import * as Card from "@solidiom/card"

export function DocCard(props: {
  title: string
  description: string
  category: string
  href?: string
}): JSX.Element {
  return (
    <Card.Root class="max-w-sm">
      <Card.Header>
        <Card.Title>{props.title}</Card.Title>
      </Card.Header>
      <Card.Content>
        <p class="text-sm text-gray-500">{props.description}</p>
        <div class="mt-2">
          <span class="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            {props.category}
          </span>
        </div>
      </Card.Content>
    </Card.Root>
  )
}
