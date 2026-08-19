import type { JSX } from "@solidjs/web"
import * as Card from "@solidiom/card"

interface ModelCardProps {
  name: string
  version: string
  status: "active" | "inactive" | "training"
  latency: string
  throughput: string
  accuracy: string
}

export function ModelCard(props: ModelCardProps): JSX.Element {
  const statusColor = () => {
    switch (props.status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "inactive":
        return "bg-gray-100 text-gray-600"
      case "training":
        return "bg-yellow-100 text-yellow-700"
    }
  }

  const statusDot = () => {
    switch (props.status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-400"
      case "training":
        return "bg-yellow-500"
    }
  }

  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <Card.Header class="flex items-start justify-between pb-3">
        <div>
          <Card.Title class="text-base font-semibold text-gray-900">{props.name}</Card.Title>
          <p class="text-xs text-gray-500">v{props.version}</p>
        </div>
        <span
          class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor()}`}
        >
          <span class={`mr-1.5 h-1.5 w-1.5 rounded-full ${statusDot()}`} />
          {props.status}
        </span>
      </Card.Header>
      <Card.Content>
        <dl class="mt-4 grid grid-cols-3 gap-4">
          <div>
            <dt class="text-xs font-medium text-gray-500">Latency</dt>
            <dd class="mt-1 text-sm font-semibold text-gray-900">{props.latency}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium text-gray-500">Throughput</dt>
            <dd class="mt-1 text-sm font-semibold text-gray-900">{props.throughput}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium text-gray-500">Accuracy</dt>
            <dd class="mt-1 text-sm font-semibold text-gray-900">{props.accuracy}</dd>
          </div>
        </dl>
      </Card.Content>
    </Card.Root>
  )
}
