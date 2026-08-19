import type { JSX } from "@solidjs/web"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Input from "@solidiom/input"
import * as Tabs from "@solidiom/tabs"
import * as Button from "@solidiom/button"
import { StatusBadge } from "../components/StatusBadge"
import { TicketCard } from "../components/TicketCard"

const TICKETS = [
  {
    id: "TK-1001",
    subject: "Cannot reset password",
    priority: "critical",
    assignee: "Alex Rivera",
    status: "open" as const,
    sla: "1h remaining",
  },
  {
    id: "TK-1002",
    subject: "API returning 500 errors",
    priority: "critical",
    assignee: "Jordan Lee",
    status: "in_progress" as const,
    sla: "2h remaining",
  },
  {
    id: "TK-1003",
    subject: "Feature request: Dark mode",
    priority: "low",
    assignee: "Unassigned",
    status: "open" as const,
    sla: "—",
  },
  {
    id: "TK-1004",
    subject: "Billing discrepancy on invoice #4521",
    priority: "high",
    assignee: "Morgan Chen",
    status: "pending" as const,
    sla: "4h remaining",
  },
  {
    id: "TK-1005",
    subject: "SSO integration not working",
    priority: "high",
    assignee: "Alex Rivera",
    status: "in_progress" as const,
    sla: "3h remaining",
  },
  {
    id: "TK-1006",
    subject: "How to export data to CSV",
    priority: "medium",
    assignee: "Casey Kim",
    status: "resolved" as const,
    sla: "—",
  },
  {
    id: "TK-1007",
    subject: "Mobile app crashes on login",
    priority: "high",
    assignee: "Jordan Lee",
    status: "open" as const,
    sla: "2h remaining",
  },
  {
    id: "TK-1008",
    subject: "Update company logo in profile",
    priority: "low",
    assignee: "Unassigned",
    status: "pending" as const,
    sla: "—",
  },
]

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 }

export function TicketQueue(): JSX.Element {
  const [search, setSearch] = createSignal("")
  const [statusFilter, setStatusFilter] = createSignal("all")

  const filtered = () => {
    let result = TICKETS.filter(
      (t) =>
        t.subject.toLowerCase().includes(search().toLowerCase()) ||
        t.id.toLowerCase().includes(search().toLowerCase()),
    )
    if (statusFilter() !== "all") {
      result = result.filter((t) => t.status === statusFilter())
    }
    return result.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
  }

  return (
    <div>
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Tickets</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" current>
              Queue
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="mt-6 flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Ticket Queue</h1>
          <p class="mt-1 text-sm text-gray-500">
            Manage support tickets with priority, assignment, and SLA tracking.
          </p>
        </div>
        <Button.Root class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          New Ticket
        </Button.Root>
      </div>

      <div class="mt-6 flex flex-col gap-4 sm:flex-row">
        <Input.Root
          type="search"
          placeholder="Search tickets..."
          value={search()}
          onValueChange={setSearch}
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-80"
        />

        <div class="flex items-center gap-2">
          {["all", "open", "in_progress", "pending", "resolved"].map((s) => (
            <button
              onClick={() => setStatusFilter(s)}
              class={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                statusFilter() === s
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {s === "all" ? "All" : s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered().map((ticket) => (
          <div class="rounded-lg border border-gray-200 bg-white p-4">
            <div class="flex items-start justify-between">
              <div>
                <div class="text-sm font-mono text-gray-500">{ticket.id}</div>
                <div class="font-medium text-gray-900">{ticket.subject}</div>
              </div>
              <StatusBadge status={ticket.status} />
            </div>
            <div class="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <span>
                Priority:
                <span
                  class={`ml-1 font-medium ${
                    ticket.priority === "critical"
                      ? "text-red-600"
                      : ticket.priority === "high"
                        ? "text-orange-600"
                        : ticket.priority === "medium"
                          ? "text-yellow-600"
                          : "text-gray-600"
                  }`}
                >
                  {ticket.priority}
                </span>
              </span>
              <span>Assignee: {ticket.assignee}</span>
              <span>SLA: {ticket.sla}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered().length === 0 && (
        <div class="py-12 text-center text-sm text-gray-500">
          No tickets match your search criteria.
        </div>
      )}
    </div>
  )
}
