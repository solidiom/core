import { createSignal, type JSX } from "solid-js"
import { A } from "@solidjs/router"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as Input from "@solidiom/input"
import * as Button from "@solidiom/button"
import { CartSummary } from "../components/CartSummary"

interface CartItem {
  id: string
  name: string
  price: string
  quantity: number
}

const INITIAL_ITEMS: CartItem[] = [
  { id: "1", name: "Wireless Earbuds", price: "$49.99", quantity: 1 },
  { id: "2", name: "Leather Wallet", price: "$29.99", quantity: 2 },
  { id: "3", name: "Canvas Sneakers", price: "$59.99", quantity: 1 },
]

export function Cart(): JSX.Element {
  const [items, setItems] = createSignal<CartItem[]>(INITIAL_ITEMS)
  const [discountCode, setDiscountCode] = createSignal("")

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
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
            <Breadcrumb.Link href="/cart" current class="text-sm font-medium text-gray-900">
              Cart
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <h1 class="text-2xl font-bold text-gray-900">Shopping Cart</h1>
      <p class="mt-1 text-sm text-gray-500">Review your items and proceed to checkout.</p>

      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-4">
          {items().map((item) => (
            <Card.Root class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p class="text-sm text-gray-500">{item.price} each</p>
                </div>
                <div class="flex items-center gap-3">
                  <div class="flex items-center rounded-md border border-gray-300">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span class="px-2 text-sm font-medium text-gray-900">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    class="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </Card.Root>
          ))}

          {items().length === 0 && (
            <p class="text-center text-sm text-gray-500">Your cart is empty.</p>
          )}

          <div class="flex items-center gap-3">
            <Input.Root
              value={discountCode()}
              onValueChange={setDiscountCode}
              placeholder="Discount code"
              class="flex-1"
            />
            <Button.Root variant="secondary">Apply</Button.Root>
          </div>
        </div>

        <div>
          <CartSummary items={items()} />
          <div class="mt-4">
            <A href="/checkout">
              <Button.Root class="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                Proceed to Checkout
              </Button.Root>
            </A>
          </div>
        </div>
      </div>
    </div>
  )
}
