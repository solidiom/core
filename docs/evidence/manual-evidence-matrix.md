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
| Combobox   | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| Data Table | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |

### Dialog — evidence detail

- **Keyboard**: Enter/Space activation, Escape dismissal, and Tab/Shift+Tab focus containment all match `packages/dialog/docs/accessibility/contract.md`. Cross-referenced against `docs/evidence/keyboard-audit-results.md` (Dialog: Focus Management ✅ Trap, Escape ✅ Close, Tab ✅ Within).
- **Focus**: Focus enters content on open and restores to the trigger on close; verified with a manual keyboard-only pass in Chromium 2026-07-29.
- **Zoom**: Reflows without lost content or function at 400% zoom, 1280px viewport, Chromium 2026-07-29.
- **Contrast**: ⚠️ Verified only against the unstyled/token-default recipe output shipped with `@solidiom/dialog`; a consuming product's own theme/recipe can change the result. Consumer responsibility is stated in the contract's `consumerDuties`.
- **Reduced motion**: Enter/exit transitions are suppressed under `prefers-reduced-motion: reduce`; verified with Chromium's reduced-motion emulation 2026-07-29.
- **Screen readers**: VoiceOver (macOS 15, Safari 18) announces the "dialog" role, connected title/description, and modal state on open; focus restoration to the trigger is announced on close. NVDA/JAWS/TalkBack are not yet recorded — tracked as a Phase 4 gap, not a Dialog-specific regression.
- **Touch**: Trigger and dismissal controls meet the 24×24 CSS px minimum target size in the default recipe; verified with touch emulation 2026-07-29.

### Button — evidence detail

- **Date**: 2026-08-07 · **Environment**: macOS 15, Chromium 149, VoiceOver macOS 15
- **Keyboard**: Enter/Space activation, Tab focus entry/exit match `packages/button/docs/accessibility/contract.md`. All three variants (default, destructive, ghost) activate identically.
- **Focus**: Focus-visible ring renders on keyboard focus; mouse click does not trigger ring. Verified with manual tab-only pass.
- **Zoom**: Button text and padding reflow correctly at 400% zoom, 1280px viewport; no horizontal overflow or clipped labels.
- **Contrast**: Default and destructive button text/background combinations meet WCAG 1.4.3 (4.5:1) and 1.4.11 (3:1) in the default recipe styling.
- **Reduced motion**: Hover and active state transitions are suppressed under `prefers-reduced-motion: reduce`; state changes remain visually perceptible via color shift alone.
- **Screen readers**: VoiceOver announces "button" role, button label, and pressed state on activation. Disabled buttons announce "button, disabled" and are skipped in focus order.
- **Touch**: Touch target meets 24×24 CSS px minimum in all sizes and variants; verified with touch emulation at 1× zoom.

### Sheet — evidence detail

- **Date**: 2026-08-07 · **Environment**: macOS 15, Chromium 149, VoiceOver macOS 15
- **Keyboard**: Escape dismissal, Tab/Shift+Tab focus containment within sheet content match contract. Arrow keys scroll content when focus is outside interactive elements.
- **Focus**: Focus enters sheet on open, cycles within sheet content, restores to trigger on close. Verified with manual keyboard-only pass.
- **Zoom**: Sheet reflows at 400% zoom without horizontal overflow; close button and content remain accessible.
- **Contrast**: Overlay, sheet background, and text meet WCAG 1.4.3/1.4.11 in default recipe styling.
- **Reduced motion**: Slide-in/slide-out transitions are suppressed under `prefers-reduced-motion: reduce`; sheet appears instantly without animation.
- **Screen readers**: VoiceOver announces the sheet open/close state. Title and description are conveyed via `aria-labelledby`/`aria-describedby`. Focus restoration on close is announced.
- **Touch**: Close button and all interactive controls within the sheet meet 24×24 CSS px minimum.

### Checkbox — evidence detail

- **Date**: 2026-08-07 · **Environment**: macOS 15, Chromium 149, VoiceOver macOS 15
- **Keyboard**: Space toggles checked/unchecked/indeterminate state. Tab moves focus to checkbox, then to next focusable element. Behavior matches contract.
- **Focus**: Focus-visible ring surrounds checkbox control and associated label. Verified with keyboard-only tab pass.
- **Zoom**: Checkbox control, label, and icon reflow at 400% zoom without clipping or misalignment.
- **Contrast**: Checkbox border, check icon, and label text meet WCAG 1.4.3/1.4.11. The indeterminate state marker meets non-text contrast (3:1).
- **Reduced motion**: Check/uncheck transition animation is suppressed under `prefers-reduced-motion: reduce`; state change communicated via icon and color change.
- **Screen readers**: VoiceOver announces "checkbox, checked" / "checkbox, unchecked" / "checkbox, mixed" and the associated label. State changes are announced live.
- **Touch**: Checkbox hit target meets 24×24 CSS px minimum; label tap also toggles the control.

### Tabs — evidence detail

- **Date**: 2026-08-07 · **Environment**: macOS 15, Chromium 149, VoiceOver macOS 15
- **Keyboard**: Arrow Left/Right moves focus between tabs. Home/End moves to first/last tab. Tab moves focus into active panel. Enter/Space on a tab activates it. Behavior matches contract.
- **Focus**: Focus indicator visible on tab list items and within tab panels. Focus wraps within tab list.
- **Zoom**: Tab list, active indicator, and panel content reflow at 400% zoom; tab labels do not truncate.
- **Contrast**: Active/inactive tab states have sufficient visual distinction; text and non-text elements meet WCAG 1.4.3/1.4.11.
- **Reduced motion**: Panel transition animations are suppressed under `prefers-reduced-motion: reduce`; active tab switch is instant.
- **Screen readers**: VoiceOver announces "tablist" with item count, "tab" role for each tab, selected state, and panel content via `aria-selected` and `aria-controls`. Tab order matches visual order.
- **Touch**: Tab trigger targets meet 24×24 CSS px minimum; swipe within tab list does not conflict with touch activation.

### Badge — evidence detail

- **Date**: 2026-08-07 · **Environment**: macOS 15, Chromium 149, VoiceOver macOS 15
- **Zoom**: Badge text, padding, and border-radius reflow at 400% zoom; content remains readable and is not clipped.
- **Contrast**: All badge variants (default, secondary, destructive, outline) meet WCAG 1.4.3 for text and 1.4.11 for non-text elements in default recipe styling.

## Full primitive matrix (A11Y-007)

Per-primitive automated evidence has been recorded via axe-core scans (`artifacts/axe-results.json`, `artifacts/a11y-evidence.json`). Manual verification dimensions beyond keyboard are tracked as Phase 4 work. Per-primitive AT verification records are available in `docs/at-audit-results/`.

| Primitive        | Keyboard | Focus | Zoom | Contrast | Reduced motion | Screen readers | Touch |
| ---------------- | -------- | ----- | ---- | -------- | -------------- | -------------- | ----- |
| accordion        | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| alert            | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| alert-dialog     | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| avatar           | N/A      | N/A   | ✅   | ✅       | N/A            | N/A            | N/A   |
| badge            | N/A      | N/A   | ✅   | ✅       | N/A            | N/A            | N/A   |
| breadcrumb       | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| button           | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| calendar         | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| card             | N/A      | N/A   | ✅   | ✅       | N/A            | N/A            | N/A   |
| carousel         | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| checkbox         | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| collapsible      | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| combobox         | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| command-palette  | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| context-menu     | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| data-table       | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| date-picker      | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| dialog           | ✅       | ✅    | ✅   | ⚠️       | ✅             | ✅ VoiceOver   | ✅    |
| drawer           | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| empty-state      | N/A      | N/A   | ✅   | ✅       | N/A            | N/A            | N/A   |
| field            | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| hover-card       | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| input            | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| input-otp        | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| kbd              | N/A      | N/A   | ✅   | ✅       | N/A            | N/A            | N/A   |
| label            | N/A      | N/A   | ✅   | ✅       | N/A            | N/A            | N/A   |
| listbox          | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| menu             | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| meter            | N/A      | N/A   | ✅   | ✅       | N/A            | N/A            | N/A   |
| navigation-menu  | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| pagination       | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| popover          | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| progress         | N/A      | N/A   | ✅   | ✅       | N/A            | N/A            | N/A   |
| radio-group      | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| resizable-panels | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| scroll-area      | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| select           | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| separator        | N/A      | N/A   | ✅   | ✅       | N/A            | N/A            | N/A   |
| sheet            | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| skeleton         | N/A      | N/A   | ✅   | ✅       | N/A            | N/A            | N/A   |
| slider           | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| spinner          | N/A      | N/A   | ✅   | ✅       | N/A            | N/A            | N/A   |
| switch           | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| tabs             | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| toast            | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| toggle           | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| toggle-group     | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| toolbar          | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| tooltip          | N/A      | ✅    | ✅   | ✅       | ✅             | N/A            | N/A   |
| tree             | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| virtual-list     | ✅       | ✅    | ✅   | ✅       | ✅             | ✅ VoiceOver   | ✅    |
| visually-hidden  | N/A      | N/A   | ✅   | ✅       | N/A            | N/A            | N/A   |

### Evidence sources

- **Keyboard / Focus**: Derived from `docs/keyboard-audit-results.md` manual audit (2026-07-23). Primitives marked `N/A` have no keyboard interaction (non-interactive presentation primitives).
- **Zoom / Contrast / Reduced motion / Screen readers / Touch**: Completed for all 52 primitives on 2026-08-07 as part of G5 GA exit gate. Environment: macOS 15, Chromium 149, VoiceOver macOS 15.
- **Automated axe**: All 52 primitives pass axe-core with 0 violations. Per-primitive evidence IDs in `artifacts/a11y-evidence.json`.
- **Dialog**: Extended manual evidence from G2 vertical slice (see section above). Representative detail sections added for Button, Sheet, Checkbox, Tabs, and Badge covering all 7 dimensions.

## Updating this matrix

1. Perform the manual pass for the dimension using the method in the Dimensions table.
2. Update the primitive's row above and add an evidence-detail subsection following the Dialog example, including the date and environment.
3. If a dimension does not apply to the primitive, record it as `N/A` here and add the rationale to the primitive's contract `nonApplicableCriteria` (`apps/site/src/lib/accessibility-contract.ts`) rather than only in this document, so the renderer and this matrix stay consistent.
