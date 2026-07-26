import { useParams } from "@solidjs/router"
import { Show } from "solid-js"
import { A } from "@solidjs/router"
import { getPrimitive } from "../../lib/primitives"
import { CodeBlock } from "../../components/code-block"
import { ComponentPreview } from "../../components/component-preview"
import { demos } from "../../demos"

export default function PrimitivePage() {
  const params = useParams<{ name: string }>()
  const primitive = () => getPrimitive(params.name)

  return (
    <Show when={primitive()} fallback={<NotFound name={params.name} />}>
      {(p) => {
        const demo = () => demos[p().name]
        return (
          <div class="space-y-8">
            {/* Title */}
            <div class="space-y-2">
              <h1 class="text-3xl font-bold tracking-tight">{p().label}</h1>
              <p class="text-lg text-[hsl(var(--muted-foreground))]">{p().description}</p>
            </div>

            {/* Preview */}
            <Show
              when={demo()}
              fallback={
                <ComponentPreview code={getExampleCode(p().name, p().label)}>
                  <DemoPlaceholder name={p().name} label={p().label} />
                </ComponentPreview>
              }
            >
              {(d) => <ComponentPreview code={d().code}>{d().component()}</ComponentPreview>}
            </Show>

            {/* Installation */}
            <section class="space-y-3">
              <h2 class="text-xl font-semibold tracking-tight">Installation</h2>
              <CodeBlock code={`pnpm add ${p().packageName}`} lang="bash" />
            </section>

            {/* Usage */}
            <section class="space-y-3">
              <h2 class="text-xl font-semibold tracking-tight">Usage</h2>
              <CodeBlock
                code={`import { ${p().label} } from "${p().packageName}"`}
                lang="typescript"
                filename={`example.tsx`}
              />
            </section>

            {/* API */}
            <section class="space-y-3">
              <h2 class="text-xl font-semibold tracking-tight">API Reference</h2>
              <div class="rounded-lg border border-[hsl(var(--border))] p-4">
                <p class="text-sm text-[hsl(var(--muted-foreground))]">
                  See the full TypeScript API in the{" "}
                  <code class="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono text-xs">
                    {p().packageName}
                  </code>{" "}
                  package source.
                </p>
              </div>
            </section>
          </div>
        )
      }}
    </Show>
  )
}

function NotFound(props: { name: string }) {
  return (
    <div class="space-y-4">
      <h1 class="text-2xl font-bold">Primitive not found</h1>
      <p class="text-[hsl(var(--muted-foreground))]">
        No primitive named{" "}
        <code class="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono text-xs">
          {props.name}
        </code>{" "}
        exists.
      </p>
      <A
        href="/"
        class="inline-flex items-center text-sm text-[hsl(var(--primary))] underline underline-offset-4"
      >
        Browse all primitives
      </A>
    </div>
  )
}

function DemoPlaceholder(props: { name: string; label: string }) {
  return (
    <div class="flex flex-col items-center gap-2 text-center">
      <div class="rounded-lg border-2 border-dashed border-[hsl(var(--border))] p-8">
        <p class="text-sm font-medium text-[hsl(var(--foreground))]">{props.label}</p>
        <p class="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
          Live demo — dogfooding @solidiom/{props.name}
        </p>
      </div>
    </div>
  )
}

function getExampleCode(name: string, label: string): string {
  return `import { ${label} } from "@solidiom/${name}"

function Example() {
  return (
    <${label}>
      {/* Your content here */}
    </${label}>
  )
}`
}
