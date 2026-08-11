import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Input from "@solidiom/input"
import * as Card from "@solidiom/card"
import * as Pagination from "@solidiom/pagination"
import { A } from "@solidjs/router"
import { ResourceCard } from "../components/ResourceCard"

type ResourceType = "Service" | "Database" | "Compute" | "Storage" | "Network"
type ResourceStatus = "running" | "stopped" | "pending" | "error"

interface Resource {
  id: string
  name: string
  type: ResourceType
  status: ResourceStatus
  region: string
  created: string
  tags: string[]
}

const RESOURCES: Resource[] = [
  { id: "res-001", name: "api-gateway", type: "Service", status: "running", region: "us-east-1", created: "2024-01-15", tags: ["production", "critical"] },
  { id: "res-002", name: "auth-service", type: "Service", status: "running", region: "us-east-1", created: "2024-01-12", tags: ["production"] },
  { id: "res-003", name: "billing-db", type: "Database", status: "running", region: "us-west-2", created: "2024-02-01", tags: ["production", "persistence"] },
  { id: "res-004", name: "worker-pool-1", type: "Compute", status: "running", region: "eu-west-1", created: "2024-02-10", tags: ["batch", "async"] },
  { id: "res-005", name: "media-storage", type: "Storage", status: "running", region: "us-east-1", created: "2024-01-20", tags: ["assets", "cdn"] },
  { id: "res-006", name: "vpc-main", type: "Network", status: "running", region: "us-east-1", created: "2024-01-10", tags: ["infrastructure"] },
  { id: "res-007", name: "monitoring-svc", type: "Service", status: "error", region: "us-east-1", created: "2024-01-18", tags: ["observability"] },
  { id: "res-008", name: "analytics-db", type: "Database", status: "stopped", region: "eu-west-1", created: "2024-02-15", tags: ["analytics", "staging"] },
  { id: "res-009", name: "compute-burst", type: "Compute", status: "pending", region: "ap-south-1", created: "2024-03-01", tags: ["auto-scale"] },
  { id: "res-010", name: "backup-vault", type: "Storage", status: "running", region: "us-west-2", created: "2024-02-20", tags: ["backup", "compliance"] },
  { id: "res-011", name: "lb-internal", type: "Network", status: "running", region: "us-east-1", created: "2024-01-25", tags: ["infrastructure", "production"] },
  { id: "res-012", name: "notification-svc", type: "Service", status: "stopped", region: "eu-central-1", created: "2024-03-05", tags: ["messaging"] },
]

const ITEMS_PER_PAGE = 6

export function ResourceList(): JSX.Element {
  const [search, setSearch] = createSignal("")
  const [typeFilter, setTypeFilter] = createSignal<string>("all")
  const [page, setPage] = createSignal(1)

  const filtered = () =>
    RESOURCES.filter((r) => {
      const matchesSearch =
        search() === "" ||
        r.name.toLowerCase().includes(search().toLowerCase()) ||
        r.type.toLowerCase().includes(search().toLowerCase()) ||
        r.region.toLowerCase().includes(search().toLowerCase())
      const matchesType = typeFilter() === "all" || r.type === typeFilter()
      return matchesSearch && matchesType
    })

  const totalPages = () => Math.ceil(filtered().length / ITEMS_PER_PAGE)

  const paged = () => {
    const start = (page() - 1) * ITEMS_PER_PAGE
    return filtered().slice(start, start + ITEMS_PER_PAGE)
  }

  return (
    <div class="space-y-6">
      <div>
        <Breadcrumb.Root class="mb-2">
          <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" class="hover:text-gray-700">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" current class="text-gray-900 font-medium">Resources</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Resources</h1>
            <p class="mt-1 text-sm text-gray-500">Manage your infrastructure resources across all regions.</p>
          </div>
          <A href="/create">
            <Button.Root class="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
              Add Resource
            </Button.Root>
          </A>
        </div>
      </div>

      <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div class="flex items-center gap-4 border-b border-gray-200 px-6 py-4">
          <Input.Root
              type="text"
              placeholder="Search resources..."
              class="flex-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={search()}
              onInput={(e) => { setSearch(e.currentTarget.value); setPage(1); }}
          />
          <select
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={typeFilter()}
            onChange={(e) => { setTypeFilter(e.currentTarget.value); setPage(1); }}
          >
            <option value="all">All Types</option>
            <option value="Service">Service</option>
            <option value="Database">Database</option>
            <option value="Compute">Compute</option>
            <option value="Storage">Storage</option>
            <option value="Network">Network</option>
          </select>
          <span class="text-sm text-gray-500">{filtered().length} resources</span>
        </div>

        <div class="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {paged().map((resource) => (
            <A href={`/resource/${resource.id}`}>
              <ResourceCard
                name={resource.name}
                type={resource.type.toLowerCase()}
                region={resource.region}
                status={resource.status}
                created={resource.created}
                tags={resource.tags}
              />
            </A>
          ))}
        </div>

        {paged().length === 0 && (
          <div class="py-12 text-center text-sm text-gray-500">
            No resources match your search criteria.
          </div>
        )}

        {totalPages() > 1 && (
          <div class="flex items-center justify-between border-t border-gray-200 px-6 py-3">
            <span class="text-sm text-gray-500">
              Page {page()} of {totalPages()}
            </span>
            <Pagination.Root class="flex items-center gap-1">
                <Pagination.PreviousButton
                  disabled={page() === 1}
                  onClick={() => setPage(page() - 1)}
                  class="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </Pagination.PreviousButton>
                {Array.from({ length: totalPages() }, (_, i) => i + 1).map((p) => (
                  <button
                    onClick={() => setPage(p)}
                    class={`inline-flex items-center justify-center rounded-md px-2 py-1 text-sm font-medium ${
                      p === page()
                        ? "bg-indigo-600 text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    aria-current={p === page() ? "page" : undefined}
                  >
                    {p}
                  </button>
                ))}
                <Pagination.NextButton
                  disabled={page() === totalPages()}
                  onClick={() => setPage(page() + 1)}
                  class="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </Pagination.NextButton>
            </Pagination.Root>
          </div>
        )}
      </Card.Root>
    </div>
  )
}
