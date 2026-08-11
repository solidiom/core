import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Input from "@solidiom/input"
import * as Tabs from "@solidiom/tabs"
import * as Dialog from "@solidiom/dialog"
import { EndpointCard } from "../components/EndpointCard"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
type EndpointStatus = "active" | "deprecated" | "draft"

interface Endpoint {
  id: string
  method: HttpMethod
  path: string
  description: string
  version: string
  status: EndpointStatus
  category: string
}

const ENDPOINTS: Endpoint[] = [
  { id: "ep-001", method: "GET", path: "/v1/users", description: "List all users with pagination support", version: "1.2.0", status: "active", category: "Users" },
  { id: "ep-002", method: "POST", path: "/v1/users", description: "Create a new user account", version: "1.2.0", status: "active", category: "Users" },
  { id: "ep-003", method: "GET", path: "/v1/users/:id", description: "Get user details by ID", version: "1.2.0", status: "active", category: "Users" },
  { id: "ep-004", method: "PUT", path: "/v1/users/:id", description: "Update user profile information", version: "1.2.0", status: "active", category: "Users" },
  { id: "ep-005", method: "DELETE", path: "/v1/users/:id", description: "Delete user account and all associated data", version: "1.1.0", status: "deprecated", category: "Users" },
  { id: "ep-006", method: "GET", path: "/v2/products", description: "List products with filtering and sorting", version: "2.0.0", status: "active", category: "Products" },
  { id: "ep-007", method: "POST", path: "/v2/products", description: "Create a new product listing", version: "2.0.0", status: "active", category: "Products" },
  { id: "ep-008", method: "GET", path: "/v1/orders", description: "List orders with status filtering", version: "1.0.0", status: "active", category: "Orders" },
  { id: "ep-009", method: "POST", path: "/v1/orders", description: "Place a new order", version: "1.0.0", status: "active", category: "Orders" },
  { id: "ep-010", method: "PATCH", path: "/v1/orders/:id/status", description: "Update order status", version: "1.0.0", status: "draft", category: "Orders" },
  { id: "ep-011", method: "GET", path: "/v1/analytics/summary", description: "Get aggregated analytics summary", version: "1.0.0", status: "active", category: "Analytics" },
  { id: "ep-012", method: "GET", path: "/v1/health", description: "Service health check endpoint", version: "1.0.0", status: "active", category: "System" },
]

export function EndpointCatalog(): JSX.Element {
  const [search, setSearch] = createSignal("")
  const [methodFilter, setMethodFilter] = createSignal<string>("all")
  const [showCreateDialog, setShowCreateDialog] = createSignal(false)

  const filtered = () =>
    ENDPOINTS.filter((ep) => {
      const matchesSearch =
        search() === "" ||
        ep.path.toLowerCase().includes(search().toLowerCase()) ||
        ep.description.toLowerCase().includes(search().toLowerCase())
      const matchesMethod = methodFilter() === "all" || ep.method === methodFilter()
      return matchesSearch && matchesMethod
    })

  return (
    <div class="space-y-8">
      <div>
        <Breadcrumb.Root class="mb-2">
          <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" class="hover:text-gray-700">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" current class="text-gray-900 font-medium">Endpoints</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Endpoint Catalog</h1>
            <p class="mt-1 text-sm text-gray-500">Browse, search, and manage API endpoints with versioning.</p>
          </div>
          <Button.Root class="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700" onClick={() => setShowCreateDialog(true)}>
            <span>Add Endpoint</span>
          </Button.Root>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <Input.Root class="flex-1">
          <Input.Input
            type="text"
            placeholder="Search endpoints..."
            class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={search()}
            onInput={(e) => setSearch(e.currentTarget.value)}
          />
        </Input.Root>
        <select
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={methodFilter()}
          onChange={(e) => setMethodFilter(e.currentTarget.value)}
        >
          <option value="all">All Methods</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>

      <div class="rounded-lg border border-gray-200 bg-white">
        <Tabs.Root defaultValue="grid">
          <div class="border-b border-gray-200 px-4">
            <Tabs.List class="flex gap-4">
              <Tabs.Trigger
                value="grid"
                class="border-b-2 border-transparent py-2 text-sm font-medium text-gray-500 hover:text-gray-700 data-[active]:border-indigo-500 data-[active]:text-indigo-600"
              >
                Grid View
              </Tabs.Trigger>
              <Tabs.Trigger
                value="list"
                class="border-b-2 border-transparent py-2 text-sm font-medium text-gray-500 hover:text-gray-700 data-[active]:border-indigo-500 data-[active]:text-indigo-600"
              >
                List View
              </Tabs.Trigger>
            </Tabs.List>
          </div>
          <Tabs.Content value="grid">
            <div class="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered().map((ep) => (
                <EndpointCard
                  method={ep.method}
                  path={ep.path}
                  description={ep.description}
                  version={ep.version}
                  status={ep.status}
                />
              ))}
            </div>
            {filtered().length === 0 && (
              <div class="py-12 text-center text-sm text-gray-500">
                No endpoints match your search criteria.
              </div>
            )}
          </Tabs.Content>
          <Tabs.Content value="list">
            <div class="divide-y divide-gray-200">
              {filtered().map((ep) => (
                <div class="flex items-center gap-4 px-4 py-3">
                  <span class={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ${
                    ep.method === "GET" ? "bg-green-100 text-green-700" :
                    ep.method === "POST" ? "bg-blue-100 text-blue-700" :
                    ep.method === "PUT" ? "bg-yellow-100 text-yellow-700" :
                    ep.method === "DELETE" ? "bg-red-100 text-red-700" :
                    "bg-purple-100 text-purple-700"
                  }`}>
                    {ep.method}
                  </span>
                  <span class="font-mono text-sm text-gray-900">{ep.path}</span>
                  <span class="text-sm text-gray-500">{ep.description}</span>
                  <span class="ml-auto text-xs text-gray-400">v{ep.version}</span>
                </div>
              ))}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      <Dialog.Root open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <Dialog.Portal>
          <Dialog.Backdrop class="fixed inset-0 bg-black/40" />
          <Dialog.Content class="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title class="text-lg font-semibold text-gray-900">Add Endpoint</Dialog.Title>
            <p class="mt-1 text-sm text-gray-500">Define a new API endpoint.</p>
            <div class="mt-4 space-y-4">
              <Input.Root>
                <Input.Label class="block text-sm font-medium text-gray-700">Path</Input.Label>
                <Input.Input type="text" placeholder="/v1/resource" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </Input.Root>
              <Input.Root>
                <Input.Label class="block text-sm font-medium text-gray-700">Description</Input.Label>
                <Input.Input type="text" placeholder="Describe this endpoint..." class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </Input.Root>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <Button.Root class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button.Root>
              <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700" onClick={() => {
                setShowCreateDialog(false)

              }}>
                Create
              </Button.Root>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
