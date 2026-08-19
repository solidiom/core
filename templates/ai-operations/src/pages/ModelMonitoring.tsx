import type { JSX } from "@solidjs/web"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Alert from "@solidiom/alert"
import * as Tabs from "@solidiom/tabs"
import { MetricCard } from "../components/MetricCard"
import { ModelCard } from "../components/ModelCard"

const METRICS = [
  {
    title: "Avg Latency",
    value: "127ms",
    change: "-12ms from last hour",
    changeType: "positive" as const,
  },
  {
    title: "Throughput",
    value: "1,842 req/s",
    change: "+340 req/s from last hour",
    changeType: "positive" as const,
  },
  {
    title: "Error Rate",
    value: "0.8%",
    change: "+0.3% from last hour",
    changeType: "negative" as const,
  },
  {
    title: "Drift Score",
    value: "0.04",
    change: "Stable over 24h",
    changeType: "neutral" as const,
  },
]

const MODELS = [
  {
    name: "text-embedding-3-large",
    version: "1.2.0",
    status: "active" as const,
    latency: "45ms",
    throughput: "3.2k/s",
    accuracy: "96.8%",
  },
  {
    name: "gpt-4-turbo",
    version: "2024-04",
    status: "active" as const,
    latency: "230ms",
    throughput: "820/s",
    accuracy: "94.2%",
  },
  {
    name: "claude-3-sonnet",
    version: "1.0.0",
    status: "active" as const,
    latency: "180ms",
    throughput: "1.1k/s",
    accuracy: "95.5%",
  },
  {
    name: "llama-3-8b-fine",
    version: "0.9.3",
    status: "training" as const,
    latency: "—",
    throughput: "—",
    accuracy: "—",
  },
]

interface ModelComparison {
  model: string
  p50: string
  p95: string
  p99: string
  errors: string
  throughput: string
}

const COMPARISON: ModelComparison[] = [
  {
    model: "gpt-4-turbo",
    p50: "180ms",
    p95: "420ms",
    p99: "890ms",
    errors: "0.4%",
    throughput: "820/s",
  },
  {
    model: "claude-3-sonnet",
    p50: "145ms",
    p95: "310ms",
    p99: "620ms",
    errors: "0.3%",
    throughput: "1.1k/s",
  },
  {
    model: "text-embedding-3-large",
    p50: "32ms",
    p95: "78ms",
    p99: "150ms",
    errors: "0.1%",
    throughput: "3.2k/s",
  },
  {
    model: "llama-3-8b-fine",
    p50: "95ms",
    p95: "220ms",
    p99: "480ms",
    errors: "1.2%",
    throughput: "2.4k/s",
  },
]

export function ModelMonitoring(): JSX.Element {
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
                  Monitoring
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Model Monitoring</h1>
          <p class="mt-1 text-sm text-gray-500">
            Performance metrics, latency distribution, and drift detection for deployed models.
          </p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Refresh
        </Button.Root>
      </div>

      <Alert.Root type="warning" class="rounded-md border border-yellow-200 bg-yellow-50 p-4">
        <Alert.Title class="text-sm font-medium text-yellow-800">Elevated Error Rate</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-yellow-700">
          Error rate increased to 0.8% (threshold: 0.5%). llama-3-8b-fine is under training and may
          contribute to the spike.
        </Alert.Description>
      </Alert.Root>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric) => (
          <MetricCard {...metric} />
        ))}
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {MODELS.map((model) => (
          <ModelCard {...model} />
        ))}
      </div>

      <Tabs.Root defaultValue="latency">
        <Tabs.List class="flex border-b border-gray-200">
          <Tabs.Trigger
            value="latency"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Latency Comparison
          </Tabs.Trigger>
          <Tabs.Trigger
            value="quality"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Quality Metrics
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="latency" class="pt-6">
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Model
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    P50
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    P95
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    P99
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Errors
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Throughput
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {COMPARISON.map((row) => (
                  <tr class="hover:bg-gray-50">
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {row.model}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{row.p50}</td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{row.p95}</td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{row.p99}</td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{row.errors}</td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {row.throughput}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
        <Tabs.Content value="quality" class="pt-6">
          <div class="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Quality benchmark results will appear here after the next evaluation cycle.
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
