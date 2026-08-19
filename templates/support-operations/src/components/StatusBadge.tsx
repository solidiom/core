import type { JSX } from "@solidjs/web"

type StatusType = "open" | "in_progress" | "pending" | "resolved" | "closed"

export function StatusBadge(props: { status: StatusType }): JSX.Element {
  const colors = () => {
    switch (props.status) {
      case "open":
        return "bg-red-100 text-red-700"
      case "in_progress":
        return "bg-blue-100 text-blue-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "resolved":
        return "bg-green-100 text-green-700"
      case "closed":
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <span
      class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors()}`}
    >
      <span
        class={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          props.status === "open"
            ? "bg-red-500"
            : props.status === "in_progress"
              ? "bg-blue-500"
              : props.status === "pending"
                ? "bg-yellow-500"
                : props.status === "resolved"
                  ? "bg-green-500"
                  : "bg-gray-400"
        }`}
      />
      {props.status.replace(/_/g, " ")}
    </span>
  )
}
