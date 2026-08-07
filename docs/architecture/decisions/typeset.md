---
id: adr-typeset-recipe-scopes
title: "Typeset and Prose Are Recipe Utility Scopes"
description: "Decision record for typography authoring without primitive or component ownership."
doc_type: decision
audience: "Solidiom maintainers, recipe authors, application authors"
tags: [typeset, prose, recipes, typography, architecture]
lifecycle: current
authority: canonical
volatility: low
date: 2026-08-03
last_updated: 2026-08-06
supersedes: docs/plans/typeset-plan.md (removed)
---

# Typeset and Prose Are Recipe Utility Scopes

## Decision

`typeset` and `prose` are canonical **recipe utility scopes**. They are not primitives and are not component catalog entries.

- `typeset` applies a granular typography scale to native elements.
- `prose` applies coordinated typography to a subtree of rendered content.
- Both belong in the canonical recipe contract and are generated for supported CSS, Tailwind, and UnoCSS profiles.
- Their source and generated output follow recipe parity, drift, export, and audit policy without being counted as source-owned components.

For implementation status and residual `RECIPE-008` work, see [consolidated-plan.md §4](../../plans/consolidated-plan.md#4-open-defects). This record intentionally contains no task status or command output.

## Context

Solidiom is behavior-first: primitives own interactive state, focus, keyboard behavior, ARIA wiring, and lifecycle. Standard text elements such as headings, paragraphs, and block quotes have no Solidiom runtime behavior. Wrapping them in a `Text` primitive would add component and props plumbing solely to manage presentation.

Typography is therefore a recipe concern. Native semantic HTML remains the authored structure, while recipes supply visual scale and composition.

“Zero runtime” has a narrow meaning here:

1. Typeset introduces no primitive runtime, signals, effects, event handlers, or reactive lifecycle.
2. The CSS profile can apply typography with attributes and stylesheets only.
3. Variant-free granular entries use static utility values rather than a variant function call.

The recipe packages may contain JavaScript for other recipes; this decision does not claim that every profile is globally JavaScript-free.

## Authoring contract

### Granular typeset

The granular scope covers heading levels and common text roles such as paragraph, lead, large, small, muted, blockquote, and inline code.

Authors keep semantic native elements and opt into a visual part:

```tsx
<h1 data-scope="typeset" data-part="heading-1">
  Welcome
</h1>
```

Profile implications:

- **CSS:** import the typeset stylesheet and author `data-scope="typeset"` plus the appropriate `data-part`. No JavaScript symbol is required.
- **Tailwind:** authors may use the exported, immutable `typeset` utility-string map on native elements. Because the entries have no variants, they are values such as `typeset.heading1`, not calls such as `heading1()`. The attribute-driven stylesheet form remains available where profile output supports it.
- **UnoCSS:** consume the generated typeset scope through the profile's normal generated stylesheet/preset contract. Do not create a parallel hand-authored typography definition.

If a granular role later gains meaningful variants, promote only that role to the profile's variant mechanism. Do not impose a runtime variant engine on every text element preemptively.

### Composite prose

`prose` formats a subtree of rendered Markdown or rich text without per-child utility classes:

```tsx
<article data-scope="prose" data-size="lg">
  {props.children}
</article>
```

The stable selector is `[data-scope="prose"]`, with native element descendants and an optional `sm | base | lg` size. There is no `.prose` selector and no `proseVariants()` API.

Rendered rich text must be sanitized through the application's content pipeline. This decision does not authorize assigning untrusted content directly to `innerHTML`.

## Rationale

### Keep native semantics

Typography recipes style native elements rather than replacing them. This preserves HTML meaning and avoids an abstraction that would own no behavior.

### Use attribute scoping

Attribute scopes match the repository's recipe contract, avoid global class ownership, and allow descendant element selectors for prose. A familiar `.prose` class was rejected because it would require an audit exception or a separate selector convention.

### Avoid a typography plugin dependency

The Tailwind profile owns its generated prose stylesheet instead of requiring `@tailwindcss/typography`. This preserves the no-mandatory-styling-dependency policy and keeps CSS, Tailwind, and UnoCSS outputs under one canonical contract.

### Generate all profiles from one contract

Typeset and prose must not exist as hand-authored side channels. Their semantic slots and selectors are declared once and emitted through the same machinery as other recipe scopes. Profile-specific syntax may differ; meaning, scope ownership, and supported parts must remain aligned.

## Tokens

Typography consumes each profile's existing semantic typography and color tokens. It must not invent a separate cross-profile token system.

- Prefer existing foreground, muted-foreground, sans, and mono semantics.
- CSS values may use `--ui-*` fallbacks so standalone stylesheets render without a theme.
- Add a new token only when a concrete design requirement cannot be represented by the existing contract.

## Catalog and architecture consequences

1. `typeset` and `prose` are excluded from primitive and component counts.
2. A recipe wrapper or stylesheet is not automatically a component; catalog classification follows ownership and behavior, not file shape.
3. Documentation should demonstrate both granular native-element styling and subtree prose styling in the maintained website.
4. Recipe audits must accept the semantic attribute selectors and native descendant selectors used here, while continuing to reject undeclared class/ID ownership.
5. Profile generation, exports, source mirrors, and docs examples remain subject to the normal recipe quality policy.

## Promotion rule

Plain text remains a recipe. Promote a specific element to a primitive only when it acquires real behavior that Solidiom must own—for example, accessible truncation with an expansion control or a code block with copy interaction. The new primitive owns that behavior; it does not convert the rest of typography into primitives.
