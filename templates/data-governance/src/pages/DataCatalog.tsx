import type { JSX } from "@solidjs/web"
import { createSignal } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Button from "@solidiom/button"
import * as Input from "@solidiom/input"
import { DataAssetCard } from "../components/DataAssetCard"

interface DataAsset {
  name: string
  type: string
  owner: string
  classification: string
  description: string
  lastUpdated: string
}

const ASSETS: DataAsset[] = [
  {
    name: "customer_transactions",
    type: "table",
    owner: "Finance Team",
    classification: "confidential",
    description: "Raw transaction records from payment processing systems",
    lastUpdated: "2024-08-05",
  },
  {
    name: "user_profiles",
    type: "table",
    owner: "Engineering",
    classification: "restricted",
    description: "Complete user profile data including PII fields",
    lastUpdated: "2024-08-09",
  },
  {
    name: "product_catalog",
    type: "dataset",
    owner: "Product Team",
    classification: "internal",
    description: "Master product catalog with pricing and inventory data",
    lastUpdated: "2024-08-07",
  },
  {
    name: "analytics_events",
    type: "stream",
    owner: "Data Science",
    classification: "internal",
    description: "Real-time event stream from web and mobile analytics",
    lastUpdated: "2024-08-10",
  },
  {
    name: "monthly_revenue",
    type: "report",
    owner: "Finance Team",
    classification: "confidential",
    description: "Aggregated monthly revenue reports by region and product",
    lastUpdated: "2024-07-31",
  },
  {
    name: "api_gateway_logs",
    type: "stream",
    owner: "Platform Team",
    classification: "internal",
    description: "Structured logs from API gateway with request/response metadata",
    lastUpdated: "2024-08-10",
  },
  {
    name: "employee_directory",
    type: "table",
    owner: "HR Department",
    classification: "restricted",
    description: "Employee contact information and organizational structure",
    lastUpdated: "2024-08-01",
  },
  {
    name: "public_datasets",
    type: "dataset",
    owner: "Open Data Team",
    classification: "public",
    description: "Curated datasets published for external consumption",
    lastUpdated: "2024-08-03",
  },
  {
    name: "compliance_audit",
    type: "report",
    owner: "Legal Team",
    classification: "restricted",
    description: "Quarterly compliance audit findings and remediation tracking",
    lastUpdated: "2024-07-15",
  },
  {
    name: "ml_feature_store",
    type: "dataset",
    owner: "ML Platform",
    classification: "internal",
    description: "Pre-computed features for machine learning model training",
    lastUpdated: "2024-08-08",
  },
]

export function DataCatalog(): JSX.Element {
  const [search, setSearch] = createSignal("")
  const [typeFilter, setTypeFilter] = createSignal<string>("all")

  const filtered = () =>
    ASSETS.filter((asset) => {
      const matchesSearch =
        search() === "" ||
        asset.name.toLowerCase().includes(search().toLowerCase()) ||
        asset.description.toLowerCase().includes(search().toLowerCase()) ||
        asset.owner.toLowerCase().includes(search().toLowerCase())
      const matchesType = typeFilter() === "all" || asset.type === typeFilter()
      return matchesSearch && matchesType
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
                Data Catalog
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Data Catalog</h1>
            <p class="mt-1 text-sm text-gray-500">
              Discover, document, and search data assets across the organization.
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <Input.Root class="flex-1">
          <Input.Input
            type="text"
            placeholder="Search assets by name, owner, or description..."
            class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={search()}
            onInput={(e) => setSearch(e.currentTarget.value)}
          />
        </Input.Root>
        <select
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={typeFilter()}
          onChange={(e) => setTypeFilter(e.currentTarget.value)}
        >
          <option value="all">All Types</option>
          <option value="table">Tables</option>
          <option value="dataset">Datasets</option>
          <option value="stream">Streams</option>
          <option value="report">Reports</option>
          <option value="api">APIs</option>
        </select>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered().map((asset) => (
          <DataAssetCard
            name={asset.name}
            type={asset.type}
            owner={asset.owner}
            classification={asset.classification}
            description={asset.description}
            lastUpdated={asset.lastUpdated}
          />
        ))}
      </div>
      {filtered().length === 0 && (
        <div class="py-12 text-center text-sm text-gray-500">
          No data assets match your search criteria.
        </div>
      )}
    </div>
  )
}
