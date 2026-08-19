import type { JSX } from "@solidjs/web"

type StatusType = "active" | "inactive" | "suspended" | "pending"

const STATUS_STYLES: Record<StatusType, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
}

export function StatusBadge(props: { status: StatusType }): JSX.Element {
  return (
    <span
      class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[props.status]}`}
    >
      {props.status}
    </span>
  )
}
