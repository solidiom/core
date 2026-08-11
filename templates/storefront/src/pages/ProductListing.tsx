import { createSignal, type JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Input from "@solidiom/input"
import * as Button from "@solidiom/button"
import { ProductCard } from "../components/ProductCard"

const CATEGORIES = ["All", "Electronics", "Clothing", "Accessories", "Home"]

const PRODUCTS = [
  { id: "1", name: "Wireless Earbuds", price: "$49.99", category: "Electronics", badge: "New" },
  { id: "2", name: "Leather Wallet", price: "$29.99", category: "Accessories" },
  { id: "3", name: "Canvas Sneakers", price: "$59.99", category: "Clothing", badge: "Sale" },
  { id: "4", name: "Desk Organizer", price: "$24.99", category: "Home" },
  { id: "5", name: "USB-C Charging Cable", price: "$12.99", category: "Electronics" },
  { id: "6", name: "Wool Beanie", price: "$19.99", category: "Clothing" },
  { id: "7", name: "Phone Stand", price: "$14.99", category: "Electronics" },
  { id: "8", name: "Ceramic Mug", price: "$9.99", category: "Home" },
]

const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"]

export function ProductListing(): JSX.Element {
  const [search, setSearch] = createSignal("")
  const [category, setCategory] = createSignal("All")
  const [sort, setSort] = createSignal("Featured")

  const filtered = () => {
    let results = PRODUCTS.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search().toLowerCase())
      const matchCat = category() === "All" || p.category === category()
      return matchSearch && matchCat
    })

    if (sort() === "Price: Low to High")
      results = [...results].sort(
        (a, b) => parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", "")),
      )
    if (sort() === "Price: High to Low")
      results = [...results].sort(
        (a, b) => parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", "")),
      )

    return results
  }

  return (
    <div>
      <Breadcrumb.Root class="mb-4">
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" class="text-sm text-gray-500 hover:text-gray-700">
              Home
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator class="text-gray-400">/</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" current class="text-sm font-medium text-gray-900">
              Products
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <h1 class="text-2xl font-bold text-gray-900">Products</h1>
      <p class="mt-1 text-sm text-gray-500">Browse our curated collection of quality products.</p>

      <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              onClick={() => setCategory(cat)}
              class={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                category() === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div class="flex items-center gap-3">
          <Input.Root
            value={search()}
            onValueChange={setSearch}
            placeholder="Search..."
            class="w-48"
          />
          <select
            value={sort()}
            onChange={(e) => setSort(e.currentTarget.value)}
            class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered().map((product) => (
          <ProductCard {...product} />
        ))}
      </div>

      {filtered().length === 0 && (
        <p class="mt-8 text-center text-sm text-gray-500">No products found.</p>
      )}
    </div>
  )
}
