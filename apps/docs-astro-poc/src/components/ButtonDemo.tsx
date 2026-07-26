import { createSignal } from "solid-js"

export default function ButtonDemo() {
  const [count, setCount] = createSignal(0)

  return (
    <div class="demo-container p-4 border rounded">
      <button
        type="button"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setCount((c) => c + 1)}
      >
        Clicked {count()} times
      </button>
    </div>
  )
}
