import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as Switch from "@solidiom/switch"

interface Policy {
  id: string
  name: string
  description: string
  scope: string
  enforced: boolean
  lastUpdated: string
}

const POLICIES: Policy[] = [
  { id: "POL-001", name: "Password Complexity", description: "Require minimum 12 characters with mixed case, numbers, and special characters", scope: "All Users", enforced: true, lastUpdated: "2024-03-10" },
  { id: "POL-002", name: "MFA Enforcement", description: "Require multi-factor authentication for all administrative accounts", scope: "Admin Users", enforced: true, lastUpdated: "2024-03-08" },
  { id: "POL-003", name: "Session Timeout", description: "Automatically terminate inactive sessions after 30 minutes", scope: "All Users", enforced: true, lastUpdated: "2024-03-05" },
  { id: "POL-004", name: "Data Encryption at Rest", description: "All stored data must be encrypted using AES-256", scope: "All Systems", enforced: true, lastUpdated: "2024-02-28" },
  { id: "POL-005", name: "Network Segmentation", description: "Production and development environments must be on separate network segments", scope: "Infrastructure", enforced: true, lastUpdated: "2024-02-25" },
  { id: "POL-006", name: "API Rate Limiting", description: "Limit API requests to 1000 per minute per client", scope: "API Services", enforced: false, lastUpdated: "2024-02-20" },
  { id: "POL-007", name: "Audit Log Retention", description: "Retain audit logs for a minimum of 90 days", scope: "All Systems", enforced: true, lastUpdated: "2024-02-15" },
  { id: "POL-008", name: "Vulnerability Scanning", description: "Run automated vulnerability scans on all production assets weekly", scope: "Production", enforced: false, lastUpdated: "2024-02-10" },
  { id: "POL-009", name: "Access Review", description: "Conduct quarterly access reviews for all privileged accounts", scope: "Admin Users", enforced: true, lastUpdated: "2024-02-05" },
  { id: "POL-010", name: "Incident Response SLA", description: "Critical incidents must be acknowledged within 15 minutes", scope: "Security Team", enforced: true, lastUpdated: "2024-01-30" },
]

export function Policies(): JSX.Element {
  const [policies, setPolicies] = createSignal<Policy[]>(POLICIES)

  const togglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((policy) =>
        policy.id === id ? { ...policy, enforced: !policy.enforced } : policy
      )
    )
  }

  const enforcedCount = () => policies().filter((p) => p.enforced).length

  return (
    <div class="space-y-6">
      <div>
        <Breadcrumb.Root class="mb-2">
          <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" class="hover:text-gray-700">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/policies" current class="text-gray-900 font-medium">Policies</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h1 class="text-2xl font-bold text-gray-900">Security Policies</h1>
        <p class="mt-1 text-sm text-gray-500">Define, enforce, and audit security policies across the organization.</p>
      </div>

      <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Card.Header class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 class="text-sm font-semibold text-gray-900">Policy Rules</h2>
          <span class="text-sm text-gray-500">{enforcedCount()} of {policies().length} enforced</span>
        </Card.Header>
        <Card.Content class="p-0">
          <div class="divide-y divide-gray-200">
            {policies().map((policy) => (
              <div class="flex items-start justify-between px-6 py-4 hover:bg-gray-50">
                <div class="flex-1">
                  <div class="flex items-center gap-3">
                    <h3 class="text-sm font-semibold text-gray-900">{policy.name}</h3>
                    <span class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      policy.enforced ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {policy.enforced ? "Enforced" : "Disabled"}
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">{policy.description}</p>
                  <div class="mt-2 flex items-center gap-4 text-xs text-gray-400">
                    <span>{policy.id}</span>
                    <span>Scope: {policy.scope}</span>
                    <span>Last updated: {policy.lastUpdated}</span>
                  </div>
                </div>
                <div class="ml-4">
                  <Switch.Root
                    checked={policy.enforced}
                    onChange={() => togglePolicy(policy.id)}
                    class="inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 data-[state=checked]:bg-indigo-600"
                  >
                    <Switch.Thumb class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      policy.enforced ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </Switch.Root>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  )
}
