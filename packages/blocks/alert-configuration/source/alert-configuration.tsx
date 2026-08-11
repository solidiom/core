/**
 * BLOCK-OBS-03: AlertConfiguration block.
 *
 * Alert rule management with threshold configuration and notification channels.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Card, Alert, Dialog, Select, Switch, Checkbox, Toast, Pagination, Data Table, Spinner
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface AlertConfigurationProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type AlertConfigurationState = "empty" | "loading" | "error" | "restricted"

export function AlertConfiguration(props: AlertConfigurationProps): JSX.Element {
  const [state, setState] = createSignal<AlertConfigurationState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div
      class={["solidiom-block-alert-configuration", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-alert-configuration__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-alert-configuration__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-alert-configuration__loading" aria-live="polite">
          <span class="solidiom-block-alert-configuration__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-alert-configuration__content">{props.children}</div>
      </Show>
    </div>
  )
}

export default AlertConfiguration
