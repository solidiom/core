import { createSignal } from "solid-js"
import type { JSX } from "@solidjs/web"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Input from "@solidiom/input"
import { ProductCard } from "../components/ProductCard"

const CATEGORIES = ["All", "Electronics", "Clothing", "Home & Garden", "Sports", "Books"]

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Wireless Headphones Pro",
    price: "$79.99",
    originalPrice: "$99.99",
    seller: "AudioTech",
    rating: 4.5,
    reviews: 128,
  },
  {
    id: "2",
    name: "Organic Cotton T-Shirt",
    price: "$24.99",
    seller: "EcoWear",
    rating: 4.0,
    reviews: 56,
  },
  {
    id: "3",
    name: "Smart Garden Kit",
    price: "$49.99",
    originalPrice: "$59.99",
    seller: "GreenThumb",
    rating: 3.5,
    reviews: 89,
  },
  {
    id: "4",
    name: "Yoga Mat Premium",
    price: "$34.99",
    seller: "FitLife",
    rating: 5.0,
    reviews: 201,
  },
  {
    id: "5",
    name: "Mechanical Keyboard RGB",
    price: "$129.99",
    seller: "KeyMaster",
    rating: 4.5,
    reviews: 342,
  },
  {
    id: "6",
    name: "Denim Jacket Vintage",
    price: "$89.99",
    originalPrice: "$110.00",
    seller: "RetroStyle",
    rating: 4.0,
    reviews: 67,
  },
  {
    id: "7",
    name: "LED Desk Lamp",
    price: "$45.99",
    seller: "BrightHome",
    rating: 4.5,
    reviews: 153,
  },
  {
    id: "8",
    name: "Running Shoes Ultra",
    price: "$119.99",
    seller: "SpeedFit",
    rating: 5.0,
    reviews: 410,
  },
  {
    id: "9",
    name: "Bluetooth Speaker Mini",
    price: "$29.99",
    originalPrice: "$39.99",
    seller: "AudioTech",
    rating: 4.0,
    reviews: 95,
  },
  {
    id: "10",
    name: "Ceramic Plant Pot Set",
    price: "$19.99",
    seller: "GreenThumb",
    rating: 3.5,
    reviews: 44,
  },
  {
    id: "11",
    name: "Programming in Rust",
    price: "$44.99",
    seller: "TechBooks",
    rating: 5.0,
    reviews: 78,
  },
  {
    id: "12",
    name: "Hiking Backpack 40L",
    price: "$69.99",
    seller: "TrailBlazer",
    rating: 4.5,
    reviews: 162,
  },
]

export function Browse(): JSX.Element {
  const [search, setSearch] = createSignal("")
  const [category, setCategory] = createSignal("All")

  const filtered = () =>
    MOCK_PRODUCTS.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search().toLowerCase())
      const matchesCategory = category() === "All" || getCategoryForProduct(p.id) === category()
      return matchesSearch && matchesCategory
    })

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
              Browse
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <h1 class="text-2xl font-bold text-gray-900">Browse Marketplace</h1>
      <p class="mt-1 text-sm text-gray-500">
        Discover products from trusted sellers across all categories.
      </p>

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
        <Input.Root
          value={search()}
          onValueChange={setSearch}
          placeholder="Search products..."
          class="w-full sm:w-72"
        />
      </div>

      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered().map((product) => (
          <ProductCard {...product} />
        ))}
      </div>

      {filtered().length === 0 && (
        <p class="mt-8 text-center text-sm text-gray-500">No products match your search.</p>
      )}
    </div>
  )
}

function getCategoryForProduct(id: string): string {
  const map: Record<string, string> = {
    "1": "Electronics",
    "5": "Electronics",
    "9": "Electronics",
    "2": "Clothing",
    "6": "Clothing",
    "3": "Home & Garden",
    "7": "Home & Garden",
    "10": "Home & Garden",
    "4": "Sports",
    "8": "Sports",
    "12": "Sports",
    "11": "Books",
  }
  return map[id] ?? "All"
}
