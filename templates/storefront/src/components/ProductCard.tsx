import type { JSX } from "solid-js"
import { A } from "@solidjs/router"
import * as Card from "@solidiom/card"

interface ProductCardProps {
  id: string
  name: string
  price: string
  category: string
  badge?: string
}

export function ProductCard(props: ProductCardProps): JSX.Element {
  return (
    <Card.Root class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div class="relative">
        <div class="aspect-video bg-gray-100 flex items-center justify-center">
          <span class="text-gray-400 text-sm">No image</span>
        </div>
        {props.badge && (
          <span class="absolute top-2 right-2 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-medium text-white">
            {props.badge}
          </span>
        )}
      </div>
      <Card.Content class="p-4">
        <p class="text-xs text-gray-500">{props.category}</p>
        <A href={`/product/${props.id}`} class="mt-1 block text-sm font-semibold text-gray-900 hover:text-indigo-600">
          {props.name}
        </A>
        <p class="mt-2 text-sm font-bold text-gray-900">{props.price}</p>
      </Card.Content>
    </Card.Root>
  )
}
