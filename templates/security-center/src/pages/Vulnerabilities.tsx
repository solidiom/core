import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import { StatusBadge } from "../components/StatusBadge"

type VulnSeverity = "critical" | "high" | "medium" | "low"
type VulnStatus = "active" | "mitigated" | "closed"

interface Vulnerability {
  id: string
  cve: string
  title: string
  severity: VulnSeverity
  affectedAssets: number
  status: VulnStatus
  published: string
}

const VULNS: Vulnerability[] = [
  {
    id: "VUL-001",
    cve: "CVE-2024-1001",
    title: "Remote code execution in web framework",
    severity: "critical",
    affectedAssets: 12,
    status: "active",
    published: "2024-03-14",
  },
  {
    id: "VUL-002",
    cve: "CVE-2024-1002",
    title: "SQL injection in ORM library",
    severity: "critical",
    affectedAssets: 8,
    status: "mitigated",
    published: "2024-03-12",
  },
  {
    id: "VUL-003",
    cve: "CVE-2024-1003",
    title: "Cross-site scripting in input validation",
    severity: "high",
    affectedAssets: 23,
    status: "active",
    published: "2024-03-10",
  },
  {
    id: "VUL-004",
    cve: "CVE-2024-1004",
    title: "Privilege escalation in auth module",
    severity: "high",
    affectedAssets: 5,
    status: "active",
    published: "2024-03-08",
  },
  {
    id: "VUL-005",
    cve: "CVE-2024-1005",
    title: "Information disclosure via error messages",
    severity: "medium",
    affectedAssets: 34,
    status: "mitigated",
    published: "2024-03-05",
  },
  {
    id: "VUL-006",
    cve: "CVE-2024-1006",
    title: "Denial of service in file parser",
    severity: "medium",
    affectedAssets: 15,
    status: "active",
    published: "2024-03-01",
  },
  {
    id: "VUL-007",
    cve: "CVE-2024-1007",
    title: "Session fixation vulnerability",
    severity: "high",
    affectedAssets: 7,
    status: "closed",
    published: "2024-02-28",
  },
  {
    id: "VUL-008",
    cve: "CVE-2024-1008",
    title: "Weak cryptographic algorithm usage",
    severity: "low",
    affectedAssets: 42,
    status: "active",
    published: "2024-02-25",
  },
  {
    id: "VUL-009",
    cve: "CVE-2024-1009",
    title: "Improper certificate validation",
    severity: "medium",
    affectedAssets: 18,
    status: "mitigated",
    published: "2024-02-20",
  },
  {
    id: "VUL-010",
    cve: "CVE-2024-1010",
    title: "Open redirect in OAuth flow",
    severity: "low",
    affectedAssets: 3,
    status: "closed",
    published: "2024-02-15",
  },
]

function SeverityBadge(props: { severity: VulnSeverity }): JSX.Element {
  const colors = () => {
    switch (props.severity) {
      case "critical":
        return "bg-red-100 text-red-700"
      case "high":
        return "bg-orange-100 text-orange-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
    }
  }

  return (
    <span
      class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors()}`}
    >
      {props.severity}
    </span>
  )
}

export function Vulnerabilities(): JSX.Element {
  const [search, setSearch] = createSignal("")
  const [severityFilter, setSeverityFilter] = createSignal<string>("all")

  const filteredVulns = () =>
    VULNS.filter((v) => {
      const matchesSearch =
        v.cve.toLowerCase().includes(search().toLowerCase()) ||
        v.title.toLowerCase().includes(search().toLowerCase())
      const matchesSeverity = severityFilter() === "all" || v.severity === severityFilter()
      return matchesSearch && matchesSeverity
    })

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
              <Breadcrumb.Link href="/vulnerabilities" current class="text-gray-900 font-medium">
                Vulnerabilities
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h1 class="text-2xl font-bold text-gray-900">Vulnerabilities</h1>
        <p class="mt-1 text-sm text-gray-500">
          Scan results with CVE details, affected assets, and remediation status.
        </p>
      </div>

      <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Card.Header class="flex flex-wrap items-center gap-4 border-b border-gray-200 px-6 py-4">
          <input
            type="text"
            placeholder="Search by CVE or title..."
            value={search()}
            onInput={(e: Event) => setSearch((e.target as HTMLInputElement).value)}
            class="w-64 rounded-md border border-gray-300 px-3 py-1.5 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <select
            value={severityFilter()}
            onChange={(e: Event) => setSeverityFilter((e.target as HTMLSelectElement).value)}
            class="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <span class="text-sm text-gray-500">{filteredVulns().length} vulnerabilities</span>
        </Card.Header>
        <Card.Content class="p-0">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  CVE
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Title
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Severity
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Affected
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Published
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              {filteredVulns().map((vuln) => (
                <tr class="hover:bg-gray-50">
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-400">
                    {vuln.cve}
                  </td>
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{vuln.title}</td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <SeverityBadge severity={vuln.severity} />
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {vuln.affectedAssets} assets
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={vuln.status} />
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {vuln.published}
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
