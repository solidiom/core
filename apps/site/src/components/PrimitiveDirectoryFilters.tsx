import { createMemo, createSignal, For, onSettled } from "solid-js"
import { categoryLabel } from "../lib/docs-nav"
import type { Locale } from "../lib/locale"

export interface DirectoryPrimitive {
  name: string
  label: string
  description: string
  category: string
  status: string
  href: string
}

interface DirectoryFilterCopy {
  filters: string
  category: string
  status: string
  allCategories: string
  allStatuses: string
  resultCount: (count: number) => string
  noResults: string
  statuses: Record<string, string>
}

const COPY: Record<Locale, DirectoryFilterCopy> = {
  en: {
    filters: "Filter primitives",
    category: "Category",
    status: "Status",
    allCategories: "All categories",
    allStatuses: "All statuses",
    resultCount: (count) => `${count} ${count === 1 ? "primitive" : "primitives"}`,
    noResults: "No primitives match these filters.",
    statuses: {
      experimental: "Experimental",
      preview: "Preview",
      stable: "Stable",
      deprecated: "Deprecated",
    },
  },
  es: {
    filters: "Filtrar primitivas",
    category: "Categoría",
    status: "Estado",
    allCategories: "Todas las categorías",
    allStatuses: "Todos los estados",
    resultCount: (count) => `${count} ${count === 1 ? "primitiva" : "primitivas"}`,
    noResults: "Ninguna primitiva coincide con estos filtros.",
    statuses: {
      experimental: "Experimental",
      preview: "Vista previa",
      stable: "Estable",
      deprecated: "Obsoleto",
    },
  },
}

export interface PrimitiveDirectoryFiltersProps {
  primitives: DirectoryPrimitive[]
  locale: Locale
}

/**
 * DOCS-004's enhanced catalog UI. The enclosing Astro component keeps an
 * equivalent static link inventory visible until this island settles, so a
 * JavaScript failure or disabled JavaScript never hides the directory.
 */
export function PrimitiveDirectoryFilters(props: PrimitiveDirectoryFiltersProps) {
  let root: HTMLElement | undefined
  const copy = () => COPY[props.locale]
  const categories = [...new Set(props.primitives.map((primitive) => primitive.category))].sort(
    (a, b) => categoryLabel(a, props.locale).localeCompare(categoryLabel(b, props.locale)),
  )
  const statuses = [...new Set(props.primitives.map((primitive) => primitive.status))].sort()
  const [category, setCategory] = createSignal("all" as string, { ownedWrite: true })
  const [status, setStatus] = createSignal("all" as string, { ownedWrite: true })
  const filteredPrimitives = createMemo(() =>
    props.primitives.filter(
      (primitive) =>
        (category() === "all" || primitive.category === category()) &&
        (status() === "all" || primitive.status === status()),
    ),
  )

  onSettled(() => {
    if (typeof document === "undefined") return
    root?.setAttribute("data-ready", "true")
    document.getElementById("primitive-directory-fallback")?.setAttribute("hidden", "")
  })

  return (
    <section
      ref={(element) => {
        root = element
      }}
      class="primitive-directory__filters"
      aria-label={copy().filters}
    >
      <div class="primitive-directory__filter-controls">
        <label>
          <span>{copy().category}</span>
          <select value={category()} onChange={(event) => setCategory(event.currentTarget.value)}>
            <option value="all">{copy().allCategories}</option>
            <For each={categories}>
              {(value) => <option value={value}>{categoryLabel(value, props.locale)}</option>}
            </For>
          </select>
        </label>
        <label>
          <span>{copy().status}</span>
          <select value={status()} onChange={(event) => setStatus(event.currentTarget.value)}>
            <option value="all">{copy().allStatuses}</option>
            <For each={statuses}>
              {(value) => <option value={value}>{copy().statuses[value] ?? value}</option>}
            </For>
          </select>
        </label>
      </div>

      <p class="primitive-directory__filtered-count" aria-live="polite">
        {copy().resultCount(filteredPrimitives().length)}
      </p>

      {filteredPrimitives().length > 0 ? (
        <ul class="primitive-directory__grid" data-pagefind-ignore="index">
          <For each={filteredPrimitives()}>
            {(primitive) => (
              <li class="primitive-directory__item">
                <a href={primitive.href} class="primitive-directory__link">
                  <span class="primitive-directory__name">{primitive.label}</span>
                  <span class="primitive-directory__description">{primitive.description}</span>
                  <span class="primitive-directory__meta">
                    <span class="primitive-directory__category">
                      {categoryLabel(primitive.category, props.locale)}
                    </span>
                    <span class="primitive-directory__status">
                      {copy().statuses[primitive.status] ?? primitive.status}
                    </span>
                  </span>
                </a>
              </li>
            )}
          </For>
        </ul>
      ) : (
        <p class="primitive-directory__empty" role="status">
          {copy().noResults}
        </p>
      )}
    </section>
  )
}
