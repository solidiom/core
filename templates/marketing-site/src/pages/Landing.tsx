import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Alert from "@solidiom/alert"

const STATS = [
  { value: "10K+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "150+", label: "Integrations" },
  { value: "24/7", label: "Support" },
]

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "CTO, TechCorp", text: "This platform transformed how our team collaborates. The productivity gains were immediate." },
  { name: "Marcus Johnson", role: "Product Lead, StartupXYZ", text: "The best developer experience we've encountered. Setup took minutes, not days." },
]

export function Landing(): JSX.Element {
  return (
    <div>
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" current>Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="mt-12 text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Build Faster, Ship Smarter
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          The modern platform for teams who want to move fast without breaking things.
          Streamline your workflow, collaborate seamlessly, and deliver exceptional products.
        </p>
        <div class="mt-8 flex items-center justify-center gap-4">
          <Button.Root class="rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700">
            Start Free Trial
          </Button.Root>
          <Button.Root class="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Watch Demo
          </Button.Root>
        </div>
      </div>

      <div class="mt-16 grid grid-cols-2 gap-8 rounded-lg border border-gray-200 bg-white p-8 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div class="text-center">
            <div class="text-3xl font-bold text-indigo-600">{stat.value}</div>
            <div class="mt-1 text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900">What Our Customers Say</h2>
        <div class="mt-6 grid gap-6 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <Alert.Root type="info" class="bg-white">
              <Alert.Description>
                <p class="text-gray-600">"{t.text}"</p>
                <div class="mt-4">
                  <div class="font-medium text-gray-900">{t.name}</div>
                  <div class="text-sm text-gray-500">{t.role}</div>
                </div>
              </Alert.Description>
            </Alert.Root>
          ))}
        </div>
      </div>
    </div>
  )
}
