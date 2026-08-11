import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Alert from "@solidiom/alert"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"

const METRICS = [
  { label: "Total Searches", value: "12,847", trend: "+12.5%", period: "vs last month" },
  { label: "Average Results", value: "24.3", trend: "-2.1%", period: "vs last month" },
  { label: "Zero-Result Rate", value: "3.2%", trend: "-0.8%", period: "vs last month" },
  { label: "Avg. Click Rate", value: "18.7%", trend: "+4.3%", period: "vs last month" },
]

const TOP_QUERIES = [
  { query: "solidjs", count: 1240, percentage: 35 },
  { query: "reactive programming", count: 890, percentage: 25 },
  { query: "fine-grained reactivity", count: 620, percentage: 18 },
  { query: "signal vs memo", count: 480, percentage: 14 },
  { query: "other", count: 217, percentage: 8 },
]

export function SearchAnalytics(): JSX.Element {
  return (
    <div class="space-y-8">
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" class="text-sm text-gray-500 hover:text-gray-900">
              Search
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator class="text-gray-400">/</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/analytics" current class="text-sm font-medium text-gray-900">
              Analytics
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div>
        <h1 class="text-2xl font-bold text-gray-900">Search Analytics</h1>
        <p class="mt-1 text-sm text-gray-500">
          Monitor search performance, popular queries, and zero-result rates.
        </p>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Analytics Overview</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          Track key metrics to improve search relevance and user satisfaction.
        </Alert.Description>
      </Alert.Root>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric) => (
          <Card.Root class="rounded-lg border border-gray-200 bg-white">
            <Card.Content class="px-4 py-4">
              <p class="text-sm font-medium text-gray-500">{metric.label}</p>
              <p class="mt-1 text-2xl font-bold text-gray-900">{metric.value}</p>
              <p class="mt-1 text-xs text-green-600">
                {metric.trend} {metric.period}
              </p>
            </Card.Content>
          </Card.Root>
        ))}
      </div>

      <Card.Root class="rounded-lg border border-gray-200 bg-white">
        <Card.Header class="border-b border-gray-200 px-4 py-3">
          <Card.Title class="text-sm font-semibold text-gray-900">Top Queries</Card.Title>
        </Card.Header>
        <Card.Content class="px-4 py-4">
          <div class="space-y-3">
            {TOP_QUERIES.map((item) => (
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">{item.query}</span>
                  <span class="text-sm text-gray-500">{item.count} searches</span>
                </div>
                <div class="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    class="h-full rounded-full bg-indigo-600"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card.Root>

      <div class="flex justify-end gap-3">
        <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          Export CSV
        </Button.Root>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
          Refresh
        </Button.Root>
      </div>
    </div>
  )
}
