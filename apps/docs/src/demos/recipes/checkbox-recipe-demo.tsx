import { StyledCheckbox } from "@solidiom/recipes-tailwind"

export function CheckboxRecipeDemo() {
  return (
    <div class="flex items-center gap-6">
      <label class="flex items-center gap-2 text-sm">
        <StyledCheckbox defaultChecked={true} />
        Checked
      </label>
      <label class="flex items-center gap-2 text-sm">
        <StyledCheckbox />
        Unchecked
      </label>
      <label class="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
        <StyledCheckbox disabled />
        Disabled
      </label>
    </div>
  )
}

export const checkboxRecipeDemoCode = `import { StyledCheckbox } from "@solidiom/recipes-tailwind"
import "@solidiom/recipes-tailwind/styles/checkbox.css"

function Example() {
  return (
    <label class="flex items-center gap-2">
      <StyledCheckbox defaultChecked={true} />
      Accept terms
    </label>
  )
}`
