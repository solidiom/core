import { createSignal } from "solid-js"
import type { JSX } from "@solidjs/web"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as DataTable from "@solidiom/data-table"
import * as Tabs from "@solidiom/tabs"
import * as Button from "@solidiom/button"

const METRICS = [
  { title: "Total Revenue", value: "$12,486", change: "+14.2%", changeType: "positive" },
  { title: "Orders", value: "384", change: "+8.1%", changeType: "positive" },
  { title: "Avg. Order Value", value: "$32.51", change: "-2.4%", changeType: "negative" },
  { title: "Active Listings", value: "28", change: "+3", changeType: "neutral" },
]

const ORDERS = [
  {
    id: "ORD-001",
    customer: "Alice Johnson",
    product: "Wireless Headphones Pro",
    amount: "$79.99",
    status: "Shipped",
    date: "2026-08-05",
  },
  {
    id: "ORD-002",
    customer: "Bob Smith",
    product: "Organic Cotton T-Shirt",
    amount: "$24.99",
    status: "Processing",
    date: "2026-08-06",
  },
  {
    id: "ORD-003",
    customer: "Carol White",
    product: "Smart Garden Kit",
    amount: "$49.99",
    status: "Delivered",
    date: "2026-08-01",
  },
  {
    id: "ORD-004",
    customer: "Dave Brown",
    product: "Yoga Mat Premium",
    amount: "$34.99",
    status: "Shipped",
    date: "2026-08-07",
  },
  {
    id: "ORD-005",
    customer: "Eve Davis",
    product: "Mechanical Keyboard RGB",
    amount: "$129.99",
    status: "Cancelled",
    date: "2026-08-03",
  },
]

const LISTINGS = [
  { id: "1", name: "Wireless Headphones Pro", price: "$79.99", sales: 42, status: "Active" },
  { id: "2", name: "Bluetooth Speaker Mini", price: "$29.99", sales: 18, status: "Active" },
  { id: "3", name: "USB-C Hub Adapter", price: "$19.99", sales: 0, status: "Draft" },
]

const ORDER_COLUMNS = [
  { key: "id", header: "Order ID", cell: (r: any) => r.id },
  { key: "customer", header: "Customer", cell: (r: any) => r.customer },
  { key: "product", header: "Product", cell: (r: any) => r.product },
  { key: "amount", header: "Amount", cell: (r: any) => r.amount },
  { key: "status", header: "Status", cell: (r: any) => getStatusBadge(r.status) },
  { key: "date", header: "Date", cell: (r: any) => r.date },
]

const LISTING_COLUMNS = [
  { key: "name", header: "Listing", cell: (r: any) => r.name },
  { key: "price", header: "Price", cell: (r: any) => r.price },
  { key: "sales", header: "Sales", cell: (r: any) => r.sales },
  { key: "status", header: "Status", cell: (r: any) => getStatusBadge(r.status) },
]

function getStatusBadge(status: string): JSX.Element {
  const colors: Record<string, string> = {
    Active: "bg-green-100 text-green-700",
    Shipped: "bg-blue-100 text-blue-700",
    Processing: "bg-yellow-100 text-yellow-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    Draft: "bg-gray-100 text-gray-700",
  }
  return (
    <span
      class={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  )
}

export function SellerDashboard(): JSX.Element {
  const [tab, setTab] = createSignal("orders")

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
            <Breadcrumb.Link href="/seller" current class="text-sm font-medium text-gray-900">
              Seller Dashboard
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <p class="mt-1 text-sm text-gray-500">
            Manage your listings, view sales analytics, and handle orders.
          </p>
        </div>
        <Button.Root>Create Listing</Button.Root>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p class="text-sm font-medium text-gray-500">{m.title}</p>
            <p class="mt-2 text-2xl font-bold text-gray-900">{m.value}</p>
            <p
              class={`mt-1 text-xs font-medium ${
                m.changeType === "positive"
                  ? "text-green-600"
                  : m.changeType === "negative"
                    ? "text-red-600"
                    : "text-gray-500"
              }`}
            >
              {m.change} from last month
            </p>
          </Card.Root>
        ))}
      </div>

      <Tabs.Root value={tab} onValueChange={setTab} class="mt-8">
        <div class="border-b border-gray-200">
          <Tabs.List class="flex gap-4">
            <Tabs.Trigger
              value="orders"
              class="cursor-pointer border-b-2 px-3 py-2 text-sm font-medium transition-colors data-[selected]:border-indigo-600 data-[selected]:text-indigo-600 border-transparent text-gray-500"
            >
              Orders
            </Tabs.Trigger>
            <Tabs.Trigger
              value="listings"
              class="cursor-pointer border-b-2 px-3 py-2 text-sm font-medium transition-colors data-[selected]:border-indigo-600 data-[selected]:text-indigo-600 border-transparent text-gray-500"
            >
              My Listings
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <Tabs.Content value="orders">
          <DataTable.Root columns={ORDER_COLUMNS} data={ORDERS}>
            <DataTable.Header>
              {ORDER_COLUMNS.map((col) => (
                <DataTable.HeaderCell>{col.header}</DataTable.HeaderCell>
              ))}
            </DataTable.Header>
            <DataTable.Body>
              {ORDERS.map((row) => (
                <DataTable.Row>
                  {ORDER_COLUMNS.map((col) => (
                    <DataTable.Cell>{col.cell(row)}</DataTable.Cell>
                  ))}
                </DataTable.Row>
              ))}
            </DataTable.Body>
          </DataTable.Root>
        </Tabs.Content>

        <Tabs.Content value="listings">
          <DataTable.Root columns={LISTING_COLUMNS} data={LISTINGS}>
            <DataTable.Header>
              {LISTING_COLUMNS.map((col) => (
                <DataTable.HeaderCell>{col.header}</DataTable.HeaderCell>
              ))}
            </DataTable.Header>
            <DataTable.Body>
              {LISTINGS.map((row) => (
                <DataTable.Row>
                  {LISTING_COLUMNS.map((col) => (
                    <DataTable.Cell>{col.cell(row)}</DataTable.Cell>
                  ))}
                </DataTable.Row>
              ))}
            </DataTable.Body>
          </DataTable.Root>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
