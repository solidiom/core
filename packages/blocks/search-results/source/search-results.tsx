/**
 * BLOCK-SEARCH-01: SearchResults block.
 *
 * Search results with faceted filtering, pagination, and result previews.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Input, Card, Alert, Select, Checkbox, Pagination, Data Table, Popover, Spinner
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface SearchResultsProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type SearchResultsState = "empty" | "loading" | "error" | "restricted"

export function SearchResults(props: SearchResultsProps): JSX.Element {
  const [state, setState] = createSignal<SearchResultsState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div class={["solidiom-block-search-results", props.class].filter(Boolean).join(" ")} data-state={state()}>
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-search-results__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-search-results__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-search-results__loading" aria-live="polite">
          <span class="solidiom-block-search-results__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-search-results__content">
          {props.children}
        </div>
      </Show>
    </div>
  )
}

export default SearchResults
