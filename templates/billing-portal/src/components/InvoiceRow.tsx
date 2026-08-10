import type { JSX } from "solid-js"

interface InvoiceRowProps {
  number: string
  date: string
  amount: string
  status: "paid" | "pending" | "overdue"
}

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  overdue: "bg-red-100 text-red-700",
}

const STATUS_LABELS: Record<string, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
}

export function InvoiceRow(props: InvoiceRowProps): JSX.Element {
  return (
    <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 hover:bg-gray-50">
      <div>
        <p class="text-sm font-medium text-gray-900">{props.number}</p>
        <p class="text-xs text-gray-500">{props.date}</p>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-gray-900">{props.amount}</span>
        <span class={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[props.status]}`}>
          {STATUS_LABELS[props.status]}
        </span>
        <button type="button" class="text-sm text-indigo-600 hover:text-indigo-700">
          Download
        </button>
      </div>
    </div>
  )
}
