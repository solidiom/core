import type { JSX } from "solid-js"

type StatusBadgeType = "running" | "stopped" | "pending" | "error" | "creating" | "deleting"

interface StatusBadgeProps {
  type: StatusBadgeType
}

export function StatusBadge(props: StatusBadgeProps): JSX.Element {
  const colors = () => {
    switch (props.type) {
      case "running": return "bg-green-100 text-green-700"
      case "stopped": return "bg-gray-100 text-gray-600"
      case "pending": return "bg-yellow-100 text-yellow-700"
      case "error": return "bg-red-100 text-red-700"
      case "creating": return "bg-blue-100 text-blue-700"
      case "deleting": return "bg-orange-100 text-orange-700"
    }
  }

  return (
    <span class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors()}`}>
      {props.type}
    </span>
  )
}
