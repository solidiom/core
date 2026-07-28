/**
 * AST-based transformations for source-mode installs using ts-morph.
 *
 * Responsibilities:
 * 1. Rewrite @solidiom/runtime imports to relative paths (structurally, not regex).
 * 2. Rewrite named/namespace imports with proper specifier handling.
 * 3. Shared helpers for AST project creation.
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
//# sourceMappingURL=ast-transform.d.ts.map