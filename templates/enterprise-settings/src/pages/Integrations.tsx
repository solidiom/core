import { createSignal } from "solid-js"
import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Alert from "@solidiom/alert"
import * as Switch from "@solidiom/switch"
import { SettingGroup } from "../components/SettingGroup"

const INTEGRATIONS = [
  { name: "SCIM Provisioning", description: "Automate user provisioning and de-provisioning via SCIM 2.0.", enabled: true, provider: "Okta" },
  { name: "SAML 2.0", description: "Configure SAML identity provider for single sign-on.", enabled: true, provider: "Azure AD" },
  { name: "Directory Sync", description: "Sync groups and roles from your LDAP directory.", enabled: false, provider: "Microsoft AD" },
  { name: "Webhook Endpoint", description: "Send event notifications to your custom webhook URL.", enabled: true, provider: "Custom" },
]

export function Integrations(): JSX.Element {
  const [items, setItems] = createSignal(INTEGRATIONS)

  const toggleIntegration = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, enabled: !item.enabled } : item)),
    )
  }

  return (
    <div class="space-y-8">
      <div>
        <Breadcrumb.Root class="mb-2">
          <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" class="hover:text-gray-700">Settings</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/integrations" current class="text-gray-900 font-medium">Integrations</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Integrations</h1>
            <p class="mt-1 text-sm text-gray-500">Manage SCIM provisioning, SAML, directory sync, and webhook configurations.</p>
          </div>
        </div>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Integration Updates</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          SCIM provisioning has been successfully syncing for the past 30 days. Last sync: 4 hours ago.
        </Alert.Description>
      </Alert.Root>

      <SettingGroup title="Active Integrations" description="Configure and manage your third-party service integrations.">
        <div class="space-y-4">
          {items().map((integration, index) => (
            <Card.Root class="rounded-lg border border-gray-200 bg-white">
              <Card.Content class="px-4 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600">
                      {integration.name.charAt(0)}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{integration.name}</p>
                      <p class="text-xs text-gray-500">{integration.description}</p>
                      <p class="mt-0.5 text-xs text-gray-400">Provider: {integration.provider}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      integration.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {integration.enabled ? "Connected" : "Disconnected"}
                    </span>
                    <Switch.Root
                      checked={() => integration.enabled}
                      onCheckedChange={() => toggleIntegration(index)}
                      class="inline-flex h-6 w-11 items-center rounded-full border-transparent bg-gray-200 transition-colors data-[state=checked]:bg-indigo-600"
                    >
                      <Switch.Thumb class="inline-block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-5" />
                    </Switch.Root>
                  </div>
                </div>
              </Card.Content>
            </Card.Root>
          ))}
        </div>
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
