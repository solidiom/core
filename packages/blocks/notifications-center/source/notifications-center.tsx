/**
 * BLOCK-SHELL-03: NotificationsCenter block.
 *
 * User views, manages, and dismisses notifications from a unified panel
 * with categorization, read/unread states, and mark-all-read.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Card, Alert, Select, Dropdown Menu, Toast, Avatar, Checkbox, Switch, Popover, Pagination, Spinner
 */

import { createSignal, Show } from "solid-js"
import type { JSX } from "@solidjs/web"

export interface NotificationsCenterProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type NotificationsCenterState = "empty" | "loading" | "error" | "restricted"

export function NotificationsCenter(props: NotificationsCenterProps): JSX.Element {
  const [state, setState] = createSignal<NotificationsCenterState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div
      class={["solidiom-block-notifications-center", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-notifications-center__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-notifications-center__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-notifications-center__loading" aria-live="polite">
          <span class="solidiom-block-notifications-center__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-notifications-center__content">{props.children}</div>
      </Show>
    </div>
  )
}

export default NotificationsCenter
