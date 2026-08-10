import type { JSX } from "solid-js"

interface PriceBadgeProps {
  price: string
  originalPrice?: string
}

export function PriceBadge(props: PriceBadgeProps): JSX.Element {
  return (
    <div class="flex flex-col items-end">
      <span class="text-sm font-bold text-gray-900">{props.price}</span>
      {props.originalPrice && (
        <span class="text-xs text-gray-400 line-through">{props.originalPrice}</span>
      )}
    </div>
  )
}
