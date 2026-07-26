/**
 * AST-based transformations for source-mode installs using ts-morph.
 *
 * Responsibilities:
 * 1. Rewrite @solidiom/runtime imports to relative paths (structurally, not regex).
 * 2. Rewrite named/namespace imports with proper specifier handling.
 * 3. Apply migration transforms (rename components, remap imports, adjust props).
 */
export interface RewriteImportsOptions {
    /** Source file content. */
    content: string;
    /** Absolute path where the file will be placed (for relative path calculation). */
    filePath: string;
    /** Absolute path to the _runtime directory. */
    runtimeDir: string;
    /** File name for the in-memory source file (used by ts-morph). */
    fileName?: string;
}
export interface RewriteImportsResult {
    /** Transformed source code. */
    code: string;
    /** Whether any changes were made. */
    changed: boolean;
    /** Import module specifiers that were rewritten. */
    rewritten: string[];
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
export declare function rewriteImportsAst(options: RewriteImportsOptions): RewriteImportsResult;
export interface MigrationSpec {
    /** Old package/module specifier to match. */
    fromModule: string;
    /** New module specifier. */
    toModule: string;
    /** Import name mapping (old → new). Unmapped names pass through. */
    importMap: Record<string, string>;
    /** Prop name mapping for JSX elements (old → new, null = remove). */
    propMap: Record<string, string | null>;
}
export interface MigrationResult {
    code: string;
    changed: boolean;
    importsRewritten: number;
    identifiersRenamed: number;
    propsRemapped: number;
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
export declare function applyMigration(content: string, spec: MigrationSpec): MigrationResult;
//# sourceMappingURL=ast-transform.d.ts.map