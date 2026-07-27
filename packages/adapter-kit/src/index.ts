/**
 * @solidiom/adapter-kit — Adapter authoring kit.
 *
 * Provides:
 * - Scaffold template for creating new adapters (see templates/)
 * - Conformance harness for validating adapter boundary compliance
 *
 * Adapters in Solidiom are integrations with framework-neutral specialized engines
 * (positioning, virtualization, table models, date math, carousel physics).
 * They must NOT:
 * - Import primitive systems (Kobalte, Corvu, Ark, Zag, Radix, etc.)
 * - Output JSX attribute bags, classes, ARIA, or public DOM parts
 * - Depend on Solid-specific APIs (solid-js, @solidjs/web)
 *
 * They MUST:
 * - Return capability snapshots or model data
 * - Be replaceable without editing primitive APIs
 * - Pass capability, lifecycle, and styling-boundary conformance
 */

export { type AdapterManifest, type CapabilityDeclaration } from "./types"
export { createAdapterManifest, ADAPTER_TEMPLATE_FILES } from "./scaffold"
export { runConformance, type ConformanceResult, type ConformanceViolation } from "./conformance"
