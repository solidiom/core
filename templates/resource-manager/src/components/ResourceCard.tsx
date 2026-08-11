import type { JSX } from "solid-js"
import * as Card from "@solidiom/card"

interface ResourceCardProps {
  name: string
  type: string
  region: string
  status: "running" | "stopped" | "pending" | "error"
  created: string
  tags?: string[]
}

export function ResourceCard(props: ResourceCardProps): JSX.Element {
  const statusColor = () => {
    switch (props.status) {
      case "running":
        return "bg-green-100 text-green-700"
      case "stopped":
        return "bg-gray-100 text-gray-600"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "error":
        return "bg-red-100 text-red-700"
    }
  }

  const typeColor = () => {
    switch (props.type) {
      case "compute":
        return "bg-blue-100 text-blue-700"
      case "storage":
        return "bg-purple-100 text-purple-700"
      case "network":
        return "bg-green-100 text-green-700"
      case "database":
        return "bg-orange-100 text-orange-700"
      case "serverless":
        return "bg-teal-100 text-teal-700"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-900">{props.name}</h3>
        <span
          class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor()}`}
        >
          {props.status}
        </span>
      </div>
      <div class="mt-1">
        <span
          class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColor()}`}
        >
          {props.type}
        </span>
      </div>
      <div class="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span>{props.region}</span>
        <span>Created {props.created}</span>
      </div>
      {props.tags && props.tags.length > 0 && (
        <div class="mt-2 flex flex-wrap gap-1">
          {props.tags.map((tag) => (
            <span class="inline-flex items-center rounded px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card.Root>
  )
}
