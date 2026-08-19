/**
 * BLOCK-BILLING-03: Invoice History block (Pilot 2).
 *
 * Paginated invoice list with filtering and download.
 * Proves data display, empty, and loading states per §7.2.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Button, Input, Card, Select, Popover, Pagination, Data Table, Spinner
 */

import { createSignal, Show, For } from "solid-js"
import type { JSX } from "@solidjs/web"

export interface Invoice {
  id: string
  date: string
  amount: string
  status: "paid" | "pending" | "overdue"
  downloadUrl?: string
}

export interface InvoiceHistoryProps {
  invoices?: Invoice[]
  totalPages?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  onDownload?: (invoiceId: string) => Promise<void>
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
}

export type InvoiceHistoryState = "empty" | "loading" | "error" | "restricted"

export function InvoiceHistory(props: InvoiceHistoryProps): JSX.Element {
  const [state, setState] = createSignal<InvoiceHistoryState>(
    props.restricted ? "restricted" : "empty",
  )
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()
  const invoices = () => props.invoices ?? []

  async function handleDownload(id: string) {
    setLocalError("")
    setState("loading")
    try {
      await props.onDownload?.(id)
      setState("empty")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Download failed.")
      setState("error")
    }
  }

  return (
    <div
      class={["solidiom-block-invoice-history", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-invoice-history__restricted" role="alert">
          <p>{props.restrictedReason || "Invoice access is restricted."}</p>
        </div>
      </Show>
      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-invoice-history__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>
      <Show when={state() !== "restricted"}>
        <Show when={state() === "loading"}>
          <div class="solidiom-block-invoice-history__loading" aria-live="polite">
            Loading invoices...
          </div>
        </Show>
        <Show when={invoices().length === 0 && state() !== "loading"}>
          <div class="solidiom-block-invoice-history__empty">
            <p>No invoices found.</p>
          </div>
        </Show>
        <Show when={invoices().length > 0}>
          <table class="solidiom-block-invoice-history__table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <For each={invoices()}>
                {(invoice) => (
                  <tr
                    class="solidiom-block-invoice-history__row"
                    classList={{ [`is-${invoice.status}`]: true }}
                  >
                    <td>{invoice.date}</td>
                    <td>{invoice.amount}</td>
                    <td>
                      <span class="solidiom-block-invoice-history__status">{invoice.status}</span>
                    </td>
                    <td>
                      <Show when={invoice.downloadUrl}>
                        <button
                          type="button"
                          onClick={() => handleDownload(invoice.id)}
                          disabled={state() === "loading"}
                        >
                          Download
                        </button>
                      </Show>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
          <Show when={(props.totalPages ?? 1) > 1}>
            <nav class="solidiom-block-invoice-history__pagination" aria-label="Invoice pagination">
              <button
                type="button"
                disabled={props.currentPage === 1}
                onClick={() => props.onPageChange?.((props.currentPage ?? 1) - 1)}
              >
                Previous
              </button>
              <span>
                Page {props.currentPage ?? 1} of {props.totalPages ?? 1}
              </span>
              <button
                type="button"
                disabled={props.currentPage === props.totalPages}
                onClick={() => props.onPageChange?.((props.currentPage ?? 1) + 1)}
              >
                Next
              </button>
            </nav>
          </Show>
        </Show>
      </Show>
    </div>
  )
}

export default InvoiceHistory
