import type { JSX } from "@solidjs/web"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Input from "@solidiom/input"
import { DocCard } from "../components/DocCard"

interface Doc {
  title: string
  category: string
  version: string
  description: string
  status: "published" | "draft" | "archived"
  lastUpdated: string
}

const DOCUMENTS: Doc[] = [
  {
    title: "Getting Started",
    category: "Getting Started",
    version: "2.1.0",
    description: "Quick start guide for integrating with our API platform",
    status: "published",
    lastUpdated: "Aug 8, 2024",
  },
  {
    title: "Authentication",
    category: "Getting Started",
    version: "2.1.0",
    description: "OAuth 2.0 and API key authentication flows",
    status: "published",
    lastUpdated: "Aug 5, 2024",
  },
  {
    title: "Rate Limiting",
    category: "Getting Started",
    version: "2.0.0",
    description: "Understanding rate limits, quotas, and best practices",
    status: "published",
    lastUpdated: "Jul 22, 2024",
  },
  {
    title: "REST API Reference",
    category: "API Reference",
    version: "2.1.0",
    description: "Complete reference for all REST endpoints and parameters",
    status: "published",
    lastUpdated: "Aug 9, 2024",
  },
  {
    title: "WebSocket API",
    category: "API Reference",
    version: "1.5.0",
    description: "Real-time event streaming via WebSocket connections",
    status: "published",
    lastUpdated: "Aug 1, 2024",
  },
  {
    title: "GraphQL Schema",
    category: "API Reference",
    version: "1.2.0",
    description: "GraphQL type definitions and query examples",
    status: "draft",
    lastUpdated: "Aug 7, 2024",
  },
  {
    title: "Node.js SDK",
    category: "SDK Guides",
    version: "3.0.0",
    description: "Install and use the official Node.js client library",
    status: "published",
    lastUpdated: "Aug 3, 2024",
  },
  {
    title: "Python SDK",
    category: "SDK Guides",
    version: "2.4.0",
    description: "Python client library with async support",
    status: "published",
    lastUpdated: "Jul 30, 2024",
  },
  {
    title: "Go SDK",
    category: "SDK Guides",
    version: "1.8.0",
    description: "Type-safe Go client for API integration",
    status: "draft",
    lastUpdated: "Aug 6, 2024",
  },
  {
    title: "Building a Web App",
    category: "Tutorials",
    version: "2.0.0",
    description: "Step-by-step tutorial for building a web application",
    status: "published",
    lastUpdated: "Jul 18, 2024",
  },
  {
    title: "CI/CD Integration",
    category: "Tutorials",
    version: "1.0.0",
    description: "Automate API testing in your CI/CD pipeline",
    status: "published",
    lastUpdated: "Jul 15, 2024",
  },
  {
    title: "Error Handling Best Practices",
    category: "Best Practices",
    version: "1.1.0",
    description: "How to handle and retry API errors gracefully",
    status: "published",
    lastUpdated: "Jul 25, 2024",
  },
]

export function Documentation(): JSX.Element {
  const [search, setSearch] = createSignal("")
  const [categoryFilter, setCategoryFilter] = createSignal<string>("all")

  const filtered = () =>
    DOCUMENTS.filter((doc) => {
      const matchesSearch =
        search() === "" ||
        doc.title.toLowerCase().includes(search().toLowerCase()) ||
        doc.description.toLowerCase().includes(search().toLowerCase())
      const matchesCategory = categoryFilter() === "all" || doc.category === categoryFilter()
      return matchesSearch && matchesCategory
    })

  return (
    <div class="space-y-8">
      <div>
        <Breadcrumb.Root class="mb-2">
          <Breadcrumb.List class="flex items-center gap-1.5 text-sm text-gray-500">
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" class="hover:text-gray-700">
                Home
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="text-gray-300">/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/" current class="text-gray-900 font-medium">
                Documentation
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Documentation</h1>
          <p class="mt-1 text-sm text-gray-500">
            Browse API documentation, guides, and SDK references.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <Input.Root class="flex-1">
          <Input.Input
            type="text"
            placeholder="Search documentation..."
            class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={search()}
            onInput={(e) => setSearch(e.currentTarget.value)}
          />
        </Input.Root>
        <select
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={categoryFilter()}
          onChange={(e) => setCategoryFilter(e.currentTarget.value)}
        >
          <option value="all">All Categories</option>
          <option value="Getting Started">Getting Started</option>
          <option value="API Reference">API Reference</option>
          <option value="SDK Guides">SDK Guides</option>
          <option value="Tutorials">Tutorials</option>
          <option value="Best Practices">Best Practices</option>
        </select>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered().map((doc) => (
          <DocCard
            title={doc.title}
            category={doc.category}
            version={doc.version}
            description={doc.description}
            status={doc.status}
            lastUpdated={doc.lastUpdated}
          />
        ))}
      </div>
      {filtered().length === 0 && (
        <div class="py-12 text-center text-sm text-gray-500">
          No documentation matches your search criteria.
        </div>
      )}
    </div>
  )
}
