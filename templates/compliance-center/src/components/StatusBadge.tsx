import type { JSX } from "solid-js"

type StatusType =
  | "compliant"
  | "non-compliant"
  | "partial"
  | "not-assessed"
  | "verified"
  | "pending"
  | "missing"
  | "expired"

const STATUS_STYLES: Record<StatusType, string> = {
  "compliant": "bg-green-100 text-green-800",
  "non-compliant": "bg-red-100 text-red-800",
  "partial": "bg-yellow-100 text-yellow-800",
  "not-assessed": "bg-gray-100 text-gray-800",
  "verified": "bg-green-100 text-green-800",
  "pending": "bg-yellow-100 text-yellow-800",
  "missing": "bg-red-100 text-red-800",
  "expired": "bg-orange-100 text-orange-800",
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
