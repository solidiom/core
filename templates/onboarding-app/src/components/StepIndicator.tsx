import type { JSX } from "solid-js"
import * as Card from "@solidiom/card"
import * as Progress from "@solidiom/progress"

const STEPS = ["Welcome", "Profile", "Project"]

export function StepIndicator(props: { currentStep: number }): JSX.Element {
  const progressValue = ((props.currentStep) / STEPS.length) * 100

  return (
    <div class="mb-8">
      <div class="mb-4 flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div class="flex items-center">
            <div
              class={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                index < props.currentStep
                  ? "bg-indigo-600 text-white"
                  : index === props.currentStep
                    ? "border-2 border-indigo-600 text-indigo-600"
                    : "border-2 border-gray-300 text-gray-400"
              }`}
            >
              {index < props.currentStep ? "✓" : index + 1}
            </div>
            <span
              class={`ml-2 text-sm ${
                index <= props.currentStep ? "font-medium text-gray-900" : "text-gray-400"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
      <Progress.Root value={progressValue} aria-label="Onboarding progress" class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <Progress.Indicator class="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${progressValue}%` }} />
      </Progress.Root>
    </div>
  )
}

export function WizardCard(props: { title: string; description: string; children: JSX.Element }): JSX.Element {
  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white shadow-sm">
      <Card.Header class="border-b border-gray-200 px-6 py-4">
        <Card.Title class="text-lg font-semibold text-gray-900">{props.title}</Card.Title>
        <p class="mt-1 text-sm text-gray-500">{props.description}</p>
      </Card.Header>
      <Card.Content class="px-6 py-6">{props.children}</Card.Content>
    </Card.Root>
  )
}
