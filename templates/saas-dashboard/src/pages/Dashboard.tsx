import type { JSX } from "@solidjs/web"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Tabs from "@solidiom/tabs"
import * as Alert from "@solidiom/alert"
import * as Button from "@solidiom/button"
import { MetricCard } from "../components/MetricCard"
import { ActivityTable } from "../components/ActivityTable"

const METRICS = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    changeType: "positive" as const,
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180 since last week",
    changeType: "positive" as const,
  },
  {
    title: "Deployments",
    value: "142",
    change: "+12% from last month",
    changeType: "positive" as const,
  },
  {
    title: "Error Rate",
    value: "0.12%",
    change: "-0.03% from last week",
    changeType: "negative" as const,
  },
]

export function Dashboard(): JSX.Element {
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
                  Dashboard
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="mt-1 text-sm text-gray-500">
            Overview of your platform metrics and recent activity.
          </p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Create Resource
        </Button.Root>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">System Notice</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          Scheduled maintenance window: Saturday 2:00 AM – 4:00 AM UTC. Services may experience
          brief interruptions.
        </Alert.Description>
      </Alert.Root>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric) => (
          <MetricCard {...metric} />
        ))}
      </div>

      <Tabs.Root defaultValue="activity">
        <Tabs.List class="flex border-b border-gray-200">
          <Tabs.Trigger
            value="activity"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Activity
          </Tabs.Trigger>
          <Tabs.Trigger
            value="events"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Events
          </Tabs.Trigger>
          <Tabs.Trigger
            value="alerts"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Alerts
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="activity" class="pt-6">
          <ActivityTable />
        </Tabs.Content>
        <Tabs.Content value="events" class="pt-6">
          <div class="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            No recent events to display.
          </div>
        </Tabs.Content>
        <Tabs.Content value="alerts" class="pt-6">
          <div class="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            All systems operational. No active alerts.
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
