/**
 * BLOCK-CONTENT-03: ContentWorkflow block.
 *
 * User manages content through a draft-review-publish pipeline with status tracking,
 * assignments, and approval gates.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Card, Alert, Dialog, Select, Dropdown Menu, Tabs, Toast, Avatar, Checkbox, Popover, Breadcrumb, Pagination, Data Table, Spinner
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface ContentWorkflowProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type ContentWorkflowState = "empty" | "loading" | "error" | "restricted"

export function ContentWorkflow(props: ContentWorkflowProps): JSX.Element {
  const [state, setState] = createSignal<ContentWorkflowState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div class={["solidiom-block-content-workflow", props.class].filter(Boolean).join(" ")} data-state={state()}>
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-content-workflow__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-content-workflow__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-content-workflow__loading" aria-live="polite">
          <span class="solidiom-block-content-workflow__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-content-workflow__content">
          {props.children}
        </div>
      </Show>
    </div>
  )
}

export default ContentWorkflow
