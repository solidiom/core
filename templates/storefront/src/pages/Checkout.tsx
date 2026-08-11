import { createSignal, type JSX } from "solid-js"
import * as Breadcrumb from "@solidiom/breadcrumb"
import * as Card from "@solidiom/card"
import * as Input from "@solidiom/input"
import * as Button from "@solidiom/button"
import * as Alert from "@solidiom/alert"

export function Checkout(): JSX.Element {
  const [shippingName, setShippingName] = createSignal("")
  const [shippingAddress, setShippingAddress] = createSignal("")
  const [shippingCity, setShippingCity] = createSignal("")
  const [shippingZip, setShippingZip] = createSignal("")
  const [cardNumber, setCardNumber] = createSignal("")
  const [cardExpiry, setCardExpiry] = createSignal("")
  const [cardCvv, setCardCvv] = createSignal("")
  const [submitted, setSubmitted] = createSignal(false)

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted()) {
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
              <Breadcrumb.Link href="/checkout" current class="text-sm font-medium text-gray-900">
                Checkout
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>

        <Alert.Root type="success" class="mb-6">
          <Alert.Title>Order confirmed!</Alert.Title>
          <Alert.Description>
            Your order has been placed successfully. You will receive a confirmation email shortly.
          </Alert.Description>
        </Alert.Root>

        <h1 class="text-2xl font-bold text-gray-900">Thank You</h1>
        <p class="mt-1 text-sm text-gray-500">Order #ORD-2026-0812 has been confirmed.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Breadcrumb.Root class="mb-4">
        <Breadcrumb.List class="flex items-center gap-2">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/" class="text-sm text-gray-500 hover:text-gray-700">
              Home
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator class="text-gray-400">/</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/cart" class="text-sm text-gray-500 hover:text-gray-700">
              Cart
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator class="text-gray-400">/</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/checkout" current class="text-sm font-medium text-gray-900">
              Checkout
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <h1 class="text-2xl font-bold text-gray-900">Checkout</h1>
      <p class="mt-1 text-sm text-gray-500">
        Complete your order by filling in shipping and payment details.
      </p>

      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-sm font-semibold text-gray-900">Shipping Information</h2>
          <div class="mt-4 space-y-4">
            <Input.Root
              label="Full Name"
              value={shippingName()}
              onValueChange={setShippingName}
              placeholder="John Doe"
              required
            />
            <Input.Root
              label="Address"
              value={shippingAddress()}
              onValueChange={setShippingAddress}
              placeholder="123 Main St"
              required
            />
            <div class="grid grid-cols-2 gap-4">
              <Input.Root
                label="City"
                value={shippingCity()}
                onValueChange={setShippingCity}
                placeholder="New York"
                required
              />
              <Input.Root
                label="ZIP Code"
                value={shippingZip()}
                onValueChange={setShippingZip}
                placeholder="10001"
                required
              />
            </div>
          </div>
        </Card.Root>

        <Card.Root class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-sm font-semibold text-gray-900">Payment Information</h2>
          <div class="mt-4 space-y-4">
            <Input.Root
              label="Card Number"
              value={cardNumber()}
              onValueChange={setCardNumber}
              placeholder="4242 4242 4242 4242"
              required
            />
            <div class="grid grid-cols-2 gap-4">
              <Input.Root
                label="Expiry"
                value={cardExpiry()}
                onValueChange={setCardExpiry}
                placeholder="MM/YY"
                required
              />
              <Input.Root
                label="CVV"
                value={cardCvv()}
                onValueChange={setCardCvv}
                placeholder="123"
                type="password"
                required
              />
            </div>
          </div>

          <div class="mt-6 border-t border-gray-200 pt-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Wireless Earbuds x1</span>
              <span class="font-medium text-gray-900">$49.99</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Leather Wallet x2</span>
              <span class="font-medium text-gray-900">$59.98</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Canvas Sneakers x1</span>
              <span class="font-medium text-gray-900">$59.99</span>
            </div>
            <div class="mt-2 flex items-center justify-between border-t border-gray-200 pt-2">
              <span class="font-semibold text-gray-900">Total</span>
              <span class="text-base font-bold text-gray-900">$169.96</span>
            </div>
          </div>

          <div class="mt-6">
            <Button.Root type="submit" class="w-full bg-indigo-600 text-white hover:bg-indigo-700">
              Place Order
            </Button.Root>
          </div>
        </Card.Root>
      </div>
    </form>
  )
}
