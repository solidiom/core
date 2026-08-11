import type { JSX } from "solid-js"
import { A } from "@solidjs/router"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Alert from "@solidiom/alert"
import { StepIndicator } from "../components/StepIndicator"
import { WizardCard } from "../components/WizardCard"

const FEATURES = [
  {
    icon: "🚀",
    title: "Ship faster",
    description:
      "Build production-ready apps with pre-configured tooling and best practices baked in.",
  },
  {
    icon: "🔒",
    title: "Secure by default",
    description: "Authentication, authorization, and data encryption configured out of the box.",
  },
  {
    icon: "📊",
    title: "Built-in analytics",
    description: "Track usage, monitor performance, and make data-driven decisions from day one.",
  },
  {
    icon: "🤝",
    title: "Team collaboration",
    description: "Invite teammates, manage roles, and work together in real time.",
  },
]

export function Welcome(): JSX.Element {
  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50">
      <div class="w-full max-w-lg px-4">
        <StepIndicator currentStep={0} />

        <div class="mb-6 text-center">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">Welcome to Solidiom</h1>
          <p class="mt-2 text-lg text-gray-600">
            The modern platform for building and shipping web applications.
          </p>
        </div>

        <Alert.Root type="info" class="mb-6">
          <Alert.Title class="text-sm font-medium text-blue-800">Quick setup</Alert.Title>
          <Alert.Description class="text-sm text-blue-700">
            This wizard takes about 2 minutes. You can always come back and change your settings
            later.
          </Alert.Description>
        </Alert.Root>

        <WizardCard
          title="What you'll get"
          description="Everything you need to go from idea to production."
        >
          <div class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <Card.Root class="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50">
                  <div class="text-2xl">{feature.icon}</div>
                  <Card.Title class="mt-2 text-sm font-semibold text-gray-900">
                    {feature.title}
                  </Card.Title>
                  <p class="mt-1 text-xs text-gray-600">{feature.description}</p>
                </Card.Root>
              ))}
            </div>

            <div class="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p class="text-sm font-medium text-gray-900">What you'll do</p>
              <ul class="mt-2 space-y-1 text-sm text-gray-600">
                <li>• Create your profile</li>
                <li>• Set up your first project</li>
                <li>• Start using the platform</li>
              </ul>
            </div>

            <div class="flex justify-end">
              <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                <A href="/profile">Get started</A>
              </Button.Root>
            </div>
          </div>
        </WizardCard>

        <p class="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <A href="/sign-in" class="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </A>
        </p>
      </div>
    </div>
  )
}
