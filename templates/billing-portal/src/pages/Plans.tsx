import { type JSX } from "solid-js"
import { A, useLocation } from "@solidjs/router"
import { PlanCard } from "../components/PlanCard"

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "month",
    features: ["Up to 3 projects", "Basic analytics", "Community support"],
  },
  {
    name: "Pro",
    price: "$29",
    period: "month",
    features: ["Unlimited projects", "Advanced analytics", "Priority support", "Custom domains", "API access"],
    highlighted: true,
    current: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "month",
    features: ["Everything in Pro", "SSO & SAML", "Dedicated account manager", "SLA guarantee", "Custom integrations", "Audit logs"],
  },
]

export function Plans(): JSX.Element {
  const location = useLocation()

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
        <h1 class="text-2xl font-bold text-gray-900">Subscription Plans</h1>
        <p class="mt-1 text-sm text-gray-500">Choose the plan that fits your needs. Upgrade or downgrade at any time.</p>

        <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard {...plan} />
          ))}
        </div>
      </main>
    </div>
  )
}
