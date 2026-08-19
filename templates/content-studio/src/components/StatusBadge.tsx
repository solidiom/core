import type { JSX } from "@solidjs/web"

type StatusType = "draft" | "review" | "approved" | "published"

export function StatusBadge(props: { status: StatusType }): JSX.Element {
  const colors = () => {
    switch (props.status) {
      case "draft":
        return "bg-gray-100 text-gray-700"
      case "review":
        return "bg-yellow-100 text-yellow-700"
      case "approved":
        return "bg-blue-100 text-blue-700"
      case "published":
        return "bg-green-100 text-green-700"
    }
  }

  return (
    <span
      class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors()}`}
    >
      <span
        class={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          props.status === "draft"
            ? "bg-gray-400"
            : props.status === "review"
              ? "bg-yellow-500"
              : props.status === "approved"
                ? "bg-blue-500"
                : "bg-green-500"
        }`}
      />
      {props.status}
    </span>
  )
}
