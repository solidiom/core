import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Select from "@solidiom/select"
import * as Card from "@solidiom/card"

type Severity = "critical" | "warning" | "info" | "debug"

interface Event {
  id: string
  timestamp: string
  severity: Severity
  source: string
  message: string
}

const EVENTS: Event[] = [
  { id: "evt-001", timestamp: "2024-03-15 14:32:01", severity: "critical", source: "api-gateway", message: "Connection pool exhausted — 503 errors detected" },
  { id: "evt-002", timestamp: "2024-03-15 14:30:45", severity: "warning", source: "payment-processor", message: "Response latency exceeded 300ms threshold" },
  { id: "evt-003", timestamp: "2024-03-15 14:28:12", severity: "info", source: "auth-service", message: "SSL certificate renewal completed successfully" },
  { id: "evt-004", timestamp: "2024-03-15 14:25:33", severity: "warning", source: "data-pipeline", message: "Queue depth approaching 80% capacity" },
  { id: "evt-005", timestamp: "2024-03-15 14:22:18", severity: "critical", source: "cdn-edge", message: "Origin server timeout — fallback cache activated" },
  { id: "evt-006", timestamp: "2024-03-15 14:20:05", severity: "info", source: "notification-service", message: "Batch email delivery completed: 1,240 messages" },
  { id: "evt-007", timestamp: "2024-03-15 14:18:42", severity: "debug", source: "search-indexer", message: "Index rebuild started for product catalog" },
  { id: "evt-008", timestamp: "2024-03-15 14:15:09", severity: "info", source: "api-gateway", message: "Auto-scaling triggered: 4 → 6 instances" },
  { id: "evt-009", timestamp: "2024-03-15 14:12:55", severity: "warning", source: "payment-processor", message: "Retry rate above 5% for merchant endpoints" },
  { id: "evt-010", timestamp: "2024-03-15 14:10:30", severity: "critical", source: "auth-service", message: "Multiple failed login attempts detected from IP range 192.168.1.0/24" },
]

function SeverityBadge(props: { severity: Severity }): JSX.Element {
  const colors = () => {
    switch (props.severity) {
      case "critical": return "bg-red-100 text-red-700"
      case "warning": return "bg-yellow-100 text-yellow-700"
      case "info": return "bg-blue-100 text-blue-700"
      case "debug": return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <span class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors()}`}>
      {props.severity}
    </span>
  )
}

export function Events(): JSX.Element {
  const [search, setSearch] = createSignal("")
  const [severityFilter, setSeverityFilter] = createSignal<string>("all")

  const filteredEvents = () =>
    EVENTS.filter((e) => {
      const matchesSearch =
        e.message.toLowerCase().includes(search().toLowerCase()) ||
        e.source.toLowerCase().includes(search().toLowerCase())
      const matchesSeverity = severityFilter() === "all" || e.severity === severityFilter()
      return matchesSearch && matchesSeverity
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
              <Breadcrumb.Link href="/events" current class="text-gray-900 font-medium">Events</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h1 class="text-2xl font-bold text-gray-900">Events</h1>
        <p class="mt-1 text-sm text-gray-500">Real-time event stream with filtering and severity badges.</p>
      </div>

      <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Card.Header class="flex flex-wrap items-center gap-4 border-b border-gray-200 px-6 py-4">
          <input
            type="text"
            placeholder="Search events..."
            value={search()}
            onInput={(e: Event) => setSearch((e.target as HTMLInputElement).value)}
            class="w-64 rounded-md border border-gray-300 px-3 py-1.5 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Select.Root
            value={severityFilter()}
            onChange={(e) => setSeverityFilter(e.currentTarget.value)}
            class="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </Select.Root>
          <span class="text-sm text-gray-500">{filteredEvents().length} events</span>
        </Card.Header>
        <Card.Content class="p-0">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Time</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Severity</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Source</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Message</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              {filteredEvents().map((event) => (
                <tr class="hover:bg-gray-50">
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-400">{event.id}</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{event.timestamp}</td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <SeverityBadge severity={event.severity} />
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{event.source}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{event.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card.Content>
      </Card.Root>
    </div>
  )
}
