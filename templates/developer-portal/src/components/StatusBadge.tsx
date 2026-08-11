import type { JSX } from "solid-js"

type StatusBadgeType = "active" | "suspended" | "pending" | "revoked"

interface StatusBadgeProps {
  type: StatusBadgeType
}

export function StatusBadge(props: StatusBadgeProps): JSX.Element {
  const colors = () => {
    switch (props.type) {
      case "active":
        return "bg-green-100 text-green-700"
      case "suspended":
        return "bg-yellow-100 text-yellow-700"
      case "pending":
        return "bg-blue-100 text-blue-700"
      case "revoked":
        return "bg-red-100 text-red-700"
    }
  }

  return (
    <span
      class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors()}`}
    >
      {props.type}
    </span>
  )
}
