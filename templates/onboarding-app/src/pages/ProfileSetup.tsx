import type { JSX } from "solid-js"
import { A } from "@solidjs/router"
import * as Button from "@solidiom/button"
import * as Input from "@solidiom/input"
import * as Field from "@solidiom/field"
import * as Card from "@solidiom/card"
import { StepIndicator } from "../components/StepIndicator"
import { WizardCard } from "../components/WizardCard"

const ROLES = [
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "manager", label: "Product Manager" },
  { value: "founder", label: "Founder / CEO" },
  { value: "other", label: "Other" },
]

const TIMEZONES = [
  { value: "auto", label: "Automatic (detected)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
]

export function ProfileSetup(): JSX.Element {
  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50">
      <div class="w-full max-w-lg px-4">
        <StepIndicator currentStep={1} />
        <WizardCard title="Profile setup" description="Tell us a bit about yourself.">
          <div class="space-y-4">
            {/* Avatar section */}
            <div class="flex items-center gap-4">
              <div class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 text-2xl text-gray-400">
                👤
              </div>
              <div>
                <Button.Root
                  variant="outline"
                  class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Upload photo
                </Button.Root>
                <p class="mt-1 text-xs text-gray-500">JPG, PNG or GIF. 1MB max.</p>
              </div>
            </div>

            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">
                Display name
              </Field.Label>
              <Input.Root
                placeholder="Jane Doe"
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Field.Description class="mt-1 text-xs text-gray-500">
                This is how your profile will appear to others.
              </Field.Description>
            </Field.Root>

            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">
                Email address
              </Field.Label>
              <Input.Root
                type="email"
                placeholder="jane@example.com"
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </Field.Root>

            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">
                Organization
              </Field.Label>
              <Input.Root
                placeholder="Acme Inc."
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Field.Description class="mt-1 text-xs text-gray-500">
                Your company or team name. Optional.
              </Field.Description>
            </Field.Root>

            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">Role</Field.Label>
              <div class="relative mt-1">
                <select class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  {ROLES.map((role) => (
                    <option value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              <Field.Description class="mt-1 text-xs text-gray-500">
                Helps us tailor the onboarding experience to your needs.
              </Field.Description>
            </Field.Root>

            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">Timezone</Field.Label>
              <div class="relative mt-1">
                <select class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  {TIMEZONES.map((tz) => (
                    <option value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>
            </Field.Root>

            {/* Preferences section */}
            <Card.Root class="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <Card.Title class="text-sm font-medium text-gray-900">Preferences</Card.Title>
              <div class="mt-3 space-y-3">
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm text-gray-700">Receive product update emails</span>
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm text-gray-700">Enable notifications for team activity</span>
                </label>
              </div>
            </Card.Root>

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
