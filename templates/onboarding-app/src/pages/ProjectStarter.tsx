import type { JSX } from "@solidjs/web"
import { A } from "@solidjs/router"
import * as Button from "@solidiom/button"
import * as Input from "@solidiom/input"
import * as Field from "@solidiom/field"
import * as Card from "@solidiom/card"
import { StepIndicator } from "../components/StepIndicator"
import { WizardCard } from "../components/WizardCard"

const TEMPLATES = [
  { name: "Blank Project", description: "Start from scratch with a clean slate.", icon: "📄" },
  {
    name: "SaaS Dashboard",
    description: "Pre-built with charts, tables, and settings.",
    icon: "📊",
  },
  { name: "E-commerce", description: "Product catalog, cart, and checkout flows.", icon: "🛒" },
  {
    name: "Blog / CMS",
    description: "Content management with markdown and media support.",
    icon: "✍️",
  },
]

export function ProjectStarter(): JSX.Element {
  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50">
      <div class="w-full max-w-lg px-4">
        <StepIndicator currentStep={2} />
        <WizardCard
          title="Create your first project"
          description="Choose a template to get started quickly."
        >
          <div class="space-y-4">
            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">
                Project name
              </Field.Label>
              <Input.Root
                placeholder="my-awesome-project"
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Field.Description class="mt-1 text-xs text-gray-500">
                Choose a name that describes your project. You can change it later.
              </Field.Description>
            </Field.Root>

            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">Description</Field.Label>
              <textarea
                placeholder="A brief description of what you're building..."
                rows={3}
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Field.Description class="mt-1 text-xs text-gray-500">
                Optional. Helps your team understand the project's purpose.
              </Field.Description>
            </Field.Root>

            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-700">Template</p>
              <div class="grid gap-3 sm:grid-cols-2">
                {TEMPLATES.map((t) => (
                  <label class="flex cursor-pointer flex-col gap-1 rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
                    <input type="radio" name="template" class="sr-only" />
                    <span class="text-xl">{t.icon}</span>
                    <p class="text-sm font-medium text-gray-900">{t.name}</p>
                    <p class="text-xs text-gray-500">{t.description}</p>
                  </label>
                ))}
              </div>
            </div>

            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">Visibility</Field.Label>
              <div class="mt-1 flex gap-4">
                <label class="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    defaultChecked
                    class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm text-gray-700">Private</span>
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm text-gray-700">Public</span>
                </label>
              </div>
              <Field.Description class="mt-1 text-xs text-gray-500">
                Private projects are only visible to you and invited team members.
              </Field.Description>
            </Field.Root>

            <Card.Root class="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <Card.Title class="text-sm font-medium text-gray-900">Invite team members</Card.Title>
              <p class="mt-1 text-xs text-gray-500">
                You can add teammates now or later from project settings.
              </p>
              <div class="mt-3 flex gap-2">
                <Input.Root
                  placeholder="colleague@example.com"
                  class="block min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <Button.Root
                  variant="outline"
                  class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Invite
                </Button.Root>
              </div>
            </Card.Root>

            <div class="flex justify-between">
              <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <A href="/profile">Back</A>
              </Button.Root>
              <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                Create project
              </Button.Root>
            </div>
          </div>
        </WizardCard>
      </div>
    </div>
  )
}
