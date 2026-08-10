import { createSignal, type JSX } from "solid-js"
import { A, useLocation } from "@solidjs/router"
import * as Card from "@solidiom/card"
import * as Button from "@solidiom/button"

interface PaymentMethod {
  id: string
  type: string
  last4: string
  expiry: string
  default: boolean
}

const INITIAL_METHODS: PaymentMethod[] = [
  { id: "1", type: "Visa", last4: "4242", expiry: "12/2027", default: true },
  { id: "2", type: "Mastercard", last4: "8888", expiry: "06/2026", default: false },
]

export function Payment(): JSX.Element {
  const location = useLocation()
  const [methods, setMethods] = createSignal<PaymentMethod[]>(INITIAL_METHODS)

  const setDefault = (id: string) => {
    setMethods((prev) => prev.map((m) => ({ ...m, default: m.id === id })))
  }

  const removeMethod = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id))
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
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Payment Methods</h1>
            <p class="mt-1 text-sm text-gray-500">Manage your payment methods and set defaults.</p>
          </div>
          <Button.Root class="bg-indigo-600 text-white hover:bg-indigo-700">Add Method</Button.Root>
        </div>

        <div class="mt-6 space-y-4">
          {methods().map((method) => (
            <Card.Root class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div class="flex items-center gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <span class="text-sm font-medium text-gray-600">{method.type}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {method.type} ending in {method.last4}
                  </p>
                  <p class="text-xs text-gray-500">Expires {method.expiry}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                {method.default ? (
                  <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Default</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDefault(method.id)}
                    class="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Set Default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeMethod(method.id)}
                  class="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </Card.Root>
          ))}
        </div>
      </main>
    </div>
  )
}
