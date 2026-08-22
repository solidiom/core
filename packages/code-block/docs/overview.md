---
contentSchemaVersion: 1
title: Code Block
description: Syntax-highlighted code display with copy button and line numbers.
keywords: [code, block, syntax, highlight, copy, line numbers, clipboard]
locale: en
maturity: ga
product: Code Block
productLayer: primitive
status: draft
package: "@solidiom/code-block"
primitive: code-block
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Code Block is a syntax-highlighted code display with a copy button and line numbers. The CopyButton copies code to the clipboard, and Language displays the language label.

## Usage

Compose `Root`, `Pre`, `Code`, `LineNumbers`, `CopyButton`, `Header`, and `Language`.

```tsx
import * as CodeBlock from "@solidiom/code-block"

function Snippet() {
  return (
    <CodeBlock.Root>
      <CodeBlock.Header>
        <CodeBlock.Language>tsx</CodeBlock.Language>
        <CodeBlock.CopyButton>Copy</CodeBlock.CopyButton>
      </CodeBlock.Header>
      <CodeBlock.Pre>
        <CodeBlock.LineNumbers />
        <CodeBlock.Code>{`const x = 1;`}</CodeBlock.Code>
      </CodeBlock.Pre>
    </CodeBlock.Root>
  )
}
```

## Installation

Install the package with `pnpm add @solidiom/code-block`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

code-block exposes 7 parts:

- **Root** — `data-part="root"`. Container for the code display.
- **Pre** — `data-part="pre"`. Preformatted block wrapping the code.
- **Code** — `data-part="code"`. Holds the (syntax-highlighted) code content.
- **LineNumbers** — `data-part="linenumbers"`. Renders line numbers alongside the code.
- **CopyButton** — `data-part="copybutton"`. Copies the code to the clipboard.
- **Header** — `data-part="header"`. Header region for the language label and copy control.
- **Language** — `data-part="language"`. Displays the language label.

## Styling

code-block carries `data-scope="code-block"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

This primitive has no keyboard interaction of its own beyond the CopyButton, which copies the code to the clipboard when activated.

## Composition

Code Block composes within documentation, chat, and content surfaces to present formatted code with a copy affordance.

## SSR and hydration

Code Block renders static HTML on the server; the CopyButton activates its clipboard handler on hydration.
