/**
 * FOUND-006: Scaffold documentation for catalog items (components, blocks, templates, themes).
 *
 * Creates EN + ES stubs into apps/site/src/content/{en,es}/{components,blocks,templates,themes}/
 * with real translationSourceHash values — never the 64-zero placeholder that caused I18N-005.
 *
 * Usage:
 *   pnpm exec tsx tools/scaffold-catalog-docs.ts <layer> <name> [--force]
 *   pnpm exec tsx tools/scaffold-catalog-docs.ts <layer> --all [--force]
 *   pnpm exec tsx tools/scaffold-catalog-docs.ts --all [--force]
 *
 * Layers: component, block, template, theme
 * --force: overwrite existing files (default: skip)
 * --all: scaffold all items in the specified layer(s)
 */

import { execSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { createHash } from "node:crypto"

const ROOT = join(import.meta.dirname ?? __dirname, "..")
const SITE_CONTENT = join(ROOT, "apps", "site", "src", "content")

// ─── Catalog data ────────────────────────────────────────────────────────────

/** §9.2 — 30 component names keyed by their registry name, with display label. */
const COMPONENTS: Record<string, { label: string; primitive: string }> = {
  accordion: { label: "Accordion", primitive: "@solidiom/accordion" },
  alert: { label: "Alert", primitive: "@solidiom/alert" },
  badge: { label: "Badge", primitive: "@solidiom/badge" },
  breadcrumb: { label: "Breadcrumb", primitive: "@solidiom/breadcrumb" },
  button: { label: "Button", primitive: "@solidiom/button" },
  card: { label: "Card", primitive: "@solidiom/card" },
  checkbox: { label: "Checkbox", primitive: "@solidiom/checkbox" },
  collapsible: { label: "Collapsible", primitive: "@solidiom/collapsible" },
  combobox: { label: "Combobox", primitive: "@solidiom/combobox" },
  "command-palette": { label: "Command Palette", primitive: "@solidiom/command-palette" },
  "context-menu": { label: "Context Menu", primitive: "@solidiom/context-menu" },
  "data-table": { label: "Data Table", primitive: "@solidiom/data-table" },
  "date-picker": { label: "Date Picker", primitive: "@solidiom/date-picker" },
  dialog: { label: "Dialog", primitive: "@solidiom/dialog" },
  drawer: { label: "Drawer", primitive: "@solidiom/drawer" },
  "empty-state": { label: "Empty State", primitive: "@solidiom/empty-state" },
  field: { label: "Field", primitive: "@solidiom/field" },
  "hover-card": { label: "Hover Card", primitive: "@solidiom/hover-card" },
  input: { label: "Input", primitive: "@solidiom/input" },
  "input-otp": { label: "Input OTP", primitive: "@solidiom/input-otp" },
  kbd: { label: "Kbd", primitive: "@solidiom/kbd" },
  label: { label: "Label", primitive: "@solidiom/label" },
  listbox: { label: "Listbox", primitive: "@solidiom/listbox" },
  menu: { label: "Menu", primitive: "@solidiom/menu" },
  meter: { label: "Meter", primitive: "@solidiom/meter" },
  "navigation-menu": { label: "Navigation Menu", primitive: "@solidiom/navigation-menu" },
  pagination: { label: "Pagination", primitive: "@solidiom/pagination" },
  popover: { label: "Popover", primitive: "@solidiom/popover" },
  progress: { label: "Progress", primitive: "@solidiom/progress" },
  "radio-group": { label: "Radio Group", primitive: "@solidiom/radio-group" },
  "resizable-panels": { label: "Resizable Panels", primitive: "@solidiom/resizable-panels" },
  "scroll-area": { label: "Scroll Area", primitive: "@solidiom/scroll-area" },
  select: { label: "Select", primitive: "@solidiom/select" },
  separator: { label: "Separator", primitive: "@solidiom/separator" },
  sheet: { label: "Sheet", primitive: "@solidiom/sheet" },
  skeleton: { label: "Skeleton", primitive: "@solidiom/skeleton" },
  slider: { label: "Slider", primitive: "@solidiom/slider" },
  spinner: { label: "Spinner", primitive: "@solidiom/spinner" },
  switch: { label: "Switch", primitive: "@solidiom/switch" },
  tabs: { label: "Tabs", primitive: "@solidiom/tabs" },
  toast: { label: "Toast", primitive: "@solidiom/toast" },
  toggle: { label: "Toggle", primitive: "@solidiom/toggle" },
  "toggle-group": { label: "Toggle Group", primitive: "@solidiom/toggle-group" },
  toolbar: { label: "Toolbar", primitive: "@solidiom/toolbar" },
  tooltip: { label: "Tooltip", primitive: "@solidiom/tooltip" },
  tree: { label: "Tree", primitive: "@solidiom/tree" },
}

/** §9.3 — 36 blocks from block-catalog-manifest.json */
const BLOCKS = [
  { name: "sign-in", label: "Sign In", category: "AUTH", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Label", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "sign-up", label: "Sign Up", category: "AUTH", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Toast", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "reset-password", label: "Reset Password", category: "AUTH", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Toast", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "welcome-wizard", label: "Welcome Wizard", category: "ONBOARD", compDeps: ["Button", "Input", "Field", "Card", "Tabs", "Progress", "Alert", "Navigation Menu", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "profile-setup", label: "Profile Setup", category: "ONBOARD", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Toast", "Avatar", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "project-starter", label: "Project Starter", category: "ONBOARD", compDeps: ["Button", "Input", "Field", "Card", "Select", "Alert", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "account-settings", label: "Account Settings", category: "SETTINGS", compDeps: ["Button", "Input", "Field", "Card", "Tabs", "Alert", "Toast", "Avatar", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "notification-preferences", label: "Notification Preferences", category: "SETTINGS", compDeps: ["Button", "Field", "Card", "Tabs", "Checkbox", "Radio Group", "Switch", "Select", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "danger-zone", label: "Danger Zone", category: "SETTINGS", compDeps: ["Button", "Card", "Alert", "Dialog", "Toast", "Progress", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "subscription-plans", label: "Subscription Plans", category: "BILLING", compDeps: ["Button", "Card", "Alert", "Dialog", "Tabs", "Toast", "Checkbox", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "payment-method", label: "Payment Method", category: "BILLING", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Dialog", "Avatar", "Select", "Toast", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "invoice-history", label: "Invoice History", category: "BILLING", compDeps: ["Button", "Input", "Card", "Select", "Data Table", "Select", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "team-management", label: "Team Management", category: "ADMIN", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Dialog", "Avatar", "Select", "Data Table", "Select", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "audit-log", label: "Audit Log", category: "ADMIN", compDeps: ["Input", "Card", "Select", "Checkbox", "Data Table", "Progress", "Select", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "role-permissions", label: "Role Permissions", category: "ADMIN", compDeps: ["Button", "Field", "Card", "Alert", "Dialog", "Tabs", "Checkbox", "Radio Group", "Switch", "Select", "Data Table", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "dashboard-overview", label: "Dashboard Overview", category: "OBS", compDeps: ["Card", "Tabs", "Alert", "Badge", "Data Table", "Meter", "Progress", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "real-time-events", label: "Real-time Events", category: "OBS", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Avatar", "Checkbox", "Radio Group", "Switch", "Data Table", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "alert-configuration", label: "Alert Configuration", category: "OBS", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Dialog", "Select", "Tabs", "Checkbox", "Radio Group", "Switch", "Data Table", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "resource-list", label: "Resource List", category: "RESOURCE", compDeps: ["Input", "Card", "Alert", "Avatar", "Badge", "Select", "Checkbox", "Data Table", "Select", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "resource-detail", label: "Resource Detail", category: "RESOURCE", compDeps: ["Button", "Card", "Alert", "Dialog", "Avatar", "Tabs", "Toast", "Breadcrumb", "Data Table", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "resource-creator", label: "Resource Creator", category: "RESOURCE", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Dialog", "Select", "Tabs", "Toast", "Checkbox", "Switch", "Breadcrumb", "Progress", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "chat-interface", label: "Chat Interface", category: "AI", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Avatar", "Toast", "Data Table", "Toolbar", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "prompt-studio", label: "Prompt Studio", category: "AI", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Dialog", "Select", "Tabs", "Data Table", "Toast", "Checkbox", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "workflow-builder", label: "Workflow Builder", category: "AI", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Dialog", "Select", "Tabs", "Data Table", "Toast", "Checkbox", "Switch", "Progress", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "search-results", label: "Search Results", category: "SEARCH", compDeps: ["Input", "Card", "Alert", "Select", "Checkbox", "Breadcrumb", "Select", "Data Table", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "saved-searches", label: "Saved Searches", category: "SEARCH", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Dialog", "Select", "Tabs", "Checkbox", "Switch", "Data Table", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "search-analytics", label: "Search Analytics", category: "SEARCH", compDeps: ["Card", "Select", "Tabs", "Badge", "Data Table", "Meter", "Progress", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "product-catalog", label: "Product Catalog", category: "COMMERCE", compDeps: ["Button", "Input", "Card", "Alert", "Select", "Avatar", "Checkbox", "Data Table", "Select", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "shopping-cart", label: "Shopping Cart", category: "COMMERCE", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Dialog", "Avatar", "Select", "Toast", "Switch", "Data Table", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "order-tracking", label: "Order Tracking", category: "COMMERCE", compDeps: ["Button", "Input", "Card", "Alert", "Tabs", "Badge", "Breadcrumb", "Select", "Data Table", "Progress", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "content-editor", label: "Content Editor", category: "CONTENT", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Select", "Tabs", "Toolbar", "Toast", "Data Table", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "content-library", label: "Content Library", category: "CONTENT", compDeps: ["Button", "Input", "Card", "Alert", "Dialog", "Avatar", "Badge", "Select", "Checkbox", "Data Table", "Select", "Progress", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "content-workflow", label: "Content Workflow", category: "CONTENT", compDeps: ["Button", "Input", "Field", "Card", "Alert", "Dialog", "Select", "Tabs", "Badge", "Toast", "Avatar", "Data Table", "Breadcrumb", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "navigation-layout", label: "Navigation Layout", category: "SHELL", compDeps: ["Button", "Alert", "Avatar", "Badge", "Breadcrumbs", "Checkbox", "Data Table", "Navigation Menu", "Breadcrumb", "Accordion", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "command-palette-shell", label: "Command Palette", category: "SHELL", compDeps: ["Input", "Card", "Alert", "Avatar", "Command Palette", "Data Table", "Kbd", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
  { name: "notifications-center", label: "Notifications Center", category: "SHELL", compDeps: ["Button", "Card", "Alert", "Avatar", "Badge", "Toast", "Checkbox", "Data Table", "Select", "Spinner"], states: ["loading", "empty", "error", "restricted"] },
]

/** §9.4 — Templates from the templates/ directory */
const TEMPLATES = [
  { name: "vite-solid-router", label: "Vite + Solid Router Starter", stack: "vite-solid-router", portfolios: ["balanced-product"] },
  { name: "tanstack-start-solid", label: "TanStack Start Solid", stack: "tanstack-start-solid", portfolios: ["balanced-product"] },
]

/** §9.5 — Theme presets from packages/themes/source/meta.ts and theme-contract-definitions.ts */
const THEMES = [
  { name: "solidiom-default", label: "Solidiom Default", outputs: ["css", "tailwind"], description: "The canonical Solidiom theme with a cool slate canvas and indigo primary." },
  { name: "ocean", label: "Ocean", outputs: ["css", "tailwind"], description: "A deep teal and cyan palette inspired by ocean depths." },
  { name: "forest", label: "Forest", outputs: ["css", "tailwind"], description: "An earthy green palette with warm undertones." },
  { name: "slate", label: "Slate", outputs: ["css", "tailwind"], description: "A neutral monochrome palette with stone tones." },
  { name: "aurora", label: "Aurora", outputs: ["css", "tailwind"], description: "A vibrant purple and pink gradient palette." },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function readJSON<T>(path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T
  } catch {
    return null
  }
}

function sha256(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex")
}

function titleCase(s: string): string {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("")
}

function labelFromName(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function readRegistryComponent(name: string) {
  const indexPath = join(ROOT, "registry", "index.json")
  const index = readJSON<{ components?: Array<{ name: string; description: string; searchKeywords: string[]; stylingOutputs: string[]; primitiveDependency?: string }> }>(indexPath)
  if (!index?.components) return null
  const entry = index.components.find((c) => c.name === name)
  if (!entry) return null

  const registryPath = join(ROOT, "registry", "components", `${name}.json`)
  const registry = readJSON<{
    name: string
    description: string
    keywords?: string[]
    stylingOutputs?: string[]
    dependencies?: string[]
  }>(registryPath)

  return {
    name: entry.name,
    label: titleCase(entry.name),
    description: entry.description || `${titleCase(entry.name)} component`,
    keywords: entry.searchKeywords || [name],
    stylingOutputs: entry.stylingOutputs || [],
    primitiveDependency: entry.primitiveDependency || `@solidiom/${name}`,
    sourceFiles: registry?.dependencies || [entry.primitiveDependency || `@solidiom/${name}`],
  }
}

// ─── Template generators: Components ────────────────────────────────────────

function genComponentEN(name: string, meta: ReturnType<typeof readRegistryComponent>): string {
  const label = meta?.label || titleCase(name)
  const desc = meta?.description || `${label} component`
  const prim = meta?.primitiveDependency || `@solidiom/${name}`
  const outputs = meta?.stylingOutputs || []
  const keywords = (meta?.keywords || [name]).slice(0, 7)

  return `---
contentSchemaVersion: 1
title: ${label}
description: ${desc}
keywords: [${keywords.join(", ")}]
locale: en
maturity: draft
product: ${label}
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "${name}"
stylingOutputs: ${outputs.length > 0 ? `[${outputs.map((o) => `"${o}"`).join(", ")}]` : "[]"}
---

${desc}

## Usage

The ${label} component is a styled recipe wrapper around the \`${prim}\` primitive. It adds composition, semantic styling slots, and variant support while delegating all state management and keyboard behavior to the underlying primitive.

\`\`\`tsx
import { ${titleCase(name)} } from "@solidiom/recipes-css"

;<${titleCase(name)}>Content</${titleCase(name)}>
\`\`\`

## Installation

\`\`\`sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
\`\`\`

Install the recipe package for your chosen styling profile. The component requires the corresponding \`${prim}\` primitive as a peer dependency.

## Anatomy

The ${label} component wraps the \`${prim}\` primitive. It exposes the primitive's parts through a recipe-applied composition layer:

- **Root** — the wrapper element that applies recipe styles and delegates to the primitive.

## Variants & states

${label} inherits its variant and state support from \`${prim}\`. Consult the primitive's documentation for the full list of supported variants, compound variants, and interactive states.

## Styling

${label} is available in ${outputs.length > 0 ? outputs.join(", ") + " profiles" : "multiple styling profiles"}. Each profile applies the same semantic slots and variant classes, allowing you to swap profiles without changing component usage.

Recipe classes follow the \`solidiom-${name}\` namespace for CSS profiling and targeting.

## SSR and hydration

${label} renders as semantic HTML during server rendering. Interactive behavior activates on hydration without layout shift. The recipe layer adds no JavaScript dependencies beyond the underlying primitive.

## Accessibility

${label} delegates accessibility to \`${prim}\`. See the [${label} primitive accessibility contract](/primitives/${name}/accessibility/) for the full keyboard, focus, and ARIA contract. The recipe wrapper does not introduce new semantics or interact with the accessibility tree beyond styling.
`
}

function genComponentES(name: string, meta: ReturnType<typeof readRegistryComponent>, enHash: string): string {
  const label = meta?.label || titleCase(name)
  const desc = meta?.description || `${label} component`
  const prim = meta?.primitiveDependency || `@solidiom/${name}`
  const outputs = meta?.stylingOutputs || []
  const keywords = (meta?.keywords || [name]).slice(0, 7)

  return `---
contentSchemaVersion: 1
title: ${label}
description: ${desc}
keywords: [${keywords.join(", ")}]
locale: es
maturity: draft
product: ${label}
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "${name}"
stylingOutputs: ${outputs.length > 0 ? `[${outputs.map((o) => `"${o}"`).join(", ")}]` : "[]"}
translationSourceHash: "${enHash}"
translationStatus: draft
---

${desc}

## Uso

El componente ${label} es un envoltorio de receta estilizado alrededor del primitivo \`${prim}\`. Añade composición, slots de estilo semántico y soporte de variantes mientras delega toda la gestión de estado y el comportamiento de teclado al primitivo subyacente.

\`\`\`tsx
import { ${titleCase(name)} } from "@solidiom/recipes-css"

;<${titleCase(name)}>Contenido</${titleCase(name)}>
\`\`\`

## Instalación

\`\`\`sh
pnpm add @solidiom/recipes-css @solidiom/recipes-tailwind @solidiom/recipes-unocss
\`\`\`

Instala el paquete de receta para tu perfil de estilo elegido. El componente requiere el primitivo \`${prim}\` correspondiente como dependencia par.

## Anatomía

El componente ${label} envuelve el primitivo \`${prim}\`. Expone las partes del primitivo a través de una capa de composición con receta aplicada:

- **Root** — el elemento envoltorio que aplica estilos de receta y delega al primitivo.

## Variantes y estados

${label} hereda su soporte de variantes y estados de \`${prim}\`. Consulta la documentación del primitivo para la lista completa de variantes soportadas, variantes compuestas y estados interactivos.

## Estilos

${label} está disponible en ${outputs.length > 0 ? "los perfiles " + outputs.join(", ") : "múltiples perfiles de estilo"}. Cada perfil aplica los mismos slots semánticos y clases de variante, permitiendo cambiar perfiles sin cambiar el uso del componente.

Las clases de receta siguen el espacio de nombres \`solidiom-${name}\` para el perfilado y la selección CSS.

## Renderizado SSR e hidratación

${label} se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo se activa en la hidratación sin desplazamiento de diseño. La capa de receta no añade dependencias de JavaScript más allá del primitivo subyacente.

## Accesibilidad

${label} delega la accesibilidad a \`${prim}\`. Consulta el [contrato de accesibilidad del primitivo ${label}](/primitives/${name}/accessibility/) para el contrato completo de teclado, foco y ARIA. El envoltorio de receta no introduce nuevas semánticas ni interactúa con el árbol de accesibilidad más allá del estilo.
`
}

// ─── Template generators: Blocks ────────────────────────────────────────────

function genBlockEN(block: (typeof BLOCKS)[0]): string {
  const { name, label, category, compDeps, states } = block
  const stateLabels = states.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  const depList = compDeps.map((d) => "- **" + d + "**").join("\n")
  const stateList = stateLabels.map((s) => "- **" + s + "**").join("\n")

  return `---
contentSchemaVersion: 1
title: ${label}
description: "${label} block for ${category.toLowerCase()} workflows."
keywords: [${name}, ${category.toLowerCase()}, block, ${label.toLowerCase()}]
locale: en
maturity: draft
product: ${label}
productLayer: block
status: draft
category: "${category}"
requiredStates: [${states.map((s) => `"${s}"`).join(", ")}]
---

The ${label} block provides a composable ${category.toLowerCase()} workflow for managing ${name.replace(/-/g, " ")} operations.

## Usage

${label} composes multiple Solidiom components into a cohesive ${category.toLowerCase()} interface. It manages state transitions, data fetching, and user interactions specific to ${name.replace(/-/g, " ")} workflows.

## Dependencies

${label} depends on the following components:

${depList}

## States

${label} implements the following states:

${stateList}

Each state is rendered with appropriate visual indicators and user feedback.

## Data Boundary

${label} operates within the following data boundary: it communicates with the relevant ${category.toLowerCase()} service through well-defined APIs. The block does not persist data beyond its session scope; all state is derived from the service layer or user interaction.

## Installation

\`\`\`sh
pnpm add @solidiom/recipes-css
\`\`\`

Install the required recipe packages and component dependencies listed above.

## Layout

${label} renders as a responsive container with a header, content area, and action footer. It supports both full-page and embedded layouts, adapting to available viewport space.

## Accessibility

${label} delegates accessibility to its underlying components. Keyboard navigation follows the component-level contracts, and the block provides appropriate landmarks, headings, and ARIA attributes for its composite structure.
`
}

function genBlockES(block: (typeof BLOCKS)[0], enHash: string): string {
  const { name, label, category, compDeps, states } = block
  const stateLabels = states.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  const depList = compDeps.map((d) => "- **" + d + "**").join("\n")
  const stateList = stateLabels.map((s) => "- **" + s + "**").join("\n")

  return `---
contentSchemaVersion: 1
title: ${label}
description: "Bloque ${label} para flujos de trabajo de ${category.toLowerCase()}."
keywords: [${name}, ${category.toLowerCase()}, bloque, ${label.toLowerCase()}]
locale: es
maturity: draft
product: ${label}
productLayer: block
status: draft
category: "${category}"
requiredStates: [${states.map((s) => `"${s}"`).join(", ")}]
translationSourceHash: "${enHash}"
translationStatus: draft
---

El bloque ${label} proporciona un flujo de trabajo ${category.toLowerCase()} componible para gestionar operaciones de ${name.replace(/-/g, " ")}.

## Uso

${label} compone múltiples componentes de Solidiom en una interfaz ${category.toLowerCase()} cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de ${name.replace(/-/g, " ")}.

## Dependencias

${label} depende de los siguientes componentes:

${depList}

## Estados

${label} implementa los siguientes estados:

${stateList}

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

${label} opera dentro del siguiente límite de datos: se comunica con el servicio ${category.toLowerCase()} relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

\`\`\`sh
pnpm add @solidiom/recipes-css
\`\`\`

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

${label} se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

${label} delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
`
}

// ─── Template generators: Templates ─────────────────────────────────────────

function genTemplateEN(tpl: (typeof TEMPLATES)[0]): string {
  const { name, label, stack, portfolios } = tpl
  const isTanstack = stack.includes("tanstack")

  return `---
contentSchemaVersion: 1
title: ${label}
description: "Starter template for ${name.replace(/-/g, " ")} projects."
keywords: [${name}, template, starter, solid]
locale: en
maturity: draft
product: ${label}
productLayer: template
status: draft
package: "@solidiom/template-${name}"
stack: ${stack}
portfolios: [${portfolios.map((p) => `"${p}"`).join(", ")}]
---

${label} provides a production-ready starting point for Solid projects using the ${name.replace(/-/g, " ")} stack.

## Overview

This template scaffolds a complete project with routing, styling setup, and Solidiom integration pre-configured. It serves as the foundation for building applications with the ${name.replace(/-/g, " ")} architecture.

## Stack

- **Framework:** ${stack.replace(/-/g, " ")}
- **Routing:** File-based routing with ${isTanstack ? "TanStack Router" : "Solid Router"}
- **Rendering:** ${isTanstack ? "SSR with hydration" : "Client-side rendering"}
- **Build tool:** Vite

## Required Blocks

This template integrates blocks for common application patterns including authentication, onboarding, and resource management. Specific block dependencies vary by portfolio selection.

## Authentication

The template includes a default authentication setup compatible with the Sign In and Sign Up blocks. Authentication is configured as a composable layer that can be replaced or extended.

## Styling

The template ships with a pre-configured styling profile (CSS, Tailwind, or UnoCSS). The theme system allows switching between presets without modifying component code.

## Installation

\`\`\`sh
solidiom create my-app --template ${name}
\`\`\`

Pass \`--yes\` to skip prompts and \`--styling\` to select a styling profile.

## Deployment

${isTanstack ? "Deploy to any Node.js-compatible hosting platform that supports SSR. Vercel, Netlify, and Cloudflare Pages are supported targets." : "Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets."}
`
}

function genTemplateES(tpl: (typeof TEMPLATES)[0], enHash: string): string {
  const { name, label, stack, portfolios } = tpl
  const isTanstack = stack.includes("tanstack")

  return `---
contentSchemaVersion: 1
title: ${label}
description: "Plantilla de inicio para proyectos ${name.replace(/-/g, " ")}."
keywords: [${name}, plantilla, inicio, solid]
locale: es
maturity: draft
product: ${label}
productLayer: template
status: draft
package: "@solidiom/template-${name}"
stack: ${stack}
portfolios: [${portfolios.map((p) => `"${p}"`).join(", ")}]
translationSourceHash: "${enHash}"
translationStatus: draft
---

${label} proporciona un punto de partida listo para producción para proyectos Solid usando el stack ${name.replace(/-/g, " ")}.

## Resumen

Esta plantilla crea un proyecto completo con enrutamiento, configuración de estilos e integración con Solidiom pre-configurada. Sirve como base para construir aplicaciones con la arquitectura ${name.replace(/-/g, " ")}.

## Stack

- **Framework:** ${stack.replace(/-/g, " ")}
- **Enrutamiento:** Enrutamiento basado en archivos con ${isTanstack ? "TanStack Router" : "Solid Router"}
- **Renderizado:** ${isTanstack ? "SSR con hidratación" : "Renderizado del lado del cliente"}
- **Herramienta de construcción:** Vite

## Bloques requeridos

Esta plantilla integra bloques para patrones comunes de aplicaciones, incluyendo autenticación, incorporación y gestión de recursos. Las dependencias de bloques específicas varían según la selección de portfolio.

## Autenticación

La plantilla incluye una configuración de autenticación predeterminada compatible con los bloques Sign In y Sign Up. La autenticación está configurada como una capa componible que puede reemplazarse o extenderse.

## Estilos

La plantilla se entrega con un perfil de estilo pre-configurado (CSS, Tailwind o UnoCSS). El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

\`\`\`sh
solidiom create my-app --template ${name}
\`\`\`

Pasa \`--yes\` para saltar los prompts y \`--styling\` para seleccionar un perfil de estilo.

## Despliegue

${isTanstack ? "Despliega a cualquier plataforma de alojamiento compatible con Node.js que soporte SSR. Vercel, Netlify y Cloudflare Pages son destinos soportados." : "Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados."}
`
}

// ─── Template generators: Themes ────────────────────────────────────────────

function genThemeEN(theme: (typeof THEMES)[0]): string {
  const { name, label, outputs, description } = theme
  const outputsList = outputs.map((o) => {
    const desc = o === "css" ? "CSS custom properties stylesheet" : o === "tailwind" ? "Tailwind CSS configuration mapping" : "UnoCSS preset extension"
    return "- **" + o + "** — " + desc
  }).join("\n")

  return `---
contentSchemaVersion: 1
title: ${label} Theme
description: ${description}
keywords: [${name}, theme, preset, tokens, styling]
locale: en
maturity: draft
product: ${label}
productLayer: theme
status: draft
themeSchemaVersion: 1
outputs: [${outputs.map((o) => `"${o}"`).join(", ")}]
---

${description}

## Overview

${label} is a preset theme that provides a complete set of design tokens for ${outputs.join(", ")} styling profiles. It includes light and dark mode palettes, typography scales, spacing, and interactive states.

## Palette

${label} defines a full semantic color palette including surface layers, foreground colors, primary/secondary actions, and semantic states (success, warning, destructive). The palette is designed for WCAG AA contrast compliance in both light and dark modes.

## Typography

The theme inherits the project's font configuration and applies a six-step type scale (xs, sm, base, md, lg, xl) with paired line-heights. Heading and body text follow the Solidiom typeset conventions.

## Tokens

${label} exposes semantic tokens through CSS custom properties:

- Surface: \`--sol-surface\`, \`--sol-surface-raised\`, \`--sol-surface-overlay\`, \`--sol-surface-sunken\`
- Foreground: \`--sol-foreground\`, \`--sol-foreground-muted\`, \`--sol-foreground-subtle\`
- Primary: \`--sol-primary\`, \`--sol-primary-hover\`, \`--sol-primary-foreground\`
- States: \`--sol-success\`, \`--sol-warning\`, \`--sol-destructive\`
- Radius: \`--sol-radius-sm\`, \`--sol-radius\`, \`--sol-radius-lg\`, \`--sol-radius-full\`

## Outputs

${label} ships in the following output formats:

${outputsList}

## Installation

\`\`\`sh
pnpm add @solidiom/themes
\`\`\`

Import the theme in your project's entry point and apply it through your chosen styling profile. The theme can be used standalone or extended to create a custom theme.
`
}

function genThemeES(theme: (typeof THEMES)[0], enHash: string): string {
  const { name, label, outputs, description } = theme
  const outputsList = outputs.map((o) => {
    const desc = o === "css" ? "Hoja de estilo con propiedades CSS personalizadas" : o === "tailwind" ? "Mapeo de configuración Tailwind CSS" : "Extensión de preset UnoCSS"
    return "- **" + o + "** — " + desc
  }).join("\n")

  return `---
contentSchemaVersion: 1
title: Tema ${label}
description: ${description}
keywords: [${name}, tema, preset, tokens, estilos]
locale: es
maturity: draft
product: ${label}
productLayer: theme
status: draft
themeSchemaVersion: 1
outputs: [${outputs.map((o) => `"${o}"`).join(", ")}]
translationSourceHash: "${enHash}"
translationStatus: draft
---

${description}

## Resumen

${label} es un tema preset que proporciona un conjunto completo de tokens de diseño para los perfiles de estilo ${outputs.join(", ")}. Incluye paletas de modo claro y oscuro, escalas de tipografía, espaciado y estados interactivos.

## Paleta

${label} define una paleta de colores semántica completa que incluye capas de superficie, colores de primer plano, acciones primarias/secundarias y estados semánticos (éxito, advertencia, destructivo). La paleta está diseñada para el cumplimiento del contraste WCAG AA en ambos modos claro y oscuro.

## Tipografía

El tema hereda la configuración de fuentes del proyecto y aplica una escala tipográfica de seis pasos (xs, sm, base, md, lg, xl) con alturas de línea emparejadas. El texto de encabezado y cuerpo sigue las convenciones de tipos de Solidiom.

## Tokens

${label} expone tokens semánticos a través de propiedades CSS personalizadas:

- Superficie: \`--sol-surface\`, \`--sol-surface-raised\`, \`--sol-surface-overlay\`, \`--sol-surface-sunken\`
- Primer plano: \`--sol-foreground\`, \`--sol-foreground-muted\`, \`--sol-foreground-subtle\`
- Primario: \`--sol-primary\`, \`--sol-primary-hover\`, \`--sol-primary-foreground\`
- Estados: \`--sol-success\`, \`--sol-warning\`, \`--sol-destructive\`
- Radio: \`--sol-radius-sm\`, \`--sol-radius\`, \`--sol-radius-lg\`, \`--sol-radius-full\`

## Salidas

${label} se entrega en los siguientes formatos de salida:

${outputsList}

## Instalación

\`\`\`sh
pnpm add @solidiom/themes
\`\`\`

Importa el tema en el punto de entrada de tu proyecto y aplícalo a través de tu perfil de estilo elegido. El tema puede usarse de forma independiente o extenderse para crear un tema personalizado.
`
}

// ─── Scaffold functions ─────────────────────────────────────────────────────

function scaffoldComponent(name: string, force: boolean): boolean {
  const enPath = join(SITE_CONTENT, "en", "components", `${name}.md`)
  const esPath = join(SITE_CONTENT, "es", "components", `${name}.md`)

  if (existsSync(enPath) && !force) {
    console.log(`  ⊘ component/${name}: already exists (use --force to overwrite)`)
    return false
  }

  const meta = readRegistryComponent(name)
  if (!meta) {
    console.error(`  ✗ component/${name}: no registry entry found`)
    return false
  }

  for (const dir of [
    join(SITE_CONTENT, "en", "components"),
    join(SITE_CONTENT, "es", "components"),
  ]) {
    mkdirSync(dir, { recursive: true })
  }

  const enContent = genComponentEN(name, meta)
  writeFileSync(enPath, enContent)

  const enHash = sha256(enContent)

  const esContent = genComponentES(name, meta, enHash)
  writeFileSync(esPath, esContent)

  console.log(`  ✓ component/${name}`)
  return true
}

function scaffoldBlock(name: string, force: boolean): boolean {
  const enPath = join(SITE_CONTENT, "en", "blocks", `${name}.md`)
  const esPath = join(SITE_CONTENT, "es", "blocks", `${name}.md`)

  if (existsSync(enPath) && !force) {
    console.log(`  ⊘ block/${name}: already exists (use --force to overwrite)`)
    return false
  }

  const block = BLOCKS.find((b) => b.name === name)
  if (!block) {
    console.error(`  ✗ block/${name}: not found in block catalog`)
    return false
  }

  for (const dir of [
    join(SITE_CONTENT, "en", "blocks"),
    join(SITE_CONTENT, "es", "blocks"),
  ]) {
    mkdirSync(dir, { recursive: true })
  }

  const enContent = genBlockEN(block)
  writeFileSync(enPath, enContent)

  const enHash = sha256(enContent)

  const esContent = genBlockES(block, enHash)
  writeFileSync(esPath, esContent)

  console.log(`  ✓ block/${name}`)
  return true
}

function scaffoldTemplate(name: string, force: boolean): boolean {
  const enPath = join(SITE_CONTENT, "en", "templates", `${name}.md`)
  const esPath = join(SITE_CONTENT, "es", "templates", `${name}.md`)

  if (existsSync(enPath) && !force) {
    console.log(`  ⊘ template/${name}: already exists (use --force to overwrite)`)
    return false
  }

  const tpl = TEMPLATES.find((t) => t.name === name)
  if (!tpl) {
    console.error(`  ✗ template/${name}: not found in template catalog`)
    return false
  }

  for (const dir of [
    join(SITE_CONTENT, "en", "templates"),
    join(SITE_CONTENT, "es", "templates"),
  ]) {
    mkdirSync(dir, { recursive: true })
  }

  const enContent = genTemplateEN(tpl)
  writeFileSync(enPath, enContent)

  const enHash = sha256(enContent)

  const esContent = genTemplateES(tpl, enHash)
  writeFileSync(esPath, esContent)

  console.log(`  ✓ template/${name}`)
  return true
}

function scaffoldTheme(name: string, force: boolean): boolean {
  const enPath = join(SITE_CONTENT, "en", "themes", `${name}.md`)
  const esPath = join(SITE_CONTENT, "es", "themes", `${name}.md`)

  if (existsSync(enPath) && !force) {
    console.log(`  ⊘ theme/${name}: already exists (use --force to overwrite)`)
    return false
  }

  const theme = THEMES.find((t) => t.name === name)
  if (!theme) {
    console.error(`  ✗ theme/${name}: not found in theme catalog`)
    return false
  }

  for (const dir of [
    join(SITE_CONTENT, "en", "themes"),
    join(SITE_CONTENT, "es", "themes"),
  ]) {
    mkdirSync(dir, { recursive: true })
  }

  const enContent = genThemeEN(theme)
  writeFileSync(enPath, enContent)

  const enHash = sha256(enContent)

  const esContent = genThemeES(theme, enHash)
  writeFileSync(esPath, esContent)

  console.log(`  ✓ theme/${name}`)
  return true
}

// ─── CLI ────────────────────────────────────────────────────────────────────

type Layer = "component" | "block" | "template" | "theme"

const VALID_LAYERS: Layer[] = ["component", "block", "template", "theme"]
const LAYER_ALL_NAMES: Record<Layer, string[]> = {
  component: Object.keys(COMPONENTS),
  block: BLOCKS.map((b) => b.name),
  template: TEMPLATES.map((t) => t.name),
  theme: THEMES.map((t) => t.name),
}

function scaffoldItem(layer: Layer, name: string, force: boolean): boolean {
  switch (layer) {
    case "component":
      return scaffoldComponent(name, force)
    case "block":
      return scaffoldBlock(name, force)
    case "template":
      return scaffoldTemplate(name, force)
    case "theme":
      return scaffoldTheme(name, force)
  }
}

function main(): void {
  const args = process.argv.slice(2)
  const force = args.includes("--force")
  const all = args.includes("--all")
  const nonFlags = args.filter((a) => !a.startsWith("--"))

  if (nonFlags.length === 0 && all) {
    // Scaffold all layers
    let total = 0
    for (const layer of VALID_LAYERS) {
      const names = LAYER_ALL_NAMES[layer]
      console.log(`\nScaffolding ${names.length} ${layer}(s):\n`)
      let layerCount = 0
      for (const name of names) {
        if (scaffoldItem(layer, name, force)) layerCount++
      }
      console.log(`\n${layerCount}/${names.length} ${layer}(s) scaffolded.\n`)
      total += layerCount
    }
    console.log(`Total: ${total} item(s) scaffolded.`)
    return
  }

  if (nonFlags.length === 0) {
    console.log("Usage:")
    console.log("  tsx tools/scaffold-catalog-docs.ts <layer> <name> [--force]")
    console.log("  tsx tools/scaffold-catalog-docs.ts <layer> --all [--force]")
    console.log("  tsx tools/scaffold-catalog-docs.ts --all [--force]")
    console.log("")
    console.log("Layers: component, block, template, theme")
    process.exit(0)
  }

  const layer = nonFlags[0] as Layer
  if (!VALID_LAYERS.includes(layer)) {
    console.error(`Unknown layer "${nonFlags[0]}". Valid: ${VALID_LAYERS.join(", ")}`)
    process.exit(1)
  }

  const allInLayer = args.includes("--all")
  const names = allInLayer ? LAYER_ALL_NAMES[layer] : [nonFlags[1]]

  if (names.length === 0 || !names[0]) {
    console.error(`Provide a name or --all for layer "${layer}".`)
    console.log(`Available: ${LAYER_ALL_NAMES[layer].join(", ")}`)
    process.exit(1)
  }

  const layerLabel = allInLayer ? `${names.length} ${layer}(s)` : `${layer}/${names[0]}`
  console.log(`Scaffolding ${layerLabel}:\n`)

  let count = 0
  for (const name of names) {
    if (scaffoldItem(layer, name, force)) count++
  }

  console.log(`\n${count}/${names.length} ${layer}(s) scaffolded.`)
}

main()