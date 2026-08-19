import type { JSX } from "@solidjs/web"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Tabs from "@solidiom/tabs"
import * as Alert from "@solidiom/alert"
import * as Input from "@solidiom/input"
import { ActivityTable, ActivityRecord } from "../components/ActivityTable"

const ACTIVITY: ActivityRecord[] = [
  {
    id: "a1",
    user: "Alice Chen",
    action: "created team",
    resource: "Engineering",
    timestamp: "2 min ago",
  },
  {
    id: "a2",
    user: "Bob Martinez",
    action: "updated role",
    resource: "Admin permissions",
    timestamp: "15 min ago",
  },
  {
    id: "a3",
    user: "Carol Wu",
    action: "invited member",
    resource: "dave@example.com",
    timestamp: "1 hour ago",
  },
  {
    id: "a4",
    user: "Eva Singh",
    action: "deleted user",
    resource: "former-employee@example.com",
    timestamp: "2 hours ago",
  },
  {
    id: "a5",
    user: "Frank Lee",
    action: "modified settings",
    resource: "Organization defaults",
    timestamp: "3 hours ago",
  },
  {
    id: "a6",
    user: "Henry Zhao",
    action: "created team",
    resource: "Design",
    timestamp: "5 hours ago",
  },
  {
    id: "a7",
    user: "Jack Wilson",
    action: "suspended member",
    resource: "karen@example.com",
    timestamp: "6 hours ago",
  },
  {
    id: "a8",
    user: "Alice Chen",
    action: "logged in",
    resource: "IP 192.168.1.42",
    timestamp: "8 hours ago",
  },
  {
    id: "a9",
    user: "Mia Garcia",
    action: "accepted invite",
    resource: "Operations team",
    timestamp: "12 hours ago",
  },
  {
    id: "a10",
    user: "System",
    action: "auto-provisioned",
    resource: "SSO sync completed",
    timestamp: "1 day ago",
  },
]

export function AuditLog(): JSX.Element {
  const [search, setSearch] = createSignal("")

  const filtered = () =>
    ACTIVITY.filter(
      (a) =>
        a.user.toLowerCase().includes(search().toLowerCase()) ||
        a.action.toLowerCase().includes(search().toLowerCase()) ||
        a.resource.toLowerCase().includes(search().toLowerCase()),
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
                <Breadcrumb.Link href="/audit" current class="text-gray-900 font-medium">
                  Audit Log
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p class="mt-1 text-sm text-gray-500">
            Searchable timeline of all administrative actions and system events.
          </p>
        </div>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Audit Trail</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          Showing {filtered().length} of {ACTIVITY.length} events. All events are retained for 90
          days.
        </Alert.Description>
      </Alert.Root>

      <div class="mb-4">
        <Input.Root
          type="text"
          class="block w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Search by user, action, or resource..."
          value={search()}
          onInput={(e: any) => setSearch(e.currentTarget.value)}
        />
      </div>

      <Tabs.Root defaultValue="timeline">
        <Tabs.List class="flex border-b border-gray-200">
          <Tabs.Trigger
            value="timeline"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Timeline
          </Tabs.Trigger>
          <Tabs.Trigger
            value="summary"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Summary
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="timeline" class="pt-6">
          <ActivityTable data={filtered()} />
        </Tabs.Content>
        <Tabs.Content value="summary" class="pt-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p class="text-sm font-medium text-gray-500">Total Events (24h)</p>
              <p class="mt-1 text-2xl font-bold text-gray-900">47</p>
            </div>
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p class="text-sm font-medium text-gray-500">Unique Actors</p>
              <p class="mt-1 text-2xl font-bold text-gray-900">8</p>
            </div>
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p class="text-sm font-medium text-gray-500">Suspicious Actions</p>
              <p class="mt-1 text-2xl font-bold text-red-600">0</p>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
