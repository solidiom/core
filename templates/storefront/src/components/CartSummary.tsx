import type { JSX } from "@solidjs/web"
import * as Card from "@solidiom/card"

interface CartItem {
  id: string
  name: string
  price: string
  quantity: number
}

interface CartSummaryProps {
  items: CartItem[]
}

function formatPrice(total: number): string {
  return "$" + total.toFixed(2)
}

export function CartSummary(props: CartSummaryProps): JSX.Element {
  const subtotal = () =>
    props.items.reduce((sum, item) => {
      const price = parseFloat(item.price.replace("$", ""))
      return sum + price * item.quantity
    }, 0)

  const shipping = () => (subtotal() > 50 ? 0 : 5.99)
  const tax = () => subtotal() * 0.08
  const total = () => subtotal() + shipping() + tax()

  return (
    <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 class="text-sm font-semibold text-gray-900">Order Summary</h3>
      <dl class="mt-4 space-y-3">
        <div class="flex items-center justify-between text-sm">
          <dt class="text-gray-500">Subtotal</dt>
          <dd class="font-medium text-gray-900">{formatPrice(subtotal())}</dd>
        </div>
        <div class="flex items-center justify-between text-sm">
          <dt class="text-gray-500">Shipping</dt>
          <dd class={`font-medium ${shipping() === 0 ? "text-green-600" : "text-gray-900"}`}>
            {shipping() === 0 ? "Free" : formatPrice(shipping())}
          </dd>
        </div>
        <div class="flex items-center justify-between text-sm">
          <dt class="text-gray-500">Tax</dt>
          <dd class="font-medium text-gray-900">{formatPrice(tax())}</dd>
        </div>
        <div class="flex items-center justify-between border-t border-gray-200 pt-3">
          <dt class="text-base font-semibold text-gray-900">Total</dt>
          <dd class="text-base font-bold text-gray-900">{formatPrice(total())}</dd>
        </div>
      </dl>
    </Card.Root>
  )
}
