import type { JSX } from "solid-js"
import { A } from "@solidjs/router"
import * as Button from "@solidiom/button"
import * as Input from "@solidiom/input"
import * as Field from "@solidiom/field"
import { StepIndicator, WizardCard } from "../components/StepIndicator"

export function ProfileSetup(): JSX.Element {
  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50">
      <div class="w-full max-w-lg px-4">
        <StepIndicator currentStep={1} />
        <WizardCard title="Profile setup" description="Tell us a bit about yourself.">
          <div class="space-y-4">
            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">Display name</Field.Label>
              <Input.Root placeholder="Jane Doe" class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </Field.Root>
            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">Role</Field.Label>
              <Input.Root placeholder="Software Engineer" class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </Field.Root>
            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">Company</Field.Label>
              <Input.Root placeholder="Acme Inc." class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              <Field.Description class="mt-1 text-xs text-gray-500">Optional, but helps us personalize your experience.</Field.Description>
            </Field.Root>
            <div class="flex justify-between">
              <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <A href="/">Back</A>
              </Button.Root>
              <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                <A href="/project">Continue</A>
              </Button.Root>
            </div>
          </div>
        </WizardCard>
      </div>
    </div>
  )
}
