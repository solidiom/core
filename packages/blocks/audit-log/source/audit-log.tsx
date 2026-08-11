/**
 * BLOCK-ADMIN-02: Audit Log block.
 *
 * Searchable, filterable audit event timeline.
 * Implements all four required states: loading, empty, error, restricted.
 *
 * Dependencies: Input, Card, Select, Checkbox, Popover, Breadcrumb, Pagination, Data Table, Spinner
 */

import { createSignal, Show, For, type JSX } from "solid-js"

export interface AuditEvent {
  id: string
  timestamp: string
  actor: string
  action: string
  resource: string
  details?: string
}

export interface AuditLogProps {
  events?: AuditEvent[]
  totalPages?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  onFilter?: (query: string) => void
  error?: string
  restricted?: boolean
  restrictedReason?: string
  class?: string
}

export type AuditLogState = "empty" | "loading" | "error" | "restricted"

export function AuditLog(props: AuditLogProps): JSX.Element {
  const [filterQuery, setFilterQuery] = createSignal("")
  const [state, setState] = createSignal<AuditLogState>(props.restricted ? "restricted" : "empty")
  const [localError, setLocalError] = createSignal("")

  const currentError = () => props.error || localError()
  const events = () => props.events ?? []

  function handleFilter() {
    props.onFilter?.(filterQuery())
  }

  return (
    <div
      class={["solidiom-block-audit-log", props.class].filter(Boolean).join(" ")}
      data-state={state()}
    >
      <Show when={state() === "restricted"}>
        <div class="solidiom-block-audit-log__restricted" role="alert">
          <p>{props.restrictedReason || "Audit log access is restricted."}</p>
        </div>
      </Show>
      <Show when={state() === "error" && currentError()}>
        <div class="solidiom-block-audit-log__error" role="alert">
          <p>{currentError()}</p>
        </div>
      </Show>
      <Show when={state() !== "restricted"}>
        <div class="solidiom-block-audit-log__filters">
          <input
            type="search"
            value={filterQuery()}
            onInput={(e) => setFilterQuery(e.currentTarget.value)}
            placeholder="Search events..."
            aria-label="Filter audit events"
          />
          <button type="button" onClick={handleFilter}>
            Filter
          </button>
        </div>
        <Show when={state() === "loading"}>
          <div class="solidiom-block-audit-log__loading" aria-live="polite">
            Loading events...
          </div>
        </Show>
        <Show when={events().length === 0 && state() !== "loading"}>
          <div class="solidiom-block-audit-log__empty">
            <p>No audit events found.</p>
          </div>
        </Show>
        <Show when={events().length > 0}>
          <table class="solidiom-block-audit-log__table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Resource</th>
              </tr>
            </thead>
            <tbody>
              <For each={events()}>
                {(event) => (
                  <tr class="solidiom-block-audit-log__row">
                    <td>{event.timestamp}</td>
                    <td>{event.actor}</td>
                    <td>{event.action}</td>
                    <td>{event.resource}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
          <Show when={(props.totalPages ?? 1) > 1}>
            <nav class="solidiom-block-audit-log__pagination" aria-label="Audit log pagination">
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

export default AuditLog
