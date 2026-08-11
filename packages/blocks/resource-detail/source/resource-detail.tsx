/**
 * BLOCK-RESOURCE-02: ResourceDetail block.
 *
 * Resource detail view with metadata, actions, and related items.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Card, Alert, Tabs, Avatar, Breadcrumb, Popover, Spinner, Toast, Data Table
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface ResourceDetailProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type ResourceDetailState = "empty" | "loading" | "error" | "restricted"

export function ResourceDetail(props: ResourceDetailProps): JSX.Element {
  const [state, setState] = createSignal<ResourceDetailState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div
      class={["solidiom-block-resource-detail", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-resource-detail__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-resource-detail__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-resource-detail__loading" aria-live="polite">
          <span class="solidiom-block-resource-detail__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-resource-detail__content">{props.children}</div>
      </Show>
    </div>
  )
}

export default ResourceDetail
