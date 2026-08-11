---
contentSchemaVersion: 1
title: "Accessibility"
description: "Solidiom's accessibility commitment, evidence, and compliance status."
keywords: [accessibility, wcag, a11y, aria, apg, screen-reader]
locale: es
maturity: draft
product: "Solidiom"
productLayer: page
status: draft
translationSourceHash: "66ae67ab4432320a7af3ba4cb90556045827359176208480ce13836b3501fa25"
translationStatus: draft
---

# Accessibility

Solidiom is built on the principle that accessible software is not optional. Every primitive, component, and template is designed and tested against WCAG 2.2 Level AA and WAI-ARIA Authoring Practices Guide (APG) patterns.

## Our Commitment

- Every interactive primitive implements the corresponding APG keyboard and ARIA pattern
- Every primitive ships with committed accessibility evidence (`evidence.json`)
- Every theme preset passes AA contrast minimums in both light and dark modes
- Automated axe-core scans run on every build for all 52 primitives
- Keyboard navigation is documented and tested for every interactive element

## Evidence

Our accessibility evidence is machine-verified and committed to the repository:

### Automated Testing

| Layer               | Coverage     | Tool            | Evidence                         |
| ------------------- | ------------ | --------------- | -------------------------------- |
| Primitives (52)     | 100%         | axe-core 4.10.2 | `docs/axe-scan-results.md`       |
| Keyboard navigation | 100%         | Manual audit    | `docs/keyboard-audit-results.md` |
| Color contrast      | All presets  | Theme audit     | `pnpm run audit:preset-themes`   |
| Focus management    | All overlays | Vitest browser  | Per-primitive evidence           |

### Per-Primitive Evidence

Each of the 52 primitives has a committed `packages/<name>/docs/accessibility/evidence.json` containing:

- axe-core scan results (violations, passes, incomplete)
- Keyboard navigation contract
- ARIA attributes and roles used
- Screen reader behavior expectations

### Screen Reader Testing

| Assistive Technology | Status            | Platform  |
| -------------------- | ----------------- | --------- |
| VoiceOver            | Documented        | macOS/iOS |
| NVDA                 | Planned (Phase 4) | Windows   |
| JAWS                 | Planned (Phase 4) | Windows   |
| TalkBack             | Planned (Phase 4) | Android   |

## WCAG 2.2 AA Compliance

All primitives and components comply with WCAG 2.2 Level AA. Our full audit is documented at `docs/qa/wcag-2.2-aa-audit.md` and covers:

- **Perceivable** — semantic HTML, ARIA roles, 4.5:1+ text contrast, `rem` typography
- **Operable** — full keyboard navigation, no traps, visible focus, 24px+ targets
- **Understandable** — `lang` attributes, no unexpected changes, labeled inputs
- **Robust** — valid ARIA, live regions for dynamic content

## APG Pattern Compliance

Interactive primitives implement WAI-ARIA Authoring Practices patterns:

| Pattern        | Primitives                        |
| -------------- | --------------------------------- |
| Accordion      | accordion                         |
| Dialog (Modal) | dialog, alert-dialog              |
| Menu/Menubar   | menu, context-menu, dropdown-menu |
| Tabs           | tabs                              |
| Combobox       | combobox, select                  |
| Listbox        | listbox, select                   |
| Tooltip        | tooltip                           |
| Switch         | switch                            |
| Slider         | slider                            |
| Tree View      | tree                              |
| Alert          | alert, toast                      |

## Reporting Issues

If you encounter an accessibility barrier in Solidiom:

1. Open a GitHub issue with the `accessibility` label
2. Include the primitive/component affected
3. Describe the barrier and the assistive technology used
4. We prioritize accessibility issues as critical bugs

## Resources

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Our full WCAG audit](/docs/qa/wcag-2.2-aa-audit.md)
