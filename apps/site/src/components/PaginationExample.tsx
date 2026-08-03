import { createSignal } from "solid-js"
import * as Pagination from "@solidiom/pagination"
import type { Locale } from "../lib/locale"

const COPY: Record<Locale, { label: string }> = {
  en: { label: "Page navigation" },
  es: { label: "Navegación de páginas" },
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
      <Pagination.Root
        totalPages={5}
        currentPage={page()}
        onPageChange={setPage}
        aria-label={copy().label}
      >
        <Pagination.PreviousButton>←</Pagination.PreviousButton>
        <Pagination.Content>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pagination.Item page={n}>{n}</Pagination.Item>
          ))}
        </Pagination.Content>
        <Pagination.NextButton>→</Pagination.NextButton>
      </Pagination.Root>
    </div>
  )
}
