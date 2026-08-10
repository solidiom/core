import type { JSX } from "solid-js"
import { StatusBadge } from "./StatusBadge"

interface InvoiceRowProps {
  invoiceNumber: string
  client: string
  amount: string
  status: "paid" | "pending" | "overdue" | "draft"
  dueDate: string
  issuedDate: string
}

export function InvoiceRow(props: InvoiceRowProps): JSX.Element {
  return (
    <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 hover:bg-gray-50">
      <div>
        <p class="text-sm font-medium text-gray-900">{props.invoiceNumber}</p>
        <p class="text-xs text-gray-500">{props.client}</p>
      </div>
      <div class="text-right">
        <p class="text-sm font-medium text-gray-900">{props.amount}</p>
        <p class="text-xs text-gray-500">Due {props.dueDate}</p>
      </div>
      <div class="ml-4">
        <StatusBadge status={props.status} />
      </div>
    </div>
  )
}
