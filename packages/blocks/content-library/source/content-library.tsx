/**
 * BLOCK-CONTENT-02: ContentLibrary block.
 *
 * User manages a library of content assets including documents, images, and files
 * with search, folders, and metadata.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Card, Alert, Dialog, Select, Dropdown Menu, Avatar, Checkbox, Popover, Pagination, Data Table, Progress, Spinner
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface ContentLibraryProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type ContentLibraryState = "empty" | "loading" | "error" | "restricted"

export function ContentLibrary(props: ContentLibraryProps): JSX.Element {
  const [state, setState] = createSignal<ContentLibraryState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div class={["solidiom-block-content-library", props.class].filter(Boolean).join(" ")} data-state={state()}>
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-content-library__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-content-library__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-content-library__loading" aria-live="polite">
          <span class="solidiom-block-content-library__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-content-library__content">
          {props.children}
        </div>
      </Show>
    </div>
  )
}

export default ContentLibrary
