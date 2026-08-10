import type { JSX } from "solid-js"
import { A } from "@solidjs/router"
import * as Button from "@solidiom/button"
import * as Input from "@solidiom/input"
import * as Field from "@solidiom/field"
import * as Card from "@solidiom/card"
import { StepIndicator, WizardCard } from "../components/StepIndicator"

const TEMPLATES = [
  { name: "Blank Project", description: "Start from scratch with a clean slate." },
  { name: "SaaS Dashboard", description: "Pre-built with charts, tables, and settings." },
  { name: "E-commerce", description: "Product catalog, cart, and checkout flows." },
]

export function ProjectStarter(): JSX.Element {
  return (
    <div class="flex min-h-screen items-center justify-center bg-gray-50">
      <div class="w-full max-w-lg px-4">
        <StepIndicator currentStep={2} />
        <WizardCard title="Create your first project" description="Choose a template to get started quickly.">
          <div class="space-y-4">
            <Field.Root>
              <Field.Label class="block text-sm font-medium text-gray-700">Project name</Field.Label>
              <Input.Root placeholder="my-awesome-project" class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </Field.Root>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-700">Template</p>
              {TEMPLATES.map((t) => (
                <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
                  <input type="radio" name="template" class="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500" />
                  <div>
                    <p class="text-sm font-medium text-gray-900">{t.name}</p>
                    <p class="text-xs text-gray-500">{t.description}</p>
                  </div>
                </label>
              ))}
            </div>
            <div class="flex justify-between">
              <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <A href="/profile">Back</A>
              </Button.Root>
              <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                Create project
              </Button.Root>
            </div>
          </div>
        </WizardCard>
      </div>
    </div>
  )
}
