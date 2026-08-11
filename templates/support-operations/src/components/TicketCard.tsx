import type { JSX } from "solid-js"
import * as Card from "@solidiom/card"

export function TicketCard(props: {
  id: string
  subject: string
  priority: string
  assignee: string
  status: string
}): JSX.Element {
  const priorityColor = () => {
    switch (props.priority) {
      case "critical":
        return "text-red-700 bg-red-100"
      case "high":
        return "text-orange-700 bg-orange-100"
      case "medium":
        return "text-yellow-700 bg-yellow-100"
      case "low":
        return "text-gray-700 bg-gray-100"
      default:
        return "text-gray-700 bg-gray-100"
    }
  }

  return (
    <Card.Root class="max-w-sm">
      <Card.Header>
        <Card.Title>{props.subject}</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="space-y-2 text-sm text-gray-500">
          <div>ID: {props.id}</div>
          <div>Assignee: {props.assignee}</div>
          <div class="flex items-center gap-2">
            <span class="font-medium">Priority:</span>
            <span
              class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priorityColor()}`}
            >
              {props.priority}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-medium">Status:</span>
            <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">
              {props.status}
            </span>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  )
}
