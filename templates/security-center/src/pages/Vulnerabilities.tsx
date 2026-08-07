import type { JSX } from "solid-js"

export function Vulnerabilities(): JSX.Element {
  return (
    <main class="min-h-screen p-6">
      <h1 class="text-2xl font-bold mb-6">Vulnerabilities</h1>
      <p>Security Center — scan results with CVE details, affected assets, and remediation guidance.</p>
    </main>
  )
}
