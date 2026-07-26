import { StyledButton } from "@solidiom/recipes-tailwind"

export function ButtonRecipeDemo() {
  return (
    <div class="flex items-center gap-3">
      <StyledButton>Primary</StyledButton>
      <StyledButton disabled>Disabled</StyledButton>
    </div>
  )
}

export const buttonRecipeDemoCode = `import { StyledButton } from "@solidiom/recipes-tailwind"
import "@solidiom/recipes-tailwind/styles/button.css"

function Example() {
  return (
    <div class="flex items-center gap-3">
      <StyledButton>Primary</StyledButton>
      <StyledButton disabled>Disabled</StyledButton>
    </div>
  )
}`
