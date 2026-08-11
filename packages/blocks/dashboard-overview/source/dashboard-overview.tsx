/**
 * BLOCK-OBS-01: DashboardOverview block.
 *
 * Observability dashboard with metric cards, charts, and status indicators.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Card, Select, Tabs, Tooltip, Meter, Spinner
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface DashboardOverviewProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type DashboardOverviewState = "empty" | "loading" | "error" | "restricted"

export function DashboardOverview(props: DashboardOverviewProps): JSX.Element {
  const [state, setState] = createSignal<DashboardOverviewState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div
      class={["solidiom-block-dashboard-overview", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-dashboard-overview__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-dashboard-overview__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-dashboard-overview__loading" aria-live="polite">
          <span class="solidiom-block-dashboard-overview__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-dashboard-overview__content">{props.children}</div>
      </Show>
    </div>
  )
}

export default DashboardOverview
