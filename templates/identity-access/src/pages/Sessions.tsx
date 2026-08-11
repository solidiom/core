import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Tabs from "@solidiom/tabs"
import * as Alert from "@solidiom/alert"
import * as Button from "@solidiom/button"
import { StatusBadge } from "../components/StatusBadge"

type SessionStatus = "active" | "expired" | "revoked"

interface Session {
  id: string
  user: string
  device: string
  browser: string
  os: string
  ip: string
  location: string
  lastActive: string
  status: SessionStatus
}

const SESSIONS: Session[] = [
  {
    id: "s1",
    user: "Alice Chen",
    device: 'MacBook Pro 16"',
    browser: "Chrome 128",
    os: "macOS 15",
    ip: "192.168.1.42",
    location: "San Francisco, CA",
    lastActive: "Just now",
    status: "active",
  },
  {
    id: "s2",
    user: "Bob Martinez",
    device: "Dell XPS 15",
    browser: "Firefox 129",
    os: "Windows 11",
    ip: "10.0.0.15",
    location: "New York, NY",
    lastActive: "2 min ago",
    status: "active",
  },
  {
    id: "s3",
    user: "Carol Wu",
    device: "iPhone 15 Pro",
    browser: "Safari 17",
    os: "iOS 17.6",
    ip: "172.16.0.8",
    location: "Austin, TX",
    lastActive: "15 min ago",
    status: "active",
  },
  {
    id: "s4",
    user: "Dave Kim",
    device: "iPad Air",
    browser: "Safari 17",
    os: "iPadOS 17.6",
    ip: "192.168.2.30",
    location: "Seattle, WA",
    lastActive: "1 hour ago",
    status: "active",
  },
  {
    id: "s5",
    user: "Eva Singh",
    device: "ThinkPad X1",
    browser: "Chrome 128",
    os: "Linux (Ubuntu)",
    ip: "10.1.0.22",
    location: "Chicago, IL",
    lastActive: "3 hours ago",
    status: "expired",
  },
  {
    id: "s6",
    user: "Frank Lee",
    device: "Surface Pro 9",
    browser: "Edge 128",
    os: "Windows 11",
    ip: "172.20.0.5",
    location: "Boston, MA",
    lastActive: "5 hours ago",
    status: "expired",
  },
  {
    id: "s7",
    user: "Grace Park",
    device: "Galaxy S24",
    browser: "Chrome 128",
    os: "Android 14",
    ip: "10.5.0.18",
    location: "Portland, OR",
    lastActive: "1 day ago",
    status: "revoked",
  },
  {
    id: "s8",
    user: "Henry Zhao",
    device: "MacBook Air M3",
    browser: "Arc 128",
    os: "macOS 15",
    ip: "192.168.3.10",
    location: "Denver, CO",
    lastActive: "2 days ago",
    status: "revoked",
  },
]

export function Sessions(): JSX.Element {
  const [sessions, setSessions] = createSignal<Session[]>(SESSIONS)

  const revokeSession = (id: string) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "revoked" as const } : s)))
  }

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
                <Breadcrumb.Link href="/sessions" current class="text-gray-900 font-medium">
                  Sessions
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Active Sessions</h1>
          <p class="mt-1 text-sm text-gray-500">
            Monitor active sessions, revoke tokens, and review login history.
          </p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          Revoke All
        </Button.Root>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Session Overview</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          {sessions().filter((s) => s.status === "active").length} active sessions,{" "}
          {sessions().filter((s) => s.status === "expired").length} expired,{" "}
          {sessions().filter((s) => s.status === "revoked").length} revoked.
        </Alert.Description>
      </Alert.Root>

      <Tabs.Root defaultValue="active">
        <Tabs.List class="flex border-b border-gray-200">
          <Tabs.Trigger
            value="active"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            Active ({sessions().filter((s) => s.status === "active").length})
          </Tabs.Trigger>
          <Tabs.Trigger
            value="all"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            All ({sessions().length})
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="active" class="pt-6">
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    User
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Device
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    IP Address
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Location
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {sessions()
                  .filter((s) => s.status === "active")
                  .map((session) => (
                    <tr class="hover:bg-gray-50">
                      <td class="whitespace-nowrap px-6 py-4">
                        <div class="flex items-center gap-3">
                          <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700">
                            {session.user.charAt(0)}
                          </span>
                          <div>
                            <p class="text-sm font-medium text-gray-900">{session.user}</p>
                            <p class="text-xs text-gray-500">
                              {session.browser} · {session.os}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {session.device}
                      </td>
                      <td class="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-500">
                        {session.ip}
                      </td>
                      <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {session.location}
                      </td>
                      <td class="whitespace-nowrap px-6 py-4">
                        <StatusBadge status={session.status} />
                      </td>
                      <td class="whitespace-nowrap px-6 py-4 text-right">
                        <span class="text-sm text-gray-400">{session.lastActive}</span>
                        <Button.Root
                          class="ml-3 inline-flex items-center rounded-md text-xs text-red-600 hover:text-red-800"
                          onClick={() => revokeSession(session.id)}
                        >
                          Revoke
                        </Button.Root>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
        <Tabs.Content value="all" class="pt-6">
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    User
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Device
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    IP Address
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {sessions().map((session) => (
                  <tr class="hover:bg-gray-50">
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {session.user}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {session.device}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-500">
                      {session.ip}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={session.status} />
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-400">
                      {session.lastActive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
