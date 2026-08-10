import type { JSX } from "solid-js"
import * as Checkbox from "@solidiom/checkbox"

export function FilterBar(props: {
  categories: { label: string; checked: boolean }[];
  types: { label: string; checked: boolean }[];
  onCategoryToggle: (index: number) => void;
  onTypeToggle: (index: number) => void;
}): JSX.Element {
  return (
    <div class="space-y-4">
      <div class="rounded-lg border border-gray-200 bg-white px-4 py-3">
        <p class="text-sm font-medium text-gray-900">Categories</p>
        <div class="mt-3 flex flex-wrap gap-3">
          {props.categories.map((cat, i) => (
            <Checkbox.Root checked={() => cat.checked} onCheckedChange={() => props.onCategoryToggle(i)}>
              <Checkbox.Label class="text-sm text-gray-700">{cat.label}</Checkbox.Label>
            </Checkbox.Root>
          ))}
        </div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white px-4 py-3">
        <p class="text-sm font-medium text-gray-900">Content Types</p>
        <div class="mt-3 flex flex-wrap gap-3">
          {props.types.map((type, i) => (
            <Checkbox.Root checked={() => type.checked} onCheckedChange={() => props.onTypeToggle(i)}>
              <Checkbox.Label class="text-sm text-gray-700">{type.label}</Checkbox.Label>
            </Checkbox.Root>
          ))}
        </div>
      </div>
    </div>
  )
}
