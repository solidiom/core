import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Tabs from "@solidiom/tabs"
import * as Alert from "@solidiom/alert"
import * as Button from "@solidiom/button"
import { EventRow, EventItem } from "../components/EventRow"

const EVENTS: EventItem[] = [
  {
    id: "e1",
    timestamp: "2025-08-10 09:42:11",
    actor: "alice@example.com",
    action: "LOGIN",
    resource: "Web Console",
    severity: "success",
  },
  {
    id: "e2",
    timestamp: "2025-08-10 09:38:05",
    actor: "bob@example.com",
    action: "CREATE_USER",
    resource: "users/new",
    severity: "info",
  },
  {
    id: "e3",
    timestamp: "2025-08-10 09:30:22",
    actor: "system",
    action: "FAILED_LOGIN",
    resource: "API Gateway",
    severity: "warning",
  },
  {
    id: "e4",
    timestamp: "2025-08-10 09:15:47",
    actor: "carol@example.com",
    action: "UPDATE_ROLE",
    resource: "roles/admin",
    severity: "info",
  },
  {
    id: "e5",
    timestamp: "2025-08-10 08:55:33",
    actor: "eve@example.com",
    action: "DELETE_RECORD",
    resource: "logs/archive-2024",
    severity: "error",
  },
  {
    id: "e6",
    timestamp: "2025-08-10 08:42:19",
    actor: "frank@example.com",
    action: "EXPORT_DATA",
    resource: "reports/q2-2025",
    severity: "info",
  },
  {
    id: "e7",
    timestamp: "2025-08-10 08:30:01",
    actor: "system",
    action: "AUTO_SCALE",
    resource: "cluster/us-east-1",
    severity: "success",
  },
  {
    id: "e8",
    timestamp: "2025-08-10 08:15:44",
    actor: "henry@example.com",
    action: "MODIFY_PERMISSION",
    resource: "policies/data-access",
    severity: "warning",
  },
  {
    id: "e9",
    timestamp: "2025-08-10 07:58:12",
    actor: "iris@example.com",
    action: "CREATE_TEAM",
    resource: "teams/analytics",
    severity: "info",
  },
  {
    id: "e10",
    timestamp: "2025-08-10 07:45:08",
    actor: "jack@example.com",
    action: "ROTATE_KEY",
    resource: "secrets/api-keys",
    severity: "success",
  },
]

export function EventStream(): JSX.Element {
  const [search, setSearch] = createSignal("")

  const filtered = () =>
    EVENTS.filter(
      (e) =>
        e.actor.toLowerCase().includes(search().toLowerCase()) ||
        e.action.toLowerCase().includes(search().toLowerCase()) ||
        e.resource.toLowerCase().includes(search().toLowerCase()),
    )

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
                  Event Stream
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Event Stream</h1>
          <p class="mt-1 text-sm text-gray-500">
            Real-time stream of audit events with actor, action, and resource details.
          </p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Refresh
        </Button.Root>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Live Feed</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          Showing {filtered().length} of {EVENTS.length} recent events. Stream auto-refreshes every
          30 seconds.
        </Alert.Description>
      </Alert.Root>

      <div class="mb-4">
        <input
          type="text"
          class="block w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Search events..."
          value={search()}
          onInput={(e: any) => setSearch(e.currentTarget.value)}
        />
      </div>

      <Tabs.Root defaultValue="stream">
        <Tabs.List class="flex border-b border-gray-200">
          <Tabs.Trigger
            value="stream"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Stream
          </Tabs.Trigger>
          <Tabs.Trigger
            value="stats"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Statistics
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="stream" class="pt-6">
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Time
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actor
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Resource
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Severity
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {filtered().map((event) => (
                  <EventRow event={event} />
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
        <Tabs.Content value="stats" class="pt-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p class="text-sm font-medium text-gray-500">Info Events</p>
              <p class="mt-1 text-2xl font-bold text-blue-600">
                {EVENTS.filter((e) => e.severity === "info").length}
              </p>
            </div>
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p class="text-sm font-medium text-gray-500">Warnings</p>
              <p class="mt-1 text-2xl font-bold text-yellow-600">
                {EVENTS.filter((e) => e.severity === "warning").length}
              </p>
            </div>
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p class="text-sm font-medium text-gray-500">Errors</p>
              <p class="mt-1 text-2xl font-bold text-red-600">
                {EVENTS.filter((e) => e.severity === "error").length}
              </p>
            </div>
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p class="text-sm font-medium text-gray-500">Success</p>
              <p class="mt-1 text-2xl font-bold text-green-600">
                {EVENTS.filter((e) => e.severity === "success").length}
              </p>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
