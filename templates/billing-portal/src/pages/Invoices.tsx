import { createSignal, type JSX } from "solid-js"
import { A, useLocation } from "@solidjs/router"
import * as Card from "@solidiom/card"
import { InvoiceRow } from "../components/InvoiceRow"

const INVOICES = [
  { number: "INV-2026-001", date: "Aug 1, 2026", amount: "$29.00", status: "paid" as const },
  { number: "INV-2026-002", date: "Jul 1, 2026", amount: "$29.00", status: "paid" as const },
  { number: "INV-2026-003", date: "Jun 1, 2026", amount: "$29.00", status: "paid" as const },
  { number: "INV-2026-004", date: "May 1, 2026", amount: "$29.00", status: "pending" as const },
  { number: "INV-2026-005", date: "Apr 1, 2026", amount: "$0.00", status: "paid" as const },
  { number: "INV-2026-006", date: "Mar 1, 2026", amount: "$0.00", status: "paid" as const },
  { number: "INV-2026-007", date: "Feb 1, 2026", amount: "$0.00", status: "paid" as const },
  { number: "INV-2026-008", date: "Jan 1, 2026", amount: "$0.00", status: "paid" as const },
  { number: "INV-2025-012", date: "Dec 1, 2025", amount: "$0.00", status: "paid" as const },
  { number: "INV-2025-011", date: "Nov 1, 2025", amount: "$0.00", status: "overdue" as const },
]

export function Invoices(): JSX.Element {
  const location = useLocation()
  const [filter, setFilter] = createSignal("all")

  const filtered = () =>
    filter() === "all" ? INVOICES : INVOICES.filter((i) => i.status === filter())

  const totalSpent = () => {
    const sum = filtered()
      .filter((i) => i.status === "paid")
      .reduce((acc, i) => acc + parseFloat(i.amount.replace("$", "")), 0)
    return `$${sum.toFixed(2)}`
  }

  const pendingAmount = () => {
    const sum = filtered()
      .filter((i) => i.status === "pending" || i.status === "overdue")
      .reduce((acc, i) => acc + parseFloat(i.amount.replace("$", "")), 0)
    return `$${sum.toFixed(2)}`
  }

  return (
    <div class="min-h-screen bg-gray-50">
      <header class="border-b border-gray-200 bg-white">
        <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-8">
            <A href="/" class="text-lg font-bold text-gray-900">Billing</A>
            <nav class="flex items-center gap-1">
              <A href="/" class={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${location.pathname === "/" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>Plans</A>
              <A href="/payment" class={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${location.pathname === "/payment" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>Payments</A>
              <A href="/invoices" class={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${location.pathname === "/invoices" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>Invoices</A>
            </nav>
          </div>
        </div>
      </header>
      <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Invoice History</h1>
          <p class="mt-1 text-sm text-gray-500">View and download your past invoices.</p>
        </div>

        <div class="mt-4 flex gap-2">
          {["all", "paid", "pending", "overdue"].map((f) => (
            <button
              type="button"
              onClick={() => setFilter(f)}
              class={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                filter() === f
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p class="text-sm font-medium text-gray-500">Total Spent</p>
            <p class="mt-1 text-2xl font-bold text-gray-900">{totalSpent()}</p>
          </Card.Root>
          <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p class="text-sm font-medium text-gray-500">Outstanding</p>
            <p class="mt-1 text-2xl font-bold text-amber-600">{pendingAmount()}</p>
          </Card.Root>
          <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p class="text-sm font-medium text-gray-500">Invoices</p>
            <p class="mt-1 text-2xl font-bold text-gray-900">{filtered().length}</p>
          </Card.Root>
        </div>

        <Card.Root class="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
            <span class="text-xs font-medium text-gray-500">
              Showing {filtered().length} of {INVOICES.length} invoices
            </span>
            <button type="button" class="text-xs font-medium text-indigo-600 hover:text-indigo-700">
              Download All
            </button>
          </div>
          {filtered().map((invoice) => (
            <InvoiceRow {...invoice} />
          ))}
        </Card.Root>

        <div class="mt-8">
          <h2 class="text-lg font-bold text-gray-900">Payment Methods</h2>
          <Card.Root class="mt-3 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                <span class="text-xs font-bold text-gray-600">VISA</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">•••• 4242</p>
                <p class="text-xs text-gray-500">Expires 12/2027</p>
              </div>
            </div>
            <span class="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Default</span>
          </Card.Root>
        </div>
      </main>
    </div>
  )
}
