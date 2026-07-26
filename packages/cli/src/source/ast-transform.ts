/**
 * AST-based transformations for source-mode installs using ts-morph.
 *
 * Responsibilities:
 * 1. Rewrite @solidiom/runtime imports to relative paths (structurally, not regex).
 * 2. Rewrite named/namespace imports with proper specifier handling.
 * 3. Apply migration transforms (rename components, remap imports, adjust props).
 */

import { Project, SyntaxKind, type SourceFile, type ImportDeclaration } from "ts-morph"

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

// ─── Migration Transforms ────────────────────────────────────────────────────

export interface MigrationSpec {
  /** Old package/module specifier to match. */
  fromModule: string
  /** New module specifier. */
  toModule: string
  /** Import name mapping (old → new). Unmapped names pass through. */
  importMap: Record<string, string>
  /** Prop name mapping for JSX elements (old → new, null = remove). */
  propMap: Record<string, string | null>
}

export interface MigrationResult {
  code: string
  changed: boolean
  importsRewritten: number
  identifiersRenamed: number
  propsRemapped: number
}

/**
 * Applies a migration transform to source code using ts-morph AST manipulation.
 *
 * Steps:
 * 1. Find all import declarations matching `fromModule`.
 * 2. Rewrite module specifier to `toModule`.
 * 3. Rename imported identifiers per `importMap`.
 * 4. Rename JSX element usages to match new import names.
 * 5. Remap props per `propMap` (rename or remove).
 */
export function applyMigration(content: string, spec: MigrationSpec): MigrationResult {
  const project = createInMemoryProject()
  const sourceFile = project.createSourceFile("migration-target.tsx", content, { overwrite: true })

  let importsRewritten = 0
  let identifiersRenamed = 0
  let propsRemapped = 0

  // Step 1-3: Rewrite imports
  const imports = sourceFile.getImportDeclarations()
  for (const imp of imports) {
    const moduleSpec = imp.getModuleSpecifierValue()
    if (!matchesModuleSpecifier(moduleSpec, spec.fromModule)) continue

    // Rewrite module specifier
    imp.setModuleSpecifier(spec.toModule)
    importsRewritten++

    // Rename named imports
    const namedImports = imp.getNamedImports()
    for (const named of namedImports) {
      const oldName = named.getName()
      const newName = spec.importMap[oldName]
      if (newName && newName !== oldName) {
        // If there's an alias, rename the imported name
        const alias = named.getAliasNode()
        if (alias) {
          // `import { DialogClose as X }` → `import { Close as X }`
          named.setName(newName)
        } else {
          // `import { DialogClose }` → `import { Close }`
          // Also need to rename all usages in the file
          named.setName(newName)
          renameIdentifierInFile(sourceFile, oldName, newName)
          identifiersRenamed++
        }
      }
    }
  }

  // Step 5: Remap JSX props
  const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement)
  const selfClosing = sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
  const allJsxElements = [...jsxElements, ...selfClosing]

  for (const jsx of allJsxElements) {
    const attrs = jsx.getAttributes()
    for (const attr of attrs) {
      if (attr.getKind() !== SyntaxKind.JsxAttribute) continue
      const jsxAttr = attr.asKindOrThrow(SyntaxKind.JsxAttribute)
      const attrName = jsxAttr.getNameNode().getText()

      if (attrName in spec.propMap) {
        const newPropName = spec.propMap[attrName]
        if (newPropName === null || newPropName === undefined) {
          // Remove the attribute
          jsxAttr.remove()
          propsRemapped++
        } else if (newPropName !== attrName) {
          // Rename the attribute
          jsxAttr.getNameNode().replaceWithText(newPropName)
          propsRemapped++
        }
      }
    }
  }

  const code = sourceFile.getFullText()
  const changed = importsRewritten > 0 || identifiersRenamed > 0 || propsRemapped > 0

  return { code, changed, importsRewritten, identifiersRenamed, propsRemapped }
}

/** Check if a module specifier matches the target (exact or prefix). */
function matchesModuleSpecifier(actual: string, target: string): boolean {
  return actual === target || actual.startsWith(`${target}/`)
}

/** Rename all identifier references in a source file. */
function renameIdentifierInFile(sourceFile: SourceFile, oldName: string, newName: string): void {
  const identifiers = sourceFile.getDescendantsOfKind(SyntaxKind.Identifier)
  for (const id of identifiers) {
    if (id.getText() === oldName) {
      id.replaceWithText(newName)
    }
  }
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
