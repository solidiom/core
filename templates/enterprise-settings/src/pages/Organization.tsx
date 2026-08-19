import { createSignal } from "solid-js"
import type { JSX } from "@solidjs/web"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Input from "@solidiom/input"
import * as Field from "@solidiom/field"
import * as Card from "@solidiom/card"
import * as Alert from "@solidiom/alert"
import { SettingGroup } from "../components/SettingGroup"

const BRAND_COLORS = ["Indigo", "Purple", "Blue", "Green", "Red"]

export function Organization(): JSX.Element {
  const [orgName] = createSignal("Acme Corporation")
  const [industry] = createSignal("Technology")
  const [domain] = createSignal("acme.example.com")
  const [verified] = createSignal(true)

  return (
    <div class="space-y-8">
      <div>
        <Breadcrumb.Root class="mb-2">
          <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" class="hover:text-gray-700">
                Settings
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" current class="text-gray-900 font-medium">
                Organization
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h1 class="text-2xl font-bold text-gray-900">Organization Settings</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage your organization profile, branding, and domain verification.
        </p>
      </div>

      <Alert.Root type="success" class="rounded-md border border-green-200 bg-green-50 p-4">
        <Alert.Title class="text-sm font-medium text-green-800">Profile Updated</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-green-700">
          Your organization profile was last updated 2 days ago.
        </Alert.Description>
      </Alert.Root>

      <SettingGroup
        title="Organization Profile"
        description="Basic information about your organization."
      >
        <div class="space-y-4">
          <Field.Root>
            <Field.Label class="block text-sm font-medium text-gray-700">
              Organization Name
            </Field.Label>
            <Input.Root
              value={orgName()}
              class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Field.Description class="mt-1 text-xs text-gray-500">
              This is how your organization appears to users.
            </Field.Description>
          </Field.Root>

          <Field.Root>
            <Field.Label class="block text-sm font-medium text-gray-700">Industry</Field.Label>
            <select class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option selected>Technology</option>
              <option>Healthcare</option>
              <option>Finance</option>
              <option>Education</option>
              <option>Other</option>
            </select>
          </Field.Root>
        </div>
      </SettingGroup>

      <SettingGroup
        title="Branding"
        description="Customize how your organization looks across the platform."
      >
        <div class="space-y-4">
          <Field.Root>
            <Field.Label class="block text-sm font-medium text-gray-700">Brand Color</Field.Label>
            <select class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              {BRAND_COLORS.map((color) => (
                <option>{color}</option>
              ))}
            </select>
          </Field.Root>

          <Card.Root class="rounded-lg border border-gray-200 bg-white">
            <Card.Header class="border-b border-gray-200 px-4 py-3">
              <Card.Title class="text-sm font-medium text-gray-900">Logo Upload</Card.Title>
            </Card.Header>
            <Card.Content class="px-4 py-4">
              <div class="flex items-center gap-4">
                <div class="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-100 text-lg font-bold text-indigo-600">
                  A
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-700">Current logo</p>
                  <p class="text-xs text-gray-500">PNG, JPG up to 2MB. Recommended 512x512.</p>
                </div>
                <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                  Change
                </Button.Root>
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </SettingGroup>

      <SettingGroup
        title="Domain Verification"
        description="Verify and manage your custom domains."
      >
        <Card.Root class="rounded-lg border border-gray-200 bg-white">
          <Card.Content class="px-4 py-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">{domain()}</p>
                <p class="text-xs text-gray-500">DNS CNAME record required</p>
              </div>
              <span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Verified
              </span>
            </div>
          </Card.Content>
        </Card.Root>
      </SettingGroup>

      <div class="flex justify-end gap-3">
        <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          Cancel
        </Button.Root>
        <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
          Save Changes
        </Button.Root>
      </div>
    </div>
  )
}
