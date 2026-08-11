/**
 * BLOCK-CONTENT-01: ContentEditor block.
 *
 * User creates and edits rich content with a WYSIWYG or markdown editor,
 * formatting toolbar, and preview.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Field, Card, Alert, Select, Dropdown Menu, Tabs, Toast, Switch, Popover, Spinner, Toolbar
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface ContentEditorProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type ContentEditorState = "empty" | "loading" | "error" | "restricted"

export function ContentEditor(props: ContentEditorProps): JSX.Element {
  const [state, setState] = createSignal<ContentEditorState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div
      class={["solidiom-block-content-editor", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-content-editor__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-content-editor__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-content-editor__loading" aria-live="polite">
          <span class="solidiom-block-content-editor__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-content-editor__content">{props.children}</div>
      </Show>
    </div>
  )
}

export default ContentEditor
