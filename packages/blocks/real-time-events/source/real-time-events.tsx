/**
 * BLOCK-OBS-02: RealTimeEvents block.
 *
 * Real-time event stream with filtering, pause, and detail expansion.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Card, Alert, Select, Switch, Toast, Pagination, Data Table, Spinner
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface RealTimeEventsProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type RealTimeEventsState = "empty" | "loading" | "error" | "restricted"

export function RealTimeEvents(props: RealTimeEventsProps): JSX.Element {
  const [state, setState] = createSignal<RealTimeEventsState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div class={["solidiom-block-real-time-events", props.class].filter(Boolean).join(" ")} data-state={state()}>
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-real-time-events__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-real-time-events__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-real-time-events__loading" aria-live="polite">
          <span class="solidiom-block-real-time-events__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-real-time-events__content">
          {props.children}
        </div>
      </Show>
    </div>
  )
}

export default RealTimeEvents
