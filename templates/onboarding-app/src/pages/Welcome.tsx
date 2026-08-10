import type { JSX } from "solid-js"
import { A } from "@solidjs/router"
import * as Button from "@solidiom/button"
import { StepIndicator } from "../components/StepIndicator"
import { WizardCard } from "../components/WizardCard"

export function Welcome(): JSX.Element {
  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50">
      <div class="w-full max-w-lg px-4">
        <StepIndicator currentStep={0} />
        <WizardCard title="Welcome!" description="Let's get you set up in a few quick steps.">
          <div class="space-y-4">
            <div class="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p class="text-sm font-medium text-gray-900">What you'll do</p>
              <ul class="mt-2 space-y-1 text-sm text-gray-600">
                <li>• Create your profile</li>
                <li>• Set up your first project</li>
                <li>• Start using the platform</li>
              </ul>
            </div>
            <div class="flex justify-end">
              <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                <A href="/profile">Get started</A>
              </Button.Root>
            </div>
          </div>
        </WizardCard>
      </div>
    </div>
  )
}
