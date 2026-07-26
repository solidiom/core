import { createSignal, onSettled, For, Show } from "solid-js"
import type {
  BenchReport,
  BundleSizeResult,
  ThroughputResult,
  InteractionResult,
} from "@solidiom/bench"
import { loadReport } from "../lib/load-report"

export default function PerformancePage() {
  const [report, setReport] = createSignal<BenchReport | null>(null)

  onSettled(() => {
    loadReport().then((data) => setReport(data))
  })

  return (
    <div class="space-y-8">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">Performance Dashboard</h1>
        <p class="text-lg text-[hsl(var(--muted-foreground))]">
          Benchmark results from{" "}
          <code class="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono text-xs">
            @solidiom/bench
          </code>
          . Data from CI or local{" "}
          <code class="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono text-xs">
            pnpm bench:report
          </code>
          .
        </p>
      </div>

      <Show when={report()} fallback={<LoadingSkeleton />}>
        {(r) => (
          <div class="space-y-8">
            <ReportMeta report={r()} />
            <ThroughputSection results={r().throughput} />
            <BundleSection results={r().bundle} />
            <InteractionSection results={r().interaction} />
          </div>
        )}
      </Show>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div class="space-y-4">
      <div class="h-8 w-48 animate-pulse rounded bg-[hsl(var(--muted))]" />
      <div class="h-32 animate-pulse rounded bg-[hsl(var(--muted))]" />
    </div>
  )
}

function ReportMeta(props: { report: BenchReport }) {
  return (
    <div class="rounded-lg border border-[hsl(var(--border))] p-4">
      <div class="flex flex-wrap gap-6 text-sm">
        <div>
          <span class="text-[hsl(var(--muted-foreground))]">Generated: </span>
          <span class="font-medium">{new Date(props.report.generatedAt).toLocaleString()}</span>
        </div>
        <Show when={props.report.commitSha}>
          {(sha) => (
            <div>
              <span class="text-[hsl(var(--muted-foreground))]">Commit: </span>
              <code class="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono text-xs">
                {sha().slice(0, 8)}
              </code>
            </div>
          )}
        </Show>
      </div>
    </div>
  )
}

function ThroughputSection(props: { results: ThroughputResult[] }) {
  return (
    <section class="space-y-3">
      <h2 class="text-xl font-semibold tracking-tight">Throughput</h2>
      <Show when={props.results.length > 0} fallback={<EmptyState text="No throughput data." />}>
        <div class="overflow-x-auto rounded-lg border border-[hsl(var(--border))]">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]">
                <th class="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">
                  Benchmark
                </th>
                <th class="px-4 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">
                  ops/sec
                </th>
                <th class="px-4 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">
                  avg (ns)
                </th>
                <th class="px-4 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">
                  samples
                </th>
              </tr>
            </thead>
            <tbody>
              <For each={props.results}>
                {(result) => (
                  <tr class="border-b border-[hsl(var(--border))] last:border-0">
                    <td class="px-4 py-3 font-medium">{result.name}</td>
                    <td class="px-4 py-3 text-right font-mono text-xs">
                      {result.opsPerSecond.toLocaleString()}
                    </td>
                    <td class="px-4 py-3 text-right font-mono text-xs">
                      {result.avgNs.toFixed(1)}
                    </td>
                    <td class="px-4 py-3 text-right font-mono text-xs text-[hsl(var(--muted-foreground))]">
                      {result.samples.toLocaleString()}
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </section>
  )
}

function BundleSection(props: { results: BundleSizeResult[] }) {
  return (
    <section class="space-y-3">
      <h2 class="text-xl font-semibold tracking-tight">Bundle Size</h2>
      <Show when={props.results.length > 0} fallback={<EmptyState text="No bundle data." />}>
        <div class="overflow-x-auto rounded-lg border border-[hsl(var(--border))]">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]">
                <th class="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">
                  Package
                </th>
                <th class="px-4 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">
                  Raw
                </th>
                <th class="px-4 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">
                  Gzip
                </th>
                <th class="px-4 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">
                  Budget
                </th>
                <th class="px-4 py-3 text-center font-medium text-[hsl(var(--muted-foreground))]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <For each={props.results}>
                {(result) => (
                  <tr class="border-b border-[hsl(var(--border))] last:border-0">
                    <td class="px-4 py-3 font-medium">{result.name}</td>
                    <td class="px-4 py-3 text-right font-mono text-xs">
                      {formatBytes(result.sizeBytes)}
                    </td>
                    <td class="px-4 py-3 text-right font-mono text-xs">
                      {formatBytes(result.gzipBytes)}
                    </td>
                    <td class="px-4 py-3 text-right font-mono text-xs text-[hsl(var(--muted-foreground))]">
                      {formatBytes(result.limitBytes)}
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span
                        class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          result.passed
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {result.passed ? "Pass" : "Over"}
                      </span>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </section>
  )
}

function InteractionSection(props: { results: InteractionResult[] }) {
  return (
    <section class="space-y-3">
      <h2 class="text-xl font-semibold tracking-tight">Interaction Benchmarks</h2>
      <Show when={props.results.length > 0} fallback={<EmptyState text="No interaction data." />}>
        <div class="grid gap-4 sm:grid-cols-2">
          <For each={props.results}>
            {(result) => (
              <div class="rounded-lg border border-[hsl(var(--border))] p-4">
                <h3 class="mb-2 font-medium">{result.name}</h3>
                <div class="grid gap-1">
                  <For each={Object.entries(result.metrics)}>
                    {([key, value]) => (
                      <div class="flex justify-between text-sm">
                        <span class="text-[hsl(var(--muted-foreground))]">{key}</span>
                        <span class="font-mono text-xs">{value}</span>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </section>
  )
}

function EmptyState(props: { text: string }) {
  return (
    <div class="rounded-lg border border-dashed border-[hsl(var(--border))] p-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
      {props.text}
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}
