import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import { FeatureCard } from "../components/FeatureCard"

const FEATURES = [
  { title: "Real-time Collaboration", description: "Work together with your team in real-time. See changes as they happen, leave comments, and resolve conflicts automatically.", icon: "👥" },
  { title: "Advanced Analytics", description: "Gain insights with powerful dashboards and custom reports. Track KPIs, monitor performance, and make data-driven decisions.", icon: "📊" },
  { title: "Automated Workflows", description: "Build custom automation rules to eliminate repetitive tasks. Set triggers, conditions, and actions without writing code.", icon: "⚡" },
  { title: "Enterprise Security", description: "Bank-grade security with SSO, MFA, and role-based access control. SOC 2 Type II certified and GDPR compliant.", icon: "🔒" },
  { title: "API-First Design", description: "Integrate with your existing tools through our comprehensive REST API. Webhook support for real-time event notifications.", icon: "🔗" },
  { title: "Global Infrastructure", description: "Deployed across 20+ regions for low-latency access worldwide. Automatic failover and 99.99% uptime SLA.", icon: "🌍" },
]

export function Features(): JSX.Element {
  return (
    <div>
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" current>Features</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="mt-6">
        <h1 class="text-2xl font-bold text-gray-900">Features</h1>
        <p class="mt-1 text-sm text-gray-500">Everything you need to build, ship, and scale your products.</p>
      </div>

      <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <FeatureCard
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </div>
  )
}
