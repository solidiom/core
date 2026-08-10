import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Alert from "@solidiom/alert"
import * as Dialog from "@solidiom/dialog"
import { ClassificationBadge } from "../components/ClassificationBadge"

type EnforcementStatus = "enforced" | "pending" | "disabled"

interface PolicyRule {
  id: string
  name: string
  classification: string
  description: string
  patterns: string[]
  enforcement: EnforcementStatus
  owner: string
  createdAt: string
}

const POLICY_RULES: PolicyRule[] = [
  { id: "pol-001", name: "SSN Detection", classification: "restricted", description: "Detect and mask Social Security Numbers in all data stores", patterns: ["\\d{3}-\\d{2}-\\d{4}"], enforcement: "enforced", owner: "Security Team", createdAt: "2024-01-10" },
  { id: "pol-002", name: "Credit Card Masking", classification: "restricted", description: "Mask credit card numbers showing only last 4 digits", patterns: ["\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}"], enforcement: "enforced", owner: "Security Team", createdAt: "2024-01-10" },
  { id: "pol-003", name: "Email PII Classification", classification: "confidential", description: "Auto-classify fields containing email addresses as PII", patterns: ["[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"], enforcement: "enforced", owner: "Data Governance", createdAt: "2024-02-15" },
  { id: "pol-004", name: "Geolocation Access Control", classification: "confidential", description: "Restrict access to GPS coordinates to authorized roles", patterns: ["lat/lon pairs"], enforcement: "pending", owner: "Legal Team", createdAt: "2024-06-20" },
  { id: "pol-005", name: "Health Data Encryption", classification: "restricted", description: "Encrypt PHI fields at rest and in transit", patterns: ["diagnosis codes", "patient IDs"], enforcement: "enforced", owner: "Compliance", createdAt: "2024-03-01" },
  { id: "pol-006", name: "Internal Docs Labeling", classification: "internal", description: "Auto-label documents marked for internal use only", patterns: ["@internal", "#confidential"], enforcement: "disabled", owner: "Content Team", createdAt: "2024-05-12" },
]

export function Classification(): JSX.Element {
  const [showAddDialog, setShowAddDialog] = createSignal(false)
  const [classificationFilter, setClassificationFilter] = createSignal<string>("all")

  const filtered = () =>
    POLICY_RULES.filter((rule) =>
      classificationFilter() === "all" || rule.classification === classificationFilter()
    )

  const enforcementColor = (status: EnforcementStatus) => {
    switch (status) {
      case "enforced": return "bg-green-100 text-green-700"
      case "pending": return "bg-yellow-100 text-yellow-700"
      case "disabled": return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div class="space-y-8">
      <div>
        <Breadcrumb.Root class="mb-2">
          <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" class="hover:text-gray-700">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/classification" current class="text-gray-900 font-medium">Classification Policies</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Classification Policies</h1>
            <p class="mt-1 text-sm text-gray-500">Define sensitivity labels, apply classification rules, and enforce retention policies.</p>
          </div>
          <Button.Root class="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700" onClick={() => setShowAddDialog(true)}>
            Add Policy
          </Button.Root>
        </div>
      </div>

      <Alert.Root type="info" class="rounded-lg">
        <Alert.Title class="text-sm font-medium">Policy Summary</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-gray-600">
          {POLICY_RULES.filter((r) => r.enforcement === "enforced").length} enforced, {POLICY_RULES.filter((r) => r.enforcement === "pending").length} pending, {POLICY_RULES.filter((r) => r.enforcement === "disabled").length} disabled out of {POLICY_RULES.length} total policies.
        </Alert.Description>
      </Alert.Root>

      <div class="flex items-center gap-4">
        <select
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={classificationFilter()}
          onChange={(e) => setClassificationFilter(e.currentTarget.value)}
        >
          <option value="all">All Classifications</option>
          <option value="public">Public</option>
          <option value="internal">Internal</option>
          <option value="confidential">Confidential</option>
          <option value="restricted">Restricted</option>
        </select>
      </div>

      <div class="rounded-lg border border-gray-200 bg-white">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50">
                <th class="px-4 py-3 font-medium text-gray-500">Policy</th>
                <th class="px-4 py-3 font-medium text-gray-500">Classification</th>
                <th class="px-4 py-3 font-medium text-gray-500">Enforcement</th>
                <th class="px-4 py-3 font-medium text-gray-500">Owner</th>
                <th class="px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              {filtered().map((rule) => (
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <div class="font-medium text-gray-900">{rule.name}</div>
                    <div class="mt-0.5 text-xs text-gray-500">{rule.description}</div>
                    <div class="mt-1 flex flex-wrap gap-1">
                      {rule.patterns.map((pat) => (
                        <span class="inline-flex items-center rounded px-1.5 py-0.5 font-mono text-xs bg-gray-100 text-gray-600">
                          {pat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <ClassificationBadge level={rule.classification as "public" | "internal" | "confidential" | "restricted"} />
                  </td>
                  <td class="px-4 py-3">
                    <span class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${enforcementColor(rule.enforcement)}`}>
                      {rule.enforcement}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-gray-500">{rule.owner}</td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <Button.Root class="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                        Edit
                      </Button.Root>
                      {rule.enforcement !== "enforced" && (
                        <Button.Root class="rounded-md border border-green-200 bg-white px-2.5 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50">
                          Enforce
                        </Button.Root>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog.Root open={showAddDialog()} onOpenChange={setShowAddDialog}>
        <Dialog.Portal>
          <Dialog.Backdrop class="fixed inset-0 bg-black/40" />
          <Dialog.Content class="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title class="text-lg font-semibold text-gray-900">Add Classification Policy</Dialog.Title>
            <p class="mt-1 text-sm text-gray-500">Define a new data classification and enforcement policy.</p>
            <div class="mt-4 space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">Policy Name</label>
                <input type="text" placeholder="e.g. Phone Number Detection" class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Classification Level</label>
                <select class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option value="public">Public</option>
                  <option value="internal">Internal</option>
                  <option value="confidential">Confidential</option>
                  <option value="restricted">Restricted</option>
                </select>
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <Button.Root class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button.Root>
              <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700" onClick={() => {
                setShowAddDialog(false)

              }}>
                Create Policy
              </Button.Root>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
