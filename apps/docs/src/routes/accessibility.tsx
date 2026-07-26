import { createSignal, onSettled, For, Show } from "solid-js"
import {
  loadA11yReport,
  type A11yReport,
  type PrimitiveA11yEntry,
  type AuditStatus,
} from "../lib/load-a11y-report"

export default function AccessibilityPage() {
  const [report, setReport] = createSignal<A11yReport | null>(null)

  onSettled(() => {
    loadA11yReport().then((data) => setReport(data))
  })

  return (
    <div class="space-y-8">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">Accessibility</h1>
        <p class="text-lg text-[hsl(var(--muted-foreground))]">
          Automated and manual accessibility audit results per primitive. Data from CI axe scans,
          Playwright keyboard tests, and manual AT verification.
        </p>
      </div>

      <Show when={report()} fallback={<LoadingSkeleton />}>
        {(r) => (
          <div class="space-y-8">
            <ReportMeta generatedAt={r().generatedAt} />
            <SummaryCards primitives={r().primitives} />
            <PrimitiveTable primitives={r().primitives} />
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
      <div class="h-64 animate-pulse rounded bg-[hsl(var(--muted))]" />
    </div>
  )
}

function ReportMeta(props: { generatedAt: string }) {
  return (
    <div class="rounded-lg border border-[hsl(var(--border))] p-4">
      <div class="text-sm">
        <span class="text-[hsl(var(--muted-foreground))]">Last updated: </span>
        <span class="font-medium">{new Date(props.generatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}

function SummaryCards(props: { primitives: PrimitiveA11yEntry[] }) {
  const total = () => props.primitives.length
  const axePass = () => props.primitives.filter((p) => p.axeScan === "pass").length
  const keyboardPass = () => props.primitives.filter((p) => p.keyboardNav === "pass").length
  const atComplete = () =>
    props.primitives.filter(
      (p) =>
        p.atAudit.voiceOver === "pass" && p.atAudit.nvda === "pass" && p.atAudit.jaws === "pass",
    ).length

  return (
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard label="Total Primitives" value={total()} />
      <SummaryCard label="axe Scans Passing" value={axePass()} total={total()} />
      <SummaryCard label="Keyboard Audited" value={keyboardPass()} total={total()} />
      <SummaryCard label="Full AT Sign-off" value={atComplete()} total={total()} />
    </div>
  )
}

function SummaryCard(props: { label: string; value: number; total?: number }) {
  return (
    <div class="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
      <p class="text-sm text-[hsl(var(--muted-foreground))]">{props.label}</p>
      <p class="mt-1 text-2xl font-bold">
        {props.value}
        <Show when={props.total !== undefined}>
          <span class="text-base font-normal text-[hsl(var(--muted-foreground))]">
            /{props.total}
          </span>
        </Show>
      </p>
    </div>
  )
}

function PrimitiveTable(props: { primitives: PrimitiveA11yEntry[] }) {
  return (
    <section class="space-y-3">
      <h2 class="text-xl font-semibold tracking-tight">Per-Primitive Results</h2>
      <div class="overflow-x-auto rounded-lg border border-[hsl(var(--border))]">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]">
              <th class="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">
                Primitive
              </th>
              <th class="px-4 py-3 text-center font-medium text-[hsl(var(--muted-foreground))]">
                axe Scan
              </th>
              <th class="px-4 py-3 text-center font-medium text-[hsl(var(--muted-foreground))]">
                Keyboard
              </th>
              <th class="px-4 py-3 text-center font-medium text-[hsl(var(--muted-foreground))]">
                Playwright
              </th>
              <th class="px-4 py-3 text-center font-medium text-[hsl(var(--muted-foreground))]">
                VoiceOver
              </th>
              <th class="px-4 py-3 text-center font-medium text-[hsl(var(--muted-foreground))]">
                NVDA
              </th>
              <th class="px-4 py-3 text-center font-medium text-[hsl(var(--muted-foreground))]">
                JAWS
              </th>
            </tr>
          </thead>
          <tbody>
            <For each={props.primitives}>
              {(entry) => (
                <tr class="border-b border-[hsl(var(--border))] last:border-0">
                  <td class="px-4 py-3 font-medium">{entry.label}</td>
                  <td class="px-4 py-3 text-center">
                    <StatusBadge status={entry.axeScan} />
                  </td>
                  <td class="px-4 py-3 text-center">
                    <StatusBadge status={entry.keyboardNav} />
                  </td>
                  <td class="px-4 py-3 text-center">
                    <StatusBadge status={entry.playwrightTests} />
                  </td>
                  <td class="px-4 py-3 text-center">
                    <StatusBadge status={entry.atAudit.voiceOver} />
                  </td>
                  <td class="px-4 py-3 text-center">
                    <StatusBadge status={entry.atAudit.nvda} />
                  </td>
                  <td class="px-4 py-3 text-center">
                    <StatusBadge status={entry.atAudit.jaws} />
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </section>
  )
}

function StatusBadge(props: { status: AuditStatus }) {
  const config = () => {
    switch (props.status) {
      case "pass":
        return {
          text: "Pass",
          classes: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        }
      case "fail":
        return {
          text: "Fail",
          classes: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        }
      case "partial":
        return {
          text: "Partial",
          classes: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        }
      case "not-tested":
        return {
          text: "—",
          classes: "bg-gray-100 text-gray-500 dark:bg-gray-800/30 dark:text-gray-500",
        }
    }
  }

  return (
    <span
      class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config().classes}`}
    >
      {config().text}
    </span>
  )
}
