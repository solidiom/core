import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as Tabs from "@solidiom/tabs"

const METRICS = [
  {
    title: "Total Requests",
    value: "2.4M",
    change: "+12% from last month",
    changeType: "positive" as const,
  },
  {
    title: "Latency p99",
    value: "142ms",
    change: "-18ms from last month",
    changeType: "positive" as const,
  },
  {
    title: "Error Rate",
    value: "0.8%",
    change: "+0.2% from last month",
    changeType: "negative" as const,
  },
  {
    title: "Bandwidth",
    value: "340 GB",
    change: "+28 GB from last month",
    changeType: "positive" as const,
  },
]

interface EndpointUsage {
  path: string
  method: string
  requests: string
  avgLatency: string
  p99Latency: string
  errors: string
  errorRate: string
}

const ENDPOINT_USAGE: EndpointUsage[] = [
  {
    path: "/v1/users",
    method: "GET",
    requests: "842,300",
    avgLatency: "23ms",
    p99Latency: "89ms",
    errors: "1,240",
    errorRate: "0.15%",
  },
  {
    path: "/v1/users",
    method: "POST",
    requests: "124,800",
    avgLatency: "45ms",
    p99Latency: "178ms",
    errors: "2,890",
    errorRate: "2.32%",
  },
  {
    path: "/v2/products",
    method: "GET",
    requests: "1,205,400",
    avgLatency: "18ms",
    p99Latency: "67ms",
    errors: "890",
    errorRate: "0.07%",
  },
  {
    path: "/v1/orders",
    method: "GET",
    requests: "203,600",
    avgLatency: "34ms",
    p99Latency: "142ms",
    errors: "1,560",
    errorRate: "0.77%",
  },
  {
    path: "/v1/orders",
    method: "POST",
    requests: "89,200",
    avgLatency: "67ms",
    p99Latency: "234ms",
    errors: "4,120",
    errorRate: "4.62%",
  },
  {
    path: "/v1/analytics/summary",
    method: "GET",
    requests: "12,400",
    avgLatency: "156ms",
    p99Latency: "890ms",
    errors: "320",
    errorRate: "2.58%",
  },
]

function MetricCard(props: {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
}): JSX.Element {
  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <Card.Header class="flex items-center justify-between pb-2">
        <Card.Title class="text-sm font-medium text-gray-500">{props.title}</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold text-gray-900">{props.value}</div>
        <p
          class={`mt-1 text-xs font-medium ${
            props.changeType === "positive"
              ? "text-green-600"
              : props.changeType === "negative"
                ? "text-red-600"
                : "text-gray-500"
          }`}
        >
          {props.change}
        </p>
      </Card.Content>
    </Card.Root>
  )
}

export function UsageAnalytics(): JSX.Element {
  const [timeRange, setTimeRange] = createSignal("30d")

  return (
    <div class="space-y-8">
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
              <Breadcrumb.Link href="/usage" current class="text-gray-900 font-medium">
                Usage Analytics
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Usage Analytics</h1>
            <p class="mt-1 text-sm text-gray-500">
              Request volume, latency percentiles, and error rates per endpoint.
            </p>
          </div>
          <select
            class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={timeRange()}
            onChange={(e) => setTimeRange(e.currentTarget.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric) => (
          <MetricCard
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
          />
        ))}
      </div>

      <div class="rounded-lg border border-gray-200 bg-white">
        <Tabs.Root defaultValue="by-endpoint">
          <div class="border-b border-gray-200 px-4">
            <Tabs.List class="flex gap-4">
              <Tabs.Trigger
                value="by-endpoint"
                class="border-b-2 border-transparent py-2 text-sm font-medium text-gray-500 hover:text-gray-700 data-[active]:border-indigo-500 data-[active]:text-indigo-600"
              >
                By Endpoint
              </Tabs.Trigger>
              <Tabs.Trigger
                value="by-status"
                class="border-b-2 border-transparent py-2 text-sm font-medium text-gray-500 hover:text-gray-700 data-[active]:border-indigo-500 data-[active]:text-indigo-600"
              >
                By Status Code
              </Tabs.Trigger>
            </Tabs.List>
          </div>

          <Tabs.Content value="by-endpoint">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="border-b border-gray-200 bg-gray-50">
                    <th class="px-4 py-3 font-medium text-gray-500">Endpoint</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Requests</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Avg Latency</th>
                    <th class="px-4 py-3 font-medium text-gray-500">p99 Latency</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Errors</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Error Rate</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  {ENDPOINT_USAGE.map((row) => (
                    <tr class="hover:bg-gray-50">
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                          <span
                            class={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold ${
                              row.method === "GET"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {row.method}
                          </span>
                          <span class="font-mono text-gray-900">{row.path}</span>
                        </div>
                      </td>
                      <td class="px-4 py-3 text-gray-900">{row.requests}</td>
                      <td class="px-4 py-3 text-gray-900">{row.avgLatency}</td>
                      <td class="px-4 py-3 text-gray-900">{row.p99Latency}</td>
                      <td class="px-4 py-3 text-gray-900">{row.errors}</td>
                      <td class="px-4 py-3">
                        <span
                          class={`font-medium ${
                            parseFloat(row.errorRate) > 2
                              ? "text-red-600"
                              : parseFloat(row.errorRate) > 1
                                ? "text-yellow-600"
                                : "text-gray-900"
                          }`}
                        >
                          {row.errorRate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tabs.Content>

          <Tabs.Content value="by-status">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="border-b border-gray-200 bg-gray-50">
                    <th class="px-4 py-3 font-medium text-gray-500">Status Code</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Count</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Percentage</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  {[
                    { code: "200 OK", count: "2,198,400", pct: "91.2%" },
                    { code: "201 Created", count: "214,000", pct: "8.9%" },
                    { code: "400 Bad Request", count: "12,300", pct: "0.5%" },
                    { code: "401 Unauthorized", count: "4,200", pct: "0.2%" },
                    { code: "429 Too Many Requests", count: "8,900", pct: "0.4%" },
                    { code: "500 Internal Server Error", count: "3,400", pct: "0.1%" },
                  ].map((row) => (
                    <tr class="hover:bg-gray-50">
                      <td class="px-4 py-3 font-mono text-gray-900">{row.code}</td>
                      <td class="px-4 py-3 text-gray-900">{row.count}</td>
                      <td class="px-4 py-3 text-gray-900">{row.pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  )
}
