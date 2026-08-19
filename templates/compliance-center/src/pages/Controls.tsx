import type { JSX } from "@solidjs/web"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Tabs from "@solidiom/tabs"
import * as Alert from "@solidiom/alert"
import * as Button from "@solidiom/button"
import { StatusBadge } from "../components/StatusBadge"

type ControlStatus = "compliant" | "non-compliant" | "partial" | "not-assessed"

interface Control {
  id: string
  code: string
  name: string
  framework: string
  owner: string
  status: ControlStatus
  lastAssessed: string
  dueDate: string
}

const CONTROLS: Control[] = [
  {
    id: "c1",
    code: "CC6.1",
    name: "Logical Access Management",
    framework: "SOC 2",
    owner: "Alice Chen",
    status: "compliant",
    lastAssessed: "2025-07-15",
    dueDate: "2026-01-15",
  },
  {
    id: "c2",
    code: "A.9.1",
    name: "Access Control Policy",
    framework: "ISO 27001",
    owner: "Bob Martinez",
    status: "partial",
    lastAssessed: "2025-06-20",
    dueDate: "2025-12-20",
  },
  {
    id: "c3",
    code: "164.312",
    name: "Access Controls",
    framework: "HIPAA",
    owner: "Carol Wu",
    status: "non-compliant",
    lastAssessed: "2025-05-10",
    dueDate: "2025-11-10",
  },
  {
    id: "c4",
    code: "CC7.2",
    name: "System Monitoring",
    framework: "SOC 2",
    owner: "Eva Singh",
    status: "compliant",
    lastAssessed: "2025-07-28",
    dueDate: "2026-01-28",
  },
  {
    id: "c5",
    code: "A.12.4",
    name: "Logging and Monitoring",
    framework: "ISO 27001",
    owner: "Frank Lee",
    status: "compliant",
    lastAssessed: "2025-07-01",
    dueDate: "2026-01-01",
  },
  {
    id: "c6",
    code: "CC8.1",
    name: "Change Management",
    framework: "SOC 2",
    owner: "Henry Zhao",
    status: "partial",
    lastAssessed: "2025-06-15",
    dueDate: "2025-12-15",
  },
  {
    id: "c7",
    code: "164.308",
    name: "Security Management",
    framework: "HIPAA",
    owner: "Iris Tanaka",
    status: "not-assessed",
    lastAssessed: "—",
    dueDate: "2025-09-01",
  },
  {
    id: "c8",
    code: "A.18.1",
    name: "Compliance Assessment",
    framework: "ISO 27001",
    owner: "Jack Wilson",
    status: "non-compliant",
    lastAssessed: "2025-04-20",
    dueDate: "2025-10-20",
  },
]

export function Controls(): JSX.Element {
  const [statusFilter, setStatusFilter] = createSignal("")

  const filtered = () =>
    statusFilter() ? CONTROLS.filter((c) => c.status === statusFilter) : CONTROLS

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
                <Breadcrumb.Link href="/controls" current class="text-gray-900 font-medium">
                  Controls
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
          <h1 class="text-2xl font-bold text-gray-900">Control Assessments</h1>
          <p class="mt-1 text-sm text-gray-500">
            Assess control effectiveness, assign owners, and track remediation progress.
          </p>
        </div>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          New Assessment
        </Button.Root>
      </div>

      <Alert.Root type="warning" class="rounded-md border border-yellow-200 bg-yellow-50 p-4">
        <Alert.Title class="text-sm font-medium text-yellow-800">Assessments Due</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-yellow-700">
          {CONTROLS.filter((c) => c.status === "non-compliant").length} controls are non-compliant
          and require immediate remediation.
        </Alert.Description>
      </Alert.Root>

      <div>
        <select
          class="block w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={statusFilter()}
          onChange={(e) => setStatusFilter(e.currentTarget.value)}
        >
          <option value="">All statuses</option>
          <option value="compliant">Compliant</option>
          <option value="partial">Partial</option>
          <option value="non-compliant">Non-compliant</option>
          <option value="not-assessed">Not assessed</option>
        </select>
      </div>

      <Tabs.Root defaultValue="all">
        <Tabs.List class="flex border-b border-gray-200">
          <Tabs.Trigger
            value="all"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            All ({CONTROLS.length})
          </Tabs.Trigger>
          <Tabs.Trigger
            value="soc2"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            SOC 2
          </Tabs.Trigger>
          <Tabs.Trigger
            value="iso"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            ISO 27001
          </Tabs.Trigger>
          <Tabs.Trigger
            value="hipaa"
            class="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
          >
            HIPAA
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="all" class="pt-6">
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Code
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Control
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Framework
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Owner
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Due
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {filtered().map((control) => (
                  <tr class="hover:bg-gray-50">
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-mono font-medium text-gray-900">
                      {control.code}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {control.name}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {control.framework}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {control.owner}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={control.status} />
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-400">
                      {control.dueDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
        <Tabs.Content value="soc2" class="pt-6">
          <div class="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Showing SOC 2 controls. Use the filter above to narrow results.
          </div>
        </Tabs.Content>
        <Tabs.Content value="iso" class="pt-6">
          <div class="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Showing ISO 27001 controls. Use the filter above to narrow results.
          </div>
        </Tabs.Content>
        <Tabs.Content value="hipaa" class="pt-6">
          <div class="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Showing HIPAA controls. Use the filter above to narrow results.
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
