import { createSignal } from "solid-js"
import type { JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Input from "@solidiom/input"
import * as Field from "@solidiom/field"
import * as Alert from "@solidiom/alert"
import { ResultCard } from "../components/ResultCard"
import { FilterBar } from "../components/FilterBar"

const MOCK_RESULTS = [
  { title: "Getting Started with Solid.js", snippet: "Learn the fundamentals of Solid.js, a declarative JavaScript library for building user interfaces with fine-grained reactivity.", url: "docs.solidjs.com/guide/getting-started", date: "Aug 5, 2026" },
  { title: "Building Search with Solidiom", snippet: "A complete guide to implementing full-text search in your Solidiom application with filters and facets.", url: "blog.solidiom.com/search-guide", date: "Jul 22, 2026" },
  { title: "SolidJS Router Documentation", snippet: "Type-safe client-side routing for Solid.js applications with nested routes and data loading.", url: "docs.solidjs.com/router", date: "Jun 10, 2026" },
]

export function SearchResults(): JSX.Element {
  const [query] = createSignal("solidjs")
  const [categories, setCategories] = createSignal([
    { label: "Documentation", checked: false },
    { label: "Tutorials", checked: true },
    { label: "Blog", checked: false },
    { label: "API Reference", checked: false },
  ])
  const [types, setTypes] = createSignal([
    { label: "Articles", checked: true },
    { label: "Videos", checked: false },
    { label: "Code Samples", checked: false },
  ])

  const toggleCategory = (index: number) => {
    setCategories(prev => prev.map((c, i) => i === index ? { ...c, checked: !c.checked } : c))
  }
  const toggleType = (index: number) => {
    setTypes(prev => prev.map((t, i) => i === index ? { ...t, checked: !t.checked } : t))
  }

  return (
    <div class="space-y-8">
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" class="text-sm text-gray-500 hover:text-gray-900">Search</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator class="text-gray-400">/</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" current class="text-sm font-medium text-gray-900">Results</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div>
        <h1 class="text-2xl font-bold text-gray-900">Search Results</h1>
        <p class="mt-1 text-sm text-gray-500">Full-text search with filters, facets, and ranked results.</p>
      </div>

      <Alert.Root type="info" class="rounded-md border border-blue-200 bg-blue-50 p-4">
        <Alert.Title class="text-sm font-medium text-blue-800">Search Tip</Alert.Title>
        <Alert.Description class="mt-1 text-sm text-blue-700">
          Found {MOCK_RESULTS.length} results for "{query()}". Refine your search using filters below.
        </Alert.Description>
      </Alert.Root>

      <div class="grid gap-8 lg:grid-cols-4">
        <div class="lg:col-span-1">
          <FilterBar
            categories={categories()}
            types={types()}
            onCategoryToggle={toggleCategory}
            onTypeToggle={toggleType}
          />
        </div>
        <div class="lg:col-span-3">
          <Field.Root>
            <Field.Label class="block text-sm font-medium text-gray-700">Search Query</Field.Label>
            <Input.Root value={query()} placeholder="Search..." class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            <Field.Description class="mt-1 text-xs text-gray-500">Enter a search term to find content matching your criteria.</Field.Description>
          </Field.Root>

          <div class="mt-6 space-y-4">
            {MOCK_RESULTS.map((result) => (
              <ResultCard
                title={result.title}
                snippet={result.snippet}
                url={result.url}
                date={result.date}
              />
            ))}
          </div>

          <div class="mt-8 flex justify-end gap-3">
            <Button.Root class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              Clear Filters
            </Button.Root>
            <Button.Root class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
              Save Search
            </Button.Root>
          </div>
        </div>
      </div>
    </div>
  )
}
