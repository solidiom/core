import type { JSX } from "@solidjs/web"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import { SeverityBadge } from "../components/SeverityBadge"

interface Postmortem {
  id: string
  title: string
  severity: "critical" | "high" | "medium" | "low"
  rootCause: string
  duration: string
  resolved: string
  actionItems: string[]
}

const POSTMORTEMS: Postmortem[] = [
  {
    id: "INC-2980",
    title: "Database connection pool exhaustion",
    severity: "critical",
    rootCause:
      "Slow query from reporting service held connections for 30+ seconds, draining the pool",
    duration: "2h 15m",
    resolved: "2024-03-14",
    actionItems: [
      "Add query timeout to reporting service",
      "Increase connection pool monitoring",
      "Implement connection pool circuit breaker",
    ],
  },
  {
    id: "INC-2965",
    title: "CDN misconfiguration caused cache bypass",
    severity: "high",
    rootCause:
      "Cache control headers were removed during deployment, causing all requests to hit origin",
    duration: "1h 45m",
    resolved: "2024-03-12",
    actionItems: [
      "Add cache header validation to deployment pipeline",
      "Set up CDN cache hit rate alerts",
    ],
  },
  {
    id: "INC-2940",
    title: "Memory leak in worker pool",
    severity: "medium",
    rootCause: "Event listener not cleaned up on worker restart, causing gradual memory growth",
    duration: "6h 30m",
    resolved: "2024-03-10",
    actionItems: [
      "Fix event listener cleanup in worker lifecycle",
      "Add memory usage monitoring per worker",
      "Set up automatic worker restart on memory threshold",
    ],
  },
  {
    id: "INC-2920",
    title: "SSL certificate expiry for internal services",
    severity: "high",
    rootCause: "Automated certificate renewal job failed due to DNS misconfiguration",
    duration: "3h 00m",
    resolved: "2024-03-08",
    actionItems: [
      "Add DNS health check before cert renewal",
      "Implement certificate expiry alerts at 30/14/7 days",
    ],
  },
  {
    id: "INC-2905",
    title: "Rate limiter bypass on auth endpoints",
    severity: "critical",
    rootCause: "Rate limiter configuration was reset during blue-green deployment rollback",
    duration: "45m",
    resolved: "2024-03-05",
    actionItems: [
      "Persist rate limiter config across deployments",
      "Add rate limiter health check to deployment validation",
      "Implement auth endpoint anomaly detection",
    ],
  },
]

export function Postmortems(): JSX.Element {
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
              <Breadcrumb.Link href="/postmortems" current class="text-gray-900 font-medium">
                Postmortems
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h1 class="text-2xl font-bold text-gray-900">Postmortems</h1>
        <p class="mt-1 text-sm text-gray-500">
          Resolved incidents with root cause analysis, timeline, and action items.
        </p>
      </div>

      <div class="space-y-4">
        {POSTMORTEMS.map((pm) => (
          <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
            <Card.Header class="flex items-start justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <div class="flex items-center gap-3">
                  <SeverityBadge severity={pm.severity} />
                  <h3 class="text-sm font-semibold text-gray-900">{pm.title}</h3>
                </div>
                <div class="mt-1 flex items-center gap-4 text-xs text-gray-400">
                  <span>{pm.id}</span>
                  <span>Duration: {pm.duration}</span>
                  <span>Resolved: {pm.resolved}</span>
                </div>
              </div>
            </Card.Header>
            <Card.Content class="px-6 py-4">
              <div class="mb-4">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Root Cause
                </h4>
                <p class="mt-1 text-sm text-gray-700">{pm.rootCause}</p>
              </div>
              <div>
                <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Action Items
                </h4>
                <ul class="mt-2 space-y-1">
                  {pm.actionItems.map((item) => (
                    <li class="flex items-start gap-2 text-sm text-gray-700">
                      <span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </div>
  )
}
