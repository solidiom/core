import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Input from "@solidiom/input"
import * as Tabs from "@solidiom/tabs"
import { DocCard } from "../components/DocCard"

const CATEGORIES = [
  { name: "Getting Started", items: 5 },
  { name: "Core Concepts", items: 8 },
  { name: "API Reference", items: 12 },
  { name: "Guides", items: 6 },
]

const DOCS = [
  {
    title: "Quick Start Guide",
    description: "Get up and running in under 5 minutes with this step-by-step guide.",
    category: "Getting Started",
  },
  {
    title: "Installation",
    description: "Install the framework using npm, yarn, or pnpm.",
    category: "Getting Started",
  },
  {
    title: "Project Structure",
    description: "Understanding the default project layout and conventions.",
    category: "Core Concepts",
  },
  {
    title: "Component Basics",
    description: "Learn how to create and compose components.",
    category: "Core Concepts",
  },
  {
    title: "State Management",
    description: "Managing local and global state with signals and stores.",
    category: "Core Concepts",
  },
  {
    title: "Routing",
    description: "Client-side navigation with file-based routing.",
    category: "Core Concepts",
  },
]

export function DocsReader(): JSX.Element {
  const [search, setSearch] = createSignal("")
  const [activeCategory, setActiveCategory] = createSignal("Getting Started")

  const filtered = () =>
    DOCS.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(search().toLowerCase()) ||
        doc.description.toLowerCase().includes(search().toLowerCase())
      const matchesCategory = activeCategory() === "All" || doc.category === activeCategory()
      return matchesSearch && matchesCategory
    })

  return (
    <div>
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Docs</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" current>
              Overview
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="mt-6">
        <h1 class="text-2xl font-bold text-gray-900">Documentation</h1>
        <p class="mt-1 text-sm text-gray-500">
          Browse documentation with sidebar navigation, search, and versioning.
        </p>
      </div>

      <div class="mt-6 flex flex-col gap-6 lg:flex-row">
        <aside class="w-full lg:w-64">
          <Input.Root
            type="search"
            placeholder="Search docs..."
            value={search()}
            onValueChange={setSearch}
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          <nav class="mt-4 space-y-1">
            <button
              onClick={() => setActiveCategory("All")}
              class={`block w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
                activeCategory() === "All"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                onClick={() => setActiveCategory(cat.name)}
                class={`block w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
                  activeCategory() === cat.name
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {cat.name}
                <span class="ml-2 text-xs text-gray-400">({cat.items})</span>
              </button>
            ))}
          </nav>
        </aside>

        <div class="flex-1">
          <div class="grid gap-6 sm:grid-cols-2">
            {filtered().map((doc) => (
              <DocCard title={doc.title} description={doc.description} category={doc.category} />
            ))}
          </div>

          {filtered().length === 0 && (
            <div class="py-12 text-center text-sm text-gray-500">
              No documentation found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
