import * as EmptyState from "@solidiom/empty-state"
import type { Locale } from "../lib/locale"

const COPY: Record<
  Locale,
  {
    title: string
    description: string
    action: string
  }
> = {
  en: {
    title: "No results found",
    description: "Try adjusting your search or filter to find what you're looking for.",
    action: "Clear filters",
  },
  es: {
    title: "No se encontraron resultados",
    description: "Intente ajustar su búsqueda o filtro para encontrar lo que busca.",
    action: "Limpiar filtros",
  },
}

export interface EmptyStateExampleProps {
  locale: Locale
}

/**
 * Canonical executable source for the Empty State documentation example.
 * Demonstrates a centered empty state with icon, title, description, and action.
 */
export function EmptyStateExample(props: EmptyStateExampleProps) {
  const copy = () => COPY[props.locale]

  return (
    <div
      ref={(element) => element.setAttribute("data-hydrated", "true")}
      class="empty-state-example"
      data-empty-state-example
    >
      <EmptyState.Root>
        <EmptyState.Icon>🔍</EmptyState.Icon>
        <EmptyState.Title>{copy().title}</EmptyState.Title>
        <EmptyState.Description>{copy().description}</EmptyState.Description>
        <EmptyState.Action>
          <button type="button">{copy().action}</button>
        </EmptyState.Action>
      </EmptyState.Root>
    </div>
  )
}
