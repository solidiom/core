import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Alert from "@solidiom/alert"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Progress from "@solidiom/progress"
import { ThreatCard } from "../components/ThreatCard"
import { MetricCard } from "../components/MetricCard"
import { StatusBadge } from "../components/StatusBadge"

const METRIC_DATA = [
  { label: "Active Threats", value: "7", change: "+2 from last hour", changeType: "negative" as const },
  { label: "Blocked Attacks", value: "1,847", change: "+234 from last hour", changeType: "positive" as const },
  { label: "Open CVEs", value: "23", change: "-3 from last week", changeType: "positive" as const },
  { label: "Compliance Score", value: "94.2%", change: "+1.1% from last month", changeType: "positive" as const },
]

const THREATS = [
  { id: "THR-4001", type: "intrusion" as const, severity: "critical" as const, title: "Unauthorized access attempt from 10.0.0.0/8", affectedAssets: 3, detected: "5 min ago", status: "active" as const },
  { id: "THR-4000", type: "ddos" as const, severity: "high" as const, title: "Volumetric DDoS targeting API endpoints", affectedAssets: 12, detected: "22 min ago", status: "active" as const },
  { id: "THR-3999", type: "malware" as const, severity: "critical" as const, title: "Ransomware signature detected in file uploads", affectedAssets: 5, detected: "1 hour ago", status: "mitigated" as const },
  { id: "THR-3998", type: "phishing" as const, severity: "medium" as const, title: "Phishing campaign targeting employee email accounts", affectedAssets: 45, detected: "2 hours ago", status: "active" as const },
  { id: "THR-3997", type: "vulnerability" as const, severity: "high" as const, title: "Zero-day exploit in web application framework", affectedAssets: 8, detected: "3 hours ago", status: "active" as const },
  { id: "THR-3996", type: "intrusion" as const, severity: "low" as const, title: "Port scan detected from external IP range", affectedAssets: 1, detected: "4 hours ago", status: "closed" as const },
]

const SEVERITY_BREAKDOWN = [
  { level: "Critical", count: 3, pct: 25, color: "bg-red-500" },
  { level: "High", count: 5, pct: 42, color: "bg-orange-500" },
  { level: "Medium", count: 3, pct: 25, color: "bg-yellow-500" },
  { level: "Low", count: 1, pct: 8, color: "bg-green-500" },
]

const ACTIVE_ALERTS = [
  { id: "ALT-1024", title: "Critical intrusion detected on production DB", severity: "critical" as const, time: "2 min ago", status: "active" as const },
  { id: "ALT-1023", title: "DDoS mitigation engaged for EU region", severity: "high" as const, time: "18 min ago", status: "active" as const },
  { id: "ALT-1022", title: "Malware quarantine complete — 5 files isolated", severity: "critical" as const, time: "1 hour ago", status: "mitigated" as const },
  { id: "ALT-1021", title: "Suspicious login pattern for admin accounts", severity: "medium" as const, time: "3 hours ago", status: "active" as const },
]

export function ThreatDashboard(): JSX.Element {
  const [statusFilter, setStatusFilter] = createSignal<"all" | "active" | "mitigated" | "closed">("all")

  const filteredThreats = () =>
    statusFilter() === "all"
      ? THREATS
      : THREATS.filter((t) => t.status === statusFilter())

  return (
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <Breadcrumb.Root class="mb-2">
            <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/" class="hover:text-gray-700">Home</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/" current class="text-gray-900 font-medium">Threats</Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Threat Dashboard</h1>
          <p class="mt-1 text-sm text-gray-500">Real-time threat overview with severity distribution and active alerts.</p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Run Scan
        </Button.Root>
      </div>

      <Alert.Root type="error" class="rounded-md border border-red-200 bg-red-50 p-4">
        <Alert.Title class="text-sm font-medium text-red-800">Active Threat Alert</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-red-700">
          2 critical threats require immediate attention. Security team has been notified.
        </Alert.Description>
      </Alert.Root>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRIC_DATA.map((metric) => (
          <MetricCard {...metric} />
        ))}
      </div>

      <div>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Recent Threats</h2>
          <div class="flex gap-2">
            {(["all", "active", "mitigated", "closed"] as const).map((s) => (
              <button
                class={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  statusFilter() === s
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredThreats().map((threat) => (
            <ThreatCard {...threat} />
          ))}
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <Card.Header class="pb-4">
            <Card.Title class="text-base font-semibold text-gray-900">Severity Breakdown</Card.Title>
          </Card.Header>
          <Card.Content>
            <div class="space-y-4">
              {SEVERITY_BREAKDOWN.map((row) => (
                <div>
                  <div class="mb-1 flex items-center justify-between text-sm">
                    <span class="font-medium text-gray-700">{row.level}</span>
                    <span class="text-gray-500">{row.count} ({row.pct}%)</span>
                  </div>
                   <Progress.Root class="h-2 w-full rounded-full bg-gray-100" value={row.pct} aria-label={`${row.level} severity`}>
                     <Progress.Indicator
                       class={`h-2 rounded-full ${row.color}`}
                       style={{ width: `${row.pct}%` }}
                     />
                   </Progress.Root>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <Card.Header class="pb-4">
            <Card.Title class="text-base font-semibold text-gray-900">Active Alerts</Card.Title>
          </Card.Header>
          <Card.Content>
            <div class="space-y-3">
              {ACTIVE_ALERTS.map((alert) => (
                <div class="flex items-start justify-between gap-3 rounded-md border border-gray-100 p-3">
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p class="mt-0.5 text-xs text-gray-400">{alert.id} &middot; {alert.time}</p>
                  </div>
                  <StatusBadge status={alert.status} />
                </div>
              ))}
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  )
}
