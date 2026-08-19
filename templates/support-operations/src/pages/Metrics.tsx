import type { JSX } from "@solidjs/web"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"

const METRICS = [
  { label: "Avg Resolution Time", value: "4.2h", change: "-12%", positive: true },
  { label: "CSAT Score", value: "4.6/5", change: "+0.3", positive: true },
  { label: "Open Tickets", value: "23", change: "+5", positive: false },
  { label: "Agent Utilization", value: "87%", change: "+4%", positive: true },
]

const AGENTS = [
  { name: "Alex Rivera", ticketsResolved: 45, avgTime: "3.1h", csat: 4.8, workload: "High" },
  { name: "Jordan Lee", ticketsResolved: 38, avgTime: "4.5h", csat: 4.5, workload: "Medium" },
  { name: "Morgan Chen", ticketsResolved: 52, avgTime: "2.8h", csat: 4.9, workload: "High" },
  { name: "Casey Kim", ticketsResolved: 29, avgTime: "5.2h", csat: 4.3, workload: "Low" },
  { name: "Taylor Smith", ticketsResolved: 41, avgTime: "3.9h", csat: 4.6, workload: "Medium" },
]

export function Metrics(): JSX.Element {
  return (
    <div>
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Tickets</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" current>
              Metrics
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="mt-6">
        <h1 class="text-2xl font-bold text-gray-900">Support Metrics</h1>
        <p class="mt-1 text-sm text-gray-500">
          Track resolution times, CSAT scores, and agent performance.
        </p>
      </div>

      <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric) => (
          <Card.Root>
            <Card.Header>
              <Card.Title class="text-sm font-medium text-gray-500">{metric.label}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div class="flex items-end gap-2">
                <span class="text-3xl font-bold text-gray-900">{metric.value}</span>
                <span
                  class={`mb-1 text-sm font-medium ${metric.positive ? "text-green-600" : "text-red-600"}`}
                >
                  {metric.change}
                </span>
              </div>
            </Card.Content>
          </Card.Root>
        ))}
      </div>

      <div class="mt-8">
        <h2 class="text-lg font-semibold text-gray-900">Agent Performance</h2>
        <div class="mt-4 overflow-x-auto rounded-lg border border-gray-200">
          <table class="min-w-full text-left text-sm">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50">
                <th class="px-6 py-3 font-medium text-gray-500">Agent</th>
                <th class="px-6 py-3 font-medium text-gray-500">Resolved</th>
                <th class="px-6 py-3 font-medium text-gray-500">Avg Time</th>
                <th class="px-6 py-3 font-medium text-gray-500">CSAT</th>
                <th class="px-6 py-3 font-medium text-gray-500">Workload</th>
              </tr>
            </thead>
            <tbody>
              {AGENTS.map((agent) => (
                <tr class="border-b border-gray-100">
                  <td class="px-6 py-4 font-medium text-gray-900">{agent.name}</td>
                  <td class="px-6 py-4 text-gray-600">{agent.ticketsResolved}</td>
                  <td class="px-6 py-4 text-gray-600">{agent.avgTime}</td>
                  <td class="px-6 py-4 text-gray-600">{agent.csat}</td>
                  <td class="px-6 py-4">
                    <span
                      class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        agent.workload === "High"
                          ? "bg-red-100 text-red-700"
                          : agent.workload === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {agent.workload}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
