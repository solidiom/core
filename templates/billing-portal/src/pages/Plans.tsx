import type { JSX } from "@solidjs/web"
import { A, useLocation } from "@solidjs/router"
import { PlanCard } from "../components/PlanCard"

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "month",
    features: ["Up to 3 projects", "Basic analytics", "Community support"],
    usage: { projects: 3, storage: "1 GB", apiCalls: "100/mo", teamMembers: 1 },
  },
  {
    name: "Starter",
    price: "$9",
    period: "month",
    features: ["Up to 10 projects", "Standard analytics", "Email support", "1 custom domain"],
    usage: { projects: 10, storage: "5 GB", apiCalls: "5,000/mo", teamMembers: 3 },
  },
  {
    name: "Pro",
    price: "$29",
    period: "month",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "Custom domains",
      "API access",
    ],
    highlighted: true,
    current: true,
    usage: { projects: "Unlimited", storage: "50 GB", apiCalls: "100,000/mo", teamMembers: 10 },
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "month",
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom integrations",
      "Audit logs",
    ],
    usage: {
      projects: "Unlimited",
      storage: "500 GB",
      apiCalls: "Unlimited",
      teamMembers: "Unlimited",
    },
  },
]

const FAQ = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes. Upgrades take effect immediately. Downgrades apply at the next billing cycle.",
  },
  {
    q: "Is there a free trial?",
    a: "You get 14 days of Pro features on any new account, no credit card required.",
  },
  {
    q: "What happens when I exceed my API limit?",
    a: "Requests will return a 429 status. You can upgrade or wait for the next billing period.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Yes. Choose annual billing and save 20% on any paid plan.",
  },
]

export function Plans(): JSX.Element {
  const location = useLocation()

  return (
    <div class="min-h-screen bg-gray-50">
      <header class="border-b border-gray-200 bg-white">
        <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-8">
            <A href="/" class="text-lg font-bold text-gray-900">
              Billing
            </A>
            <nav class="flex items-center gap-1">
              <A
                href="/"
                class={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${location.pathname === "/" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
              >
                Plans
              </A>
              <A
                href="/payment"
                class={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${location.pathname === "/payment" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
              >
                Payments
              </A>
              <A
                href="/invoices"
                class={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${location.pathname === "/invoices" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
              >
                Invoices
              </A>
            </nav>
          </div>
        </div>
      </header>
      <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900">Subscription Plans</h1>
        <p class="mt-1 text-sm text-gray-500">
          Choose the plan that fits your needs. Upgrade or downgrade at any time.
        </p>

        <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <PlanCard {...plan} />
          ))}
        </div>

        <div class="mt-16">
          <h2 class="text-xl font-bold text-gray-900">Usage Limits</h2>
          <p class="mt-1 text-sm text-gray-500">
            Compare storage, API calls, and team size across plans.
          </p>

          <div class="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table class="min-w-full text-left text-sm">
              <thead class="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th class="px-4 py-3 font-medium text-gray-500">Feature</th>
                  {PLANS.map((plan) => (
                    <th class="px-4 py-3 font-medium text-gray-900">{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr>
                  <td class="px-4 py-3 text-gray-600">Projects</td>
                  {PLANS.map((plan) => (
                    <td class="px-4 py-3 font-medium text-gray-900">
                      {String(plan.usage?.projects ?? "—")}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td class="px-4 py-3 text-gray-600">Storage</td>
                  {PLANS.map((plan) => (
                    <td class="px-4 py-3 font-medium text-gray-900">
                      {String(plan.usage?.storage ?? "—")}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td class="px-4 py-3 text-gray-600">API Calls</td>
                  {PLANS.map((plan) => (
                    <td class="px-4 py-3 font-medium text-gray-900">
                      {String(plan.usage?.apiCalls ?? "—")}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td class="px-4 py-3 text-gray-600">Team Members</td>
                  {PLANS.map((plan) => (
                    <td class="px-4 py-3 font-medium text-gray-900">
                      {String(plan.usage?.teamMembers ?? "—")}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-16">
          <h2 class="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div class="mt-4 space-y-4">
            {FAQ.map((item) => (
              <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h3 class="text-sm font-semibold text-gray-900">{item.q}</h3>
                <p class="mt-1 text-sm text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div class="mt-16 rounded-lg bg-indigo-50 p-6 text-center">
          <h2 class="text-lg font-bold text-gray-900">Try Pro Free for 14 Days</h2>
          <p class="mt-1 text-sm text-gray-600">
            No credit card required. Cancel anytime during your trial.
          </p>
          <button
            type="button"
            class="mt-4 rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Start Free Trial
          </button>
        </div>
      </main>
    </div>
  )
}
