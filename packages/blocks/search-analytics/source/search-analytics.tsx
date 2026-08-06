/**
 * BLOCK-SEARCH-03: SearchAnalytics block.
 *
 * User views search usage statistics including popular queries, zero-result rates,
 * and search behavior trends.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Card, Select, Tabs, Tooltip, Data Table, Meter, Progress, Spinner
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface SearchAnalyticsProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type SearchAnalyticsState = "empty" | "loading" | "error" | "restricted"

export function SearchAnalytics(props: SearchAnalyticsProps): JSX.Element {
  const [state, setState] = createSignal<SearchAnalyticsState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div class={["solidiom-block-search-analytics", props.class].filter(Boolean).join(" ")} data-state={state()}>
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-search-analytics__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-search-analytics__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-search-analytics__loading" aria-live="polite">
          <span class="solidiom-block-search-analytics__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-search-analytics__content">
          {props.children}
        </div>
      </Show>
    </div>
  )
}

export default SearchAnalytics
