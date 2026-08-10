import type { JSX } from "solid-js"

type StatusType = "active" | "mitigated" | "closed"

interface StatusBadgeProps {
  status: StatusType
}

export function StatusBadge(props: StatusBadgeProps): JSX.Element {
  const colors = () => {
    switch (props.status) {
      case "active": return "bg-red-100 text-red-700"
      case "mitigated": return "bg-yellow-100 text-yellow-700"
      case "closed": return "bg-green-100 text-green-700"
    }
  }

  return (
    <span class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors()}`}>
      {props.status}
    </span>
  )
}
