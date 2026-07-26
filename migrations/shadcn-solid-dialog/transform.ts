/**
 * shadcn-solid Dialog → @solidiom/dialog migration transform.
 *
 * Rewrites:
 * 1. Imports: `@shadcn-solid/dialog` or `~/components/ui/dialog` → `@solidiom/dialog`
 * 2. Identifiers: `Dialog.Root` → `Root`, `Dialog.Trigger` → `Trigger`, etc.
 * 3. Props: `onOpenChange` callback signature adjustments.
 * 4. JSX namespace: `<Dialog.Content>` → `<Content>` (or aliased).
 *
 * The transform operates on source text using regex-based AST-lite patterns.
 * It is safe for idempotent re-runs and produces diagnostics for unsupported patterns.
 *
 * Usage:
 *   import { transform } from "./transform"
 *   const result = transform(sourceCode, { filePath: "src/my-dialog.tsx" })
 *   // result.code — transformed source (or original if no changes)
 *   // result.diagnostics — actionable messages for manual review
 *   // result.changed — whether any transformation was applied
 */

export interface TransformOptions {
  /** File path for diagnostic messages. */
  filePath?: string
  /** If true, return the patch diff instead of mutating. */
  dryRun?: boolean
}

export interface TransformDiagnostic {
  line: number
  message: string
  severity: "info" | "warning" | "error"
}

export interface TransformResult {
  code: string
  changed: boolean
  diagnostics: TransformDiagnostic[]
}

/** Known shadcn-solid dialog import sources. */
const SHADCN_DIALOG_IMPORTS = [
  "@shadcn-solid/dialog",
  "~/components/ui/dialog",
  "../components/ui/dialog",
  "./components/ui/dialog",
  "@kobalte/core/dialog",
  "@kobalte/core",
]

/** Map of shadcn-solid/Kobalte Dialog parts to Solidiom parts. */
const PART_MAP: Record<string, string> = {
  Root: "Root",
  Trigger: "Trigger",
  Portal: "Portal",
  Overlay: "Backdrop",
  Content: "Content",
  Title: "Title",
  Description: "Description",
  Close: "Close",
  CloseButton: "Close",
}

/** Parts that exist in shadcn-solid but have no direct Solidiom equivalent. */
const UNSUPPORTED_PARTS = ["Header", "Footer"] as const

export function transform(source: string, options: TransformOptions = {}): TransformResult {
  const diagnostics: TransformDiagnostic[] = []
  let code = source
  let changed = false

  // ─── Step 1: Detect and rewrite imports ──────────────────────────────────

  // Match: import { Dialog } from "@shadcn-solid/dialog"
  // Match: import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog"
  // Match: import { Dialog } from "@kobalte/core/dialog"
  const importRegex =
    /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g

  let importMatch: RegExpExecArray | null
  const importSources: string[] = []

  // First pass: identify which imports are shadcn-solid dialog imports
  const tempCode = code
  while ((importMatch = importRegex.exec(tempCode)) !== null) {
    const importSource = importMatch[2]!
    if (SHADCN_DIALOG_IMPORTS.some((s) => importSource.includes(s) || importSource === s)) {
      importSources.push(importSource)
    }
  }

  if (importSources.length === 0) {
    // No shadcn-solid dialog imports found — nothing to transform
    return { code: source, changed: false, diagnostics }
  }

  // Rewrite imports
  for (const src of importSources) {
    const srcEscaped = src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const importPattern = new RegExp(
      `import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${srcEscaped}['"]`,
      "g",
    )

    code = code.replace(importPattern, (_match, specifiers: string) => {
      changed = true
      const specs = specifiers
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)

      const solidiomParts: string[] = []
      const unmapped: string[] = []

      for (const spec of specs) {
        // Handle: Dialog (namespace import used as Dialog.Root, etc.)
        if (spec === "Dialog") {
          // Will handle namespace usage in Step 2
          solidiomParts.push(
            ...Object.values(PART_MAP).filter(
              (v, i, arr) => arr.indexOf(v) === i,
            ),
          )
          continue
        }

        // Handle: DialogContent → Content, DialogTrigger → Trigger, etc.
        const withoutPrefix = spec.replace(/^Dialog/, "")
        if (PART_MAP[withoutPrefix]) {
          solidiomParts.push(PART_MAP[withoutPrefix]!)
        } else if (
          (UNSUPPORTED_PARTS as readonly string[]).includes(withoutPrefix)
        ) {
          const line = getLineNumber(code, code.indexOf(spec))
          diagnostics.push({
            line,
            message: `"${spec}" has no direct Solidiom equivalent. Use a plain <div> or custom wrapper instead.`,
            severity: "warning",
          })
        } else if (spec.startsWith("Dialog")) {
          // Unknown Dialog* export
          unmapped.push(spec)
          const line = getLineNumber(code, code.indexOf(spec))
          diagnostics.push({
            line,
            message: `"${spec}" is not a recognized shadcn-solid Dialog part. Manual migration required.`,
            severity: "error",
          })
        } else {
          unmapped.push(spec)
        }
      }

      // Deduplicate
      const uniqueParts = [...new Set(solidiomParts)]
      const importLine = `import { ${uniqueParts.join(", ")} } from "@solidiom/dialog"`

      if (unmapped.length > 0) {
        return `${importLine}\n// TODO: manual migration needed for: ${unmapped.join(", ")}`
      }
      return importLine
    })
  }

  // ─── Step 2: Rewrite Dialog.Part JSX and expressions ─────────────────────

  // <Dialog.Root> → <Root>, </Dialog.Root> → </Root>
  for (const [shadcnPart, solidiomPart] of Object.entries(PART_MAP)) {
    const jsxPattern = new RegExp(`(<\\/?)Dialog\\.${shadcnPart}(\\s|>|\\/)`, "g")
    const newCode = code.replace(jsxPattern, `$1${solidiomPart}$2`)
    if (newCode !== code) {
      changed = true
      code = newCode
    }
  }

  // ─── Step 3: Rewrite Overlay → Backdrop ──────────────────────────────────

  // <DialogOverlay> → <Backdrop>
  code = code.replace(/<(\/?)DialogOverlay(\s|>|\/)/g, (match, slash, rest) => {
    changed = true
    return `<${slash}Backdrop${rest}`
  })

  // <DialogContent> → <Content>, etc.
  for (const [shadcnPart, solidiomPart] of Object.entries(PART_MAP)) {
    const prefixedPattern = new RegExp(`(<\\/?)Dialog${shadcnPart}(\\s|>|\\/)`, "g")
    const newCode = code.replace(prefixedPattern, `$1${solidiomPart}$2`)
    if (newCode !== code) {
      changed = true
      code = newCode
    }
  }

  // ─── Step 4: Props adjustments ───────────────────────────────────────────

  // shadcn-solid: onOpenChange={(open) => setOpen(open)}
  // Solidiom: onOpenChange={(open, details) => setOpen(open)}
  // This is backward-compatible, no rewrite needed, but add info diagnostic
  if (code.includes("onOpenChange")) {
    const lines = code.split("\n")
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]!.includes("onOpenChange") && !lines[i]!.includes("details")) {
        diagnostics.push({
          line: i + 1,
          message:
            'onOpenChange now receives a second "details" parameter with the dismiss reason. Update the callback signature if needed.',
          severity: "info",
        })
      }
    }
  }

  // ─── Step 5: Detect unsupported patterns ─────────────────────────────────

  for (const part of UNSUPPORTED_PARTS) {
    const pattern = new RegExp(`<(\/?)Dialog\\.?${part}(\\s|>|\\/)`, "g")
    if (pattern.test(code)) {
      const line = getLineNumber(code, code.search(pattern))
      diagnostics.push({
        line,
        message: `"Dialog.${part}" / "Dialog${part}" has no Solidiom primitive equivalent. Replace with a plain element.`,
        severity: "warning",
      })
    }
  }

  return { code, changed, diagnostics }
}

/** Get 1-based line number for a character offset. */
function getLineNumber(source: string, offset: number): number {
  if (offset < 0) return 1
  return source.slice(0, offset).split("\n").length
}
