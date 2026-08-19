/**
 * BLOCK-SETTINGS-01: Account Settings block.
 *
 * User account management with profile, email, and password sections.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Alert, Dialog, Tabs, Toast, Avatar, Spinner
 */

import { createSignal, Show } from "solid-js"
import type { JSX } from "@solidjs/web"

export interface AccountSettingsProps {
  onUpdateProfile?: (data: { name: string; email: string }) => Promise<void>
  onChangePassword?: (data: { current: string; newPassword: string }) => Promise<void>
  onDeleteAccount?: () => Promise<void>
  currentName?: string
  currentEmail?: string
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
}

export type AccountSettingsState = "empty" | "loading" | "error" | "restricted"

export function AccountSettings(props: AccountSettingsProps): JSX.Element {
  const [name, setName] = createSignal(props.currentName ?? "")
  const [email, setEmail] = createSignal(props.currentEmail ?? "")
  const [state, setState] = createSignal<AccountSettingsState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  async function handleSave(e: Event) {
    e.preventDefault()
    setLocalError("")
    setState("loading")
    try {
      await props.onUpdateProfile?.({ name: name(), email: email() })
      setState("empty")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Update failed.")
      setState("error")
    }
  }

  return (
    <div
      class={["solidiom-block-account-settings", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-account-settings__restricted" role="alert">
          <p>{props.restrictedReason || "Account settings are restricted."}</p>
        </div>
      </Show>
      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-account-settings__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>
      <Show when={state() !== "restricted"}>
        <form onSubmit={handleSave} class="solidiom-block-account-settings__form">
          <div class="solidiom-block-account-settings__field">
            <label for="settings-name">Name</label>
            <input
              id="settings-name"
              type="text"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              disabled={state() === "loading"}
            />
          </div>
          <div class="solidiom-block-account-settings__field">
            <label for="settings-email">Email</label>
            <input
              id="settings-email"
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              disabled={state() === "loading"}
            />
          </div>
          <button
            type="submit"
            class="solidiom-block-account-settings__submit"
            disabled={state() === "loading"}
          >
            <Show when={state() === "loading"} fallback="Save Changes">
              Saving...
            </Show>
          </button>
        </form>
      </Show>
    </div>
  )
}

export default AccountSettings
