/**
 * BLOCK-SETTINGS-03: Danger Zone block.
 *
 * Destructive account actions with confirmation dialogs.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Card, Alert, Dialog, Toast, Progress, Spinner
 */

import { createSignal, Show } from "solid-js"
import type { JSX } from "@solidjs/web"

export interface DangerZoneProps {
  onDeleteAccount?: () => Promise<void>
  onExportData?: () => Promise<void>
  onDeactivate?: () => Promise<void>
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
}

export type DangerZoneState = "empty" | "loading" | "error" | "restricted"

export function DangerZone(props: DangerZoneProps): JSX.Element {
  const [state, setState] = createSignal<DangerZoneState>(props.restricted ? "restricted" : "empty")
  const [localError, setLocalError] = createSignal("")
  const [confirmAction, setConfirmAction] = createSignal<string | null>(null)

  const currentError = () => props.error || localError()

  async function handleAction(action: () => Promise<void> | undefined, label: string) {
    if (confirmAction() !== label) {
      setConfirmAction(label)
      return
    }
    setConfirmAction(null)
    setLocalError("")
    setState("loading")
    try {
      await action?.()
      setState("empty")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : `${label} failed.`)
      setState("error")
    }
  }

  return (
    <div
      class={["solidiom-block-danger-zone", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-danger-zone__restricted" role="alert">
          <p>{props.restrictedReason || "These actions are restricted."}</p>
        </div>
      </Show>
      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-danger-zone__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>
      <Show when={state() !== "restricted"}>
        <div class="solidiom-block-danger-zone__actions">
          <div class="solidiom-block-danger-zone__action">
            <div>
              <h3>Export Data</h3>
              <p>Download all your data as a ZIP archive.</p>
            </div>
            <button
              type="button"
              onClick={() => handleAction(() => props.onExportData?.(), "export")}
              disabled={state() === "loading"}
            >
              {confirmAction() === "export" ? "Confirm Export" : "Export Data"}
            </button>
          </div>
          <div class="solidiom-block-danger-zone__action">
            <div>
              <h3>Deactivate Account</h3>
              <p>Temporarily disable your account. You can reactivate later.</p>
            </div>
            <button
              type="button"
              onClick={() => handleAction(() => props.onDeactivate?.(), "deactivate")}
              disabled={state() === "loading"}
            >
              {confirmAction() === "deactivate" ? "Confirm Deactivation" : "Deactivate"}
            </button>
          </div>
          <div class="solidiom-block-danger-zone__action solidiom-block-danger-zone__action--destructive">
            <div>
              <h3>Delete Account</h3>
              <p>Permanently delete your account and all data. This cannot be undone.</p>
            </div>
            <button
              type="button"
              onClick={() => handleAction(() => props.onDeleteAccount?.(), "delete")}
              disabled={state() === "loading"}
            >
              {confirmAction() === "delete" ? "Confirm Deletion" : "Delete Account"}
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default DangerZone
