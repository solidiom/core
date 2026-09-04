interface TextReplacement {
  start: number
  end: number
  text: string
}

interface ScanBudget {
  remaining: number
}

export interface CvaDeclaration {
  start: number
  end: number
  name: string
  exported: boolean
  baseSource: string
  configSource: string
}

export interface ObjectCall {
  start: number
  end: number
  name: string
  objectSource: string
}

function isIdentifierStart(char: string | undefined): boolean {
  if (!char) return false
  const code = char.charCodeAt(0)
  return char === "$" || char === "_" || (code >= 65 && code <= 90) || (code >= 97 && code <= 122)
}

function isIdentifierPart(char: string | undefined): boolean {
  if (!char) return false
  const code = char.charCodeAt(0)
  return isIdentifierStart(char) || (code >= 48 && code <= 57)
}

function isWhitespace(char: string | undefined): boolean {
  return char === " " || char === "\t" || char === "\n" || char === "\r" || char === "\f"
}

function skipTrivia(code: string, start: number): number {
  let cursor = start
  while (cursor < code.length) {
    if (isWhitespace(code[cursor])) {
      cursor++
      continue
    }
    if (code[cursor] === "/" && code[cursor + 1] === "/") {
      cursor += 2
      while (cursor < code.length && code[cursor] !== "\n") cursor++
      continue
    }
    if (code[cursor] === "/" && code[cursor + 1] === "*") {
      const end = code.indexOf("*/", cursor + 2)
      return end === -1 ? code.length : skipTrivia(code, end + 2)
    }
    break
  }
  return cursor
}

function skipWhitespaceBackward(code: string, start: number): number {
  let cursor = start
  while (cursor >= 0 && isWhitespace(code[cursor])) cursor--
  return cursor
}

function scanQuoted(code: string, start: number, budget?: ScanBudget): number | null {
  const quote = code[start]
  if (quote !== '"' && quote !== "'" && quote !== "`") return null

  for (let cursor = start + 1; cursor < code.length; cursor++) {
    if (budget && --budget.remaining < 0) return null
    if (code[cursor] === "\\") {
      cursor++
      if (budget) budget.remaining--
      continue
    }
    if (code[cursor] === quote) return cursor + 1
  }
  return null
}

function scanBalanced(
  code: string,
  start: number,
  open: "{" | "(",
  close: "}" | ")",
  budget?: ScanBudget,
): number | null {
  if (code[start] !== open) return null
  let depth = 1

  for (let cursor = start + 1; cursor < code.length; cursor++) {
    if (budget && --budget.remaining < 0) return null
    const char = code[cursor]
    if (char === '"' || char === "'" || char === "`") {
      const end = scanQuoted(code, cursor, budget)
      if (end === null) return null
      cursor = end - 1
      continue
    }
    if (char === "/" && code[cursor + 1] === "/") {
      cursor += 2
      while (cursor < code.length && code[cursor] !== "\n") {
        if (budget && --budget.remaining < 0) return null
        cursor++
      }
      continue
    }
    if (char === "/" && code[cursor + 1] === "*") {
      const end = code.indexOf("*/", cursor + 2)
      if (end === -1) return null
      if (budget) budget.remaining -= end + 2 - cursor
      if (budget && budget.remaining < 0) return null
      cursor = end + 1
      continue
    }
    if (char === open) depth++
    if (char === close && --depth === 0) return cursor + 1
  }
  return null
}

function readDeclarationBefore(
  code: string,
  callStart: number,
): {
  start: number
  name: string
  exported: boolean
} | null {
  let cursor = skipWhitespaceBackward(code, callStart - 1)
  if (code[cursor] !== "=") return null

  cursor = skipWhitespaceBackward(code, cursor - 1)
  const nameEnd = cursor + 1
  while (cursor >= 0 && isIdentifierPart(code[cursor])) cursor--
  const nameStart = cursor + 1
  if (nameStart === nameEnd || !isIdentifierStart(code[nameStart])) return null
  const name = code.slice(nameStart, nameEnd)

  cursor = skipWhitespaceBackward(code, cursor)
  const constEnd = cursor + 1
  const constStart = constEnd - "const".length
  if (constStart < 0 || code.slice(constStart, constEnd) !== "const") return null
  if (isIdentifierPart(code[constStart - 1])) return null

  cursor = skipWhitespaceBackward(code, constStart - 1)
  const exportEnd = cursor + 1
  const exportStart = exportEnd - "export".length
  const exported =
    exportStart >= 0 &&
    code.slice(exportStart, exportEnd) === "export" &&
    !isIdentifierPart(code[exportStart - 1])

  return { start: exported ? exportStart : constStart, name, exported }
}

function readCvaDeclaration(
  code: string,
  callStart: number,
  openParen: number,
  budget: ScanBudget,
): CvaDeclaration | null {
  const declaration = readDeclarationBefore(code, callStart)
  if (!declaration) return null

  let cursor = skipTrivia(code, openParen + 1)
  const baseEnd = scanQuoted(code, cursor, budget)
  if (baseEnd === null) return null
  const baseSource = code.slice(cursor, baseEnd)
  if (baseSource[0] === "`" && baseSource.includes("${")) return null

  cursor = skipTrivia(code, baseEnd)
  if (code[cursor] !== ",") return null
  cursor = skipTrivia(code, cursor + 1)
  if (code[cursor] !== "{") return null

  const configEnd = scanBalanced(code, cursor, "{", "}", budget)
  if (configEnd === null) return null
  const configSource = code.slice(cursor, configEnd)

  const callEnd = skipTrivia(code, configEnd)
  if (code[callEnd] !== ")") return null

  return {
    ...declaration,
    end: callEnd + 1,
    baseSource,
    configSource,
  }
}

function forEachCodeIdentifier(
  code: string,
  visit: (name: string, start: number, end: number) => void,
): void {
  for (let cursor = 0; cursor < code.length;) {
    const char = code[cursor]
    if (char === '"' || char === "'" || char === "`") {
      cursor = scanQuoted(code, cursor) ?? code.length
      continue
    }
    if (char === "/" && code[cursor + 1] === "/") {
      cursor += 2
      while (cursor < code.length && code[cursor] !== "\n") cursor++
      continue
    }
    if (char === "/" && code[cursor + 1] === "*") {
      const end = code.indexOf("*/", cursor + 2)
      cursor = end === -1 ? code.length : end + 2
      continue
    }
    if (!isIdentifierStart(char)) {
      cursor++
      continue
    }

    const start = cursor++
    while (cursor < code.length && isIdentifierPart(code[cursor])) cursor++
    visit(code.slice(start, cursor), start, cursor)
  }
}

export function removeNamedImportSpecifier(
  code: string,
  moduleName: string,
  importedName: string,
): string {
  const replacements: TextReplacement[] = []
  const budget: ScanBudget = { remaining: code.length }

  forEachCodeIdentifier(code, (name, importStart, importEnd) => {
    if (name !== "import" || budget.remaining <= 0) return

    let cursor = skipTrivia(code, importEnd)
    if (code[cursor] !== "{") return
    const namedEnd = scanBalanced(code, cursor, "{", "}", budget)
    if (namedEnd === null) return

    const openBrace = cursor
    cursor = skipTrivia(code, namedEnd)
    const from = readIdentifierAt(code, cursor)
    if (!from || from.name !== "from") return

    cursor = skipTrivia(code, from.end)
    const moduleEnd = scanQuoted(code, cursor, budget)
    if (moduleEnd === null) return
    const moduleSource = code.slice(cursor, moduleEnd)
    if (parseStaticStringLiteral(moduleSource) !== moduleName) return

    const specifiers = readNamedImportSpecifiers(code, openBrace + 1, namedEnd - 1)
    if (!specifiers.some((specifier) => specifier.importedName === importedName)) return

    const remaining = specifiers.filter((specifier) => specifier.importedName !== importedName)
    if (remaining.length > 0) {
      replacements.push({
        start: openBrace + 1,
        end: namedEnd - 1,
        text: ` ${remaining.map((specifier) => specifier.source).join(", ")} `,
      })
      return
    }

    let declarationEnd = moduleEnd
    while (code[declarationEnd] === " " || code[declarationEnd] === "\t") declarationEnd++
    if (code[declarationEnd] === ";") declarationEnd++
    if (code[declarationEnd] === "\r") declarationEnd++
    if (code[declarationEnd] === "\n") declarationEnd++
    replacements.push({ start: importStart, end: declarationEnd, text: "" })
  })

  return replacements.length > 0 ? applyTextReplacements(code, replacements) : code
}

function readIdentifierAt(code: string, start: number): { name: string; end: number } | null {
  if (!isIdentifierStart(code[start])) return null
  let end = start + 1
  while (end < code.length && isIdentifierPart(code[end])) end++
  return { name: code.slice(start, end), end }
}

function readNamedImportSpecifiers(
  code: string,
  start: number,
  end: number,
): Array<{ importedName: string | null; source: string }> {
  const specifiers: Array<{ importedName: string | null; source: string }> = []
  let segmentStart = start
  let cursor = start

  const appendSpecifier = (segmentEnd: number) => {
    const source = code.slice(segmentStart, segmentEnd).trim()
    if (!source) return
    let importedName: string | null = null
    forEachCodeIdentifier(source, (name) => {
      if (importedName === null && name !== "type") importedName = name
    })
    specifiers.push({ importedName, source })
  }

  while (cursor < end) {
    const char = code[cursor]
    if (char === '"' || char === "'" || char === "`") {
      cursor = Math.min(scanQuoted(code, cursor) ?? end, end)
      continue
    }
    if (char === "/" && code[cursor + 1] === "/") {
      cursor += 2
      while (cursor < end && code[cursor] !== "\n") cursor++
      continue
    }
    if (char === "/" && code[cursor + 1] === "*") {
      const commentEnd = code.indexOf("*/", cursor + 2)
      cursor = commentEnd === -1 || commentEnd >= end ? end : commentEnd + 2
      continue
    }
    if (char === ",") {
      appendSpecifier(cursor)
      segmentStart = cursor + 1
    }
    cursor++
  }

  appendSpecifier(end)
  return specifiers
}

export function findCvaDeclarations(code: string): CvaDeclaration[] {
  const declarations: CvaDeclaration[] = []
  const budget: ScanBudget = { remaining: code.length }
  forEachCodeIdentifier(code, (name, start, end) => {
    if (name !== "cva" || budget.remaining < 0) return
    const openParen = skipTrivia(code, end)
    if (code[openParen] !== "(") return
    const declaration = readCvaDeclaration(code, start, openParen, budget)
    if (declaration) declarations.push(declaration)
  })
  return declarations
}

export function findObjectCalls(code: string, names: ReadonlySet<string>): ObjectCall[] {
  const calls: ObjectCall[] = []
  const budget: ScanBudget = { remaining: code.length }
  forEachCodeIdentifier(code, (name, start, end) => {
    if (!names.has(name) || budget.remaining < 0) return
    let cursor = skipTrivia(code, end)
    if (code[cursor] !== "(") return
    cursor = skipTrivia(code, cursor + 1)
    if (code[cursor] !== "{") return

    const objectEnd = scanBalanced(code, cursor, "{", "}", budget)
    if (objectEnd === null) return
    const closeParen = skipTrivia(code, objectEnd)
    if (code[closeParen] !== ")") return

    calls.push({
      start,
      end: closeParen + 1,
      name,
      objectSource: code.slice(cursor + 1, objectEnd - 1),
    })
  })
  return calls
}

export function parseStaticStringLiteral(source: string): string | null {
  const quote = source[0]
  if ((quote !== '"' && quote !== "'" && quote !== "`") || source.at(-1) !== quote) return null
  if (quote === "`" && source.includes("${")) return null

  let value = ""
  for (let cursor = 1; cursor < source.length - 1; cursor++) {
    const char = source[cursor]
    if (char !== "\\") {
      value += char
      continue
    }

    const escaped = source[++cursor]
    if (escaped === undefined) return null
    if (escaped === "n") value += "\n"
    else if (escaped === "r") value += "\r"
    else if (escaped === "t") value += "\t"
    else value += escaped
  }
  return value
}

export function applyTextReplacements(code: string, replacements: TextReplacement[]): string {
  let result = code
  for (const replacement of [...replacements].sort((a, b) => b.start - a.start)) {
    result = result.slice(0, replacement.start) + replacement.text + result.slice(replacement.end)
  }
  return result
}
