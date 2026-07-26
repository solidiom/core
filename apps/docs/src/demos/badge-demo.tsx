import * as Badge from "@solidiom/badge"

export function BadgeDemo() {
  return (
    <div class="flex flex-wrap items-center gap-3">
      <Badge.Root class="inline-flex items-center rounded-md border border-transparent bg-[hsl(var(--primary))] px-2.5 py-0.5 text-xs font-semibold text-[hsl(var(--primary-foreground))] transition-colors hover:bg-[hsl(var(--primary)/0.8)]">
        Default
      </Badge.Root>
      <Badge.Root class="inline-flex items-center rounded-md border border-transparent bg-[hsl(var(--secondary))] px-2.5 py-0.5 text-xs font-semibold text-[hsl(var(--secondary-foreground))] transition-colors hover:bg-[hsl(var(--secondary)/0.8)]">
        Secondary
      </Badge.Root>
      <Badge.Root class="inline-flex items-center rounded-md border border-transparent bg-[hsl(var(--destructive))] px-2.5 py-0.5 text-xs font-semibold text-[hsl(var(--destructive-foreground))] transition-colors hover:bg-[hsl(var(--destructive)/0.8)]">
        Destructive
      </Badge.Root>
      <Badge.Root class="inline-flex items-center rounded-md border border-[hsl(var(--border))] px-2.5 py-0.5 text-xs font-semibold text-[hsl(var(--foreground))]">
        Outline
      </Badge.Root>
    </div>
  )
}

export const badgeDemoCode = `import * as Badge from "@solidiom/badge"

function BadgeExample() {
  return (
    <div class="flex flex-wrap items-center gap-3">
      <Badge.Root class="s2-badge--default">Default</Badge.Root>
      <Badge.Root class="s2-badge--secondary">Secondary</Badge.Root>
      <Badge.Root class="s2-badge--destructive">Destructive</Badge.Root>
      <Badge.Root class="s2-badge--outline">Outline</Badge.Root>
    </div>
  )
}

// Or with the Tailwind recipe:
//   import { StyledBadge } from "@solidiom/recipes-tailwind"
//   import "@solidiom/recipes-tailwind/styles/badge.css"
//   <StyledBadge variant="secondary">Secondary</StyledBadge>
`
