import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
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
    features: ["Unlimited projects", "Advanced analytics", "Priority support", "50 GB storage", "Custom integrations", "Team collaboration"],
    highlighted: true,
  },
  {
    tier: "Enterprise",
    price: "$99",
    period: "month",
    features: ["Everything in Pro", "Dedicated support", "Unlimited storage", "SSO & SAML", "Custom SLA", "On-premise deployment"],
    highlighted: false,
  },
]

const FAQ = [
  { question: "Can I switch plans at any time?", answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle." },
  { question: "Is there a free trial?", answer: "We offer a 14-day free trial for the Pro plan with full access to all features. No credit card required." },
  { question: "What payment methods do you accept?", answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans." },
  { question: "Do you offer discounts for nonprofits?", answer: "Yes, we offer a 50% discount for verified nonprofit organizations. Contact our sales team to apply." },
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
            <Breadcrumb.Link href="#" current>Pricing</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="mt-6 text-center">
        <h1 class="text-2xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
        <p class="mt-1 text-sm text-gray-500">Choose the plan that fits your needs. No hidden fees.</p>
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
        <h2 class="text-center text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <div class="mt-8 space-y-4">
          {FAQ.map((item) => (
            <details class="group rounded-lg border border-gray-200 bg-white">
              <summary class="cursor-pointer px-6 py-4 font-medium text-gray-900">
                {item.question}
              </summary>
              <div class="px-6 pb-4 text-sm text-gray-600">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
