import type { JSX } from "@solidjs/web"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Input from "@solidiom/input"
import * as Card from "@solidiom/card"
import * as Alert from "@solidiom/alert"
import * as DataTable from "@solidiom/data-table"
import { useParams } from "@solidjs/router"

type ResourceStatus = "running" | "stopped" | "pending" | "error"

interface ResourceProperty {
  key: string
  value: string
}

interface ActivityLog {
  id: string
  timestamp: string
  action: string
  user: string
  details: string
}

interface ConfigEntry {
  key: string
  value: string
  editable: boolean
}

const RESOURCE = {
  id: "res-001",
  name: "api-gateway",
  type: "Service",
  status: "running" as ResourceStatus,
  region: "us-east-1",
  created: "2024-01-15",
  tags: ["production", "critical"],
}

const PROPERTIES: ResourceProperty[] = [
  { key: "Resource ID", value: "res-001" },
  { key: "Name", value: "api-gateway" },
  { key: "Type", value: "Service" },
  { key: "Status", value: "running" },
  { key: "Region", value: "us-east-1" },
  { key: "Availability Zone", value: "us-east-1a" },
  { key: "VPC", value: "vpc-0a1b2c3d4e5f" },
  { key: "Subnet", value: "subnet-1a2b3c4d" },
  { key: "Security Groups", value: "sg-gateway-prod, sg-public-https" },
  { key: "Created", value: "2024-01-15T08:30:00Z" },
  { key: "Last Modified", value: "2024-06-20T14:22:00Z" },
  { key: "Owner", value: "platform-team" },
]

const ACTIVITY: ActivityLog[] = [
  {
    id: "act-001",
    timestamp: "2024-06-20 14:22:00",
    action: "Configuration Updated",
    user: "admin@sOLIDio.com",
    details: "Updated rate limiting rules for /v1/users endpoint",
  },
  {
    id: "act-002",
    timestamp: "2024-06-18 09:15:00",
    action: "Scaling Event",
    user: "auto-scaler",
    details: "Scaled from 2 to 4 instances due to traffic spike",
  },
  {
    id: "act-003",
    timestamp: "2024-06-15 22:00:00",
    action: "Health Check",
    user: "monitoring",
    details: "All health checks passing, latency within thresholds",
  },
  {
    id: "act-004",
    timestamp: "2024-06-10 16:45:00",
    action: "Certificate Rotation",
    user: "admin@sOLIDio.com",
    details: "SSL/TLS certificate renewed, expires 2025-06-10",
  },
  {
    id: "act-005",
    timestamp: "2024-06-01 11:30:00",
    action: "Deployment",
    user: "ci-cd-pipeline",
    details: "Deployed version 2.4.1 with hotfix for auth token parsing",
  },
  {
    id: "act-006",
    timestamp: "2024-05-28 08:00:00",
    action: "Configuration Updated",
    user: "admin@sOLIDio.com",
    details: "Enabled CORS for staging.domain.com origin",
  },
  {
    id: "act-007",
    timestamp: "2024-05-20 19:10:00",
    action: "Scaling Event",
    user: "auto-scaler",
    details: "Scaled back from 4 to 2 instances after traffic normalized",
  },
  {
    id: "act-008",
    timestamp: "2024-05-15 14:00:00",
    action: "Health Check",
    user: "monitoring",
    details: "Warning: elevated 5xx rate detected on /v1/orders endpoint",
  },
]

const CONFIG: ConfigEntry[] = [
  { key: "max_connections", value: "10000", editable: true },
  { key: "timeout_ms", value: "30000", editable: true },
  { key: "rate_limit_rps", value: "5000", editable: true },
  { key: "cors_origins", value: "*.production.com", editable: true },
  { key: "ssl_enabled", value: "true", editable: true },
  { key: "log_level", value: "info", editable: true },
  { key: "instance_type", value: "m5.xlarge", editable: false },
  { key: "vpc_id", value: "vpc-0a1b2c3d4e5f", editable: false },
  { key: "arn", value: "arn:aws:ecs:us-east-1:123456:cluster/api-gateway", editable: false },
]

const statusColor = (status: ResourceStatus): string => {
  switch (status) {
    case "running":
      return "bg-green-100 text-green-700"
    case "stopped":
      return "bg-gray-100 text-gray-600"
    case "pending":
      return "bg-yellow-100 text-yellow-700"
    case "error":
      return "bg-red-100 text-red-700"
  }
}

export function ResourceDetail(): JSX.Element {
  const params = useParams()
  const [activeTab, setActiveTab] = createSignal("properties")
  const [editing, setEditing] = createSignal(false)
  const [configValues, setConfigValues] = createSignal<Record<string, string>>(
    Object.fromEntries(CONFIG.map((c) => [c.key, c.value])),
  )
  const [saved, setSaved] = createSignal(false)

  const handleSave = () => {
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const updateConfigValue = (key: string, value: string) => {
    setConfigValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div class="space-y-6">
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
              <Breadcrumb.Link href="/" class="hover:text-gray-700">
                Resources
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link
                href={`/resource/${params.id}`}
                current
                class="text-gray-900 font-medium"
              >
                {RESOURCE.name}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-bold text-gray-900">{RESOURCE.name}</h1>
              <span
                class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(RESOURCE.status)}`}
              >
                {RESOURCE.status}
              </span>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              View properties, activity log, and configure {RESOURCE.name}.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <Button.Root class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Restart
            </Button.Root>
            <Button.Root class="rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
              Delete
            </Button.Root>
          </div>
        </div>
      </div>

      {saved() && (
        <Alert.Root type="success" class="rounded-lg border border-green-200 bg-green-50 p-4">
          <Alert.Title class="text-sm font-medium text-green-800">
            Configuration saved successfully.
          </Alert.Title>
        </Alert.Root>
      )}

      <div class="grid gap-6 sm:grid-cols-3">
        <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <dt class="text-xs font-medium uppercase tracking-wider text-gray-500">Type</dt>
          <dd class="mt-1 text-sm font-semibold text-gray-900">{RESOURCE.type}</dd>
        </Card.Root>
        <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <dt class="text-xs font-medium uppercase tracking-wider text-gray-500">Region</dt>
          <dd class="mt-1 text-sm font-semibold text-gray-900">{RESOURCE.region}</dd>
        </Card.Root>
        <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <dt class="text-xs font-medium uppercase tracking-wider text-gray-500">Created</dt>
          <dd class="mt-1 text-sm font-semibold text-gray-900">{RESOURCE.created}</dd>
        </Card.Root>
      </div>

      <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div class="border-b border-gray-200">
          <nav class="flex gap-6 px-6" aria-label="Tabs">
            {(["properties", "activity", "config"] as const).map((tab) => (
              <button
                onClick={() => setActiveTab(tab)}
                class={`border-b-2 py-3 text-sm font-medium transition-colors ${
                  activeTab() === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {activeTab() === "properties" && (
          <DataTable.Root>
            <table class="min-w-full divide-y divide-gray-200">
              <tbody class="divide-y divide-gray-200">
                {PROPERTIES.map((prop) => (
                  <tr class="hover:bg-gray-50">
                    <td class="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                      {prop.key}
                    </td>
                    <td class="whitespace-nowrap px-6 py-3 text-sm text-gray-500">{prop.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTable.Root>
        )}

        {activeTab() === "activity" && (
          <DataTable.Root>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Time
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    User
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                {ACTIVITY.map((entry) => (
                  <tr class="hover:bg-gray-50">
                    <td class="whitespace-nowrap px-6 py-3 text-sm text-gray-500">
                      {entry.timestamp}
                    </td>
                    <td class="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                      {entry.action}
                    </td>
                    <td class="whitespace-nowrap px-6 py-3 text-sm text-gray-500">{entry.user}</td>
                    <td class="px-6 py-3 text-sm text-gray-500">{entry.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTable.Root>
        )}

        {activeTab() === "config" && (
          <div>
            <div class="flex items-center justify-between border-b border-gray-200 px-6 py-3">
              <span class="text-sm font-medium text-gray-700">Configuration</span>
              {!editing() ? (
                <Button.Root
                  class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button.Root>
              ) : (
                <div class="flex items-center gap-2">
                  <Button.Root
                    class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setEditing(false)
                      setConfigValues(Object.fromEntries(CONFIG.map((c) => [c.key, c.value])))
                    }}
                  >
                    Cancel
                  </Button.Root>
                  <Button.Root
                    class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                    onClick={handleSave}
                  >
                    Save
                  </Button.Root>
                </div>
              )}
            </div>
            <table class="min-w-full divide-y divide-gray-200">
              <tbody class="divide-y divide-gray-200">
                {CONFIG.map((entry) => (
                  <tr class="hover:bg-gray-50">
                    <td class="whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                      {entry.key}
                    </td>
                    <td class="px-6 py-3 text-sm text-gray-500">
                      {editing() && entry.editable ? (
                        <Input.Root
                          type="text"
                          class="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          value={configValues()[entry.key]}
                          onInput={(e) => updateConfigValue(entry.key, e.currentTarget.value)}
                        />
                      ) : (
                        <span class="font-mono text-sm">{configValues()[entry.key]}</span>
                      )}
                    </td>
                    <td class="whitespace-nowrap px-6 py-3 text-right text-xs text-gray-400">
                      {entry.editable ? "editable" : "read-only"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card.Root>
    </div>
  )
}
