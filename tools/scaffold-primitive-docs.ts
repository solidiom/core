/**
 * Scaffold documentation for an existing primitive package.
 *
 * Creates the full docs/ directory structure required by PRIM-000:
 *   docs/overview.md, docs/es/overview.md
 *   docs/examples/basic.md, docs/es/examples/basic.md
 *   docs/accessibility/contract.md, docs/es/accessibility/contract.md
 *
 * Reads registry/<name>.json and packages/<name>/src/index.tsx to derive
 * parts, description, keywords, and keyboard behavior.
 *
 * Usage:
 *   pnpm exec tsx tools/scaffold-primitive-docs.ts <name> [--force]
 *   pnpm exec tsx tools/scaffold-primitive-docs.ts --all [--force]
 *
 * --force: overwrite existing files (default: skip if docs/ exists)
 * --all: scaffold all primitives missing docs/
 */

import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { PUBLIC_PRIMITIVES } from "./axe-results"

const ROOT = join(import.meta.dirname ?? __dirname, "..")

// ─── Types ──────────────────────────────────────────────────────────────────

interface RegistryEntry {
  name: string
  label: string
  description: string
  category: string
  search: { keywords: string[] }
  source: { files: string[] }
}

interface PartInfo {
  name: string
  isRoot: boolean
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function readJSON<T>(path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T
  } catch {
    return null
  }
}

function sha256File(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex")
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

function extractParts(name: string): PartInfo[] {
  const indexPath = join(ROOT, "packages", name, "src", "index.tsx")
  if (!existsSync(indexPath)) return [{ name: "Root", isRoot: true }]

  const content = readFileSync(indexPath, "utf8")
  const parts: PartInfo[] = []

  // Match exported functions (the parts)
  const funcMatches = content.matchAll(/export\s+function\s+(\w+)/g)
  for (const m of funcMatches) {
    if (!m[1].endsWith("Props") && !m[1].startsWith("use") && !m[1].startsWith("create")) {
      parts.push({ name: m[1], isRoot: m[1] === "Root" })
    }
  }

  // Also check re-exports like `export { Root, Trigger, Content, ... }`
  const reExportMatch = content.match(/export\s*\{([^}]+)\}/)
  if (reExportMatch && parts.length === 0) {
    const names = reExportMatch[1]
      .split(",")
      .map((s) => s.trim().split(" ")[0])
      .filter((s) => /^[A-Z]/.test(s) && !s.endsWith("Props"))
    for (const n of names) {
      parts.push({ name: n, isRoot: n === "Root" })
    }
  }

  return parts.length > 0 ? parts : [{ name: "Root", isRoot: true }]
}

function detectKeyboard(name: string, parts: PartInfo[]): boolean {
  // Primitives with Trigger, Item (interactive), or that are inherently keyboard-navigable
  const interactiveParts = ["Trigger", "Item", "HeaderCell", "Root"]
  const keyboardPrimitives = [
    "select",
    "menu",
    "tabs",
    "checkbox",
    "radio-group",
    "switch",
    "popover",
    "sheet",
    "navigation-menu",
    "combobox",
    "dialog",
    "accordion",
    "collapsible",
    "alert-dialog",
    "context-menu",
    "command-palette",
    "listbox",
    "date-picker",
    "slider",
    "toolbar",
    "toggle",
    "toggle-group",
    "tree",
    "carousel",
    "drawer",
    "toast",
  ]
  if (keyboardPrimitives.includes(name)) return true
  return parts.some((p) => interactiveParts.includes(p.name) && p.name !== "Root")
}

// Keyboard tables for known interactive primitives
const KEYBOARD_TABLES: Record<
  string,
  Array<{ key: string; behavior: string; behaviorEs: string }>
> = {
  select: [
    {
      key: "ArrowDown",
      behavior: "Opens the listbox if closed; moves highlight to the next option.",
      behaviorEs: "Abre la lista si está cerrada; mueve el resaltado a la siguiente opción.",
    },
    {
      key: "ArrowUp",
      behavior: "Moves highlight to the previous option.",
      behaviorEs: "Mueve el resaltado a la opción anterior.",
    },
    {
      key: "Enter",
      behavior: "Selects the highlighted option and closes the listbox.",
      behaviorEs: "Selecciona la opción resaltada y cierra la lista.",
    },
    {
      key: "Escape",
      behavior: "Closes the listbox without changing the selection.",
      behaviorEs: "Cierra la lista sin cambiar la selección.",
    },
    {
      key: "Space",
      behavior: "Opens the listbox or selects the highlighted option.",
      behaviorEs: "Abre la lista o selecciona la opción resaltada.",
    },
  ],
  menu: [
    {
      key: "ArrowDown",
      behavior: "Moves focus to the next menu item.",
      behaviorEs: "Mueve el foco al siguiente elemento del menú.",
    },
    {
      key: "ArrowUp",
      behavior: "Moves focus to the previous menu item.",
      behaviorEs: "Mueve el foco al elemento anterior del menú.",
    },
    {
      key: "Enter/Space",
      behavior: "Activates the focused menu item.",
      behaviorEs: "Activa el elemento de menú enfocado.",
    },
    {
      key: "Escape",
      behavior: "Closes the menu and returns focus to the trigger.",
      behaviorEs: "Cierra el menú y devuelve el foco al disparador.",
    },
    {
      key: "ArrowRight",
      behavior: "Opens a sub-menu when focus is on a sub-trigger.",
      behaviorEs: "Abre un sub-menú cuando el foco está en un sub-disparador.",
    },
    {
      key: "ArrowLeft",
      behavior: "Closes the sub-menu and returns focus to the parent.",
      behaviorEs: "Cierra el sub-menú y devuelve el foco al padre.",
    },
  ],
  tabs: [
    {
      key: "ArrowRight",
      behavior: "Moves focus to the next tab trigger.",
      behaviorEs: "Mueve el foco al siguiente disparador de pestaña.",
    },
    {
      key: "ArrowLeft",
      behavior: "Moves focus to the previous tab trigger.",
      behaviorEs: "Mueve el foco al disparador de pestaña anterior.",
    },
    {
      key: "Home",
      behavior: "Moves focus to the first tab trigger.",
      behaviorEs: "Mueve el foco al primer disparador de pestaña.",
    },
    {
      key: "End",
      behavior: "Moves focus to the last tab trigger.",
      behaviorEs: "Mueve el foco al último disparador de pestaña.",
    },
    {
      key: "Enter/Space",
      behavior: "Activates the focused tab (in manual activation mode).",
      behaviorEs: "Activa la pestaña enfocada (en modo de activación manual).",
    },
  ],
  checkbox: [
    {
      key: "Space",
      behavior: "Toggles the checkbox between checked and unchecked.",
      behaviorEs: "Alterna el checkbox entre marcado y desmarcado.",
    },
  ],
  "radio-group": [
    {
      key: "ArrowDown/ArrowRight",
      behavior: "Moves selection to the next radio item.",
      behaviorEs: "Mueve la selección al siguiente elemento radio.",
    },
    {
      key: "ArrowUp/ArrowLeft",
      behavior: "Moves selection to the previous radio item.",
      behaviorEs: "Mueve la selección al elemento radio anterior.",
    },
  ],
  switch: [
    {
      key: "Space",
      behavior: "Toggles the switch between on and off.",
      behaviorEs: "Alterna el switch entre encendido y apagado.",
    },
    {
      key: "Enter",
      behavior: "Toggles the switch between on and off.",
      behaviorEs: "Alterna el switch entre encendido y apagado.",
    },
  ],
  popover: [
    {
      key: "Escape",
      behavior: "Closes the popover and returns focus to the trigger.",
      behaviorEs: "Cierra el popover y devuelve el foco al disparador.",
    },
  ],
  sheet: [
    {
      key: "Escape",
      behavior: "Closes the sheet and returns focus to the trigger.",
      behaviorEs: "Cierra el panel y devuelve el foco al disparador.",
    },
    {
      key: "Tab",
      behavior: "Moves focus within the sheet content (focus trapped).",
      behaviorEs: "Mueve el foco dentro del contenido del panel (foco atrapado).",
    },
  ],
  "navigation-menu": [
    {
      key: "ArrowDown",
      behavior: "Opens the dropdown content when focus is on a trigger.",
      behaviorEs: "Abre el contenido desplegable cuando el foco está en un disparador.",
    },
    {
      key: "Escape",
      behavior: "Closes the dropdown content.",
      behaviorEs: "Cierra el contenido desplegable.",
    },
    {
      key: "Tab",
      behavior: "Moves focus to the next focusable element in the navigation.",
      behaviorEs: "Mueve el foco al siguiente elemento enfocable en la navegación.",
    },
  ],
  pagination: [
    {
      key: "Enter/Space",
      behavior: "Activates the focused page button.",
      behaviorEs: "Activa el botón de página enfocado.",
    },
  ],
  toast: [],
  tooltip: [],
}

// ─── Template generators ────────────────────────────────────────────────────

function genOverview(
  name: string,
  registry: RegistryEntry,
  parts: PartInfo[],
  hasKeyboard: boolean,
): string {
  const kbTable = KEYBOARD_TABLES[name] || []
  const label = registry.label || labelFromName(name)
  const naEntries = [
    ...(parts.length <= 2
      ? [
          {
            section: "composition",
            reason: `${label} is a self-contained primitive with no compound sub-primitives to compose.`,
          },
        ]
      : []),
    {
      section: "relationships",
      reason: `${label} has no sibling primitives; it is used within other compositions but owns no inter-primitive contract.`,
    },
    { section: "migration", reason: "No prior API; this is the first shipped version." },
    { section: "testing", reason: "Standard testing guidance covers this primitive." },
  ]

  const naYaml = naEntries
    .map((e) => `  - section: ${e.section}\n    reason: ${e.reason}`)
    .join("\n")

  const partsSection = parts
    .map((p) => `- **${p.name}** — \`data-part="${p.name.toLowerCase()}"\`.`)
    .join("\n")

  const kbSection =
    hasKeyboard && kbTable.length > 0
      ? `## Keyboard & behavior\n\n| Key | Behavior |\n| --- | --- |\n${kbTable.map((k) => `| ${k.key} | ${k.behavior} |`).join("\n")}\n`
      : `## Keyboard & behavior\n\nThis primitive has no keyboard interaction. It renders content that does not independently receive focus or respond to key events.\n`

  const compositionSection =
    parts.length > 2
      ? `## Composition\n\n${label} is designed to compose with other primitives. Its parts can be combined with Field, Button, or other primitives as needed.\n`
      : ""

  return `---
contentSchemaVersion: 1
title: ${label}
description: ${registry.description}
keywords: [${registry.search.keywords
    .filter((k) => /^[a-z]/.test(k))
    .slice(0, 7)
    .join(", ")}]
locale: en
maturity: draft
product: ${label}
productLayer: primitive
status: draft
package: "@solidiom/${name}"
primitive: ${name}
section: overview
notApplicable:
${naYaml}
---

${registry.description}

## Usage

${
  parts.length > 1
    ? `Compose ${parts.map((p) => "\`" + p.name + "\`").join(", ")}. `
    : `Import and render \`${parts[0].name}\`. `
}

\`\`\`tsx
import * as ${titleCase(name)} from "@solidiom/${name}"

;<${titleCase(name)}.${parts[0].name}>${label} content</${titleCase(name)}.${parts[0].name}>
\`\`\`

## Installation

Install the package with \`pnpm add @solidiom/${name}\`. The package requires compatible \`solid-js\` and \`@solidjs/web\` peer dependencies.

## Parts

${label} exposes ${parts.length} part${parts.length > 1 ? "s" : ""}:

${partsSection}

## Styling

${label} carries \`data-scope="${name}"\` and \`data-part\` attributes on each part for CSS/recipe targeting. State attributes like \`data-state\`, \`data-disabled\`, and \`data-highlighted\` are exposed where applicable.

${kbSection}
${compositionSection}## SSR and hydration

${label} renders as semantic HTML during server rendering. Interactive behavior (keyboard handlers, state management) activates on hydration without layout shift.
`
}

function genOverviewEs(
  name: string,
  registry: RegistryEntry,
  parts: PartInfo[],
  hasKeyboard: boolean,
  enHash: string,
): string {
  const kbTable = KEYBOARD_TABLES[name] || []
  const label = registry.label || labelFromName(name)
  const naEntries = [
    ...(parts.length <= 2
      ? [
          {
            section: "composition",
            reason: `${label} es un primitivo autónomo sin sub-primitivos compuestos.`,
          },
        ]
      : []),
    {
      section: "relationships",
      reason: `${label} no tiene primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.`,
    },
    { section: "migration", reason: "Sin API previa; esta es la primera versión publicada." },
    { section: "testing", reason: "La guía estándar de pruebas cubre este primitivo." },
  ]
  const naYaml = naEntries
    .map((e) => `  - section: ${e.section}\n    reason: ${e.reason}`)
    .join("\n")

  const esKeywords = registry.search.keywords
    .filter((k) => /[á-ú]/.test(k) || /^[a-z]/.test(k))
    .slice(0, 7)

  const partsSection = parts
    .map((p) => `- **${p.name}** — \`data-part="${p.name.toLowerCase()}"\`.`)
    .join("\n")

  const kbSection =
    hasKeyboard && kbTable.length > 0
      ? `## Interacción con teclado\n\n| Tecla | Comportamiento |\n| --- | --- |\n${kbTable.map((k) => `| ${k.key} | ${k.behaviorEs} |`).join("\n")}\n`
      : `## Interacción con teclado\n\nEste primitivo no tiene interacción con teclado. Renderiza contenido que no recibe enfoque ni responde a eventos de teclado de forma independiente.\n`

  const compositionSection =
    parts.length > 2
      ? `## Composición\n\n${label} está diseñado para componerse con otras primitivas. Sus partes pueden combinarse con Field, Button u otras primitivas según sea necesario.\n`
      : ""

  return `---
contentSchemaVersion: 1
title: ${label}
description: ${registry.description}
keywords: [${esKeywords.join(", ")}]
locale: es
maturity: draft
product: ${label}
productLayer: primitive
status: draft
package: "@solidiom/${name}"
primitive: ${name}
section: overview
translationSourceHash: "${enHash}"
translationStatus: draft
notApplicable:
${naYaml}
---

${registry.description}

## Uso

${
  parts.length > 1
    ? `Compón ${parts.map((p) => "\`" + p.name + "\`").join(", ")}. `
    : `Importa y renderiza \`${parts[0].name}\`. `
}

\`\`\`tsx
import * as ${titleCase(name)} from "@solidiom/${name}"

;<${titleCase(name)}.${parts[0].name}>Contenido de ${label}</${titleCase(name)}.${parts[0].name}>
\`\`\`

## Instalación

Instala el paquete con \`pnpm add @solidiom/${name}\`. El paquete requiere dependencias pares compatibles de \`solid-js\` y \`@solidjs/web\`.

## Partes

${label} expone ${parts.length} parte${parts.length > 1 ? "s" : ""}:

${partsSection}

## Estilos

${label} lleva los atributos \`data-scope="${name}"\` y \`data-part\` en cada parte para la selección CSS/receta. Los atributos de estado como \`data-state\`, \`data-disabled\` y \`data-highlighted\` se exponen donde corresponda.

${kbSection}
${compositionSection}## Renderizado SSR e hidratación

${label} se renderiza como HTML semántico durante el renderizado en servidor. El comportamiento interactivo (manejadores de teclado, gestión de estado) se activa en la hidratación sin desplazamiento de diseño.
`
}

function genExample(
  name: string,
  registry: RegistryEntry,
  parts: PartInfo[],
  hasKeyboard: boolean,
): string {
  const label = registry.label || labelFromName(name)
  return `---
contentSchemaVersion: 1
title: ${label} - Basic usage
description: Basic ${label.toLowerCase()} example demonstrating core behavior.
keywords: [${name}, basic, example]
locale: en
maturity: draft
product: ${label}
productLayer: primitive
status: draft
package: "@solidiom/${name}"
primitive: ${name}
section: examples
exampleId: ${name}-basic
source:
  path: packages/${name}/src/index.tsx
  export: ${parts[0].name}
  language: tsx
runnable: false
runnableReason: "${hasKeyboard ? "Runnable island to be created when this primitive is fully retrofitted." : "No keyboard interaction declared in the accessibility contract."}"
---

\`\`\`tsx
import * as ${titleCase(name)} from "@solidiom/${name}"

;<${titleCase(name)}.${parts[0].name}>${label} content</${titleCase(name)}.${parts[0].name}>
\`\`\`
`
}

function genExampleEs(
  name: string,
  registry: RegistryEntry,
  parts: PartInfo[],
  hasKeyboard: boolean,
  enHash: string,
): string {
  const label = registry.label || labelFromName(name)
  return `---
contentSchemaVersion: 1
title: ${label} - Uso básico
description: Ejemplo básico de ${label.toLowerCase()} demostrando el comportamiento principal.
keywords: [${name}, básico, ejemplo]
locale: es
maturity: draft
product: ${label}
productLayer: primitive
status: draft
package: "@solidiom/${name}"
primitive: ${name}
section: examples
exampleId: ${name}-basic
source:
  path: packages/${name}/src/index.tsx
  export: ${parts[0].name}
  language: tsx
runnable: false
runnableReason: "${hasKeyboard ? "Se creará un island interactivo cuando este primitivo se retrofit completamente." : "Sin interacción con teclado declarada en el contrato de accesibilidad."}"
translationSourceHash: "${enHash}"
translationStatus: draft
---

\`\`\`tsx
import * as ${titleCase(name)} from "@solidiom/${name}"

;<${titleCase(name)}.${parts[0].name}>Contenido de ${label}</${titleCase(name)}.${parts[0].name}>
\`\`\`
`
}

function genContract(
  name: string,
  registry: RegistryEntry,
  parts: PartInfo[],
  hasKeyboard: boolean,
): string {
  const label = registry.label || labelFromName(name)
  const kbTable = KEYBOARD_TABLES[name] || []
  const kbYaml =
    hasKeyboard && kbTable.length > 0
      ? kbTable.map((k) => `  - key: ${k.key}\n    behavior: ${k.behavior}`).join("\n")
      : ""

  return `---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: ${label} - Accessibility Contract
description: Keyboard, focus, semantic, and consumer responsibilities for ${label}.
keywords: [${name}, accessibility, keyboard, focus, aria]
locale: en
maturity: draft
product: ${label}
productLayer: primitive
status: draft
package: "@solidiom/${name}"
primitive: ${name}
section: accessibility
keyboard:${kbYaml ? "\n" + kbYaml : " []"}
focus:
  - "${parts[0].name} receives focus via standard tab order."
semantics:
  - 'Carries \`data-scope="${name}"\` and \`data-part\` attributes on all parts.'
aria: []
consumerDuties:
  - "Ensure visible labels or aria-label are provided where required."
nonApplicableCriteria: []
reviewStatus: draft
---

`
}

function genContractEs(
  name: string,
  registry: RegistryEntry,
  parts: PartInfo[],
  hasKeyboard: boolean,
  enHash: string,
): string {
  const label = registry.label || labelFromName(name)
  const kbTable = KEYBOARD_TABLES[name] || []
  const kbYaml =
    hasKeyboard && kbTable.length > 0
      ? kbTable.map((k) => `  - key: ${k.key}\n    behavior: ${k.behaviorEs}`).join("\n")
      : ""

  return `---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: ${label} - Contrato de Accesibilidad
description: Teclado, foco, semántica y responsabilidades del consumidor para ${label}.
keywords: [${name}, accesibilidad, teclado, foco, aria]
locale: es
maturity: draft
product: ${label}
productLayer: primitive
status: draft
package: "@solidiom/${name}"
primitive: ${name}
section: accessibility
keyboard:${kbYaml ? "\n" + kbYaml : " []"}
focus:
  - "${parts[0].name} recibe foco mediante el orden de tabulación estándar."
semantics:
  - 'Lleva los atributos \`data-scope="${name}"\` y \`data-part\` en todas las partes.'
aria: []
consumerDuties:
  - "Asegurar que se proporcionen etiquetas visibles o aria-label donde sea necesario."
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "${enHash}"
translationStatus: draft
---

`
}

// ─── Main ───────────────────────────────────────────────────────────────────

function scaffoldPrimitive(name: string, force: boolean): boolean {
  const docsDir = join(ROOT, "packages", name, "docs")
  if (existsSync(join(docsDir, "overview.md")) && !force) {
    console.log(`  ⊘ ${name}: docs/ already exists (use --force to overwrite)`)
    return false
  }

  const registry = readJSON<RegistryEntry>(join(ROOT, "registry", `${name}.json`))
  if (!registry) {
    console.error(`  ✗ ${name}: no registry/${name}.json`)
    return false
  }

  const parts = extractParts(name)
  const hasKeyboard = detectKeyboard(name, parts)

  // Create directory structure
  for (const dir of [
    docsDir,
    join(docsDir, "examples"),
    join(docsDir, "accessibility"),
    join(docsDir, "es"),
    join(docsDir, "es", "examples"),
    join(docsDir, "es", "accessibility"),
  ]) {
    mkdirSync(dir, { recursive: true })
  }

  // Generate EN files
  const enOverview = genOverview(name, registry, parts, hasKeyboard)
  writeFileSync(join(docsDir, "overview.md"), enOverview)

  const enExample = genExample(name, registry, parts, hasKeyboard)
  writeFileSync(join(docsDir, "examples", "basic.md"), enExample)

  const enContract = genContract(name, registry, parts, hasKeyboard)
  writeFileSync(join(docsDir, "accessibility", "contract.md"), enContract)

  // Compute EN hashes for ES files without invoking a shell.
  const overviewHash = sha256File(join(docsDir, "overview.md"))
  const exampleHash = sha256File(join(docsDir, "examples", "basic.md"))
  const contractHash = sha256File(join(docsDir, "accessibility", "contract.md"))

  // Generate ES files
  const esOverview = genOverviewEs(name, registry, parts, hasKeyboard, overviewHash)
  writeFileSync(join(docsDir, "es", "overview.md"), esOverview)

  const esExample = genExampleEs(name, registry, parts, hasKeyboard, exampleHash)
  writeFileSync(join(docsDir, "es", "examples", "basic.md"), esExample)

  const esContract = genContractEs(name, registry, parts, hasKeyboard, contractHash)
  writeFileSync(join(docsDir, "es", "accessibility", "contract.md"), esContract)

  console.log(`  ✓ ${name} (${parts.length} parts, keyboard=${hasKeyboard})`)
  return true
}

// ─── CLI ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const force = args.includes("--force")
const all = args.includes("--all")
const names = all
  ? PUBLIC_PRIMITIVES.filter(
      (n) => !existsSync(join(ROOT, "packages", n, "docs", "overview.md")) || force,
    )
  : args.filter((a) => !a.startsWith("--"))

if (names.length === 0) {
  console.log("Usage: tsx tools/scaffold-primitive-docs.ts <name> [--force]")
  console.log("       tsx tools/scaffold-primitive-docs.ts --all [--force]")
  process.exit(0)
}

console.log(`Scaffolding docs for ${names.length} primitive(s):\n`)
let count = 0
for (const name of names) {
  if (scaffoldPrimitive(name, force)) count++
}
console.log(`\n${count} primitive(s) scaffolded. Run prettier and regenerate evidence/registry.`)
