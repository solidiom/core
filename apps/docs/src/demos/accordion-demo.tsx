import * as Accordion from "@solidiom/accordion"
import { createSignal } from "solid-js"

export function AccordionDemo() {
  const [value, setValue] = createSignal(["item-1"])

  return (
    <div class="w-full max-w-md">
      <Accordion.Root type="single" value={value} onValueChange={(v) => setValue(v)}>
        <Accordion.Item value="item-1">
          <Accordion.Trigger>
            <span class="flex w-full items-center justify-between border-b border-[hsl(var(--border))] px-4 py-3 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
              What is Solidiom?
              <ChevronIcon />
            </span>
          </Accordion.Trigger>
          <Accordion.Content>
            <div class="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--muted-foreground))]">
              Solidiom is a headless, accessible UI primitive library for Solid 2. It provides
              unstyled components that you compose with your own design system.
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="item-2">
          <Accordion.Trigger>
            <span class="flex w-full items-center justify-between border-b border-[hsl(var(--border))] px-4 py-3 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
              How does it work?
              <ChevronIcon />
            </span>
          </Accordion.Trigger>
          <Accordion.Content>
            <div class="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--muted-foreground))]">
              Each primitive manages state, accessibility, and keyboard interactions. You provide
              the visual layer via CSS classes or a styling framework like Tailwind.
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="item-3">
          <Accordion.Trigger>
            <span class="flex w-full items-center justify-between border-b border-[hsl(var(--border))] px-4 py-3 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
              Getting Started
              <ChevronIcon />
            </span>
          </Accordion.Trigger>
          <Accordion.Content>
            <div class="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--muted-foreground))]">
              Install with{" "}
              <code class="rounded bg-[hsl(var(--muted))] px-1 py-0.5 font-mono text-xs">
                pnpm add @solidiom/accordion
              </code>{" "}
              and import the parts you need.
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}

function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="size-4 shrink-0 text-[hsl(var(--muted-foreground))]"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export const accordionDemoCode = `import * as Accordion from "@solidiom/accordion"

function AccordionExample() {
  return (
    <Accordion.Root type="single" defaultValue={["item-1"]}>
      <Accordion.Item value="item-1">
        <Accordion.Trigger>What is Solidiom?</Accordion.Trigger>
        <Accordion.Content>
          Solidiom is a headless UI primitive library for Solid 2.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>How does it work?</Accordion.Trigger>
        <Accordion.Content>
          Each primitive manages state, accessibility, and keyboard interactions.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}`
