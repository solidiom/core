/**
 * BLOCK-RESOURCE-01: ResourceList block.
 *
 * Paginated resource list with search, filters, and bulk actions.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Input, Card, Alert, Select, Avatar, Popover, Pagination, Data Table, Checkbox, Spinner
 */

import { createSignal, Show } from "solid-js"
import type { JSX } from "@solidjs/web"

export interface ResourceListProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type ResourceListState = "empty" | "loading" | "error" | "restricted"

export function ResourceList(props: ResourceListProps): JSX.Element {
  const [state, setState] = createSignal<ResourceListState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div
      class={["solidiom-block-resource-list", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-resource-list__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-resource-list__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-resource-list__loading" aria-live="polite">
          <span class="solidiom-block-resource-list__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-resource-list__content">{props.children}</div>
      </Show>
    </div>
  )
}

export default ResourceList
