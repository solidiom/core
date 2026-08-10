import type { JSX } from "solid-js"
import * as Card from "@solidiom/card"

export function WorkflowCard(props: { name: string; trigger: string; actions: string[]; status: "active" | "paused" | "draft" }): JSX.Element {
  const statusStyles = {
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    draft: "bg-gray-100 text-gray-800",
  }

  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white">
      <Card.Content class="px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900">{props.name}</p>
            <p class="text-xs text-gray-500">Trigger: {props.trigger}</p>
            <p class="mt-0.5 text-xs text-gray-400">Actions: {props.actions.join(", ")}</p>
          </div>
          <span class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[props.status]}`}>
            {props.status}
          </span>
        </div>
      </Card.Content>
    </Card.Root>
  )
}

export function StatusBadge(props: { type: "success" | "error" | "running" | "queued" | "cancelled" | "active" | "paused" | "draft" }): JSX.Element {
  const styles: Record<string, string> = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    running: "bg-blue-100 text-blue-800",
    queued: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-gray-100 text-gray-800",
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    draft: "bg-gray-100 text-gray-800",
  }

  return (
    <span class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[props.type]}`}>
      {props.type}
    </span>
  )
}
