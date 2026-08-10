import type { JSX } from "solid-js"
import * as Card from "@solidiom/card"

interface MetricCardProps {
  label: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
}

export function MetricCard(props: MetricCardProps): JSX.Element {
  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <Card.Header class="flex items-center justify-between pb-2">
        <Card.Title class="text-sm font-medium text-gray-500">
          {props.label}
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold text-gray-900">{props.value}</div>
        <p
          class={`mt-1 text-xs font-medium ${
            props.changeType === "positive"
              ? "text-green-600"
              : props.changeType === "negative"
                ? "text-red-600"
                : "text-gray-500"
          }`}
        >
          {props.change}
        </p>
      </Card.Content>
    </Card.Root>
  )
}
