import type { JSX } from "solid-js"
import { SeverityBadge } from "./SeverityBadge"

export interface EventItem {
  id: string
  timestamp: string
  actor: string
  action: string
  resource: string
  severity: "info" | "warning" | "error" | "success"
}

export function EventRow(props: { event: EventItem }): JSX.Element {
  return (
    <tr class="hover:bg-gray-50">
      <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{props.event.timestamp}</td>
      <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{props.event.actor}</td>
      <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{props.event.action}</td>
      <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{props.event.resource}</td>
      <td class="whitespace-nowrap px-6 py-4">
        <SeverityBadge severity={props.event.severity} />
      </td>
    </tr>
  )
}
