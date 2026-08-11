import type { JSX } from "solid-js"
import { A } from "@solidjs/router"
import * as Card from "@solidiom/card"
import { PriceBadge } from "./PriceBadge"

interface ProductCardProps {
  id: string
  name: string
  price: string
  originalPrice?: string
  seller: string
  rating: number
  reviews: number
  image?: string
}

export function ProductCard(props: ProductCardProps): JSX.Element {
  return (
    <Card.Root class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div class="aspect-video bg-gray-100 flex items-center justify-center">
        <span class="text-gray-400 text-sm">No image</span>
      </div>
      <Card.Content class="p-4">
        <div class="flex items-start justify-between gap-2">
          <A
            href={`/listing/${props.id}`}
            class="text-sm font-semibold text-gray-900 hover:text-indigo-600 line-clamp-1"
          >
            {props.name}
          </A>
          <PriceBadge price={props.price} originalPrice={props.originalPrice} />
        </div>
        <p class="mt-1 text-xs text-gray-500">by {props.seller}</p>
        <div class="mt-2 flex items-center gap-1">
          <span class="text-xs text-yellow-500">{"★".repeat(Math.floor(props.rating))}</span>
          <span class="text-xs text-gray-500">({props.reviews})</span>
        </div>
      </Card.Content>
    </Card.Root>
  )
}
