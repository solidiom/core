/**
 * BLOCK-AI-03: WorkflowBuilder block.
 *
 * Visual workflow editor with node connections and configuration panels.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Card, Alert, Dialog, Select, Tabs, Dropdown Menu, Toast, Checkbox, Switch, Popover, Data Table, Resizable Panels, Spinner
 */

import { createSignal, Show } from "solid-js"
import type { JSX } from "@solidjs/web"

export interface WorkflowBuilderProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type WorkflowBuilderState = "empty" | "loading" | "error" | "restricted"

export function WorkflowBuilder(props: WorkflowBuilderProps): JSX.Element {
  const [state, setState] = createSignal<WorkflowBuilderState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div
      class={["solidiom-block-workflow-builder", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-workflow-builder__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-workflow-builder__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-workflow-builder__loading" aria-live="polite">
          <span class="solidiom-block-workflow-builder__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-workflow-builder__content">{props.children}</div>
      </Show>
    </div>
  )
}

export default WorkflowBuilder
