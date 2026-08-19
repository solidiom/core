import { createSignal } from "solid-js"
import type { JSX } from "@solidjs/web"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as DataTable from "@solidiom/data-table"
import * as Button from "@solidiom/button"
import { InvoiceRow } from "../components/InvoiceRow"
import { StatusBadge } from "../components/StatusBadge"

const INVOICES = [
  {
    id: "INV-001",
    client: "Acme Corp",
    amount: "$1,250.00",
    status: "paid" as const,
    dueDate: "2026-07-15",
    issuedDate: "2026-06-15",
  },
  {
    id: "INV-002",
    client: "Globex Inc",
    amount: "$3,400.00",
    status: "pending" as const,
    dueDate: "2026-08-20",
    issuedDate: "2026-07-20",
  },
  {
    id: "INV-003",
    client: "Initech LLC",
    amount: "$875.00",
    status: "overdue" as const,
    dueDate: "2026-07-01",
    issuedDate: "2026-06-01",
  },
  {
    id: "INV-004",
    client: "Umbrella Co",
    amount: "$5,200.00",
    status: "paid" as const,
    dueDate: "2026-07-30",
    issuedDate: "2026-06-30",
  },
  {
    id: "INV-005",
    client: "Stark Ind",
    amount: "$12,750.00",
    status: "draft" as const,
    dueDate: "2026-09-01",
    issuedDate: "2026-08-01",
  },
  {
    id: "INV-006",
    client: "Wayne Ent",
    amount: "$2,100.00",
    status: "pending" as const,
    dueDate: "2026-08-25",
    issuedDate: "2026-07-25",
  },
]

const COLUMNS = [
  { key: "invoiceNumber", header: "Invoice", cell: (r: any) => r.id },
  { key: "client", header: "Client", cell: (r: any) => r.client },
  { key: "amount", header: "Amount", cell: (r: any) => r.amount },
  { key: "status", header: "Status", cell: (r: any) => <StatusBadge status={r.status} /> },
  { key: "dueDate", header: "Due Date", cell: (r: any) => r.dueDate },
  { key: "issuedDate", header: "Issued", cell: (r: any) => r.issuedDate },
]

export function Invoices(): JSX.Element {
  const [filter, setFilter] = createSignal("all")

  const filtered = () =>
    filter() === "all" ? INVOICES : INVOICES.filter((i) => i.status === filter())

  return (
    <div>
      <Breadcrumb.Root class="mb-4">
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" class="text-sm text-gray-500 hover:text-gray-700">
              Home
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator class="text-gray-400">/</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" current class="text-sm font-medium text-gray-900">
              Invoices
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Invoices</h1>
          <p class="mt-1 text-sm text-gray-500">
            Manage invoices, track payment status, and handle disputes.
          </p>
        </div>
        <Button.Root class="bg-indigo-600 text-white hover:bg-indigo-700">New Invoice</Button.Root>
      </div>

      <div class="mt-4 flex gap-2">
        {["all", "paid", "pending", "overdue", "draft"].map((f) => (
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
