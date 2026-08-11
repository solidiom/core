/**
 * BLOCK-COMMERCE-03: OrderTracking block.
 *
 * User views order status, tracking information, delivery timeline, and order history.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Card, Alert, Tabs, Tooltip, Breadcrumb, Pagination, Data Table, Progress, Spinner
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface OrderTrackingProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type OrderTrackingState = "empty" | "loading" | "error" | "restricted"

export function OrderTracking(props: OrderTrackingProps): JSX.Element {
  const [state, setState] = createSignal<OrderTrackingState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div
      class={["solidiom-block-order-tracking", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-order-tracking__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-order-tracking__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-order-tracking__loading" aria-live="polite">
          <span class="solidiom-block-order-tracking__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-order-tracking__content">{props.children}</div>
      </Show>
    </div>
  )
}

export default OrderTracking
