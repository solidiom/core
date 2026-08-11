import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Input from "@solidiom/input"
import * as Select from "@solidiom/select"
import { ContentCard } from "../components/ContentCard"

const ASSETS = [
  {
    title: "Q1 Marketing Banner",
    type: "Image",
    status: "published",
    author: "Alice Chen",
    updatedAt: "2024-03-10",
  },
  {
    title: "Product Demo Video",
    type: "Video",
    status: "review",
    author: "Bob Lee",
    updatedAt: "2024-03-09",
  },
  {
    title: "Brand Guidelines v2",
    type: "Document",
    status: "approved",
    author: "Alice Chen",
    updatedAt: "2024-03-08",
  },
  {
    title: "Social Media Template",
    type: "Image",
    status: "draft",
    author: "Carol Wu",
    updatedAt: "2024-03-07",
  },
  {
    title: "Customer Testimonial",
    type: "Video",
    status: "published",
    author: "Bob Lee",
    updatedAt: "2024-03-06",
  },
  {
    title: "Press Release Draft",
    type: "Document",
    status: "draft",
    author: "Carol Wu",
    updatedAt: "2024-03-05",
  },
]

const FILTERS = ["All", "Image", "Video", "Document"]

export function Library(): JSX.Element {
  const [search, setSearch] = createSignal("")
  const [filter, setFilter] = createSignal("All")

  const filtered = () =>
    ASSETS.filter((asset) => {
      const matchesSearch = asset.title.toLowerCase().includes(search().toLowerCase())
      const matchesFilter = filter() === "All" || asset.type === filter()
      return matchesSearch && matchesFilter
    })

  return (
    <div>
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" current>
              Library
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="mt-6">
        <h1 class="text-2xl font-bold text-gray-900">Content Library</h1>
        <p class="mt-1 text-sm text-gray-500">
          Browse, search, and organize your content assets and media files.
        </p>
      </div>

      <div class="mt-6 flex flex-col gap-4 sm:flex-row">
        <Input.Root
          type="text"
          placeholder="Search assets..."
          value={search()}
          onValueChange={setSearch}
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        <div class="flex items-center gap-2">
          {FILTERS.map((f) => (
            <button
              onClick={() => setFilter(f)}
              class={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                filter() === f
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered().map((asset) => (
          <ContentCard
            title={asset.title}
            type={asset.type}
            status={asset.status}
            author={asset.author}
            updatedAt={asset.updatedAt}
          />
        ))}
      </div>

      {filtered().length === 0 && (
        <div class="mt-12 text-center text-sm text-gray-500">
          No assets match your search criteria.
        </div>
      )}
    </div>
  )
}
