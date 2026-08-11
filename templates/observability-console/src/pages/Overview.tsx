import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Tabs from "@solidiom/tabs"
import * as Alert from "@solidiom/alert"
import * as Button from "@solidiom/button"
import { MetricCard } from "../components/MetricCard"
import { StatusBadge } from "../components/StatusBadge"

const METRICS = [
  {
    title: "Uptime",
    value: "99.97%",
    change: "+0.02% from last week",
    changeType: "positive" as const,
  },
  {
    title: "Error Rate",
    value: "0.12%",
    change: "-0.03% from last week",
    changeType: "positive" as const,
  },
  {
    title: "Avg Latency",
    value: "42ms",
    change: "-5ms from last week",
    changeType: "positive" as const,
  },
  {
    title: "Active Alerts",
    value: "3",
    change: "+1 from last hour",
    changeType: "negative" as const,
  },
]

interface ServiceStatus {
  name: string
  status: "running" | "stopped" | "degraded"
  latency: string
  region: string
}

const SERVICES: ServiceStatus[] = [
  { name: "api-gateway", status: "running", latency: "23ms", region: "us-east-1" },
  { name: "auth-service", status: "running", latency: "18ms", region: "us-east-1" },
  { name: "payment-processor", status: "degraded", latency: "340ms", region: "us-west-2" },
  { name: "notification-service", status: "running", latency: "12ms", region: "eu-west-1" },
  { name: "data-pipeline", status: "running", latency: "56ms", region: "us-east-1" },
  { name: "cdn-edge", status: "running", latency: "4ms", region: "global" },
  { name: "search-indexer", status: "stopped", latency: "—", region: "us-east-1" },
]

export function Overview(): JSX.Element {
  return (
    <div class="space-y-8">
      <div class="flex items-center justify-between">
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
                <Breadcrumb.Link href="/" current class="text-gray-900 font-medium">
                  Overview
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Overview</h1>
          <p class="mt-1 text-sm text-gray-500">
            System health, performance metrics, and service status at a glance.
          </p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Refresh Metrics
        </Button.Root>
      </div>

      <Alert.Root type="warning" class="rounded-md border border-yellow-200 bg-yellow-50 p-4">
        <Alert.Title class="text-sm font-medium text-yellow-800">
          Degraded Service Detected
        </Alert.Title>
        <Alert.Description class="mt-1 text-sm text-yellow-700">
          payment-processor is experiencing elevated latency (340ms). Investigation in progress.
        </Alert.Description>
      </Alert.Root>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric) => (
          <MetricCard {...metric} />
        ))}
      </div>

      <Tabs.Root defaultValue="services">
        <Tabs.List class="flex border-b border-gray-200">
          <Tabs.Trigger
            value="services"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Services
          </Tabs.Trigger>
          <Tabs.Trigger
            value="activity"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Recent Activity
          </Tabs.Trigger>
          <Tabs.Trigger
            value="incidents"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Incidents
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="services" class="pt-6">
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Service
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Latency
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Region
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {SERVICES.map((service) => (
                  <tr class="hover:bg-gray-50">
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {service.name}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={service.status} />
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {service.latency}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {service.region}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
        <Tabs.Content value="activity" class="pt-6">
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div class="border-b border-gray-200 px-6 py-4">
              <h3 class="text-sm font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    User
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Target
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr class="hover:bg-gray-50">
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    Alice Chen
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">deployed</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    api-gateway v2.4.1
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-400">
                    2 min ago
                  </td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    Bob Martinez
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">scaled</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    worker-pool to 8 replicas
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-400">
                    15 min ago
                  </td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    Carol Wu
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">updated</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    auth-service config
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-400">
                    1 hour ago
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Tabs.Content>
        <Tabs.Content value="incidents" class="pt-6">
          <div class="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            No active incidents. All systems operational.
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
