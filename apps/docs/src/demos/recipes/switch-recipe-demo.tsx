import { createSignal } from "solid-js"
import { StyledSwitch } from "@solidiom/recipes-tailwind"

export function SwitchRecipeDemo() {
  const [checked, setChecked] = createSignal(false)

  return (
    <div class="flex items-center gap-3">
      <StyledSwitch checked={checked} onCheckedChange={setChecked} />
      <span class="text-sm text-[hsl(var(--muted-foreground))]">{checked() ? "On" : "Off"}</span>
    </div>
  )
}

export const switchRecipeDemoCode = `import { createSignal } from "solid-js"
import { StyledSwitch } from "@solidiom/recipes-tailwind"
import "@solidiom/recipes-tailwind/styles/switch.css"

function Example() {
  const [checked, setChecked] = createSignal(false)

  return (
    <div class="flex items-center gap-3">
      <StyledSwitch checked={checked} onCheckedChange={setChecked} />
      <span>{checked() ? "On" : "Off"}</span>
    </div>
  )
}`
