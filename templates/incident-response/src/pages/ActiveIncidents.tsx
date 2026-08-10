import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Alert from "@solidiom/alert"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import { IncidentCard } from "../components/IncidentCard"

const SEVERITY_METRICS = [
  { label: "Critical", count: 2, color: "bg-red-50 border-red-200" },
  { label: "High", count: 5, color: "bg-orange-50 border-orange-200" },
  { label: "Medium", count: 12, color: "bg-yellow-50 border-yellow-200" },
]

const INCIDENTS = [
  { id: "INC-3042", severity: "critical" as const, title: "Production database failover triggered", responders: ["Alice Chen", "Bob Martinez", "Carol Wu"], started: "12 min ago", updates: 8 },
  { id: "INC-3041", severity: "critical" as const, title: "Payment processing latency exceeding SLA", responders: ["Dave Kim", "Eve Johnson"], started: "34 min ago", updates: 12 },
  { id: "INC-3040", severity: "high" as const, title: "API gateway returning 502 errors", responders: ["Alice Chen"], started: "1 hour ago", updates: 5 },
  { id: "INC-3039", severity: "high" as const, title: "CDN cache invalidation stalled", responders: ["Frank Liu", "Grace Park"], started: "1 hour ago", updates: 3 },
  { id: "INC-3038", severity: "high" as const, title: "Auth token refresh loop detected", responders: ["Bob Martinez", "Carol Wu"], started: "2 hours ago", updates: 7 },
  { id: "INC-3037", severity: "high" as const, title: "Worker pool scaling failure", responders: ["Eve Johnson"], started: "3 hours ago", updates: 4 },
  { id: "INC-3036", severity: "high" as const, title: "SSL certificate near expiry for api.example.com", responders: ["Frank Liu"], started: "4 hours ago", updates: 2 },
]

export function ActiveIncidents(): JSX.Element {
  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <Breadcrumb.Root class="mb-2">
            <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/" class="hover:text-gray-700">Home</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/" current class="text-gray-900 font-medium">Active Incidents</Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Active Incidents</h1>
          <p class="mt-1 text-sm text-gray-500">Track active incidents with severity, responders, and timeline updates.</p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Create Incident
        </Button.Root>
      </div>

      <Alert.Root type="error" class="rounded-md border border-red-200 bg-red-50 p-4">
        <Alert.Title class="text-sm font-medium text-red-800">2 Critical Incidents Active</Alert.Title>
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
    </div>
  )
}
