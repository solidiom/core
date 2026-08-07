---
contentSchemaVersion: 1
title: "Accessible Interaction Contracts"
description: "How Solidiom defines, implements, and verifies keyboard and ARIA contracts for every primitive."
keywords: [accessibility, contracts, keyboard, aria, apg, testing, article]
locale: en
maturity: draft
product: "Solidiom"
productLayer: article
status: draft
date: "2026-08-07"
---

# Accessible Interaction Contracts

Every Solidiom primitive ships with a documented interaction contract. This article explains what that means and how we enforce it.

## What Is an Interaction Contract?

An interaction contract defines:

1. **Keyboard behavior** — which keys do what, in which states
2. **ARIA semantics** — which roles, states, and properties are applied
3. **Focus management** — where focus goes on open, close, and navigation
4. **Screen reader announcements** — what is communicated to assistive technology

These contracts are not aspirational documentation. They are machine-verified.

## Contract Structure

Each primitive has a contract file at `packages/<name>/docs/accessibility/contract.md` with:

```markdown
## Keyboard Interactions

| Key | Action |
|-----|--------|
| Enter/Space | Toggle accordion item |
| Arrow Down | Move focus to next item |
| Arrow Up | Move focus to previous item |
| Home | Move focus to first item |
| End | Move focus to last item |

## ARIA Attributes

| Attribute | Element | Value |
|-----------|---------|-------|
| role="region" | Content panel | — |
| aria-expanded | Trigger | true/false |
| aria-controls | Trigger | Panel ID |
| aria-labelledby | Panel | Trigger ID |
```

## Enforcement Layers

### 1. Automated (axe-core)

Every primitive is scanned by axe-core in a real browser. The scan verifies:

- No missing ARIA attributes
- No invalid role combinations
- No missing accessible names
- Correct heading hierarchy
- Color contrast (via theme audit)

### 2. Structural (TypeScript)

The `applySemanticAttrs` helper enforces that primitives apply data attributes consistently. TypeScript generics ensure the correct ARIA props are passed:

```tsx
// Compile error if required ARIA attributes are missing
<Dialog.Content aria-labelledby={titleId} aria-describedby={descId}>
```

### 3. Behavioral (Keyboard tests)

Browser tests simulate keyboard navigation and verify:

- Focus moves to the correct element
- Screen reader live regions update
- State transitions match the documented contract

### 4. Evidence (Committed artifacts)

`packages/<name>/docs/accessibility/evidence.json` records the latest scan results. The primitive catalog gate (`PRIM-000`) rejects any primitive where `passes === 0`.

## Why Contracts, Not Guidelines

Guidelines are suggestions. Contracts are enforced:

- A primitive cannot pass the catalog gate without evidence
- A recipe cannot ship without the underlying primitive's contract being met
- A template cannot declare a block dependency without that block's primitives being verified

This chain of verified dependencies means that when you install a Solidiom template, every interactive element in it has proven accessibility evidence.

## Limitations

- Contracts verify *structure*, not *experience* — a screen reader user's actual experience requires human testing
- VoiceOver is the only AT currently tested; NVDA/JAWS/TalkBack are Phase 4 work
- Dynamic content timing (e.g., toast auto-dismiss) has `incomplete` axe results, not violations
