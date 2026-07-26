/**
 * Aspect Ratio block — demonstrates native CSS aspect-ratio property.
 *
 * No JavaScript primitive needed. Modern browsers support aspect-ratio natively.
 */

export function AspectRatioBlock() {
  return (
    <div class="flex flex-wrap gap-4">
      <div class="w-48">
        <p class="mb-1 text-xs font-medium text-zinc-500">16:9 (Video)</p>
        <div
          class="w-full rounded-lg bg-zinc-200 flex items-center justify-center text-sm text-zinc-500"
          style={{ "aspect-ratio": "16/9" }}
        >
          16:9
        </div>
      </div>
      <div class="w-48">
        <p class="mb-1 text-xs font-medium text-zinc-500">1:1 (Square)</p>
        <div
          class="w-full rounded-lg bg-zinc-200 flex items-center justify-center text-sm text-zinc-500"
          style={{ "aspect-ratio": "1/1" }}
        >
          1:1
        </div>
      </div>
      <div class="w-48">
        <p class="mb-1 text-xs font-medium text-zinc-500">4:3 (Photo)</p>
        <div
          class="w-full rounded-lg bg-zinc-200 flex items-center justify-center text-sm text-zinc-500"
          style={{ "aspect-ratio": "4/3" }}
        >
          4:3
        </div>
      </div>
    </div>
  )
}

export const aspectRatioBlockCode = `// Aspect Ratio — use the native CSS property. No JS primitive needed.
//
// Tailwind: class="aspect-video" / class="aspect-square"
// Inline:   style={{ "aspect-ratio": "16/9" }}

function ResponsiveVideo() {
  return (
    <div style={{ "aspect-ratio": "16/9" }} class="w-full rounded-lg overflow-hidden">
      <iframe src="..." class="h-full w-full" />
    </div>
  )
}
`
