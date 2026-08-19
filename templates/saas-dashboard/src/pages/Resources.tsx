import type { JSX } from "@solidjs/web"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Input from "@solidiom/input"
import * as Card from "@solidiom/card"

interface Resource {
  id: string
  name: string
  type: string
  status: "running" | "stopped" | "degraded"
  region: string
  created: string
}

const RESOURCES: Resource[] = [
  {
    id: "res-001",
    name: "api-gateway",
    type: "Service",
    status: "running",
    region: "us-east-1",
    created: "2024-01-15",
  },
  {
    id: "res-002",
    name: "auth-service",
    type: "Service",
    status: "running",
    region: "us-east-1",
    created: "2024-01-12",
  },
  {
    id: "res-003",
    name: "billing-db",
    type: "Database",
    status: "running",
    region: "us-west-2",
    created: "2024-02-01",
  },
  {
    id: "res-004",
    name: "worker-pool",
    type: "Compute",
    status: "running",
    region: "eu-west-1",
    created: "2024-02-10",
  },
  {
    id: "res-005",
    name: "cdn-assets",
    type: "CDN",
    status: "running",
    region: "global",
    created: "2024-01-20",
  },
  {
    id: "res-006",
    name: "staging-env",
    type: "Environment",
    status: "stopped",
    region: "us-east-1",
    created: "2024-03-01",
  },
  {
    id: "res-007",
    name: "monitoring",
    type: "Service",
    status: "degraded",
    region: "us-east-1",
    created: "2024-01-18",
  },
  {
    id: "res-008",
    name: "cache-layer",
    type: "Cache",
    status: "running",
    region: "us-east-1",
    created: "2024-02-15",
  },
]

function StatusBadge(props: { status: Resource["status"] }): JSX.Element {
  const colors = () => {
    switch (props.status) {
      case "running":
        return "bg-green-100 text-green-700"
      case "stopped":
        return "bg-gray-100 text-gray-600"
      case "degraded":
        return "bg-yellow-100 text-yellow-700"
    }
  }

  return (
    <span
      class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors()}`}
    >
      <span
        class={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          props.status === "running"
            ? "bg-green-500"
            : props.status === "stopped"
              ? "bg-gray-400"
              : "bg-yellow-500"
        }`}
      />
      {props.status}
    </span>
  )
}

export function Resources(): JSX.Element {
  const [search, setSearch] = createSignal("")

  const filteredResources = () =>
    RESOURCES.filter(
      (r) =>
        r.name.toLowerCase().includes(search().toLowerCase()) ||
        r.type.toLowerCase().includes(search().toLowerCase()),
    )

  return (
    <div class="space-y-6">
      <div>
        <Breadcrumb.Root class="mb-2">
          <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" class="hover:text-gray-700">
                Home
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/resources" current class="text-gray-900 font-medium">
                Resources
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h1 class="text-2xl font-bold text-gray-900">Resources</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage your infrastructure resources across all regions.
        </p>
      </div>

      <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Card.Header class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div class="flex items-center gap-4">
            <Input.Root
              placeholder="Search resources..."
              value={search()}
              onInput={(e) => setSearch(e.currentTarget.value)}
              class="w-64 rounded-md border border-gray-300 px-3 py-1.5 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span class="text-sm text-gray-500">{filteredResources().length} resources</span>
          </div>
          <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Add Resource
          </Button.Root>
        </Card.Header>
        <Card.Content class="p-0">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Region
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              {filteredResources().map((resource) => (
                <tr class="hover:bg-gray-50">
                  <td class="whitespace-nowrap px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{resource.name}</div>
                    <div class="text-xs text-gray-400">{resource.id}</div>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{resource.type}</td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={resource.status} />
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {resource.region}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {resource.created}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-right">
                    <Button.Root class="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      View
                    </Button.Root>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card.Content>
      </Card.Root>
    </div>
  )
}
