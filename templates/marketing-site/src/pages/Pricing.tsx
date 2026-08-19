import type { JSX } from "@solidjs/web"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import { PriceCard } from "../components/PriceCard"

const TIERS = [
  {
    tier: "Starter",
    price: "$0",
    period: "month",
    features: ["Up to 3 projects", "Basic analytics", "Community support", "1 GB storage"],
    highlighted: false,
  },
  {
    tier: "Pro",
    price: "$29",
    period: "month",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "50 GB storage",
      "Custom integrations",
      "Team collaboration",
    ],
    highlighted: true,
  },
  {
    tier: "Enterprise",
    price: "$99",
    period: "month",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Unlimited storage",
      "SSO & SAML",
      "Custom SLA",
      "On-premise deployment",
    ],
    highlighted: false,
  },
]

const COMPARISON = [
  { feature: "Projects", starter: "3", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Storage", starter: "1 GB", pro: "50 GB", enterprise: "Unlimited" },
  { feature: "Team Members", starter: "1", pro: "10", enterprise: "Unlimited" },
  { feature: "Analytics", starter: "Basic", pro: "Advanced", enterprise: "Advanced + Custom" },
  { feature: "Support", starter: "Community", pro: "Priority", enterprise: "Dedicated" },
  { feature: "SSO/SAML", starter: "—", pro: "—", enterprise: "Included" },
  { feature: "Custom SLA", starter: "—", pro: "—", enterprise: "Included" },
  { feature: "On-premise", starter: "—", pro: "—", enterprise: "Included" },
]

const FAQ = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "We offer a 14-day free trial for the Pro plan with full access to all features. No credit card required.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
  },
  {
    question: "Do you offer discounts for nonprofits?",
    answer:
      "Yes, we offer a 50% discount for verified nonprofit organizations. Contact our sales team to apply.",
  },
  {
    question: "What happens when I exceed my storage limit?",
    answer:
      "You'll receive a notification when you reach 80% of your storage limit. You can upgrade your plan or purchase additional storage add-ons.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.",
  },
]

export function Pricing(): JSX.Element {
  return (
    <div>
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" current>
              Pricing
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="mt-6 text-center">
        <h1 class="text-2xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
        <p class="mt-1 text-sm text-gray-500">
          Choose the plan that fits your needs. No hidden fees.
        </p>
      </div>

      <div class="mt-12 grid gap-8 sm:grid-cols-3">
        {TIERS.map((tier) => (
          <PriceCard
            tier={tier.tier}
            price={tier.price}
            period={tier.period}
            features={tier.features}
            highlighted={tier.highlighted}
          />
        ))}
      </div>

      <div class="mx-auto mt-16 max-w-3xl">
        <h2 class="text-center text-xl font-bold text-gray-900">Compare Plans</h2>
        <div class="mt-8 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="pb-3 text-left font-medium text-gray-900">Feature</th>
                <th class="pb-3 text-center font-medium text-gray-900">Starter</th>
                <th class="pb-3 text-center font-medium text-indigo-600">Pro</th>
                <th class="pb-3 text-center font-medium text-gray-900">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr class="border-b border-gray-100">
                  <td class="py-3 text-gray-700">{row.feature}</td>
                  <td class="py-3 text-center text-gray-500">{row.starter}</td>
                  <td class="py-3 text-center font-medium text-gray-900">{row.pro}</td>
                  <td class="py-3 text-center text-gray-500">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div class="mx-auto mt-16 max-w-3xl">
        <h2 class="text-center text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <div class="mt-8 space-y-4">
          {FAQ.map((item) => (
            <details class="group rounded-lg border border-gray-200 bg-white">
              <summary class="cursor-pointer px-6 py-4 font-medium text-gray-900">
                {item.question}
              </summary>
              <div class="px-6 pb-4 text-sm text-gray-600">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>

      <div class="mt-12 rounded-lg bg-indigo-50 p-8 text-center">
        <h2 class="text-xl font-bold text-gray-900">Need a Custom Plan?</h2>
        <p class="mx-auto mt-2 max-w-lg text-sm text-gray-600">
          Contact our sales team for volume licensing and custom enterprise agreements.
        </p>
        <div class="mt-4">
          <Button.Root class="rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700">
            Contact Sales
          </Button.Root>
        </div>
      </div>
    </div>
  )
}
