import type { JSX } from "@solidjs/web"

type StatusType = "running" | "stopped" | "degraded"

export function StatusBadge(props: { status: StatusType }): JSX.Element {
  const colors = () => {
    switch (props.status) {
      case "running":
        return "bg-green-100 text-green-700"
      case "stopped":
        return "bg-gray-100 text-gray-600"
      case "degraded":
        return "bg-yellow-100 text-yellow-700"
    }
  }

  return (
    <span
      class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors()}`}
    >
      <span
        class={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          props.status === "running"
            ? "bg-green-500"
            : props.status === "stopped"
              ? "bg-gray-400"
              : "bg-yellow-500"
        }`}
      />
      {props.status}
    </span>
  )
}
