import type { JSX } from "@solidjs/web"
import * as Card from "@solidiom/card"
import * as Button from "@solidiom/button"

export function PriceCard(props: {
  tier: string
  price: string
  period: string
  features: string[]
  highlighted?: boolean
}): JSX.Element {
  return (
    <Card.Root class={`max-w-sm ${props.highlighted ? "ring-2 ring-indigo-600" : ""}`}>
      <Card.Header>
        <Card.Title>{props.tier}</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="mb-4">
          <span class="text-3xl font-bold text-gray-900">{props.price}</span>
          <span class="text-gray-500">/{props.period}</span>
        </div>
        <ul class="space-y-2">
          {props.features.map((feature) => (
            <li class="flex items-center gap-2 text-sm text-gray-600">
              <span class="text-green-500">&#10003;</span>
              {feature}
            </li>
          ))}
        </ul>
        <div class="mt-6">
          <Button.Root
            class={
              props.highlighted
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }
          >
            Get Started
          </Button.Root>
        </div>
      </Card.Content>
    </Card.Root>
  )
}
