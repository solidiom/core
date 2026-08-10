import { createSignal, type JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as DataTable from "@solidiom/data-table"
import { StatusBadge } from "../components/StatusBadge"

const TRANSACTIONS = [
  { id: "TXN-001", invoice: "INV-001", amount: "$1,250.00", received: "$1,250.00", status: "matched" as const, date: "2026-07-14" },
  { id: "TXN-002", invoice: "INV-002", amount: "$3,400.00", received: "$3,200.00", status: "discrepancy" as const, date: "2026-08-10" },
  { id: "TXN-003", invoice: "INV-004", amount: "$5,200.00", received: "$5,200.00", status: "matched" as const, date: "2026-07-29" },
  { id: "TXN-004", invoice: "—", amount: "—", received: "$450.00", status: "unmatched" as const, date: "2026-08-05" },
  { id: "TXN-005", invoice: "INV-003", amount: "$875.00", received: "—", status: "unmatched" as const, date: "—" },
]

const COLUMNS = [
  { key: "id", header: "Transaction", cell: (r: any) => r.id },
  { key: "invoice", header: "Invoice", cell: (r: any) => r.invoice },
  { key: "amount", header: "Expected", cell: (r: any) => r.amount },
  { key: "received", header: "Received", cell: (r: any) => r.received },
  { key: "status", header: "Status", cell: (r: any) => <StatusBadge status={r.status} /> },
  { key: "date", header: "Date", cell: (r: any) => r.date },
]

export function Reconciliation(): JSX.Element {
  const [filter, setFilter] = createSignal("all")

  const filtered = () =>
    filter() === "all" ? TRANSACTIONS : TRANSACTIONS.filter((t) => t.status === filter())

  return (
    <div>
      <Breadcrumb.Root class="mb-4">
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" class="text-sm text-gray-500 hover:text-gray-700">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator class="text-gray-400">/</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/reconciliation" current class="text-sm font-medium text-gray-900">Reconciliation</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div>
        <h1 class="text-2xl font-bold text-gray-900">Payment Reconciliation</h1>
        <p class="mt-1 text-sm text-gray-500">Match payments to invoices and resolve discrepancies.</p>
      </div>

      <div class="mt-4 flex gap-2">
        {["all", "matched", "unmatched", "discrepancy"].map((f) => (
          <button
            type="button"
            onClick={() => setFilter(f)}
            class={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filter() === f
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <Card.Root class="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <DataTable.Root columns={COLUMNS} data={filtered()}>
          <DataTable.Header>
            {COLUMNS.map((col) => (
              <DataTable.HeaderCell>{col.header}</DataTable.HeaderCell>
            ))}
          </DataTable.Header>
          <DataTable.Body>
            {filtered().map((row) => (
              <DataTable.Row>
                {COLUMNS.map((col) => (
                  <DataTable.Cell>{col.cell(row)}</DataTable.Cell>
                ))}
              </DataTable.Row>
            ))}
          </DataTable.Body>
        </DataTable.Root>
      </Card.Root>
    </div>
  )
}
