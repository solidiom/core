import { createSignal } from "solid-js"
import type { JSX } from "@solidjs/web"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Alert from "@solidiom/alert"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import { StatusBadge } from "../components/StatusBadge"

const RUNS = [
  {
    id: "run-001",
    workflow: "Onboard New User",
    started: "2026-08-10 14:32",
    duration: "1.2s",
    status: "success" as const,
  },
  {
    id: "run-002",
    workflow: "Process Refund",
    started: "2026-08-10 14:30",
    duration: "3.4s",
    status: "success" as const,
  },
  {
    id: "run-003",
    workflow: "Onboard New User",
    started: "2026-08-10 14:28",
    duration: "—",
    status: "running" as const,
  },
  {
    id: "run-004",
    workflow: "Data Sync",
    started: "2026-08-10 14:25",
    duration: "0.8s",
    status: "error" as const,
  },
  {
    id: "run-005",
    workflow: "Weekly Report",
    started: "2026-08-10 14:20",
    duration: "—",
    status: "queued" as const,
  },
  {
    id: "run-006",
    workflow: "Process Refund",
    started: "2026-08-10 14:15",
    duration: "2.1s",
    status: "cancelled" as const,
  },
]

export function Runs(): JSX.Element {
  const [filter, setFilter] = createSignal("all")

  const filtered = () => {
    if (filter() === "all") return RUNS
    return RUNS.filter((r) => r.status === filter())
  }

  return (
    <div class="space-y-8">
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" class="text-sm text-gray-500 hover:text-gray-900">
              Workflows
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator class="text-gray-400">/</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/runs" current class="text-sm font-medium text-gray-900">
              Runs
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div>
        <h1 class="text-2xl font-bold text-gray-900">Workflow Runs</h1>
        <p class="mt-1 text-sm text-gray-500">
          Monitor execution history with step-level logs and retry controls.
        </p>
      </div>

      <div class="flex items-center gap-2">
        {["all", "success", "running", "error", "queued", "cancelled"].map((f) => (
          <button
            onClick={() => setFilter(f)}
            class={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filter() === f ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span class="ml-auto text-sm text-gray-500">{filtered().length} runs</span>
      </div>

      <div class="space-y-3">
        {filtered().map((run) => (
          <Card.Root class="rounded-lg border border-gray-200 bg-white">
            <Card.Content class="px-4 py-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <StatusBadge type={run.status} />
                  <div>
                    <p class="text-sm font-medium text-gray-900">{run.workflow}</p>
                    <p class="text-xs text-gray-500">
                      {run.id} • Started {run.started}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-sm text-gray-500">{run.duration}</span>
                  {run.status === "error" && (
                    <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                      Retry
                    </Button.Root>
                  )}
                  <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                    Logs
                  </Button.Root>
                </div>
              </div>
            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </div>
  )
}
