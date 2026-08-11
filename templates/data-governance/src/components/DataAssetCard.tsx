import type { JSX } from "solid-js"
import * as Card from "@solidiom/card"

interface DataAssetCardProps {
  name: string
  type: string
  owner: string
  classification: string
  description: string
  lastUpdated: string
}

export function DataAssetCard(props: DataAssetCardProps): JSX.Element {
  const typeColor = () => {
    switch (props.type) {
      case "table":
        return "bg-blue-100 text-blue-700"
      case "api":
        return "bg-green-100 text-green-700"
      case "dataset":
        return "bg-purple-100 text-purple-700"
      case "report":
        return "bg-orange-100 text-orange-700"
      case "stream":
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
          class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColor()}`}
        >
          {props.type}
        </span>
      </div>
      <p class="mt-1 text-sm text-gray-500">{props.description}</p>
      <div class="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span>Owner: {props.owner}</span>
        <span>Updated: {props.lastUpdated}</span>
      </div>
      <div class="mt-2">
        <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700">
          {props.classification}
        </span>
      </div>
    </Card.Root>
  )
}
