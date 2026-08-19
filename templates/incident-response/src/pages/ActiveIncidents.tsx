import type { JSX } from "@solidjs/web"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Alert from "@solidiom/alert"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Avatar from "@solidiom/avatar"
import { IncidentCard } from "../components/IncidentCard"

const SEVERITY_METRICS = [
  { label: "Critical", count: 2, color: "bg-red-50 border-red-200" },
  { label: "High", count: 5, color: "bg-orange-50 border-orange-200" },
  { label: "Medium", count: 12, color: "bg-yellow-50 border-yellow-200" },
]

const RECENT_TIMELINE = [
  { time: "1 min ago", event: "INC-3042: Database failover initiated by Alice Chen" },
  { time: "8 min ago", event: "INC-3042: Standby replica promoted to primary" },
  { time: "15 min ago", event: "INC-3041: Payment retry queue depth at 14k messages" },
  { time: "22 min ago", event: "INC-3041: Upstream provider acknowledged degradation" },
  { time: "45 min ago", event: "INC-3040: API gateway config rolled back to v4.8.2" },
  { time: "1 hour ago", event: "INC-3039: CDN cache purge submitted for us-east-1" },
]

const ACTIVE_RESPONDERS = [
  { name: "Alice Chen", role: "Incident Commander", incidents: 2, status: "online" },
  { name: "Bob Martinez", role: "Lead Engineer", incidents: 2, status: "online" },
  { name: "Carol Wu", role: "SRE", incidents: 2, status: "online" },
  { name: "Dave Kim", role: "Payments Engineer", incidents: 1, status: "online" },
  { name: "Eve Johnson", role: "SRE", incidents: 2, status: "away" },
  { name: "Frank Liu", role: "Network Engineer", incidents: 2, status: "online" },
  { name: "Grace Park", role: "CDN Specialist", incidents: 1, status: "online" },
]

const INCIDENTS = [
  {
    id: "INC-3042",
    severity: "critical" as const,
    title: "Production database failover triggered",
    responders: ["Alice Chen", "Bob Martinez", "Carol Wu"],
    started: "12 min ago",
    updates: 8,
  },
  {
    id: "INC-3041",
    severity: "critical" as const,
    title: "Payment processing latency exceeding SLA",
    responders: ["Dave Kim", "Eve Johnson"],
    started: "34 min ago",
    updates: 12,
  },
  {
    id: "INC-3040",
    severity: "high" as const,
    title: "API gateway returning 502 errors",
    responders: ["Alice Chen"],
    started: "1 hour ago",
    updates: 5,
  },
  {
    id: "INC-3039",
    severity: "high" as const,
    title: "CDN cache invalidation stalled",
    responders: ["Frank Liu", "Grace Park"],
    started: "1 hour ago",
    updates: 3,
  },
  {
    id: "INC-3038",
    severity: "high" as const,
    title: "Auth token refresh loop detected",
    responders: ["Bob Martinez", "Carol Wu"],
    started: "2 hours ago",
    updates: 7,
  },
  {
    id: "INC-3037",
    severity: "high" as const,
    title: "Worker pool scaling failure",
    responders: ["Eve Johnson"],
    started: "3 hours ago",
    updates: 4,
  },
  {
    id: "INC-3036",
    severity: "high" as const,
    title: "SSL certificate near expiry for api.example.com",
    responders: ["Frank Liu"],
    started: "4 hours ago",
    updates: 2,
  },
]

export function ActiveIncidents(): JSX.Element {
  return (
    <div class="space-y-6">
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
                  Active Incidents
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Active Incidents</h1>
          <p class="mt-1 text-sm text-gray-500">
            Track active incidents with severity, responders, and timeline updates.
          </p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Create Incident
        </Button.Root>
      </div>

      <Alert.Root type="error" class="rounded-md border border-red-200 bg-red-50 p-4">
        <Alert.Title class="text-sm font-medium text-red-800">
          2 Critical Incidents Active
        </Alert.Title>
        <Alert.Description class="mt-1 text-sm text-red-700">
          Immediate attention required. War room has been activated for INC-3042.
        </Alert.Description>
      </Alert.Root>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SEVERITY_METRICS.map((metric) => (
          <Card.Root class={`rounded-lg border p-4 shadow-sm ${metric.color}`}>
            <Card.Header class="pb-1">
              <Card.Title class="text-sm font-medium text-gray-500">{metric.label}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div class="text-3xl font-bold text-gray-900">{metric.count}</div>
            </Card.Content>
          </Card.Root>
        ))}
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {INCIDENTS.map((incident) => (
          <IncidentCard {...incident} />
        ))}
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card.Root class="rounded-lg border p-5 shadow-sm">
          <Card.Header class="pb-3">
            <Card.Title class="text-base font-semibold text-gray-900">Recent Timeline</Card.Title>
            <Card.Description class="mt-1 text-sm text-gray-500">
              Latest updates across all active incidents.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div class="space-y-3">
              {RECENT_TIMELINE.map((entry) => (
                <div class="flex items-start gap-3">
                  <div class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                  <div>
                    <p class="text-sm text-gray-700">{entry.event}</p>
                    <p class="text-xs text-gray-400">{entry.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root class="rounded-lg border p-5 shadow-sm">
          <Card.Header class="pb-3">
            <Card.Title class="text-base font-semibold text-gray-900">Active Responders</Card.Title>
            <Card.Description class="mt-1 text-sm text-gray-500">
              {ACTIVE_RESPONDERS.length} engineers currently assigned.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div class="space-y-3">
              {ACTIVE_RESPONDERS.map((responder) => (
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Avatar.Root class="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                      <Avatar.Fallback class="flex h-full w-full items-center justify-center text-xs font-medium text-gray-600">
                        {responder.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{responder.name}</p>
                      <p class="text-xs text-gray-500">{responder.role}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {responder.incidents} incident{responder.incidents > 1 ? "s" : ""}
                    </span>
                    <span
                      class={`h-2 w-2 rounded-full ${responder.status === "online" ? "bg-green-400" : "bg-yellow-400"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  )
}
