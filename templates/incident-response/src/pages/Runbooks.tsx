import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as Button from "@solidiom/button"
import * as Input from "@solidiom/input"
import * as Select from "@solidiom/select"

type Category = "Infrastructure" | "Security" | "Application"

interface Runbook {
  id: string
  title: string
  category: Category
  steps: number
  lastUpdated: string
  author: string
}

const RUNBOOKS: Runbook[] = [
  { id: "RB-001", title: "Database Failover Procedure", category: "Infrastructure", steps: 8, lastUpdated: "2024-03-10", author: "Alice Chen" },
  { id: "RB-002", title: "DDoS Mitigation Steps", category: "Security", steps: 12, lastUpdated: "2024-03-08", author: "Bob Martinez" },
  { id: "RB-003", title: "API Gateway Restart", category: "Application", steps: 4, lastUpdated: "2024-03-05", author: "Carol Wu" },
  { id: "RB-004", title: "SSL Certificate Renewal", category: "Security", steps: 6, lastUpdated: "2024-02-28", author: "Dave Kim" },
  { id: "RB-005", title: "Memory Leak Response", category: "Application", steps: 7, lastUpdated: "2024-02-25", author: "Eve Johnson" },
  { id: "RB-006", title: "Network Partition Recovery", category: "Infrastructure", steps: 10, lastUpdated: "2024-02-20", author: "Frank Liu" },
  { id: "RB-007", title: "Data Corruption Remediation", category: "Application", steps: 9, lastUpdated: "2024-02-15", author: "Grace Park" },
  { id: "RB-008", title: "Compromised Server Isolation", category: "Security", steps: 15, lastUpdated: "2024-02-10", author: "Alice Chen" },
  { id: "RB-009", title: "Load Balancer Failover", category: "Infrastructure", steps: 5, lastUpdated: "2024-02-05", author: "Bob Martinez" },
  { id: "RB-010", title: "Cache Layer Flush", category: "Infrastructure", steps: 3, lastUpdated: "2024-01-30", author: "Carol Wu" },
]

function CategoryBadge(props: { category: Category }): JSX.Element {
  const colors = () => {
    switch (props.category) {
      case "Infrastructure": return "bg-blue-100 text-blue-700"
      case "Security": return "bg-red-100 text-red-700"
      case "Application": return "bg-purple-100 text-purple-700"
    }
  }

  return (
    <span class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors()}`}>
      {props.category}
    </span>
  )
}

export function Runbooks(): JSX.Element {
  const [search, setSearch] = createSignal("")
  const [categoryFilter, setCategoryFilter] = createSignal<string>("all")

  const filteredRunbooks = () =>
    RUNBOOKS.filter((rb) => {
      const matchesSearch =
        rb.title.toLowerCase().includes(search().toLowerCase()) ||
        rb.id.toLowerCase().includes(search().toLowerCase())
      const matchesCategory = categoryFilter() === "all" || rb.category === categoryFilter()
      return matchesSearch && matchesCategory
    })

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
              <Breadcrumb.Link href="/runbooks" current class="text-gray-900 font-medium">Runbooks</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h1 class="text-2xl font-bold text-gray-900">Runbooks</h1>
        <p class="mt-1 text-sm text-gray-500">Step-by-step operational runbooks for common incident scenarios.</p>
      </div>

      <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Card.Header class="flex flex-wrap items-center gap-4 border-b border-gray-200 px-6 py-4">
          <Input.Root
            placeholder="Search runbooks..."
            value={search()}
            onValueChange={setSearch}
            class="w-64 rounded-md border border-gray-300 px-3 py-1.5 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Select.Root defaultValue="all" onValueChange={(v) => setCategoryFilter(Array.isArray(v) ? v[0] : v)}>
            <Select.Trigger class="inline-flex items-center justify-between rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <Select.Value placeholder="All Categories" />
            </Select.Trigger>
            <Select.Content class="z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md">
              <Select.Item value="all" class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100">All Categories</Select.Item>
              <Select.Item value="Infrastructure" class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100">Infrastructure</Select.Item>
              <Select.Item value="Security" class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100">Security</Select.Item>
              <Select.Item value="Application" class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100">Application</Select.Item>
            </Select.Content>
          </Select.Root>
          <span class="text-sm text-gray-500">{filteredRunbooks().length} runbooks</span>
          <div class="ml-auto">
            <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              New Runbook
            </Button.Root>
          </div>
        </Card.Header>
        <Card.Content class="p-0">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Steps</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Last Updated</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Author</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              {filteredRunbooks().map((rb) => (
                <tr class="hover:bg-gray-50">
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-400">{rb.id}</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{rb.title}</td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <CategoryBadge category={rb.category} />
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{rb.steps} steps</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{rb.lastUpdated}</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{rb.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card.Content>
      </Card.Root>
    </div>
  )
}
