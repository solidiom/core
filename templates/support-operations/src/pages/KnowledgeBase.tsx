import type { JSX } from "solid-js"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Input from "@solidiom/input"
import * as Card from "@solidiom/card"

const CATEGORIES = [
  "Getting Started",
  "Troubleshooting",
  "Account & Billing",
  "API",
  "Integrations",
]

const ARTICLES = [
  {
    title: "How to create a new account",
    category: "Getting Started",
    author: "Support Team",
    views: 1240,
  },
  {
    title: "Resetting your password",
    category: "Account & Billing",
    author: "Alex Rivera",
    views: 890,
  },
  { title: "Understanding API rate limits", category: "API", author: "Jordan Lee", views: 2100 },
  {
    title: "Fixing common SSO errors",
    category: "Troubleshooting",
    author: "Morgan Chen",
    views: 560,
  },
  { title: "Setting up webhooks", category: "Integrations", author: "Casey Kim", views: 780 },
  {
    title: "Managing team permissions",
    category: "Getting Started",
    author: "Alex Rivera",
    views: 1560,
  },
  {
    title: "Upgrading your subscription",
    category: "Account & Billing",
    author: "Support Team",
    views: 430,
  },
  { title: "Using the REST API", category: "API", author: "Jordan Lee", views: 3200 },
]

export function KnowledgeBase(): JSX.Element {
  const [search, setSearch] = createSignal("")
  const [category, setCategory] = createSignal("All")

  const filtered = () =>
    ARTICLES.filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(search().toLowerCase())
      const matchesCategory = category() === "All" || article.category === category()
      return matchesSearch && matchesCategory
    })

  return (
    <div>
      <Breadcrumb.Root>
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Tickets</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" current>
              Knowledge Base
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="mt-6">
        <h1 class="text-2xl font-bold text-gray-900">Knowledge Base</h1>
        <p class="mt-1 text-sm text-gray-500">Searchable articles for agents and customers.</p>
      </div>

      <div class="mt-6 flex flex-col gap-4 sm:flex-row">
        <Input.Root
          type="search"
          placeholder="Search articles..."
          value={search()}
          onValueChange={setSearch}
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        <div class="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCategory("All")}
            class={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
              category() === "All"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              onClick={() => setCategory(c)}
              class={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                category() === c
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered().map((article) => (
          <Card.Root>
            <Card.Header>
              <Card.Title>{article.title}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div class="space-y-1 text-xs text-gray-500">
                <div>
                  <span class="font-medium">Category:</span> {article.category}
                </div>
                <div>
                  <span class="font-medium">Author:</span> {article.author}
                </div>
                <div>
                  <span class="font-medium">Views:</span> {article.views.toLocaleString()}
                </div>
              </div>
            </Card.Content>
          </Card.Root>
        ))}
      </div>

      {filtered().length === 0 && (
        <div class="py-12 text-center text-sm text-gray-500">
          No articles match your search criteria.
        </div>
      )}
    </div>
  )
}
