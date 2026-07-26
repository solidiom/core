import { StyledDialog } from "@solidiom/recipes-tailwind"

export function DialogRecipeDemo() {
  return (
    <StyledDialog
      trigger={
        <button class="inline-flex h-10 items-center justify-center rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] shadow">
          Open Dialog
        </button>
      }
      title="Styled Dialog"
      description="This dialog is rendered by the StyledDialog recipe wrapper."
    >
      <p class="text-sm text-[hsl(var(--muted-foreground))]">
        All styling comes from the imported CSS recipe — no inline classes needed on the dialog
        parts.
      </p>
    </StyledDialog>
  )
}

export const dialogRecipeDemoCode = `import { StyledDialog } from "@solidiom/recipes-tailwind"
import "@solidiom/recipes-tailwind/styles/dialog.css"

function Example() {
  return (
    <StyledDialog
      trigger={<button>Open Dialog</button>}
      title="Styled Dialog"
      description="Pre-styled via the recipe stylesheet."
    >
      <p>Dialog body content here.</p>
    </StyledDialog>
  )
}`
