import { createSignal, type JSX } from "solid-js"
import { A, useLocation } from "@solidjs/router"
import * as Card from "@solidiom/card"
import { InvoiceRow } from "../components/InvoiceRow"

const INVOICES = [
  { number: "INV-2026-001", date: "Aug 1, 2026", amount: "$29.00", status: "paid" as const },
  { number: "INV-2026-002", date: "Jul 1, 2026", amount: "$29.00", status: "paid" as const },
  { number: "INV-2026-003", date: "Jun 1, 2026", amount: "$29.00", status: "paid" as const },
  { number: "INV-2026-004", date: "May 1, 2026", amount: "$0.00", status: "paid" as const },
  { number: "INV-2026-005", date: "Apr 1, 2026", amount: "$0.00", status: "paid" as const },
]

export function Invoices(): JSX.Element {
  const location = useLocation()
  const [filter, setFilter] = createSignal("all")

  const filtered = () =>
    filter() === "all" ? INVOICES : INVOICES.filter((i) => i.status === filter())

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

        <Card.Root class="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          {filtered().map((invoice) => (
            <InvoiceRow {...invoice} />
          ))}
        </Card.Root>
      </main>
    </div>
  )
}
