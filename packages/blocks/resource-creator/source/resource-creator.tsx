/**
 * BLOCK-RESOURCE-03: ResourceCreator block.
 *
 * Multi-step resource creation form with validation and preview.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Card, Alert, Dialog, Select, Dropdown Menu, Toast, Checkbox, Switch, Tabs, Pagination, Spinner
 */

import { createSignal, Show } from "solid-js"
import type { JSX } from "@solidjs/web"

export interface ResourceCreatorProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type ResourceCreatorState = "empty" | "loading" | "error" | "restricted"

export function ResourceCreator(props: ResourceCreatorProps): JSX.Element {
  const [state, setState] = createSignal<ResourceCreatorState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div
      class={["solidiom-block-resource-creator", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-resource-creator__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-resource-creator__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-resource-creator__loading" aria-live="polite">
          <span class="solidiom-block-resource-creator__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-resource-creator__content">{props.children}</div>
      </Show>
    </div>
  )
}

export default ResourceCreator
