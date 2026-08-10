import { createSignal } from "solid-js"
import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Card from "@solidiom/card"
import * as Alert from "@solidiom/alert"
import * as Switch from "@solidiom/switch"
import { SettingGroup } from "../components/SettingGroup"
import { ToggleRow } from "../components/ToggleRow"

export function Security(): JSX.Element {
  const [ssoEnabled, setSsoEnabled] = createSignal(true)
  const [mfaRequired, setMfaRequired] = createSignal(false)
  const [sessionTimeout] = createSignal("30 minutes")
  const [ipRestriction, setIpRestriction] = createSignal(false)

  const IP_RANGES = ["192.168.1.0/24", "10.0.0.0/8", "172.16.0.0/12"]

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
              <Breadcrumb.Link href="/security" current class="text-gray-900 font-medium">Security</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <h1 class="text-2xl font-bold text-gray-900">Security Settings</h1>
        <p class="mt-1 text-sm text-gray-500">Configure SSO, MFA enforcement, session policies, and IP allowlists.</p>
      </div>

      <Alert.Root type="warning" class="rounded-md border border-yellow-200 bg-yellow-50 p-4">
        <Alert.Title class="text-sm font-medium text-yellow-800">Security Recommendation</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-yellow-700">
          Multi-factor authentication is not required for all users. Enabling it significantly improves account security.
        </Alert.Description>
      </Alert.Root>

      <SettingGroup title="Single Sign-On (SSO)" description="Configure identity provider for centralized authentication.">
        <div class="space-y-4">
          <ToggleRow
            label="Enable SSO"
            description="Allow users to sign in with their identity provider."
            checked={ssoEnabled()}
            onCheckedChange={setSsoEnabled}
          />
          <Card.Root class="rounded-lg border border-gray-200 bg-white">
            <Card.Content class="px-4 py-4">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Identity Provider URL</label>
                  <input type="text" value="https://idp.example.com/saml" class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500" readOnly />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Entity ID</label>
                  <input type="text" value="urn:acme:sso:entity" class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500" readOnly />
                </div>
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </SettingGroup>

      <SettingGroup title="Multi-Factor Authentication" description="Require additional verification for user sign-ins.">
        <ToggleRow
          label="Require MFA for all users"
          description="All users must enable a second factor before accessing the platform."
          checked={mfaRequired()}
          onCheckedChange={setMfaRequired}
        />
      </SettingGroup>

      <SettingGroup title="Session Policies" description="Control how long user sessions remain active.">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Session Timeout</label>
            <select class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option>15 minutes</option>
              <option selected>30 minutes</option>
              <option>1 hour</option>
              <option>4 hours</option>
              <option>Never</option>
            </select>
          </div>
        </div>
      </SettingGroup>

      <SettingGroup title="IP Allowlist" description="Restrict access to specific IP ranges.">
        <div class="space-y-4">
          <ToggleRow
            label="Enable IP restriction"
            description="Only allow access from the IP ranges listed below."
            checked={ipRestriction()}
            onCheckedChange={setIpRestriction}
          />
          <div class="space-y-2">
            {IP_RANGES.map((range) => (
              <div class="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2">
                <span class="text-sm font-mono text-gray-700">{range}</span>
                <Button.Root class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                  Remove
                </Button.Root>
              </div>
            ))}
            <Button.Root class="inline-flex items-center rounded-md border border-dashed border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
              + Add IP Range
            </Button.Root>
          </div>
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
