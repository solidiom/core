import { createEffect, createSignal, For, Match, onCleanup, Switch } from "solid-js"
import * as Dialog from "@solidiom/dialog"
import type { Locale } from "../lib/locale"

type SearchStatus = "idle" | "loading" | "ready" | "error"

interface PagefindResultData {
  url: string
  excerpt?: string
  meta: { title?: string }
}

interface PagefindSearchResult {
  data: () => Promise<PagefindResultData>
}

interface PagefindModule {
  search: (query: string) => Promise<{ results: PagefindSearchResult[] }>
}

const COPY: Record<
  Locale,
  {
    trigger: string
    title: string
    description: string
    label: string
    placeholder: string
    close: string
    loading: string
    empty: string
    error: string
    fallback: string
    fallbackLink: string
  }
> = {
  en: {
    trigger: "Search",
    title: "Search Solidiom",
    description: "Search the Solidiom documentation.",
    label: "Search documentation",
    placeholder: "Search documentation",
    close: "Close search",
    loading: "Searching documentation…",
    empty: "No results found.",
    error: "Search is unavailable. Build the site search index and try again.",
    fallback: "Search requires JavaScript.",
    fallbackLink: "Browse documentation",
  },
  es: {
    trigger: "Buscar",
    title: "Buscar en Solidiom",
    description: "Busca en la documentación de Solidiom.",
    label: "Buscar en la documentación",
    placeholder: "Buscar en la documentación",
    close: "Cerrar búsqueda",
    loading: "Buscando en la documentación…",
    empty: "No se encontraron resultados.",
    error: "La búsqueda no está disponible. Genera el índice de búsqueda e inténtalo de nuevo.",
    fallback: "La búsqueda requiere JavaScript.",
    fallbackLink: "Explorar documentación",
  },
}

const PAGEFIND_MODULE_URL = "/pagefind/pagefind.js"
let pagefindModule: Promise<PagefindModule> | undefined

function loadPagefind(): Promise<PagefindModule> {
  pagefindModule ??= import(/* @vite-ignore */ PAGEFIND_MODULE_URL) as Promise<PagefindModule>
  return pagefindModule
}

export interface SiteSearchProps {
  locale: Locale
}

/**
 * Client-side Pagefind search using Solidiom's Dialog primitive. Pagefind is
 * used strictly as an index/query API; its bundled UI and stylesheet are not
 * included, leaving the site in control of presentation and accessibility.
 */
export function SiteSearch(props: SiteSearchProps) {
  const [open, setOpen] = createSignal(false)
  const [query, setQuery] = createSignal("")
  const [results, setResults] = createSignal<PagefindResultData[]>([])
  const [status, setStatus] = createSignal<SearchStatus>("idle")
  let input: HTMLInputElement | undefined
  let requestId = 0

  const copy = () => COPY[props.locale]

  createEffect(open, (isOpen) => {
    if (!isOpen) return
    const frame = requestAnimationFrame(() => input?.focus())
    return () => cancelAnimationFrame(frame)
  })

  if (typeof window !== "undefined") {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k" || (!event.metaKey && !event.ctrlKey)) return
      event.preventDefault()
      setOpen(true)
    }

    window.addEventListener("keydown", handleShortcut)
    onCleanup(() => window.removeEventListener("keydown", handleShortcut))
  }

  async function search(nextQuery: string): Promise<void> {
    const currentRequest = ++requestId
    setQuery(nextQuery)

    if (!nextQuery.trim()) {
      setResults([])
      setStatus("idle")
      return
    }

    setStatus("loading")
    try {
      const pagefind = await loadPagefind()
      const search = await pagefind.search(nextQuery)
      const data = await Promise.all(search.results.map((result) => result.data()))
      if (currentRequest !== requestId) return
      setResults(data)
      setStatus("ready")
    } catch {
      if (currentRequest !== requestId) return
      setResults([])
      setStatus("error")
    }
  }

  return (
    <div
      ref={(element) => element.setAttribute("data-site-search-hydrated", "true")}
      class="site-search"
    >
      <noscript>
        <p class="site-search__fallback">
          {copy().fallback} <a href="/primitives/">{copy().fallbackLink}</a>
        </p>
      </noscript>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          <span class="site-search__trigger-content">
            <span class="site-search__trigger-icon" aria-hidden="true">
              ⌕
            </span>
            <span class="site-search__trigger-label">{copy().trigger}</span>
            <kbd aria-hidden="true">⌘K</kbd>
          </span>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop class="site-search__backdrop" />
          <Dialog.Content class="site-search__content">
            <div class="site-search__header">
              <div>
                <Dialog.Title class="site-search__title">{copy().title}</Dialog.Title>
                <Dialog.Description class="site-search__description">
                  {copy().description}
                </Dialog.Description>
              </div>
              <Dialog.Close>
                <span class="site-search__close-content" aria-hidden="true">
                  ×
                </span>
                <span class="site-search__visually-hidden">{copy().close}</span>
              </Dialog.Close>
            </div>
            <form
              class="site-search__form"
              role="search"
              onSubmit={(event) => {
                event.preventDefault()
                void search(query())
              }}
            >
              <label class="site-search__visually-hidden" for="site-search-input">
                {copy().label}
              </label>
              <input
                id="site-search-input"
                ref={(element) => {
                  input = element
                }}
                class="site-search__input"
                type="search"
                value={query()}
                placeholder={copy().placeholder}
                autocomplete="off"
                onInput={(event) => void search(event.currentTarget.value)}
              />
            </form>
            <div class="site-search__results" aria-live="polite" aria-atomic="true">
              <Switch>
                <Match when={status() === "loading"}>
                  <p class="site-search__message">{copy().loading}</p>
                </Match>
                <Match when={status() === "error"}>
                  <p class="site-search__message" role="alert">
                    {copy().error}
                  </p>
                </Match>
                <Match when={status() === "ready" && results().length === 0}>
                  <p class="site-search__message">{copy().empty}</p>
                </Match>
                <Match when={results().length > 0}>
                  <ul class="site-search__result-list">
                    <For each={results()}>
                      {(result) => (
                        <li data-site-search-result>
                          <a href={result.url} onClick={() => setOpen(false)}>
                            <span class="site-search__result-title">
                              {result.meta.title ?? result.url}
                            </span>
                            {result.excerpt && (
                              <span class="site-search__result-excerpt">{result.excerpt}</span>
                            )}
                          </a>
                        </li>
                      )}
                    </For>
                  </ul>
                </Match>
              </Switch>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
