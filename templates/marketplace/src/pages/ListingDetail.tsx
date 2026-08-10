import { type JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as Button from "@solidiom/button"
import { PriceBadge } from "../components/PriceBadge"

const PRODUCT = {
  id: "1",
  name: "Wireless Headphones Pro",
  price: "$79.99",
  originalPrice: "$99.99",
  seller: "AudioTech",
  rating: 4.5,
  reviews: 128,
  description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and Hi-Res Audio certification. Comfortable over-ear design with memory foam cushions.",
  specs: [
    { label: "Battery Life", value: "30 hours" },
    { label: "Connectivity", value: "Bluetooth 5.2" },
    { label: "Driver Size", value: "40mm" },
    { label: "Weight", value: "250g" },
  ],
}

const REVIEWS = [
  { author: "Mike R.", rating: 5, date: "2026-07-28", text: "Best headphones I've ever owned. The noise cancellation is incredible." },
  { author: "Sarah L.", rating: 4, date: "2026-07-15", text: "Great sound quality, but a bit tight on my head. Breaking in nicely though." },
  { author: "Tom H.", rating: 4, date: "2026-07-02", text: "Solid build, excellent battery life. Wish they came in more colors." },
]

export function ListingDetail(): JSX.Element {
  return (
    <div>
      <Breadcrumb.Root class="mb-4">
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" class="text-sm text-gray-500 hover:text-gray-700">Browse</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator class="text-gray-400">/</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/listing/1" current class="text-sm font-medium text-gray-900">{PRODUCT.name}</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div class="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
          <span class="text-gray-400">Product image</span>
        </div>

        <div>
          <h1 class="text-2xl font-bold text-gray-900">{PRODUCT.name}</h1>
          <p class="mt-1 text-sm text-gray-500">by {PRODUCT.seller}</p>

          <div class="mt-4 flex items-center gap-4">
            <PriceBadge price={PRODUCT.price} originalPrice={PRODUCT.originalPrice} />
            <div class="flex items-center gap-1">
              <span class="text-sm text-yellow-500">{"★".repeat(Math.floor(PRODUCT.rating))}</span>
              <span class="text-sm text-gray-500">({PRODUCT.reviews} reviews)</span>
            </div>
          </div>

          <p class="mt-6 text-sm text-gray-600">{PRODUCT.description}</p>

          <div class="mt-6">
            <h3 class="text-sm font-medium text-gray-900">Specifications</h3>
            <dl class="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
              {PRODUCT.specs.map((spec) => (
                <>
                  <dt class="text-sm text-gray-500">{spec.label}</dt>
                  <dd class="text-sm font-medium text-gray-900">{spec.value}</dd>
                </>
              ))}
            </dl>
          </div>

          <div class="mt-8 flex gap-3">
            <Button.Root class="bg-indigo-600 text-white hover:bg-indigo-700">Add to Cart</Button.Root>
            <Button.Root variant="secondary">Buy Now</Button.Root>
          </div>
        </div>
      </div>

      <div class="mt-12">
        <h2 class="text-lg font-semibold text-gray-900">Customer Reviews</h2>
        <div class="mt-4 space-y-4">
          {REVIEWS.map((review) => (
            <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white">
                    {review.author[0]}
                  </span>
                  <span class="text-sm font-medium text-gray-900">{review.author}</span>
                </div>
                <span class="text-xs text-gray-500">{review.date}</span>
              </div>
              <div class="mt-2 flex items-center gap-1">
                <span class="text-xs text-yellow-500">{"★".repeat(review.rating)}</span>
              </div>
              <p class="mt-2 text-sm text-gray-600">{review.text}</p>
            </Card.Root>
          ))}
        </div>
      </div>
    </div>
  )
}
