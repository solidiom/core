/**
 * CONTENT-005 canonical example source extraction.
 *
 * Displayed example code and the code that actually executes must come from
 * the same file. Rather than dumping an entire source file verbatim (which
 * would also render unrelated imports, helper tables, and doc comments), this
 * extracts exactly the named export declared by the content's `source.export`
 * frontmatter field — the same export that the live island imports and
 * renders.
 *
 * Extraction is declaration-boundary aware (matching top-level `export`
 * statements and their balanced brace bodies) but intentionally does not
 * require a full TypeScript parser: examples are short, hand-authored
 * components, and this keeps example rendering free of a heavy AST
 * dependency in the static content pipeline.
 */

export interface ExtractedExport {
  /** The exact source text of the named export, including its `export` keyword. */
  code: string
  /** True when the whole file was returned because the named export could not be isolated. */
  fallback: boolean
}

const EXPORT_DECLARATION_PATTERN =
  /^export\s+(?:default\s+)?(?:async\s+)?(?:function|class|const|let|var|interface|type)\s+([A-Za-z_$][\w$]*)/

/**
 * Extracts the source text of a single named top-level export from a TS/TSX
 * file's content. Returns the full file content (with `fallback: true`) when
 * the export cannot be located, so callers can still show something useful
 * rather than silently omitting the example.
 */
export function extractNamedExport(sourceCode: string, exportName: string): ExtractedExport {
  const lines = sourceCode.split("\n")
  let startLine = -1

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i]!.match(EXPORT_DECLARATION_PATTERN)
    if (match && match[1] === exportName) {
      startLine = i
      break
    }
  }

  if (startLine === -1) {
    return { code: sourceCode, fallback: true }
  }

  const declarationLine = lines[startLine]!
  const isBraceBody = /[{]\s*$/.test(declarationLine) || /=>\s*[{]\s*$/.test(declarationLine)

  // Declarations without a brace body on the first line (e.g. `export const X =`
  // followed by an object/JSX expression on subsequent lines, or a one-line
  // `export const X = 1`) are handled by scanning forward for balanced
  // braces/parens starting from the first line, falling back to a single
  // statement terminated by a blank line or EOF.
  let endLine = startLine
  let depth = 0
  let sawOpener = false

  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i]!
    for (const char of line) {
      if (char === "{" || char === "(" || char === "[") {
        depth++
        sawOpener = true
      } else if (char === "}" || char === ")" || char === "]") {
        depth--
      }
    }
    endLine = i
    if (sawOpener && depth <= 0) break
    // No braces at all (e.g. `export const X = 1`) — stop at the first blank
    // line or end of file after the declaration line.
    if (!sawOpener && i > startLine && line.trim() === "") {
      endLine = i - 1
      break
    }
  }

  if (!isBraceBody && !sawOpener) {
    endLine = startLine
  }

  const extracted = lines
    .slice(startLine, endLine + 1)
    .join("\n")
    .replace(/\s+$/, "")
  return { code: extracted, fallback: false }
}
