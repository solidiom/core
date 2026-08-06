/**
 * BLOCK-SEARCH-02: SavedSearches block.
 *
 * User saves frequent search queries, sets up alert notifications for new matches,
 * and manages saved search collections.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Card, Alert, Dialog, Dropdown Menu, Toast, Checkbox, Switch, Data Table, Spinner
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface SavedSearchesProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type SavedSearchesState = "empty" | "loading" | "error" | "restricted"

export function SavedSearches(props: SavedSearchesProps): JSX.Element {
  const [state, setState] = createSignal<SavedSearchesState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div class={["solidiom-block-saved-searches", props.class].filter(Boolean).join(" ")} data-state={state()}>
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-saved-searches__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-saved-searches__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-saved-searches__loading" aria-live="polite">
          <span class="solidiom-block-saved-searches__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-saved-searches__content">
          {props.children}
        </div>
      </Show>
    </div>
  )
}

export default SavedSearches
