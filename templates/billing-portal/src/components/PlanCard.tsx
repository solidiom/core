import type { JSX } from "solid-js"
import * as Card from "@solidiom/card"

interface PlanCardProps {
  name: string
  price: string
  period: string
  features: string[]
  highlighted?: boolean
  current?: boolean
}

export function PlanCard(props: PlanCardProps): JSX.Element {
  return (
    <Card.Root
      class={`relative flex flex-col rounded-lg border bg-white p-6 shadow-sm ${
        props.highlighted
          ? "border-indigo-600 ring-2 ring-indigo-600"
          : "border-gray-200"
      }`}
    >
      {props.highlighted && (
        <span class="absolute -top-3 right-4 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-medium text-white">
          Popular
        </span>
      )}
      {props.current && (
        <span class="absolute -top-3 left-4 rounded-full bg-green-600 px-3 py-0.5 text-xs font-medium text-white">
          Current Plan
        </span>
      )}
      <h3 class="text-lg font-semibold text-gray-900">{props.name}</h3>
      <div class="mt-2 flex items-baseline gap-1">
        <span class="text-3xl font-bold text-gray-900">{props.price}</span>
        <span class="text-sm text-gray-500">/{props.period}</span>
      </div>
      <ul class="mt-6 flex-1 space-y-3">
        {props.features.map((feature) => (
          <li class="flex items-center gap-2 text-sm text-gray-600">
            <span class="text-green-500">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <button
        type="button"
        class={`mt-6 w-full rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          props.highlighted
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {props.current ? "Current Plan" : "Upgrade"}
      </button>
    </Card.Root>
  )
}
