import type { JSX } from "solid-js"
import * as Card from "@solidiom/card"

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-yellow-100 text-yellow-700",
  DELETE: "bg-red-100 text-red-700",
  PATCH: "bg-purple-100 text-purple-700",
}

interface EndpointCardProps {
  method: string
  path: string
  description: string
  version: string
  status: "active" | "deprecated" | "draft"
}

export function EndpointCard(props: EndpointCardProps): JSX.Element {
  const methodColor = METHOD_COLORS[props.method] || "bg-gray-100 text-gray-700"

  const statusColor = () => {
    switch (props.status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "deprecated":
        return "bg-red-100 text-red-700"
      case "draft":
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <span
            class={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ${methodColor}`}
          >
            {props.method}
          </span>
          <span class="font-mono text-sm text-gray-900">{props.path}</span>
        </div>
        <span
          class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor()}`}
        >
          {props.status}
        </span>
      </div>
      <p class="mt-2 text-sm text-gray-500">{props.description}</p>
      <div class="mt-2 text-xs text-gray-400">v{props.version}</div>
    </Card.Root>
  )
}
