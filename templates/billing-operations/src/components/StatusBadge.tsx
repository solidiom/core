import type { JSX } from "solid-js"

type StatusType = "paid" | "pending" | "overdue" | "draft" | "matched" | "unmatched" | "discrepancy"

interface StatusBadgeProps {
  status: StatusType
}

const STYLES: Record<StatusType, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  overdue: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-700",
  matched: "bg-green-100 text-green-700",
  unmatched: "bg-yellow-100 text-yellow-700",
  discrepancy: "bg-red-100 text-red-700",
}

const LABELS: Record<StatusType, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
  draft: "Draft",
  matched: "Matched",
  unmatched: "Unmatched",
  discrepancy: "Discrepancy",
}

export function StatusBadge(props: StatusBadgeProps): JSX.Element {
  return (
    <span
      class={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[props.status]}`}
    >
      {LABELS[props.status]}
    </span>
  )
}
