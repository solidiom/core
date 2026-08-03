import { createSignal } from "solid-js"
import * as Pagination from "@solidiom/pagination"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { label: string; prev: string; next: string }> = {
  en: { label: "Page navigation", prev: "Previous", next: "Next" },
  es: { label: "Navegación de páginas", prev: "Anterior", next: "Siguiente" },
}

export interface PaginationExampleProps {
  locale: Locale
}

/** Canonical executable source for the Pagination documentation example. */
export function PaginationExample(props: PaginationExampleProps) {
  const copy = () => COPY[props.locale]
  const [page, setPage] = createSignal(1)

  return (
    <div ref={(el) => el.setAttribute("data-hydrated", "true")} class="pagination-example">
      <Pagination.Root>
        <Pagination.PreviousButton
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page() <= 1}
        >
          {copy().prev}
        </Pagination.PreviousButton>
        <Pagination.Content>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pagination.Item>
              <button
                type="button"
                onClick={() => setPage(n)}
                aria-current={page() === n ? "page" : undefined}
              >
                {n}
              </button>
            </Pagination.Item>
          ))}
        </Pagination.Content>
        <Pagination.NextButton
          onClick={() => setPage((p) => Math.min(5, p + 1))}
          disabled={page() >= 5}
        >
          {copy().next}
        </Pagination.NextButton>
      </Pagination.Root>
    </div>
  )
}
