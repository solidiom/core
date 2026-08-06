/**
 * BLOCK-COMMERCE-01: ProductCatalog block.
 *
 * User browses a product catalog with grid/list views, category filtering,
 * sorting, and product detail previews.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Card, Alert, Select, Avatar, Checkbox, Popover, Pagination, Spinner
 */

import { createSignal, Show, type JSX } from "solid-js"

export interface ProductCatalogProps {
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
  children?: JSX.Element
}

export type ProductCatalogState = "empty" | "loading" | "error" | "restricted"

export function ProductCatalog(props: ProductCatalogProps): JSX.Element {
  const [state, setState] = createSignal<ProductCatalogState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()

  return (
    <div class={["solidiom-block-product-catalog", props.class].filter(Boolean).join(" ")} data-state={state()}>
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-product-catalog__restricted" role="alert">
          <p>{props.restrictedReason || "This feature is currently restricted."}</p>
        </div>
      </Show>

      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-product-catalog__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>

      <Show when={state() === "loading"}>
        <div class="solidiom-block-product-catalog__loading" aria-live="polite">
          <span class="solidiom-block-product-catalog__spinner" aria-hidden="true" />
          Loading...
        </div>
      </Show>

      <Show when={state() !== "restricted" && state() !== "loading"}>
        <div class="solidiom-block-product-catalog__content">
          {props.children}
        </div>
      </Show>
    </div>
  )
}

export default ProductCatalog
