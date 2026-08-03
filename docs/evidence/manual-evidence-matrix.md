---
id: manual-evidence-matrix
title: "Manual Accessibility Evidence Matrix"
doc_type: reference
audience: "Solidiom contributors, accessibility reviewers"
tags: [accessibility, manual-verification, evidence]
lifecycle: current
---

> **Purpose (A11Y-005):** Defines the seven manual verification dimensions that automated tooling (`docs/evidence/axe-scan-results.md`) cannot establish, and records completed manual passes per primitive. A primitive's authored accessibility contract (`packages/<name>/docs/{accessibility,es/accessibility}/contract.md`, rendered by `AccessibilityEvidence.astro`) states what it guarantees; this matrix is the evidence that each dimension of that guarantee was actually exercised by a human reviewer.

## Why a separate matrix from axe scanning

Automated axe-core scans (A11Y-001) reliably catch missing names, roles, and states, but cannot verify:

- Whether keyboard interaction actually matches the documented pattern end-to-end (axe checks static markup, not interaction sequences).
- Visual outcomes: zoom/reflow layout, color contrast in _styled_ consuming products (the isolated scan fixture has no recipe styling), and reduced-motion behavior.
- Real screen reader announcements (axe approximates the accessibility tree; it does not run VoiceOver/NVDA/JAWS/TalkBack).
- Touch target sizing and gesture behavior on real touch hardware.

## Dimensions

| Dimension          | What is verified                                                                                 | How                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| **Keyboard**       | Every documented key/behavior pair in the contract's `keyboard` field actually occurs            | Manual keyboard-only pass; see `docs/evidence/keyboard-audit-results.md` |
| **Focus**          | Focus moves, traps, and restores exactly as the contract's `focus` field states                  | Manual keyboard-only pass, tab order and focus-visible inspection        |
| **Zoom**           | Content reflows without loss of function or content up to 400% (WCAG 1.4.10)                     | Browser zoom to 400% at 1280px viewport width, no horizontal scroll      |
| **Contrast**       | Text and non-text contrast meet WCAG 1.4.3 / 1.4.11 in the primitive's default recipe styling    | Automated contrast checker against rendered, styled output               |
| **Reduced motion** | Animations respect `prefers-reduced-motion: reduce`                                              | OS/browser reduced-motion emulation, manual visual pass                  |
| **Screen readers** | Real AT announces role, name, state, and state changes as documented in `semantics`/`aria`       | VoiceOver (macOS/Safari) minimum; NVDA/JAWS/TalkBack tracked separately  |
| **Touch**          | Touch targets meet 24×24 CSS px minimum (WCAG 2.5.8) and gestures have a non-gesture alternative | Manual pass on a touch device or touch emulation                         |

Screen reader coverage beyond VoiceOver (NVDA, JAWS, TalkBack) and formal external audit sign-off remain Phase 4 work, consistent with `docs/evidence/axe-scan-results.md`'s "Out of scope" section and `docs/templates/at-verification-template.md`. Recording a VoiceOver pass here is a manual-evidence baseline, not a substitute for that later certification.

## Status legend

`✅` verified and passing · `⚠️` verified with a noted limitation · `—` not yet performed · `N/A` dimension does not apply to this primitive (see the contract's `nonApplicableCriteria`)

## Vertical-slice primitives (G2)

The G2 vertical slice requires Dialog, Combobox, and Data Table to satisfy the Primitive DoD, so these three are the first to carry a completed manual pass. Remaining primitives are populated incrementally as their contracts (A11Y-002) are authored; an empty row is `—` in every column, not a failing one.

| Primitive  | Keyboard | Focus | Zoom | Contrast | Reduced motion | Screen readers | Touch |
| ---------- | -------- | ----- | ---- | -------- | -------------- | -------------- | ----- |
| Dialog     | ✅       | ✅    | ✅   | ⚠️       | ✅             | ✅ VoiceOver   | ✅    |
| Combobox   | —        | —     | —    | —        | —              | —              | —     |
| Data Table | —        | —     | —    | —        | —              | —              | —     |

### Dialog — evidence detail

- **Keyboard**: Enter/Space activation, Escape dismissal, and Tab/Shift+Tab focus containment all match `packages/dialog/docs/accessibility/contract.md`. Cross-referenced against `docs/evidence/keyboard-audit-results.md` (Dialog: Focus Management ✅ Trap, Escape ✅ Close, Tab ✅ Within).
- **Focus**: Focus enters content on open and restores to the trigger on close; verified with a manual keyboard-only pass in Chromium 2026-07-29.
- **Zoom**: Reflows without lost content or function at 400% zoom, 1280px viewport, Chromium 2026-07-29.
- **Contrast**: ⚠️ Verified only against the unstyled/token-default recipe output shipped with `@solidiom/dialog`; a consuming product's own theme/recipe can change the result. Consumer responsibility is stated in the contract's `consumerDuties`.
- **Reduced motion**: Enter/exit transitions are suppressed under `prefers-reduced-motion: reduce`; verified with Chromium's reduced-motion emulation 2026-07-29.
- **Screen readers**: VoiceOver (macOS 15, Safari 18) announces the "dialog" role, connected title/description, and modal state on open; focus restoration to the trigger is announced on close. NVDA/JAWS/TalkBack are not yet recorded — tracked as a Phase 4 gap, not a Dialog-specific regression.
- **Touch**: Trigger and dismissal controls meet the 24×24 CSS px minimum target size in the default recipe; verified with touch emulation 2026-07-29.

## Full primitive matrix (A11Y-007)

Per-primitive automated evidence has been recorded via axe-core scans (`artifacts/axe-results.json`, `artifacts/a11y-evidence.json`). Manual verification dimensions beyond keyboard are tracked as Phase 4 work. Per-primitive AT verification records are available in `docs/at-audit-results/`.

| Primitive         | Keyboard | Focus | Zoom | Contrast | Reduced motion | Screen readers | Touch |
| ----------------- | -------- | ----- | ---- | -------- | -------------- | -------------- | ----- |
| accordion         | ✅       | ✅    | —    | —        | —              | —              | —     |
| alert             | ✅       | ✅    | —    | —        | —              | —              | —     |
| alert-dialog      | ✅       | ✅    | —    | —        | —              | —              | —     |
| avatar            | N/A      | N/A   | —    | —        | —              | —              | —     |
| badge             | N/A      | N/A   | —    | —        | —              | —              | —     |
| breadcrumb        | ✅       | ✅    | —    | —        | —              | —              | —     |
| button            | ✅       | ✅    | —    | —        | —              | —              | —     |
| calendar          | ✅       | ✅    | —    | —        | —              | —              | —     |
| card              | N/A      | N/A   | —    | —        | —              | —              | —     |
| carousel          | ✅       | ✅    | —    | —        | —              | —              | —     |
| checkbox          | ✅       | ✅    | —    | —        | —              | —              | —     |
| collapsible       | ✅       | ✅    | —    | —        | —              | —              | —     |
| combobox          | ✅       | ✅    | —    | —        | —              | —              | —     |
| command-palette   | ✅       | ✅    | —    | —        | —              | —              | —     |
| context-menu      | ✅       | ✅    | —    | —        | —              | —              | —     |
| data-table        | ✅       | ✅    | —    | —        | —              | —              | —     |
| date-picker       | ✅       | ✅    | —    | —        | —              | —              | —     |
| dialog            | ✅       | ✅    | ✅   | ⚠️       | ✅             | ✅ VoiceOver   | ✅    |
| drawer            | ✅       | ✅    | —    | —        | —              | —              | —     |
| empty-state       | N/A      | N/A   | —    | —        | —              | —              | —     |
| field             | ✅       | ✅    | —    | —        | —              | —              | —     |
| hover-card        | ✅       | ✅    | —    | —        | —              | —              | —     |
| input             | ✅       | ✅    | —    | —        | —              | —              | —     |
| input-otp         | ✅       | ✅    | —    | —        | —              | —              | —     |
| kbd               | N/A      | N/A   | —    | —        | —              | —              | —     |
| label             | N/A      | N/A   | —    | —        | —              | —              | —     |
| listbox           | ✅       | ✅    | —    | —        | —              | —              | —     |
| menu              | ✅       | ✅    | —    | —        | —              | —              | —     |
| meter             | N/A      | N/A   | —    | —        | —              | —              | —     |
| navigation-menu   | ✅       | ✅    | —    | —        | —              | —              | —     |
| pagination        | ✅       | ✅    | —    | —        | —              | —              | —     |
| popover           | ✅       | ✅    | —    | —        | —              | —              | —     |
| progress          | N/A      | N/A   | —    | —        | —              | —              | —     |
| radio-group       | ✅       | ✅    | —    | —        | —              | —              | —     |
| resizable-panels  | ✅       | ✅    | —    | —        | —              | —              | —     |
| scroll-area       | ✅       | ✅    | —    | —        | —              | —              | —     |
| select            | ✅       | ✅    | —    | —        | —              | —              | —     |
| separator         | N/A      | N/A   | —    | —        | —              | —              | —     |
| sheet             | ✅       | ✅    | —    | —        | —              | —              | —     |
| skeleton          | N/A      | N/A   | —    | —        | —              | —              | —     |
| slider            | ✅       | ✅    | —    | —        | —              | —              | —     |
| spinner           | N/A      | N/A   | —    | —        | —              | —              | —     |
| switch            | ✅       | ✅    | —    | —        | —              | —              | —     |
| tabs              | ✅       | ✅    | —    | —        | —              | —              | —     |
| toast             | ✅       | ✅    | —    | —        | —              | —              | —     |
| toggle            | ✅       | ✅    | —    | —        | —              | —              | —     |
| toggle-group      | ✅       | ✅    | —    | —        | —              | —              | —     |
| toolbar           | ✅       | ✅    | —    | —        | —              | —              | —     |
| tooltip           | N/A      | ✅    | —    | —        | —              | —              | —     |
| tree              | ✅       | ✅    | —    | —        | —              | —              | —     |
| virtual-list      | ✅       | ✅    | —    | —        | —              | —              | —     |
| visually-hidden   | N/A      | N/A   | —    | —        | —              | —              | —     |

### Evidence sources

- **Keyboard / Focus**: Derived from `docs/keyboard-audit-results.md` manual audit (2026-07-23). Primitives marked `N/A` have no keyboard interaction (non-interactive presentation primitives).
- **Automated axe**: All 52 primitives pass axe-core with 0 violations. Per-primitive evidence IDs in `artifacts/a11y-evidence.json`.
- **Dialog**: Extended manual evidence from G2 vertical slice (see section above).

## Updating this matrix

1. Perform the manual pass for the dimension using the method in the Dimensions table.
2. Update the primitive's row above and add an evidence-detail subsection following the Dialog example, including the date and environment.
3. If a dimension does not apply to the primitive, record it as `N/A` here and add the rationale to the primitive's contract `nonApplicableCriteria` (`apps/site/src/lib/accessibility-contract.ts`) rather than only in this document, so the renderer and this matrix stay consistent.