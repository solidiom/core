/**
 * BLOCK-SETTINGS-02: Notification Preferences block.
 *
 * Channel and category notification settings with granular toggles.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Field, Card, Tabs, Checkbox, Radio Group, Switch, Pagination, Spinner
 */

import { createSignal, Show, For, type JSX } from "solid-js"

export interface NotificationChannel {
  id: string
  label: string
  enabled: boolean
}

export interface NotificationCategory {
  id: string
  label: string
  description: string
  channels: NotificationChannel[]
}

export interface NotificationPreferencesProps {
  categories?: NotificationCategory[]
  onToggleChannel?: (categoryId: string, channelId: string, enabled: boolean) => Promise<void>
  onSaveAll?: () => Promise<void>
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
}

export type NotificationPreferencesState = "empty" | "loading" | "error" | "restricted"

export function NotificationPreferences(props: NotificationPreferencesProps): JSX.Element {
  const [state, setState] = createSignal<NotificationPreferencesState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()
  const categories = () => props.categories ?? []

  async function handleToggle(categoryId: string, channelId: string, enabled: boolean) {
    setLocalError("")
    setState("loading")
    try {
      await props.onToggleChannel?.(categoryId, channelId, enabled)
      setState("empty")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Update failed.")
      setState("error")
    }
  }

  async function handleSave() {
    setLocalError("")
    setState("loading")
    try {
      await props.onSaveAll?.()
      setState("empty")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Save failed.")
      setState("error")
    }
  }

  return (
    <div class={["solidiom-block-notification-preferences", props.class].filter(Boolean).join(" ")} data-state={state()}>
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-notification-preferences__restricted" role="alert">
          <p>{props.restrictedReason || "Notification preferences are restricted."}</p>
        </div>
      </Show>
      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-notification-preferences__error" role="alert"><p>{currentError()}</p></div>
      </Show>
      <Show when={state() !== "restricted"}>
        <Show when={categories().length === 0}>
          <div class="solidiom-block-notification-preferences__empty"><p>No notification categories configured.</p></div>
        </Show>
        <div class="solidiom-block-notification-preferences__categories">
          <For each={categories()}>
            {(cat) => (
              <div class="solidiom-block-notification-preferences__category">
                <h3>{cat.label}</h3>
                <p>{cat.description}</p>
                <div class="solidiom-block-notification-preferences__channels">
                  <For each={cat.channels}>
                    {(ch) => (
                      <label class="solidiom-block-notification-preferences__toggle">
                        <input type="checkbox" checked={ch.enabled} onChange={(e) => handleToggle(cat.id, ch.id, e.currentTarget.checked)} disabled={state() === "loading"} />
                        {ch.label}
                      </label>
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>
        </div>
        <Show when={categories().length > 0}>
          <button type="button" class="solidiom-block-notification-preferences__save" onClick={handleSave} disabled={state() === "loading"}>
            <Show when={state() === "loading"} fallback="Save Preferences">Saving...</Show>
          </button>
        </Show>
      </Show>
    </div>
  )
}

export default NotificationPreferences
