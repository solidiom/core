import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Alert from "@solidiom/alert"

interface AlertRule {
  id: string
  name: string
  metric: string
  condition: string
  threshold: string
  enabled: boolean
  channel: string
}

const ALERT_RULES: AlertRule[] = [
  {
    id: "rule-001",
    name: "High CPU Usage",
    metric: "cpu_percent",
    condition: "> 90%",
    threshold: "90",
    enabled: true,
    channel: "PagerDuty",
  },
  {
    id: "rule-002",
    name: "Memory Pressure",
    metric: "memory_used_percent",
    condition: "> 85%",
    threshold: "85",
    enabled: true,
    channel: "Slack",
  },
  {
    id: "rule-003",
    name: "Disk Space Critical",
    metric: "disk_free_percent",
    condition: "< 10%",
    threshold: "10",
    enabled: true,
    channel: "PagerDuty",
  },
  {
    id: "rule-004",
    name: "Error Rate Spike",
    metric: "http_5xx_rate",
    condition: "> 5%",
    threshold: "5",
    enabled: true,
    channel: "Email",
  },
  {
    id: "rule-005",
    name: "Latency Degradation",
    metric: "p99_latency_ms",
    condition: "> 500ms",
    threshold: "500",
    enabled: false,
    channel: "Slack",
  },
  {
    id: "rule-006",
    name: "Connection Pool Saturation",
    metric: "db_connections_used",
    condition: "> 80%",
    threshold: "80",
    enabled: true,
    channel: "PagerDuty",
  },
  {
    id: "rule-007",
    name: "Queue Backlog",
    metric: "queue_depth",
    condition: "> 10000",
    threshold: "10000",
    enabled: false,
    channel: "Email",
  },
  {
    id: "rule-008",
    name: "SSL Expiry Warning",
    metric: "cert_days_remaining",
    condition: "< 30",
    threshold: "30",
    enabled: true,
    channel: "Email",
  },
]

export function Alerts(): JSX.Element {
  const [rules, setRules] = createSignal<AlertRule[]>(ALERT_RULES)

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)),
    )
  }

  const enabledCount = () => rules().filter((r) => r.enabled).length

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
                <Breadcrumb.Link href="/alerts" current class="text-gray-900 font-medium">
                  Alerts
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Alert Configuration</h1>
          <p class="mt-1 text-sm text-gray-500">
            Threshold rules, notification channels, and alert management.
          </p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Add Rule
        </Button.Root>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Alert Summary</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          {enabledCount()} of {rules().length} rules are currently active. 3 alerts fired in the
          last 24 hours.
        </Alert.Description>
      </Alert.Root>

      <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Card.Header class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 class="text-sm font-semibold text-gray-900">Threshold Rules</h2>
          <div class="flex items-center gap-2">
            <div class="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
              <div
                class="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${(enabledCount() / rules().length) * 100}%` }}
              />
            </div>
            <span class="text-xs text-gray-500">
              {enabledCount()}/{rules().length} enabled
            </span>
          </div>
        </Card.Header>
        <Card.Content class="p-0">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Rule
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Metric
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Condition
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Channel
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Enabled
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              {rules().map((rule) => (
                <tr class="hover:bg-gray-50">
                  <td class="whitespace-nowrap px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{rule.name}</div>
                    <div class="text-xs text-gray-400">{rule.id}</div>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-500">
                    {rule.metric}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {rule.condition}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{rule.channel}</td>
                  <td class="whitespace-nowrap px-6 py-4 text-center">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      class={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        rule.enabled ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          rule.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card.Content>
      </Card.Root>
    </div>
  )
}
