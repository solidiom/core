import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import { FeatureCard } from "../components/FeatureCard"

const CORE_FEATURES = [
  { title: "Real-time Collaboration", description: "Work together with your team in real-time. See changes as they happen, leave comments, and resolve conflicts automatically.", icon: "👥" },
  { title: "Advanced Analytics", description: "Gain insights with powerful dashboards and custom reports. Track KPIs, monitor performance, and make data-driven decisions.", icon: "📊" },
  { title: "Automated Workflows", description: "Build custom automation rules to eliminate repetitive tasks. Set triggers, conditions, and actions without writing code.", icon: "⚡" },
]

const ADVANCED_FEATURES = [
  { title: "Enterprise Security", description: "Bank-grade security with SSO, MFA, and role-based access control. SOC 2 Type II certified and GDPR compliant.", icon: "🔒" },
  { title: "API-First Design", description: "Integrate with your existing tools through our comprehensive REST API. Webhook support for real-time event notifications.", icon: "🔗" },
  { title: "Global Infrastructure", description: "Deployed across 20+ regions for low-latency access worldwide. Automatic failover and 99.99% uptime SLA.", icon: "🌍" },
]

const DEVELOPER_FEATURES = [
  { title: "CLI Tools", description: "Powerful command-line interface for scripting, automation, and CI/CD pipeline integration. Available on all major platforms.", icon: "💻" },
  { title: "Webhooks & Events", description: "Subscribe to platform events with webhooks. Build reactive integrations that respond to changes in real-time.", icon: "🔔" },
  { title: "SDKs & Libraries", description: "Official SDKs for JavaScript, Python, and Go. Get started in minutes with comprehensive documentation and examples.", icon: "📦" },
]

const USE_CASES = [
  { title: "SaaS Startups", description: "Launch and scale your product with infrastructure that grows with you. From MVP to enterprise-ready in weeks." },
  { title: "Enterprise Teams", description: "Centralize your workflows, enforce governance, and maintain compliance across global teams and regions." },
  { title: "DevOps & Engineering", description: "Automate deployments, monitor system health, and reduce mean time to recovery with built-in observability." },
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

      <div class="mt-12">
        <h2 class="text-xl font-bold text-gray-900">Core Features</h2>
        <p class="mt-1 text-sm text-gray-500">The essential tools every team needs from day one.</p>
        <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_FEATURES.map((feature) => (
            <FeatureCard
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>

      <div class="mt-12">
        <h2 class="text-xl font-bold text-gray-900">Advanced Capabilities</h2>
        <p class="mt-1 text-sm text-gray-500">Enterprise-grade features for teams with demanding requirements.</p>
        <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANCED_FEATURES.map((feature) => (
            <FeatureCard
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>

      <div class="mt-12">
        <h2 class="text-xl font-bold text-gray-900">For Developers</h2>
        <p class="mt-1 text-sm text-gray-500">Developer-first tooling that fits into your existing workflow.</p>
        <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DEVELOPER_FEATURES.map((feature) => (
            <FeatureCard
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>

      <div class="mt-12">
        <h2 class="text-xl font-bold text-gray-900">Use Cases</h2>
        <p class="mt-1 text-sm text-gray-500">See how different teams put our platform to work.</p>
        <div class="mt-6 grid gap-6 sm:grid-cols-3">
          {USE_CASES.map((useCase) => (
            <div class="rounded-lg border border-gray-200 bg-white p-6">
              <h3 class="font-semibold text-gray-900">{useCase.title}</h3>
              <p class="mt-2 text-sm text-gray-600">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div class="mt-12 rounded-lg bg-indigo-50 p-8 text-center">
        <h2 class="text-xl font-bold text-gray-900">Ready to Explore?</h2>
        <p class="mx-auto mt-2 max-w-lg text-sm text-gray-600">
          Try every feature free for 14 days. No credit card required.
        </p>
        <div class="mt-4">
          <Button.Root class="rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700">
            Start Free Trial
          </Button.Root>
        </div>
      </div>
    </div>
  )
}
