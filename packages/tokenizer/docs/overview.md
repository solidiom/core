---
contentSchemaVersion: 1
title: Tokenizer
description: Tag/token input for managing multiple values with keyboard support.
keywords: [tokenizer, tags, tokens, input, roving focus, paste, multi-value]
locale: en
maturity: ga
product: Tokenizer
productLayer: primitive
status: draft
package: "@solidiom/tokenizer"
primitive: tokenizer
section: overview
notApplicable:
  - section: migration
    reason: No prior API; this is the first shipped version.
  - section: testing
    reason: Standard testing guidance covers this primitive.
---

Tokenizer is a tag/token input for managing multiple values with keyboard support. It provides roving focus across tokens, paste support, selection state, duplicate prevention, max limit enforcement, and form participation.

## Usage

Compose `Root`, `Token`, `TokenRemove`, and `Input`. Each `Token` represents a value with a `TokenRemove` control, and `Input` accepts new entries.

```tsx
import * as Tokenizer from "@solidiom/tokenizer"

;<Tokenizer.Root>
  <Tokenizer.Token>
    design
    <Tokenizer.TokenRemove>×</Tokenizer.TokenRemove>
  </Tokenizer.Token>
  <Tokenizer.Input />
</Tokenizer.Root>
```

## Installation

Install the package with `pnpm add @solidiom/tokenizer`. The package requires compatible `solid-js` and `@solidjs/web` peer dependencies.

## Parts

tokenizer exposes 4 parts:

- **Root** — the container managing tokens, selection, duplicate prevention, max limit, and form participation.
- **Token** — a single token representing a value.
- **TokenRemove** — the control that removes its token.
- **Input** — the field for typing new tokens, with paste support.

## Styling

tokenizer carries `data-scope="tokenizer"` and `data-part` attributes on each part for CSS/recipe targeting.

## Keyboard & behavior

tokenizer supports roving focus across tokens, paste, selection state, duplicate prevention, and max limit enforcement.

| Key           | Behavior                          |
| ------------- | --------------------------------- |
| Enter / comma | Add a token                       |
| Backspace     | Remove the last token             |
| Arrow keys    | Move across tokens (roving focus) |

## Composition

Compose with label and field primitives to build a labeled multi-value control; form participation is handled by the Root.

## SSR and hydration

Existing tokens render as static HTML on the server and participate in native forms; roving focus, paste, and add/remove handlers activate on hydration.
