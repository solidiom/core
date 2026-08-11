import type { JSX } from "solid-js"
import * as Card from "@solidiom/card"

interface DocCardProps {
  title: string
  category: string
  version: string
  description: string
  status: "published" | "draft" | "archived"
  lastUpdated: string
}

export function DocCard(props: DocCardProps): JSX.Element {
  const statusColor = () => {
    switch (props.status) {
      case "published":
        return "bg-green-100 text-green-700"
      case "draft":
        return "bg-yellow-100 text-yellow-700"
      case "archived":
        return "bg-gray-100 text-gray-600"
    }
  }

  const categoryColor = () => {
    switch (props.category) {
      case "Getting Started":
        return "bg-blue-100 text-blue-700"
      case "API Reference":
        return "bg-purple-100 text-purple-700"
      case "SDK Guides":
        return "bg-green-100 text-green-700"
      case "Tutorials":
        return "bg-orange-100 text-orange-700"
      case "Best Practices":
        return "bg-teal-100 text-teal-700"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-900">{props.title}</h3>
        <span
          class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor()}`}
        >
          {props.status}
        </span>
      </div>
      <div class="mt-1">
        <span
          class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${categoryColor()}`}
        >
          {props.category}
        </span>
      </div>
      <p class="mt-2 text-sm text-gray-500">{props.description}</p>
      <div class="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span>v{props.version}</span>
        <span>{props.lastUpdated}</span>
      </div>
    </Card.Root>
  )
}
