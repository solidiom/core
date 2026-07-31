/**
 * AST-based transformations for source-mode installs using ts-morph.
 *
 * Responsibilities:
 * 1. Rewrite @solidiom/runtime imports to relative paths (structurally, not regex).
 * 2. Rewrite named/namespace imports with proper specifier handling.
 * 3. Shared helpers for AST project creation.
 */

import { Project, type ImportDeclaration } from "ts-morph"

// ─── Import Rewriting ────────────────────────────────────────────────────────

export interface RewriteImportsOptions {
  /** Source file content. */
  content: string
  /** Absolute path where the file will be placed (for relative path calculation). */
  filePath: string
  /** Absolute path to the _runtime directory. */
  runtimeDir: string
  /** File name for the in-memory source file (used by ts-morph). */
  fileName?: string
}

export interface RewriteImportsResult {
  /** Transformed source code. */
  code: string
  /** Whether any changes were made. */
  changed: boolean
  /** Import module specifiers that were rewritten. */
  rewritten: string[]
}

/**
 * Rewrites @solidiom/runtime imports to relative paths using ts-morph AST manipulation.
 *
 * Handles:
 *   - `import { X } from "@solidiom/runtime"` → relative barrel import
 *   - `import { X } from "@solidiom/runtime/collection/roving-focus"` → relative subpath
 *   - `import type { X } from "@solidiom/runtime"` → same rewrite for type imports
 *   - re-exports: `export { X } from "@solidiom/runtime"` → relative path
 */
export function rewriteImportsAst(options: RewriteImportsOptions): RewriteImportsResult {
  const { content, filePath, runtimeDir, fileName = "source.tsx" } = options

  const project = createInMemoryProject()
  const sourceFile = project.createSourceFile(fileName, content, { overwrite: true })
  const rewritten: string[] = []

  // Process import declarations
  const imports = sourceFile.getImportDeclarations()
  for (const imp of imports) {
    const rewriteResult = rewriteSingleImport(imp, filePath, runtimeDir)
    if (rewriteResult) {
      rewritten.push(rewriteResult)
    }
  }

  // Process export declarations with module specifiers
  const exports = sourceFile.getExportDeclarations()
  for (const exp of exports) {
    const moduleSpecifier = exp.getModuleSpecifierValue()
    if (moduleSpecifier && moduleSpecifier.startsWith("@solidiom/runtime")) {
      const newPath = computeRelativeRuntimePath(moduleSpecifier, filePath, runtimeDir)
      exp.setModuleSpecifier(newPath)
      rewritten.push(moduleSpecifier)
    }
  }

  const changed = rewritten.length > 0
  const code = changed ? sourceFile.getFullText() : content

  return { code, changed, rewritten }
}

/** Rewrite a single import declaration if it targets @solidiom/runtime. Returns the old specifier or null. */
function rewriteSingleImport(
  imp: ImportDeclaration,
  filePath: string,
  runtimeDir: string,
): string | null {
  const moduleSpecifier = imp.getModuleSpecifierValue()
  if (!moduleSpecifier.startsWith("@solidiom/runtime")) return null

  const newPath = computeRelativeRuntimePath(moduleSpecifier, filePath, runtimeDir)
  imp.setModuleSpecifier(newPath)
  return moduleSpecifier
}

/** Compute the relative path from a file to the runtime directory for a given import specifier. */
function computeRelativeRuntimePath(
  specifier: string,
  filePath: string,
  runtimeDir: string,
): string {
  // Use node:path for cross-platform relative computation
  const { relative, dirname } = require("node:path") as typeof import("node:path")
  const fileDir = dirname(filePath)
  let relToRuntime = relative(fileDir, runtimeDir).replace(/\\/g, "/")
  if (!relToRuntime.startsWith(".")) relToRuntime = `./${relToRuntime}`

  // @solidiom/runtime → ./relative/_runtime/index
  // @solidiom/runtime/collection/roving-focus → ./relative/_runtime/collection/roving-focus
  const subpath = specifier.replace("@solidiom/runtime", "")
  const target = subpath ? `${relToRuntime}${subpath}` : `${relToRuntime}/index`
  return target
}

// ─── Shared Helpers ──────────────────────────────────────────────────────────

/** Create an in-memory ts-morph project (no file system interaction). */
function createInMemoryProject(): Project {
  return new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      target: 99, // ESNext
      module: 99, // ESNext
      jsx: 1, // Preserve
      strict: true,
      skipLibCheck: true,
    },
  })
}
