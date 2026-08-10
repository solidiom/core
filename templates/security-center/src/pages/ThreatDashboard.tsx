import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Alert from "@solidiom/alert"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import { ThreatCard } from "../components/ThreatCard"

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

function MetricCard(props: { label: string; value: string; change: string; changeType: "positive" | "negative" | "neutral" }): JSX.Element {
  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <Card.Header class="pb-1">
        <Card.Title class="text-sm font-medium text-gray-500">{props.label}</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold text-gray-900">{props.value}</div>
        <p
          class={`mt-1 text-xs font-medium ${
            props.changeType === "positive"
              ? "text-green-600"
              : props.changeType === "negative"
                ? "text-red-600"
                : "text-gray-500"
          }`}
        >
          {props.change}
        </p>
      </Card.Content>
    </Card.Root>
  )
}

export function ThreatDashboard(): JSX.Element {
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
        <h2 class="mb-4 text-lg font-semibold text-gray-900">Recent Threats</h2>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {THREATS.map((threat) => (
            <ThreatCard {...threat} />
          ))}
        </div>
      </div>
    </div>
  )
}
